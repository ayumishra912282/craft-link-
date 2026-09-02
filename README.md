# CraftLink ? AI-Powered Marketplace for Indian Artisans


> **"From a simple photo to a professional catalogue."**  
> CraftLink uses Multimodal AI to turn a single product photo into an authentic digital product listing, bridging marginalized Indian artisans directly to global buyers with natural language semantic search and smart market matching.

---

## 1. Problem Statement & Solution

### The Challenge
India possesses over 7 million traditional handicraft artisans representing centuries of cultural heritage (GI crafts like Blue Pottery, Pashmina, Dhokra, Rogan Art, Banarasi Weaving). However, over 80% face digital exclusion due to:
1. **High typing friction & low digital literacy**: Creating catalogues, writing descriptions, and tagging is prohibitive.
2. **Exploitative intermediaries**: Middlemen pocket up to 70% of craft value.
3. **Loss of provenance**: Cultural storytelling and artisan lineage get stripped away in generic e-commerce listings.
4. **Keyword mismatch**: Modern buyers search with intent (*"traditional blue decor from Rajasthan"*), while artisans lack SEO knowledge.

### The CraftLink Solution
- **One-Photo AI Digitization**: The artisan uploads a single photo. Gemini Multimodal AI extracts craft lineage, materials, colors, and region.
- **AI Catalog Copilot**: Automatically drafts professional titles, storytelling descriptions, buyer personas, and SEO tags in English and Hindi.
- **Natural Language Semantic Search**: Intent-driven vector search connects buyer queries with relevant crafts and explains *"Why these products match"*.
- **Smart Market Matching**: Automatically identifies high-affinity buyer segments (Home Decor, Boutique Retailers, Interior Designers, Gift Shoppers).
- **Dual-Mode Zero-Friction Architecture**: Works 100% out of the box with built-in SQLite/deterministic AI demo mode, and seamlessly connects to live Supabase + Gemini API when configured.

---

## 2. System Architecture

`mermaid
graph TD
    subgraph Client Tier
        Artisan[Artisan Mobile / Desktop]
        Buyer[Buyer Mobile / Desktop]
        Frontend[React 18 + Vite + Tailwind CSS]
        Artisan --> Frontend
        Buyer --> Frontend
    end

    subgraph API & AI Tier
        FastAPI[FastAPI Backend Server - Python 3.14]
        Frontend -->|REST API / Axios| FastAPI
        
        GeminiVision[Gemini 2.5 Flash Vision Analysis]
        GeminiCopilot[AI Catalog Copilot & Multilingual Storyteller]
        SemanticSearch[Semantic Intent & Hybrid Embedding Engine]
        
        FastAPI --> GeminiVision
        FastAPI --> GeminiCopilot
        FastAPI --> SemanticSearch
    end

    subgraph Data & Storage Tier
        DBAdapter[Unified Database Adapter]
        FastAPI --> DBAdapter
        
        SupabasePostgres[(Supabase PostgreSQL + pgvector)]
        LocalDB[(Local SQLite + Vector Store)]
        
        DBAdapter -.->|Configured| SupabasePostgres
        DBAdapter -.->|Demo / Offline| LocalDB
    end
`

---

## 3. Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router v6, Axios
- **Backend**: Python 3.14, FastAPI, Pydantic v2, Uvicorn, Python-Multipart, Pillow
- **AI & Multimodal**: Google Gemini API (gemini-2.5-flash, google-generativeai) with intelligent demo fallback
- **Database & Search**: Supabase PostgreSQL + pgvector / Local SQLite + Hybrid Semantic Intent Engine
- **Storage**: Supabase Storage Buckets / Local static asset pipeline

---

## 4. Folder Structure

