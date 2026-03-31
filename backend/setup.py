from setuptools import setup, find_packages

setup(
    name="therapist-search-backend",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "python-dotenv",
        "pydantic",
        "sqlalchemy",
        "psycopg2",
        "alembic",
        "pgvector",
        "sentence-transformers",
        "torch",
        "transformers",
        "python-multipart",
    ],
    extras_require={
        "ingestion": [
            "APScheduler>=3.10.0",
            "click>=8.1.0",
            "beautifulsoup4>=4.12.0",
            "selenium>=4.0.0",
            "websocket-client>=1.6.0",
        ],
    },
)
