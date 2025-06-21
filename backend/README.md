# Therapist Search Backend

A FastAPI-based backend for semantic search of therapist profiles using embeddings and PostgreSQL with pgvector.

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- PostgreSQL with pgvector extension
- Virtual environment (recommended)

### 1. Environment Setup

Create a `.env` file in the backend directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASS=your_password
DB_NAME=therapists

# Environment
ENVIRONMENT=local
```

### 2. Install Dependencies

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .
```

### 3. Database Setup

#### Option A: Using PostgreSQL with pgvector

```bash
# Install pgvector extension (if not already installed)
psql -U your_username -d therapists -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Run database initialization
python -c "from app.db.init_db import init_db; init_db()"
```

#### Option B: Using Alembic for migrations

```bash
# Run migrations
alembic upgrade head
```

### 4. Start the Server

```bash
# Development server with auto-reload
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## 📊 Data Management

### Load Sample Data

```bash
# Load therapists from JSON file
python -m app.scripts.load_therapists path/to/therapists.json

# Seed test data
python -c "from app.tests.seed_data import seed_test_data; seed_test_data()"
```

### Clean Encoding Issues

If you see garbled characters (like `âDR.SANJAY KUMARâ`), run the encoding cleanup:

```bash
python -m app.scripts.clean_encoding
```

### Scrape and Load Data

```bash
# Step 1: Scrape data (saves to providers.json in backend root)
python -m app.scraper.scraper

# Step 2: Move data to proper location
mv providers.json data/providers.json

# Step 3: Load data into database
python -m app.scripts.load_therapists
```

The scraper will:
- Collect therapist profiles from Portland Therapy Center
- Save data to `providers.json` (in backend root)
- You need to move it to `data/providers.json`
- The loader script processes and stores in database with embeddings

## 🔧 Development Scripts

### Test Search Functionality

```bash
# Test vector search
python -m app.scripts.test_vector_search

# Test multi-criteria search
python -m app.scripts.test_multi_criteria

# Test API endpoints
python -m app.tests.test_search
```

### Database Operations

```bash
# Initialize database tables
python -c "from app.db.init_db import init_db; init_db()"

# Reset database (drop and recreate tables)
python -c "from app.db.init_db import init_db; from app.db.session import engine; from app.db.base import Base; Base.metadata.drop_all(engine); init_db()"
```

### Embedding Management

```bash
# Generate embeddings for existing therapists
python -c "from app.services.search import SearchService; from app.db.session import SessionLocal; from app.models.therapist import Therapist; db = SessionLocal(); search_service = SearchService(); [search_service.update_therapist_embedding(db, t) for t in db.query(Therapist).all()]; db.commit(); db.close()"
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Check if the server is running

### Search
- `POST /api/v1/search` - Search for therapists
  ```json
  {
    "criteria": ["anxiety specialist", "speaks Spanish"],
    "limit": 10,
    "insurance": ["Kaiser"],
    "titles": ["LCSW"]
  }
  ```

### Filters
- `GET /api/v1/filters` - Get available insurance providers and titles

## 🗄️ Database Schema

### Therapist Table
- `id` - Primary key
- `name` - Therapist name
- `title` - Professional title
- `credentials` - Professional credentials
- `intro` - Introduction text
- `approaches` - Therapeutic approaches (JSONB array)
- `specialities` - Specialties (JSONB array)
- `services` - Services offered (string array)
- `insurance` - Accepted insurance (string array)
- `embedding` - Vector embedding for semantic search

## 🔍 Search Features

### Multi-Criteria Search
The search supports multiple criteria that are combined with "AND" logic:
- "anxiety specialist AND speaks Spanish"
- "trauma therapist AND EMDR therapy"

### Semantic Similarity
Uses sentence transformers (`all-MiniLM-L6-v2`) to find semantically similar therapists based on:
- Professional descriptions
- Therapeutic approaches
- Specialties and services
- Client descriptions

### Filtering
- Insurance providers
- Professional titles
- Rate ranges
- Languages spoken

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `.env` file configuration
   - Ensure PostgreSQL is running
   - Verify pgvector extension is installed

2. **Encoding Issues**
   - Run `python -m app.scripts.clean_encoding`
   - Check if data was scraped with old version

3. **Search Not Working**
   - Verify embeddings exist: `SELECT COUNT(*) FROM therapists WHERE embedding IS NOT NULL;`
   - Regenerate embeddings if needed

4. **Scraper Issues**
   - Check Chrome/ChromeDriver installation
   - Verify website accessibility
   - Check for rate limiting

### Logs and Debugging

```bash
# Enable debug logging
export LOG_LEVEL=DEBUG

# Check database content
psql -U your_username -d therapists -c "SELECT name, title FROM therapists LIMIT 5;"

# Check embeddings
psql -U your_username -d therapists -c "SELECT name, array_length(embedding, 1) as embedding_size FROM therapists WHERE embedding IS NOT NULL LIMIT 5;"
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/           # API routes and endpoints
│   ├── core/          # Configuration and settings
│   ├── db/            # Database models and session
│   ├── models/        # SQLAlchemy models
│   ├── services/      # Business logic (search, embedding, etc.)
│   ├── scraper/       # Web scraping functionality
│   └── scripts/       # Utility scripts
├── alembic/           # Database migrations
├── data/              # Scraped data storage
│   ├── providers.json              # Main scraped data
│   ├── example-provider.json       # Sample data format
│   └── original-providers-scrape.json  # Backup
├── .env               # Environment variables
└── pyproject.toml     # Dependencies and project config
```

## 🔄 Common Workflows

### Fresh Setup
```bash
# 1. Set up environment
cp .env.example .env  # Edit with your database details

# 2. Install dependencies
pip install -e .

# 3. Initialize database
python -c "from app.db.init_db import init_db; init_db()"

# 4. Scrape data
python -m app.scraper.scraper

# 5. Move data to proper location
mv providers.json data/providers.json

# 6. Load data into database
python -m app.scripts.load_therapists

# 7. Start server
uvicorn app.main:app --reload
```

### Update Existing Data
```bash
# 1. Clean encoding issues
python -m app.scripts.clean_encoding

# 2. Regenerate embeddings
python -c "from app.services.search import SearchService; from app.db.session import SessionLocal; from app.models.therapist import Therapist; db = SessionLocal(); search_service = SearchService(); [search_service.update_therapist_embedding(db, t) for t in db.query(Therapist).all()]; db.commit(); db.close()"

# 3. Restart server
uvicorn app.main:app --reload
```

## 📝 Notes

- The scraper saves data to `providers.json` before processing
- Embeddings are generated automatically during data ingestion
- Search results are cached for performance
- The API supports CORS for frontend integration

For more information, check the individual script files or API documentation at `http://localhost:8000/docs` when the server is running. 