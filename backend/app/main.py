import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# --- 1. Database Setup ---
DATABASE_URL = "sqlite:///./safetap.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- 2. Database Table Model ---
class AnalysisDB(Base):
    __tablename__ = "analyses"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    privacy_score = Column(Integer)
    summary = Column(String)
    risk_clauses = Column(JSON)

Base.metadata.create_all(bind=engine)

# --- 3. Pydantic Data Schemas ---
class URLPayload(BaseModel):
    url: HttpUrl

class AnalysisResult(BaseModel):
    privacy_score: int
    summary: str
    risk_clauses: list

class Analysis(AnalysisResult):
    id: int
    url: str
    class Config:
        from_attributes = True

# --- 4. Scraper Logic ---
def scrape_privacy_policy(url: str):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        privacy_link = soup.find('a', string=lambda text: text and 'privacy' in text.lower())
        if not privacy_link or not privacy_link.has_attr('href'):
            return "Could not find a privacy policy link on the page."
        policy_url = urljoin(url, privacy_link['href'])
        policy_response = requests.get(policy_url, headers=headers, timeout=10)
        policy_response.raise_for_status()
        policy_soup = BeautifulSoup(policy_response.text, 'html.parser')
        policy_text = policy_soup.get_text(separator=' ', strip=True)
        return policy_text if policy_text else "Found the privacy policy page, but it was empty."
    except requests.RequestException as e:
        return f"An error occurred while trying to fetch the URL: {str(e)}"

# --- 5. NLP Service Logic ---
def get_analysis_from_nlp_service(text: str):
    endpoint = "http://127.0.0.1:8000/process_policy"
    try:
        response = requests.post(endpoint, json={"policy_text": text}, timeout=60)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"privacy_score": 0, "summary": f"Could not connect to NLP service: {str(e)}", "risk_clauses": []}

# --- 6. FastAPI App and Endpoints ---
app = FastAPI(title="SafeTap Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-url", response_model=AnalysisResult)
def analyze_url_endpoint(payload: URLPayload):
    db = SessionLocal()
    try:
        scraped_text = scrape_privacy_policy(str(payload.url))
        if "Could not find" in scraped_text or "An error occurred" in scraped_text:
            raise HTTPException(status_code=404, detail=scraped_text)
        
        analysis_data = get_analysis_from_nlp_service(scraped_text)
        
        db_analysis = AnalysisDB(
            url=str(payload.url),
            privacy_score=analysis_data.get("privacy_score"),
            summary=analysis_data.get("summary"),
            risk_clauses=analysis_data.get("risk_clauses")
        )
        db.add(db_analysis)
        db.commit()
        
        return analysis_data
    finally:
        db.close()

@app.get("/analyses", response_model=List[Analysis])
def read_analyses_endpoint(skip: int = 0, limit: int = 100):
    db = SessionLocal()
    try:
        analyses = db.query(AnalysisDB).offset(skip).limit(limit).all()
        return analyses
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "SafeTap Backend is running!"}