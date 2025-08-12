#!/bin/bash
echo ""
echo "----------------------------------------------"
echo ""
echo "Starting backend with PRODUCTION database..."
echo ""
echo "----------------------------------------------"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

cd "$PROJECT_ROOT/backend"
export ENVIRONMENT=production

source .venv/bin/activate
uvicorn app.main:app --reload