from typing import Dict, List, Any
import re

class TherapistProcessor:
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text."""
        if not text or not isinstance(text, str):
            return ""
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s.,!?-]', '', text)
        return text.strip()

    @staticmethod
    def clean_list(items: List[str]) -> List[str]:
        """Clean a list of strings."""
        if not items or not isinstance(items, list):
            return []
        return [TherapistProcessor.clean_text(item) for item in items if isinstance(item, str)]

    @staticmethod
    def extract_key_value_pairs_as_strings(items: List[Dict[str, Any]]) -> List[str]:
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
                        combined.append(f"{TherapistProcessor.clean_text(key)}: {TherapistProcessor.clean_text(val)}")
                    elif isinstance(val, list):
                        for sub_val in val:
                            if isinstance(sub_val, str):
                                combined.append(f"{TherapistProcessor.clean_text(key)}: {TherapistProcessor.clean_text(sub_val)}")
        return combined

    @staticmethod
    def process_therapist_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process and clean therapist data."""
        # Process approaches and specialties as arrays of objects
        approaches = raw_data.get('approaches', [])
        specialities = raw_data.get('specialities', [])
        
        # Create summaries for embedding
        approach_summary = " ".join([
            f"{TherapistProcessor.clean_text(key)}: {TherapistProcessor.clean_text(val)}"
            for item in approaches
            for key, val in item.items()
            if isinstance(val, str)
        ]) if approaches else ""
        
        specialties_summary = " ".join([
            f"{TherapistProcessor.clean_text(key)}: {TherapistProcessor.clean_text(val)}"
            for item in specialities
            for key, val in item.items()
            if isinstance(val, str)
        ]) if specialities else ""
        
        processed = {
            'name': TherapistProcessor.clean_text(raw_data.get('name', '')),
            'title': TherapistProcessor.clean_text(raw_data.get('title', '')),
            'credentials': TherapistProcessor.clean_text(raw_data.get('credentials', '')),
            'status': TherapistProcessor.clean_text(raw_data.get('status', '')),
            'intro': TherapistProcessor.clean_text(raw_data.get('intro', '')),
            'rate_min': TherapistProcessor.clean_text(raw_data.get('rate', {}).get('min', '')),
            'rate_max': TherapistProcessor.clean_text(raw_data.get('rate', {}).get('max', '')),
            'free_consultation': raw_data.get('free_consultation', False),
            'practicing_since': TherapistProcessor.clean_text(raw_data.get('practicing_since', '')),
            'languages': TherapistProcessor.clean_text(raw_data.get('languages', '')),
            'services': TherapistProcessor.clean_list(raw_data.get('services', [])),
            'insurance': TherapistProcessor.clean_list(raw_data.get('insurance', [])),
            'ideal_client': TherapistProcessor.clean_text(raw_data.get('ideal_client', '')),
            'approaches': approaches,  # Keep as array of objects
            'specialities': specialities,  # Keep as array of objects
            'approach_summary': approach_summary,  # String summary for embedding
            'specialties_summary': specialties_summary,  # String summary for embedding
            'other_techniques': TherapistProcessor.clean_list(raw_data.get('other_techniques', [])),
            'other_issues': TherapistProcessor.clean_list(raw_data.get('other_issues', [])),
            'url': raw_data.get('url', '')
        }
        return processed
