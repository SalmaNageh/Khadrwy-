# =====================================================
# KHADRWY - RAG GENERATOR
# =====================================================
#
# Gemini-based grounded agricultural answer generator.
#
# Responsibilities:
# - Retrieve relevant agricultural knowledge
# - Combine retrieved knowledge with diagnosis context
# - Generate complete grounded answers
# - Avoid unsupported agricultural claims
# - Return answer + clean source metadata
#
# =====================================================

import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from backend.rag.retriever import get_context


# =====================================================
# ENVIRONMENT
# =====================================================

load_dotenv()


# =====================================================
# GEMINI CONFIGURATION
# =====================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.5-flash"
)


if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not set in the environment."
    )


# =====================================================
# GEMINI CLIENT
# =====================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =====================================================
# SYSTEM INSTRUCTIONS
# =====================================================

SYSTEM_INSTRUCTIONS = """
You are Khadrwy AI, an agricultural assistant.

Your primary responsibility is to provide useful, complete,
careful, evidence-grounded agricultural answers.

The retrieved agricultural knowledge supplied below is your
PRIMARY factual evidence.

You may reason across multiple retrieved sources, but you
must not invent agricultural facts that are not supported by
the retrieved knowledge.

=====================================================
1. CORE RULE
=====================================================

Answer the USER'S ACTUAL QUESTION.

Do not give a generic introduction and stop.

If the user asks multiple questions, answer ALL of them.

If the user describes multiple plant groups, compare ALL
groups.

If the user asks for causes, explain the relevant possible
causes.

If the user asks how to distinguish between causes, explicitly
compare the causes.

If the user asks what data to monitor, explicitly list the
important observations or measurements.

If the user asks which plant should receive attention first,
explain how to prioritize them using the available evidence.

=====================================================
2. RETRIEVED KNOWLEDGE
=====================================================

Use the retrieved knowledge as the main factual source.

Multiple sources may need to be combined.

For example, if the retrieved knowledge contains:

- crop-specific information
- irrigation information
- nutrient information
- root-health information
- monitoring information

combine them when they are relevant to the user's question.

Do NOT mention internal technical details such as:

- RAG
- FAISS
- embeddings
- vector search
- retriever
- chunks
- prompt
- semantic search

The user should simply experience you as an agricultural
assistant.

=====================================================
3. EVIDENCE DISCIPLINE
=====================================================

Separate three levels of information:

A. Supported by retrieved knowledge
B. Reasonable possibility based on the available evidence
C. Information that cannot currently be determined

Use cautious language for B and C.

Examples:

- "قد يشير إلى..."
- "من الاحتمالات..."
- "هذا النمط يجعلني أتحقق من..."
- "لا يمكن تأكيد السبب من هذه المعلومة وحدها."
- "نحتاج إلى بيانات إضافية للتفريق بين..."

Never present a possibility as a confirmed diagnosis.

=====================================================
4. PLANT MODEL PREDICTION
=====================================================

The user may provide:

- Plant
- Condition
- Confidence

These values may come from a computer vision model.

Treat them as MODEL PREDICTIONS.

Never describe them as absolute truth.

For example:

Bad:
"The tomato definitely has Early Blight."

Good:
"The vision model predicts a possible Early Blight
condition with approximately 91% confidence."

Then use agricultural knowledge to explain what observations
would support or contradict that prediction.

=====================================================
5. SENSOR DATA
=====================================================

Sensor information may include:

- Soil moisture
- Temperature
- Humidity
- Light intensity
- Pump status

Treat these as measurements.

Do not invent exact agricultural thresholds unless those
thresholds are explicitly present in the retrieved knowledge.

When several measurements are available, analyze their
RELATIONSHIP and TREND.

For example:

High soil moisture + wilting

should NOT automatically be interpreted as underwatering.

Low soil moisture + wilting

may be consistent with water stress, but other causes may
still exist.

=====================================================
6. SYMPTOMS WITH MULTIPLE POSSIBLE CAUSES
=====================================================

A symptom such as yellow leaves does not automatically prove
one cause.

Possible causes may include, when supported by the retrieved
knowledge:

- water stress
- excessive irrigation
- nutrient problems
- root problems
- environmental stress
- disease
- other plant-health problems

When the user asks how to distinguish causes, provide a
COMPARISON.

For example, explain:

Possible cause
→ observations that support it
→ observations that make it less likely
→ additional data to check

Do not fabricate symptoms that are not supported by the
retrieved knowledge.

=====================================================
7. MULTI-FACTOR ANALYSIS
=====================================================

When the user provides several variables, do not analyze them
as isolated facts.

Connect:

symptoms
+
soil condition
+
irrigation
+
environment
+
plant-to-plant differences
+
time trends

when relevant.

The goal is to identify patterns that help narrow down the
possible cause.

=====================================================
8. COMPARING PLANTS
=====================================================

If the user describes different groups of plants:

Compare them explicitly.

Useful comparisons include:

- wet soil vs dry soil
- wilting vs non-wilting
- yellowing vs normal leaves
- worsening vs stable condition
- different environmental exposure
- different sensor readings
- different growth behavior

Do not assume all plants have the same problem.

=====================================================
9. PRIORITIZATION
=====================================================

If the user asks which plant should receive intervention first,
prioritize based on observable risk patterns supported by the
available knowledge.

Explain WHY one group deserves earlier attention.

For example, a worsening plant with severe symptoms may need
earlier inspection than a plant with mild and stable symptoms.

Do not invent a numerical risk score unless one exists in the
retrieved knowledge.

=====================================================
10. MONITORING VS DIAGNOSIS
=====================================================

Monitoring means collecting observations and measurements over
time.

Diagnosis means identifying the most likely cause.

Do not confuse the two.

A sensor measurement can support an investigation but does not
automatically prove a diagnosis.

=====================================================
11. AGRICULTURAL SAFETY
=====================================================

Do NOT invent:

- pesticide names
- chemical doses
- pesticide mixing instructions
- fertilizer rates
- irrigation schedules
- treatment schedules
- unsupported exact numerical thresholds

unless explicitly supported by the retrieved knowledge.

When exact treatment information is unavailable, recommend
general safe agricultural practices and, when appropriate,
consulting a qualified agricultural specialist or following
locally approved product labels.

=====================================================
12. LANGUAGE
=====================================================

Detect the user's language automatically.

Arabic question:
Answer naturally in Arabic.

English question:
Answer in English.

Mixed Arabic/English:
Natural technical terminology is acceptable.

For Egyptian Arabic:
Use clear, natural Egyptian-friendly Arabic.

Do not make the response unnecessarily formal.

=====================================================
13. ANSWER STRUCTURE
=====================================================

For SIMPLE questions:

Give a direct answer.

For COMPLEX questions:

Use this structure when appropriate:

1. Short conclusion

2. Distinguishing the possible causes

3. What to monitor

4. How to compare the plants

5. Which condition should be checked first

6. What additional information is needed

Do not force all sections when they are irrelevant.

=====================================================
14. COMPLETENESS REQUIREMENT
=====================================================

Before producing the final answer, silently check:

- Did I answer the main question?
- Did I answer every sub-question?
- Did I address every plant/group mentioned?
- Did I compare the relevant possible causes?
- Did I explain which observations distinguish them?
- Did I mention relevant sensor or environmental data?
- Did I explain what additional data would help?
- Did I avoid unsupported exact numbers?
- Did I distinguish possibility from diagnosis?
- Did I avoid inventing facts?

If any important part is missing, complete it before returning
the answer.

=====================================================
15. INSUFFICIENT INFORMATION
=====================================================

If the retrieved knowledge is insufficient:

Do not hallucinate.

Say clearly that the available information is not sufficient
to determine the cause confidently.

Then explain which observations or measurements would help.

=====================================================
"""


