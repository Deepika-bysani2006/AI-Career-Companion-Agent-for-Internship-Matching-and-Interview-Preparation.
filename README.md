# AI Career Companion Agent for Internship Matching and Interview Preparation 🚀
> **Connecting Skills to Opportunities**

![SkillBridge Banner](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200)

[![GitHub Repository](https://img.shields.io/badge/GitHub-AI--Career--Companion--Agent--for--Internship--Matching--and--Interview--Preparation-blue?logo=github)](https://github.com/Deepika-bysani2006/AI-Career-Companion-Agent-for-Internship-Matching-and-Interview-Preparation.git)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind-61DAFB?logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-336791?logo=postgresql)](https://postgres.org)
[![Gemini AI](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%202.5%20Flash-4285F4?logo=google)](https://aistudio.google.com)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?logo=docker)](https://docker.com)

---

## 📌 1. Project Overview

**AI Career Companion Agent for Internship Matching and Interview Preparation** (powered by the **SkillBridge** web platform) is an intelligent, end-to-end career guidance application designed for students and job seekers. The agent aggregates internships across major job boards (LinkedIn, Naukri, Unstop, Internshala), performs automated ATS resume parsing, computes candidate-to-job compatibility scores, delivers personalized skill gap analysis, generates custom cover letters, and provides AI-driven mock technical interview practice.

---

## 🌟 2. Key Features

- 🔍 **AI Internship Discovery & Aggregation**: Real-time matching across 1,000+ listings from LinkedIn, Naukri, Unstop, Internshala, and top tech companies (Google, Microsoft, IBM, Amazon).
- 📄 **ATS Resume Parser & Scoring**: Instant PDF/DOCX resume parsing using PyMuPDF and regex entity recognition with ATS score breakdown.
- 🎯 **Skill Gap Analysis & Roadmaps**: Compares candidate skill sets against target role requirements and generates step-by-step learning paths.
- 🤖 **Gemini 2.5 AI Assistant & RAG**: Contextual career mentorship powered by Google Gemini 2.5 Flash and local Ollama (`llama3.2:3b`), connected directly to PostgreSQL database job records.
- 🎙️ **Interactive AI Mock Interviews**: Technical, Behavioral, System Design, and HR interview simulation with real-time feedback scores.
- 🔐 **Secure Authentication**: Firebase Google Authentication, Email/Password registration, bcrypt hashing, and JWT authorization.
- 📱 **Progressive Web App (PWA)**: Desktop and mobile installable app with standalone display and offline service worker cache management.

---

## 🛠️ 3. Technology Stack

### Frontend:
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS & Lucide Icons
- **HTTP Client**: Axios with centralized base URL configuration
- **Authentication**: Firebase Web SDK v12 & JWT local state management

### Backend:
- **Framework**: FastAPI (Python 3.12)
- **Database ORM**: SQLAlchemy 2.0 & Alembic
- **Database Engine**: PostgreSQL 16 (Neon Cloud / Local Docker)
- **AI / NLP**: Google GenAI SDK (`google-genai`), PyMuPDF, Python-docx
- **Local AI**: Ollama HTTP API integration (`llama3.2:3b`)

---

## 🏗️ 4. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               React 18 + Vite Frontend (PWA)                │
│     (Vercel Production: frontend-eight-sigma-kit01hsku5)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST API (JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FastAPI Backend Service                     │
│    (Render Production: skillbridge-ai-internship-agent)     │
└──────────────┬───────────────┬───────────────┬──────────────┘
               │               │               │
               ▼               ▼               ▼
┌────────────────────┐ ┌───────────────┐ ┌────────────────────┐
│ PostgreSQL 16 DB   │ │ Google Gemini │ │ Firebase Auth      │
│ (18 Tables / RAG)  │ │ 2.5 Flash API │ │ OAuth 2.0 ID Token │
└────────────────────┘ └───────────────┘ └────────────────────┘
```

---

## ⚙️ 5. Environment Variables

### Backend Configuration (`backend/.env`):
```env
PORT=8000
FRONTEND_URL=https://frontend-eight-sigma-kit01hsku5.vercel.app
DATABASE_URL=postgresql://user:password@localhost:5432/skillbridge_db
JWT_SECRET=your_jwt_secret_key
SECRET_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
AI_PROVIDER=gemini
```

### Frontend Configuration (`frontend/.env`):
```env
VITE_API_URL=https://skillbridge-ai-internship-agent.onrender.com/api/v1
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=skillbridge-9d5a7.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=skillbridge-9d5a7
```

---

## 💻 6. Running Locally in VS Code

### Step 1: Start Backend FastAPI Server
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```
- **Backend API**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`

### Step 2: Start Frontend React App
```powershell
cd frontend
npm run dev
```
- **Local Application URL**: `http://localhost:5173`

---

## 🐳 7. Docker Compose Setup

Run all containers (PostgreSQL, FastAPI Backend, React Frontend, pgAdmin 4, Redis) with a single command:

```powershell
docker compose up -d
```

| Container | Service | Port | Notes |
| :--- | :--- | :--- | :--- |
| `skillbridge-frontend` | React 18 | `5173` | Web UI |
| `skillbridge-backend` | FastAPI | `8000` | API & OpenAPI Docs |
| `skillbridge-postgres` | PostgreSQL 16 | `5432` | 18 DB Tables |
| `skillbridge-pgadmin` | pgAdmin 4 | `5050` | DB Management Interface |

---

## 🌐 8. Production Deployments

- **Live Production Web Application**: **[https://frontend-eight-sigma-kit01hsku5.vercel.app](https://frontend-eight-sigma-kit01hsku5.vercel.app)**
- **Live Render Backend Service**: **[https://skillbridge-ai-internship-agent.onrender.com](https://skillbridge-ai-internship-agent.onrender.com)**
- **GitHub Repository**: **[AI-Career-Companion-Agent-for-Internship-Matching-and-Interview-Preparation](https://github.com/Deepika-bysani2006/AI-Career-Companion-Agent-for-Internship-Matching-and-Interview-Preparation.git)**

---

## 📜 9. License & Credits

© 2026 AI Career Companion Agent Project Team. Built with FastAPI, React, PostgreSQL, and Google Gemini.
