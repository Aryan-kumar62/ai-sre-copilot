from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

class SeverityLevel(str, enum.Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    severity = Column(String)  # Critical, High, Medium, Low
    logs = Column(Text)
    root_cause = Column(Text)
    impact = Column(Text)
    solution = Column(Text)
    recommended_actions = Column(JSON)
    status = Column(String)  # Open, Investigating, Resolved
    service_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    priority = Column(String)  # P0, P1, P2
    service_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Log(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String)
    log_level = Column(String)  # INFO, ERROR, WARNING
    message = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    status = Column(String)  # Healthy, Degraded, Down
    uptime = Column(Float)
    latency = Column(Float)
    error_rate = Column(Float)
    last_checked = Column(DateTime(timezone=True), server_default=func.now())
