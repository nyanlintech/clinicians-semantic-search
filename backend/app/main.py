from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import therapist
from app.db.session import SessionLocal
from app.services.scheduler import SchedulerService

app = FastAPI(
    title="Therapist Semantic Search API",
    description="API for semantic search of therapist profiles using embeddings",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(therapist.router, prefix="/api/v1", tags=["therapists"])

# Initialize scheduler
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    scheduler = SchedulerService(db)
    scheduler.start()

@app.on_event("shutdown")
async def shutdown_event():
    db = SessionLocal()
    scheduler = SchedulerService(db)
    scheduler.stop()
    db.close()

@app.get("/")
async def root():
    return {"message": "Welcome to Therapist Semantic Search API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}