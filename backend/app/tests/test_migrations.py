import uuid
from pathlib import Path

import psycopg
import pytest
from alembic.autogenerate import compare_metadata
from alembic.config import Config
from alembic.runtime.migration import MigrationContext
from sqlalchemy import create_engine, text

import app.models  # noqa: F401 - registers Therapist on Base.metadata
from alembic import command
from app.core.config import settings
from app.db.base import Base
from app.tests.conftest import TEST_DATABASE_URL

BACKEND_DIR = Path(__file__).resolve().parents[2]


def _libpq_url(sqlalchemy_url: str) -> str:
    """psycopg.connect() wants a plain postgresql:// DSN, not SQLAlchemy's +psycopg dialect suffix."""
    return sqlalchemy_url.replace("postgresql+psycopg://", "postgresql://", 1)


@pytest.fixture()
def fresh_migration_db():
    """A throwaway database (not schema - ALTER COLUMN ... USING in the jsonb migration
    needs its own namespace cleanly) that alembic upgrades from scratch, so this test
    verifies the *migrations* build the current schema, not just that create_all() does."""
    db_name = f"migration_check_{uuid.uuid4().hex[:8]}"
    try:
        admin_conn = psycopg.connect(_libpq_url(TEST_DATABASE_URL), autocommit=True)
    except Exception as exc:
        pytest.skip(f"Postgres not reachable at {TEST_DATABASE_URL}: {exc}")
    try:
        admin_conn.execute(f'CREATE DATABASE "{db_name}"')
    finally:
        admin_conn.close()

    base_url = TEST_DATABASE_URL.rsplit("/", 1)[0]
    db_url = f"{base_url}/{db_name}"

    original_database_url = settings.DATABASE_URL
    settings.DATABASE_URL = db_url
    try:
        yield db_url
    finally:
        settings.DATABASE_URL = original_database_url
        admin_conn = psycopg.connect(_libpq_url(TEST_DATABASE_URL), autocommit=True)
        try:
            admin_conn.execute(f'DROP DATABASE "{db_name}"')
        finally:
            admin_conn.close()


def test_alembic_head_produces_schema_matching_current_models(fresh_migration_db):
    engine = create_engine(fresh_migration_db)
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()

    cfg = Config(str(BACKEND_DIR / "alembic.ini"))
    cfg.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    # alembic/env.py reads settings.resolved_database_url itself (ignores this), but
    # setting it here too keeps the Config object consistent for any other consumer.
    cfg.set_main_option("sqlalchemy.url", fresh_migration_db)

    command.upgrade(cfg, "head")

    with engine.connect() as conn:
        ctx = MigrationContext.configure(conn)
        diff = compare_metadata(ctx, Base.metadata)

    assert diff == [], f"Model/migration drift detected: {diff}"
    engine.dispose()
