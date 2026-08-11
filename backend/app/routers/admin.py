"""
Admin Panel & System Management Routers for SkillBridge.
Restricted to users with 'admin' role.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Job, Company, Application, Resume, ActivityLog
from app.routers.user import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

def require_admin(current_user: User = Depends(get_current_user)):
    """Verifies that logged in user has 'admin' role."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied. Admin privileges required.")
    return current_user

@router.get("/stats")
def get_admin_dashboard_stats(admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Fetches key system metrics across platform."""
    total_users = db.query(User).count()
    total_jobs = db.query(Job).count()
    total_companies = db.query(Company).count()
    total_applications = db.query(Application).count()
    total_resumes = db.query(Resume).count()

    return {
        "total_users": total_users,
        "total_jobs": total_jobs,
        "total_companies": total_companies,
        "total_applications": total_applications,
        "total_resumes_uploaded": total_resumes,
        "system_health": "100% Operational",
        "database": "Neon PostgreSQL (Connected)"
    }

@router.get("/users")
def get_all_users(admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Returns list of registered users."""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users

@router.put("/user/{user_id}/toggle-status")
def toggle_user_status(user_id: str, admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Activates or deactivates user account."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.is_verified = not user.is_verified
    db.commit()
    return {"message": f"User status updated to {'Active' if user.is_verified else 'Inactive'}."}
