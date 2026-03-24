import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.deps import get_db
from app.services.search import SearchService
from app.models import Therapist
from pydantic import BaseModel, RootModel

logger = logging.getLogger(__name__)

router = APIRouter()
search_service = SearchService()


class SearchQuery(BaseModel):
    query: Optional[str] = None  # For backward compatibility
    criteria: Optional[List[str]] = None  # New multi-criteria support
    limit: int = 500  # Reduced default limit
    min_similarity: float = 0.2  # Add similarity threshold
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
        logger.info("Received search query: %s", search_query)

        # Convert empty lists to None to avoid filtering with empty lists
        insurance = search_query.insurance if search_query.insurance else None
        titles = search_query.titles if search_query.titles else None

        logger.debug("Processed filters - Insurance: %s, Titles: %s", insurance, titles)

        # Determine the query format and convert to single query string
        if search_query.criteria:
            query = " AND ".join(search_query.criteria)
            logger.debug("Using criteria format: %s", search_query.criteria)
        elif search_query.query:
            query = search_query.query
            logger.debug("Using single query format: %s", query)
        else:
            raise HTTPException(status_code=400, detail="Either 'query' or 'criteria' must be provided")

        results = search_service.search_therapists(
            db=db,
            query=query,
            insurance=insurance,
            titles=titles,
            limit=search_query.limit,
            min_similarity=search_query.min_similarity
        )
        logger.info("Search returned %d results (limit: %d, min_similarity: %.2f)",
                    len(results), search_query.limit, search_query.min_similarity)
        return results
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in search_therapists")
        raise HTTPException(status_code=500, detail=str(e))
