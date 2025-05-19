import logging
from app.db.session import SessionLocal
from app.models.therapist import Therapist
from sentence_transformers import SentenceTransformer
import numpy as np
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_vector_search():
    # Initialize the sentence transformer model
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Example search queries
    search_queries = [
        "I need help with anxiety and depression",
        "Looking for a trauma therapist who specializes in EMDR",
        "Need a couples counselor who accepts Kaiser insurance",
        "Therapist who works with LGBTQ+ clients and ADHD",
        "Looking for a Spanish-speaking therapist for family therapy"
    ]
    
    db = SessionLocal()
    try:
        for query in search_queries:
            logger.info(f"\nSearching for: {query}")
            
            # Generate embedding for the search query
            query_embedding = model.encode(query)
            
            # Convert to list for PostgreSQL
            query_embedding_list = query_embedding.tolist()
            
            # Perform vector similarity search
            # Using cosine similarity (1 - cosine distance)
            results = db.execute(
                text("""
                SELECT 
                    name,
                    title,
                    specialities,
                    services,
                    insurance,
                    1 - (embedding <=> :embedding) as similarity
                FROM therapists
                ORDER BY embedding <=> :embedding
                LIMIT 5
                """),
                {"embedding": query_embedding_list}
            ).fetchall()
            
            # Print results
            for result in results:
                logger.info(f"\nTherapist: {result.name}")
                logger.info(f"Title: {result.title}")
                logger.info(f"Specialties: {result.specialities}")
                logger.info(f"Services: {result.services}")
                logger.info(f"Insurance: {result.insurance}")
                logger.info(f"Similarity Score: {result.similarity:.4f}")
                
    finally:
        db.close()

if __name__ == "__main__":
    test_vector_search() 