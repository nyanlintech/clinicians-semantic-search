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
# Then initialize database
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

## 📡 API Endpoints

- **Health**: `GET http://localhost:8000/health`
- **Filters**: `GET http://localhost:8000/api/v1/filters`
- **Search**: `POST http://localhost:8000/api/v1/search`

## 🗄️ Database Commands

```bash
# Check if data exists
psql -U $LOCAL_DB_USER -d $LOCAL_DB_NAME -c "SELECT COUNT(*) FROM therapists;"

# Check for encoding issues
psql -U $LOCAL_DB_USER -d $LOCAL_DB_NAME -c "SELECT name FROM therapists WHERE name LIKE '%â%' LIMIT 5;"

# Check embeddings
psql -U $LOCAL_DB_USER -d $LOCAL_DB_NAME -c "SELECT COUNT(*) FROM therapists WHERE embedding IS NOT NULL;"
```

## 📝 .env Template

```bash
ENVIRONMENT=local
LOCAL_DB_HOST=localhost
LOCAL_DB_PORT=5432
LOCAL_DB_USER=your_db_user
LOCAL_DB_PASS=your_db_password
LOCAL_DB_NAME=therapists
```

---

**Full documentation**: See `README.md` for detailed instructions. 