# clinicians-semantic-search

PDX Therapist Finder — semantic search app for Portland-area mental health therapists. Users describe needs in plain language; sentence embeddings rank results by similarity.

## Structure

```
backend/    FastAPI + SQLModel + pgvector; app/ has api/, core/, crud/, models/, schemas/, services/
frontend/   React 18 + TypeScript + Vite; src/ has api/, components/, pages/, services/, types/
scripts/    data ingestion / scraping utilities
docs/       project docs
compose.yml Docker Compose for local infra
```

## Commands

**Backend** (uses `uv`, Python 3.10+):
```bash
cd backend
uv sync                                  # install deps
uv run uvicorn app.main:app --reload     # dev server (localhost:8000)
uv run pytest                            # tests
uv run ruff check .                      # lint
uv run ruff format .                     # format
```

**Frontend** (uses `yarn`):
```bash
cd frontend
yarn                  # install
yarn dev              # dev server (localhost:5173)
yarn build            # production build
yarn lint             # ESLint (max-warnings 0)
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite 5, MUI v5 + Emotion, React Query v3, react-router-dom v7
- **Backend:** FastAPI, SQLModel, Pydantic v2, Alembic, psycopg3
- **DB:** PostgreSQL + pgvector
- **Embeddings:** Sentence Transformers `all-MiniLM-L6-v2` (local, no external API)

## Code Style

- Python: ruff (E/W/F/I/B/C4/UP, target py310); mypy strict
- TypeScript: ESLint with `@typescript-eslint`, `eslint-plugin-react-hooks`
- No `Co-Authored-By` trailers in commits

## Design System

- Primary (Forest): `#253D2E` | Secondary (Clay): `#B5622D`
- Background: `#F5F0E8` | Text: `#1A1208`
- Display font: Cormorant Garamond | Body: DM Sans | Mono: IBM Plex Mono

## Exit Checklist

- `uv run pytest` passes
- `yarn lint` passes (0 warnings)
- `uv run ruff check .` clean
