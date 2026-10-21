#!/bin/bash
set -euo pipefail

echo "Building frontend (local sanity check)..."

# Get the project root directory (two levels up from this script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

cd "$PROJECT_ROOT/frontend"
yarn build

echo "✅ Build succeeded: frontend/dist/"
echo ""
echo "This does not deploy anything. Cloudflare Pages is connected to this repo's"
echo "GitHub integration and builds/deploys automatically on push to main:"
echo "   - Root directory: frontend"
echo "   - Build command: yarn build"
echo "   - Output directory: dist"
echo "Manage the connection and VITE_API_URL env var in the Cloudflare Pages dashboard."
