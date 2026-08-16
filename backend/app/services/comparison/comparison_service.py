import asyncio
import logging
import re
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.models.document import Document
from app.models.document_page import DocumentPage
from app.schemas.comparison import (
    ComparisonAttribute,
    ComparisonCell,
    ComparisonCitation,
    ComparisonRequest,
    ComparisonResult,
    ComparisonSummary,
    DrugInfo,
)
from app.services.chat.citation_mapper import CitationMapper
from app.services.chat.evidence_context_builder import EvidenceContextBuilder
from app.services.llm.llm_service import LLMService
from app.services.retrieval.semantic_search_service import SemanticSearchService

logger = logging.getLogger(__name__)

ATTRIBUTE_LABELS: List[Tuple[str, str]] = [
    ("indications", "Indications"),
    ("dosage_administration", "Dosage & Administration"),
    ("warnings", "Warnings"),
    ("contraindications", "Contraindications"),
    ("drug_interactions", "Drug Interactions"),
    ("adverse_reactions", "Adverse Reactions"),
    ("use_in_specific_populations", "Use in Specific Populations"),
    ("pregnancy", "Pregnancy"),
    ("pediatric_use", "Pediatric Use"),
    ("geriatric_use", "Geriatric Use"),
    ("renal_impairment", "Renal Impairment"),
    ("hepatic_impairment", "Hepatic Impairment"),
    ("storage", "Storage"),
]

WARNING_KEYS = {"warnings", "contraindications", "pregnancy"}
HIGHLIGHT_KEYS = {"dosage_administration"}


