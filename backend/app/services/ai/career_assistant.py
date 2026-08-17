"""
AI Career Assistant RAG Engine using Google Gemini API (with Ollama fallback).
"""
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.services.gemini_service import generate_gemini_response
from app.services.job_search_rag import query_jobs_for_rag, format_jobs_as_rag_context

SUGGESTED_PROMPTS = [
    "Find AI & Python internships in India",
    "How can I improve my resume for Google Software Engineer Internships?",
    "What are top 5 technical skills I should learn for AI engineering?",
    "Prepare me for a technical interview at IBM or Microsoft",
    "Which internships match my candidate profile & skills?"
]

def generate_ai_chat_response(
    prompt: str, 
    user_context: Dict[str, Any], 
    db: Optional[Session] = None,
    conversation_history: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Generates AI Career Assistant response using Google Gemini API.
    Integrates PostgreSQL job search for job/internship queries.
    """
    skills = user_context.get("skills", ["Python", "React", "FastAPI", "SQL", "Git"])
    name = user_context.get("full_name", "Student")
    
    system_prompt = (
        f"You are SkillBridge AI Career Assistant, an expert career mentor for students and tech candidates. "
        f"Candidate Name: {name}. Candidate Skills: {', '.join(skills) if isinstance(skills, list) else skills}. "
        f"Help users with internship search, resume ATS optimization, skill gap analysis, interview preparation, and technical career advice. "
        f"Be helpful, concise, practical, and action-oriented. Format your responses with clean Markdown headers and bullet points."
    )

    prompt_lower = prompt.lower()
    job_search_triggers = ["job", "internship", "internships", "opening", "openings", "hiring", "role", "roles", "find", "show", "search", "match", "python", "developer", "engineer", "remote", "hyderabad", "bangalore", "mumbai", "delhi"]
    
    is_job_query = any(trigger in prompt_lower for trigger in job_search_triggers)
    job_context = None
    retrieved_jobs = []

    if is_job_query and db is not None:
        retrieved_jobs = query_jobs_for_rag(db, prompt, user_skills=skills if isinstance(skills, list) else [skills], limit=5)
        if retrieved_jobs:
            job_context = format_jobs_as_rag_context(retrieved_jobs)

    res = generate_gemini_response(
        prompt=prompt,
        system_prompt=system_prompt,
        conversation_history=conversation_history,
        job_context=job_context
    )

    return {
        "success": res.get("success", True),
        "response": res.get("response", ""),
        "source": res.get("source", "gemini"),
        "model": res.get("model", "gemini-2.5-flash"),
        "jobs": retrieved_jobs if is_job_query else []
    }
