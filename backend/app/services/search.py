import logging
import re

import numpy as np
from sqlalchemy import or_, text
from sqlalchemy.orm import Session

from app.models.therapist import Therapist
from app.services.embedding import EmbeddingService
from app.services.processor import TherapistProcessor

logger = logging.getLogger(__name__)


class SearchService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.processor = TherapistProcessor()

    def warm_up(self) -> None:
        """Load the embedding model early so the first search request is faster."""
        self.embedding_service.warm_up()

    def generate_embedding(self, text: str) -> list:
        """Generate embedding for a given text, via the same model/pipeline ingestion uses."""
        return self.embedding_service.generate_embedding(text)

    def _cosine_similarity(self, vec1: list[float], vec2: list[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        vec1_np = np.array(vec1)
        vec2_np = np.array(vec2)

        dot_product = np.dot(vec1_np, vec2_np)
        norm_vec1 = np.linalg.norm(vec1_np)
        norm_vec2 = np.linalg.norm(vec2_np)

        if norm_vec1 == 0 or norm_vec2 == 0:
            return 0.0

        return dot_product / (norm_vec1 * norm_vec2)

    def parse_criteria_from_query(self, query: str) -> list[str]:
        """Parse multiple criteria from a query string."""
        # Split by common connectors
        criteria = []

        # Split by AND (case insensitive)
        parts = re.split(r"\s+and\s+", query.lower(), flags=re.IGNORECASE)

        for part in parts:
            # Clean up each part
            part = part.strip()
            # Remove common prefixes
            part = re.sub(r"^(a\s+therapist\s+)?(who\s+)?(that\s+)?", "", part)
            if part and len(part) > 2:
                criteria.append(part)

        # If we didn't get multiple criteria, return the original query
        if len(criteria) <= 1:
            criteria = [query.strip()]

        logger.debug("Parsed criteria from '%s': %s", query, criteria)
        return criteria

    def transform_therapist_data(self, therapist: Therapist) -> dict:
        """Transform therapist data to match the API response format."""
        data = {
            "id": therapist.id,
            "name": therapist.name,
            "full_name": therapist.full_name,
            "pronouns": therapist.pronouns,
            "title": therapist.title,
            "credentials": therapist.credentials,
            "status": therapist.status,
            "intro": therapist.intro,
            "ideal_client": therapist.ideal_client,
            # DB stores rate as int dollars; API keeps the legacy "$100" string shape.
            "rate_min": f"${therapist.rate_min}"
            if therapist.rate_min is not None
            else None,
            "rate_max": f"${therapist.rate_max}"
            if therapist.rate_max is not None
            else None,
            "free_consultation": therapist.free_consultation,
            "practicing_since": str(therapist.practicing_since)
            if therapist.practicing_since is not None
            else None,
            "services": therapist.services,
            "insurance": therapist.insurance,
            "other_techniques": therapist.other_techniques,
            "other_issues": therapist.other_issues,
            "url": therapist.url,
            "image": therapist.image,
            "telehealth": therapist.telehealth,
            "in_person": therapist.in_person,
            "approaches": therapist.approaches or None,
            "specialities": therapist.specialities or None,
        }

        return data

    def search_therapists(
        self,
        db: Session,
        query: str,
        insurance: list[str] | None = None,
        titles: list[str] | None = None,
        limit: int = 100,
        min_similarity: float = 0.2,
    ) -> list[dict]:
        """Search for therapists using pre-computed embeddings."""
        logger.info(
            "Search query: %s | insurance: %s | titles: %s", query, insurance, titles
        )

        # Parse multiple criteria from the query
        criteria = self.parse_criteria_from_query(query)

        # Start with base query
        base_query = db.query(Therapist)

        # Apply filters if provided
        if insurance:
            base_query = base_query.filter(Therapist.insurance.overlap(insurance))
        if titles:
            title_conditions = [Therapist.title.ilike(f"%{title}%") for title in titles]
            base_query = base_query.filter(or_(*title_conditions))

        if len(criteria) > 1:
            logger.debug(
                "Using multi-criteria vector search for %d criteria: %s",
                len(criteria),
                criteria,
            )

            # Generate embedding for the combined query
            combined_query = " AND ".join(criteria)
            query_embedding = self.generate_embedding(combined_query)

            # Use vector similarity search with LIMIT and similarity filtering
            results = (
                base_query.order_by(
                    text("embedding::vector <=> cast(:query_embedding as vector)")
                )
                .params(query_embedding=query_embedding)
                .limit(limit * 2)
                .all()
            )  # Get more to filter by similarity

            # Filter by similarity threshold
            filtered_results = []
            for therapist in results:
                if therapist.embedding is not None:
                    similarity = self._cosine_similarity(
                        query_embedding, therapist.embedding
                    )
                    if similarity >= min_similarity:
                        filtered_results.append(therapist)
                        if len(filtered_results) >= limit:
                            break

            results = filtered_results[:limit]

        else:
            logger.debug("Using single criterion vector search")
            query_embedding = self.generate_embedding(query)

            # Use vector similarity search with LIMIT and similarity filtering
            results = (
                base_query.order_by(
                    text("embedding::vector <=> cast(:query_embedding as vector)")
                )
                .params(query_embedding=query_embedding)
                .limit(limit * 2)
                .all()
            )  # Get more to filter by similarity

            # Filter by similarity threshold
            filtered_results = []
            for therapist in results:
                if therapist.embedding is not None:
                    similarity = self._cosine_similarity(
                        query_embedding, therapist.embedding
                    )
                    if similarity >= min_similarity:
                        filtered_results.append(therapist)
                        if len(filtered_results) >= limit:
                            break

            results = filtered_results[:limit]

        logger.info(
            "Returning %d results (filtered by similarity >= %.2f)",
            len(results),
            min_similarity,
        )
        transformed_results = [
            self.transform_therapist_data(therapist) for therapist in results
        ]
        return transformed_results

    def update_therapist_embedding(self, db: Session, therapist: Therapist) -> None:
        """Re-embed a stored therapist row using the exact same text template ingestion
        uses (EmbeddingService.generate_therapist_embedding), so a backfill/re-embed never
        drifts from what a fresh ingest of the same data would produce."""
        data = {
            "title": therapist.title or "",
            "credentials": therapist.credentials or "",
            "intro": therapist.intro or "",
            "ideal_client": therapist.ideal_client or "",
            "approach_summary": self.processor.summarize_approaches(
                therapist.approaches or []
            ),
            "specialties_summary": self.processor.summarize_specialities(
                therapist.specialities or []
            ),
            "services": therapist.services or [],
            "other_techniques": therapist.other_techniques or [],
            "other_issues": therapist.other_issues or [],
            "telehealth": therapist.telehealth,
            "in_person": therapist.in_person,
        }
        therapist.embedding = self.embedding_service.generate_therapist_embedding(data)
        db.commit()
