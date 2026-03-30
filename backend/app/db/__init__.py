from app.db.session import SessionLocal, engine
from app.db.base import Base  # noqa

def init_db():
    import app.models.therapist  # noqa: register models with Base
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Database tables created.")
