"""
Standalone validation logic, importable by tests without hitting the
Gemini API. Mirrors the business checks used inside ai_service.py so both
production code and tests share one source of truth.
"""

import logging
import time
from typing import Callable, TypeVar

from schemas import ProductAttributes

logger = logging.getLogger("validators")

T = TypeVar("T")


def validate_attributes_business_rules(attributes: ProductAttributes) -> ProductAttributes:
    """Reject unsupported region claims and keep confidence honest.

    Same logic as ai_service.validate_attributes — kept here as the
    testable, side-effect-free version.
    """
    if attributes.region is not None:
        region_supported = any(
            attributes.region.lower() in feature.lower()
            for feature in attributes.visual_features
        )
        if not region_supported:
            attributes.region = None
            if "region" not in attributes.uncertain_fields:
                attributes.uncertain_fields.append("region")

    if attributes.uncertain_fields and attributes.confidence > 0.6:
        attributes.confidence = 0.6

    return attributes


def with_retry(fn: Callable[[], T], max_attempts: int = 2, base_delay: float = 1.0) -> T:
    """Generic retry wrapper with exponential backoff.

    WHY generic: both image analysis and catalog generation need the same
    "try, wait, try once more" shape. This avoids duplicating that logic.
    """
    last_error: Exception | None = None

    for attempt in range(1, max_attempts + 1):
        try:
            return fn()
        except Exception as exc:
            last_error = exc
            logger.warning("Attempt %s/%s failed: %s", attempt, max_attempts, type(exc).__name__)
            if attempt < max_attempts:
                delay = base_delay * (2 ** (attempt - 1))
                time.sleep(delay)

    raise RuntimeError(f"All {max_attempts} attempts failed: {last_error}")
