"""
Core AI pipeline. Six independent functions, matching the product flow:

image -> analyze_product_image -> validate_attributes -> generate_catalog
      -> translate_catalog (optional) -> build_search_text -> generate_embedding

WHY functions instead of classes: each step is independently testable and
a beginner can read top-to-bottom without tracing object state.
"""

import json
import logging
import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import ValidationError

from schemas import ProductAttributes, ProductListing
from prompts import (
    IMAGE_ANALYSIS_SYSTEM_PROMPT,
    IMAGE_ANALYSIS_USER_PROMPT,
    CATALOG_GENERATION_PROMPT,
    TRANSLATION_PROMPT,
)

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_service")

# WHY read the key once at import time: fail fast if it's missing, instead
# of failing deep inside a request.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set. Copy .env.example to .env and fill it in.")

client = genai.Client(api_key=GEMINI_API_KEY)

# Verify this against https://ai.google.dev/gemini-api/docs/models before
# your demo — model names change. This is a reasonable default as of the
# current google-genai SDK.
MODEL_NAME = "gemini-2.0-flash"
EMBEDDING_MODEL_NAME = "text-embedding-004"

MAX_ATTEMPTS = 2  # one original call + one corrective retry


def _extract_json(raw_text: str) -> dict:
    """WHY: even with response_mime_type=json, models sometimes wrap output
    in markdown fences. Strip those defensively before parsing."""
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        # remove a leading "json" language hint if present
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    return json.loads(cleaned)


def analyze_product_image(image_bytes: bytes, mime_type: str) -> ProductAttributes:
    """Send an image to Gemini and return validated ProductAttributes.

    Retries once with a corrective instruction if the response is not
    valid JSON or fails schema validation. Never fabricates data on failure
    — raises instead, so the caller can surface a "review required" state.
    """
    last_error: Exception | None = None
    correction_note = ""

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            text_part = IMAGE_ANALYSIS_USER_PROMPT + correction_note

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=[image_part, text_part],
                config=types.GenerateContentConfig(
                    system_instruction=IMAGE_ANALYSIS_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                ),
            )

            parsed = _extract_json(response.text)
            return ProductAttributes(**parsed)

        except (json.JSONDecodeError, ValidationError) as exc:
            last_error = exc
            logger.warning("analyze_product_image attempt %s failed schema check", attempt)
            correction_note = (
                "\n\nYour previous response was invalid JSON or did not match "
                "the required schema. Return ONLY the JSON object, matching the "
                "exact fields requested, nothing else."
            )
        except Exception as exc:  # API-level errors (network, rate limit, etc.)
            last_error = exc
            logger.warning("analyze_product_image attempt %s API error: %s", attempt, type(exc).__name__)
            time.sleep(2 ** attempt)  # exponential backoff: 2s, 4s

    logger.error("analyze_product_image failed after %s attempts", MAX_ATTEMPTS)
    raise RuntimeError(f"Image analysis failed after retry: {last_error}")


def validate_attributes(attributes: ProductAttributes) -> ProductAttributes:
    """Business-level checks beyond what Pydantic already enforces.

    Pydantic already guarantees: confidence in [0,1], colors non-empty,
    correct types. This function adds marketplace-specific safety rules.
    """
    # WHY: if region was set but not backed by any visual_feature mention,
    # treat it as an unsupported claim and fall back to the safe default.
    if attributes.region is not None:
        region_supported = any(
            attributes.region.lower() in feature.lower()
            for feature in attributes.visual_features
        )
        if not region_supported:
            logger.info("Region '%s' not supported by visual_features — clearing it", attributes.region)
            attributes.region = None
            if "region" not in attributes.uncertain_fields:
                attributes.uncertain_fields.append("region")

    # WHY: every uncertain field should pull confidence down. This keeps
    # confidence meaningful instead of a number the model picked freely.
    if attributes.uncertain_fields and attributes.confidence > 0.6:
        logger.info("Lowering confidence because uncertain_fields is non-empty")
        attributes.confidence = 0.6

    return attributes


def generate_catalog(attributes: ProductAttributes) -> ProductListing:
    """Turn validated attributes into marketplace-ready listing text."""
    last_error: Exception | None = None
    attributes_json = attributes.model_dump_json()
    correction_note = ""

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            prompt = CATALOG_GENERATION_PROMPT.format(attributes_json=attributes_json)
            prompt += correction_note

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json"),
            )

            parsed = _extract_json(response.text)
            return ProductListing(**parsed)

        except (json.JSONDecodeError, ValidationError) as exc:
            last_error = exc
            logger.warning("generate_catalog attempt %s failed schema check", attempt)
            correction_note = (
                "\n\nYour previous response was invalid JSON or did not match "
                "the required schema. Return ONLY the JSON object with fields: "
                "title, short_description, description, tags, search_keywords."
            )
        except Exception as exc:
            last_error = exc
            logger.warning("generate_catalog attempt %s API error: %s", attempt, type(exc).__name__)
            time.sleep(2 ** attempt)

    logger.error("generate_catalog failed after %s attempts", MAX_ATTEMPTS)
    raise RuntimeError(f"Catalog generation failed after retry: {last_error}")


def translate_catalog(listing: ProductListing, language: str) -> ProductListing:
    """Translate a validated listing into another language, same schema."""
    last_error: Exception | None = None
    listing_json = listing.model_dump_json()
    correction_note = ""

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            prompt = TRANSLATION_PROMPT.format(language=language, listing_json=listing_json)
            prompt += correction_note

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json"),
            )

            parsed = _extract_json(response.text)
            return ProductListing(**parsed)

        except (json.JSONDecodeError, ValidationError) as exc:
            last_error = exc
            logger.warning("translate_catalog attempt %s failed schema check", attempt)
            correction_note = "\n\nReturn ONLY the JSON object, same fields as the input."
        except Exception as exc:
            last_error = exc
            logger.warning("translate_catalog attempt %s API error: %s", attempt, type(exc).__name__)
            time.sleep(2 ** attempt)

    logger.error("translate_catalog failed after %s attempts", MAX_ATTEMPTS)
    raise RuntimeError(f"Translation failed after retry: {last_error}")


def build_search_text(
    attributes: ProductAttributes,
    listing: ProductListing
) -> str:
    """
    Builds the canonical searchable text for CraftLink.

    No AI call is made here.

    The text combines:
    - product title
    - category
    - craft
    - material
    - colors
    - region
    - visual features
    - short description
    - detailed description
    - tags
    - buyer search keywords
    """

    parts = [
        listing.title,
        listing.short_description,
        listing.description,
        attributes.category,
        attributes.craft or "",
        attributes.material,
        " ".join(attributes.colors),
        attributes.region or "",
        " ".join(attributes.visual_features),
        " ".join(listing.tags),
        " ".join(listing.search_keywords),
    ]

    text = " ".join(
        str(part)
        for part in parts
        if part
    )

    return " ".join(
        text.lower().split()
    )