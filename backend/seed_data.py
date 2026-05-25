from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, auth
from datetime import datetime, timedelta
import random

def seed_data():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(models.User).first():
        print("Data already exists, skipping seeding.")
        db.close()
        return

    # Create Mock User
    user = models.User(
        name="Admin User",
        email="admin@example.com",
        password_hash=auth.get_password_hash("admin123")
    )
    db.add(user)

    # Create Mock Services
    services_list = [
        {"name": "Payment API", "status": "Healthy", "uptime": 99.9, "latency": 120, "error_rate": 0.01},
        {"name": "Auth Service", "status": "Degraded", "uptime": 98.5, "latency": 450, "error_rate": 2.5},
        {"name": "Inventory DB", "status": "Healthy", "uptime": 99.99, "latency": 15, "error_rate": 0.0},
        {"name": "Redis Cache", "status": "Down", "uptime": 95.0, "latency": 0, "error_rate": 100},
        {"name": "Frontend Web", "status": "Healthy", "uptime": 99.8, "latency": 200, "error_rate": 0.1},
    ]
    
    for s in services_list:
        service = models.Service(**s)
        db.add(service)

    # Create Mock Incidents
    incidents_list = [
        {
            "title": "Redis Connection Timeout",
            "severity": "Critical",
            "status": "Open",
            "service_name": "Redis Cache",
            "logs": "[ERROR] Connection timeout to Redis at 10.0.0.5:6379\n[WARNING] Cache miss rate increased to 100%",
            "root_cause": "Network partition in the cache subnet.",
            "impact": "Caching layer failure, leading to database overload and API latency.",
            "solution": "Check VPC peering and security group rules for the Redis cluster.",
            "recommended_actions": ["Verify network connections", "Scale up Redis", "Enable fallback"]
        },
        {
            "title": "Payment API Latency Spike",
            "severity": "High",
            "status": "Investigating",
            "service_name": "Payment API",
            "logs": "[INFO] Request processed in 5200ms\n[ERROR] Database connection pool exhausted",
            "root_cause": "Increased traffic caused DB connection leak in the payment service.",
            "impact": "Transaction processing delayed, user checkouts failing.",
            "solution": "Increase DB connection pool size and optimize query execution.",
            "recommended_actions": ["Increase max_connections", "Profile DB queries", "Add circuit breaker"]
        },
        {
            "title": "Auth Service 500 Errors",
            "severity": "High",
            "status": "Resolved",
            "service_name": "Auth Service",
            "logs": "[ERROR] NullPointerException at AuthService.java:45\n[ERROR] Failed to validate JWT token",
            "root_cause": "Expired certificate in the auth validation logic.",
            "impact": "Users unable to login or access authenticated routes.",
            "solution": "Rotate the signing keys and update the public key cache.",
            "recommended_actions": ["Rotate SSL certs", "Clear key cache", "Restart Auth pods"]
        }
    ]

    for i in incidents_list:
        incident = models.Incident(**i)
        db.add(incident)

    # Create Mock Alerts
    for i in range(10):
        alert = models.Alert(
            message=f"High CPU usage on {random.choice(['Worker-1', 'Worker-2', 'DB-Primary'])}",
            priority=random.choice(["P0", "P1", "P2"]),
            service_name=random.choice(["Payment API", "Auth Service", "Inventory DB"])
        )
        db.add(alert)

    # Create Mock Logs
    log_levels = ["INFO", "ERROR", "WARNING", "DEBUG"]
    services = ["Payment API", "Auth Service", "Inventory DB", "Redis Cache", "Frontend Web"]
    
    for i in range(100):
        log = models.Log(
            service_name=random.choice(services),
            log_level=random.choice(log_levels),
            message=f"Sample log message {i}: {random.choice(['Request received', 'Processing failed', 'Connection established', 'Timeout detected'])}",
            timestamp=datetime.utcnow() - timedelta(minutes=random.randint(0, 1440))
        )
        db.add(log)

    db.commit()
    db.close()
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed_data()
