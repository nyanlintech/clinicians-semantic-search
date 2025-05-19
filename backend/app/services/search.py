from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.therapist import Therapist
import numpy as np

class SearchService:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def generate_embedding(self, text: str) -> list:
        """Generate embedding for a given text using the transformer model."""
        embedding = self.model.encode(text)
        return embedding.tolist()  # Convert numpy array to list

    def search_therapists(self, db: Session, query: str, limit: int = 10) -> list[Therapist]:
        """Search for therapists using semantic similarity."""
        # Generate embedding for the search query
        query_embedding = self.generate_embedding(query)

        # Perform vector similarity search using cosine distance
        results = db.query(Therapist).order_by(
            text("embedding::vector <=> cast(:query_embedding as vector)")
        ).params(query_embedding=query_embedding).limit(limit).all()

        return results

    def update_therapist_embedding(self, db: Session, therapist: Therapist) -> None:
        """Update the embedding for a therapist's profile."""
        # Combine relevant fields for embedding
        profile_text = f"{therapist.intro} {therapist.ideal_client} {therapist.approach_summary} {therapist.specialties_summary} {' '.join(therapist.services or [])} {' '.join(therapist.other_techniques or [])}"
        
        # Generate and update embedding
        embedding = self.generate_embedding(profile_text)
        therapist.embedding = embedding  # Already a list from generate_embedding
        db.commit()
