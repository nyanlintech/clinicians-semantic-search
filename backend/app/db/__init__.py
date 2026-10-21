from app.db.base import Base  # noqa: F401
from app.db.init_db import init_db
from app.db.session import SessionLocal, engine  # noqa: F401

if __name__ == "__main__":
    init_db()
    print("Database tables created.")
