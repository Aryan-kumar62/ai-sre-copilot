import os
from pydantic import BaseModel, Field
import google.generativeai as genai
from dotenv import load_dotenv
from typing import List

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-1.5-flash")


class RootCauseAnalysis(BaseModel):
    severity: str = Field(
        description="Suggested severity level: Critical, High, Medium, Low"
    )

    root_cause: str = Field(
        description="The probable root cause of the incident"
    )

    impact: str = Field(
        description="The potential business and system impact of the incident"
    )

    solution: str = Field(
        description="Recommended solution to fix the incident"
    )

    recommended_actions: List[str] = Field(
        description="List of concrete steps to take"
    )


class AIEngine:
    def __init__(self):
        self.llm = model

    async def analyze_incident(self, logs: str):

        logs_lower = logs.lower()

        # REDIS
        if "redis" in logs_lower:
            return {
                "severity": "Critical",
                "root_cause": "Redis cache memory exhausted causing eviction storm.",
                "impact": "Application latency increased and cache misses occurred.",
                "solution": "Restart Redis and increase memory allocation.",
                "recommended_actions": [
                    "Scale Redis cluster",
                    "Clear unused cache keys",
                    "Enable Redis monitoring"
                ]
            }

        # CPU
        if "cpu" in logs_lower:
            return {
                "severity": "High",
                "root_cause": "CPU usage exceeded safe threshold.",
                "impact": "Slow response times detected.",
                "solution": "Scale compute resources.",
                "recommended_actions": [
                    "Restart overloaded service",
                    "Check infinite loops",
                    "Enable autoscaling"
                ]
            }

        # DATABASE
        if "database" in logs_lower:
            return {
                "severity": "Critical",
                "root_cause": "Database connection failures detected.",
                "impact": "Application requests failing.",
                "solution": "Restart DB services and check connection pool.",
                "recommended_actions": [
                    "Check DB CPU usage",
                    "Restart database",
                    "Inspect query performance"
                ]
            }

        # DEFAULT
        return {
            "severity": "Medium",
            "root_cause": "Unknown issue detected.",
            "impact": "Potential service degradation.",
            "solution": "Investigate logs manually.",
            "recommended_actions": [
                "Check monitoring dashboards",
                "Review recent deployments"
            ]
        }


ai_engine = AIEngine()