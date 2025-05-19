from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from app.db.session import SessionLocal
from app.services.search import SearchService
from app.models.therapist import Therapist
from pydantic import BaseModel

router = APIRouter()
search_service = SearchService()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class SearchQuery(BaseModel):
    query: str
    limit: int = 10

class Speciality(BaseModel):
    name: str
    description: str

class TherapistResponse(BaseModel):
    id: int
    name: str
    full_name: str
    pronouns: str
    title: str
    credentials: str
    status: str
    intro: str
    ideal_client: str
    approach_summary: str
    rate_min: str
    rate_max: str
    free_consultation: bool
    practicing_since: str
    languages: str
    services: List[str]
    insurance: List[str]
    specialities: List[Speciality]
    other_techniques: List[str]
    other_issues: List[str]
    url: str

    class Config:
        from_attributes = True

@router.post("/search", response_model=List[TherapistResponse])
async def search_therapists(
    search_query: SearchQuery,
    db: Session = Depends(get_db)
):
    """
    Search for therapists using semantic similarity.
    """
    try:
        results = search_service.search_therapists(
            db=db,
            query=search_query.query,
            limit=search_query.limit
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 