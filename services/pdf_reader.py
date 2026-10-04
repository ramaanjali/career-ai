from pypdf import PdfReader


def extract_text_from_pdf(pdf_path):

    reader = PdfReader(pdf_path)

    print("TOTAL PAGES:", len(reader.pages))

    pages_text = []

    for page_number, page in enumerate(reader.pages, start=1):

        text = page.extract_text()

        if text:

            print(
                f"Page {page_number}: "
                f"{len(text)} characters"
            )

            pages_text.append(
                f"\n--- Page {page_number} ---\n{text}"
            )

        else:

            print(
                f"Page {page_number}: NO TEXT FOUND"
            )

    final_text = "\n".join(pages_text)

    print(
        "TOTAL EXTRACTED CHARACTERS:",
        len(final_text)
    )

    return final_text