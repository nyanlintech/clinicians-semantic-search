import html
import re
from app.db.session import SessionLocal
from app.models.therapist import Therapist
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clean_text(text: str) -> str:
    """Clean text to fix encoding issues."""
    if not text or not isinstance(text, str):
        return ""
    
    # Decode HTML entities first
    text = html.unescape(text)
    
    # Replace multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text)
    
    # Remove control characters but preserve Unicode
    text = re.sub(r'[\x00-\x1F\x7F-\x9F]', '', text)
    
    # Remove any remaining escape sequences
    text = text.replace('\\', '')
    
    return text.strip()

def clean_list(items):
    """Clean a list of strings."""
    if not items or not isinstance(items, list):
        return []
    return [clean_text(item) for item in items if isinstance(item, str)]

def clean_approaches(approaches):
    """Clean approaches data."""
    if not approaches or not isinstance(approaches, list):
        return []
    
    cleaned = []
    for approach in approaches:
        if isinstance(approach, dict):
            cleaned_approach = {}
            for key, value in approach.items():
                if isinstance(value, str):
                    cleaned_approach[clean_text(key)] = clean_text(value)
                else:
                    cleaned_approach[clean_text(key)] = value
            cleaned.append(cleaned_approach)
        elif isinstance(approach, str):
            cleaned.append(clean_text(approach))
    return cleaned

def clean_specialities(specialities):
    """Clean specialities data."""
    if not specialities or not isinstance(specialities, list):
        return []
    
    cleaned = []
    for speciality in specialities:
        if isinstance(speciality, dict):
            cleaned_speciality = {}
            for key, value in speciality.items():
                if isinstance(value, str):
                    cleaned_speciality[clean_text(key)] = clean_text(value)
                else:
                    cleaned_speciality[clean_text(key)] = value
            cleaned.append(cleaned_speciality)
        elif isinstance(speciality, str):
            cleaned.append(clean_text(speciality))
    return cleaned

def clean_therapist_data():
    """Clean all therapist data in the database."""
    db = SessionLocal()
    
    try:
        therapists = db.query(Therapist).all()
        logger.info(f"Found {len(therapists)} therapists to clean")
        
        for i, therapist in enumerate(therapists, 1):
            logger.info(f"Cleaning therapist {i}/{len(therapists)}: {therapist.name}")
            
            # Clean text fields
            therapist.name = clean_text(therapist.name)
            therapist.full_name = clean_text(therapist.full_name) if therapist.full_name else None
            therapist.pronouns = clean_text(therapist.pronouns) if therapist.pronouns else None
            therapist.title = clean_text(therapist.title) if therapist.title else None
            therapist.credentials = clean_text(therapist.credentials) if therapist.credentials else None
            therapist.status = clean_text(therapist.status) if therapist.status else None
            therapist.intro = clean_text(therapist.intro) if therapist.intro else None
            therapist.ideal_client = clean_text(therapist.ideal_client) if therapist.ideal_client else None
            therapist.rate_min = clean_text(therapist.rate_min) if therapist.rate_min else None
            therapist.rate_max = clean_text(therapist.rate_max) if therapist.rate_max else None
            therapist.practicing_since = clean_text(therapist.practicing_since) if therapist.practicing_since else None
            therapist.languages = clean_text(therapist.languages) if therapist.languages else None
            therapist.url = clean_text(therapist.url) if therapist.url else None
            
            # Clean list fields
            if therapist.services:
                therapist.services = clean_list(therapist.services)
            if therapist.insurance:
                therapist.insurance = clean_list(therapist.insurance)
            if therapist.other_techniques:
                therapist.other_techniques = clean_list(therapist.other_techniques)
            if therapist.other_issues:
                therapist.other_issues = clean_list(therapist.other_issues)
            
            # Clean complex fields
            if therapist.approaches:
                therapist.approaches = clean_approaches(therapist.approaches)
            if therapist.specialities:
                therapist.specialities = clean_specialities(therapist.specialities)
        
        db.commit()
        logger.info("Successfully cleaned all therapist data!")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error cleaning therapist data: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    clean_therapist_data() 