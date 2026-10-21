from app.services.search import SearchService


def make_search_service() -> SearchService:
    # Construction doesn't touch the network/model - EmbeddingService/sentence-transformers
    # load lazily on first .model access, which these tests never trigger.
    return SearchService()


def test_parse_criteria_from_query_splits_on_and():
    service = make_search_service()
    criteria = service.parse_criteria_from_query(
        "a therapist who specializes in trauma and works with teens"
    )
    assert criteria == ["specializes in trauma", "works with teens"]


def test_parse_criteria_from_query_single_criterion_returns_original_query():
    service = make_search_service()
    query = "someone who understands anxiety"
    assert service.parse_criteria_from_query(query) == [query]


def test_cosine_similarity_identical_vectors_is_one():
    service = make_search_service()
    vec = [1.0, 0.0, 0.0]
    assert service._cosine_similarity(vec, vec) == 1.0


def test_cosine_similarity_orthogonal_vectors_is_zero():
    service = make_search_service()
    assert service._cosine_similarity([1.0, 0.0], [0.0, 1.0]) == 0.0


def test_cosine_similarity_zero_vector_does_not_divide_by_zero():
    service = make_search_service()
    assert service._cosine_similarity([0.0, 0.0], [1.0, 1.0]) == 0.0


class _FakeTherapist:
    """Minimal stand-in for the ORM model - just the attributes transform_therapist_data reads."""

    def __init__(self, **overrides):
        defaults = {
            "id": 1,
            "name": "Jane Doe",
            "full_name": "Jane Doe, LCSW",
            "pronouns": "she/her",
            "title": "Therapist",
            "credentials": "LCSW",
            "status": "accepting clients",
            "intro": "I help people.",
            "ideal_client": "Adults with anxiety.",
            "rate_min": 100,
            "rate_max": 150,
            "free_consultation": True,
            "practicing_since": 2020,
            "services": ["INDIVIDUAL"],
            "insurance": ["AETNA"],
            "other_techniques": ["CBT"],
            "other_issues": ["Anxiety"],
            "url": "http://example.com/jane",
            "image": None,
            "telehealth": True,
            "in_person": False,
            "approaches": [{"label": "My Approach", "text": "CBT focused."}],
            "specialities": [{"name": "Anxiety", "description": "GAD, panic"}],
        }
        defaults.update(overrides)
        for key, value in defaults.items():
            setattr(self, key, value)


def test_transform_therapist_data_preserves_structured_approaches_and_specialities():
    service = make_search_service()
    data = service.transform_therapist_data(_FakeTherapist())

    assert data["approaches"] == [{"label": "My Approach", "text": "CBT focused."}]
    assert data["specialities"] == [{"name": "Anxiety", "description": "GAD, panic"}]


def test_transform_therapist_data_formats_rate_as_legacy_dollar_string():
    service = make_search_service()
    data = service.transform_therapist_data(_FakeTherapist(rate_min=100, rate_max=150))

    assert data["rate_min"] == "$100"
    assert data["rate_max"] == "$150"


def test_transform_therapist_data_handles_missing_rate():
    service = make_search_service()
    data = service.transform_therapist_data(
        _FakeTherapist(rate_min=None, rate_max=None)
    )

    assert data["rate_min"] is None
    assert data["rate_max"] is None
