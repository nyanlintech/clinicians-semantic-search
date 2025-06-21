import json
from pathlib import Path
from app.db.session import SessionLocal
from app.services.ingestion import IngestionService
from app.db.init_db import init_db
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_therapists(json_file: str):
    """Load therapists from JSON file and store in database with embeddings."""
    # Initialize database tables
    init_db()
    logger.info("Database tables initialized")
    
    # Initialize services
    db = SessionLocal()
    ingestion_service = IngestionService(db)
    
    try:
        # Read JSON file
        with open(json_file, 'r') as f:
            therapists_data = json.load(f)
        
        logger.info(f"Found {len(therapists_data)} therapists in {json_file}")
        
        # Process and store therapists
        processed_therapists = ingestion_service.ingest_therapists_batch(therapists_data)
        
        logger.info(f"Successfully processed and stored {len(processed_therapists)} therapists")
        
    except Exception as e:
        logger.error(f"Error loading therapists: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    # Get the backend directory (2 levels up from this script)
    backend_dir = Path(__file__).parent.parent.parent
    # Path to providers.json in the data directory
    json_file = backend_dir / "data" / "providers.json"
    load_therapists(str(json_file)) 