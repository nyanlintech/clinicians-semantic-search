#!/bin/bash
echo "🗄️ Setting up database..."

cd backend
source .venv/bin/activate

if [ "$1" = "local" ]; then
    echo "Setting up local database..."
    export ENVIRONMENT=local
    python -c "from app.db.init_db import init_db; init_db()"
    echo "✅ Local database setup complete!"
    
elif [ "$1" = "supabase" ]; then
    echo "Setting up Supabase database..."
    export ENVIRONMENT=production
    python -c "from app.db.init_db import init_db; init_db()"
    echo "✅ Supabase database setup complete!"
    
else
    echo "❌ Usage: ./scripts/utils/setup-db.sh [local|supabase]"
    exit 1
fi