from sqlalchemy import Column, Integer, String, Text, Float, ARRAY, Boolean, JSON
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from app.db.base import Base
from sqlalchemy import text

class Therapist(Base):
    __tablename__ = "therapists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    pronouns = Column(String, nullable=True)
    title = Column(String, nullable=True)
    credentials = Column(String, nullable=True)
    status = Column(String, nullable=True)
    intro = Column(String, nullable=True)
    ideal_client = Column(String, nullable=True)
    approaches = Column(ARRAY(JSONB), nullable=True)
    rate_min = Column(String, nullable=True)
    rate_max = Column(String, nullable=True)
    free_consultation = Column(Boolean, nullable=True)
    practicing_since = Column(String, nullable=True)
    languages = Column(String, nullable=True)
    services = Column(ARRAY(String), nullable=True)
    insurance = Column(ARRAY(String), nullable=True)
    specialities = Column(ARRAY(JSONB), nullable=True)
    other_techniques = Column(ARRAY(String), nullable=True)
    other_issues = Column(ARRAY(String), nullable=True)
    url = Column(String, nullable=True)
    image = Column(String, nullable=True)
    telehealth = Column(Boolean, nullable=True)
    in_person = Column(Boolean, nullable=True)
    embedding = Column(ARRAY(Float), nullable=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if 'embedding' in kwargs:
            self.embedding = kwargs['embedding']
