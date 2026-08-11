"""
User Profile Management Routers for SkillBridge.
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User
from app.schemas.schemas import UserResponse, UserUpdate, ChangePasswordRequest
from app.core.security import verify_token, get_password_hash, verify_password

router = APIRouter(prefix="/user", tags=["User Profile"])

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
    """Dependency helper to validate JWT token and fetch current logged in user."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized request. Missing or invalid Authorization header.")
    token = authorization.split(" ")[1]
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session expired or invalid token.")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found.")
    return user

@router.get("/profile", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Fetches logged-in user profile details."""
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_user_profile(data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Updates profile information."""
    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.phone is not None:
        current_user.phone = data.phone
    if data.college is not None:
        current_user.college = data.college
    if data.branch is not None:
        current_user.branch = data.branch
    if data.year is not None:
        current_user.year = data.year
    if data.profile_image is not None:
        current_user.profile_image = data.profile_image

    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/change-password")
def change_password(data: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Changes user password."""
    if not current_user.password_hash or not verify_password(data.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password.")
    current_user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully."}

@router.delete("/account")
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Deletes user account permanently."""
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully."}
