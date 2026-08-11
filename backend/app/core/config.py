"""
Core Configuration File for SkillBridge Backend.
Loads environment variables for PostgreSQL, JWT Security, Google OAuth, Apify, Gemini, and Ollama.
Supports both Docker ('postgres') and local Windows VS Code development ('127.0.0.1' / 'localhost') as well as Cloud DBs (Neon/Render).
No real credentials or passwords are hardcoded in this source file.
"""
import os
import socket
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load .env file explicitly from workspace root directory or backend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ROOT_ENV = os.path.join(BASE_DIR, ".env")
if os.path.exists(ROOT_ENV):
    load_dotenv(ROOT_ENV)
else:
    load_dotenv()

def get_effective_db_host() -> str:
    """
    Returns 'postgres' when running inside Docker container (where DNS hostname 'postgres' resolves),
    or '127.0.0.1' (IPv4 loopback) when running directly on Windows host system.
    """
    env_host = os.getenv("POSTGRES_HOST")
    if env_host:
        if env_host == "postgres":
            try:
                socket.gethostbyname("postgres")
                return "postgres"
            except socket.gaierror:
                return "127.0.0.1"
        if env_host == "localhost":
            return "127.0.0.1"
        return env_host

    try:
        socket.gethostbyname("postgres")
        return "postgres"
    except socket.gaierror:
        return "127.0.0.1"

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillBridge – AI Internship Application Agent"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # PostgreSQL Config
    POSTGRES_HOST: str = get_effective_db_host()
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "skillbridge_db")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "skillbridge")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "")

    @property
    def DATABASE_URL(self) -> str:
        env_url = os.getenv("DATABASE_URL")
        if env_url:
            # Render/Neon postgres:// prefix fix for SQLAlchemy 2.0 compatibility
            if env_url.startswith("postgres://"):
                env_url = env_url.replace("postgres://", "postgresql://", 1)
            # If running on Windows host where 'postgres' hostname cannot be resolved, auto-switch to 127.0.0.1
            if "@postgres:" in env_url:
                try:
                    socket.gethostbyname("postgres")
                except socket.gaierror:
                    env_url = env_url.replace("@postgres:", "@127.0.0.1:")
            if "@localhost:" in env_url:
                env_url = env_url.replace("@localhost:", "@127.0.0.1:")
            return env_url

        host = get_effective_db_host()
        user = self.POSTGRES_USER
        password = self.POSTGRES_PASSWORD
        port = self.POSTGRES_PORT
        db = self.POSTGRES_DB
        return f"postgresql://{user}:{password}@{host}:{port}/{db}"

    # Frontend URL for CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "skillbridge_jwt_secret_key_2026")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "skillbridge_secret_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")

    # External Integrations (Apify & AI Providers)
    APIFY_API_TOKEN: str = os.getenv("APIFY_API_TOKEN", "")
    APIFY_ACTOR_ID: str = os.getenv("APIFY_ACTOR_ID", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    # Upload Directory
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
