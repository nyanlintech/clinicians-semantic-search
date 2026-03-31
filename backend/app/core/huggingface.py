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
