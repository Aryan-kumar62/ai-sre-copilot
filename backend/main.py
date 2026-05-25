from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, auth, ai_engine
from database import engine, get_db
from fastapi.security import OAuth2PasswordRequestForm
from ai_engine import ai_engine as engine_ai

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI SRE Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        name=user.name,
        password_hash=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/api/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/")
def read_root():
    return {"message": "Welcome to AI SRE Copilot API"}

@app.post("/api/ai/analyze")
async def analyze_logs(logs_data: dict, db: Session = Depends(get_db)):
    logs = logs_data.get("logs", "")
    analysis = await engine_ai.analyze_incident(logs)
    return analysis

@app.get("/api/incidents", response_model=List[schemas.Incident])
def get_incidents(db: Session = Depends(get_db)):
    return db.query(models.Incident).all()

@app.post("/api/incidents", response_model=schemas.Incident)
def create_incident(incident: schemas.IncidentCreate, db: Session = Depends(get_db)):
    db_incident = models.Incident(**incident.model_dump())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

@app.get("/api/services", response_model=List[schemas.Service])
def get_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()

@app.get("/api/alerts", response_model=List[schemas.Alert])
def get_alerts():

    return [
        {
            "title": "Redis Cache Failure",
            "severity": "Critical",
            "time": "2 mins ago"
        },
        {
            "title": "High CPU Usage",
            "severity": "High",
            "time": "5 mins ago"
        },
        {
            "title": "Database Latency Spike",
            "severity": "Medium",
            "time": "10 mins ago"
        }
    ]

@app.get("/api/logs", response_model=List[schemas.Log])
def get_logs(db: Session = Depends(get_db)):
    return db.query(models.Log).all()