`
craftlink/
??? frontend/                     # React 18/19 + Vite + Tailwind CSS
?   ??? src/
?   ?   ??? components/           # Navbar, Footer, ProductCard, Search, Modals, Filter
?   ?   ??? pages/                # Landing, Marketplace, Detail, Dashboard, AI Creator
?   ?   ??? layouts/              # MainLayout
?   ?   ??? contexts/             # AuthContext, LanguageContext (EN/HI)
?   ?   ??? services/             # Axios API client
?   ?   ??? data/                 # Sample crafts, multilingual dictionaries
?   ??? index.html
?   ??? package.json
?   ??? vite.config.js
?
??? backend/                      # Python FastAPI REST API
?   ??? app/
?   ?   ??? api/                  # Auth, Products, AI, Search, Recs, Artisan, Metadata
?   ?   ??? ai/                   # Gemini Vision & Copilot service
?   ?   ??? search/               # Semantic intent & hybrid vector engine
?   ?   ??? services/             # Database adapter, Storage manager
?   ?   ??? schemas/              # Pydantic models
?   ?   ??? data/                 # 12+ Seed Indian handicraft listings
?   ?   ??? main.py               # FastAPI entry point & static mount
?   ??? tests/                    # Automated pytest test suite
?   ??? requirements.txt
?   ??? .env.example
?
??? database/
?   ??? migrations/               # Supabase PostgreSQL schema & RLS policies
?   ??? seed.sql                  # PostgreSQL seed data
?
??? docs/
?   ??? architecture.md           # Technical architecture documentation
?   ??? sih_demo_script.md        # 5-7 minute SIH presentation guide
?   ??? api.md                    # REST API specifications
?
??? README.md
??? .gitignore
`

---

## 5. Local Setup & Quickstart

### Prerequisites
- **Node.js** (v18+ or v24 LTS)
- **Python** (v3.10+)

### 1. Start the Backend API
`powershell
# In project root
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
`
Backend API will be running at: http://localhost:8000 (Docs at http://localhost:8000/docs).

### 2. Start the Frontend Application
`powershell
# In another terminal window
cd frontend
npm install
npm run dev
`
Frontend will be running at: http://localhost:5173.

---

## 6. Environment Variables Configuration

### Backend (ackend/.env):
`env
PORT=8000
HOST=0.0.0.0

# Optional: Gemini API Key (Get from https://aistudio.google.com/)
# If empty, automatically runs in high-fidelity deterministic demo mode!
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Supabase configuration (Falls back to local SQLite + vector store)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
`

### Frontend (rontend/.env):
`env
VITE_API_BASE_URL=http://localhost:8000/api
`

---

## 7. Demo Accounts & Evaluator Credentials

The app includes an **Interactive Demo Helper Banner** with instant 1-click login:

| Role | Demo Email | Persona Context |
|---|---|---|
| **Artisan** | rtisan@craftlink.in | Ramesh Kumawat, Master Blue Pottery Karigar (Jaipur, Rajasthan) |
| **Buyer** | uyer@craftlink.in | Ananya Sharma, Conscious Craft Buyer & Interior Collector (Delhi) |

---

## 8. Automated Test Execution

Run the backend test suite:
`powershell
 = "C:\Users\krishna\Documents\antigravity\quirky-tesla\backend"
python -m pytest backend/tests/ -v
`

---

## 9. SIH Presentation Demonstration Flow (5-Minute Tour)

1. **Scene 1 (Artisan Persona)**: Open http://localhost:5173, click **"Artisan Mode"** on the top demo banner.
2. **Scene 2 (AI Upload)**: Click **"+ Add Product with AI"**, pick a sample craft (e.g. *Jaipur Blue Pottery Floral Vase*), and click **"Let AI Understand & Create Catalogue"**.
3. **Scene 3 (Vision & Copilot)**: Observe the 4-stage AI loader detecting craft type, materials, and color pigments.
4. **Scene 4 (Review & Polish)**: Review the AI-generated title, craft story, and buyer segments in English or Hindi. Click **"Publish to Marketplace"**.
5. **Scene 5 (Buyer Search)**: Switch to **"Buyer Mode"**, enter a natural language intent like:  
   *"I want traditional handmade home decoration from Rajasthan"*
6. **Scene 6 (Explainable AI Match)**: Inspect matched products and the **"Why these products match"** tags.
7. **Scene 7 (Market Linkage)**: Open the product details, review provenance, and test **"Contact Artisan / Inquire"**.

---

## 10. Future Improvements
- WhatsApp Business API integration for voice-note catalogue creation.
- Direct UPI escrow payments & Open Network for Digital Commerce (ONDC) linkage.
- Physical QR code generation for craft provenance verification.
