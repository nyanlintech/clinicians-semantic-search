from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def embed_text(text: str) -> list[float]:
    """
    Generate an embedding vector from input text.
    
    Args:
        text (str): Text to embed.
    
    Returns:
        List[float]: Embedding vector.
    """
    return model.encode(text).tolist()
