import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.database import db

client = TestClient(app)

def test_health_endpoint():
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'healthy'
    assert 'gemini_configured' in data

def test_get_products():
    response = client.get('/api/products')
    assert response.status_code == 200
    products = response.json()
    assert len(products) > 0
    first = products[0]
    assert 'title' in first
    assert 'craft_type' in first
    assert 'buyer_segments' in first

def test_get_product_by_id():
    response = client.get('/api/products/prod-blue-pottery-01')
    assert response.status_code == 200
    data = response.json()
    assert data['id'] == 'prod-blue-pottery-01'
    assert 'Jaipur' in data['title']

def test_ai_catalog_generation():
    payload = {
        'product_type': 'Glazed Ceramic Vase',
        'craft': 'Blue Pottery',
        'material': 'Crushed Quartz & Glass Frit',
        'colors': ['Cobalt Blue', 'Turquoise', 'White'],
        'region': 'Jaipur',
        'state': 'Rajasthan',
        'category': 'Home Decor',
        'keywords': ['pottery', 'jaipur', 'handmade'],
        'artisan_name': 'Ramesh Kumawat'
    }
    response = client.post('/api/ai/generate-catalog', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 'title' in data
    assert 'description' in data
    assert len(data['buyer_segments']) > 0
    assert 'title_hindi' in data

def test_semantic_search():
    payload = {
        'query': 'I want traditional handmade home decoration from Rajasthan'
    }
    response = client.post('/api/search/semantic', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data['total_matches'] > 0
    assert 'interpreted_intent' in data
    assert len(data['match_reasons']) > 0

def test_recommendations():
    response = client.get('/api/recommendations?product_id=prod-blue-pottery-01')
    assert response.status_code == 200
    recs = response.json()
    assert isinstance(recs, list)

def test_artisan_stats():
    response = client.get('/api/artisan/stats/artisan-ramesh-01')
    assert response.status_code == 200
    stats = response.json()
    assert 'total_products' in stats
    assert 'top_buyer_segments' in stats

def test_demo_login():
    response = client.post('/api/auth/demo-login/artisan')
    assert response.status_code == 200
    data = response.json()
    assert data['user']['role'] == 'artisan'
    assert 'token' in data
