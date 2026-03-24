from typing import List, Dict
from sqlalchemy.orm import Session
from app.models import Therapist
from app.services.processor import TherapistProcessor
from app.services.embedding import EmbeddingService
import logging

logger = logging.getLogger(__name__)

class IngestionService:
    def __init__(self, db: Session):
        self.db = db
        self.processor = TherapistProcessor()
        self.embedding_service = EmbeddingService()
    
    def ingest_therapist(self, raw_data: Dict) -> Therapist:
        """Process and ingest a single therapist."""
        logger.info(f"\nProcessing therapist: {raw_data.get('name', 'Unknown')}")
        
        # Process the data
        processed_data = self.processor.process_therapist_data(raw_data)
        logger.info(f"Processed data for {processed_data['name']}")
        
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
        
        logger.info(f"Successfully ingested therapist: {therapist.name}")
        return therapist
    
    def ingest_therapists_batch(self, raw_data_list: List[Dict]) -> List[Therapist]:
        """Process and ingest multiple therapists."""
        therapists = []
        total = len(raw_data_list)
        logger.info(f"\nStarting batch ingestion of {total} therapists")
        
        for i, raw_data in enumerate(raw_data_list, 1):
            logger.info(f"\nProcessing therapist {i}/{total}")
            therapist = self.ingest_therapist(raw_data)
            therapists.append(therapist)
            
        logger.info(f"\nCompleted batch ingestion of {len(therapists)} therapists")
        return therapists 