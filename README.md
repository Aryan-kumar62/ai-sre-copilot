# 🚀 AI SRE Copilot

An AI-powered Incident Root Cause Analyzer for SRE and DevOps teams. This platform monitors logs, incidents, API failures, and system metrics in real-time, using AI to identify probable root causes and suggest fixes.

## ✨ Features

- **Dashboard**: Real-time overview of system health, active incidents, and error trends.
- **AI Root Cause Analysis**: Automated log analysis to identify why things broke.
- **Incident Management**: Severity-based incident tracking and resolution workflow.
- **Log Explorer**: Centralized log search and anomaly detection.
- **Service Inventory**: Microservice health monitoring and dependency mapping.
- **Analytics**: Historical reliability metrics like MTTR and MTTD.
- **Authentication**: JWT-based secure login and signup.

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, ShadCN UI, Recharts, Framer Motion.
- **Backend**: FastAPI, Python, SQLAlchemy, PostgreSQL.
- **AI**: OpenAI GPT-4o, LangChain.
- **DevOps**: Docker, Docker Compose.

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- OpenAI API Key (optional for analysis, mock data provided)

### Installation

1. Clone the repository.
2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Start the application:
   ```bash
   docker-compose up --build
   ```
4. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Local Development (without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📊 Mock Data

To seed the database with mock DevOps data, run:
```bash
cd backend
python seed_data.py
```

## 📄 License

MIT
