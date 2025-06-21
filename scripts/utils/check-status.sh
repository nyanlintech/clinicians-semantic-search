#!/bin/bash
echo "🔍 Checking system status..."

echo "1️⃣ Checking backend..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running"
fi

echo ""
echo "2️⃣ Checking frontend..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not running"
fi

echo ""
echo "3️⃣ Checking database connection..."
cd backend
source .venv/bin/activate
python -c "
import os
from app.db.session import SessionLocal
try:
    db = SessionLocal()
    result = db.execute('SELECT 1').scalar()
    print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
finally:
    db.close()
"