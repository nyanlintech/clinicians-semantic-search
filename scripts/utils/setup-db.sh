#!/bin/bash
echo "Setting up database..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

cd "$PROJECT_ROOT/backend"
source .venv/bin/activate

if [ "$1" = "dev" ]; then
    echo "Setting up development database..."
    export ENVIRONMENT=local
    python -c "from app.db.init_db import init_db; init_db()"
    echo "✅ Development database setup complete!"
    
elif [ "$1" = "prod" ]; then
    echo "Setting up production database..."
    export ENVIRONMENT=production
    python -c "from app.db.init_db import init_db; init_db()"
    echo "✅ Production database setup complete!"
    
else
    echo "❌ Usage: ./scripts/utils/setup-db.sh [dev|prod]"
    exit 1
fi