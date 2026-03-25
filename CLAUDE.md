# clinicians-semantic-search

PDX Therapist Finder — a semantic search application for finding Portland-area therapists.

## Package Manager

Use **yarn** for all frontend dependency management.

```bash
cd frontend
yarn          # install
yarn dev      # dev server
yarn build    # production build
yarn lint     # lint
```

## Project Structure

```
backend/    FastAPI backend with semantic search via embeddings
frontend/   React + TypeScript + Vite + MUI v5 frontend
```

## Frontend Stack

- React 18 + TypeScript
- Vite 5
- Material UI v5 (MUI) with Emotion
- React Query v3
- Google Fonts: Cormorant Garamond (display/serif) + DM Sans (body)
- IBM Plex Mono (technical elements)

## Design System

**Colors:**
- Primary (Forest): `#253D2E`
- Secondary (Clay): `#B5622D`
- Background: `#F5F0E8` (warm parchment)
- Text: `#1A1208`

**Typography:**
- Display/headings: Cormorant Garamond (serif)
- Body/UI: DM Sans (humanist sans)
- Technical/mono: IBM Plex Mono

## Backend Stack

- FastAPI
- PostgreSQL with pgvector
- OpenAI embeddings for semantic search
