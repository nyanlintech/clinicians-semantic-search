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

## Notes

- If Fly says the app name is already taken, update the `app` value in `fly.toml`.
- `ENVIRONMENT=production` is already set in `fly.toml`.
- `ALLOWED_ORIGINS` can be a plain URL or a JSON array string with the current backend config.
- After deploy, test:

```bash
curl https://<your-fly-app>.fly.dev/health
```
