from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from app.services.database import db
from app.search.vector_engine import search_engine

router = APIRouter(prefix='/recommendations', tags=['Recommendations'])

@router.get('')
def get_recommendations(product_id: str = Query(...), limit: int = 4):
    target = db.get_product_by_id(product_id)
    if not target:
        raise HTTPException(status_code=404, detail='Product not found')

    all_products = db.get_products(status='published', limit=50)
    recs = search_engine.get_recommendations(target, all_products, limit=limit)
    return recs
