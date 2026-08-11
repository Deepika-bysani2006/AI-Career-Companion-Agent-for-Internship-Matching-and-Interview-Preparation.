"""
Dashboard & Analytics Routers for SkillBridge.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Resume, Application, SavedJob, Notification, Job
from app.routers.user import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Analytics"])

@router.get("/stats")
def get_dashboard_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetches summary cards statistics for user dashboard."""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id, Resume.is_active == True).first()
    ats_score = resume.ats_score if resume else 82.5

    applied_count = db.query(Application).filter(Application.user_id == current_user.id).count()
    saved_count = db.query(SavedJob).filter(SavedJob.user_id == current_user.id).count()
    unread_notifications = db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).count()
    total_active_jobs = db.query(Job).filter(Job.is_active == True).count()

    return {
        "user_name": current_user.full_name,
        "college": current_user.college or "State University",
        "ats_score": ats_score,
        "applied_jobs": applied_count,
        "saved_jobs": saved_count,
        "recommended_jobs_count": min(10, total_active_jobs),
        "unread_notifications": unread_notifications,
        "interview_prep_score": 88.0,
        "skill_progress": 78.5
    }

@router.get("/charts")
def get_dashboard_charts_data(current_user: User = Depends(get_current_user)):
    """Returns analytics data for Recharts visualizations."""
    return {
        "monthly_applications": [
            {"month": "Jan", "applications": 4, "interviews": 1},
            {"month": "Feb", "applications": 7, "interviews": 2},
            {"month": "Mar", "applications": 12, "interviews": 3},
            {"month": "Apr", "applications": 15, "interviews": 4},
            {"month": "May", "applications": 10, "interviews": 2},
            {"month": "Jun", "applications": 18, "interviews": 5}
        ],
        "ats_score_trend": [
            {"version": "V1 Initial", "score": 62},
            {"version": "V2 Skills Added", "score": 74},
            {"version": "V3 Formatting", "score": 81},
            {"version": "V4 Current ATS", "score": 88}
        ],
        "skill_category_progress": [
            {"category": "Programming", "level": 90},
            {"category": "Databases", "level": 82},
            {"category": "AI / ML", "level": 75},
            {"category": "Cloud & DevOps", "level": 68},
            {"category": "Frontend", "level": 88}
        ],
        "status_distribution": [
            {"name": "Applied", "value": 8},
            {"name": "Shortlisted", "value": 3},
            {"name": "Interviewing", "value": 2},
            {"name": "Selected", "value": 1}
        ]
    }
