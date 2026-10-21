from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine


def init_db() -> None:
    import app.models.therapist  # noqa: F401 - register models with Base

    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()

    Base.metadata.create_all(bind=engine)
