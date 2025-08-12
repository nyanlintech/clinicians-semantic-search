#!/bin/bash
echo "Deploying frontend..."

# Get the project root directory (two levels up from this script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

cd "$PROJECT_ROOT/frontend"
npm run build

echo "✅ Frontend build complete!"
echo "📁 Build files in: frontend/dist/"
echo "🚀 Deploy to GitHub Pages or Vercel"