from pydantic import BaseModel, Field
from typing import Optional, Literal

class UserRegister(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2)
    role: Literal['artisan', 'buyer'] = 'artisan'
    phone: Optional[str] = None
    craft_type: Optional[str] = None
    state: Optional[str] = None
    region: Optional[str] = None
    preferred_language: Optional[str] = 'en'
    craft_story: Optional[str] = None

class UserLogin(BaseModel):
    email: str = Field(..., min_length=3)
    password: str

class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    role: str
    phone: Optional[str] = None
    craft_type: Optional[str] = None
    state: Optional[str] = None
    region: Optional[str] = None
    preferred_language: str = 'en'
    craft_story: Optional[str] = None
    created_at: Optional[str] = None

class SendOTPRequest(BaseModel):
    identifier: str = Field(..., min_length=4, description="Email or phone number")
    role: Optional[str] = 'artisan'

class SendOTPResponse(BaseModel):
    message: str
    identifier: str
    expires_in_seconds: int = 300
    demo_otp: str = "123456"

class VerifyOTPRequest(BaseModel):
    identifier: str = Field(..., min_length=4)
    otp: str = Field(..., min_length=6, max_length=6)
    role: Optional[str] = 'artisan'
    name: Optional[str] = None

class AuthResponse(BaseModel):
    user: UserProfile
    token: str
    message: str
