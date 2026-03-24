from fastapi import APIRouter

from app.api.routes import therapists

api_router = APIRouter()
api_router.include_router(therapists.router)
