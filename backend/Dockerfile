# ── Stage 1: builder ──────────────────────────────────────────
FROM python:3.11-slim AS builder

# Copy uv binary from official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Install dependencies first (layer-cached separately from code)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# ── Stage 2: runtime ───────────────────────────────────────────
FROM python:3.11-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy installed virtualenv from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application code
COPY . .

# Pre-download the model into the image so it doesn't download on cold start.
# SENTENCE_TRANSFORMERS_HOME controls the cache location.
ENV SENTENCE_TRANSFORMERS_HOME=/app/.model_cache
RUN uv run python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

EXPOSE 8000

# Single worker — loading the model once per process.
# Multiple workers would duplicate ~500MB RAM each.
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
