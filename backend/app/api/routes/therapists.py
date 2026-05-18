import asyncio
import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.services.search import SearchService
from app.models.therapist import Therapist
from pydantic import BaseModel, RootModel

logger = logging.getLogger(__name__)

router = APIRouter()
search_service = SearchService()


class SearchQuery(BaseModel):
    query: Optional[str] = None  # For backward compatibility
    criteria: Optional[List[str]] = None  # New multi-criteria support
    page: int = 1
    page_size: int = 20
    min_similarity: float = 0.2
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


class PaginatedResponse(BaseModel):
    items: List[TherapistResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


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


MAX_POOL = 200  # max candidates fetched before pagination


@router.post("/search", response_model=PaginatedResponse)
async def search_therapists(
    search_query: SearchQuery,
    db: Session = Depends(get_db)
):
    """
    Search for therapists using semantic similarity with optional filtering.
    Supports both single query and multiple criteria formats.
    Returns paginated results.
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
            raise HTTPException(status_code=400, detail="Either 'query' or 'criteria' must be provided")

        all_results = await asyncio.to_thread(
            search_service.search_therapists,
            db,
            query,
            insurance,
            titles,
            MAX_POOL,
            search_query.min_similarity,
        )

        total = len(all_results)
        page = max(1, search_query.page)
        page_size = max(1, search_query.page_size)
        start = (page - 1) * page_size
        end = start + page_size
        items = all_results[start:end]

        logger.info("Search: %d total results, returning page %d (%d items)", total, page, len(items))
        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            has_more=end < total,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in search_therapists")
        raise HTTPException(status_code=500, detail=str(e))
