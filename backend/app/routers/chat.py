"""
AI Career Assistant RAG Chat Routers for SkillBridge.
Supports both /chat and /ai/chat endpoints with Google Gemini API & PostgreSQL RAG Job Search.
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, ChatSession, ChatMessage, Resume
from app.routers.user import get_current_user
from app.schemas.schemas import ChatMessageRequest
from app.services.ai.career_assistant import generate_ai_chat_response, SUGGESTED_PROMPTS
from app.core.security import verify_token
from app.core.config import settings

router = APIRouter(prefix="", tags=["AI Career Assistant"])

def get_optional_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Optional[User]:
    """Retrieves user if Authorization token header is provided, or returns None gracefully."""
    if not authorization:
        return None
    try:
        token = authorization.replace("Bearer ", "").strip()
        user_id = verify_token(token)
        if user_id:
            return db.query(User).filter(User.id == user_id).first()
    except Exception:
        pass
    return None

@router.post("/chat")
@router.post("/ai/chat")
def send_chat_message(
    data: ChatMessageRequest, 
    current_user: Optional[User] = Depends(get_optional_user), 
    db: Session = Depends(get_db)
):
    """
    Sends user prompt to SkillBridge AI Career Assistant powered by Google Gemini API & PostgreSQL RAG.
    """
    session_id = data.session_id

    if current_user and not session_id:
        new_session = ChatSession(user_id=current_user.id, title=data.message[:30] + "...")
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        session_id = new_session.session_id

    # Save user message if session exists
    if current_user and session_id:
        u_msg = ChatMessage(session_id=session_id, sender="user", content=data.message)
        db.add(u_msg)
        db.commit()

    # Candidate profile context for RAG
    skills = ["Python", "React", "FastAPI", "SQL", "Git"]
    name = "Student"
    
    if current_user:
        name = current_user.full_name
        resume = db.query(Resume).filter(Resume.user_id == current_user.id, Resume.is_active == True).first()
        if resume and resume.parsed_data:
            skills = resume.parsed_data.get("skills", skills)

    user_context = {
        "full_name": name,
        "skills": skills
    }

    # Generate response using Gemini AI + PostgreSQL RAG
    result = generate_ai_chat_response(
        prompt=data.message, 
        user_context=user_context, 
        db=db,
        conversation_history=getattr(data, "conversation_history", None)
    )

    ai_text = result.get("response", "")

    # Save AI response if session exists
    if current_user and session_id:
        ai_msg = ChatMessage(session_id=session_id, sender="ai", content=ai_text)
        db.add(ai_msg)
        db.commit()

    return {
        "success": True,
        "response": ai_text,
        "message": ai_text,
        "source": result.get("source", "gemini"),
        "provider": "gemini",
        "model": result.get("model", getattr(settings, "GEMINI_MODEL", "gemini-2.5-flash")),
        "session_id": session_id,
        "jobs": result.get("jobs", [])
    }

@router.get("/chat/sessions")
def get_chat_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetches user chat history sessions."""
    sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).order_by(ChatSession.updated_at.desc()).all()
    return sessions

@router.get("/chat/session/{session_id}")
def get_chat_messages(session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetches message history for a specific chat session."""
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    return messages

@router.get("/chat/prompts")
@router.get("/ai/prompts")
def get_suggested_prompts():
    """Returns sample career assistant prompts."""
    return SUGGESTED_PROMPTS
