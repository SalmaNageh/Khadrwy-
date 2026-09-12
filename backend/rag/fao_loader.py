# =====================================================
# KHADRWY - FAO SOURCE LOADER
# =====================================================

from pathlib import Path


# =====================================================
# FAO DIRECTORY
# =====================================================

FAO_DIRECTORY = (
    Path(__file__).resolve().parent
    / "sources"
    / "fao"
)


# =====================================================
# FAO SOURCE INFORMATION
# =====================================================

FAO_SOURCE_NAME = (
    "Food and Agriculture Organization (FAO)"
)

FAO_SOURCE_URL = (
    "https://www.fao.org/"
)

FAO_YEAR = 2023


# =====================================================
# FAO DOCUMENT METADATA
# =====================================================

FAO_DOCUMENT_METADATA = {

    "cc7839en.pdf": {
        "title": (
            "Introduction and advantages of "
            "protected cultivation systems"
        ),
        "category": "greenhouse",
        "topics": [
            "protected cultivation",
            "greenhouse",
            "climate",
            "plant management",
        ],
    },

    "cc7846en.pdf": {
        "title": (
            "Covering materials for "
            "protected cultivation systems"
        ),
        "category": "greenhouse",
        "topics": [
            "greenhouse",
            "protected cultivation",
            "covering materials",
        ],
    },

    "cc7848en.pdf": {
        "title": (
            "Vegetable seedling production in trays"
        ),
        "category": "cultivation",
        "topics": [
            "seedlings",
            "vegetable cultivation",
            "seedling production",
            "trays",
        ],
    },

    "cc7850en.pdf": {
        "title": (
            "Sampling and monitoring pests and diseases"
        ),
        "category": "prevention",
        "topics": [
            "pests",
            "diseases",
            "monitoring",
            "sampling",
            "prevention",
        ],
    },

    "cc7851en.pdf": {
        "title": (
            "Water and irrigation management"
        ),
        "category": "irrigation",
        "topics": [
            "water",
            "irrigation",
            "soil moisture",
            "water management",
        ],
    },
}


# =====================================================
# GET FAO SOURCE FILES
# =====================================================

def get_fao_source_files():
    """
    Return the FAO PDF files that actually exist.
    """

    files = []

    for filename in FAO_DOCUMENT_METADATA:

        file_path = FAO_DIRECTORY / filename

        if file_path.exists():
            files.append(file_path)

    return files


# =====================================================
# GET FAO DOCUMENT METADATA
# =====================================================

def get_fao_documents():
    """
    Return FAO documents as metadata records.

    IMPORTANT:
    These PDFs are scanned/image-based files.
    We intentionally do NOT perform OCR here.

    The actual agricultural knowledge used by the RAG
    should come from curated FAO knowledge records
    added separately to the knowledge base.
    """

    documents = []

    for filename, metadata in FAO_DOCUMENT_METADATA.items():

        file_path = FAO_DIRECTORY / filename

        if not file_path.exists():
            continue

        documents.append({

            "title": metadata["title"],

            "plant": "General",

            "condition": "General",

            "category": metadata["category"],

            "source_type": "official_fao",

            "source_name": FAO_SOURCE_NAME,

            "source_url": FAO_SOURCE_URL,

            "year": FAO_YEAR,

            "file_name": filename,

            "file_path": str(file_path),

            "topics": metadata["topics"],

            # No extracted text.
            "content": "",

        })

    return documents


# =====================================================
# TEST
# =====================================================

if __name__ == "__main__":

    print("=" * 60)
    print("KHADRWY - FAO SOURCE CHECK")
    print("=" * 60)

    print(f"\nFAO directory:")
    print(FAO_DIRECTORY)

    documents = get_fao_documents()

    print(f"\nFound FAO files: {len(documents)}")

    for document in documents:

        print("\n" + "-" * 60)

        print(
            f"File: "
            f"{document['file_name']}"
        )

        print(
            f"Title: "
            f"{document['title']}"
        )

        print(
            f"Category: "
            f"{document['category']}"
        )

        print(
            f"Topics: "
            f"{', '.join(document['topics'])}"
        )

        print(
            f"Source: "
            f"{document['source_name']}"
        )

    print("\n" + "=" * 60)
    print("FAO loader check completed.")
    print("No OCR was performed.")
    print("=" * 60)