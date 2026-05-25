from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class IncidentBase(BaseModel):
    title: str
    severity: str
    logs: Optional[str] = None
    root_cause: Optional[str] = None
    impact: Optional[str] = None
    solution: Optional[str] = None
    recommended_actions: Optional[List[str]] = None
    status: str
    service_name: str

class IncidentCreate(IncidentBase):
    pass

class Incident(IncidentBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    message: str
    priority: str
    service_name: str

class Alert(AlertBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class LogBase(BaseModel):
    service_name: str
    log_level: str
    message: str
    timestamp: datetime

class Log(LogBase):
    id: int
    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    name: str
    status: str
    uptime: float
    latency: float
    error_rate: float

class Service(ServiceBase):
    id: int
    last_checked: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
