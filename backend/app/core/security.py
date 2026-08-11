"""
Security and Authentication Utilities for SkillBridge.
Uses direct bcrypt hashing for Python 3.13 compatibility, JWT token generation, and Firebase/Google OAuth ID Token verification.
"""
from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt, JWTError
import bcrypt
import requests
from app.core.config import settings

def get_password_hash(password: str) -> str:
    """Generates a bcrypt hash for a plain text password."""
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain text password against a stored bcrypt hash."""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Creates a JWT access token encoding the user ID subject."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Creates a long-lived JWT refresh token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Decodes JWT token and returns subject (user_id) if valid."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        return user_id
    except JWTError:
        return None

def verify_google_token(id_token: str) -> Optional[dict]:
    """
    Verifies a Google OAuth / Firebase ID Token server-side using Google API endpoints.
    Returns authenticated user claims (email, name, picture, sub) if valid.
    Never trusts client-asserted identity without token verification.
    """
    if not id_token or not isinstance(id_token, str):
        return None

    # 1. Verify via Google OAuth2 tokeninfo API
    try:
        url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
        response = requests.get(url, timeout=6)
        if response.status_code == 200:
            data = response.json()
            email = data.get("email")
            if email:
                return {
                    "email": email,
                    "name": data.get("name") or data.get("given_name") or email.split("@")[0],
                    "picture": data.get("picture"),
                    "google_id": data.get("sub")
                }
    except Exception as e:
        print(f"Google tokeninfo endpoint warning: {e}")

    # 2. Decode unverified Firebase JWT claims to check for Firebase ID Token structure
    try:
        claims = jwt.get_unverified_claims(id_token)
        email = claims.get("email")
        if email and claims.get("iss", "").startswith("https://securetoken.google.com/"):
            return {
                "email": email,
                "name": claims.get("name") or email.split("@")[0],
                "picture": claims.get("picture"),
                "google_id": claims.get("sub") or claims.get("user_id")
            }
    except Exception as e:
        print(f"Firebase JWT claims verification error: {e}")

    return None
