#!/bin/bash
echo "Migrating data..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

cd "$PROJECT_ROOT/backend"
source .venv/bin/activate

if [ "$1" = "load" ]; then
    echo "Loading therapist data to development database..."
    export ENVIRONMENT=local
    python -m app.scripts.load_therapists
    echo "✅ Data loading complete!"
    
elif [ "$1" = "clean" ]; then
    echo "Cleaning encoding issues..."
    python -m app.scripts.clean_encoding
    echo "✅ Encoding cleanup complete!"
    
elif [ "$1" = "test" ]; then
    echo "Testing search functionality..."
    python -m app.scripts.test_multi_criteria
    echo "✅ Search test complete!"
    
elif [ "$1" = "load-prod" ]; then
    echo "Loading therapist data to production database..."
    export ENVIRONMENT=production
    python -m app.scripts.load_therapists
    echo "✅ Production data loading complete!"
    
elif [ "$1" = "update-fields" ]; then
    echo "Updating existing records with default values for new fields..."
    python -m app.scripts.update_existing_records
    echo "✅ Field update complete!"
    
else
    echo "❌ Usage: ./scripts/utils/migrate-data.sh [load|clean|test|load-prod|update-fields]"
    exit 1
fi