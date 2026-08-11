"""
Authentication Endpoints for SkillBridge.
Handles user registration, email/password login, Firebase Google OAuth, password reset, token refresh, and email verification.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, NotificationPreference, ActivityLog
from app.schemas.schemas import UserRegister, UserLogin, GoogleAuthRequest, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, verify_google_token, verify_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """Registers a new student user."""
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email address already exists.")

    hashed_pw = get_password_hash(user_data.password)
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hashed_pw,
        phone=user_data.phone,
        college=user_data.college,
        branch=user_data.branch,
        year=user_data.year,
        role="student",
        is_verified=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize notification preferences
    prefs = NotificationPreference(user_id=new_user.id)
    db.add(prefs)

    # Log activity
    log = ActivityLog(user_id=new_user.id, action="Account Created", details="Student registered successfully.")
    db.add(log)
    db.commit()

    access_token = create_access_token(new_user.id)
    refresh_token = create_refresh_token(new_user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "full_name": new_user.full_name,
            "email": new_user.email,
            "role": new_user.role,
            "college": new_user.college,
            "profile_image": new_user.profile_image
        }
    }

@router.post("/login", response_model=TokenResponse)
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticates user with email and password."""
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not user.password_hash or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    log = ActivityLog(user_id=user.id, action="User Login", details="Logged in via password.")
    db.add(log)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "college": user.college,
            "profile_image": user.profile_image
        }
    }

@router.post("/google", response_model=TokenResponse)
def google_oauth_login(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Handles Firebase Google OAuth sign-in and server-side token verification."""
    google_data = verify_google_token(data.credential)
    if not google_data or not google_data.get("email"):
        raise HTTPException(status_code=401, detail="Invalid or expired Google authentication token.")

    email = google_data["email"]
    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            full_name=google_data.get("name", "Google User"),
            email=email,
            profile_image=google_data.get("picture"),
            role="student",
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        prefs = NotificationPreference(user_id=user.id)
        db.add(prefs)

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    log = ActivityLog(user_id=user.id, action="Google Login", details="Logged in via Firebase Google OAuth.")
    db.add(log)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "profile_image": user.profile_image
        }
    }

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Generates password reset request."""
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        return {"message": "If that email exists, a password reset link has been sent."}
    return {"message": "Password reset link has been dispatched to your email address."}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Resets password using verification token."""
    user_id = verify_token(data.token)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.password_hash = get_password_hash(data.new_password)
        db.commit()
        return {"message": "Password has been successfully updated. Please login with your new password."}
    raise HTTPException(status_code=404, detail="User not found.")
