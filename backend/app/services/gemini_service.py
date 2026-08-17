"""
Google Gemini AI Production Service Engine for SkillBridge.
Uses the official Google GenAI SDK (google.genai) with REST fallback.
Reads GEMINI_API_KEY and GEMINI_MODEL strictly from backend environment variables.
Handles offline/missing states gracefully without leaking API keys or crashing FastAPI.
"""
import os
import requests
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger("skillbridge.gemini")

def get_gemini_model_name() -> str:
    """Returns configured Gemini model name or sensible default."""
    return getattr(settings, "GEMINI_MODEL", "gemini-2.5-flash") or "gemini-2.5-flash"

def generate_gemini_response(
    prompt: str, 
    system_prompt: Optional[str] = None, 
    conversation_history: Optional[List[Dict[str, str]]] = None,
    job_context: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generates AI text using Google Gemini API.
    Returns structured dict: { "success": bool, "response": str, "source": "gemini", "model": str }
    """
    api_key = getattr(settings, "GEMINI_API_KEY", "") or os.getenv("GEMINI_API_KEY", "")
    model_name = get_gemini_model_name()

    if not api_key:
        logger.warning("GEMINI_API_KEY is not configured in backend environment.")
        return {
            "success": False,
            "response": (
                "🎯 **SkillBridge AI Career Assistant:**\n\n"
                "To unlock live production generative AI responses, please configure `GEMINI_API_KEY` in your Render Environment Variables.\n\n"
                "**Quick Guidance:**\n"
                "• **ATS Resume Tip**: Quantify project impact (e.g. 'Improved API performance by 40%').\n"
                "• **Skill Gap Advice**: Master Python, FastAPI, React, SQL, and Git for modern AI engineering internships."
            ),
            "source": "fallback",
            "model": model_name
        }

    # Prepare context and prompt
    full_prompt_parts = []
    if system_prompt:
        full_prompt_parts.append(f"System Context: {system_prompt}")
    
    if job_context:
        full_prompt_parts.append(f"Verified Database Internship Listings:\n{job_context}")

    if conversation_history and isinstance(conversation_history, list):
        history_str = "Conversation History:\n"
        for msg in conversation_history[-6:]:
            if isinstance(msg, dict):
                role = msg.get("role", msg.get("sender", "user"))
                content = msg.get("content", msg.get("message", ""))
                history_str += f"- {role}: {content}\n"
        full_prompt_parts.append(history_str)

    full_prompt_parts.append(f"User Request: {prompt}")
    final_prompt = "\n\n".join(full_prompt_parts)

    # 1. Try Google GenAI SDK (google.genai)
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        res = client.models.generate_content(
            model=model_name,
            contents=final_prompt,
        )
        if res and res.text:
            return {
                "success": True,
                "response": res.text.strip(),
                "source": "gemini",
                "model": model_name
            }
    except Exception as e:
        logger.warning(f"GenAI SDK notice (attempting fallback REST API): {e}")

    # 2. Try REST API fallback if SDK model or package varies
    try:
        # Test models in order: configured model, gemini-2.5-flash, gemini-1.5-flash
        candidate_models = [model_name, "gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"]
        for m in candidate_models:
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": final_prompt}]}]
            }
            res = requests.post(gemini_url, json=payload, timeout=15)
            if res.status_code == 200:
                data = res.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        text_out = parts[0].get("text", "").strip()
                        if text_out:
                            return {
                                "success": True,
                                "response": text_out,
                                "source": "gemini",
                                "model": m
                            }
    except Exception as err:
        logger.error(f"Gemini REST API exception: {err}")

    # 3. Graceful Fallback if API key is invalid or quota is exceeded
    return {
        "success": False,
        "response": (
            "SkillBridge AI Assistant: I am currently operating in offline backup mode. "
            "Please check backend API keys or network connectivity to resume live generative AI."
        ),
        "source": "fallback",
        "model": model_name
    }
