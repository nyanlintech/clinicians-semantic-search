import os


def enable_fast_hf_transfers() -> None:
    """Enable the fastest supported Hugging Face transfer backend."""
    if os.environ.get("HF_XET_HIGH_PERFORMANCE") or os.environ.get("HF_HUB_ENABLE_HF_TRANSFER"):
        return

    try:
        from huggingface_hub import constants
    except Exception:
        os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"
        return

    if hasattr(constants, "HF_XET_HIGH_PERFORMANCE"):
        os.environ["HF_XET_HIGH_PERFORMANCE"] = "1"
    else:
        os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"


def configure_hf_auth(token: str | None) -> str | None:
    """Expose the configured Hugging Face token to downstream libraries."""
    if not token:
        return None

    normalized_token = token.strip()
    if not normalized_token:
        return None

    # Support both the app's config name and the hub's canonical env name.
    os.environ["HF_TOKEN"] = normalized_token
    os.environ["HUGGING_FACE_HUB_TOKEN"] = normalized_token
    return normalized_token
