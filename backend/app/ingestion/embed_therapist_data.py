from app.services.processor import TherapistProcessor
from app.services.embedding import EmbeddingService
from app.db import SessionLocal
from app.models import Therapist
from app.api.routes.therapist import TherapistResponse, Approach, Speciality
from pydantic import BaseModel
import json

class TherapistInput(BaseModel):
    name: str
    full_name: str | None = None
    pronouns: str | None = None
    title: str | None = None
    credentials: str | None = None
    status: str | None = None
    intro: str | None = None
    ideal_client: str | None = None
    approaches: list[Approach] | None = None
    rate_min: str | None = None
    rate_max: str | None = None
    free_consultation: bool | None = None
    practicing_since: str | None = None
    languages: str | None = None
    services: list[str] | None = None
    insurance: list[str] | None = None
    specialities: list[Speciality] | None = None
    other_techniques: list[str] | None = None
    other_issues: list[str] | None = None
    url: str | None = None
    image: str | None = None
    telehealth: bool | None = None
    in_person: bool | None = None

def embed_and_store_therapists(filepath: str):
    with open(filepath, "r") as f:
        scraped_profiles = json.load(f)

    session = SessionLocal()
    processor = TherapistProcessor()
    embedding_service = EmbeddingService()
    
    try:
        # Log first few profiles for inspection
        print("\n=== Sample Raw Data ===")
        for i, profile in enumerate(scraped_profiles[:2]):  # Show first 2 profiles
            print(f"\nProfile {i + 1}:")
            print(f"Name: {profile.get('name', 'N/A')}")
            print(f"Title: {profile.get('title', 'N/A')}")
            print(f"Approaches: {profile.get('approaches', [])}")
            print(f"Specialities: {profile.get('specialities', [])}")
            
            # Process the data using our standard processor
            processed_data = processor.process_therapist_data(profile)
            
            print("\nProcessed Data:")
            print(f"Approaches: {processed_data.get('approaches', [])}")
            print(f"Specialities: {processed_data.get('specialities', [])}")
            print("=" * 50)
            
            # Validate and structure the data using Pydantic model
            therapist_input = TherapistInput(**processed_data)
            
            # Generate embedding
            embedding = embedding_service.generate_therapist_embedding(processed_data)
            
            # Check for existing therapist
            existing = session.query(Therapist).filter_by(name=therapist_input.name).first()
            if existing:
                # Update existing therapist
                for key, value in therapist_input.model_dump().items():
                    setattr(existing, key, value)
                existing.embedding = embedding
            else:
                # Create new therapist
                new_therapist = Therapist(
                    **therapist_input.model_dump(),
                    embedding=embedding
                )
                session.add(new_therapist)

        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error during embedding and storing therapists: {e}")
    finally:
        session.close()
