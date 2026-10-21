from unittest.mock import patch

from app.models.therapist import Therapist
from app.services.ingestion import IngestionService

# Ingestion tests stub out the actual sentence-transformers model (slow, needs a
# network fetch on first use) and assert on everything *around* the embedding call:
# normalization, upsert behavior, and that generate_therapist_embedding is in fact the
# one method invoked for it (i.e. ingestion goes through the canonical EmbeddingService
# pipeline, not a divergent one).
FAKE_EMBEDDING = [0.01] * 384


def make_raw(url="http://example.com/t1", **overrides):
    data = {
        "profile_fetched": True,
        "name": "Jane Doe",
        "url": url,
        "title": "Therapist",
        "intro": "I help people.",
        "ideal_client": "Adults with anxiety.",
        "specialities": [{"name": "Anxiety", "description": "GAD, panic"}],
        "approaches": [{"My Approach": "CBT focused."}],
        "services": ["INDIVIDUAL"],
        "insurance": ["Aetna", "AETNA", ""],
        "other_techniques": ["CBT"],
        "other_issues": ["Anxiety"],
        "telehealth": True,
        "in_person": False,
        "rate": {"min": "$100", "max": "$150"},
        "practicing_since": "2020",
    }
    data.update(overrides)
    return data


@patch(
    "app.services.embedding.EmbeddingService.generate_therapist_embedding",
    return_value=FAKE_EMBEDDING,
)
def test_ingest_therapist_creates_row_with_structured_fields(mock_embed, db_session):
    service = IngestionService(db_session)
    therapist = service.ingest_therapist(make_raw())

    assert therapist is not None
    assert therapist.name == "Jane Doe"
    assert therapist.specialities == [{"name": "Anxiety", "description": "GAD, panic"}]
    assert therapist.approaches == [{"label": "My Approach", "text": "CBT focused."}]
    assert therapist.insurance == ["AETNA"]
    assert therapist.rate_min == 100
    assert therapist.rate_max == 150
    assert len(therapist.embedding) == 384
    mock_embed.assert_called_once()


@patch(
    "app.services.embedding.EmbeddingService.generate_therapist_embedding",
    return_value=FAKE_EMBEDDING,
)
def test_ingest_therapist_skips_unfetched_shell_record(mock_embed, db_session):
    service = IngestionService(db_session)
    result = service.ingest_therapist({"profile_fetched": False, "url": "http://x"})

    assert result is None
    mock_embed.assert_not_called()
    assert db_session.query(Therapist).count() == 0


@patch(
    "app.services.embedding.EmbeddingService.generate_therapist_embedding",
    return_value=FAKE_EMBEDDING,
)
def test_ingest_therapist_upserts_by_url_instead_of_duplicating(
    _mock_embed, db_session
):
    service = IngestionService(db_session)
    first = service.ingest_therapist(make_raw(name="Jane"))
    second = service.ingest_therapist(make_raw(name="Jane Updated"))

    assert first.id == second.id
    assert db_session.query(Therapist).count() == 1
    assert second.name == "Jane Updated"


@patch(
    "app.services.embedding.EmbeddingService.generate_therapist_embedding",
    return_value=FAKE_EMBEDDING,
)
def test_ingest_therapists_batch_skips_incomplete_scrape_shells(
    _mock_embed, db_session
):
    service = IngestionService(db_session)
    raw_list = [
        make_raw(url="http://example.com/a"),
        {"profile_fetched": False, "url": "http://example.com/b"},
        {"profile_fetched": True, "name": "", "url": "http://example.com/c"},
    ]
    result = service.ingest_therapists_batch(raw_list)

    assert len(result) == 1
    assert db_session.query(Therapist).count() == 1
