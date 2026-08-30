from fastapi import APIRouter, Query
from typing import Dict, Any, List
from app.schemas.ai import SemanticSearchRequest, SemanticSearchResponse
from app.services.database import db
from app.search.vector_engine import search_engine

router = APIRouter(prefix='/search', tags=['Search'])

@router.post('/semantic', response_model=SemanticSearchResponse)
def semantic_search(req: SemanticSearchRequest):
    """Natural language semantic search combining buyer intent, attributes, and explainability."""
    # Retrieve all published products
    all_products = db.get_products(
        status='published',
        category=req.category,
        craft_type=req.craft_type,
        material=req.material,
        region=req.region,
        state=req.state,
        limit=100
    )

    top_products, match_reasons, intent = search_engine.semantic_search(
        query=req.query,
        products=all_products,
        limit=req.limit
    )

    return SemanticSearchResponse(
        query=req.query,
        interpreted_intent=intent['interpreted_intent'],
        detected_craft=intent.get('detected_craft'),
        detected_region=intent.get('detected_region'),
        detected_category=intent.get('detected_category'),
        total_matches=len(top_products),
        products=top_products,
        match_reasons=match_reasons,
        is_demo_mode=True
    )
