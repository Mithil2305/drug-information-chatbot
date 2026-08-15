import pymupdf as fitz


def extract_pdf_pages(file_path):
    pages = []

    doc = fitz.open(file_path)

    for page_no, page in enumerate(doc, start=1):
        text = page.get_text("text").strip()

        pages.append({
            "page_no": page_no,
            "text": text,
            "extraction_method": "pymupdf",
            "quality_score": 1.0
        })

    doc.close()

    return pages