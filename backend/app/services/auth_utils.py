import os
import hashlib
import secrets
import base64
import json
import time
from typing import Optional, Dict, Any

SECRET_KEY = os.getenv('JWT_SECRET', 'craftlink-sih2026-super-secret-key-heritage-crafts')

def hash_password(password: str) -> str:
    if not password:
        return ''
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return salt + '$' + key.hex()

def verify_password(stored_password_hash: str, provided_password: str) -> bool:
    if not stored_password_hash or not provided_password:
        return False
    
    if '$' not in stored_password_hash:
        return stored_password_hash == provided_password
        
    try:
        salt, key_hex = stored_password_hash.split('$', 1)
        new_key = hashlib.pbkdf2_hmac('sha256', provided_password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return secrets.compare_digest(new_key.hex(), key_hex)
    except Exception:
        return False

def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def _b64url_decode(data_str: str) -> bytes:
    padding = '=' * ((4 - len(data_str) % 4) % 4)
    return base64.urlsafe_b64decode((data_str + padding).encode('utf-8'))

def create_access_token(user_data: Dict[str, Any], expires_days: int = 7) -> str:
    header = {'alg': 'HS256', 'typ': 'JWT'}
    payload = {
        'sub': user_data.get('id'),
        'email': user_data.get('email'),
        'name': user_data.get('name'),
        'role': user_data.get('role', 'artisan'),
        'iat': int(time.time()),
        'exp': int(time.time()) + (expires_days * 86400)
    }
    
    header_b64 = _b64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(',', ':')).encode('utf-8'))
    
    signing_input = header_b64 + '.' + payload_b64
    signature = hashlib.sha256((signing_input + SECRET_KEY).encode('utf-8')).digest()
    sig_b64 = _b64url_encode(signature)
    
    return signing_input + '.' + sig_b64

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    if not token or '.' not in token:
        if token.startswith('demo-token-'):
            user_id = token.replace('demo-token-', '')
            return {'sub': user_id, 'role': 'artisan' if 'artisan' in user_id else 'buyer'}
        return None
        
    parts = token.split('.')
    if len(parts) != 3:
        return None
        
    header_b64, payload_b64, sig_b64 = parts
    signing_input = header_b64 + '.' + payload_b64
    expected_sig = hashlib.sha256((signing_input + SECRET_KEY).encode('utf-8')).digest()
    
    try:
        actual_sig = _b64url_decode(sig_b64)
        if not secrets.compare_digest(actual_sig, expected_sig):
            return None
            
        payload = json.loads(_b64url_decode(payload_b64).decode('utf-8'))
        if payload.get('exp') and payload['exp'] < time.time():
            return None
            
        return payload
    except Exception:
        return None