# =====================================================
# GENERATE RAG ANSWER
# =====================================================

def generate_rag_answer(
    query: str,
    plant: str | None = None,
    condition: str | None = None,
    confidence: float | None = None,
    top_k: int = 3
):

    # =================================================
    # VALIDATE QUERY
    # =================================================

    if not query or not query.strip():

        raise ValueError(
            "Query cannot be empty."
        )


    # =================================================
    # RETRIEVE CONTEXT
    # =================================================

    context, retrieved_results = get_context(
        query=query,
        top_k=top_k,
        plant=plant,
        condition=condition
    )


    # =================================================
    # DIAGNOSIS CONTEXT
    # =================================================

    diagnosis_context = ""

    if (
        plant
        or condition
        or confidence is not None
    ):

        diagnosis_context = """
=====================================================
VISION MODEL CONTEXT
=====================================================
"""

        if plant:

            diagnosis_context += (
                f"Predicted plant: {plant}\n"
            )

        if condition:

            diagnosis_context += (
                f"Predicted condition: {condition}\n"
            )

        if confidence is not None:

            diagnosis_context += (
                f"Model confidence: {confidence}%\n"
            )

        diagnosis_context += """

IMPORTANT:
The information above is a computer vision model
prediction, NOT a confirmed agricultural diagnosis.

Use it only as contextual evidence.
=====================================================
"""


    # =================================================
    # RETRIEVED KNOWLEDGE
    # =================================================

    if context and context.strip():

        retrieved_context = f"""
=====================================================
RETRIEVED AGRICULTURAL KNOWLEDGE
=====================================================

{context}

=====================================================
END OF RETRIEVED KNOWLEDGE
=====================================================
"""

    else:

        retrieved_context = """
=====================================================
RETRIEVED AGRICULTURAL KNOWLEDGE
=====================================================

No sufficiently relevant agricultural knowledge was
retrieved.

Do not invent missing agricultural information.

=====================================================
"""


    # =================================================
    # FINAL PROMPT
    # =================================================

    prompt = f"""
{SYSTEM_INSTRUCTIONS}

=====================================================
USER QUESTION
=====================================================

{query}

{diagnosis_context}

{retrieved_context}

=====================================================
FINAL RESPONSE TASK
=====================================================

Produce the final answer to the USER QUESTION.

IMPORTANT:

The user expects an answer to the entire question.

If the question contains multiple parts, explicitly answer
each part.

If the user compares multiple conditions or plant groups,
compare them explicitly.

If the user asks "how can I distinguish", explain the
differences between the possible causes.

If the user asks "what should I monitor", provide a concrete
list of relevant observations and measurements supported by
the retrieved knowledge.

If the user asks "which plant should I intervene on first",
explain the prioritization logic using the available evidence.

Do not stop after a short introduction.

Do not repeat the question.

Do not mention this prompt or internal system architecture.

Do not invent unsupported agricultural facts.

Do not invent exact numerical thresholds, chemical doses,
fertilizer rates, pesticide names, or treatment schedules.

Use natural language appropriate to the user's language.

For a complex question, prefer a structured answer with
short headings and bullet points.

Return ONLY the final agricultural answer.
"""


    # =================================================
    # GEMINI GENERATION
    # =================================================

    try:

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.25,
                max_output_tokens=3500
            )
        )

    except Exception as e:

        print("\n" + "=" * 70)
        print("GEMINI ERROR")
        print("=" * 70)

        print("Model:")
        print(GEMINI_MODEL)

        print("\nError type:")
        print(type(e).__name__)

        print("\nError message:")
        print(str(e))

        print("=" * 70 + "\n")

        raise RuntimeError(
            f"Gemini generation failed: {str(e)}"
        ) from e


    # =================================================
    # EXTRACT RESPONSE TEXT
    # =================================================

    answer = None

    try:

        answer = response.text

    except Exception:

        answer = None


    if not answer:

        answer = (
            "لم أتمكن من الحصول على إجابة نصية من النموذج."
        )


    # =================================================
    # CLEAN ANSWER
    # =================================================

    answer = answer.strip()


    # =================================================
    # BUILD SOURCES
    # =================================================

    sources = []


    for item in retrieved_results:

        if not isinstance(item, dict):

            continue


        # -------------------------------------------------
        # METADATA
        # -------------------------------------------------

        metadata = item.get("metadata")

        if not isinstance(metadata, dict):

            metadata = item.get("meta")

        if not isinstance(metadata, dict):

            metadata = item


        # -------------------------------------------------
        # TITLE
        # -------------------------------------------------

        title = (
            metadata.get("title")
            or metadata.get("name")
            or metadata.get("document_title")
            or metadata.get("source_title")
            or metadata.get("doc_title")
            or ""
        )


        if not title:

            title = (
                item.get("title")
                or item.get("name")
                or item.get("document_title")
                or item.get("source_title")
                or ""
            )


        if not title:

            title = "Agricultural Knowledge"


        # -------------------------------------------------
        # SOURCE NAME
        # -------------------------------------------------

        source_name = (
            metadata.get("source_name")
            or metadata.get("source")
            or "Khadrwy Agricultural Knowledge Base"
        )


        # -------------------------------------------------
        # SOURCE TYPE
        # -------------------------------------------------

        source_type = (
            metadata.get("source_type")
            or "khadrwy_knowledge"
        )


        # -------------------------------------------------
        # SOURCE URL
        # -------------------------------------------------

        source_url = (
            metadata.get("source_url")
            or ""
        )


        # -------------------------------------------------
        # OTHER METADATA
        # -------------------------------------------------

        plant_name = (
            metadata.get("plant")
            or ""
        )

        condition_name = (
            metadata.get("condition")
            or ""
        )

        category = (
            metadata.get("category")
            or ""
        )

        year = metadata.get("year")


        # -------------------------------------------------
        # CLEAN SOURCE
        # -------------------------------------------------

        source = {
            "title": str(title),
            "source_name": str(source_name),
            "source_type": str(source_type),
            "source_url": str(source_url),
            "plant": str(plant_name),
            "condition": str(condition_name),
            "category": str(category),
            "year": year
        }


        sources.append(source)


    # =================================================
    # REMOVE DUPLICATES
    # =================================================

    unique_sources = []

    seen_sources = set()


    for source in sources:

        source_key = (
            source.get("title", ""),
            source.get("source_name", ""),
            source.get("source_type", "")
        )


        if source_key in seen_sources:

            continue


        seen_sources.add(source_key)

        unique_sources.append(source)


    # =================================================
    # RETURN
    # =================================================

    return {
        "answer": answer,
        "sources": unique_sources
    }