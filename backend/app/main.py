import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

from app.api import auth, products, ai, search, recommendations, artisan, metadata

app = FastAPI(
    title='CraftLink API',
    description='AI-Powered Marketplace & Catalogue Copilot for Indian Artisans (Smart India Hackathon 2026)',
    version='1.0.0'
)

# CORS configuration
origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'], # Permissive for easy hackathon demonstration
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Mount local uploads directory for stored photos
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount('/api/uploads', StaticFiles(directory=UPLOAD_DIR), name='uploads')

# Include API Routers
app.include_router(auth.router, prefix='/api')
app.include_router(products.router, prefix='/api')
app.include_router(ai.router, prefix='/api')
app.include_router(search.router, prefix='/api')
app.include_router(recommendations.router, prefix='/api')
app.include_router(artisan.router, prefix='/api')
app.include_router(metadata.router, prefix='/api')

@app.get('/api/health')
def health_check():
    from app.ai.gemini_service import gemini_service
    from app.services.database import db
    return {
        'status': 'healthy',
        'service': 'CraftLink API',
        'version': '1.0.0',
        'gemini_configured': gemini_service.is_configured,
        'database_mode': 'Supabase PostgreSQL' if db.use_supabase else 'Local SQLite + Vector Store',
        'storage_mode': 'Supabase Storage' if db.use_supabase else 'Local Uploads'
    }

@app.get('/')
def root():
    return {
        'message': 'CraftLink — AI-Powered Marketplace for Indian Artisans (SIH 2026)',
        'docs_url': '/docs',
        'health_url': '/api/health'
    }
