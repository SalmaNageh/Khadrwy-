# =====================================================
# KHADRWY - RAG RETRIEVER
# =====================================================

import re
import string
import torch
import faiss

from sentence_transformers import SentenceTransformer

from backend.rag.knowledge_base import get_documents
from backend.rag.fao_loader import get_fao_documents


# =====================================================
# PERFORMANCE SETTINGS
# =====================================================

EMBEDDING_MODEL_NAME = (
    "paraphrase-multilingual-MiniLM-L12-v2"
)

EMBEDDING_BATCH_SIZE = 8
CPU_THREADS = 2

SEARCH_MULTIPLIER = 12
MIN_SEARCH_RESULTS = 30


torch.set_num_threads(CPU_THREADS)


# =====================================================
# ARABIC NORMALIZATION
# =====================================================

ARABIC_DIACRITICS = re.compile(
    r"[\u0617-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]"
)


def normalize_arabic(text):

    if not text:
        return ""

    text = str(text)

    text = ARABIC_DIACRITICS.sub(
        "",
        text
    )

    text = re.sub(
        r"[إأآٱ]",
        "ا",
        text
    )

    text = text.replace(
        "ى",
        "ي"
    )

    text = text.replace(
        "ة",
        "ه"
    )

    return text


# =====================================================
# GENERAL TEXT NORMALIZATION
# =====================================================

