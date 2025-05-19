from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.therapist import Therapist
from app.services.processor import TherapistProcessor
import numpy as np

class SearchService:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.processor = TherapistProcessor()

    def generate_embedding(self, text: str) -> list:
        """Generate embedding for a given text using the transformer model."""
        embedding = self.model.encode(text)
        return embedding.tolist()  # Convert numpy array to list

    def transform_therapist_data(self, therapist: Therapist) -> dict:
        """Transform therapist data to match the API response format."""
        data = {
            'id': therapist.id,
            'name': therapist.name,
            'full_name': therapist.full_name,
            'pronouns': therapist.pronouns,
            'title': therapist.title,
            'credentials': therapist.credentials,
            'status': therapist.status,
            'intro': therapist.intro,
            'ideal_client': therapist.ideal_client,
            'rate_min': therapist.rate_min,
            'rate_max': therapist.rate_max,
            'free_consultation': therapist.free_consultation,
            'practicing_since': therapist.practicing_since,
            'languages': therapist.languages,
            'services': therapist.services,
            'insurance': therapist.insurance,
            'other_techniques': therapist.other_techniques,
            'other_issues': therapist.other_issues,
            'url': therapist.url
        }

        # Transform approaches
        if therapist.approaches:
            data['approaches'] = therapist.approaches
        else:
            data['approaches'] = None

        # Transform specialities
        if therapist.specialities:
            data['specialities'] = therapist.specialities
        else:
            data['specialities'] = None

        return data

    def search_therapists(self, db: Session, query: str, limit: int = 10) -> list[dict]:
        """Search for therapists using semantic similarity."""
        # Generate embedding for the search query
        query_embedding = self.generate_embedding(query)

        # Perform vector similarity search using cosine distance
        results = db.query(Therapist).order_by(
            text("embedding::vector <=> cast(:query_embedding as vector)")
        ).params(query_embedding=query_embedding).limit(limit).all()

        # Transform the results to match the API response format
        return [self.transform_therapist_data(therapist) for therapist in results]

    def update_therapist_embedding(self, db: Session, therapist: Therapist) -> None:
        """Update the embedding for a therapist's profile."""
        # Combine relevant fields for embedding
        profile_text = f"{therapist.intro} {therapist.ideal_client} {therapist.approach_summary} {therapist.specialties_summary} {' '.join(therapist.services or [])} {' '.join(therapist.other_techniques or [])}"
        
        # Generate and update embedding
        embedding = self.generate_embedding(profile_text)
        therapist.embedding = embedding  # Already a list from generate_embedding
        db.commit()
