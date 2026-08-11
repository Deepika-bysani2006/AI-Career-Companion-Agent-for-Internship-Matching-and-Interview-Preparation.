"""
AI Career Assistant RAG Engine using Ollama (llama3.2:3b).
"""
from typing import Dict, Any, List
from app.services.ai.ollama_service import generate_ollama_response

SUGGESTED_PROMPTS = [
    "How can I improve my resume for Google Software Engineer Internships?",
    "What are top 5 technical skills I should learn for AI engineering?",
    "Generate 3 impressive bullet points for a FastAPI project on my resume.",
    "How do I answer 'Tell me about a technical challenge you faced' in an interview?",
    "What is the average stipend for Full Stack Internships in India?",
    "Review my skill gap for cloud & DevOps engineering roles."
]

def generate_ai_chat_response(prompt: str, user_context: Dict[str, Any]) -> str:
    """
    Generates response using Ollama llama3.2:3b API at http://localhost:11434.
    If Ollama is not running, gracefully returns: "Please start Ollama and try again."
    """
    skills = user_context.get("skills", ["Python", "React", "FastAPI"])
    name = user_context.get("full_name", "Candidate")
    
    system_prompt = (
        f"You are SkillBridge AI Career Assistant. Candidate Name: {name}. "
        f"Verified Candidate Skills: {', '.join(skills)}. "
        f"Provide concise, practical career guidance, resume tips, and interview strategies."
    )

    response = generate_ollama_response(prompt, system_prompt=system_prompt)
    return response
