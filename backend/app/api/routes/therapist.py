from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
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
    query: Optional[str] = None  # For backward compatibility
    criteria: Optional[List[str]] = None  # New multi-criteria support
    limit: int = 10
    insurance: Optional[List[str]] = None
    titles: Optional[List[str]] = None

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

@router.get("/filters")
async def get_filters(db: Session = Depends(get_db)):
    """Get all available insurance providers and titles for filtering."""
    # Get unique insurance providers
    insurance = db.query(Therapist.insurance).distinct().all()
    insurance_list = list(set([item for sublist in insurance if sublist[0] for sublist in insurance for item in sublist[0]]))

    # Get unique titles
    titles = db.query(Therapist.title).distinct().all()
    titles_list = list(set([title[0] for title in titles if title[0]]))

    return {
        "insurance": sorted(insurance_list),
        "titles": sorted(titles_list)
    }

@router.post("/search", response_model=List[TherapistResponse])
async def search_therapists(
    search_query: SearchQuery,
    db: Session = Depends(get_db)
):
    """
    Search for therapists using semantic similarity with optional filtering.
    Supports both single query and multiple criteria formats.
    """
    try:
        print(f"Received search query: {search_query}")
        
        # Convert empty lists to None to avoid filtering with empty lists
        insurance = search_query.insurance if search_query.insurance and len(search_query.insurance) > 0 else None
        titles = search_query.titles if search_query.titles and len(search_query.titles) > 0 else None
        
        print(f"Processed filters - Insurance: {insurance}, Titles: {titles}")

        # Determine the query format and convert to single query string
        if search_query.criteria and len(search_query.criteria) > 0:
            # Use new criteria format
            query = " AND ".join(search_query.criteria)
            print(f"Using criteria format: {search_query.criteria}")
        elif search_query.query:
            # Use backward-compatible single query format
            query = search_query.query
            print(f"Using single query format: {query}")
        else:
            raise HTTPException(status_code=400, detail="Either 'query' or 'criteria' must be provided")

        results = search_service.search_therapists(
            db=db,
            query=query,
            limit=search_query.limit,
            insurance=insurance,
            titles=titles
        )
        print(f"Search returned {len(results)} results")
        return results
    except Exception as e:
        print(f"Error in search_therapists: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 