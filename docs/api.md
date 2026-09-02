# CraftLink ? REST API Documentation
**Smart India Hackathon (SIH) 2026**

Base URL: http://localhost:8000/api

## Endpoints Summary

### 1. Health & Config
- GET /health: Server health check, Gemini AI configuration state, and database mode.

### 2. Products
- GET /products: List products with filtering by category, craft_type, material, region, state, status, and sorting.
- GET /products/{id}: Retrieve single product by ID and increment view count.
- POST /products: Create a new craft product listing.
- PUT /products/{id}: Update an existing product.
- DELETE /products/{id}: Delete a product.
- POST /products/{id}/inquire: Submit buyer contact inquiry.

### 3. AI Services
- POST /ai/analyze-product: Multimodal vision analysis of craft photo.
- POST /ai/generate-catalog: AI Catalog Copilot generating title, description, tags, buyer segments, and Hindi translation.
- POST /ai/regenerate-catalog: Refine or regenerate catalog listing.
- POST /ai/upload-image: Upload image file and return static URL.

### 4. Search & Recommendations
- POST /search/semantic: Natural language intent search with hybrid embeddings and explainability.
- GET /recommendations: Similar craft recommendations for product detail page.

### 5. Authentication & Artisan Studio
- POST /auth/login: User login.
- POST /auth/register: User registration with artisan/buyer role.
- POST /auth/demo-login/{role}: 1-click instant demo login for hackathon evaluation.
- GET /artisan/stats/{id}: Retrieve artisan analytics, views, and top buyer segments.
- GET /artisan/profile/{id}: Retrieve artisan profile.
- PUT /artisan/profile/{id}: Update artisan bio and lineage.

### 6. Metadata
- GET /metadata/categories: List of craft categories.
- GET /metadata/crafts: List of Indian craft traditions.
- GET /metadata/regions: List of Indian states/regions.
- POST /metadata/seed-reset: Reset database to authentic default demo state.
