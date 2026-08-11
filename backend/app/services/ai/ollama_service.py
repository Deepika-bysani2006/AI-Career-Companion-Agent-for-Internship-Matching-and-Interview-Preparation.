"""
Ollama AI Backend Service for SkillBridge.
Uses llama3.2:3b model running locally at http://localhost:11434.
Handles:
- Resume Review
- ATS Score Analysis
- Skill Gap Analysis
- Career Suggestions
- Resume Improvement
- AI Chat Assistant
- Job Match Analysis

If Ollama is not running, gracefully returns a user-friendly message:
"Please start Ollama and try again." without crashing the application.
"""
import requests
import json
from typing import Dict, Any, List, Optional

OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2:3b"

def generate_ollama_response(prompt: str, system_prompt: Optional[str] = None) -> str:
    """
    Sends a request to local Ollama instance (http://localhost:11434).
    If Ollama is offline or unreachable, returns user-friendly fallback.
    """
    full_prompt = prompt
    if system_prompt:
        full_prompt = f"System: {system_prompt}\nUser: {prompt}"

    payload = {
        "model": MODEL_NAME,
        "prompt": full_prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=10)
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            return "Please start Ollama and try again."
    except requests.exceptions.RequestException:
        # Gracefully handle Ollama offline state without crashing
        return "Please start Ollama and try again."

def review_resume_with_ollama(resume_text: str) -> Dict[str, Any]:
    """Generates AI Resume Review using Ollama llama3.2:3b."""
    prompt = f"Review the following resume and provide key strengths, missing sections, and formatting feedback:\n\n{resume_text}"
    response = generate_ollama_response(prompt, system_prompt="You are an expert ATS Resume Reviewer.")
    return {
        "review": response,
        "model": MODEL_NAME,
        "status": "success" if response != "Please start Ollama and try again." else "offline"
    }

def analyze_ats_score_with_ollama(resume_text: str, job_description: Optional[str] = None) -> Dict[str, Any]:
    """Generates AI ATS Compatibility Analysis using Ollama llama3.2:3b."""
    prompt = f"Analyze this resume text for ATS optimization. Provide feedback on formatting, keywords, and quantitative impacts:\n\nResume:\n{resume_text}"
    if job_description:
        prompt += f"\n\nTarget Job Description:\n{job_description}"
    
    response = generate_ollama_response(prompt, system_prompt="You are an ATS Scoring Engine.")
    return {
        "ats_feedback": response,
        "model": MODEL_NAME
    }

def analyze_skill_gap_with_ollama(user_skills: List[str], required_skills: List[str]) -> str:
    """Analyzes missing skills and suggests learning paths using Ollama llama3.2:3b."""
    prompt = f"Candidate current skills: {', '.join(user_skills)}\nTarget job required skills: {', '.join(required_skills)}\nProvide a skill gap analysis and recommended learning steps."
    return generate_ollama_response(prompt, system_prompt="You are a Technical Skill Gap Advisor.")

def generate_career_suggestions_with_ollama(resume_text: str) -> str:
    """Provides career suggestions using Ollama llama3.2:3b."""
    prompt = f"Based on this candidate's resume, suggest top 5 tech career paths and internship roles they are best suited for:\n\n{resume_text}"
    return generate_ollama_response(prompt, system_prompt="You are a Senior Career Mentor.")

def suggest_resume_improvements_with_ollama(resume_text: str) -> str:
    """Suggests action-oriented resume improvements using Ollama llama3.2:3b."""
    prompt = f"Suggest 5 high-impact improvements to rewrite and enhance this resume:\n\n{resume_text}"
    return generate_ollama_response(prompt, system_prompt="You are a Professional Resume Writer.")

def generate_ai_chat_response(chat_history: List[Dict[str, str]], user_message: str) -> str:
    """RAG AI Career Assistant Chat using Ollama llama3.2:3b."""
    context = ""
    for msg in chat_history[-4:]:
        context += f"{msg.get('role', 'user')}: {msg.get('content', '')}\n"
    context += f"user: {user_message}"

    return generate_ollama_response(context, system_prompt="You are SkillBridge AI Career Assistant, a helpful mentor for tech students seeking internships.")

def analyze_job_match_with_ollama(resume_text: str, job_title: str, job_description: str) -> str:
    """Performs deep Job Match Analysis using Ollama llama3.2:3b."""
    prompt = f"Analyze compatibility between candidate resume and target internship:\nJob Title: {job_title}\nJob Description: {job_description}\n\nCandidate Resume:\n{resume_text}"
    return generate_ollama_response(prompt, system_prompt="You are an AI Job Matching Assistant.")
