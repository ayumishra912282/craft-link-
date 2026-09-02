from fastapi import APIRouter
from typing import List, Dict, Any
from app.data.seed_data import CATEGORIES, CRAFT_TYPES, REGIONS
from app.services.database import db

router = APIRouter(prefix='/metadata', tags=['Metadata'])

@router.get('/categories', response_model=List[str])
def get_categories():
    return CATEGORIES

@router.get('/crafts', response_model=List[str])
def get_crafts():
    return CRAFT_TYPES

@router.get('/regions', response_model=List[str])
def get_regions():
    return REGIONS

@router.post('/seed-reset')
def reset_seed():
    db.seed_demo_data()
    return {'message': 'Database re-seeded with authentic Indian craft demo data.'}
