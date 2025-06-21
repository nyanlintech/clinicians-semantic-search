#!/bin/bash
echo "🚀 Starting full stack with LOCAL database..."

# Start backend in background
cd backend
export ENVIRONMENT=local
uvicorn app.main:app --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Backend (PID: $BACKEND_PID) and Frontend (PID: $FRONTEND_PID) started!"
echo "🌐 Backend: http://localhost:8000"
echo "🎨 Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait