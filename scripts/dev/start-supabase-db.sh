#!/bin/bash
echo "☁️ Starting backend with SUPABASE database..."

cd backend
export ENVIRONMENT=production
uvicorn app.main:app --reload