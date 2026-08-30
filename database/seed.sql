"""
Central embedding service for CraftLink.

All product/catalog/search code should call this module instead
of talking directly to the Gemini embedding API.

The Supabase products.embedding column is vector(768), so this
service always returns exactly 768 floating-point values.
"""

import os

from dotenv import load_dotenv
from google import genai
from google.genai import types


# ============================================================
# 1. LOAD ENVIRONMENT
# ============================================================

load_dotenv()

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not set."
    )


# ============================================================
# 2. GEMINI CLIENT
# ============================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ============================================================
# 3. EMBEDDING CONFIGURATION
# ============================================================

EMBEDDING_MODEL_NAME = (
    "gemini-embedding-2"
)

EMBEDDING_DIMENSION = 768


# ============================================================
# 4. GENERATE EMBEDDING
# ============================================================

def generate_embedding(
    text: str
) -> list[float]:

    """
    Generate a 768-dimensional embedding for text.

    This function is used by:
      - catalog/product embedding
      - buyer search queries
      - recommendations
    """

    if not text or not text.strip():

        raise ValueError(
            "Cannot embed empty text."
        )

    result = client.models.embed_content(
        model=EMBEDDING_MODEL_NAME,
        contents=text,
        config=types.EmbedContentConfig(
            output_dimensionality=EMBEDDING_DIMENSION
        )
    )

    if not result.embeddings:

        raise RuntimeError(
            "Gemini returned no embedding."
        )

    vector = (
        result.embeddings[0].values
    )

    if not vector:

        raise RuntimeError(
            "Gemini returned an empty embedding."
        )

    if len(vector) != EMBEDDING_DIMENSION:

        raise RuntimeError(
            "Unexpected embedding dimension: "
            f"{len(vector)}; expected "
            f"{EMBEDDING_DIMENSION}."
        )

    return list(vector)