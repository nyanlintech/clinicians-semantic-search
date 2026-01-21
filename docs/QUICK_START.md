# Quick Start Reference

## 🚀 Essential Commands

### Start the Server
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

### Database Setup
```bash
# Create .env file with your database details
cp .env.example .env
# Edit .env with your credentials

# Initialize database
python -c "from app.db.init_db import init_db; init_db()"
```

### Fix Encoding Issues
```bash
python -m app.scripts.clean_encoding
```

### Scrape New Data
```bash
python -m app.scraper.scraper
```

### Test Search
```bash
python -m app.scripts.test_multi_criteria
```

## 🔧 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `net::ERR_CONNECTION_REFUSED` | Start backend server |
| `500: Either 'query' or 'criteria' must be provided` | Fill in search criteria |
| Garbled characters (âDR.SANJAYâ) | Run `python -m app.scripts.clean_encoding` |
| Database connection error | Check `.env` file and PostgreSQL |
| ModuleNotFoundError | Ensure virtual environment is activated and dependencies installed |

## 📡 API Endpoints

- **Health**: `GET http://localhost:8000/health`
- **Filters**: `GET http://localhost:8000/api/v1/filters`
- **Search**: `POST http://localhost:8000/api/v1/search`

## 🗄️ Database Commands

```bash
# Check if data exists
psql -U your_username -d therapists -c "SELECT COUNT(*) FROM therapists;"

# Check for encoding issues
psql -U your_username -d therapists -c "SELECT name FROM therapists WHERE name LIKE '%â%' LIMIT 5;"

# Check embeddings
psql -U your_username -d therapists -c "SELECT COUNT(*) FROM therapists WHERE embedding IS NOT NULL;"
```

## 📝 Available Scripts

Located in `scripts/` directory:

### Development Scripts (`scripts/dev/`)
- `start-dev-db.sh` - Start development database
- `start-frontend.sh` - Start frontend dev server
- `start-all-local.sh` - Start everything locally

### Database Scripts (`scripts/utils/`)
- `setup-db.sh` - Initialize database
- `migrate-data.sh` - Load or clean therapist data
- `reset-db.sh` - Reset database to clean state
- `check-status.sh` - Check system status

### Deployment Scripts (`scripts/deploy/`)
- `deploy-backend.sh` - Deploy backend
- `deploy-frontend.sh` - Deploy frontend

## 🔄 Development Workflow

### 1. First Time Setup
```bash
# Backend
cd backend
python -m venv .venv
source .venv/bin/activate
cp .env.example .env
# Edit .env with your database details
pip install -e .
python -c "from app.db.init_db import init_db; init_db()"

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### 2. Daily Development
```bash
# Terminal 1 - Backend
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3. Running Tests
```bash
# Backend tests
cd backend
source .venv/bin/activate
pytest

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

See individual deployment scripts for detailed deployment instructions:
- [Backend Deployment](../scripts/deploy/deploy-backend.sh)
- [Frontend Deployment](../scripts/deploy/deploy-frontend.sh)

---

**Need more help?** Check [Backend README](../backend/README.md) or [Frontend README](../frontend/README.md)
