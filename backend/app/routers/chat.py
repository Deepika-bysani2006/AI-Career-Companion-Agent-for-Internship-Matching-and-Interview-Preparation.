"""
AI Career Assistant RAG Chat Routers for SkillBridge.
Supports both /chat and /ai/chat endpoints with Ollama integration and production fallback.
"""
from fastapi import APIRouter, Depends, HTTPException, OptionalHeader
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, ChatSession, ChatMessage, Resume
from app.routers.user import get_current_user
from app.schemas.schemas import ChatMessageRequest
from app.services.ai.career_assistant import generate_ai_chat_response, SUGGESTED_PROMPTS
from app.core.security import verify_token
from app.core.config import settings

router = APIRouter(prefix="", tags=["AI Career Assistant"])

def get_optional_user(token: Optional[str] = None, db: Session = Depends(get_db)) -> Optional[User]:
    """Retrieves user if token is provided, or returns None gracefully."""
    if not token:
        return None
    try:
        user_id = verify_token(token.replace("Bearer ", "").strip())
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
    """Sends user prompt to SkillBridge AI Assistant (Ollama llama3.2:3b / Gemini / Contextual Fallback)."""
    session_id = data.session_id
    user_id = current_user.id if current_user else "guest"

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

    # User context for RAG AI system prompt
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

    ai_text = generate_ai_chat_response(data.message, user_context)

    # Save AI response if session exists
    if current_user and session_id:
        ai_msg = ChatMessage(session_id=session_id, sender="ai", content=ai_text)
        db.add(ai_msg)
        db.commit()

    return {
        "success": True,
        "response": ai_text,
        "message": ai_text,
        "provider": "ollama",
        "model": getattr(settings, "OLLAMA_MODEL", "llama3.2:3b"),
        "session_id": session_id
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
