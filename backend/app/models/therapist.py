from pgvector.sqlalchemy import Vector
from sqlalchemy import Boolean, Column, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB

from app.db.base import Base

EMBEDDING_DIM = 384  # all-MiniLM-L6-v2 output size


class Therapist(Base):
    __tablename__ = "therapists"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False, unique=True, index=True)
    name = Column(String, nullable=False, index=True)
    full_name = Column(String, nullable=True)
    pronouns = Column(String, nullable=True)
    title = Column(String, nullable=True)
    credentials = Column(String, nullable=True)
    status = Column(String, nullable=True)
    intro = Column(Text, nullable=True)
    ideal_client = Column(Text, nullable=True)
    rate_min = Column(Integer, nullable=True)
    rate_max = Column(Integer, nullable=True)
    free_consultation = Column(Boolean, nullable=False, default=False)
    practicing_since = Column(Integer, nullable=True)
    services = Column(ARRAY(String), nullable=True)
    insurance = Column(ARRAY(String), nullable=True)
    # List of {"name": str, "description": str}. JSONB (not ARRAY(String)) preserves the
    # name/description split from the scrape so it can be embedded or filtered per-field later,
    # instead of re-parsing flattened "name: description" strings.
    specialities = Column(JSONB, nullable=True)
    # List of {"label": str, "text": str}. Scraped label varies per record (or is absent);
    # kept alongside the text rather than flattened into one string, for the same reason.
    approaches = Column(JSONB, nullable=True)
    other_techniques = Column(ARRAY(String), nullable=True)
    other_issues = Column(ARRAY(String), nullable=True)
    image = Column(String, nullable=True)
    telehealth = Column(Boolean, nullable=False, default=False)
    in_person = Column(Boolean, nullable=False, default=False)
    embedding = Column(Vector(EMBEDDING_DIM), nullable=True)

    __table_args__ = (
        Index("ix_therapists_services_gin", services, postgresql_using="gin"),
        Index("ix_therapists_insurance_gin", insurance, postgresql_using="gin"),
        Index(
            "ix_therapists_other_techniques_gin",
            other_techniques,
            postgresql_using="gin",
        ),
        Index("ix_therapists_other_issues_gin", other_issues, postgresql_using="gin"),
    )
