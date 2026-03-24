from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.main import api_router
from app.core.config import settings
from app.core.db import SessionLocal
from app.services.scheduler import SchedulerService


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    scheduler = SchedulerService(db)
    scheduler.start()

    yield

    scheduler.stop()
    db.close()


app = FastAPI(
    title="Therapist Semantic Search API",
    description="API for semantic search of therapist profiles using embeddings",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR, tags=["therapists"])


@app.get("/")
async def root():
    return {"message": "Welcome to Therapist Semantic Search API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
