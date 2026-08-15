from app.services.pdf.cleaner import clean_text


def test_clean_preserves_dosage_values():
    # All of these must survive cleaning unchanged.
    cases = [
        "10 mg",
        "5 mL",
        "2.5 mg/kg",
        "once daily",
        "twice daily",
        "0.5 mg",
        "10-20 mg",
        "1:1000",
    ]
    for value in cases:
        assert clean_text(value) == value, f"clean_text changed {value!r}"


def test_collapse_horizontal_whitespace():
    raw = "Dose:    10  mg   once    daily"
    expected = "Dose: 10 mg once daily"
    assert clean_text(raw) == expected


def test_remove_control_noise():
    raw = "Dose \ufffd 10 mg"
    expected = "Dose 10 mg"  # the replacement char and extra space are removed
    assert clean_text(raw) == expected


def test_normalize_newlines():
    raw = "Line 1\r\n\r\n\r\n\r\nLine 2"
    expected = "Line 1\n\nLine 2"
    assert clean_text(raw) == expected


def test_empty_and_whitespace():
    assert clean_text("") == ""
    assert clean_text("   \n\n   ") == ""
