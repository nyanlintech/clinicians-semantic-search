#!/bin/bash
echo "📊 Migrating data..."

cd backend
source .venv/bin/activate

if [ "$1" = "load" ]; then
    echo "Loading therapist data..."
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
    
elif [ "$1" = "load-supabase" ]; then
    echo "Loading therapist data to Supabase..."
    export ENVIRONMENT=production
    python -m app.scripts.load_therapists
    echo "✅ Supabase data loading complete!"
    
else
    echo "❌ Usage: ./scripts/utils/migrate-data.sh [load|clean|test|load-supabase]"
    exit 1
fi