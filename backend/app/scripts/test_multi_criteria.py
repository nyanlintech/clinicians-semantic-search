import logging
from app.db.session import SessionLocal
from app.services.search import SearchService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_multi_criteria():
    search_service = SearchService()
    db = SessionLocal()
    
    try:
        # Test the original problematic query
        test_query = "therapist specializes ADHD AND immigrant"
        
        logger.info(f"Testing query: '{test_query}'")
        logger.info("="*60)
        
        results = search_service.search_therapists(
            db=db,
            query=test_query,
            limit=5
        )
        
        logger.info(f"Found {len(results)} results:")
        for i, therapist in enumerate(results, 1):
            logger.info(f"\n{i}. {therapist['name']} - {therapist['title']}")
            logger.info(f"   Specialties: {therapist.get('specialities', 'None')}")
            logger.info(f"   Issues: {therapist.get('other_issues', 'None')}")
            logger.info(f"   Languages: {therapist.get('languages', 'None')}")
            if therapist.get('intro'):
                logger.info(f"   Intro: {therapist['intro'][:150]}...")
        
        # Test other multi-criteria queries
        other_queries = [
            "anxiety specialist AND speaks Spanish",
            "trauma therapist AND EMDR",
            "couples counselor AND Kaiser insurance"
        ]
        
        for query in other_queries:
            logger.info(f"\n\nTesting: '{query}'")
            logger.info("-" * 40)
            
            results = search_service.search_therapists(
                db=db,
                query=query,
                limit=3
            )
            
            logger.info(f"Found {len(results)} results:")
            for i, therapist in enumerate(results, 1):
                logger.info(f"{i}. {therapist['name']} - {therapist['title']}")
        
    except Exception as e:
        logger.error(f"Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_multi_criteria() 