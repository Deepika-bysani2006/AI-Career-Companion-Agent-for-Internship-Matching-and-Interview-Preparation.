"""
Notifications & Preferences Routers for SkillBridge.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Notification, NotificationPreference
from app.routers.user import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetches user notifications."""
    notifs = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
    if not notifs:
        # Provide standard initial system notifications
        n1 = Notification(
            user_id=current_user.id,
            title="Welcome to SkillBridge!",
            message="Your AI Internship Agent is active. Upload your resume to start getting matched with top internships.",
            type="System",
            is_read=False
        )
        n2 = Notification(
            user_id=current_user.id,
            title="IBM AI Intern Opportunity",
            message="Your profile has a 94% Compatibility Match for IBM AI Developer Internship.",
            type="Job",
            is_read=False
        )
        db.add_all([n1, n2])
        db.commit()
        notifs = [n1, n2]

    return notifs

@router.put("/read-all")
def mark_all_as_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Marks all user notifications as read."""
    db.query(Notification).filter(Notification.user_id == current_user.id).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read."}

@router.delete("/clear")
def clear_all_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Clears all notifications for current user."""
    db.query(Notification).filter(Notification.user_id == current_user.id).delete()
    db.commit()
    return {"message": "All notifications cleared."}
