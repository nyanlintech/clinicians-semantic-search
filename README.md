# PDX Therapist Finder

A semantic search application for finding Portland-area mental health therapists using AI-powered natural language queries.

**Live:** https://clinicians-semantic-search.pages.dev/

https://github.com/user-attachments/assets/9997edff-b6f1-4e9c-bc1e-c0f2bdfe9f00

## Motivation

Finding a therapist is hard. Most directories require you to already know what you're looking for — specific modality names, insurance codes, or clinical terms. PDX Therapist Finder lets you describe what you need in plain language ("therapist who works with trauma and accepts sliding scale") and uses semantic embeddings to surface the most relevant matches.

The goal is to lower the friction of finding care for people who don't know the clinical vocabulary, and to help therapists get discovered based on what they actually do rather than just keyword overlap.

## Quick Start

**Prerequisites:** Python 3.11+, Node.js 18+, PostgreSQL 14+ with pgvector, [uv](https://docs.astral.sh/uv/), [yarn](https://yarnpkg.com/)

### Backend

```bash
cd backend
cp .env.example .env        # fill in database credentials
uv sync
uvicorn app.main:app --reload
```

Runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
yarn
yarn dev
```

Runs on `http://localhost:5173`

## Usage

Open `http://localhost:5173` and type a natural language description of what you're looking for:

- *"therapist specializing in anxiety and EMDR"*
- *"bilingual Spanish-speaking therapist accepting Medicaid"*
- *"couples counselor with evening availability"*

Results are ranked by semantic similarity. Use the filters to narrow by insurance, specialty, or location.

**Common commands:**

```bash
# Backend
cd backend
uv run uvicorn app.main:app --reload   # dev server
uv run pytest                          # tests

# Frontend
cd frontend
yarn dev                               # dev server
yarn build                             # production build
yarn lint                              # lint
```

## Contributing

Contributions are welcome. Please open an issue before starting significant work so we can align on approach.

- Follow existing code style (ruff/black for Python, ESLint for TypeScript)
- Add tests for new backend functionality
- Keep PRs focused — one concern per PR

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, MUI v5 |
| Backend | FastAPI, Python 3.11+ |
| Database | PostgreSQL + pgvector |
| Embeddings | Sentence Transformers |

## License

[MIT](LICENSE)
