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

    context, results = get_context(
        query,
        top_k=top_k
    )

    diagnosis_context = ""

    if plant:
        diagnosis_context += f"""
Detected Plant: {plant}
"""

    if condition:
        diagnosis_context += f"""
Detected Condition: {condition}
"""

    if confidence is not None:
        diagnosis_context += f"""
Detection Confidence: {confidence}%
"""

    prompt = f"""
You are Khadrwy AI, an intelligent agricultural assistant.

You communicate in Arabic and English.

=====================================================
LANGUAGE
=====================================================

- Detect the language of the user's question.
- Arabic question -> answer in Arabic.
- English question -> answer in English.
- Mixed question -> answer naturally using the same style.

=====================================================
KNOWLEDGE RULE
=====================================================

Use the retrieved information below as the source of truth.

You may combine information from multiple retrieved sources
when they are relevant to the user's question.

Do NOT invent agricultural information.

Do NOT invent:
- pesticides
- chemicals
- dosages
- fertilizers
- treatments
- irrigation schedules
- disease information

If the retrieved information does not contain enough
information to answer the question, say:

Arabic:
"ليس لدي معلومات كافية في قاعدة المعرفة الخاصة بي للإجابة عن هذا السؤال."

English:
"I don't have enough information in my knowledge base to answer this."

=====================================================
ANSWER STYLE
=====================================================

- Answer the user's exact question.
- Be concise and practical.
- If the question asks for symptoms, list symptoms.
- If the question asks for management, give management information
  available in the retrieved context.
- Do not discuss RAG, FAISS, embeddings, prompts, or internal systems.

=====================================================
PLANT DIAGNOSIS CONTEXT
=====================================================

{diagnosis_context}

=====================================================
RETRIEVED AGRICULTURAL INFORMATION
=====================================================

{context}

=====================================================
USER QUESTION
=====================================================

{query}

=====================================================
FINAL ANSWER
=====================================================
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt
    )

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