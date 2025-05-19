from app.db.base import Base
from app.db.session import engine
from sqlalchemy import text

def init_db():
    # Enable pgvector extension
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    
    # Create tables
    Base.metadata.create_all(bind=engine)
