import click
from app.db.session import SessionLocal
from app.services.scheduler import SchedulerService
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@click.group()
def cli():
    """CLI for therapist data processing."""
    pass

@cli.command()
@click.argument('file_path', type=click.Path(exists=True))
def process_file(file_path):
    """Process a JSON file containing therapist data."""
    try:
        db = SessionLocal()
        scheduler = SchedulerService(db)
        scheduler.process_json_file(file_path)
        logger.info(f"Successfully processed file: {file_path}")
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise
    finally:
        db.close()

@cli.command()
def start_scheduler():
    """Start the scheduler for automated processing."""
    try:
        db = SessionLocal()
        scheduler = SchedulerService(db)
        scheduler.start()
        logger.info("Scheduler started successfully")
    except Exception as e:
        logger.error(f"Error starting scheduler: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == '__main__':
    cli() 