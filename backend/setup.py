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
) 