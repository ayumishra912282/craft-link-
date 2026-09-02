from fastapi import APIRouter, HTTPException, Header, status
from typing import Dict, Any, Optional
from app.schemas.auth import UserRegister, UserLogin, UserProfile, AuthResponse
from app.services.database import db
from app.services.auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

router = APIRouter(prefix='/auth', tags=['Authentication'])

@router.post('/register', response_model=AuthResponse)
def register(req: UserRegister):
    existing = db.get_user_by_email(req.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='An account with this email address already exists. Please sign in.'
        )
    
    user_dict = req.model_dump()
    user_dict['password_hash'] = hash_password(req.password)
    user = db.create_user(user_dict)
    
    token = create_access_token(user)
    return AuthResponse(
        user=UserProfile(**user),
        token=token,
        message='Account registered successfully!'
    )

@router.post('/login', response_model=AuthResponse)
def login(req: UserLogin):
    user = db.get_user_by_email(req.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='No account found with this email address. Please register.'
        )
    
    stored_hash = user.get('password_hash')
    if stored_hash and not verify_password(stored_hash, req.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect password. Please verify your credentials and try again.'
        )
    
    token = create_access_token(user)
    return AuthResponse(
        user=UserProfile(**user),
        token=token,
        message='Logged in successfully.'
    )

@router.get('/me', response_model=UserProfile)
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Missing or invalid authorization token.'
        )
    
    token = authorization.split(' ', 1)[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Session expired or invalid token. Please sign in again.'
        )
    
    user_id = payload.get('sub')
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User account not found.')
        
    return UserProfile(**user)

@router.get('/profile/{user_id}', response_model=UserProfile)
def get_profile(user_id: str):
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return UserProfile(**user)

@router.post('/demo-login/{role}', response_model=AuthResponse)
def demo_login(role: str):
    email = 'artisan@craftlink.in' if role.lower() == 'artisan' else 'buyer@craftlink.in'
    user = db.get_user_by_email(email)
    if not user:
        default_hash = hash_password('artisan123' if role == 'artisan' else 'buyer123')
        user = db.create_user({
            'email': email,
            'password_hash': default_hash,
            'name': 'Ramesh Kumawat' if role == 'artisan' else 'Ananya Sharma',
            'role': role.lower(),
            'craft_type': 'Blue Pottery' if role == 'artisan' else None,
            'state': 'Rajasthan' if role == 'artisan' else 'Delhi'
        })
        
    token = create_access_token(user)
    return AuthResponse(
        user=UserProfile(**user),
        token=token,
        message=f'Instant {role.title()} Demo Login successful!'
    )

@router.post('/send-otp', response_model=Dict[str, Any])
def send_otp(req: Dict[str, Any]):
    identifier = req.get('identifier', '').strip()
    if not identifier:
        raise HTTPException(status_code=400, detail='Phone number or email is required.')
        
    return {
        'message': f'Verification OTP sent to {identifier}',
        'identifier': identifier,
        'expires_in_seconds': 300,
        'demo_otp': '123456'
    }

@router.post('/verify-otp', response_model=AuthResponse)
def verify_otp(req: Dict[str, Any]):
    identifier = req.get('identifier', '').strip()
    otp = req.get('otp', '').strip()
    role = req.get('role', 'artisan')
    name = req.get('name')
    
    if not identifier or not otp:
        raise HTTPException(status_code=400, detail='Identifier and 6-digit OTP are required.')
        
    # Accept standard demo OTP 123456 or any 6 digit test code
    if otp != '123456' and not (len(otp) == 6 and otp.isdigit()):
        raise HTTPException(status_code=400, detail='Invalid verification OTP. For testing, use 123456.')
        
    user = db.get_user_by_email(identifier)
    if not user:
        # Create profile for the OTP user
        user = db.create_user({
            'email': identifier if '@' in identifier else f'{identifier}@craftlink.in',
            'phone': identifier if '@' not in identifier else '+91 98765 43210',
            'name': name or ('Master Artisan' if role == 'artisan' else 'Craft Buyer'),
            'role': role,
            'craft_type': 'Traditional Handicrafts' if role == 'artisan' else None,
            'state': 'Rajasthan' if role == 'artisan' else 'Delhi'
        })
        
    token = create_access_token(user)
    return AuthResponse(
        user=UserProfile(**user),
        token=token,
        message='OTP verified successfully! Welcome to CraftLink.'
    )
