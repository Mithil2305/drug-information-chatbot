import os
import re
import uuid
import logging
from pathlib import Path
from typing import Union

logger = logging.getLogger(__name__)

# Regular expressions for PII and PHI detection
EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
PHONE_REGEX = re.compile(r'\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}')
SSN_REGEX = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')
CREDIT_CARD_REGEX = re.compile(r'\b(?:\d[ -]*?){13,16}\b')

# Standard prompt injection patterns (case-insensitive)
PROMPT_INJECTION_PATTERNS = [
    r"ignore\s+(?:all\s+)?previous\s+instructions",
    r"system\s+(?:override|bypass)",
    r"you\s+are\s+now\s+a\b",
    r"acting\s+as\s+a\b",
    r"new\s+rule\s*:",
    r"disregard\s+prior\b",
    r"jailbreak",
    r"dan\s+mode",
    r"do\s+anything\s+now",
    r"ignore\s+(?:system|safety)\s+rules",
    r"output\s+the\s+system\s+prompt",
    r"reveal\s+your\s+instructions",
]

PROMPT_INJECTION_REGEX = re.compile("|".join(PROMPT_INJECTION_PATTERNS), re.IGNORECASE)

def validate_pdf_signature(file_content: bytes) -> bool:
    """
    Validates that a file's binary content starts with the PDF magic number (%PDF-).
    """
    if not file_content:
        return False
    # PDF magic number is %PDF- (hex: 25 50 44 46 2d)
    return file_content.startswith(b'%PDF-')

def sanitize_filename(filename: str) -> str:
    """
    Sanitizes a filename to prevent path traversal and shell injection.
    Only allows alphanumeric characters, dots, dashes, and underscores.
    """
    if not filename:
        return f"unnamed_{uuid.uuid4().hex}"
        
    # Get only the basename to prevent directory traversal
    base_name = os.path.basename(filename)
    
    # Split name and extension
    name, ext = os.path.splitext(base_name)
    
    # Strip any characters that are not alphanumeric, dot, dash, or underscore
    clean_name = re.sub(r'[^a-zA-Z0-9_\-]', '', name)
    clean_ext = re.sub(r'[^a-zA-Z0-9.]', '', ext)
    
    # If filename becomes empty, generate a unique one
    if not clean_name:
        clean_name = f"file_{uuid.uuid4().hex}"
        
    return f"{clean_name}{clean_ext}"

def is_safe_path(base_dir: Union[str, Path], target_path: Union[str, Path]) -> bool:
    """
    Validates that a target path lies strictly within a base directory,
    preventing directory traversal attacks (e.g. using '../../').
    """
    try:
        base_path = Path(base_dir).resolve()
        resolved_target = Path(target_path).resolve()
        return base_path in resolved_target.parents or base_path == resolved_target
    except Exception as e:
        logger.warning(f"Path safety validation failed: {e}")
        return False

def sanitize_input(text: str) -> str:
    """
    Sanitizes user input by stripping HTML tags and basic SQL injection patterns.
    """
    if not text:
        return ""
    # Strip HTML tags
    clean_text = re.sub(r'<[^>]*>', '', text)
    # Escape quotes to prevent basic SQL issues (FastAPI relies on ORM, but this is a defensive fallback)
    clean_text = clean_text.replace("'", "''")
    return clean_text.strip()

def detect_prompt_injection(text: str) -> bool:
    """
    Checks if a user query or document text contains common prompt injection/override phrases.
    """
    if not text:
        return False
    return bool(PROMPT_INJECTION_REGEX.search(text))

def mask_pii_phi(text: str) -> str:
    """
    Scans text for PII/PHI (emails, phone numbers, SSNs, credit cards)
    and masks them with placeholders to ensure patient and user privacy.
    """
    if not text:
        return ""
    
    masked = EMAIL_REGEX.sub("[EMAIL_MASKED]", text)
    masked = PHONE_REGEX.sub("[PHONE_MASKED]", masked)
    masked = SSN_REGEX.sub("[SSN_MASKED]", masked)
    masked = CREDIT_CARD_REGEX.sub("[CARD_MASKED]", masked)
    return masked

def is_valid_uuid(uuid_to_test: str) -> bool:
    """
    Checks if a string is a valid UUID4.
    """
    if not uuid_to_test:
        return False
    try:
        val = uuid.UUID(uuid_to_test, version=4)
        return str(val) == uuid_to_test
    except ValueError:
        return False
