#!/usr/bin/env python3
"""
Script to update existing therapist records with default values for new fields.
Run this after adding new columns to the database.
"""

import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(backend_dir))

from app.db.session import SessionLocal
from app.models.therapist import Therapist
from sqlalchemy import text

def update_existing_records():
    """Update existing therapist records with default values for new fields."""
    db = SessionLocal()
    
    try:
        # Count records that need updating
        count = db.query(Therapist).filter(
            (Therapist.telehealth.is_(None)) | 
            (Therapist.in_person.is_(None)) | 
            (Therapist.image.is_(None))
        ).count()
        
        print(f"Found {count} records that need updating...")
        
        if count == 0:
            print("No records need updating.")
            return
        
        # Update records with default values
        updated = db.query(Therapist).filter(
            (Therapist.telehealth.is_(None)) | 
            (Therapist.in_person.is_(None)) | 
            (Therapist.image.is_(None))
        ).update({
            'telehealth': False,
            'in_person': True,
            'image': None
        }, synchronize_session=False)
        
        db.commit()
        print(f"✅ Updated {updated} records with default values:")
        print(f"   - telehealth: False (default)")
        print(f"   - in_person: True (default)")
        print(f"   - image: None (default)")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error updating records: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    update_existing_records() 