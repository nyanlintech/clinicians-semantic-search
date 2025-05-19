from fastapi import APIRouter

from app.api.routes import search, therapist
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(search.router)
api_router.include_router(therapist.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
