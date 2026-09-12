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
    Normalize common Arabic character variations.
    """

    text = text.lower()

    # Arabic character normalization
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

    # Normalize spaces
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

    title = document.get(
        "title",
        "Unknown"
    )

    plant = document.get(
        "plant"
    )

    condition = document.get(
        "condition"
    )

    category = document.get(
        "category",
        "general"
    )

    text = normalize_text(
        document.get(
            "content",
            ""
        )
    )

    # -------------------------------------------------
    # Split into sentences
    # -------------------------------------------------

    sentences = re.split(
        r"(?<=[.!?؟])\s+",
        text
    )

    current_chunk = []

    for sentence in sentences:

        sentence = sentence.strip()

        if not sentence:
            continue

        current_chunk.append(
            sentence
        )

        # Keep 2 sentences per chunk
        if len(current_chunk) >= 2:

            chunks.append({

                "title": title,

                "content": " ".join(
                    current_chunk
                ),

                # IMPORTANT:
                # Preserve document metadata
                "plant": plant,
                "condition": condition,
                "category": category

            })

            current_chunk = []

    # -------------------------------------------------
    # Remaining sentence
    # -------------------------------------------------

    if current_chunk:

        chunks.append({

            "title": title,

            "content": " ".join(
                current_chunk
            ),

            "plant": plant,
            "condition": condition,
            "category": category

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

    f"""
    {chunk['title']}.
    Plant: {chunk.get('plant') or ''}.
    Condition: {chunk.get('condition') or ''}.
    Category: {chunk.get('category') or ''}.
    {chunk['content']}
    """

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
# DOMAIN TOPICS
# =====================================================

DOMAIN_KEYWORDS = {

    # -------------------------------------------------
    # DISEASES
    # -------------------------------------------------

    "early_blight": [
        "early blight",
        "alternaria",
        "اللفحة المبكرة",
        "لفحة مبكرة",
        "اللفحه المبكره",
        "لفحه مبكره"
    ],

    "late_blight": [
        "late blight",
        "phytophthora",
        "اللفحة المتأخرة",
        "لفحة متأخرة",
        "اللفحه المتاخره",
        "لفحه متاخره"
    ],

    "powdery_mildew": [
        "powdery mildew",
        "البياض الدقيقي",
        "بياض دقيقي"
    ],

    # -------------------------------------------------
    # PLANTS
    # -------------------------------------------------

    "tomato": [
        "tomato",
        "tomatoes",
        "طماطم",
        "الطماطم"
    ],

    "apple": [
        "apple",
        "تفاح",
        "التفاح"
    ],

    "corn": [
        "corn",
        "maize",
        "ذرة",
        "الذرة"
    ],

    "blueberry": [
        "blueberry",
        "التوت الازرق",
        "توت ازرق"
    ],

    "cherry": [
        "cherry",
        "كرز",
        "الكرز"
    ],

    # -------------------------------------------------
    # CULTIVATION
    # -------------------------------------------------

    "cultivation": [

        # English
        "cultivation",
        "cultivate",
        "grow",
        "growing",
        "planting",
        "plant",
        "how to grow",
        "how to plant",

        # Arabic
        "ازرع",
        "ازرعها",
        "ازرعه",
        "زراعه",
        "زراعة",
        "الزراعة",
        "زرع",
        "يزرع",
        "ازاي ازرع",
        "ازاى ازرع",
        "كيف ازرع",
        "كيفية الزراعة",
        "ابدأ الزراعة",
        "ابدا الزراعه",
        "خطوات الزراعة",
        "خطوات الزراعه",
        "طريقة الزراعة",
        "طريقه الزراعه"
    ],

    # -------------------------------------------------
    # IRRIGATION
    # -------------------------------------------------

    "irrigation": [

        "irrigation",
        "watering",
        "water",
        "watering schedule",

        "ري",
        "الري",
        "المياه",
        "مياه",
        "سقي",
        "اسقي",
        "اسقيها",
        "اسقيه"
    ],

    # -------------------------------------------------
    # SOIL
    # -------------------------------------------------

    "soil": [

        "soil",
        "soil moisture",

        "التربة",
        "التربه",
        "رطوبة التربة",
        "رطوبه التربه"
    ],

    # -------------------------------------------------
    # HUMIDITY
    # -------------------------------------------------

    "humidity": [

        "humidity",

        "الرطوبة",
        "الرطوبه"
    ],

    # -------------------------------------------------
    # TEMPERATURE
    # -------------------------------------------------

    "temperature": [

        "temperature",

        "درجة الحرارة",
        "درجه الحراره",
        "الحراره"
    ],

    # -------------------------------------------------
    # LIGHT
    # -------------------------------------------------

    "light": [

        "light",
        "sunlight",

        "ضوء",
        "الإضاءة",
        "الاضاءة",
        "ضوء الشمس",
        "الشمس"
    ],

    # -------------------------------------------------
    # NUTRITION
    # -------------------------------------------------

    "nutrition": [

        "nutrition",
        "nutrient",
        "fertilizer",
        "fertilisation",
        "fertilization",

        "سماد",
        "تسميد",
        "التسميد",
        "العناصر الغذائية",
        "العناصر الغذائيه",
        "تغذية النبات",
        "تغذيه النبات"
    ],

    # -------------------------------------------------
    # PREVENTION
    # -------------------------------------------------

    "prevention": [

        "prevention",
        "prevent",
        "protection",

        "وقاية",
        "الوقايه",
        "حماية",
        "الحمايه",
        "احمي النبات",
        "احميه"
    ],

    # -------------------------------------------------
    # HEALTH / CARE
    # -------------------------------------------------

    "healthy": [

        "healthy",
        "health",
        "care",

        "صحي",
        "سليمة",
        "سليم",
        "العناية",
        "العنايه",
        "رعاية",
        "رعايه"
    ]
}


# =====================================================
# DISEASE GROUPS
# =====================================================

DISEASE_TOPICS = {

    "early_blight",
    "late_blight",
    "powdery_mildew"

}


# =====================================================
# PLANT TOPICS
# =====================================================

PLANT_TOPICS = {

    "tomato",
    "apple",
    "corn",
    "blueberry",
    "cherry"

}


# =====================================================
# DETECT TOPICS
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
# DETECT COMPARISON QUESTIONS
# =====================================================

def is_comparison_query(query: str) -> bool:

    normalized_query = normalize_text(
        query
    )

    comparison_keywords = [

        # English
        "compare",
        "comparison",
        "difference",
        "differences",
        "vs",
        "versus",

        # Arabic
        "الفرق",
        "فرق",
        "مقارنة",
        "قارن",
        "مقارنه",
        "ايه الفرق",
        "ما الفرق",
        "ما هو الفرق",
        "ايه الاختلاف",
        "ما الاختلاف"

    ]

    return any(
        normalize_text(keyword)
        in normalized_query
        for keyword in comparison_keywords
    )


# =====================================================
# DETECT CULTIVATION QUESTIONS
# =====================================================

def is_cultivation_query(query: str) -> bool:

    topics = detect_topics(
        query
    )

    return "cultivation" in topics


# =====================================================
# CHECK KEYWORD MATCH
# =====================================================

def contains_topic_keyword(
    text: str,
    topic: str
) -> bool:

    if not text:
        return False

    normalized_text = normalize_text(
        text
    )

    keywords = DOMAIN_KEYWORDS.get(
        topic,
        []
    )

    for keyword in keywords:

        normalized_keyword = normalize_text(
            keyword
        )

        if normalized_keyword in normalized_text:

            return True

    return False


# =====================================================
# CHECK METADATA MATCH
# =====================================================

def metadata_matches(
    chunk,
    plant=None,
    condition=None,
    category=None
):

    chunk_plant = normalize_text(
        str(chunk.get("plant") or "")
    )

    chunk_condition = normalize_text(
        str(chunk.get("condition") or "")
    )

    chunk_category = normalize_text(
        str(chunk.get("category") or "")
    )

    # -------------------------------------------------
    # Plant match
    # -------------------------------------------------

    if plant:

        normalized_plant = normalize_text(
            plant
        )

        if normalized_plant not in chunk_plant:

            return False

    # -------------------------------------------------
    # Condition match
    # -------------------------------------------------

    if condition:

        normalized_condition = normalize_text(
            condition
        )

        if (
            normalized_condition not in chunk_condition
            and normalized_condition not in normalize_text(
                chunk.get("title", "")
            )
        ):

            return False

    # -------------------------------------------------
    # Category match
    # -------------------------------------------------

    if category:

        if category != chunk_category:

            return False

    return True


# =====================================================
# RETRIEVE DOCUMENTS
# =====================================================

def retrieve_documents(
    query: str,
    top_k: int = 3,
    plant: str | None = None,
    condition: str | None = None
):

    normalized_query = normalize_text(
        query
    )

    # -------------------------------------------------
    # Detect query topics
    # -------------------------------------------------

    detected_topics = detect_topics(
        normalized_query
    )

    # -------------------------------------------------
    # Detect special query types
    # -------------------------------------------------

    comparison_query = is_comparison_query(
        normalized_query
    )

    cultivation_query = is_cultivation_query(
        normalized_query
    )

    # -------------------------------------------------
    # Diagnosis topics
    # -------------------------------------------------

    diagnosis_topics = []

    if plant:

        diagnosis_topics.extend(
            detect_topics(plant)
        )

    if condition:

        diagnosis_topics.extend(
            detect_topics(condition)
        )

    diagnosis_topics = list(
        dict.fromkeys(
            diagnosis_topics
        )
    )

    # =================================================
    # QUERY EMBEDDING
    # =================================================

    query_embedding = embedding_model.encode(
        [normalized_query],
        convert_to_numpy=True,
        normalize_embeddings=True
    ).astype("float32")

    # =================================================
    # SEARCH MORE CANDIDATES
    # =================================================

    search_k = min(
        max(25, top_k * 8),
        len(chunks)
    )

    scores, indices = index.search(
        query_embedding,
        search_k
    )

    results = []

    # =================================================
    # SCORE EACH RESULT
    # =================================================

    for score, idx in zip(
        scores[0],
        indices[0]
    ):

        if idx < 0:
            continue

        chunk = chunks[idx]

        title = chunk["title"]
        content = chunk["content"]

        title_normalized = normalize_text(
            title
        )

        content_normalized = normalize_text(
            content
        )

        chunk_plant = normalize_text(
            str(chunk.get("plant") or "")
        )

        chunk_condition = normalize_text(
            str(chunk.get("condition") or "")
        )

        chunk_category = normalize_text(
            str(chunk.get("category") or "")
        )

        final_score = float(score)

        # =================================================
        # 1. QUERY TOPIC BOOST
        # =================================================

        for topic in detected_topics:

            if contains_topic_keyword(
                title,
                topic
            ):

                final_score += 0.40

            elif contains_topic_keyword(
                content,
                topic
            ):

                final_score += 0.12

        # =================================================
        # 2. DIAGNOSIS BOOST
        # =================================================

        for topic in diagnosis_topics:

            if contains_topic_keyword(
                title,
                topic
            ):

                final_score += 0.30

            elif contains_topic_keyword(
                content,
                topic
            ):

                final_score += 0.08

        # =================================================
        # 3. METADATA PLANT BOOST
        # =================================================

        if plant:

            normalized_plant = normalize_text(
                plant
            )

            if normalized_plant == chunk_plant:

                final_score += 0.45

            elif normalized_plant in title_normalized:

                final_score += 0.25

            elif normalized_plant in content_normalized:

                final_score += 0.08

        # =================================================
        # 4. METADATA CONDITION BOOST
        # =================================================

        if condition:

            normalized_condition = normalize_text(
                condition
            )

            if normalized_condition == chunk_condition:

                final_score += 0.55

            elif normalized_condition in title_normalized:

                final_score += 0.40

            elif normalized_condition in content_normalized:

                final_score += 0.15

        # =================================================
        # 5. CULTIVATION BOOST
        # =================================================

        if cultivation_query:

            if chunk_category == "cultivation":

                final_score += 0.55

            elif contains_topic_keyword(
                title,
                "cultivation"
            ):

                final_score += 0.30

            elif contains_topic_keyword(
                content,
                "cultivation"
            ):

                final_score += 0.10

        # =================================================
        # 6. CATEGORY MATCH BOOST
        # =================================================

        for topic in detected_topics:

            if topic == "irrigation":

                if chunk_category in {
                    "irrigation",
                    "water",
                    "cultivation"
                }:

                    final_score += 0.20

            elif topic == "soil":

                if chunk_category in {
                    "soil",
                    "cultivation"
                }:

                    final_score += 0.20

            elif topic == "nutrition":

                if chunk_category in {
                    "nutrition",
                    "fertilizer",
                    "cultivation"
                }:

                    final_score += 0.20

            elif topic == "prevention":

                if chunk_category in {
                    "prevention",
                    "disease",
                    "cultivation"
                }:

                    final_score += 0.20

        # =================================================
        # STORE RESULT
        # =================================================

        results.append({

            "title": title,

            "content": content,

            "plant": chunk.get("plant"),

            "condition": chunk.get("condition"),

            "category": chunk.get(
                "category",
                "general"
            ),

            "score": final_score,

            "semantic_score": float(score)

        })

    # =================================================
    # SORT
    # =================================================

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    # =================================================
    # DISEASE DETECTION
    # =================================================

    detected_diseases = [

        topic

        for topic in detected_topics

        if topic in DISEASE_TOPICS

    ]

    diagnosis_diseases = [

        topic

        for topic in diagnosis_topics

        if topic in DISEASE_TOPICS

    ]

    # =================================================
    # COMPARISON DISEASE HANDLING
    # =================================================

    if comparison_query:

        target_diseases = list(
            dict.fromkeys(
                detected_diseases
                + diagnosis_diseases
            )
        )

        if len(target_diseases) >= 2:

            comparison_results = []

            for disease in target_diseases:

                disease_results = [

                    result

                    for result in results

                    if (
                        contains_topic_keyword(
                            result["title"],
                            disease
                        )
                        or
                        contains_topic_keyword(
                            result["content"],
                            disease
                        )
                    )

                ]

                comparison_results.extend(
                    disease_results[:2]
                )

            if comparison_results:

                comparison_results.sort(
                    key=lambda x: x["score"],
                    reverse=True
                )

                results = comparison_results

    # =================================================
    # NORMAL DISEASE CONFLICT PROTECTION
    # =================================================

    else:

        target_disease = None

        if detected_diseases:

            target_disease = detected_diseases[0]

        elif diagnosis_diseases:

            target_disease = diagnosis_diseases[0]

        if target_disease:

            filtered_results = []

            for result in results:

                title = result["title"]

                conflicting = False

                for disease in DISEASE_TOPICS:

                    if disease == target_disease:
                        continue

                    if contains_topic_keyword(
                        title,
                        disease
                    ):

                        conflicting = True

                        break

                if not conflicting:

                    filtered_results.append(
                        result
                    )

            results = filtered_results

    # =================================================
    # PLANT RELEVANCE FILTER
    # =================================================

    if plant:

        normalized_plant = normalize_text(
            plant
        )

        plant_specific = [

            result

            for result in results

            if normalize_text(
                str(result.get("plant") or "")
            ) == normalized_plant

        ]

        general_results = [

            result

            for result in results

            if not result.get("plant")

        ]

        if plant_specific:

            results = (
                plant_specific
                + general_results
            )

    # =================================================
    # RELEVANCE FILTER
    # =================================================

    MIN_SEMANTIC_SCORE = 0.25

    results = [

        result

        for result in results

        if result["semantic_score"]
        >= MIN_SEMANTIC_SCORE

    ]

    # =================================================
    # REMOVE DUPLICATE CHUNKS
    # =================================================

    unique_results = []

    seen = set()

    for result in results:

        key = (
            result["title"],
            result["content"]
        )

        if key in seen:
            continue

        seen.add(key)

        unique_results.append(
            result
        )

    results = unique_results

    # =================================================
    # DIVERSITY
    # =================================================

    diversified_results = []

    title_counts = {}

    for result in results:

        title = result["title"]

        count = title_counts.get(
            title,
            0
        )

        max_per_title = 2

        if count >= max_per_title:
            continue

        title_counts[title] = (
            count + 1
        )

        diversified_results.append(
            result
        )

    results = diversified_results

    # =================================================
    # FINAL RETURN
    # =================================================

    return results[:top_k]


# =====================================================
# GET CONTEXT
# =====================================================

def get_context(
    query: str,
    top_k: int = 3,
    plant: str | None = None,
    condition: str | None = None
):

    results = retrieve_documents(
        query=query,
        top_k=top_k,
        plant=plant,
        condition=condition
    )

    # -------------------------------------------------
    # No relevant information
    # -------------------------------------------------

    if not results:

        return "", []

    # -------------------------------------------------
    # Build context
    # -------------------------------------------------

    context_parts = []

    for i, result in enumerate(results):

        metadata = []

        if result.get("plant"):
            metadata.append(
                f"Plant: {result['plant']}"
            )

        if result.get("condition"):
            metadata.append(
                f"Condition: {result['condition']}"
            )

        if result.get("category"):
            metadata.append(
                f"Category: {result['category']}"
            )

        metadata_text = "\n".join(
            metadata
        )

        context_parts.append(

            f"""
Source {i + 1}: {result['title']}

{metadata_text}

{result['content']}
"""

        )

    context = "\n".join(
        context_parts
    )

    return context, results