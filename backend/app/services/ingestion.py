from typing import List, Dict
from sqlalchemy.orm import Session
from app.models.therapist import Therapist
from app.services.processor import TherapistProcessor
from app.services.embedding import EmbeddingService

class IngestionService:
    def __init__(self, db: Session):
        self.db = db
        self.processor = TherapistProcessor()
        self.embedding_service = EmbeddingService()
    
    def ingest_therapist(self, raw_data: Dict) -> Therapist:
        """Process and ingest a single therapist."""
        # Process the data
        processed_data = self.processor.process_therapist_data(raw_data)
        
        # Generate embedding
        embedding = self.embedding_service.generate_therapist_embedding(processed_data)
        
        # Remove summary fields that aren't in the model
        processed_data.pop('approach_summary', None)
        processed_data.pop('specialties_summary', None)
        
        # Create therapist record
        therapist = Therapist(
            **processed_data,
            embedding=embedding
        )
        
        # Save to database
        self.db.add(therapist)
        self.db.commit()
        self.db.refresh(therapist)
        
        return therapist
    
    def ingest_therapists_batch(self, raw_data_list: List[Dict]) -> List[Therapist]:
        """Process and ingest multiple therapists."""
        therapists = []
        for raw_data in raw_data_list:
            therapist = self.ingest_therapist(raw_data)
            therapists.append(therapist)
        return therapists 