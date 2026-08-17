"""
Job Search RAG Engine for SkillBridge.
Performs intelligent PostgreSQL queries for jobs matching student queries or verified skills,
and formats job context for Gemini AI natural language response generation.
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from app.models.models import Job, Company

def query_jobs_for_rag(db: Session, query: str, user_skills: Optional[List[str]] = None, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Queries PostgreSQL jobs table for listings matching user search query or candidate skills.
    """
    query_lower = query.lower()
    
    # Extract location or tech keywords
    keywords = [k.strip() for k in query_lower.replace("internship", "").replace("internships", "").replace("job", "").replace("jobs", "").replace("find", "").replace("show", "").replace("me", "").replace("for", "").replace("in", "").split() if len(k.strip()) > 2]
    
    db_query = db.query(Job).join(Company).filter(Job.is_active == True)
    
    filters = []
    for kw in keywords[:4]:
        pattern = f"%{kw}%"
        filters.append(
            or_(
                Job.job_title.ilike(pattern),
                Job.location.ilike(pattern),
                Job.job_type.ilike(pattern),
                Job.job_description.ilike(pattern),
                Company.company_name.ilike(pattern)
            )
        )
    
    if filters:
        db_query = db_query.filter(or_(*filters))
    
    # If no specific keyword filters or results, fall back to matching candidate skills or top recent internships
    matching_jobs = db_query.order_by(Job.posted_date.desc()).limit(limit).all()
    
    if not matching_jobs and user_skills:
        skill_filters = [Job.job_title.ilike(f"%{s}%") for s in user_skills[:3]]
        matching_jobs = db.query(Job).join(Company).filter(
            Job.is_active == True,
            or_(*skill_filters)
        ).order_by(Job.posted_date.desc()).limit(limit).all()
        
    if not matching_jobs:
        matching_jobs = db.query(Job).join(Company).filter(Job.is_active == True).order_by(Job.posted_date.desc()).limit(limit).all()

    formatted_jobs = []
    for job in matching_jobs:
        formatted_jobs.append({
            "job_id": job.job_id,
            "title": job.job_title,
            "company": job.company.company_name if job.company else "Top Tech Company",
            "location": job.location,
            "job_type": job.job_type,
            "salary_stipend": job.salary_stipend or "Disclosed upon interview",
            "experience": job.experience_required or "Freshers / Students",
            "skills": job.required_skills if isinstance(job.required_skills, list) else ["Python", "Web Development"],
            "platform": job.source_platform or "SkillBridge Verified",
            "url": job.application_url or f"/jobs/{job.job_id}"
        })

    return formatted_jobs

def format_jobs_as_rag_context(jobs: List[Dict[str, Any]]) -> str:
    """Formats job dicts into clear, structured context string for Gemini prompt."""
    if not jobs:
        return "No matching active internships found in PostgreSQL database."
    
    context_lines = []
    for idx, j in enumerate(jobs, 1):
        context_lines.append(
            f"{idx}. **{j['title']}** at **{j['company']}**\n"
            f"   • Location: {j['location']} ({j['job_type']})\n"
            f"   • Stipend/Salary: {j['salary_stipend']}\n"
            f"   • Required Skills: {', '.join(j['skills']) if isinstance(j['skills'], list) else j['skills']}\n"
            f"   • Source Platform: {j['platform']}\n"
            f"   • Application Link: {j['url']}"
        )
    return "\n\n".join(context_lines)
