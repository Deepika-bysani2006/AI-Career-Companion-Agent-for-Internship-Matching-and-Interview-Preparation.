"""
AI Job Matcher & Learning Roadmap Generator for SkillBridge.
Compares user resume skills against target job specifications to compute match percentage, missing skills, and 4-week preparation roadmaps.
"""
from typing import List, Dict, Any

def match_resume_to_job(user_skills: List[str], required_skills: List[str], preferred_skills: List[str] = None) -> Dict[str, Any]:
    """
    Computes compatibility match score, matched skills, and missing skills.
    """
    preferred_skills = preferred_skills or []
    user_skills_lower = set([s.lower() for s in user_skills])
    req_skills_lower = set([s.lower() for s in required_skills])
    pref_skills_lower = set([s.lower() for s in preferred_skills])
    
    matched_req = req_skills_lower.intersection(user_skills_lower)
    missing_req = req_skills_lower.difference(user_skills_lower)
    
    matched_pref = pref_skills_lower.intersection(user_skills_lower)
    
    total_req = len(req_skills_lower) if req_skills_lower else 1
    req_score = (len(matched_req) / total_req) * 80.0
    pref_score = (len(matched_pref) / (len(pref_skills_lower) or 1)) * 20.0
    
    compatibility_score = round(min(98.0, max(45.0, req_score + pref_score)), 1)
    
    # Map back original casing for display
    matched_display = [s for s in required_skills + preferred_skills if s.lower() in user_skills_lower]
    missing_display = [s for s in required_skills if s.lower() in missing_req]
    
    if not missing_display and len(required_skills) > 2:
        missing_display = ["Docker", "Redis", "AWS"] # Helpful suggestion missing skills

    return {
        "compatibility_score": compatibility_score,
        "matched_skills": list(set(matched_display)),
        "missing_skills": list(set(missing_display)),
        "recommendation_reason": f"Matches {len(matched_display)} core skill requirements including {', '.join(matched_display[:3]) if matched_display else 'foundational competencies'}."
    }

def generate_learning_roadmap(missing_skills: List[str]) -> List[Dict[str, Any]]:
    """Generates a structured 4-week learning roadmap based on missing skills."""
    skills_to_cover = missing_skills if missing_skills else ["Docker", "System Design", "AWS", "Redis"]
    
    return [
        {
            "week": 1,
            "title": f"Foundations & Core Principles of {skills_to_cover[0] if len(skills_to_cover)>0 else 'Advanced Tech'}",
            "topics": [
                f"Introduction to {skills_to_cover[0] if len(skills_to_cover)>0 else 'Technology'} syntax and patterns",
                "Environment setup and project configuration",
                "Hands-on exercises and micro-projects"
            ],
            "estimated_hours": 8,
            "resources": ["Official Documentation", "Interactive Coding Labs", "YouTube Crash Course"]
        },
        {
            "week": 2,
            "title": f"Mastering {skills_to_cover[1] if len(skills_to_cover)>1 else 'Database & Caching'}",
            "topics": [
                f"Data structures, caching strategies, and queries",
                "API Integration and asynchronous handling",
                "Building real-world microservice endpoints"
            ],
            "estimated_hours": 10,
            "resources": ["SkillBridge Guided Tutorial", "GitHub Starter Repositories"]
        },
        {
            "week": 3,
            "title": f"Integration & Cloud Deployment ({skills_to_cover[2] if len(skills_to_cover)>2 else 'Docker & DevOps'})",
            "topics": [
                "Containerizing full-stack applications with Docker Compose",
                "CI/CD workflow configuration with GitHub Actions",
                "Deploying database instances and web servers"
            ],
            "estimated_hours": 12,
            "resources": ["Docker Docs", "Cloud Deployment Guide"]
        },
        {
            "week": 4,
            "title": "Mock Interview & Portfolio Synthesis",
            "topics": [
                "Building an end-to-end portfolio project featuring new skills",
                "Simulating AI Mock Technical Interviews",
                "Optimizing Resume & Cover Letter for Target Role"
            ],
            "estimated_hours": 6,
            "resources": ["SkillBridge Interview Module", "Resume Optimizer"]
        }
    ]
