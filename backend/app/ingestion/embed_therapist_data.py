from app.core.embedding import embed_text
from app.db import SessionLocal
from app.models import Therapist
import json

def embed_and_store_therapists(filepath: str):
    with open(filepath, "r") as f:
        scraped_profiles = json.load(f)

    session = SessionLocal()
    try:
        for profile in scraped_profiles:
            combined_text = " ".join(filter(None, [
                profile.get("approach"),
                profile.get("background"),
                profile.get("personal_statement"),
            ]))
            embedding = embed_text(combined_text)

            existing = session.query(Therapist).filter_by(name=profile["name"]).first()
            if existing:
                existing.approach = profile.get("approach")
                existing.background = profile.get("background")
                existing.personal_statement = profile.get("personal_statement")
                existing.embedding = embedding
            else:
                new_therapist = Therapist(
                    name=profile["name"],
                    approach=profile.get("approach"),
                    background=profile.get("background"),
                    personal_statement=profile.get("personal_statement"),
                    embedding=embedding,
                )
                session.add(new_therapist)

        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error during embedding and storing therapists: {e}")
    finally:
        session.close()
