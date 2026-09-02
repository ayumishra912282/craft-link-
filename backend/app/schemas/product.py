from pydantic import BaseModel, Field
from typing import List, Optional

class ProductBase(BaseModel):
    title: str = Field(..., min_length=2)
    description: str
    short_description: Optional[str] = None
    category: str
    craft_type: str
    material: str
    colors: List[str] = []
    region: str
    state: str
    price: Optional[float] = None
    tags: List[str] = []
    buyer_segments: List[str] = []
    craft_story: Optional[str] = None
    image_url: str
    status: str = 'published' # 'draft' or 'published'

class ProductCreate(ProductBase):
    artisan_id: Optional[str] = None
    artisan_name: Optional[str] = None
    ai_generated: bool = True

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    category: Optional[str] = None
    craft_type: Optional[str] = None
    material: Optional[str] = None
    colors: Optional[List[str]] = None
    region: Optional[str] = None
    state: Optional[str] = None
    price: Optional[float] = None
    tags: Optional[List[str]] = None
    buyer_segments: Optional[List[str]] = None
    craft_story: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None

class ProductResponse(ProductBase):
    id: str
    artisan_id: str
    artisan_name: Optional[str] = 'Master Artisan'
    ai_generated: bool = True
    views: int = 0
    created_at: str
    updated_at: str

class ProductListResponse(BaseModel):
    total: int
    page: int
    limit: int
    products: List[ProductResponse]
