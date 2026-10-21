from app.services.processor import TherapistProcessor


def test_clean_text_unescapes_html_and_collapses_whitespace():
    assert TherapistProcessor.clean_text("  Hello &amp;  world  ") == "Hello & world"


def test_clean_text_handles_non_string_input():
    assert TherapistProcessor.clean_text(None) == ""
    assert TherapistProcessor.clean_text(123) == ""


def test_clean_insurance_list_dedupes_case_and_whitespace_variants():
    result = TherapistProcessor.clean_insurance_list(
        ["Aetna", "AETNA", " aetna ", "", "Kaiser"]
    )
    assert sorted(result) == ["AETNA", "KAISER"]


def test_parse_rate_swaps_backwards_min_max():
    assert TherapistProcessor.parse_rate({"min": "$180", "max": "$100"}) == (100, 180)


def test_parse_rate_handles_missing_or_empty():
    assert TherapistProcessor.parse_rate(None) == (None, None)
    assert TherapistProcessor.parse_rate({"min": "", "max": ""}) == (None, None)


def test_parse_practicing_since_accepts_four_digit_year():
    assert TherapistProcessor.parse_practicing_since("2020") == 2020


def test_parse_practicing_since_rejects_non_year_values():
    assert TherapistProcessor.parse_practicing_since("a long time ago") is None
    assert TherapistProcessor.parse_practicing_since(None) is None


def test_is_usable_profile_requires_fetched_name_and_url():
    assert TherapistProcessor.is_usable_profile(
        {"profile_fetched": True, "name": "A", "url": "http://x"}
    )
    assert not TherapistProcessor.is_usable_profile(
        {"profile_fetched": False, "name": "A", "url": "http://x"}
    )
    assert not TherapistProcessor.is_usable_profile(
        {"profile_fetched": True, "name": "", "url": "http://x"}
    )
    assert not TherapistProcessor.is_usable_profile(
        {"profile_fetched": True, "name": "A", "url": ""}
    )


def test_process_therapist_data_preserves_speciality_name_description_split():
    raw = {
        "profile_fetched": True,
        "name": "Jane Doe",
        "url": "http://example.com/jane",
        "specialities": [{"name": "Trauma", "description": "PTSD work"}],
    }
    processed = TherapistProcessor.process_therapist_data(raw)
    assert processed["specialities"] == [{"name": "Trauma", "description": "PTSD work"}]
    assert processed["specialties_summary"] == "Trauma: PTSD work"


def test_process_therapist_data_preserves_approach_label_text_split():
    raw = {
        "profile_fetched": True,
        "name": "Jane Doe",
        "url": "http://example.com/jane",
        "approaches": [{"My Approach to Helping": "I focus on CBT."}],
    }
    processed = TherapistProcessor.process_therapist_data(raw)
    assert processed["approaches"] == [
        {"label": "My Approach to Helping", "text": "I focus on CBT."}
    ]
    assert processed["approach_summary"] == "My Approach to Helping: I focus on CBT."


def test_process_therapist_data_handles_label_less_approach_strings():
    raw = {
        "profile_fetched": True,
        "name": "A",
        "url": "u",
        "approaches": ["Just text, no dict wrapper."],
    }
    processed = TherapistProcessor.process_therapist_data(raw)
    assert processed["approaches"] == [
        {"label": "", "text": "Just text, no dict wrapper."}
    ]
    assert processed["approach_summary"] == "Just text, no dict wrapper."


def test_process_therapist_data_skips_blank_approach_values():
    raw = {
        "profile_fetched": True,
        "name": "A",
        "url": "u",
        "approaches": [{"Empty Label": "   "}],
    }
    processed = TherapistProcessor.process_therapist_data(raw)
    assert processed["approaches"] == []
    assert processed["approach_summary"] == ""


def test_process_therapist_data_parses_rate_and_cleans_insurance():
    raw = {
        "profile_fetched": True,
        "name": "A",
        "url": "u",
        "rate": {"min": "$100", "max": "$150"},
        "insurance": ["Aetna", "AETNA", ""],
    }
    processed = TherapistProcessor.process_therapist_data(raw)
    assert processed["rate_min"] == 100
    assert processed["rate_max"] == 150
    assert processed["insurance"] == ["AETNA"]


def test_summarize_specialities_omits_colon_when_no_description():
    assert (
        TherapistProcessor.summarize_specialities(
            [{"name": "Trauma", "description": ""}]
        )
        == "Trauma"
    )


def test_summarize_approaches_omits_colon_when_no_label():
    assert (
        TherapistProcessor.summarize_approaches(
            [{"label": "", "text": "I focus on CBT."}]
        )
        == "I focus on CBT."
    )
