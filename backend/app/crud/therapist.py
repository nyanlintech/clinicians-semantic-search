from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.therapist import Therapist
from app.schemas.therapist import TherapistCreate, TherapistOut

def get_therapist(db: Session, therapist_id: int) -> Optional[Therapist]:
    return db.query(Therapist).filter(Therapist.id == therapist_id).first()

def get_therapists(db: Session, skip: int = 0) -> List[Therapist]:
    return db.query(Therapist).offset(skip).all()

def create_therapist(db: Session, therapist: TherapistCreate) -> Therapist:
    db_therapist = Therapist(**therapist.model_dump(exclude_unset=True))
    db.add(db_therapist)
    db.commit()
    db.refresh(db_therapist)
    return db_therapist

def update_therapist(db: Session, therapist_id: int, updates: dict) -> Optional[Therapist]:
    db_therapist = get_therapist(db, therapist_id)
    if not db_therapist:
        return None
    for key, value in updates.items():
        setattr(db_therapist, key, value)
    db.commit()
    db.refresh(db_therapist)
    return db_therapist

def delete_therapist(db: Session, therapist_id: int) -> bool:
    db_therapist = get_therapist(db, therapist_id)
    if not db_therapist:
        return False
    db.delete(db_therapist)
    db.commit()
    return True
