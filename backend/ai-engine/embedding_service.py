"""
Separated from ai_service.py on purpose: this is the exact boundary your
teammate's search/recommendation code will call. Keeping it isolated means
they don't need to import the whole AI pipeline just to embed text.
"""

import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set. Copy .env.example to .env and fill it in.")

client = genai.Client(api_key=GEMINI_API_KEY)

# Verify against https://ai.google.dev/gemini-api/docs/embeddings before demo.
EMBEDDING_MODEL_NAME = "text-embedding-004"


def generate_embedding(text: str) -> list[float]:
    """Return a float vector for the given text, for pgvector storage."""
    if not text or not text.strip():
        raise ValueError("Cannot embed empty text")

    result = client.models.embed_content(
        model=EMBEDDING_MODEL_NAME,
        contents=text,
    )
    return result.embeddings[0].values