def normalize_text(text):

    if not text:
        return ""

    text = normalize_arabic(text)

    text = text.lower()

    text = text.replace(
        "_",
        " "
    )

    text = text.replace(
        "-",
        " "
    )

    punctuation = (
        string.punctuation
        + "،؛؟«»…"
    )

    text = text.translate(
        str.maketrans(
            "",
            "",
            punctuation
        )
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# =====================================================
# SENTENCE SPLITTER
# =====================================================

def split_sentences(text):

    if not text:
        return []

    text = text.strip()

    sentences = re.split(
        r"(?<=[.!؟?])\s+",
        text
    )

    return [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]


# =====================================================
# DOCUMENT CHUNKING
# =====================================================

def chunk_document(
    document,
    sentences_per_chunk=3
):

    content = document.get(
        "content",
        ""
    )

    sentences = split_sentences(
        content
    )

    if not sentences:
        return []

    chunks = []

    for i in range(
        0,
        len(sentences),
        sentences_per_chunk
    ):

        chunk_sentences = sentences[
            i:i + sentences_per_chunk
        ]

        chunk_text = " ".join(
            chunk_sentences
        )

        chunk = dict(document)

        chunk["content"] = chunk_text

        chunks.append(
            chunk
        )

    return chunks


# =====================================================
# LOAD DOCUMENTS
# =====================================================

def load_all_documents():

    documents = []

    # -------------------------------------------------
    # Khadrwy Knowledge Base
    # -------------------------------------------------

    try:

        kb_documents = get_documents()

        if kb_documents:

            documents.extend(
                kb_documents
            )

    except Exception as e:

        print(
            f"[RAG] Knowledge base loading error: {e}"
        )

    # -------------------------------------------------
    # FAO documents
    # -------------------------------------------------

    try:

        fao_documents = get_fao_documents()

        if fao_documents:

            documents.extend(
                fao_documents
            )

    except Exception as e:

        print(
            f"[RAG] FAO loading error: {e}"
        )

    return documents


# =====================================================
# BUILD CHUNKS
# =====================================================

def build_chunks(documents):

    chunks = []

    for document in documents:

        document_chunks = chunk_document(
            document
        )

        chunks.extend(
            document_chunks
        )

    return chunks


# =====================================================
# EMBEDDING MODEL
# =====================================================

print(
    "[RAG] Loading embedding model..."
)

embedding_model = SentenceTransformer(
    EMBEDDING_MODEL_NAME,
    device="cpu"
)

print(
    "[RAG] Embedding model loaded."
)


# =====================================================
# LOAD DOCUMENTS
# =====================================================

print(
    "[RAG] Loading agricultural documents..."
)

documents = load_all_documents()

print(
    f"[RAG] Documents loaded: {len(documents)}"
)


# =====================================================
# BUILD CHUNKS
# =====================================================

chunks = build_chunks(
    documents
)

print(
    f"[RAG] Chunks created: {len(chunks)}"
)


# =====================================================
# PREPARE EMBEDDING TEXT
# =====================================================

def build_embedding_text(chunk):

    title = chunk.get(
        "title",
        ""
    )

    plant = chunk.get(
        "plant",
        ""
    )

    condition = chunk.get(
        "condition",
        ""
    )

    category = chunk.get(
        "category",
        ""
    )

    content = chunk.get(
        "content",
        ""
    )

    return (
        f"Title: {title}. "
        f"Plant: {plant}. "
        f"Condition: {condition}. "
        f"Category: {category}. "
        f"{content}"
    )


embedding_texts = [
    build_embedding_text(chunk)
    for chunk in chunks
]


# =====================================================
# CREATE EMBEDDINGS
# =====================================================

print(
    "[RAG] Creating embeddings..."
)

embeddings = embedding_model.encode(
    embedding_texts,
    batch_size=EMBEDDING_BATCH_SIZE,
    show_progress_bar=True,
    normalize_embeddings=True,
    convert_to_numpy=True
)

print(
    "[RAG] Embeddings created."
)


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

print(
    f"[RAG] FAISS index ready: {index.ntotal} vectors"
)


# =====================================================
# DOMAIN KEYWORDS
# =====================================================

DOMAIN_KEYWORDS = {

    # -------------------------------------------------
    # IRRIGATION
    # -------------------------------------------------

    "irrigation": [

        "irrigation",
        "watering",
        "water",
        "overwatering",
        "underwatering",
        "water stress",
        "soil moisture",
        "dry soil",
        "wet soil",

        "ري",
        "الري",
        "مياه",
        "المياه",
        "الري الزائد",
        "زيادة الري",
        "افراط الري",
        "إفراط الري",
        "الري الناقص",
        "نقص الري",
        "نقص المياه",
        "قلة المياه",
        "عطش النبات",
        "عطشان",
        "مشكلة الري",

        "رطوبة التربة",
        "رطوبه التربه",
        "التربة رطبة",
        "التربة جافة",
        "تربة رطبة",
        "تربة جافة",
        "التربة عنده رطبة",
        "التربة عنده جافة",
        "رطبة",
        "رطبه",
        "جافة",
        "جافه",
    ],

    # -------------------------------------------------
    # SOIL
    # -------------------------------------------------

    "soil": [

        "soil",
        "soil condition",
        "soil quality",
        "soil moisture",
        "soil drainage",
        "soil compaction",
        "soil structure",

        "تربة",
        "التربة",
        "جودة التربة",
        "حالة التربة",
        "صرف التربة",
        "انضغاط التربة",
        "رطوبة التربة",
        "رطوبه التربه",
        "التربة رطبة",
        "التربة جافة",
        "تربة رطبة",
        "تربة جافة",
        "رطبة",
        "رطبه",
        "جافة",
        "جافه",
    ],

    # -------------------------------------------------
    # ROOTS
    # -------------------------------------------------

    "roots": [

        "root",
        "roots",
        "root problem",
        "root problems",
        "root damage",
        "root health",
        "root condition",
        "root rot",

        "جذر",
        "جذور",
        "الجذر",
        "الجذور",
        "مشكلة في الجذور",
        "مشاكل الجذور",
        "مشكلة الجذر",
        "صحة الجذور",
        "تلف الجذور",
        "تعفن الجذور",
        "عفن الجذور",
    ],

    # -------------------------------------------------
    # NUTRITION
    # -------------------------------------------------

    "nutrition": [

        "nutrition",
        "plant nutrition",
        "nutrient",
        "nutrients",
        "nutrient deficiency",
        "deficiency",
        "fertilizer",
        "fertilization",
        "nitrogen",
        "phosphorus",
        "potassium",
        "iron",
        "magnesium",

        "تغذية النبات",
        "تغذية",
        "العناصر الغذائية",
        "العناصر",
        "نقص العناصر",
        "نقص عنصر",
        "نقص المغذيات",
        "سماد",
        "التسميد",
        "نيتروجين",
        "فوسفور",
        "بوتاسيوم",
        "حديد",
        "ماغنسيوم",
        "مغنيسيوم",
    ],

    # -------------------------------------------------
    # YELLOWING
    # -------------------------------------------------

    "yellowing": [

        "yellow leaves",
        "yellowing",
        "leaf yellowing",

        "اصفرار",
        "اصفرار الأوراق",
        "اصفرار الورق",
        "الأوراق الصفراء",
        "ورق اصفر",
        "ورقة صفراء",
        "اوراق صفراء",
        "الورق بيصفر",
        "النبات بيصفر",
        "بتصفر",
        "بيصفر",
    ],

    # -------------------------------------------------
    # WILTING
    # -------------------------------------------------

    "wilting": [

        "wilting",
        "wilt",
        "wilted",
        "plant wilt",

        "ذبول",
        "يذبل",
        "النبات بيذبل",
        "النبات ذابل",
        "الأوراق ذابلة",
        "ورق ذابل",
    ],

    # -------------------------------------------------
    # DISEASE
    # -------------------------------------------------

    "disease": [

        "disease",
        "plant disease",
        "infection",
        "fungal",
        "bacterial",
        "virus",
        "pathogen",

        "مرض",
        "أمراض",
        "مرض نباتي",
        "عدوى",
        "فطري",
        "فطر",
        "بكتيري",
        "فيروس",
    ],

    # -------------------------------------------------
    # PESTS
    # -------------------------------------------------

    "pests": [

        "pest",
        "pests",
        "aphid",
        "whitefly",
        "thrips",
        "spider mite",
        "insect",

        "آفة",
        "آفات",
        "حشرة",
        "حشرات",
        "من",
        "الذبابة البيضاء",
        "تربس",
        "العنكبوت الأحمر",
    ],

    # -------------------------------------------------
    # TEMPERATURE
    # -------------------------------------------------

    "temperature": [

        "temperature",
        "heat",
        "cold",
        "heat stress",
        "cold stress",

        "حرارة",
        "درجة الحرارة",
        "الحر",
        "برد",
        "إجهاد حراري",
        "اجهاد حراري",
        "إجهاد البرد",
    ],

    # -------------------------------------------------
    # HUMIDITY
    # -------------------------------------------------

    "humidity": [

        "humidity",
        "air humidity",
        "relative humidity",

        "رطوبة الهواء",
        "الرطوبة",
        "رطوبه الهواء",
        "رطوبة الجو",
    ],

    # -------------------------------------------------
    # LIGHT
    # -------------------------------------------------

    "light": [

        "light",
        "lighting",
        "light intensity",
        "sunlight",

        "ضوء",
        "إضاءة",
        "شدة الضوء",
        "ضوء الشمس",
    ],

    # -------------------------------------------------
    # MONITORING
    # -------------------------------------------------

    "monitoring": [

        "monitoring",
        "monitor",
        "trend",
        "patterns",
        "sensor",
        "sensor data",
        "early warning",

        "مراقبة",
        "متابعة",
        "نمط",
        "أنماط",
        "بيانات",
        "حساس",
        "حساسات",
        "بيانات الحساسات",
        "إنذار مبكر",
    ],

    # -------------------------------------------------
    # GREENHOUSE
    # -------------------------------------------------

    "greenhouse": [

        "greenhouse",
        "protected cultivation",
        "ventilation",

        "صوبة",
        "الصوبة",
        "بيت محمي",
        "الزراعة المحمية",
        "تهوية",
    ],

    # -------------------------------------------------
    # LEAVES
    # -------------------------------------------------

    "leaves": [

        "leaf",
        "leaves",
        "leaf problem",
        "leaf symptoms",

        "ورقة",
        "ورق",
        "أوراق",
        "مشاكل الأوراق",
        "أعراض الأوراق",
    ],
}


# =====================================================
# TOPIC GROUPS
# =====================================================

TOPIC_GROUPS = {

    "irrigation": "water",
    "soil": "soil",
    "roots": "roots",
    "nutrition": "nutrition",
    "yellowing": "symptoms",
    "wilting": "symptoms",
    "disease": "disease",
    "pests": "pests",
    "temperature": "environment",
    "humidity": "environment",
    "light": "environment",
    "monitoring": "monitoring",
    "greenhouse": "greenhouse",
    "leaves": "symptoms",
}


# =====================================================
# IMPORTANT TOPICS
# =====================================================

SYMPTOM_TOPICS = {

    "yellowing",
    "wilting",
    "roots",
    "leaves",
}


DIAGNOSIS_TOPICS = {

    "irrigation",
    "soil",
    "roots",
    "nutrition",
    "yellowing",
    "wilting",
    "disease",
    "pests",
}


SOIL_TOPICS = {

    "soil",
    "irrigation",
    "roots",
}


# =====================================================
# PLANT KEYWORDS
# =====================================================

PLANT_KEYWORDS = {

    "tomato": [
        "tomato",
        "tomatoes",
        "طماطم",
    ],

    "apple": [
        "apple",
        "تفاح",
    ],

    "corn": [
        "corn",
        "maize",
        "ذرة",
        "الذرة",
    ],

    "potato": [
        "potato",
        "بطاطس",
        "البطاطس",
    ],

    "pepper": [
        "pepper",
        "فلفل",
    ],

    "cucumber": [
        "cucumber",
        "خيار",
    ],

    "lettuce": [
        "lettuce",
        "خس",
    ],

    "onion": [
        "onion",
        "بصل",
    ],

    "wheat": [
        "wheat",
        "قمح",
    ],
}


# =====================================================
# DISEASE KEYWORDS
# =====================================================

DISEASE_KEYWORDS = {

    "early blight": [
        "early blight",
        "اللفحة المبكرة",
        "الندوة المبكرة",
    ],

    "late blight": [
        "late blight",
        "اللفحة المتأخرة",
        "الندوة المتأخرة",
    ],

    "leaf spot": [
        "leaf spot",
        "بقع الأوراق",
        "تبقع الأوراق",
    ],

    "root rot": [
        "root rot",
        "تعفن الجذور",
        "عفن الجذور",
    ],

    "powdery mildew": [
        "powdery mildew",
        "البياض الدقيقي",
    ],

    "rust": [
        "rust",
        "الصدأ",
    ],
}


# =====================================================
# DETECT TOPICS
# =====================================================

def detect_topics(query):

    normalized_query = normalize_text(
        query
    )

    detected = set()

    for topic, keywords in DOMAIN_KEYWORDS.items():

        for keyword in keywords:

            normalized_keyword = normalize_text(
                keyword
            )

            if not normalized_keyword:
                continue

            if normalized_keyword in normalized_query:

                detected.add(
                    topic
                )

                break

    return detected


# =====================================================
# DETECT PLANT
# =====================================================

def detect_plant(query):

    normalized_query = normalize_text(
        query
    )

    detected = set()

    for plant, keywords in PLANT_KEYWORDS.items():

        for keyword in keywords:

            normalized_keyword = normalize_text(
                keyword
            )

            if (
                normalized_keyword
                and normalized_keyword
                in normalized_query
            ):

                detected.add(
                    plant
                )

                break

    return detected


# =====================================================
# DETECT DISEASE
# =====================================================

def detect_disease(query):

    normalized_query = normalize_text(
        query
    )

    detected = set()

    for disease, keywords in DISEASE_KEYWORDS.items():

        for keyword in keywords:

            normalized_keyword = normalize_text(
                keyword
            )

            if (
                normalized_keyword
                and normalized_keyword
                in normalized_query
            ):

                detected.add(
                    disease
                )

                break

    return detected


# =====================================================
# TOPIC KEYWORD MATCH
# =====================================================

def contains_topic_keyword(
    text,
    topic
):

    normalized = normalize_text(
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

        if (
            normalized_keyword
            and normalized_keyword
            in normalized
        ):

            return True

    return False


# =====================================================
# TITLE MATCH
# =====================================================

def title_matches_topic(
    title,
    topic
):

    return contains_topic_keyword(
        title,
        topic
    )


# =====================================================
# COMPLEX QUERY DETECTION
# =====================================================

def is_complex_query(query):

    normalized = normalize_text(
        query
    )

    detected_topics = detect_topics(
        normalized
    )

    comparison_words = [

        "فرق",
        "افرق",
        "أفرق",
        "مقارنة",
        "قارن",
        "بين",
        "ولا",
        "او",
        "أو",

        "versus",
        "vs",
        "difference",
        "compare",
        "between",
        "whether",
    ]

    symptom_words = [

        "اعراض",
        "أعراض",
        "علامات",
        "symptoms",
        "signs",

        "yellow",
        "yellowing",

        "اصفرار",
        "ذبول",
        "يذبل",
    ]

    detected_comparison = any(
        normalize_text(word)
        in normalized
        for word in comparison_words
    )

    detected_symptom = any(
        normalize_text(word)
        in normalized
        for word in symptom_words
    )

    # -------------------------------------------------
    # Multiple important topics
    # -------------------------------------------------

    if len(detected_topics) >= 2:
        return True

    # -------------------------------------------------
    # Comparison + symptom
    # -------------------------------------------------

    if (
        detected_comparison
        and detected_symptom
    ):
        return True

    # -------------------------------------------------
    # Long query
    # -------------------------------------------------

    if len(normalized.split()) >= 25:
        return True

    return False


# =====================================================
# SHORT QUERY DETECTION
# =====================================================

def is_short_query(query):

    words = normalize_text(
        query
    ).split()

    return len(words) <= 5


# =====================================================
# SEARCH
# =====================================================

def semantic_search(
    query,
    top_k=5
):

    if not query or not query.strip():
        return []

    normalized_query = normalize_text(
        query
    )

    # -------------------------------------------------
    # Query embedding
    # -------------------------------------------------

    query_embedding = embedding_model.encode(
        [normalized_query],
        normalize_embeddings=True,
        convert_to_numpy=True
    )

    # -------------------------------------------------
    # Search more candidates first
    # -------------------------------------------------

    search_k = max(
        top_k * SEARCH_MULTIPLIER,
        MIN_SEARCH_RESULTS
    )

    search_k = min(
        search_k,
        len(chunks)
    )

    if search_k <= 0:
        return []

    distances, indices = index.search(
        query_embedding,
        search_k
    )

    # -------------------------------------------------
    # Detect query information
    # -------------------------------------------------

    detected_topics = detect_topics(
        normalized_query
    )

    detected_plants = detect_plant(
        normalized_query
    )

    detected_diseases = detect_disease(
        normalized_query
    )

    complex_query = is_complex_query(
        normalized_query
    )

    short_query = is_short_query(
        normalized_query
    )

    candidates = []

    # =================================================
    # CANDIDATE SCORING
    # =================================================

    for rank, (distance, idx) in enumerate(
        zip(
            distances[0],
            indices[0]
        )
    ):

        if idx < 0:
            continue

        chunk = chunks[idx]

        title = chunk.get(
            "title",
            ""
        )

        content = chunk.get(
            "content",
            ""
        )

        plant = normalize_text(
            chunk.get(
                "plant",
                ""
            )
        )

        condition = normalize_text(
            chunk.get(
                "condition",
                ""
            )
        )

        category = normalize_text(
            chunk.get(
                "category",
                ""
            )
        )

        title_normalized = normalize_text(
            title
        )

        content_normalized = normalize_text(
            content
        )

        # -------------------------------------------------
        # Base semantic score
        # -------------------------------------------------

        score = float(
            distance
        )

        # =================================================
        # TITLE TOPIC BOOST
        # =================================================

        for topic in detected_topics:

            if title_matches_topic(
                title_normalized,
                topic
            ):

                score += 0.28

        # =================================================
        # CONTENT TOPIC BOOST
        # =================================================

        for topic in detected_topics:

            if contains_topic_keyword(
                content_normalized,
                topic
            ):

                score += 0.07

        # =================================================
        # PLANT BOOST
        # =================================================

        for detected_plant in detected_plants:

            if (
                detected_plant in plant
                or
                detected_plant
                in title_normalized
                or
                detected_plant
                in content_normalized
            ):

                score += 0.22

        # =================================================
        # DISEASE BOOST
        # =================================================

        for disease in detected_diseases:

            if (
                disease in condition
                or
                disease
                in title_normalized
                or
                disease
                in content_normalized
            ):

                score += 0.25

        # =================================================
        # CATEGORY BOOST
        # =================================================

        for topic in detected_topics:

            if topic in category:

                score += 0.12

        # =================================================
        # EXACT QUERY IN TITLE
        # =================================================

        if (
            normalized_query
            and normalized_query
            in title_normalized
        ):

            score += 0.35

        # =================================================
        # COMPLEX QUERY TOPIC COVERAGE
        # =================================================

        topic_coverage = 0

        for topic in detected_topics:

            if (
                contains_topic_keyword(
                    title_normalized,
                    topic
                )
                or
                contains_topic_keyword(
                    content_normalized,
                    topic
                )
            ):

                topic_coverage += 1

        if complex_query:

            score += (
                min(
                    topic_coverage,
                    5
                )
                * 0.08
            )

        # =================================================
        # SYMPTOM BOOST
        # =================================================

        symptom_detected_topics = (
            detected_topics.intersection(
                SYMPTOM_TOPICS
            )
        )

        if symptom_detected_topics:

            for symptom_topic in (
                symptom_detected_topics
            ):

                if title_matches_topic(
                    title_normalized,
                    symptom_topic
                ):

                    score += 0.20

        # =================================================
        # DIAGNOSIS BOOST
        # =================================================

        diagnosis_detected_topics = (
            detected_topics.intersection(
                DIAGNOSIS_TOPICS
            )
        )

        if diagnosis_detected_topics:

            matched_diagnosis_topics = 0

            for topic in detected_topics:

                if topic not in DIAGNOSIS_TOPICS:
                    continue

                if (
                    contains_topic_keyword(
                        title_normalized,
                        topic
                    )
                    or
                    contains_topic_keyword(
                        content_normalized,
                        topic
                    )
                ):

                    matched_diagnosis_topics += 1

            score += (
                min(
                    matched_diagnosis_topics,
                    4
                )
                * 0.06
            )

        # =================================================
        # SOIL / ROOT / IRRIGATION RELATIONSHIP
        # =================================================

        if detected_topics.intersection(
            SOIL_TOPICS
        ):

            soil_root_topics = {
                "soil",
                "irrigation",
                "roots",
            }

            matched = (
                detected_topics.intersection(
                    soil_root_topics
                )
            )

            if (
                "roots" in matched
                and (
                    "soil" in matched
                    or
                    "irrigation" in matched
                )
            ):

                if (
                    "root"
                    in title_normalized
                    or
                    "جذر"
                    in title_normalized
                    or
                    "soil"
                    in title_normalized
                    or
                    "ترب"
                    in title_normalized
                    or
                    "irrigation"
                    in title_normalized
                    or
                    "ري"
                    in title_normalized
                ):

                    score += 0.18

        # =================================================
        # SAVE CANDIDATE
        # =================================================

        candidates.append(
            {
                "score": score,

                "semantic_score": float(
                    distance
                ),

                "rank": rank,

                "index": idx,

                "title": title,

                "content": content,

                "plant": chunk.get(
                    "plant",
                    ""
                ),

                "condition": chunk.get(
                    "condition",
                    ""
                ),

                "category": chunk.get(
                    "category",
                    ""
                ),

                "source_type": chunk.get(
                    "source_type",
                    ""
                ),

                "source_name": chunk.get(
                    "source_name",
                    ""
                ),

                "source_url": chunk.get(
                    "source_url",
                    ""
                ),

                "year": chunk.get(
                    "year",
                    None
                ),
            }
        )

    # =====================================================
    # SORT CANDIDATES
    # =====================================================

    candidates.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    # =====================================================
    # COMPLEX QUERY DIVERSITY
    # =====================================================

    selected = []

    seen_titles = set()

    seen_topic_groups = set()

    for candidate in candidates:

        title = candidate[
            "title"
        ]

        # -------------------------------------------------
        # Avoid duplicate titles
        # -------------------------------------------------

        if title in seen_titles:
            continue

        # -------------------------------------------------
        # Detect candidate topics
        # -------------------------------------------------

        candidate_topics = detect_topics(
            (
                candidate["title"]
                + " "
                + candidate["content"]
            )
        )

        candidate_groups = {
            TOPIC_GROUPS.get(
                topic,
                topic
            )
            for topic in candidate_topics
        }

        topic_group = None

        if candidate_groups:

            topic_group = sorted(
                candidate_groups
            )[0]

        # -------------------------------------------------
        # Diversity for complex queries
        # -------------------------------------------------

        if complex_query:

            if (
                topic_group
                in seen_topic_groups
            ):

                if selected:

                    best_selected_score = max(
                        item["score"]
                        for item in selected
                    )

                    if candidate["score"] < (
                        best_selected_score
                        - 0.15
                    ):

                        continue

        selected.append(
            candidate
        )

        seen_titles.add(
            title
        )

        if topic_group:

            seen_topic_groups.add(
                topic_group
            )

        if len(selected) >= top_k:
            break

    # =====================================================
    # FINAL RELEVANCE FILTER
    # =====================================================

    final_results = []

    for candidate in selected:

        semantic_score = candidate[
            "semantic_score"
        ]

        candidate_text = (
            candidate["title"]
            + " "
            + candidate["content"]
        )

        candidate_topics = detect_topics(
            candidate_text
        )

        topic_match_count = len(
            detected_topics.intersection(
                candidate_topics
            )
        )

        # -------------------------------------------------
        # Complex query validation
        # -------------------------------------------------

        if complex_query:

            valid = (
                semantic_score >= 0.20
                or
                topic_match_count >= 2
                or
                (
                    topic_match_count >= 1
                    and
                    candidate["score"] >= 0.80
                )
            )

        # -------------------------------------------------
        # Normal query validation
        # -------------------------------------------------

        else:

            valid = (
                semantic_score >= 0.18
                or
                topic_match_count >= 1
                or
                candidate["score"] >= 0.70
            )

        if valid:

            final_results.append(
                candidate
            )

    return final_results[:top_k]

# =====================================================
# GET CONTEXT
# =====================================================

def get_context(
    query,
    top_k=5,
    plant=None,
    condition=None
):

    results = semantic_search(
        query=query,
        top_k=top_k
    )

    if not results:
        return "", []


    # =================================================
    # OPTIONAL DIAGNOSIS CONTEXT
    # =================================================

    if plant or condition:

        adjusted_results = []

        for result in results:

            score = float(
                result.get("score", 0)
            )

            result_plant = str(
                result.get("plant", "")
            ).lower()

            result_condition = str(
                result.get("condition", "")
            ).lower()


            # -----------------------------------------
            # Plant match
            # -----------------------------------------

            if plant:

                plant_text = str(
                    plant
                ).lower().strip()

                if (
                    plant_text
                    and plant_text in result_plant
                ):
                    score += 0.15


            # -----------------------------------------
            # Condition match
            # -----------------------------------------

            if condition:

                condition_text = str(
                    condition
                ).lower().strip()

                if (
                    condition_text
                    and condition_text in result_condition
                ):
                    score += 0.15


            result["score"] = score

            adjusted_results.append(
                result
            )


        # ---------------------------------------------
        # Re-sort after diagnosis boosting
        # ---------------------------------------------

        adjusted_results.sort(
            key=lambda x: float(
                x.get("score", 0)
            ),
            reverse=True
        )

        results = adjusted_results[:top_k]


    # =================================================
    # BUILD CONTEXT
    # =================================================

    context_parts = []

    for i, result in enumerate(
        results,
        start=1
    ):

        context_parts.append(
            f"""
SOURCE {i}
Title: {result.get("title", "")}
Plant: {result.get("plant", "")}
Condition: {result.get("condition", "")}
Category: {result.get("category", "")}
Source: {result.get("source_name", "")}
Content:
{result.get("content", "")}
""".strip()
        )


    context = "\n\n".join(
        context_parts
    )


    return context, results