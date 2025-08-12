#!/bin/bash
echo "Resetting development database..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

cd "$PROJECT_ROOT/backend"
source .venv/bin/activate

if [ "$1" = "dev" ]; then
    echo "Dropping and recreating development database tables..."
    export ENVIRONMENT=local
    
    # Drop all tables
    echo "Dropping existing tables..."
    python -c "
from app.db.base import Base
from app.db.session import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text('DROP TABLE IF EXISTS therapists CASCADE'))
    conn.commit()
print('✅ Tables dropped successfully')
"
    
    # Recreate tables
    echo "Recreating tables..."
    python -c "from app.db.init_db import init_db; init_db()"
    echo "✅ Development database reset complete!"
    
elif [ "$1" = "prod" ]; then
    echo "⚠️  WARNING: This will reset the PRODUCTION database!"
    echo "Are you sure you want to continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Dropping and recreating production database tables..."
        export ENVIRONMENT=production
        
        # Drop all tables
        echo "Dropping existing tables..."
        python -c "
from app.db.base import Base
from app.db.session import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text('DROP TABLE IF EXISTS therapists CASCADE'))
    conn.commit()
print('✅ Tables dropped successfully')
"
        
        # Recreate tables
        echo "Recreating tables..."
        python -c "from app.db.init_db import init_db; init_db()"
        echo "✅ Production database reset complete!"
    else
        echo "❌ Operation cancelled"
        exit 1
    fi
    
else
    echo "❌ Usage: ./scripts/utils/reset-db.sh [dev|prod]"
    echo "   dev  - Reset development database (local)"
    echo "   prod - Reset production database (requires confirmation)"
    exit 1
fi 