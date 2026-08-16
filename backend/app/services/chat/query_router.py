import re
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class QueryRouter:
    """
    Classifies user queries into clinical categories (dosage, warnings, indications, etc.)
    and maps these categories to standard document section names for retrieval boosting.
    """

    # Keyword mappings to clinical categories
    CATEGORY_KEYWORDS = {
        "dosage": [
            r"\bdosage\b", r"\bdose\b", r"\bdosing\b", r"\badministration\b", 
            r"\badminister\b", r"\bfrequency\b", r"\bhow\s+often\b", r"\bhow\s+much\b",
            r"\bmg\b", r"\bmcg\b", r"\bml\b", r"\bmL\b", r"\bquantity\b", r"\bintake\b"
        ],
        "warnings": [
            r"\bwarning\b", r"\bwarning[s]\b", r"\bprecaution[s]\b", r"\bboxed\b",
            r"\bbox\b", r"\bblack\s+box\b", r"\brisk[s]\b", r"\bdanger[s]\b", 
            r"\bsafety\b", r"\bserious\b", r"\bmonitoring\b"
        ],
        "indications": [
            r"\bindication[s]\b", r"\bindicate[d]\b", r"\bprescribe[d]\s+for\b", 
            r"\bused\s+for\b", r"\btreat\b", r"\btreatment\b", r"\btherapy\b", r"\bintended\b"
        ],
        "contraindications": [
            r"\bcontraindication[s]\b", r"\bcontraindicate[d]\b", r"\bshould\s+not\s+take\b",
            r"\bmust\s+not\s+use\b", r"\bavoid\b", r"\bwho\s+should\s+not\b", r"\ballergy\b"
        ],
        "interactions": [
            r"\binteraction[s]\b", r"\binteract\b", r"\bdrug\s+interaction[s]\b", 
            r"\bco-administration\b", r"\btaken\s+with\b", r"\bcombination\b", r"\bwith\s+other\b"
        ],
        "adverse_reactions": [
            r"\bside\s+effect[s]\b", r"\badverse\s+reaction[s]\b", r"\badverse\s+event[s]\b", 
            r"\breaction[s]\b", r"\bsymptom[s]\b", r"\bproblem[s]\b"
        ],
        "pregnancy": [
            r"\bpregnancy\b", r"\bpregnant\b", r"\blactation\b", r"\bbreastfeeding\b", 
            r"\bnursing\b", r"\bunborn\b", r"\bfetus\b", r"\bgestational\b"
        ],
        "pediatric": [
            r"\bpediatric[s]\b", r"\bchild\b", r"\bchildren\b", r"\binfant[s]\b", 
            r"\badolescent[s]\b", r"\byouth\b", r"\bkid[s]\b"
        ],
        "geriatric": [
            r"\bgeriatric[s]\b", r"\belderly\b", r"\bolder\b", r"\bsenior[s]\b", 
            r"\bage\s+65\b"
        ],
        "storage": [
            r"\bstorage\b", r"\bstore\b", r"\btemperature\b", r"\bfreeze\b", 
            r"\bkeep\b", r"\bcontainer\b", r"\bpreserve\b"
        ],
        "overdose": [
            r"\boverdose\b", r"\boverdosage\b", r"\btoo\s+much\b", r"\btoxicity\b",
            r"\bpoisoning\b"
        ],
        "comparison": [
            r"\bcompare\b", r"\bversus\b", r"\bvs\b", r"\bdifference\b", 
            r"\bbetter\b", r"\bsimilar\b"
        ]
    }

    # Category to standard document sections
    CATEGORY_TO_SECTIONS = {
        "dosage": ["dosage and administration", "dosage", "dosing", "administration"],
        "warnings": ["warnings and precautions", "warnings", "precautions", "boxed warning", "box warning"],
        "indications": ["indications and usage", "indications", "usage", "indicated"],
        "contraindications": ["contraindications", "contraindication"],
        "interactions": ["drug interactions", "interactions", "interaction"],
        "adverse_reactions": ["adverse reactions", "adverse events", "side effects", "side effect"],
        "pregnancy": ["pregnancy", "lactation", "nursing mothers", "use in specific populations"],
        "pediatric": ["pediatric use", "pediatrics", "pediatric", "use in specific populations"],
        "geriatric": ["geriatric use", "geriatrics", "geriatric", "use in specific populations"],
        "storage": ["how supplied/storage and handling", "storage and handling", "storage", "how supplied"],
        "overdose": ["overdosage", "overdose"],
        "comparison": []
    }

    def route_query(self, query: str) -> str:
        """
        Classifies the user query into a clinical category using regex matching.
        Defaults to 'unsupported' if no matches are found.
        """
        if not query:
            return "unsupported"

        query_lower = query.lower()
        best_category = "unsupported"
        max_matches = 0

        for category, patterns in self.CATEGORY_KEYWORDS.items():
            matches = 0
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    matches += 1
            
            if matches > max_matches:
                max_matches = matches
                best_category = category

        logger.info(f"Query '{query[:40]}...' routed to category: '{best_category}' (score={max_matches})")
        return best_category

    def get_sections_for_category(self, category: str) -> List[str]:
        """Returns candidate document sections for a given category."""
        return self.CATEGORY_TO_SECTIONS.get(category, [])

    def boost_sections(
        self, 
        chunks: List[Dict[str, Any]], 
        category: str, 
        boost_factor: float = 1.2
    ) -> List[Dict[str, Any]]:
        """
        Boosts the scores of retrieved chunks that belong to sections mapped to the target category.
        Re-ranks the chunks based on boosted scores.
        """
        target_sections = self.get_sections_for_category(category)
        if not target_sections or not chunks:
            return chunks

        boosted_chunks = []
        for chunk in chunks:
            chunk_copy = chunk.copy()
            section = (chunk_copy.get("section") or "").lower()
            
            # Check if any target section name is part of the chunk's section metadata
            matched = any(target in section for target in target_sections)
            
            if matched:
                original_score = chunk_copy.get("score", 0.0)
                boosted_score = original_score * boost_factor
                chunk_copy["score"] = min(boosted_score, 1.0)  # Cap score at 1.0
                chunk_copy["boosted"] = True
                chunk_copy["original_score"] = original_score
                logger.info(f"Boosting chunk '{chunk_copy.get('chunk_id')}' in section '{section}' from {original_score:.4f} to {boosted_score:.4f}")
            else:
                chunk_copy["boosted"] = False
                
            boosted_chunks.append(chunk_copy)

        # Re-sort by score in descending order
        boosted_chunks.sort(key=lambda x: x.get("score", 0.0), reverse=True)
        return boosted_chunks

# Singleton instance
query_router = QueryRouter()
