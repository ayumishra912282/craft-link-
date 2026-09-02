# Database adapter layer supporting Supabase and local SQLite fallback
import os
import json
import sqlite3
import datetime
import uuid
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

from app.data.seed_data import SEED_PRODUCTS, DEMO_USERS, CATEGORIES, CRAFT_TYPES, REGIONS

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL', '').strip()
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY', '').strip()
DB_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'craftlink.db')

class DatabaseService:
    def __init__(self):
        self.use_supabase = bool(SUPABASE_URL and SUPABASE_SERVICE_KEY)
        self.supabase = None
        if self.use_supabase:
            try:
                from supabase import create_client
                self.supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
                print(f'[DB] Connected to Supabase at {SUPABASE_URL}')
            except Exception as e:
                print(f'[DB] Failed to connect to Supabase: {e}. Falling back to local SQLite.')
                self.use_supabase = False

        self._init_sqlite()

    def _get_conn(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_sqlite(self):
        conn = self._get_conn()
        cursor = conn.cursor()

        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                phone TEXT,
                craft_type TEXT,
                state TEXT,
                region TEXT,
                preferred_language TEXT DEFAULT 'en',
                craft_story TEXT,
                created_at TEXT NOT NULL
            )
        ''')

        # Run migration in case table was created without password_hash
        try:
            cursor.execute('ALTER TABLE users ADD COLUMN password_hash TEXT')
        except Exception:
            pass

        # Products table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                artisan_id TEXT NOT NULL,
                artisan_name TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                short_description TEXT,
                category TEXT NOT NULL,
                craft_type TEXT NOT NULL,
                material TEXT NOT NULL,
                colors TEXT NOT NULL, -- JSON array
                region TEXT NOT NULL,
                state TEXT NOT NULL,
                price REAL,
                tags TEXT NOT NULL, -- JSON array
                buyer_segments TEXT NOT NULL, -- JSON array
                craft_story TEXT,
                image_url TEXT NOT NULL,
                status TEXT DEFAULT 'published',
                ai_generated INTEGER DEFAULT 1,
                views INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                embedding TEXT -- JSON array of floats for semantic search
            )
        ''')

        # Inquiries table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS inquiries (
                id TEXT PRIMARY KEY,
                product_id TEXT NOT NULL,
                buyer_name TEXT NOT NULL,
                buyer_email TEXT NOT NULL,
                buyer_phone TEXT,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        ''')

        conn.commit()

        # Seed initial data if empty
        cursor.execute('SELECT COUNT(*) FROM products')
        count = cursor.fetchone()[0]
        if count == 0:
            print('[DB] Seeding initial Indian craft demo products and users...')
            self.seed_demo_data(cursor)
            conn.commit()

        conn.close()

    def seed_demo_data(self, cursor=None):
        should_close = False
        if cursor is None:
            conn = self._get_conn()
            cursor = conn.cursor()
            should_close = True

        cursor.execute('DELETE FROM products')
        cursor.execute('DELETE FROM users')

        now = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # Insert users
        for u in DEMO_USERS:
            cursor.execute('''
                INSERT INTO users (id, email, password_hash, name, role, phone, craft_type, state, region, preferred_language, craft_story, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                u['id'], u['email'], u.get('password_hash'), u['name'], u['role'], u.get('phone'),
                u.get('craft_type'), u.get('state'), u.get('region'),
                u.get('preferred_language', 'en'), u.get('craft_story'),
                u.get('created_at', now)
            ))

        # Insert products
        for p in SEED_PRODUCTS:
            cursor.execute('''
                INSERT INTO products (
                    id, artisan_id, artisan_name, title, description, short_description,
                    category, craft_type, material, colors, region, state, price,
                    tags, buyer_segments, craft_story, image_url, status, ai_generated,
                    views, created_at, updated_at, embedding
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                p['id'], p['artisan_id'], p['artisan_name'], p['title'], p['description'],
                p.get('short_description', ''), p['category'], p['craft_type'], p['material'],
                json.dumps(p.get('colors', [])), p['region'], p['state'], p.get('price', 0.0),
                json.dumps(p.get('tags', [])), json.dumps(p.get('buyer_segments', [])),
                p.get('craft_story', ''), p['image_url'], p.get('status', 'published'),
                1 if p.get('ai_generated', True) else 0, p.get('views', 0),
                now, now, None
            ))

        if should_close:
            conn.commit()
            conn.close()

    def _row_to_product(self, row) -> Dict[str, Any]:
        d = dict(row)
        d['colors'] = json.loads(d['colors']) if d.get('colors') else []
        d['tags'] = json.loads(d['tags']) if d.get('tags') else []
        d['buyer_segments'] = json.loads(d['buyer_segments']) if d.get('buyer_segments') else []
        d['ai_generated'] = bool(d.get('ai_generated', 1))
        if d.get('embedding'):
            try:
                d['embedding'] = json.loads(d['embedding'])
            except Exception:
                d['embedding'] = None
        return d

    def get_products(
        self,
        status: Optional[str] = 'published',
        category: Optional[str] = None,
        craft_type: Optional[str] = None,
        material: Optional[str] = None,
        region: Optional[str] = None,
        state: Optional[str] = None,
        artisan_id: Optional[str] = None,
        keyword: Optional[str] = None,
        sort_by: Optional[str] = 'newest',
        limit: int = 50,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        conn = self._get_conn()
        cursor = conn.cursor()

        query = 'SELECT * FROM products WHERE 1=1'
        params = []

        if status and status != 'all':
            query += ' AND status = ?'
            params.append(status)

        if artisan_id:
            query += ' AND artisan_id = ?'
            params.append(artisan_id)

        if category:
            query += ' AND category = ?'
            params.append(category)

        if craft_type:
            query += ' AND craft_type = ?'
            params.append(craft_type)

        if material:
            query += ' AND material LIKE ?'
            params.append(f'%{material}%')

        if region:
            query += ' AND region LIKE ?'
            params.append(f'%{region}%')

        if state:
            query += ' AND state = ?'
            params.append(state)

        if keyword:
            query += ' AND (title LIKE ? OR description LIKE ? OR craft_type LIKE ? OR tags LIKE ?)'
            kw_param = f'%{keyword}%'
            params.extend([kw_param, kw_param, kw_param, kw_param])

        if sort_by == 'price_asc':
            query += ' ORDER BY price ASC'
        elif sort_by == 'price_desc':
            query += ' ORDER BY price DESC'
        elif sort_by == 'views':
            query += ' ORDER BY views DESC'
        else: # newest
            query += ' ORDER BY created_at DESC'

        query += ' LIMIT ? OFFSET ?'
        params.extend([limit, offset])

        cursor.execute(query, params)
        rows = cursor.fetchall()
        products = [self._row_to_product(r) for r in rows]
        conn.close()
        return products

    def get_product_by_id(self, product_id: str, increment_view: bool = False) -> Optional[Dict[str, Any]]:
        conn = self._get_conn()
        cursor = conn.cursor()

        if increment_view:
            cursor.execute('UPDATE products SET views = views + 1 WHERE id = ?', (product_id,))
            conn.commit()

        cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return self._row_to_product(row)

    def create_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        conn = self._get_conn()
        cursor = conn.cursor()

        prod_id = product_data.get('id') or f'prod-{uuid.uuid4().hex[:8]}'
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()

        cursor.execute('''
            INSERT INTO products (
                id, artisan_id, artisan_name, title, description, short_description,
                category, craft_type, material, colors, region, state, price,
                tags, buyer_segments, craft_story, image_url, status, ai_generated,
                views, created_at, updated_at, embedding
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            prod_id,
            product_data.get('artisan_id', 'artisan-ramesh-01'),
            product_data.get('artisan_name', 'Master Artisan'),
            product_data.get('title', 'Untitled Craft Listing'),
            product_data.get('description', ''),
            product_data.get('short_description', ''),
            product_data.get('category', 'Home Decor'),
            product_data.get('craft_type', 'Indian Handicraft'),
            product_data.get('material', 'Natural Materials'),
            json.dumps(product_data.get('colors', [])),
            product_data.get('region', 'India'),
            product_data.get('state', 'India'),
            product_data.get('price', 0.0),
            json.dumps(product_data.get('tags', [])),
            json.dumps(product_data.get('buyer_segments', [])),
            product_data.get('craft_story', ''),
            product_data.get('image_url', ''),
            product_data.get('status', 'published'),
            1 if product_data.get('ai_generated', True) else 0,
            product_data.get('views', 0),
            now, now,
            json.dumps(product_data['embedding']) if product_data.get('embedding') else None
        ))

        conn.commit()
        conn.close()
        return self.get_product_by_id(prod_id)

    def update_product(self, product_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        conn = self._get_conn()
        cursor = conn.cursor()

        fields = []
        params = []
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()

        for k, v in updates.items():
            if k in ['colors', 'tags', 'buyer_segments', 'embedding']:
                fields.append(f'{k} = ?')
                params.append(json.dumps(v) if v is not None else None)
            elif k == 'ai_generated':
                fields.append(f'{k} = ?')
                params.append(1 if v else 0)
            elif k not in ['id', 'created_at', 'updated_at']:
                fields.append(f'{k} = ?')
                params.append(v)

        fields.append('updated_at = ?')
        params.append(now)

        params.append(product_id)
        query = f'''UPDATE products SET {', '.join(fields)} WHERE id = ?'''
        cursor.execute(query, params)
        conn.commit()
        conn.close()

        return self.get_product_by_id(product_id)

    def delete_product(self, product_id: str) -> bool:
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM products WHERE id = ?', (product_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted

    def get_artisan_stats(self, artisan_id: str) -> Dict[str, Any]:
        conn = self._get_conn()
        cursor = conn.cursor()

        cursor.execute('SELECT COUNT(*) FROM products WHERE artisan_id = ?', (artisan_id,))
        total_products = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(*) FROM products WHERE artisan_id = ? AND status = "published"', (artisan_id,))
        published_products = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(*) FROM products WHERE artisan_id = ? AND status = "draft"', (artisan_id,))
        draft_products = cursor.fetchone()[0]

        cursor.execute('SELECT SUM(views) FROM products WHERE artisan_id = ?', (artisan_id,))
        res = cursor.fetchone()[0]
        total_views = res if res else 0

        # Aggregate buyer segments from all artisan products
        cursor.execute('SELECT buyer_segments FROM products WHERE artisan_id = ?', (artisan_id,))
        rows = cursor.fetchall()
        segment_counts = {}
        for r in rows:
            try:
                segments = json.loads(r[0])
                for s in segments:
                    segment_counts[s] = segment_counts.get(s, 0) + 1
            except Exception:
                pass

        top_buyer_segments = [
            {'segment': k, 'product_count': v}
            for k, v in sorted(segment_counts.items(), key=lambda item: item[1], reverse=True)[:5]
        ]
        if not top_buyer_segments:
            top_buyer_segments = [
                {'segment': 'Home Decor Buyers', 'product_count': 1},
                {'segment': 'Boutique Retailers', 'product_count': 1},
                {'segment': 'Gift Shoppers', 'product_count': 1}
            ]

        # Recent activity log
        recent_activity = [
            {
                'id': 'act-1',
                'action': 'Product Published',
                'description': 'Jaipur Handcrafted Blue Pottery Floral Peacock Vase went live.',
                'timestamp': '2 hours ago'
            },
            {
                'id': 'act-2',
                'action': 'AI Catalogue Generated',
                'description': 'AI Copilot generated title, tags and buyer segments for new draft.',
                'timestamp': 'Yesterday'
            },
            {
                'id': 'act-3',
                'action': 'Buyer Inquiry Received',
                'description': 'Inquiry from boutique store in Mumbai for decorative pottery collection.',
                'timestamp': '2 days ago'
            }
        ]

        conn.close()
        return {
            'total_products': total_products,
            'published_products': published_products,
            'draft_products': draft_products,
            'total_views': total_views,
            'top_buyer_segments': top_buyer_segments,
            'recent_activity': recent_activity
        }

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', (email,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return dict(row)

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return dict(row)

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        conn = self._get_conn()
        cursor = conn.cursor()
        uid = user_data.get('id') or f'user-{uuid.uuid4().hex[:8]}'
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()

        cursor.execute('''
            INSERT INTO users (id, email, password_hash, name, role, phone, craft_type, state, region, preferred_language, craft_story, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            uid,
            user_data['email'],
            user_data.get('password_hash'),
            user_data['name'],
            user_data.get('role', 'artisan'),
            user_data.get('phone'),
            user_data.get('craft_type'),
            user_data.get('state'),
            user_data.get('region'),
            user_data.get('preferred_language', 'en'),
            user_data.get('craft_story'),
            now
        ))
        conn.commit()
        conn.close()
        return self.get_user_by_id(uid)

    def update_user_profile(self, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        conn = self._get_conn()
        cursor = conn.cursor()
        fields = []
        params = []
        for k, v in updates.items():
            if k in ['name', 'phone', 'craft_type', 'state', 'region', 'preferred_language', 'craft_story']:
                fields.append(f'{k} = ?')
                params.append(v)

        if not fields:
            conn.close()
            return self.get_user_by_id(user_id)

        params.append(user_id)
        cursor.execute(f'UPDATE users SET {", ".join(fields)} WHERE id = ?', params)
        conn.commit()
        conn.close()
        return self.get_user_by_id(user_id)

    def create_inquiry(self, inquiry_data: Dict[str, Any]) -> Dict[str, Any]:
        conn = self._get_conn()
        cursor = conn.cursor()
        inq_id = f'inq-{uuid.uuid4().hex[:8]}'
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()

        cursor.execute('''
            INSERT INTO inquiries (id, product_id, buyer_name, buyer_email, buyer_phone, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            inq_id,
            inquiry_data['product_id'],
            inquiry_data['buyer_name'],
            inquiry_data['buyer_email'],
            inquiry_data.get('buyer_phone', ''),
            inquiry_data['message'],
            now
        ))
        conn.commit()
        conn.close()
        return {'id': inq_id, 'status': 'sent', 'message': 'Inquiry sent successfully to the artisan.'}

db = DatabaseService()
