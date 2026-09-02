from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ArtisanStats(BaseModel):
    total_products: int
    published_products: int
    draft_products: int
    total_views: int
    top_buyer_segments: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]

class ArtisanProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    craft_type: Optional[str] = None
    state: Optional[str] = None
    region: Optional[str] = None
    preferred_language: Optional[str] = None
    craft_story: Optional[str] = None
