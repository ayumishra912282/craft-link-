from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional, Dict, Any
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse
from app.services.database import db

router = APIRouter(prefix='/products', tags=['Products'])

@router.get('', response_model=List[ProductResponse])
def get_products(
    status: Optional[str] = 'published',
    category: Optional[str] = None,
    craft_type: Optional[str] = None,
    material: Optional[str] = None,
    region: Optional[str] = None,
    state: Optional[str] = None,
    artisan_id: Optional[str] = None,
    keyword: Optional[str] = None,
    sort_by: Optional[str] = 'newest',
    limit: int = 50,
    offset: int = 0
):
    products = db.get_products(
        status=status,
        category=category,
        craft_type=craft_type,
        material=material,
        region=region,
        state=state,
        artisan_id=artisan_id,
        keyword=keyword,
        sort_by=sort_by,
        limit=limit,
        offset=offset
    )
    return [ProductResponse(**p) for p in products]

@router.get('/{product_id}', response_model=ProductResponse)
def get_product(product_id: str, increment_view: bool = True):
    product = db.get_product_by_id(product_id, increment_view=increment_view)
    if not product:
        raise HTTPException(status_code=404, detail='Product not found')
    return ProductResponse(**product)

@router.post('', response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(req: ProductCreate):
    created = db.create_product(req.model_dump())
    return ProductResponse(**created)

@router.put('/{product_id}', response_model=ProductResponse)
def update_product(product_id: str, req: ProductUpdate):
    existing = db.get_product_by_id(product_id)
    if not existing:
        raise HTTPException(status_code=404, detail='Product not found')
    
    updated = db.update_product(product_id, req.model_dump(exclude_unset=True))
    return ProductResponse(**updated)

@router.delete('/{product_id}')
def delete_product(product_id: str):
    existing = db.get_product_by_id(product_id)
    if not existing:
        raise HTTPException(status_code=404, detail='Product not found')
    
    db.delete_product(product_id)
    return {'message': 'Product deleted successfully', 'id': product_id}

@router.post('/{product_id}/inquire')
def send_inquiry(product_id: str, payload: Dict[str, Any]):
    existing = db.get_product_by_id(product_id)
    if not existing:
        raise HTTPException(status_code=404, detail='Product not found')
    
    payload['product_id'] = product_id
    res = db.create_inquiry(payload)
    return res
