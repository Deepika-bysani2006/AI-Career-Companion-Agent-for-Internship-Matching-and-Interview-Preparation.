"""
SQLAlchemy ORM Data Models for SkillBridge.
Covers Users, Resumes, Jobs, Companies, Applications, AI Assistant, Interviews, and Analytics.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    college = Column(String(255), nullable=True)
    branch = Column(String(255), nullable=True)
    year = Column(String(50), nullable=True)
    profile_image = Column(Text, nullable=True)
    role = Column(String(50), default="student", nullable=False) # 'student', 'admin'
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    cover_letters = relationship("CoverLetter", back_populates="user", cascade="all, delete-orphan")
    generated_resumes = relationship("GeneratedResume", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    interview_reports = relationship("InterviewReport", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
    notification_preferences = relationship("NotificationPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"

    resume_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(Text, nullable=False)
    file_size = Column(Integer, nullable=False)
    file_type = Column(String(50), nullable=False)
    ats_score = Column(Float, default=0.0)
    parsed_data = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    upload_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    skills = relationship("ResumeSkill", back_populates="resume", cascade="all, delete-orphan")
    education = relationship("ResumeEducation", back_populates="resume", cascade="all, delete-orphan")
    experience = relationship("ResumeExperience", back_populates="resume", cascade="all, delete-orphan")
    projects = relationship("ResumeProject", back_populates="resume", cascade="all, delete-orphan")

class ResumeSkill(Base):
    __tablename__ = "resume_skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.resume_id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    category = Column(String(100), default="Programming") # Programming, Framework, Database, Tool, Soft Skill

    resume = relationship("Resume", back_populates="skills")

class ResumeEducation(Base):
    __tablename__ = "resume_education"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.resume_id", ondelete="CASCADE"), nullable=False)
    institution = Column(String(255), nullable=False)
    degree = Column(String(255), nullable=False)
    field_of_study = Column(String(255), nullable=True)
    grade_cgpa = Column(String(50), nullable=True)
    start_year = Column(String(20), nullable=True)
    end_year = Column(String(20), nullable=True)

    resume = relationship("Resume", back_populates="education")

class ResumeExperience(Base):
    __tablename__ = "resume_experience"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.resume_id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    duration = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    resume = relationship("Resume", back_populates="experience")

class ResumeProject(Base):
    __tablename__ = "resume_projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.resume_id", ondelete="CASCADE"), nullable=False)
    project_title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    technologies = Column(String(255), nullable=True)
    link = Column(String(255), nullable=True)

    resume = relationship("Resume", back_populates="projects")

class Company(Base):
    __tablename__ = "companies"

    company_id = Column(String(36), primary_key=True, default=generate_uuid)
    company_name = Column(String(255), nullable=False, index=True)
    company_logo = Column(Text, nullable=True)
    company_website = Column(String(255), nullable=True)
    company_description = Column(Text, nullable=True)
    industry = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")

class Job(Base):
    __tablename__ = "jobs"

    job_id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.company_id", ondelete="CASCADE"), nullable=False)
    job_title = Column(String(255), nullable=False, index=True)
    job_type = Column(String(50), default="Internship") # Internship, Full Time, Part Time, Remote, Hybrid
    location = Column(String(255), nullable=False)
    salary_stipend = Column(String(100), nullable=True)
    experience_required = Column(String(100), default="Freshers / 0-1 Years")
    job_description = Column(Text, nullable=False)
    responsibilities = Column(JSON, nullable=True)
    required_skills = Column(JSON, nullable=False)
    preferred_skills = Column(JSON, nullable=True)
    benefits = Column(JSON, nullable=True)
    last_date = Column(String(50), nullable=True)
    application_url = Column(Text, nullable=False)
    source_platform = Column(String(50), default="LinkedIn") # LinkedIn, Naukri, Unstop, Internshala, Indeed, Google, Microsoft, IBM, Amazon
    posted_date = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    saved_by = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"

    application_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(String(36), ForeignKey("jobs.job_id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="Applied") # Applied, Under Review, Shortlisted, Interview Scheduled, Technical Round, HR Round, Selected, Rejected, Offer Received
    applied_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")

class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(String(36), ForeignKey("jobs.job_id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_by")

class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="Job") # Job, Application, Interview, Resume, Security, System
    is_read = Column(Boolean, default=False)
    action_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class NotificationPreference(Base):
    __tablename__ = "notification_preferences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    email_notifications = Column(Boolean, default=True)
    job_alerts = Column(Boolean, default=True)
    interview_reminders = Column(Boolean, default=True)
    application_updates = Column(Boolean, default=True)
    ai_suggestions = Column(Boolean, default=True)

    user = relationship("User", back_populates="notification_preferences")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    session_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), default="New Career Conversation")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    message_id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("chat_sessions.session_id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(20), nullable=False) # 'user', 'ai'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

class InterviewReport(Base):
    __tablename__ = "interview_reports"

    report_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(255), nullable=False)
    role_title = Column(String(255), nullable=False)
    interview_type = Column(String(50), nullable=False) # HR, Technical, Behavioral, System Design, Coding
    overall_score = Column(Float, default=0.0)
    technical_score = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)
    feedback_details = Column(JSON, nullable=True)
    date_taken = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interview_reports")

class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    tone = Column(String(50), default="Professional")
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="cover_letters")

class GeneratedResume(Base):
    __tablename__ = "generated_resumes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    template_name = Column(String(100), default="Modern")
    ats_score = Column(Float, default=85.0)
    content_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="generated_resumes")

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="activity_logs")
