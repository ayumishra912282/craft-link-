# CraftLink ? Architecture & Technical Design
**Smart India Hackathon (SIH) 2026**

## 1. System Overview

CraftLink is an AI-powered multi-tier marketplace platform built to eliminate barriers for marginalized Indian artisans.

`mermaid
graph TD
    User([Artisan / Buyer]) --> Frontend[React + Vite Frontend (Tailwind CSS)]
    Frontend --> AuthCtx[Auth & Language Context (EN / HI)]
    Frontend --> APILayer[Axios REST API Client]
    
    APILayer --> FastAPIServer[FastAPI Backend Server (Python 3.14)]
    
    subgraph AI Pipeline
        FastAPIServer --> GeminiVision[Gemini 2.5 Flash Vision Analysis]
        FastAPIServer --> GeminiCopilot[AI Catalog Copilot & Multilingual Storyteller]
        FastAPIServer --> VectorSearch[Semantic Intent & Hybrid Embedding Engine]
        FastAPIServer --> MarketMatch[Smart Market Matching & Buyer Segments]
    end
    
    subgraph Data & Storage Tier
        FastAPIServer --> DBAdapter[Unified DB Adapter]
        DBAdapter -.-> SupabasePostgres[(Supabase PostgreSQL + pgvector)]
        DBAdapter -.-> SQLiteFallback[(Local SQLite + Vector Storage)]
        FastAPIServer --> StorageAdapter[Storage Manager]
        StorageAdapter -.-> SupabaseStorage[Supabase Storage Buckets]
        StorageAdapter -.-> LocalUploads[Local Static Uploads]
    end
`

---

## 2. Core Modules

### 1. Vision & Multimodal Extraction Engine (pp/ai/gemini_service.py)
- Analyzes uploaded craft photos using Gemini Vision models.
- Extracts traditional materials, region of origin, GI craft identity, and color palettes.
- Features deterministic demo fallbacks for zero-friction hackathon evaluations.

### 2. AI Catalog Copilot & Regional Storyteller (pp/ai/gemini_service.py)
- Transforms detected raw attributes into evocative, authentic craft stories.
- Generates titles, descriptions, and keywords in English and Hindi.
- Automatically calculates recommended buyer segments (e.g., Home Decor Enthusiasts, Boutique Stores, Wedding Gifting).

### 3. Natural Language Semantic Search (pp/search/vector_engine.py)
- Parses unstructured natural language buyer requests (*"I want traditional blue pottery from Rajasthan"*).
- Extracts semantic dimensions (intent, craft, region, materials).
- Calculates hybrid vector similarity and returns human-readable match explanations (*"Why these products match"*).

### 4. Dual-Mode Storage Layer (pp/services/database.py)
- **Production Mode**: Supabase PostgreSQL with pgvector extension and Row Level Security (RLS).
- **Demo / Offline Mode**: Local SQLite database with pre-seeded rich Indian handicraft data for instant out-of-the-box evaluation.
