from app.services.pdf.quality_checker import QualityChecker, QualityConfig


def test_good_native_text():
    page = {
        "text": "The recommended dose is 10 mg once daily. Administer 5 mL by mouth.",
        "page_width": 612.0,
        "page_height": 792.0,
    }
    checker = QualityChecker()
    report = checker.check(page)

    assert report["needs_ocr"] is False
    assert report["char_count"] == len(page["text"])
    assert report["word_count"] == 13
    assert report["garble_ratio"] == 0.0
    assert report["quality_score"] > 0.5


def test_short_page_needs_ocr():
    page = {
        "text": "OK",
        "page_width": 612.0,
        "page_height": 792.0,
    }
    checker = QualityChecker(QualityConfig(min_chars=10, min_words=2))
    report = checker.check(page)

    assert report["needs_ocr"] is True
    assert report["char_count"] == 2
    assert report["word_count"] == 1
    assert report["quality_score"] < 1.0


def test_garbled_page_needs_ocr():
    page = {
        "text": "Start \ufffd\ufffd\ufffd end",
        "page_width": 612.0,
        "page_height": 792.0,
    }
    checker = QualityChecker(QualityConfig(min_chars=5, min_words=2, max_garble_ratio=0.1))
    report = checker.check(page)

    assert report["garble_ratio"] > 0.0
    assert report["needs_ocr"] is True


def test_empty_page():
    page = {
        "text": "",
        "page_width": 612.0,
        "page_height": 792.0,
    }
    checker = QualityChecker()
    report = checker.check(page)

    assert report["needs_ocr"] is True
    assert report["char_count"] == 0
    assert report["word_count"] == 0
    assert report["quality_score"] == 0.0
