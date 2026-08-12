"""
AI & NLP Service Engine for SkillBridge.
Supports both Local Ollama (llama3.2:3b) and Production Cloud Google Gemini API.
Reads OLLAMA_BASE_URL and GEMINI_API_KEY strictly from backend environment variables.
Handles offline states and missing keys gracefully with rich contextual fallback guidance.
"""
import requests
import json
from typing import Dict, Any, List, Optional
from app.core.config import settings

MODEL_NAME = "llama3.2:3b"

def generate_ai_response(prompt: str, system_prompt: Optional[str] = None) -> str:
    """
    Generates AI text using local Ollama instance (http://localhost:11434) or Cloud Google Gemini API if configured.
    If both are offline/missing, returns rich contextual career mentor guidance.
    """
    full_prompt = prompt
    if system_prompt:
        full_prompt = f"System: {system_prompt}\nUser: {prompt}"

    # 1. Try Google Gemini API if GEMINI_API_KEY is configured in backend environment
    if settings.GEMINI_API_KEY:
        try:
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
            payload = {
                "contents": [{"parts": [{"text": full_prompt}]}]
            }
            res = requests.post(gemini_url, json=payload, timeout=12)
            if res.status_code == 200:
                data = res.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()
        except Exception as e:
            print(f"Gemini API warning: {e}")

    # 2. Try Local / Cloud Ollama Instance
    ollama_url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"
    payload = {
        "model": MODEL_NAME,
        "prompt": full_prompt,
        "stream": False
    }

    try:
        response = requests.post(ollama_url, json=payload, timeout=5)
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
    except requests.exceptions.RequestException:
        pass

    # 3. Rich Contextual Mentor Guidance Fallback if Ollama/Gemini are unconfigured
    prompt_lower = prompt.lower()
    if "resume" in prompt_lower or "ats" in prompt_lower:
        return (
            "🎯 **SkillBridge AI Resume Insights:**\n\n"
            "1. **Impact Quantifications**: Add measurable metrics to your project bullet points (e.g. 'Optimized REST API response time by 40% using Redis').\n"
            "2. **Core Keywords**: Ensure top technical skills (Python, React, FastAPI, SQL, Git) are listed in a dedicated Skills section.\n"
            "3. **Formatting**: Use clean single-column bullet formatting for ATS parser readability.\n\n"
            "*(Note: To unlock live generative AI, set `GEMINI_API_KEY` in your `.env` or start local Ollama via `ollama run llama3.2:3b`)*"
        )
    elif "skill" in prompt_lower or "gap" in prompt_lower:
        return (
            "💡 **Skill Gap & Career Roadmap Recommendation:**\n\n"
            "• **Foundational Stack**: Master Data Structures, Algorithms, REST API Architecture, and Git.\n"
            "• **Frontend Stack**: Practice React 18, TypeScript, Tailwind CSS, and State Management.\n"
            "• **Backend Stack**: Practice FastAPI/Node.js, PostgreSQL relational schema design, and Docker deployment.\n\n"
            "*(Note: Set `GEMINI_API_KEY` in `.env` or start Ollama locally for custom AI generation)*"
        )
    elif "cover letter" in prompt_lower:
        return (
            "Dear Hiring Manager,\n\n"
            "I am excited to express my interest in the internship opportunity at your organization. With a solid foundation in modern software engineering practices, full-stack web development, and AI integration, I am eager to contribute to your team's success.\n\n"
            "Thank you for considering my application.\n\n"
            "Sincerely,\nCandidate"
        )
    else:
        return (
            "SkillBridge AI Mentor: Excellent career initiative! Focus on building 2-3 full-stack portfolio projects, practicing Data Structures on LeetCode, and customizing your resume for each target internship application."
        )

# Alias for backward compatibility
generate_ollama_response = generate_ai_response

def review_resume_with_ollama(resume_text: str) -> Dict[str, Any]:
    """Generates AI Resume Review using Ollama or Gemini API."""
    prompt = f"Review the following resume and provide key strengths, missing sections, and formatting feedback:\n\n{resume_text}"
    response = generate_ai_response(prompt, system_prompt="You are an expert ATS Resume Reviewer.")
    return {
        "review": response,
        "model": "Gemini 1.5 Flash / Ollama / SkillBridge AI Engine",
        "status": "success"
    }

def analyze_ats_score_with_ollama(resume_text: str, job_description: Optional[str] = None) -> Dict[str, Any]:
    """Generates AI ATS Compatibility Analysis."""
    prompt = f"Analyze this resume text for ATS optimization. Provide feedback on formatting, keywords, and quantitative impacts:\n\nResume:\n{resume_text}"
    if job_description:
        prompt += f"\n\nTarget Job Description:\n{job_description}"
    
    response = generate_ai_response(prompt, system_prompt="You are an ATS Scoring Engine.")
    return {
        "ats_feedback": response,
        "model": "Gemini 1.5 Flash / Ollama / SkillBridge AI Engine"
    }

def analyze_skill_gap_with_ollama(user_skills: List[str], required_skills: List[str]) -> str:
    """Analyzes missing skills and suggests learning paths."""
    prompt = f"Candidate current skills: {', '.join(user_skills)}\nTarget job required skills: {', '.join(required_skills)}\nProvide a skill gap analysis and recommended learning steps."
    return generate_ai_response(prompt, system_prompt="You are a Technical Skill Gap Advisor.")

def generate_career_suggestions_with_ollama(resume_text: str) -> str:
    """Provides career suggestions."""
    prompt = f"Based on this candidate's resume, suggest top 5 tech career paths and internship roles they are best suited for:\n\n{resume_text}"
    return generate_ai_response(prompt, system_prompt="You are a Senior Career Mentor.")

def suggest_resume_improvements_with_ollama(resume_text: str) -> str:
    """Suggests action-oriented resume improvements."""
    prompt = f"Suggest 5 high-impact improvements to rewrite and enhance this resume:\n\n{resume_text}"
    return generate_ai_response(prompt, system_prompt="You are a Professional Resume Writer.")

def generate_ai_chat_response(chat_history: List[Dict[str, str]], user_message: str) -> str:
    """RAG AI Career Assistant Chat."""
    context = ""
    for msg in chat_history[-4:]:
        context += f"{msg.get('role', 'user')}: {msg.get('content', '')}\n"
    context += f"user: {user_message}"

    return generate_ai_response(context, system_prompt="You are SkillBridge AI Career Assistant, a helpful mentor for tech students seeking internships.")

def analyze_job_match_with_ollama(resume_text: str, job_title: str, job_description: str) -> str:
    """Performs deep Job Match Analysis."""
    prompt = f"Analyze compatibility between candidate resume and target internship:\nJob Title: {job_title}\nJob Description: {job_description}\n\nCandidate Resume:\n{resume_text}"
    return generate_ai_response(prompt, system_prompt="You are an AI Job Matching Assistant.")
