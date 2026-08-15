import logging
import re

logger = logging.getLogger(__name__)

# Control characters we never want to keep, except \n and \t (handled separately).
_CONTROL_NOISE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f\uFFFD]")

# Horizontal whitespace run: spaces and tabs only, NOT newlines.
_HSPACE_RUN = re.compile(r"[ \t]+")

# Three or more consecutive line breaks collapse to a double line break.
_MULTIPLE_BREAKS = re.compile(r"\n{3,}")


def clean_text(text: str) -> str:
    """Conservatively clean a page of text without altering medical values.

    Preserved:
      10 mg, 5 mL, 2.5 mg/kg, once/twice daily, 0.5 mg, 10-20 mg, 1:1000
    """
    if not text:
        return ""

    # 1. Normalize line endings to \n.
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # 2. Remove control / replacement noise.
    text = _CONTROL_NOISE.sub("", text)

    # 3. Collapse horizontal whitespace runs to a single space.
    # This keeps single newlines intact and never joins separate lines.
    text = _HSPACE_RUN.sub(" ", text)

    # 4. Trim spaces at the start/end of each line.
    text = "\n".join(line.strip() for line in text.split("\n"))

    # 5. Collapse 3+ consecutive blank lines to a double blank line.
    text = _MULTIPLE_BREAKS.sub("\n\n", text)

    return text.strip()
