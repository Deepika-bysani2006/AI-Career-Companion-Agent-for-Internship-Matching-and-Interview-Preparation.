"""
AI Job Search & Mock Scraper Routers for SkillBridge.
Provides querying over 1000 PostgreSQL mock job records with:
- Keyword search across titles, companies, locations, descriptions, and required skills JSON
- Company filter
- Skill filter
- Location filter
- Work mode filter (Remote / Hybrid / Onsite)
- Internship type filter (Internship / Full Time)
- Sorting & Pagination
- Endpoints: GET /jobs, GET /jobs/{id}, GET /jobs/search, GET /jobs/recommended
"""
from typing import Optional, List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import cast, String
from app.database.session import get_db
from app.models.models import Job, Company, SavedJob, Application, User, Resume
from app.routers.user import get_current_user
from app.services.ai.job_matcher import match_resume_to_job

router = APIRouter(prefix="/jobs", tags=["AI Job Search"])

@router.get("")
@router.get("/search")
def search_jobs(
    keyword: Optional[str] = None,
    search: Optional[str] = None,
    company: Optional[str] = None,
    skills: Optional[str] = None,
    location: Optional[str] = None,
    work_mode: Optional[str] = None,
    internship_type: Optional[str] = None,
    job_type: Optional[str] = None,
    source: Optional[str] = None,
    remote_only: Optional[bool] = False,
    sort_by: Optional[str] = "newest",
    page: int = 1,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Queries PostgreSQL mock job listings with filtering by keyword, company, skills, location, work_mode, internship_type, sorting, and pagination.
    """
    query = db.query(Job).join(Company).filter(Job.is_active == True)

    raw_term = keyword if (keyword and isinstance(keyword, str)) else search
    if raw_term and isinstance(raw_term, str) and raw_term.strip():
        term = raw_term.strip()
        query = query.filter(
            (Job.job_title.ilike(f"%{term}%")) |
            (Company.company_name.ilike(f"%{term}%")) |
            (Job.location.ilike(f"%{term}%")) |
            (Job.job_description.ilike(f"%{term}%")) |
            (cast(Job.required_skills, String).ilike(f"%{term}%"))
        )

    if company and isinstance(company, str) and company.strip():
        query = query.filter(Company.company_name.ilike(f"%{company.strip()}%"))

    if location and isinstance(location, str) and location.strip():
        query = query.filter(Job.location.ilike(f"%{location.strip()}%"))

    if work_mode and isinstance(work_mode, str) and work_mode.strip():
        query = query.filter((Job.job_type.ilike(f"%{work_mode.strip()}%")) | (Job.location.ilike(f"%{work_mode.strip()}%")))

    if internship_type and isinstance(internship_type, str) and internship_type.strip():
        query = query.filter(Job.job_type.ilike(f"%{internship_type.strip()}%"))

    if job_type and job_type != "All":
        query = query.filter(Job.job_type.ilike(f"%{job_type}%"))

    if source and source != "All":
        query = query.filter(Job.source_platform.ilike(f"%{source}%"))

    if remote_only:
        query = query.filter((Job.job_type.ilike("%Remote%")) | (Job.location.ilike("%Remote%")))

    # Sorting
    if sort_by == "oldest":
        query = query.order_by(Job.posted_date.asc())
    else:
        query = query.order_by(Job.posted_date.desc())

    total = query.count()
    jobs = query.offset((page - 1) * limit).limit(limit).all()

    result = []
    for j in jobs:
        req = j.required_skills or ["Python", "React"]
        if skills and isinstance(skills, str):
            if not any(skills.lower() in s.lower() for s in req):
                continue

        result.append({
            "job_id": j.job_id,
            "company_name": j.company.company_name if j.company else "Tech Corp",
            "company_logo": j.company.company_logo if j.company else None,
            "job_title": j.job_title,
            "source_platform": j.source_platform,
            "location": j.location,
            "job_type": j.job_type,
            "work_mode": j.job_type.split("•")[0].strip() if "•" in j.job_type else j.job_type,
            "internship_type": j.job_type.split("•")[1].strip() if "•" in j.job_type else "Internship",
            "salary_stipend": j.salary_stipend,
            "duration": "3 - 6 Months",
            "required_skills": req,
            "experience_level": j.experience_required,
            "job_description": j.job_description,
            "responsibilities": j.responsibilities or [],
            "requirements": j.preferred_skills or [],
            "apply_url": j.application_url,
            "posted_date": j.posted_date,
            "expiry_date": j.posted_date + timedelta(days=30),
            "category": j.company.industry if j.company else "Technology",
            "match_score": 88
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "jobs": result
    }

@router.get("/recommendations")
@router.get("/recommended")
def get_recommended_jobs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns AI recommended mock job listings matched against candidate profile."""
    resume = db.query(Resume).filter(Resume.user_id == current_user.id, Resume.is_active == True).first()
    user_skills = ["Python", "JavaScript", "React", "FastAPI", "SQL"]
    if resume and resume.parsed_data and "skills" in resume.parsed_data:
        user_skills = resume.parsed_data["skills"]

    jobs = db.query(Job).join(Company).filter(Job.is_active == True).limit(50).all()

    recommended = []
    for j in jobs:
        req_skills = j.required_skills or ["Python", "React"]
        pref_skills = j.preferred_skills or ["Docker", "AWS"]
        match_info = match_resume_to_job(user_skills, req_skills, pref_skills)

        is_saved = db.query(SavedJob).filter(SavedJob.user_id == current_user.id, SavedJob.job_id == j.job_id).first() is not None
        has_applied = db.query(Application).filter(Application.user_id == current_user.id, Application.job_id == j.job_id).first() is not None

        recommended.append({
            "job_id": j.job_id,
            "company_name": j.company.company_name if j.company else "Company",
            "company_logo": j.company.company_logo if j.company else None,
            "job_title": j.job_title,
            "source_platform": j.source_platform,
            "location": j.location,
            "job_type": j.job_type,
            "work_mode": j.job_type,
            "salary_stipend": j.salary_stipend,
            "experience_level": j.experience_required,
            "job_description": j.job_description,
            "required_skills": req_skills,
            "apply_url": j.application_url,
            "posted_date": j.posted_date,
            "match_score": match_info["compatibility_score"],
            "matched_skills": match_info["matched_skills"],
            "missing_skills": match_info["missing_skills"],
            "recommendation_reason": match_info["recommendation_reason"],
            "is_saved": is_saved,
            "has_applied": has_applied
        })

    recommended.sort(key=lambda x: x["match_score"], reverse=True)
    return recommended[:15]

@router.get("/{job_id}")
def get_job_by_id(job_id: str, db: Session = Depends(get_db)):
    """Fetches details of a single job record from PostgreSQL by ID."""
    j = db.query(Job).join(Company).filter(Job.job_id == job_id).first()
    if not j:
        raise HTTPException(status_code=404, detail="Job record not found.")

    return {
        "job_id": j.job_id,
        "company_id": j.company_id,
        "company_name": j.company.company_name if j.company else "Company",
        "company_logo": j.company.company_logo if j.company else None,
        "source_platform": j.source_platform,
        "job_title": j.job_title,
        "job_type": j.job_type,
        "work_mode": j.job_type,
        "location": j.location,
        "salary_stipend": j.salary_stipend,
        "experience_level": j.experience_required,
        "job_description": j.job_description,
        "responsibilities": j.responsibilities or [],
        "requirements": j.preferred_skills or [],
        "required_skills": j.required_skills or [],
        "apply_url": j.application_url,
        "posted_date": j.posted_date,
        "category": j.company.industry if j.company else "Technology",
        "match_score": 92
    }

@router.post("/{job_id}/save")
def toggle_save_job(job_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Bookmarks a job listing."""
    existing = db.query(SavedJob).filter(SavedJob.user_id == current_user.id, SavedJob.job_id == job_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "message": "Job removed from saved list."}
    else:
        new_save = SavedJob(user_id=current_user.id, job_id=job_id)
        db.add(new_save)
        db.commit()
        return {"saved": True, "message": "Job saved successfully!"}

@router.post("/{job_id}/apply")
def record_application(job_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Records job application redirect."""
    existing = db.query(Application).filter(Application.user_id == current_user.id, Application.job_id == job_id).first()
    if not existing:
        app = Application(user_id=current_user.id, job_id=job_id, status="Applied")
        db.add(app)
        db.commit()
    
    j = db.query(Job).filter(Job.job_id == job_id).first()
    return {"apply_url": j.application_url if j else "https://linkedin.com", "status": "Recorded"}
