# =====================================================
# KHADRWY - RAG RETRIEVER
# =====================================================

import re

import faiss
from sentence_transformers import SentenceTransformer

from backend.rag.knowledge_base import get_documents


# =====================================================
# LOAD KNOWLEDGE BASE
# =====================================================

documents = get_documents()


# =====================================================
# TEXT NORMALIZATION
# =====================================================

def normalize_arabic(text: str) -> str:
    """
    Normalize common Arabic character variations
    to improve keyword matching.
    """

    text = text.lower()

    text = text.replace("أ", "ا")
    text = text.replace("إ", "ا")
    text = text.replace("آ", "ا")

    text = text.replace("ة", "ه")
    text = text.replace("ى", "ي")

    # Remove Arabic diacritics
    text = re.sub(
        r"[\u064B-\u065F\u0670]",
        "",
        text
    )

    return text


def normalize_text(text: str) -> str:

    text = normalize_arabic(text)

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    return text


# =====================================================
# BUILD CHUNKS
# =====================================================

chunks = []

for document in documents:

    title = document["title"]

    text = normalize_text(
        document["content"]
    )

    # Split into meaningful sentences
    sentences = re.split(
        r"(?<=[.!?؟])\s+",
        text
    )

    # Create slightly larger chunks
    # to preserve context
    current_chunk = []

    for sentence in sentences:

        sentence = sentence.strip()

        if not sentence:
            continue

        current_chunk.append(sentence)

        if len(current_chunk) >= 2:

            chunks.append({
                "title": title,
                "content": " ".join(
                    current_chunk
                )
            })

            current_chunk = []

    # Add remaining sentence
    if current_chunk:

        chunks.append({
            "title": title,
            "content": " ".join(
                current_chunk
            )
        })


# =====================================================
# MULTILINGUAL EMBEDDING MODEL
# =====================================================

embedding_model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)


# =====================================================
# CREATE EMBEDDINGS
# =====================================================

chunk_texts = [
    f"{chunk['title']}. {chunk['content']}"
    for chunk in chunks
]

embeddings = embedding_model.encode(
    chunk_texts,
    convert_to_numpy=True,
    normalize_embeddings=True
).astype("float32")


# =====================================================
# FAISS INDEX
# =====================================================

embedding_dimension = embeddings.shape[1]

index = faiss.IndexFlatIP(
    embedding_dimension
)

index.add(
    embeddings
)


# =====================================================
# DOMAIN KEYWORDS
# =====================================================

DOMAIN_KEYWORDS = {

    "early_blight": [
        "early blight",
        "اللفحة المبكرة",
        "لفحة مبكرة",
        "اللفحه المبكره",
        "لفحه مبكره",
        "alternaria"
    ],

    "late_blight": [
        "late blight",
        "اللفحة المتأخرة",
        "لفحة متأخرة",
        "اللفحه المتاخره",
        "لفحه متاخره",
        "phytophthora"
    ],

    "powdery_mildew": [
        "powdery mildew",
        "البياض الدقيقي",
        "بياض دقيقي"
    ],

    "tomato": [
        "tomato",
        "طماطم",
        "الطماطم"
    ],

    "irrigation": [
        "irrigation",
        "watering",
        "ري",
        "الري",
        "المياه",
        "مياه"
    ],

    "healthy": [
        "healthy",
        "صحي",
        "سليمة",
        "سليم",
        "العناية"
    ]
}


# =====================================================
# KEYWORD DETECTION
# =====================================================

def detect_topics(query: str):

    normalized_query = normalize_text(
        query
    )

    detected_topics = []

    for topic, keywords in DOMAIN_KEYWORDS.items():

        for keyword in keywords:

            normalized_keyword = normalize_text(
                keyword
            )

            if normalized_keyword in normalized_query:

                detected_topics.append(
                    topic
                )

                break

    return detected_topics


# =====================================================
# RETRIEVE DOCUMENTS
# =====================================================

def retrieve_documents(
    query: str,
    top_k: int = 3
):

    normalized_query = normalize_text(
        query
    )

    detected_topics = detect_topics(
        normalized_query
    )

    # -------------------------------------------------
    # Query embedding
    # -------------------------------------------------

    query_embedding = embedding_model.encode(
        [normalized_query],
        convert_to_numpy=True,
        normalize_embeddings=True
    ).astype("float32")

    # -------------------------------------------------
    # FAISS search
    # -------------------------------------------------

    search_k = min(
        10,
        len(chunks)
    )

    scores, indices = index.search(
        query_embedding,
        search_k
    )

    results = []

    # -------------------------------------------------
    # Score results
    # -------------------------------------------------

    for score, idx in zip(
        scores[0],
        indices[0]
    ):

        chunk = chunks[idx]

        title = chunk["title"]
        content = chunk["content"]

        final_score = float(score)

        title_normalized = normalize_text(
            title
        )

        content_normalized = normalize_text(
            content
        )

        # ---------------------------------------------
        # Title boost
        # ---------------------------------------------

        for topic in detected_topics:

            topic_keywords = DOMAIN_KEYWORDS[
                topic
            ]

            for keyword in topic_keywords:

                normalized_keyword = normalize_text(
                    keyword
                )

                if normalized_keyword in title_normalized:

                    final_score += 0.35

                    break

        # ---------------------------------------------
        # Content keyword boost
        # ---------------------------------------------

        for topic in detected_topics:

            topic_keywords = DOMAIN_KEYWORDS[
                topic
            ]

            for keyword in topic_keywords:

                normalized_keyword = normalize_text(
                    keyword
                )

                if normalized_keyword in content_normalized:

                    final_score += 0.10

                    break

        results.append({
            "title": title,
            "content": content,
            "score": final_score
        })

    # -------------------------------------------------
    # Sort
    # -------------------------------------------------

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    # -------------------------------------------------
    # Return top results
    # -------------------------------------------------

    return results[:top_k]


# =====================================================
# GET CONTEXT
# =====================================================

def get_context(
    query: str,
    top_k: int = 3
):

    results = retrieve_documents(
        query,
        top_k=top_k
    )

    context_parts = []

    for i, result in enumerate(results):

        context_parts.append(
            f"""
Source {i + 1}: {result['title']}

{result['content']}
"""
        )

    context = "\n".join(
        context_parts
    )

    return context, results