class ComparisonInputError(Exception):
    """Raised for invalid comparison requests (maps to an HTTPException in the route)."""

    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ComparisonService:
    """Generates side-by-side drug-label comparisons using the existing RAG pipeline."""

    def __init__(
        self,
        search_service: Optional[SemanticSearchService] = None,
        context_builder: Optional[EvidenceContextBuilder] = None,
        llm_service: Optional[LLMService] = None,
        citation_mapper: Optional[CitationMapper] = None,
    ):
        self.search_service = search_service or SemanticSearchService()
        self.context_builder = context_builder or EvidenceContextBuilder()
        self.llm_service = llm_service or LLMService()
        self.citation_mapper = citation_mapper or CitationMapper()

    async def compare(self, request: ComparisonRequest, db: AsyncSession) -> ComparisonResult:
        drug1_id = request.drug1_id
        drug2_id = request.drug2_id

        if drug1_id == drug2_id:
            raise ComparisonInputError(
                "Cannot compare the same document with itself.",
                status_code=400,
            )

        result = await db.execute(
            select(Document).where(Document.document_id.in_([drug1_id, drug2_id]))
        )
        docs = {d.document_id: d for d in result.scalars().all()}

        for doc_id in (drug1_id, drug2_id):
            if doc_id not in docs:
                raise ComparisonInputError(
                    f"Document not found: {doc_id}",
                    status_code=404,
                )

        for doc_id, doc in docs.items():
            if doc.status not in ("completed", "ready"):
                raise ComparisonInputError(
                    f"Document is not ready for comparison: {doc_id}",
                    status_code=409,
                )

        drug1_info = await self._build_drug_info(db, docs[drug1_id])
        drug2_info = await self._build_drug_info(db, docs[drug2_id])

        attributes: List[ComparisonAttribute] = []
        for key, label in ATTRIBUTE_LABELS:
            drug1_cell, drug2_cell = await self._compare_attribute(
                key,
                label,
                drug1_id,
                drug2_id,
                drug1_info.name,
                drug2_info.name,
            )
            attributes.append(
                ComparisonAttribute(
                    key=key,
                    label=label,
                    drug1=drug1_cell,
                    drug2=drug2_cell,
                )
            )

        summary = self._build_summary(attributes)

        return ComparisonResult(
            drug1=drug1_info,
            drug2=drug2_info,
            attributes=attributes,
            summary=summary,
        )

    @staticmethod
    def _build_summary(attributes: List[ComparisonAttribute]) -> ComparisonSummary:
        all_cells = [cell for attr in attributes for cell in (attr.drug1, attr.drug2)]
        statuses = [cell.status for cell in all_cells]

        return ComparisonSummary(
            total_attributes=len(attributes),
            warning_count=statuses.count("warning"),
            highlight_count=statuses.count("highlight"),
            unavailable_count=statuses.count("unavailable"),
            both_unavailable_count=sum(
                1 for attr in attributes if attr.drug1.status == "unavailable" and attr.drug2.status == "unavailable"
            ),
        )

    async def _build_drug_info(self, db: AsyncSession, doc: Document) -> DrugInfo:
        page_count_result = await db.execute(
            select(func.count())
            .select_from(DocumentPage)
            .where(DocumentPage.document_id == doc.document_id)
        )
        page_count = page_count_result.scalar() or 0
        name = doc.source or doc.file_name

        return DrugInfo(
            id=doc.document_id,
            name=name,
            document_name=doc.file_name,
            page_count=page_count,
        )

    async def _compare_attribute(
        self,
        key: str,
        label: str,
        drug1_id: str,
        drug2_id: str,
        drug1_name: str,
        drug2_name: str,
    ) -> Tuple[ComparisonCell, ComparisonCell]:
        results1, results2 = await asyncio.gather(
            self.search_service.search(
                query=label,
                top_k=3,
                document_ids=[drug1_id],
                score_threshold=settings.MIN_RELEVANCE_SCORE,
            ),
            self.search_service.search(
                query=label,
                top_k=3,
                document_ids=[drug2_id],
                score_threshold=settings.MIN_RELEVANCE_SCORE,
            ),
        )

        unavailable_cell = ComparisonCell(
            content="Not available in source document.",
            citations=[],
            status="unavailable",
        )

        if not results1 and not results2:
            return unavailable_cell, unavailable_cell

        evidence = []
        if results1:
            evidence.extend(results1)
        if results2:
            evidence.extend(results2)

        context, citation_map = self.context_builder.build(evidence)
        prompt = self._build_prompt(label, drug1_name, drug2_name, context)

        try:
            answer = self.llm_service.generate(
                prompt,
                max_new_tokens=256,
                temperature=0.1,
            )
        except Exception as exc:
            logger.warning("LLM generation failed for section '%s': %s", key, exc)
            return unavailable_cell, unavailable_cell

        drug1_text, drug2_text = self._split_answer(answer)

        if not drug1_text.strip():
            drug1_text = "Not available in source document."
        if not drug2_text.strip():
            drug2_text = "Not available in source document."

        cell1 = self._build_cell(drug1_text, citation_map, key)
        cell2 = self._build_cell(drug2_text, citation_map, key)

        return cell1, cell2

    @staticmethod
    def _build_prompt(
        label: str,
        drug1_name: str,
        drug2_name: str,
        context: str,
    ) -> str:
        return (
            "You are MediMei, a clinical assistant. Compare one section of two drug-label documents. "
            "Use ONLY the evidence below. Do not use outside knowledge or invent facts. "
            "Do not infer unsupported dosage information. "
            "Cite relevant sources using [S1], [S2], etc. Do not fabricate citations. "
            "If the evidence does not contain information for a drug, write exactly: "
            "'Not available in source document.' for that drug.\n\n"
            f"Section: {label}\n"
            f"Drug 1: {drug1_name}\n"
            f"Drug 2: {drug2_name}\n\n"
            "=== Evidence ===\n"
            f"{context}\n\n"
            "=== Answer format ===\n"
            "DRUG1: <summary with citations>\n"
            "DRUG2: <summary with citations>\n\n"
            "=== Answer ===\n"
        )

    @staticmethod
    def _split_answer(answer: str) -> Tuple[str, str]:
        answer = answer.strip()

        drug1_match = re.search(
            r"DRUG1:\s*(.*?)(?=DRUG2:|$)",
            answer,
            re.DOTALL | re.IGNORECASE,
        )
        drug2_match = re.search(
            r"DRUG2:\s*(.*?)(?=DRUG1:|$)",
            answer,
            re.DOTALL | re.IGNORECASE,
        )

        drug1 = drug1_match.group(1).strip() if drug1_match else ""
        drug2 = drug2_match.group(1).strip() if drug2_match else ""

        if not drug1 and not drug2:
            drug1_match = re.search(
                r"Drug\s*1:\s*(.*?)(?=Drug\s*2:|$)",
                answer,
                re.DOTALL | re.IGNORECASE,
            )
            drug2_match = re.search(
                r"Drug\s*2:\s*(.*?)(?=Drug\s*1:|$)",
                answer,
                re.DOTALL | re.IGNORECASE,
            )
            drug1 = drug1_match.group(1).strip() if drug1_match else ""
            drug2 = drug2_match.group(1).strip() if drug2_match else ""

        return drug1, drug2

    def _build_cell(
        self,
        text: str,
        citation_map: Dict[str, Dict[str, Any]],
        key: str,
    ) -> ComparisonCell:
        if "not available in source document" in text.lower():
            return ComparisonCell(
                content="Not available in source document.",
                citations=[],
                status="unavailable",
            )

        cleaned, citations, invalid = self.citation_mapper.extract_citations(
            text,
            citation_map,
        )

        if not cleaned:
            return ComparisonCell(
                content="Not available in source document.",
                citations=[],
                status="unavailable",
            )

        if invalid:
            logger.warning("Invalid citation markers in comparison answer: %s", invalid)

        comp_citations = [
            ComparisonCitation(
                citation_id=str(cit.get("chunk_id") or cit.get("citation_id", "")),
                document_id=cit.get("document_id"),
                document_name=cit.get("document_name"),
                page=cit.get("page_no") or 0,
                section=cit.get("section_title") or cit.get("section"),
                text=cit.get("text") or cit.get("chunk_text"),
                score=cit.get("score"),
            )
            for cit in citations
        ]

        status = "warning" if key in WARNING_KEYS else ("highlight" if key in HIGHLIGHT_KEYS else "normal")

        return ComparisonCell(
            content=cleaned,
            citations=comp_citations,
            status=status,
        )
