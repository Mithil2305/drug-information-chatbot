import logging
from typing import List, Dict, Any
from app.core.security import detect_prompt_injection, mask_pii_phi

logger = logging.getLogger(__name__)

class SafetyValidator:
    """
    Validation service checking safety compliance: prompt injections, PII/PHI leak prevention,
    OCR quality warnings, version discrepancies, and injecting clinical safety disclaimers.
    """

    def validate_safety(
        self,
        draft_answer: str,
        evidence_chunks: List[Dict[str, Any]],
        user_query: str = None
    ) -> Dict[str, Any]:
        """
        Validates safety metrics and applies sanitization/disclaimers.
        Returns a dict indicating safety status, warnings, and the sanitized final answer text.
        """
        warnings = []
        safety_flags = {
            "prompt_injection_detected": False,
            "insufficient_evidence": False,
            "ocr_uncertainty": False,
            "stale_version_retrieved": False,
            "disclaimer_appended": False
        }

        # 1. Prompt Injection Protection
        if detect_prompt_injection(draft_answer) or (user_query and detect_prompt_injection(user_query)):
            logger.warning("Prompt injection signature detected during validation!")
            safety_flags["prompt_injection_detected"] = True
            warnings.append("Possible prompt injection attempt or override phrase detected.")
            # For security, return a safe generic refusal
            return {
                "safe": False,
                "cleaned_answer": "I cannot fulfill this request as it violates safety guidelines.",
                "warnings": warnings,
                "safety_flags": safety_flags
            }

        # 2. Insufficient Evidence / Score Check
        if not evidence_chunks:
            safety_flags["insufficient_evidence"] = True
            warnings.append("Zero evidence chunks supplied for validation.")
            return {
                "safe": False,
                "cleaned_answer": "I couldn't find sufficient information in the provided document. I don't want to guess.",
                "warnings": warnings,
                "safety_flags": safety_flags
            }

        # Check if all scores are dangerously low
        all_low = all(chunk.get("score", 1.0) < 0.40 for chunk in evidence_chunks)
        if all_low:
            safety_flags["insufficient_evidence"] = True
            warnings.append("All retrieved evidence chunks have low relevance scores.")

        # 3. OCR Uncertainty Check
        # If any page quality score (if present in metadata) is low (e.g. < 0.75), add a warning
        low_quality_pages = []
        for chunk in evidence_chunks:
            quality = chunk.get("quality_score") or chunk.get("page_quality") or 1.0
            if quality < 0.75:
                page_no = chunk.get("page_no", "?")
                doc_name = chunk.get("document_name", "Document")
                low_quality_pages.append(f"{doc_name} (Page {page_no})")

        if low_quality_pages:
            safety_flags["ocr_uncertainty"] = True
            warnings.append(
                f"OCR uncertainty detected in the source text of: {', '.join(low_quality_pages)}. "
                "Text might be partially misrecognized due to scanned page quality."
            )

        # 4. Versioning and Active Status Verification
        # Check if any chunk metadata indicates a 'stale' or 'inactive' label version
        for chunk in evidence_chunks:
            status = chunk.get("status") or chunk.get("version_status", "active")
            if status == "inactive" or status == "stale":
                safety_flags["stale_version_retrieved"] = True
                warnings.append(f"Retrieved chunk belongs to an inactive/stale version of document: {chunk.get('document_name')}.")

        # 5. PII / PHI Masking
        sanitized_answer = mask_pii_phi(draft_answer)

        # 6. Clinical safety disclaimer enforcement
        # Scan for prescriptive language or clinical directives to ensure patient safety
        prescriptive_patterns = [
            "you should take",
            "you must take",
            "recommended dose is",
            "increase the dose",
            "stop taking",
            "prescribe"
        ]
        
        needs_disclaimer = any(p in sanitized_answer.lower() for p in prescriptive_patterns)
        
        # Check if disclaimer is already present
        disclaimer_text = "Always consult a healthcare provider before making any changes to your medication regimen."
        if needs_disclaimer and disclaimer_text not in sanitized_answer:
            sanitized_answer += f"\n\n*Note: {disclaimer_text}*"
            safety_flags["disclaimer_appended"] = True

        safe = not safety_flags["prompt_injection_detected"] and not safety_flags["insufficient_evidence"]

        return {
            "safe": safe,
            "cleaned_answer": sanitized_answer,
            "warnings": warnings,
            "safety_flags": safety_flags
        }

# Singleton instance
safety_validator = SafetyValidator()
