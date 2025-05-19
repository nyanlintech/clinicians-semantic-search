from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from app.services.ingestion import IngestionService
from app.scraper.scraper import scraper
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class SchedulerService:
    def __init__(self, db: Session):
        self.db = db
        self.scheduler = BackgroundScheduler()
        self.ingestion_service = IngestionService(db)
        
    def start(self):
        """Start the scheduler with default jobs."""
        # Schedule scraping and processing to run daily at 2 AM
        self.scheduler.add_job(
            self.run_scraping_and_processing,
            CronTrigger(hour=2, minute=0),
            id='daily_scrape',
            name='Daily therapist scraping and processing'
        )
        
        self.scheduler.start()
        logger.info("Scheduler started with daily scraping job")
    
    def stop(self):
        """Stop the scheduler."""
        self.scheduler.shutdown()
        logger.info("Scheduler stopped")
    
    async def run_scraping_and_processing(self):
        """Run the complete scraping and processing pipeline."""
        try:
            # Scrape new data
            therapists_data = await scraper()
            
            # Process and store the data
            self.ingestion_service.ingest_therapists_batch(therapists_data)
            
            logger.info(f"Successfully processed {len(therapists_data)} therapists")
        except Exception as e:
            logger.error(f"Error in scraping and processing: {str(e)}")
    
    def process_json_file(self, file_path: str):
        """Process a JSON file containing therapist data."""
        try:
            # Read the JSON file
            with open(file_path, 'r') as f:
                therapists_data = json.load(f)
            
            # Process and store the data
            self.ingestion_service.ingest_therapists_batch(therapists_data)
            
            logger.info(f"Successfully processed {len(therapists_data)} therapists from {file_path}")
        except Exception as e:
            logger.error(f"Error processing JSON file: {str(e)}")
            raise 