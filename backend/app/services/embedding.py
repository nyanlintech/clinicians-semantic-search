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
        """Generate embedding for a therapist's profile."""
        # Combine relevant fields for embedding
        combined_text = " ".join(filter(None, [
            therapist_data.get('intro', ''),
            therapist_data.get('ideal_client', ''),
            therapist_data.get('approach_summary', ''),
            therapist_data.get('specialties_summary', ''),
            " ".join(therapist_data.get('services', [])),
            " ".join(therapist_data.get('other_techniques', []))
        ]))
        
        # Generate embedding
        return self.model.encode(combined_text).tolist()