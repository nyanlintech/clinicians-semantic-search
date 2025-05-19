from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from app.db.session import SessionLocal
from app.services.search import SearchService
from app.models.therapist import Therapist
from pydantic import BaseModel, RootModel

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

class Approach(RootModel):
    root: str

class Speciality(RootModel):
    root: str

class TherapistResponse(BaseModel):
    id: int
    name: str
    full_name: str | None
    pronouns: str | None
    title: str | None
    credentials: str | None
    status: str | None
    intro: str | None
    ideal_client: str | None
    approaches: List[Approach] | None
    rate_min: str | None
    rate_max: str | None
    free_consultation: bool | None
    practicing_since: str | None
    languages: str | None
    services: List[str] | None
    insurance: List[str] | None
    specialities: List[Speciality] | None
    other_techniques: List[str] | None
    other_issues: List[str] | None
    url: str | None

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