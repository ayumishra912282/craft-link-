from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ImageAnalysisRequest(BaseModel):
    image_base64: Optional[str] = None
    image_url: Optional[str] = None
    craft_hint: Optional[str] = None

class ImageAnalysisResponse(BaseModel):
    product_type: str
    craft: str
    material: str
    colors: List[str]
    region: str
    state: str
    category: str
    style: str
    keywords: List[str]
    visual_characteristics: List[str]
    confidence_score: float = 0.95
    is_demo_mode: bool = False

class CatalogGenerationRequest(BaseModel):
    product_type: str
    craft: str
    material: str
    colors: List[str]
    region: str
    state: str
    category: str
    keywords: List[str]
    artisan_name: Optional[str] = 'Master Artisan'
    craft_notes: Optional[str] = None
    suggested_price: Optional[float] = None
    language: Optional[str] = 'en'

class CatalogGenerationResponse(BaseModel):
    title: str
    title_hindi: Optional[str] = None
    description: str
    description_hindi: Optional[str] = None
    short_description: str
    category: str
    craft_type: str
    material: str
    colors: List[str]
    region: str
    state: str
    suggested_price: Optional[float] = 1200.0
    tags: List[str]
    buyer_segments: List[str]
    craft_story: str
    craft_story_hindi: Optional[str] = None
    keywords: List[str]
    seo_metadata: Dict[str, Any] = {}
    is_demo_mode: bool = False

class SemanticSearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    craft_type: Optional[str] = None
    material: Optional[str] = None
    region: Optional[str] = None
    state: Optional[str] = None
    limit: int = 12

class SearchMatchReason(BaseModel):
    product_id: str
    reasons: List[str]
    similarity_score: float

class SemanticSearchResponse(BaseModel):
    query: str
    interpreted_intent: str
    detected_craft: Optional[str] = None
    detected_region: Optional[str] = None
    detected_category: Optional[str] = None
    total_matches: int
    products: List[Any]
    match_reasons: Dict[str, List[str]]
    is_demo_mode: bool = False
