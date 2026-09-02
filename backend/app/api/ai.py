from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional, Dict, Any
from app.schemas.ai import (
    ImageAnalysisRequest, ImageAnalysisResponse,
    CatalogGenerationRequest, CatalogGenerationResponse
)
from app.ai.gemini_service import gemini_service
from app.services.storage import storage_service

router = APIRouter(prefix='/ai', tags=['AI Services'])

@router.post('/analyze-product', response_model=ImageAnalysisResponse)
async def analyze_product(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    craft_hint: Optional[str] = Form(None)
):
    """Analyzes a product photo using Gemini Vision or demo intelligence."""
    image_bytes = None
    if file:
        image_bytes = await file.read()
    
    analysis = gemini_service.analyze_craft_image(
        image_bytes=image_bytes,
        image_base64=image_base64,
        craft_hint=craft_hint
    )
    return ImageAnalysisResponse(**analysis)

@router.post('/generate-catalog', response_model=CatalogGenerationResponse)
def generate_catalog(req: CatalogGenerationRequest):
    """Generates an authentic product listing with title, story, tags, and buyer segments."""
    catalog = gemini_service.generate_catalog_listing(
        attributes=req.model_dump(),
        artisan_name=req.artisan_name or 'Master Artisan',
        craft_notes=req.craft_notes,
        suggested_price=req.suggested_price,
        language=req.language or 'en'
    )
    return CatalogGenerationResponse(**catalog)

@router.post('/regenerate-catalog', response_model=CatalogGenerationResponse)
def regenerate_catalog(req: CatalogGenerationRequest):
    """Regenerates or refines product catalogue based on updated inputs."""
    catalog = gemini_service.generate_catalog_listing(
        attributes=req.model_dump(),
        artisan_name=req.artisan_name or 'Master Artisan',
        craft_notes=req.craft_notes,
        suggested_price=req.suggested_price,
        language=req.language or 'en'
    )
    return CatalogGenerationResponse(**catalog)

@router.post('/upload-image')
async def upload_image(file: UploadFile = File(...)):
    """Uploads an image file and returns public URL."""
    content = await file.read()
    ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    url = storage_service.save_image_bytes(content, filename_prefix='artisan_photo', ext=ext)
    return {'image_url': url}
