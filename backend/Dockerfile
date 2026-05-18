# ── Stage 1: builder ──────────────────────────────────────────
FROM python:3.11-slim AS builder

# Copy uv binary from official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

ENV SENTENCE_TRANSFORMERS_HOME=/app/.model_cache
ENV HF_XET_HIGH_PERFORMANCE=1
ENV HF_HUB_ENABLE_HF_TRANSFER=1

# Install dependencies first (layer-cached separately from code)
COPY pyproject.toml uv.lock ./
# Install only production API dependencies. Scraper/scheduler tooling lives in
# the optional "ingestion" extra and stays out of the Fly runtime image.
RUN uv sync --frozen --no-dev --no-install-project

# Bake the embedding model into the image so Fly does not need to download it
# during runtime startup.
RUN uv run python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# ── Stage 2: runtime ───────────────────────────────────────────
FROM python:3.11-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy installed virtualenv from builder
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/.model_cache /app/.model_cache

# Copy application code
COPY . .

ENV SENTENCE_TRANSFORMERS_HOME=/app/.model_cache
ENV HF_HUB_OFFLINE=1
ENV TRANSFORMERS_OFFLINE=1

EXPOSE 8000

# Single worker — loading the model once per process.
# Multiple workers would duplicate ~500MB RAM each.
CMD ["sh", "-c", "/app/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
