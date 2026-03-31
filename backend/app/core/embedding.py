from typing import TYPE_CHECKING

from app.core.huggingface import enable_fast_hf_transfers

if TYPE_CHECKING:
    from sentence_transformers import SentenceTransformer

model: "SentenceTransformer | None" = None


def get_model() -> "SentenceTransformer":
    global model
    if model is None:
        enable_fast_hf_transfers()
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer("all-MiniLM-L6-v2")
    return model


def embed_text(text: str) -> list[float]:
    """
    Generate an embedding vector from input text.
    
    Args:
        text (str): Text to embed.
    
    Returns:
        List[float]: Embedding vector.
    """
    return get_model().encode(text).tolist()
