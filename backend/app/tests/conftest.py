import os

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

import app.models  # noqa: F401 - registers Therapist on Base.metadata
from app.db.base import Base
from app.models.therapist import Therapist

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+psycopg://test:test@localhost:5433/test"
)


@pytest.fixture(scope="session")
def db_engine():
    """Session-scoped engine against a real Postgres+pgvector instance.

    Integration tests need pgvector (the Vector column type, the <=> operator), so
    there's no sqlite/in-memory fallback. Point TEST_DATABASE_URL at any disposable
    pgvector-enabled Postgres; tests skip (not fail) if it's unreachable.
    """
    engine = create_engine(TEST_DATABASE_URL)
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            conn.commit()
    except Exception as exc:
        pytest.skip(
            f"Postgres with pgvector not reachable at {TEST_DATABASE_URL}: {exc}"
        )

    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture()
def db_session(db_engine):
    """A session whose rows are cleared after each test for isolation."""
    session_factory = sessionmaker(bind=db_engine)
    session = session_factory()
    try:
        yield session
    finally:
        session.rollback()
        session.query(Therapist).delete()
        session.commit()
        session.close()
