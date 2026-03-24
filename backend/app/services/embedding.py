from sentence_transformers import SentenceTransformer
from typing import List, Dict
import torch

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text, chunking if over the token limit."""
        with torch.no_grad():
            tokens = self.model.tokenize([text])
            token_count = tokens['input_ids'].shape[1]
            if token_count <= 256:
                return self.model.encode(text).tolist()
            # Split into sentences and chunk to stay within 256 tokens
            sentences = [s.strip() for s in text.replace('\n', ' ').split('.') if s.strip()]
            chunks, current, current_tokens = [], [], 0
            for sentence in sentences:
                t = self.model.tokenize([sentence])['input_ids'].shape[1]
                if current_tokens + t > 256 and current:
                    chunks.append('. '.join(current) + '.')
                    current, current_tokens = [], 0
                current.append(sentence)
                current_tokens += t
            if current:
                chunks.append('. '.join(current) + '.')
            embeddings = self.model.encode(chunks)
            return embeddings.mean(axis=0).tolist()
    
    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        with torch.no_grad():
            embeddings = self.model.encode(texts)
        return embeddings.tolist()
    
    def generate_therapist_embedding(self, therapist_data: Dict) -> List[float]:
        """Generate embedding for a processed therapist record."""

        services_text = ", ".join(therapist_data.get('services', [])).strip()
        techniques_text = ", ".join(therapist_data.get('other_techniques', [])).strip()
        issues_text = ", ".join(therapist_data.get('other_issues', [])).strip()

        parts = []

        if title := therapist_data.get('title', '').strip():
            parts.append(f"I am a {title}.")
        if credentials := therapist_data.get('credentials', '').strip():
            parts.append(f"Credentials: {credentials}.")
        if intro := therapist_data.get('intro', '').strip():
            parts.append(intro)
        if ideal_client := therapist_data.get('ideal_client', '').strip():
            parts.append(f"My ideal client is: {ideal_client}.")
        if approach_summary := therapist_data.get('approach_summary', '').strip():
            parts.append(approach_summary)
        if specialties_summary := therapist_data.get('specialties_summary', '').strip():
            parts.append(f"Specialties: {specialties_summary}.")
        if services_text:
            parts.append(f"Services: {services_text}.")
        if techniques_text:
            parts.append(f"Techniques: {techniques_text}.")
        if issues_text:
            parts.append(f"Issues: {issues_text}.")
        if languages := therapist_data.get('languages', '').strip():
            parts.append(f"Languages: {languages}.")
        if therapist_data.get('telehealth') and therapist_data.get('in_person'):
            parts.append("Available via telehealth and in person.")
        elif therapist_data.get('telehealth'):
            parts.append("Available via telehealth.")
        elif therapist_data.get('in_person'):
            parts.append("Available in person.")

        combined_text = " ".join(parts)
        return self.generate_embedding(combined_text)
