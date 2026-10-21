import html
import re
from typing import Any


class TherapistProcessor:
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text while preserving Unicode characters."""
        if not text or not isinstance(text, str):
            return ""

        # Decode HTML entities first (e.g., &amp; -> &)
        text = html.unescape(text)

        # Replace multiple spaces with a single space
        text = re.sub(r"\s+", " ", text)

        # Remove control characters but preserve Unicode
        text = re.sub(r"[\x00-\x1F\x7F-\x9F]", "", text)

        # Remove any remaining escape sequences that might be causing issues
        text = text.replace("\\", "")

        return text.strip()

    @staticmethod
    def clean_list(items: list[str]) -> list[str]:
        """Clean a list of strings while preserving Unicode."""
        if not items or not isinstance(items, list):
            return []
        return [
            TherapistProcessor.clean_text(item)
            for item in items
            if isinstance(item, str)
        ]

    @staticmethod
    def clean_insurance_list(items: list[str]) -> list[str]:
        """Clean and dedupe insurance names, normalizing case so scrape variants collapse."""
        if not items or not isinstance(items, list):
            return []
        seen = {}
        for item in items:
            if not isinstance(item, str):
                continue
            cleaned = TherapistProcessor.clean_text(item).upper()
            if cleaned:
                seen[cleaned] = cleaned
        return list(seen.values())

    @staticmethod
    def parse_rate(rate: dict[str, Any] | None) -> tuple[int | None, int | None]:
        """Parse scraped rate strings like '$100' into ints, fixing swapped min/max."""
        if not isinstance(rate, dict):
            return None, None

        def to_int(value: Any) -> int | None:
            if not isinstance(value, str):
                return None
            digits = re.sub(r"[^\d]", "", value)
            return int(digits) if digits else None

        rate_min = to_int(rate.get("min"))
        rate_max = to_int(rate.get("max"))
        if rate_min is not None and rate_max is not None and rate_min > rate_max:
            rate_min, rate_max = rate_max, rate_min
        return rate_min, rate_max

    @staticmethod
    def parse_practicing_since(value: Any) -> int | None:
        """Parse a 4-digit scraped year string into an int."""
        if isinstance(value, str) and re.fullmatch(r"\d{4}", value.strip()):
            return int(value.strip())
        return None

    @staticmethod
    def extract_key_value_pairs_as_strings(items: list[dict[str, Any]]) -> list[str]:
        """
        Combine each key-value pair in list of dicts into 'Key: Value' strings.
        """
        if not items or not isinstance(items, list):
            return []
        combined = []
        for item in items:
            if isinstance(item, dict):
                for key, val in item.items():
                    if isinstance(val, str):
                        combined.append(
                            f"{TherapistProcessor.clean_text(key)}: {TherapistProcessor.clean_text(val)}"
                        )
                    elif isinstance(val, list):
                        for sub_val in val:
                            if isinstance(sub_val, str):
                                combined.append(
                                    f"{TherapistProcessor.clean_text(key)}: {TherapistProcessor.clean_text(sub_val)}"
                                )
        return combined

    @staticmethod
    def is_usable_profile(raw_data: dict[str, Any]) -> bool:
        """Scraper leaves placeholder shells (profile page never fetched) - skip those."""
        return (
            bool(raw_data.get("profile_fetched"))
            and bool(raw_data.get("name"))
            and bool(raw_data.get("url"))
        )

    @staticmethod
    def summarize_approaches(approaches: list[dict[str, str]]) -> str:
        """Join {"label", "text"} objects into the embedding-text summary used both at
        ingest time and when re-embedding an already-stored therapist row."""
        return " ".join(
            f"{a['label']}: {a['text']}" if a.get("label") else a.get("text", "")
            for a in approaches
        )

    @staticmethod
    def summarize_specialities(specialities: list[dict[str, str]]) -> str:
        """Join {"name", "description"} objects into the embedding-text summary used both
        at ingest time and when re-embedding an already-stored therapist row."""
        return ", ".join(
            f"{s['name']}: {s['description']}"
            if s.get("description")
            else s.get("name", "")
            for s in specialities
        )

    @staticmethod
    def process_therapist_data(raw_data: dict[str, Any]) -> dict[str, Any]:
        """Process and clean therapist data."""
        approaches = raw_data.get("approaches", [])
        specialities = raw_data.get("specialities", [])

        # Transform approaches into {"label", "text"} objects, keeping the name/text split
        # instead of flattening it. Scraped label (dict key) varies a lot ("My Approach to
        # Helping" / "Our Background" / "" ...) - keep whatever's there, empty string when
        # the scraper left it blank.
        formatted_approaches = []
        for approach in approaches:
            if isinstance(approach, dict):
                for key, val in approach.items():
                    if isinstance(val, str) and val.strip():
                        formatted_approaches.append(
                            {
                                "label": TherapistProcessor.clean_text(key),
                                "text": TherapistProcessor.clean_text(val),
                            }
                        )
            elif isinstance(approach, str):
                text = TherapistProcessor.clean_text(approach)
                if text:
                    formatted_approaches.append({"label": "", "text": text})

        # Transform specialities into {"name", "description"} objects, same reasoning.
        formatted_specialities = []
        for speciality in specialities:
            if isinstance(speciality, dict):
                name = TherapistProcessor.clean_text(speciality.get("name", ""))
                description = TherapistProcessor.clean_text(
                    speciality.get("description", "")
                )
                if name or description:
                    formatted_specialities.append(
                        {"name": name, "description": description}
                    )
            elif isinstance(speciality, str):
                name = TherapistProcessor.clean_text(speciality)
                if name:
                    formatted_specialities.append({"name": name, "description": ""})

        # Summaries for whole-profile embedding text (all-MiniLM-L6-v2 has a 256-token
        # limit, so EmbeddingService chunks/pools anything longer rather than truncating here).
        approach_summary = TherapistProcessor.summarize_approaches(formatted_approaches)
        specialties_summary = TherapistProcessor.summarize_specialities(
            formatted_specialities
        )

        rate_min, rate_max = TherapistProcessor.parse_rate(raw_data.get("rate"))

        processed = {
            "url": raw_data.get("url", ""),
            "name": TherapistProcessor.clean_text(raw_data.get("name", "")),
            "full_name": TherapistProcessor.clean_text(raw_data.get("full_name", "")),
            "pronouns": TherapistProcessor.clean_text(raw_data.get("pronouns", "")),
            "title": TherapistProcessor.clean_text(raw_data.get("title", "")),
            "credentials": TherapistProcessor.clean_text(
                raw_data.get("credentials", "")
            ),
            "status": TherapistProcessor.clean_text(raw_data.get("status", "")),
            "intro": TherapistProcessor.clean_text(raw_data.get("intro", "")),
            "rate_min": rate_min,
            "rate_max": rate_max,
            "free_consultation": bool(raw_data.get("free_consultation", False)),
            "practicing_since": TherapistProcessor.parse_practicing_since(
                raw_data.get("practicing_since")
            ),
            "services": TherapistProcessor.clean_list(raw_data.get("services", [])),
            "insurance": TherapistProcessor.clean_insurance_list(
                raw_data.get("insurance", [])
            ),
            "ideal_client": TherapistProcessor.clean_text(
                raw_data.get("ideal_client", "")
            ),
            "approaches": formatted_approaches,
            "specialities": formatted_specialities,
            "approach_summary": approach_summary,  # String summary for embedding
            "specialties_summary": specialties_summary,  # String summary for embedding
            "other_techniques": TherapistProcessor.clean_list(
                raw_data.get("other_techniques", [])
            ),
            "other_issues": TherapistProcessor.clean_list(
                raw_data.get("other_issues", [])
            ),
            "image": raw_data.get("image", ""),
            "telehealth": bool(raw_data.get("telehealth", False)),
            "in_person": bool(raw_data.get("in_person", False)),
        }
        return processed
