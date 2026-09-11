# =====================================================
# KHADRWY - RAG GENERATOR
# =====================================================

import os

from dotenv import load_dotenv
from google import genai

from backend.rag.retriever import get_context


# =====================================================
# LOAD ENVIRONMENT VARIABLES
# =====================================================

load_dotenv()


# =====================================================
# GEMINI CONFIGURATION
# =====================================================

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash"
)


if not GEMINI_API_KEY:

    raise ValueError(
        "GEMINI_API_KEY is not set in the .env file."
    )


# =====================================================
# GEMINI CLIENT
# =====================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


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
    # RETRIEVE RELEVANT AGRICULTURAL INFORMATION
    # =================================================

    context, results = get_context(
        query=query,
        top_k=top_k,
        plant=plant,
        condition=condition
    )


    # =================================================
    # BUILD DIAGNOSIS CONTEXT
    # =================================================

    diagnosis_context = ""

    if plant:

        diagnosis_context += f"""
Detected Plant:
{plant}
"""

    if condition:

        diagnosis_context += f"""
Detected Condition:
{condition}
"""

    if confidence is not None:

        diagnosis_context += f"""
Model Prediction Confidence:
{confidence}%
"""


    # =================================================
    # HANDLE EMPTY RETRIEVAL
    # =================================================

    if not context:

        context = """
No relevant agricultural information was retrieved
from the knowledge base.
"""


    # =================================================
    # DEBUG RETRIEVED CONTEXT
    # =================================================

    print("\n" + "=" * 70)
    print("RAG DEBUG - RETRIEVED CONTEXT")
    print("=" * 70)

    print(context)

    print("=" * 70)
    print("RAG DEBUG - RESULTS")
    print("=" * 70)

    print(results)

    print("=" * 70 + "\n")


    # =================================================
    # RAG PROMPT
    # =================================================

    prompt = f"""
You are Khadrwy AI, an intelligent agricultural assistant.

Your job is to answer agricultural questions using the
retrieved agricultural knowledge provided below.

=====================================================
LANGUAGE
=====================================================

- Detect the language of the user's question.
- If the question is Arabic, answer in Arabic.
- If the question is English, answer in English.
- If the question is mixed, answer naturally using the
  same language style as the user.

=====================================================
CORE KNOWLEDGE RULE
=====================================================

The retrieved agricultural information is your primary
source of truth.

Use only information supported by the retrieved knowledge.

You may combine multiple retrieved sources when they are
clearly relevant to the user's question.

Do NOT invent agricultural information.

Do NOT add information that is not supported by the
retrieved knowledge.

=====================================================
STRICTLY DO NOT INVENT
=====================================================

Do NOT invent:

- pesticides
- chemicals
- pesticide names
- chemical doses
- fertilizer doses
- treatment schedules
- irrigation schedules
- disease causes
- disease symptoms
- agricultural measurements
- unsupported treatments
- unsupported prevention methods

If the retrieved information does not contain enough
information to answer the user's question, clearly say
that there is not enough information in the knowledge base.

Arabic response:

"ليس لدي معلومات كافية في قاعدة المعرفة الخاصة بي للإجابة عن هذا السؤال."

English response:

"I don't have enough information in my knowledge base to answer this."

=====================================================
PLANT DIAGNOSIS CONTEXT
=====================================================

The following information comes from the plant detection
model.

Treat it as a MODEL PREDICTION, not as confirmed truth.

{diagnosis_context}

IMPORTANT:

- Do not describe the prediction as 100% certain.
- Do not treat the confidence score as medical or scientific
  certainty.
- Use the detected plant and condition only when relevant
  to the user's question.
- If the user's question is unrelated to the detected
  condition, answer the general agricultural question
  instead of forcing the diagnosis into the answer.

=====================================================
RETRIEVED AGRICULTURAL KNOWLEDGE
=====================================================

{context}

=====================================================
USER QUESTION
=====================================================

{query}

=====================================================
ANSWER RULES
=====================================================

1. Answer the user's exact question.

2. Keep the answer concise and practical.

3. If the user asks about symptoms:
   - Give only symptoms supported by the retrieved knowledge.

4. If the user asks about management:
   - Give only management practices supported by the
     retrieved knowledge.

5. If the user asks about irrigation:
   - Use irrigation and soil-moisture information when
     relevant.

6. If the user asks about environmental conditions:
   - Use temperature, humidity, light, soil moisture,
     or air circulation information when available.

7. If the user asks about the detected disease:
   - Use the diagnosis context together with the retrieved
     knowledge.

8. If the user asks a general agricultural question:
   - Do not force the detected plant or disease into the
     answer unless it is relevant.

9. If there is insufficient relevant information:
   - Say that the knowledge base does not contain enough
     information.

10. Never mention:
   - RAG
   - FAISS
   - embeddings
   - vector database
   - prompts
   - retrieval
   - internal system architecture

=====================================================
ANSWER FORMAT
=====================================================

Use a clear and natural response.

For lists, use bullet points.

Do not create unnecessary sections.

Do not repeat the user's question.

Do not mention confidence unless it is directly relevant
to interpreting the model prediction.

=====================================================
FINAL ANSWER
=====================================================
"""


    # =================================================
    # GENERATE RESPONSE
    # =================================================

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt
    )


    # =================================================
    # RETURN RESPONSE
    # =================================================

    return {
        "answer": response.text,

        "sources": [
            {
                "title": result["title"],
                "score": round(
                    result["score"],
                    4
                )
            }

            for result in results
        ]
    }