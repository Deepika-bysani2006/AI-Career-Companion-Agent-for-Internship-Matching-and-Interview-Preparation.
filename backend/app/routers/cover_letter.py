"""
AI Cover Letter Routers for SkillBridge.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, CoverLetter
from app.routers.user import get_current_user
from app.schemas.schemas import CoverLetterGenerateRequest
from app.services.ai.cover_letter_generator import generate_ai_cover_letter

router = APIRouter(prefix="/cover-letter", tags=["AI Cover Letter Generator"])

@router.post("/generate")
def generate_cover_letter(data: CoverLetterGenerateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Generates AI Cover Letter tailored to user profile and specified job/company."""
    user_info = {
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone or "+91 9876543210",
        "college": current_user.college or "University Institute of Technology",
        "branch": current_user.branch or "Computer Science & Artificial Intelligence",
        "skills": ["Python", "FastAPI", "React", "PostgreSQL", "Tailwind CSS", "Docker"]
    }

    result = generate_ai_cover_letter(
        user_info=user_info,
        company_name=data.company_name,
        job_title=data.job_title,
        job_description=data.job_description,
        tone=data.tone or "Professional"
    )

    # Save to history
    cl = CoverLetter(
        user_id=current_user.id,
        company_name=data.company_name,
        job_title=data.job_title,
        tone=data.tone or "Professional",
        content=result["content"]
    )
    db.add(cl)
    db.commit()
    db.refresh(cl)

    result["cover_letter_id"] = cl.id
    return result

@router.get("/history")
def get_cover_letter_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieves generated cover letter history for user."""
    letters = db.query(CoverLetter).filter(CoverLetter.user_id == current_user.id).order_by(CoverLetter.created_at.desc()).all()
    return letters
