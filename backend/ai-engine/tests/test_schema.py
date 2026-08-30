"""
Schema and validator tests. No Gemini API calls — these run offline and
free, proving the data contract is correct before you spend API quota.

Run with: pytest tests/
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from pydantic import ValidationError

from schemas import ProductAttributes, ProductListing
from validators import validate_attributes_business_rules


def make_valid_attributes(**overrides) -> dict:
    base = {
        "category": "Textile",
        "craft": "Madhubani",
        "material": "Cotton fabric",
        "colors": ["red", "black"],
        "region": None,
        "visual_features": ["fish motifs"],
        "confidence": 0.8,
        "uncertain_fields": [],
    }
    base.update(overrides)
    return base


def test_valid_attributes_pass():
    attrs = ProductAttributes(**make_valid_attributes())
    assert attrs.category == "Textile"
    assert attrs.confidence == 0.8


def test_confidence_out_of_range_rejected():
    with pytest.raises(ValidationError):
        ProductAttributes(**make_valid_attributes(confidence=1.5))

    with pytest.raises(ValidationError):
        ProductAttributes(**make_valid_attributes(confidence=-0.1))


def test_empty_colors_rejected():
    with pytest.raises(ValidationError):
        ProductAttributes(**make_valid_attributes(colors=[]))


def test_region_can_be_null():
    attrs = ProductAttributes(**make_valid_attributes(region=None))
    assert attrs.region is None


def test_uncertain_fields_can_be_empty():
    attrs = ProductAttributes(**make_valid_attributes(uncertain_fields=[]))
    assert attrs.uncertain_fields == []


def test_business_rules_reject_unsupported_region():
    # region claimed but not backed by any visual_features mention
    attrs = ProductAttributes(
        **make_valid_attributes(
            region="Bihar",
            visual_features=["fish motifs", "geometric border"],
        )
    )
    validated = validate_attributes_business_rules(attrs)
    assert validated.region is None
    assert "region" in validated.uncertain_fields


def test_business_rules_keep_supported_region():
    attrs = ProductAttributes(
        **make_valid_attributes(
            region="Bihar",
            visual_features=["Bihar style border pattern"],
        )
    )
    validated = validate_attributes_business_rules(attrs)
    assert validated.region == "Bihar"


def test_listing_schema_valid():
    listing = ProductListing(
        title="Hand-Painted Cotton Textile",
        short_description="A cotton textile with hand-painted motifs.",
        description="This textile displays traditional motifs painted by hand.",
        tags=["madhubani", "textile"],
        search_keywords=["madhubani painting", "hand painted textile"],
    )
    assert listing.title.startswith("Hand-Painted")
