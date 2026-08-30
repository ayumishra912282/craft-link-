# Storage manager for product images (Supabase Storage / Local static uploads)
import os
import uuid
import base64
from typing import Tuple, Optional
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL', '').strip()
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY', '').strip()
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

class StorageService:
    def __init__(self):
        self.use_supabase = bool(SUPABASE_URL and SUPABASE_SERVICE_KEY)
        self.supabase = None
        if self.use_supabase:
            try:
                from supabase import create_client
                self.supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
            except Exception as e:
                print(f'[Storage] Supabase storage init error: {e}. Using local upload folder.')
                self.use_supabase = False

    def save_image_bytes(self, image_bytes: bytes, filename_prefix: str = 'craft', ext: str = 'jpg') -> str:
        unique_name = f'{filename_prefix}_{uuid.uuid4().hex[:10]}.{ext}'
        
        # Save locally first
        local_path = os.path.join(UPLOAD_DIR, unique_name)
        with open(local_path, 'wb') as f:
            f.write(image_bytes)

        # If Supabase storage is active, upload to bucket
        if self.use_supabase and self.supabase:
            try:
                bucket_name = 'product-images'
                res = self.supabase.storage.from_(bucket_name).upload(
                    path=unique_name,
                    file=image_bytes,
                    file_options={'content-type': f'image/{ext}'}
                )
                public_url = self.supabase.storage.from_(bucket_name).get_public_url(unique_name)
                return public_url
            except Exception as e:
                print(f'[Storage] Supabase upload failed: {e}. Falling back to local static URL.')

        return f'/api/uploads/{unique_name}'

    def save_base64_image(self, b64_string: str, filename_prefix: str = 'artisan_upload') -> str:
        # Handle data URI scheme if present (e.g. data:image/png;base64,...)
        ext = 'jpg'
        if ',' in b64_string:
            header, data = b64_string.split(',', 1)
            if 'image/png' in header:
                ext = 'png'
            elif 'image/webp' in header:
                ext = 'webp'
            elif 'image/jpeg' in header or 'image/jpg' in header:
                ext = 'jpg'
            image_bytes = base64.b64decode(data)
        else:
            image_bytes = base64.b64decode(b64_string)

        return self.save_image_bytes(image_bytes, filename_prefix=filename_prefix, ext=ext)

storage_service = StorageService()
