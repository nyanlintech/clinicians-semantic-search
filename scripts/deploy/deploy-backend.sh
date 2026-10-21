#!/bin/bash
set -euo pipefail

echo "Deploying backend to Fly.io..."

# Get the project root directory (two levels up from this script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

cd "$PROJECT_ROOT/backend"
fly deploy

echo "✅ Backend deployed."
echo "🔗 https://clinicians-semantic-search.fly.dev"
echo ""
echo "Note: pushing to main also triggers .github/workflows/deploy-backend.yml"
echo "(requires the FLY_API_TOKEN repo secret) — this script is for manual/local deploys."
