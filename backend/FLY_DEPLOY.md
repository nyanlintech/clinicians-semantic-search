# Fly.io Backend Deploy

This backend already has a Docker-based deploy path, so Fly can use the existing `Dockerfile`.

## Recommended Starting Size

Start with a `shared-cpu-1x` machine and `2gb` memory. The search endpoint loads a local sentence-transformer model, which is likely too heavy for 512 MB instances.

## Files

- `fly.toml` config: `backend/fly.toml`
- Docker image build: `backend/Dockerfile`

## Deploy Steps

From `backend/`:

```bash
fly launch --no-deploy
fly secrets set \
  DATABASE_URL="postgresql://..." \
  ALLOWED_ORIGINS="https://clinicians-semantic-search.pages.dev"
fly deploy
```

After deploy, keep the app simple and stable while warming the model:

```bash
fly scale count 1
```

## Notes

- If Fly says the app name is already taken, update the `app` value in `fly.toml`.
- `ENVIRONMENT=production` is set in `fly.toml`.
- Fly now runs a release command before each deploy to enable `pgvector` and create tables:

```bash
/app/.venv/bin/python -c "from app.db.init_db import init_db; init_db()"
```

- Health checks target `GET /health`, which makes boot failures easier to diagnose than the default root check.
- `PRELOAD_SEARCH_MODEL=true` is set in `fly.toml`, so the app now warms the sentence-transformer in the background right after boot instead of making the first real search request pay that cost.
- Health checks are intentionally a little slower and more forgiving because model warmup can still be running just after boot.
- `ALLOWED_ORIGINS` can be a plain URL or a JSON array string with the current backend config.
- `DATABASE_URL` is required on Fly unless you also set all `PROD_DB_*` values.
- If the first deploy is slow because the image includes `torch` and `sentence-transformers`, the Fly config now allows a longer deploy wait before timing out.
- After deploy, test:

```bash
curl https://<your-fly-app>.fly.dev/health
```
