# SkillBridge – AI Internship Application Agent 🚀
> **Connecting Skills to Opportunities**

![SkillBridge Banner](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200)

[![GitHub Repository](https://img.shields.io/badge/GitHub-SkillBridge--AI--Internship--Agent-blue?logo=github)](https://github.com/Deepika-bysani2006/SkillBridge-AI-Internship-Agent.git)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind-61DAFB?logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-336791?logo=postgresql)](https://postgres.org)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?logo=docker)](https://docker.com)

---

## ⚡ SYSTEM VERIFICATION COMMANDS & TESTING GUIDE

### 1️⃣ Check Docker Container Status
Run from your project root folder:
```powershell
docker compose ps
```
> **Expected Output**: Confirms `skillbridge-postgres`, `skillbridge-backend`, `skillbridge-frontend`, `skillbridge-pgadmin`, and `skillbridge-redis` are all running and healthy.

To view live container logs:
```powershell
docker compose logs -f
```

---

### 2️⃣ Verify PostgreSQL Database & 1,000+ Mock Jobs
Run to list all **18 database tables** inside the Docker PostgreSQL container:
```powershell
docker exec skillbridge-postgres psql -U skillbridge -d skillbridge_db -c "\dt"
```

Run to verify the **1,000+ realistic mock internship records**:
```powershell
docker exec skillbridge-postgres psql -U skillbridge -d skillbridge_db -c "SELECT COUNT(*) FROM jobs;"
```

---

### 3️⃣ Test Backend API (FastAPI)

- **Docker Backend Endpoint**:
  Navigate to **[http://localhost:8000/docs](http://localhost:8000/docs)** for interactive OpenAPI / Swagger documentation.

- **Run Backend Locally in VS Code**:
  ```powershell
  cd backend
  .\venv\Scripts\Activate.ps1
  uvicorn app.main:app --reload --port 8000
  ```
  *(Automatically connects to `localhost:5432` Docker PostgreSQL container)*

- **Terminal Health / API Test**:
  ```powershell
  curl http://localhost:8000/api/v1/jobs?limit=5
  ```

---

### 4️⃣ Test Frontend Web Application (React + Vite)

- **Docker Frontend**:
  Open **[http://localhost:5173](http://localhost:5173)** in your browser.

- **Run Frontend Locally in VS Code**:
  ```powershell
  cd frontend
  npm run dev
  ```

---

### 5️⃣ Access pgAdmin 4

#### 🌐 Docker pgAdmin 4 (Browser Web Interface)
- **URL**: [http://localhost:5050](http://localhost:5050)
- **Email**: `admin@skillbridge.com`
- **Password**: `SkillBridge@2026`
- **Pre-registered Server**: `SkillBridge DB` (Automatically connected)

#### 🖥️ Desktop pgAdmin 4 (Installed on Windows Desktop)
Add a **New Server** with the following credentials:
- **Host name / address**: `localhost` (or `127.0.0.1`)
- **Port**: `5432`
- **Maintenance database**: `skillbridge_db`
- **Username**: `skillbridge`
- **Password**: *(Check local `.env` file)*

---

### 6️⃣ Verify Environment Variables & Configuration
Run from the `backend/` directory:
```powershell
cd backend
.\venv\Scripts\python.exe -c "from app.core.config import settings; print('Active Database Host:', settings.POSTGRES_HOST); print('Active API Version:', settings.API_V1_STR)"
```

---

## 🐳 DOCKER QUICK START (1-Command Run)

```powershell
# Build containers
docker compose build

# Start all services
docker compose up -d
```

---

## 🌐 Application URLs Summary

| Service | Technology | URL / Port | Credentials / Notes |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | React 18 + Vite | [http://localhost:5173](http://localhost:5173) | Light Mode Default |
| **Backend API** | FastAPI + Python 3.12 | [http://localhost:8000](http://localhost:8000) | Swagger Docs at `/docs` |
| **pgAdmin 4 Web** | PostgreSQL Admin | [http://localhost:5050](http://localhost:5050) | `admin@skillbridge.com` / `SkillBridge@2026` |
| **PostgreSQL 16** | Database Engine | `localhost:5432` | DB: `skillbridge_db`, User: `skillbridge` |
| **Redis 7** | Cache Engine | `localhost:6379` | Docker Network `skillbridge-network` |

---
© 2026 SkillBridge Project Team.
