from sentence_transformers import SentenceTransformer
from typing import List, Dict
import torch

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        with torch.no_grad():
            embedding = self.model.encode(text)
        return embedding.tolist()
    
    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        with torch.no_grad():
            embeddings = self.model.encode(texts)
        return embeddings.tolist()
    
    def generate_therapist_embedding(self, therapist_data: Dict) -> List[float]:
        """Generate embedding for therapist with raw approaches and specialties text."""
        
        approach_text = " ".join(therapist_data.get('approaches', [])).strip()
        specialties_text = " ".join(therapist_data.get('specialties', [])).strip()
        services_text = ", ".join(therapist_data.get('services', [])).strip()
        techniques_text = ", ".join(therapist_data.get('other_techniques', [])).strip()
        issues_text = ", ".join(therapist_data.get('other_issues', [])).strip()

        parts = []

        if title := therapist_data.get('title', '').strip():
            parts.append(f"I am a {title}.")
        if credentials := therapist_data.get('credentials', '').strip():
            parts.append(f"Credentials: {credentials}.")
        if ideal_client := therapist_data.get('ideal_client', '').strip():
            parts.append(f"My ideal client is: {ideal_client}.")
        if approach_text:
            parts.append(approach_text)
        if specialties_text:
            parts.append(specialties_text)
        if services_text:
            parts.append(f"I provide services such as: {services_text}.")
        if techniques_text:
            parts.append(f"My techniques include: {techniques_text}.")
        if issues_text:
            parts.append(f"I help with issues like: {issues_text}.")
        if status := therapist_data.get('status', '').strip():
            parts.append(f"Status: {status}.")
        if location := therapist_data.get('location', '').strip():
            parts.append(f"Location: {location}.")

        combined_text = " ".join(parts)

        with torch.no_grad():
            return self.model.encode(combined_text).tolist()
