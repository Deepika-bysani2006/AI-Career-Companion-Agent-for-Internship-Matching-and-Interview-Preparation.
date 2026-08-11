"""
AI Career Assistant RAG Chat Routers for SkillBridge.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, ChatSession, ChatMessage, Resume
from app.routers.user import get_current_user
from app.schemas.schemas import ChatMessageRequest
from app.services.ai.career_assistant import generate_ai_chat_response, SUGGESTED_PROMPTS

router = APIRouter(prefix="/chat", tags=["AI Career Assistant"])

@router.post("")
def send_chat_message(data: ChatMessageRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Sends user prompt to AI Career Assistant and returns streaming response."""
    session_id = data.session_id

    if not session_id:
        new_session = ChatSession(user_id=current_user.id, title=data.message[:30] + "...")
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        session_id = new_session.session_id

    # Save user message
    u_msg = ChatMessage(session_id=session_id, sender="user", content=data.message)
    db.add(u_msg)
    db.commit()

    # User context for RAG
    resume = db.query(Resume).filter(Resume.user_id == current_user.id, Resume.is_active == True).first()
    skills = resume.parsed_data.get("skills", []) if (resume and resume.parsed_data) else ["Python", "React", "SQL"]
    
    user_context = {
        "full_name": current_user.full_name,
        "skills": skills
    }

    ai_text = generate_ai_chat_response(data.message, user_context)

    # Save AI response
    ai_msg = ChatMessage(session_id=session_id, sender="ai", content=ai_text)
    db.add(ai_msg)
    db.commit()

    return {
        "session_id": session_id,
        "message": ai_text,
        "sender": "ai"
    }

@router.get("/sessions")
def get_chat_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetches user chat history sessions."""
    sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).order_by(ChatSession.updated_at.desc()).all()
    return sessions

@router.get("/session/{session_id}")
def get_chat_messages(session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetches message history for a specific chat session."""
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    return messages

@router.get("/prompts")
def get_suggested_prompts():
    """Returns sample career assistant prompts."""
    return SUGGESTED_PROMPTS
