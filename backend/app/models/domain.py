# Domain models
from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime

@dataclass
class Product:
    id: str
    artisan_id: str
    artisan_name: str
    title: str
    description: str
    short_description: str
    category: str
    craft_type: str
    material: str
    colors: List[str]
    region: str
    state: str
    price: Optional[float]
    tags: List[str]
    buyer_segments: List[str]
    craft_story: str
    image_url: str
    status: str
    ai_generated: bool
    views: int = 0
    created_at: str = ''
    updated_at: str = ''
    embedding: Optional[List[float]] = None
