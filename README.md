# ParkSmart - Intelligent Parking System

Full-stack parking management system with CI/CD pipeline.

## Tech Stack
- Frontend: React.js → Vercel
- Backend: Flask + SQLite → Render (Docker)
- CI/CD: Jenkins + SonarCloud + Trivy + Docker Hub

## Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Pipeline Stages
1. Clean Workspace
2. Clone Repository
3. Git Version Check
4. Frontend Dependencies
5. Backend Dependencies
6. SonarCloud Analysis
7. Trivy Security Scan
8. Build Docker Image
9. Docker Login
10. Push Docker Image
11. Deploy Frontend to Vercel
12. Deploy Backend to Render


