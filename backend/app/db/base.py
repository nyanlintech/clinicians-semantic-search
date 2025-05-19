from sqlalchemy.ext.declarative import declarative_base

# Create the base class for SQLAlchemy models
Base = declarative_base()

# Import all models here for Alembic
from app.models.therapist import Therapist  # noqa
