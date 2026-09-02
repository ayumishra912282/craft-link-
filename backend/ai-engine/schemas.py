"""
Data contract for the AI module.

WHY this file exists: every function in the pipeline (analysis, validation,
catalog generation, translation) passes data through these two shapes.
Keeping them in one place means the FastAPI layer, the AI layer, and the
tests all agree on what "valid" data looks like.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class ProductAttributes(BaseModel):
    """What the AI extracted from a product image.

    WHY nullable region: we never want the AI to guess where something is
    from just because it "looks" a certain way. Null is the safe default.
    """

    category: str = Field(..., description="e.g. Textile, Pottery, Jewellery")
    craft: Optional[str] = Field(None, description="e.g. Madhubani, Blue Pottery")
    material: str = Field(..., description="Visually inferred material")
    colors: List[str] = Field(..., description="Predominant colors visible")
    region: Optional[str] = Field(None, description="Only set if visually certain")
    visual_features: List[str] = Field(
        default_factory=list, description="Patterns, motifs, shapes observed"
    )
    confidence: float = Field(..., ge=0.0, le=1.0, description="Overall confidence 0-1")
    uncertain_fields: List[str] = Field(
        default_factory=list, description="Field names the AI is not sure about"
    )

    @field_validator("colors")
    @classmethod
    def colors_not_empty(cls, value: List[str]) -> List[str]:
        # WHY: an empty color list almost always means the model failed to
        # look at the image properly rather than "no colors exist".
        if len(value) == 0:
            raise ValueError("colors must not be empty")
        return value


class ProductListing(BaseModel):
    """Marketplace-ready text generated from validated attributes."""

    title: str = Field(..., description="Short marketplace title, 5-10 words")
    short_description: str = Field(..., description="1-2 sentence summary")
    description: str = Field(..., description="3-5 sentence detailed description")
    tags: List[str] = Field(..., description="Filterable tags")
    search_keywords: List[str] = Field(..., description="Buyer search terms")
