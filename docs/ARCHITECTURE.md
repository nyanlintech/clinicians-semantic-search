# System Architecture

## High-Level Overview

Full-stack semantic search app for Portland-area therapists. Natural language query → sentence embedding → pgvector similarity search → ranked results.

```
┌─────────────────┐
│  React Frontend │
│   (TypeScript)  │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────────┐         ┌──────────────────┐
│   FastAPI Backend    │◄───────►│   PostgreSQL     │
│   (Python)           │  SQL    │   + pgvector     │
└─────────────────────┘         └──────────────────┘
```

## Backend

### Directory Structure
```
backend/app/
├── api/
│   ├── deps.py        # shared FastAPI dependencies
│   ├── main.py         # api_router assembly
│   └── routes/
│       └── therapists.py  # /filters, /search
├── core/
│   ├── config.py       # Settings (env-based)
│   └── huggingface.py  # HF model loading config
├── db/
│   ├── base.py          # SQLAlchemy declarative Base
│   ├── session.py       # engine/session setup
│   └── init_db.py       # DB init helper
├── models/
│   └── therapist.py     # Therapist ORM model (SQLAlchemy, not SQLModel)
├── services/
│   ├── embedding.py      # EmbeddingService — wraps sentence-transformers
│   ├── search.py         # SearchService — query parsing + vector search
│   ├── processor.py      # TherapistProcessor — approach/specialty summarization
│   ├── ingestion.py       # load scraped data into DB
│   └── scheduler.py       # background re-embedding / refresh jobs
├── ingestion/            # ingestion entrypoints
├── scraper/               # scraping source data
├── scripts/               # one-off maintenance scripts (encoding fixes, backfills)
├── cli.py                 # CLI entrypoint
├── tests/
└── main.py                 # FastAPI app, lifespan, CORS, router mount
```

Note: despite the CLAUDE.md tech-stack line, the ORM layer here is plain SQLAlchemy (`app/models/therapist.py` uses `sqlalchemy.Column`), not SQLModel. There are no separate `crud/` or `schemas/` packages — route handlers in `api/routes/therapists.py` use SQLAlchemy sessions directly and return `TherapistResponse` models defined inline/in `services/search.py`.

### Data Model (`models/therapist.py`)

Single `therapists` table — structured and free-text fields side by side, embedding stored on the row:

| Field | Type | Notes |
|---|---|---|
| `name`, `full_name`, `pronouns`, `title`, `credentials`, `status` | string | |
| `intro`, `ideal_client` | text | free-text, source for embedding |
| `rate_min`, `rate_max` | int | dollars |
| `services`, `insurance`, `other_techniques`, `other_issues` | `ARRAY(String)` | GIN-indexed, used for structured filtering |
| `specialities` | `JSONB` | list of `{name, description}` — kept structured so it can be filtered or embedded per-field later |
| `approaches` | `JSONB` | list of `{label, text}` |
| `telehealth`, `in_person` | bool | |
| `embedding` | `pgvector` `Vector(384)` | all-MiniLM-L6-v2 output |

Migrations in `backend/alembic/versions/`: baseline schema, then a migration moving `specialities`/`approaches` from flattened arrays to JSONB.

### Search (`services/search.py`, `services/embedding.py`)

Current implementation is **whole-profile embedding** — `EmbeddingService.generate_therapist_embedding` concatenates title, credentials, intro, ideal_client, summarized approaches, summarized specialties, services, techniques, issues, and telehealth/in-person flags into one text blob and embeds it once. Insurance is filtered structurally (`ARRAY.overlap`), not embedded.

Query flow:
1. `parse_criteria_from_query` splits a query on " and " into multiple criteria.
2. Single criterion → embed query, order by `embedding <=> query_embedding` (pgvector cosine distance), drop results below `min_similarity`.
3. Multiple criteria → criteria joined back with " AND " into one combined string, embedded once (not embedded separately per criterion), same vector search applied.
4. Structural filters (`insurance`, `titles`) applied before the vector search via SQL `WHERE`.

**Known limitation (tracked for Phase 3 of the improvement plan):** no section-level embeddings, no hybrid/full-text search, no RRF — single vector per therapist, single vector per query.

### API

Mounted under `settings.API_V1_STR` (see `app/core/config.py`), tag `therapists`:
- `GET /health` — liveness check
- `GET /api/v1/filters` — available filter values
- `POST /api/v1/search` — semantic search, body validated against `TherapistResponse`

FastAPI auto-generates interactive API docs — don't hand-maintain a separate API reference:
- Swagger UI: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

## Frontend

```
frontend/src/
├── components/      # SearchInterface, DynamicFilters, TherapistCard, ...
├── pages/           # Home.tsx
├── api/             # typed API client functions
├── services/        # API integration helpers
├── types/           # therapist.ts, shared TS types
└── theme.ts         # MUI theme (Forest/Clay palette)
```

## Data Ingestion Flow

1. `app/scraper/` fetches therapist profile data.
2. `app/scripts/clean_encoding.py` fixes mojibake from scraping.
3. `app/services/ingestion.py` normalizes and loads rows into `therapists`.
4. `app/services/embedding.py` generates the embedding per row.
5. `app/services/scheduler.py` handles periodic re-embedding/refresh.

## Configuration

Environment variables are read via `app/core/config.py` (`Settings`). See `backend/.env.example` for the full list (DB connection, `API_V1_STR`, `ALLOWED_ORIGINS`, `PRELOAD_SEARCH_MODEL`, etc.) — not duplicated here to avoid drift.
