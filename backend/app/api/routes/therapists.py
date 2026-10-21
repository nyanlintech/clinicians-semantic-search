import asyncio
import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.therapist import Therapist
from app.services.search import SearchService

logger = logging.getLogger(__name__)

router = APIRouter()
search_service = SearchService()


class SearchQuery(BaseModel):
    query: str | None = None  # For backward compatibility
    criteria: list[str] | None = None  # New multi-criteria support
    min_similarity: float = 0.2
    insurance: list[str] | None = None
    titles: list[str] | None = None


class Approach(BaseModel):
    label: str
    text: str


class Speciality(BaseModel):
    name: str
    description: str


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
    approaches: list[Approach] | None
    rate_min: str | None
    rate_max: str | None
    free_consultation: bool | None
    practicing_since: str | None
    services: list[str] | None
    insurance: list[str] | None
    specialities: list[Speciality] | None
    other_techniques: list[str] | None
    other_issues: list[str] | None
    url: str | None
    image: str | None = None
    telehealth: bool | None = None
    in_person: bool | None = None

    class Config:
        from_attributes = True


@router.get("/filters")
async def get_filters(db: Session = Depends(get_db)):
    """Get all available insurance providers and titles for filtering."""
    # Get unique insurance providers
    insurance = db.query(Therapist.insurance).distinct().all()
    insurance_list = {item for (sublist,) in insurance if sublist for item in sublist}

    # Get unique titles
    titles = db.query(Therapist.title).distinct().all()
    titles_list = {title for (title,) in titles if title}

    return {"insurance": sorted(insurance_list), "titles": sorted(titles_list)}


MAX_POOL = 200


@router.post("/search", response_model=list[TherapistResponse])
async def search_therapists(search_query: SearchQuery, db: Session = Depends(get_db)):
    """
    Search for therapists using semantic similarity with optional filtering.
    Supports both single query and multiple criteria formats.
    """
    try:
        logger.info("Received search query: %s", search_query)

        insurance = search_query.insurance if search_query.insurance else None
        titles = search_query.titles if search_query.titles else None

        if search_query.criteria:
            query = " AND ".join(search_query.criteria)
        elif search_query.query:
            query = search_query.query
        else:
            raise HTTPException(
                status_code=400, detail="Either 'query' or 'criteria' must be provided"
            )

        results = await asyncio.to_thread(
            search_service.search_therapists,
            db,
            query,
            insurance,
            titles,
            MAX_POOL,
            search_query.min_similarity,
        )

        logger.info("Search returned %d results", len(results))
        return results
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in search_therapists")
        raise HTTPException(status_code=500, detail=str(e))
