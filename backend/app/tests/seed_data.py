from sqlalchemy.orm import Session
from app.models.therapist import Therapist
from app.services.search import SearchService
from app.db.session import SessionLocal

def seed_test_data():
    search_service = SearchService()
    db = SessionLocal()
    
    try:
        # Sample therapist data
        therapists = [
            Therapist(
                name="Dr. Sarah Johnson",
                full_name="Dr. Sarah Johnson, PhD",
                pronouns="she/her",
                title="Clinical Psychologist",
                credentials="PhD, LCP",
                status="Accepting new clients",
                intro="I specialize in trauma-informed care and holistic approaches to mental health.",
                ideal_client="I work best with adults dealing with trauma, anxiety, and life transitions.",
                approach_summary="I combine evidence-based practices with mindfulness and somatic approaches.",
                rate_min="150",
                rate_max="200",
                free_consultation=True,
                practicing_since="2015",
                languages="English",
                services=["Individual Therapy", "Trauma Therapy", "Anxiety Treatment"],
                insurance=["Blue Cross", "Aetna"],
                specialities={
                    "trauma": "PTSD, Complex Trauma",
                    "anxiety": "Generalized Anxiety, Social Anxiety",
                    "approach": "Holistic, Trauma-Informed"
                },
                other_techniques=["EMDR", "Mindfulness", "Somatic Therapy"],
                other_issues=["Life Transitions", "Relationship Issues"],
                url="https://example.com/sarah-johnson"
            ),
            Therapist(
                name="Michael Chen",
                full_name="Michael Chen, LCSW",
                pronouns="he/him",
                title="Licensed Clinical Social Worker",
                credentials="LCSW",
                status="Accepting new clients",
                intro="I focus on helping clients develop practical coping skills and build resilience.",
                ideal_client="I work well with adolescents and young adults navigating life changes.",
                approach_summary="I use a solution-focused approach combined with cognitive behavioral techniques.",
                rate_min="120",
                rate_max="150",
                free_consultation=True,
                practicing_since="2018",
                languages="English, Mandarin",
                services=["Individual Therapy", "Group Therapy", "CBT"],
                insurance=["Kaiser", "Providence"],
                specialities={
                    "anxiety": "Stress Management, Social Anxiety",
                    "depression": "Mood Disorders",
                    "approach": "Solution-Focused, CBT"
                },
                other_techniques=["CBT", "DBT Skills", "Solution-Focused Therapy"],
                other_issues=["Academic Stress", "Career Development"],
                url="https://example.com/michael-chen"
            ),
            Therapist(
                name="Dr. Maria Rodriguez",
                full_name="Dr. Maria Rodriguez, PsyD",
                pronouns="she/her",
                title="Clinical Psychologist",
                credentials="PsyD, LCP",
                status="Accepting new clients",
                intro="I specialize in culturally sensitive therapy for Latinx communities.",
                ideal_client="I work with adults and families from diverse cultural backgrounds.",
                approach_summary="I integrate cultural perspectives with evidence-based practices.",
                rate_min="140",
                rate_max="180",
                free_consultation=True,
                practicing_since="2016",
                languages="English, Spanish",
                services=["Individual Therapy", "Family Therapy", "Cultural Counseling"],
                insurance=["Medicare", "Oregon Health Plan"],
                specialities={
                    "cultural": "Latinx Mental Health",
                    "family": "Family Systems",
                    "approach": "Culturally Sensitive, Family Systems"
                },
                other_techniques=["Family Systems Therapy", "Cultural Counseling"],
                other_issues=["Cultural Identity", "Family Dynamics"],
                url="https://example.com/maria-rodriguez"
            )
        ]

        # Add therapists to database and generate embeddings
        for therapist in therapists:
            db.add(therapist)
            db.flush()  # Flush to get the ID
            search_service.update_therapist_embedding(db, therapist)
        
        db.commit()
        print("Successfully seeded test data!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_test_data() 