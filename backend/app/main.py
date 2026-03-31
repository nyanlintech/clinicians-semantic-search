import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.main import api_router
from app.core.config import settings

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    warmup_task: asyncio.Task[None] | None = None

    if settings.PRELOAD_SEARCH_MODEL:
        from app.api.routes.therapists import search_service

        async def warm_search_model() -> None:
            try:
                await asyncio.to_thread(search_service.warm_up)
                logger.info("Search model warmup completed")
            except Exception:
                logger.exception("Search model warmup failed")

        warmup_task = asyncio.create_task(warm_search_model())

    yield

    if warmup_task is not None and not warmup_task.done():
        warmup_task.cancel()


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
