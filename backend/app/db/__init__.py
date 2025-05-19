# backend/app/db/init_db.py
from app.db.session import engine
from app.db.base import Base  # noqa
from app.models.therapist import Therapist

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Database tables created.")
