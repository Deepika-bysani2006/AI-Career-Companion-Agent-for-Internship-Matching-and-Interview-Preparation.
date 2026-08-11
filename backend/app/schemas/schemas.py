"""
Pydantic Schemas for Request & Response Data Validation across SkillBridge APIs.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    terms: Optional[bool] = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    credential: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# --- User Profile Schemas ---
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    profile_image: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    profile_image: Optional[str] = None
    role: str
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Resume Schemas ---
class ResumeParseResponse(BaseModel):
    resume_id: str
    file_name: str
    ats_score: float
    parsed_data: Dict[str, Any]

# --- Job Schemas ---
class ScrapeJobsRequest(BaseModel):
    sources: Optional[List[str]] = Field(default_factory=lambda: ["linkedin", "naukri", "unstop", "internshala"])
    keywords: Optional[List[str]] = Field(default_factory=lambda: ["AI", "Data Science", "Python"])
    location: Optional[str] = "India"

class JobResponse(BaseModel):
    job_id: str
    company_name: str
    company_logo: Optional[str] = None
    job_title: str
    job_type: str
    location: str
    salary_stipend: Optional[str] = None
    experience_required: Optional[str] = None
    job_description: str
    responsibilities: Optional[List[str]] = []
    required_skills: List[str]
    preferred_skills: Optional[List[str]] = []
    benefits: Optional[List[str]] = []
    last_date: Optional[str] = None
    application_url: str
    source_platform: str
    posted_date: datetime
    match_score: Optional[float] = None
    is_saved: Optional[bool] = False
    has_applied: Optional[bool] = False

# --- Cover Letter Schemas ---
class CoverLetterGenerateRequest(BaseModel):
    company_name: str
    job_title: str
    job_description: Optional[str] = ""
    tone: Optional[str] = "Professional"

# --- Interview Schemas ---
class StartInterviewRequest(BaseModel):
    company_name: str
    job_title: str
    interview_type: str # HR, Technical, Behavioral, System Design, Coding

class SubmitAnswerRequest(BaseModel):
    question: str
    answer: str
    interview_type: str

# --- AI Chat Schemas ---
class ChatMessageRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
