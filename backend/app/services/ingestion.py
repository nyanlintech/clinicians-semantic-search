import logging

from sqlalchemy.orm import Session

from app.models.therapist import Therapist
from app.services.embedding import EmbeddingService
from app.services.processor import TherapistProcessor

logger = logging.getLogger(__name__)


class IngestionService:
    def __init__(self, db: Session):
        self.db = db
        self.processor = TherapistProcessor()
        self.embedding_service = EmbeddingService()

    def ingest_therapist(self, raw_data: dict) -> Therapist | None:
        """Process and upsert a single therapist, keyed by scrape url."""
        if not self.processor.is_usable_profile(raw_data):
            logger.debug("Skipping unfetched/empty profile: %s", raw_data.get("url"))
            return None

        processed_data = self.processor.process_therapist_data(raw_data)
        logger.info(f"Processing therapist: {processed_data['name']}")

        embedding = self.embedding_service.generate_therapist_embedding(processed_data)

        # Remove summary fields that aren't in the model
        processed_data.pop("approach_summary", None)
        processed_data.pop("specialties_summary", None)

        therapist = (
            self.db.query(Therapist).filter_by(url=processed_data["url"]).first()
        )
        if therapist:
            for key, value in processed_data.items():
                setattr(therapist, key, value)
            therapist.embedding = embedding
        else:
            therapist = Therapist(**processed_data, embedding=embedding)
            self.db.add(therapist)

        self.db.commit()
        self.db.refresh(therapist)

        logger.info(f"Successfully ingested therapist: {therapist.name}")
        return therapist

    def ingest_therapists_batch(self, raw_data_list: list[dict]) -> list[Therapist]:
        """Process and upsert multiple therapists, skipping unfetched/empty scrape shells."""
        therapists = []
        total = len(raw_data_list)
        skipped = 0
        logger.info(f"Starting batch ingestion of {total} raw records")

        for i, raw_data in enumerate(raw_data_list, 1):
            logger.info(f"Processing record {i}/{total}")
            therapist = self.ingest_therapist(raw_data)
            if therapist is None:
                skipped += 1
                continue
            therapists.append(therapist)

        logger.info(
            f"Completed batch ingestion: {len(therapists)} upserted, {skipped} skipped"
        )
        return therapists
