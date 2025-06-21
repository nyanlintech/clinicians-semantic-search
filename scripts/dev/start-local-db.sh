echo "🚀 Starting backend with LOCAL database..."

cd backend
source .venv/bin/activate
uvicorn app.main:app --reload