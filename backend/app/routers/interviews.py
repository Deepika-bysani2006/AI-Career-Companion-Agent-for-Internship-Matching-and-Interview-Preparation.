"""
AI Mock Interview & Prep Routers for SkillBridge.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, InterviewReport
from app.routers.user import get_current_user
from app.schemas.schemas import StartInterviewRequest, SubmitAnswerRequest
from app.services.ai.interview_engine import get_interview_questions, evaluate_interview_answer

router = APIRouter(prefix="/interviews", tags=["AI Mock Interview"])

@router.post("/start")
def start_interview_session(data: StartInterviewRequest, current_user: User = Depends(get_current_user)):
    """Starts interactive AI mock interview session with question set."""
    questions = get_interview_questions(company=data.company_name, category=data.interview_type)
    return {
        "company_name": data.company_name,
        "job_title": data.job_title,
        "interview_type": data.interview_type,
        "total_questions": len(questions),
        "questions": questions
    }

@router.post("/evaluate-answer")
def evaluate_answer(data: SubmitAnswerRequest, current_user: User = Depends(get_current_user)):
    """Evaluates candidate response and returns technical accuracy and confidence feedback."""
    eval_result = evaluate_interview_answer(question=data.question, answer=data.answer)
    return eval_result

@router.post("/save-report")
def save_interview_report(report_data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Saves final mock interview report metrics."""
    report = InterviewReport(
        user_id=current_user.id,
        company_name=report_data.get("company_name", "General"),
        role_title=report_data.get("job_title", "Software Developer"),
        interview_type=report_data.get("interview_type", "Technical"),
        overall_score=report_data.get("overall_score", 85.0),
        technical_score=report_data.get("technical_score", 82.0),
        communication_score=report_data.get("communication_score", 88.0),
        confidence_score=report_data.get("confidence_score", 85.0),
        feedback_details=report_data.get("details", {})
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return {"message": "Interview performance report saved successfully!", "report_id": report.report_id}

@router.get("/history")
def get_interview_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieves user interview practice history."""
    reports = db.query(InterviewReport).filter(InterviewReport.user_id == current_user.id).order_by(InterviewReport.date_taken.desc()).all()
    return reports
