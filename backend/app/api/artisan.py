from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.schemas.artisan import ArtisanStats, ArtisanProfileUpdate
from app.services.database import db

router = APIRouter(prefix='/artisan', tags=['Artisan Dashboard'])

@router.get('/stats/{artisan_id}', response_model=ArtisanStats)
def get_artisan_stats(artisan_id: str):
    stats = db.get_artisan_stats(artisan_id)
    return ArtisanStats(**stats)

@router.get('/profile/{artisan_id}')
def get_artisan_profile(artisan_id: str):
    user = db.get_user_by_id(artisan_id)
    if not user:
        raise HTTPException(status_code=404, detail='Artisan not found')
    return user

@router.put('/profile/{artisan_id}')
def update_artisan_profile(artisan_id: str, req: ArtisanProfileUpdate):
    user = db.get_user_by_id(artisan_id)
    if not user:
        raise HTTPException(status_code=404, detail='Artisan not found')
    
    updated = db.update_user_profile(artisan_id, req.model_dump(exclude_unset=True))
    return updated
