from app.services.pdf.section_detector import SectionDetector


def test_detects_dosage_section():
    text = "DOSAGE AND ADMINISTRATION\nThe recommended dose is 10 mg once daily."
    detector = SectionDetector()
    section = detector.detect(text)
    assert section == "DOSAGE AND ADMINISTRATION"


def test_propagates_current_section():
    text = "The recommended dose is 10 mg once daily."
    detector = SectionDetector()
    section = detector.detect(text, current_section="DOSAGE AND ADMINISTRATION")
    assert section == "DOSAGE AND ADMINISTRATION"


def test_unknown_when_no_heading_and_no_current():
    text = "Some random body text without a heading."
    detector = SectionDetector()
    section = detector.detect(text)
    assert section is None


def test_detects_multiple_headings_in_order():
    text = "\n".join([
        "DESCRIPTION",
        "Some description text",
        "CONTRAINDICATIONS",
        "Some contraindications",
    ])
    detector = SectionDetector()
    headings = detector.detect_all(text)
    assert headings == ["DESCRIPTION", "CONTRAINDICATIONS"]
