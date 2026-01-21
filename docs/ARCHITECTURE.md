# System Architecture

## 🏗️ High-Level Overview

This is a full-stack application for semantic search of therapist profiles. The system uses embeddings to enable natural language queries for finding therapists.

```
┌─────────────────┐
│  React Frontend │
│   (TypeScript)  │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────────┐         ┌──────────────────┐
│   FastAPI Backend   │◄───────►│   PostgreSQL     │
│   (Python)          │ SQL     │   + pgvector     │
└─────────────────────┘         └──────────────────┘
         │
         ├─► Embeddings Service
         ├─► Search Service
         ├─► Data Ingestion
         └─► Scheduler
```

## 📦 Backend Architecture

### Directory Structure
```
backend/app/
├── api/              # HTTP endpoints
│   └── routes/       # Endpoint definitions
├── core/             # Core utilities
│   ├── config.py     # Configuration
│   └── embedding.py  # Embedding generation
├── crud/             # Database operations
├── db/               # Database setup
├── models/           # SQLAlchemy ORM models
├── schemas/          # Pydantic request/response schemas
├── services/         # Business logic
│   ├── embedding.py  # Embedding service
│   ├── search.py     # Search service
│   ├── ingestion.py  # Data ingestion
│   └── scheduler.py  # Background jobs
├── scraper/          # Data scraping
├── scripts/          # Utility scripts
└── main.py           # FastAPI app initialization
```

### Key Components

#### 1. **Database Layer** (`db/`)
- Connection management via SQLAlchemy
- Alembic migrations
- PostgreSQL with pgvector support

#### 2. **Data Models** (`models/`)
- `Therapist` - Core therapist profile
- Vector embeddings storage
- Relationship definitions

#### 3. **API Layer** (`api/routes/`)
- RESTful endpoints
- Request validation via Pydantic schemas
- Error handling

#### 4. **Services** (`services/`)
- **embedding.py** - Generate embeddings for queries and therapists
- **search.py** - Vector similarity search logic
- **ingestion.py** - Data processing and loading
- **scheduler.py** - Background job scheduling

#### 5. **Data Processing** (`scraper/`)
- Web scraping for therapist data
- Data cleaning and normalization
- Encoding issue fixing

## 🎨 Frontend Architecture

### Directory Structure
```
frontend/src/
├── components/      # React components
│   ├── SearchInterface.tsx
│   ├── DynamicFilters.tsx
│   └── TherapistCard.tsx
├── pages/           # Page components
│   └── Home.tsx
├── services/        # API integration
│   └── api.ts
├── types/           # TypeScript types
│   └── therapist.ts
├── api/             # API client functions
├── lib/             # Utilities
└── theme.ts         # Theming
```

### Key Components

- **SearchInterface** - Main search input and controls
- **DynamicFilters** - Multi-criteria filtering
- **TherapistCard** - Individual therapist display
- **api.ts** - Backend API communication

## 🔄 Data Flow

### Search Query Flow
```
1. User enters search query in Frontend
2. Frontend sends POST request to /api/v1/search
3. Backend embedding service:
   - Converts query to embedding
   - Searches pgvector database
   - Ranks results by similarity
4. Backend returns matching therapists
5. Frontend displays results
```

### Data Ingestion Flow
```
1. Scraper fetches therapist data
2. Data cleaning and normalization
3. Therapist records stored in PostgreSQL
4. Embedding service generates vectors
5. Vectors stored in pgvector
6. Data ready for search
```

## 🔐 Security Considerations

- **Environment Variables** - Sensitive config in `.env` (not committed)
- **Database Access** - Credentials in `.env` file
- **API Validation** - Pydantic schemas validate all inputs
- **CORS** - Configure for frontend domain

## 🚀 Scalability

### Current Architecture Handles:
- Thousands of therapist profiles
- Concurrent search requests
- Vector similarity at scale (pgvector)

### Future Improvements:
- Caching layer (Redis)
- Rate limiting
- Load balancing
- Database replication
- CDN for frontend assets

## 🔄 Deployment Architecture

### Backend Deployment
- FastAPI on container/VM
- PostgreSQL hosted database
- Environment configuration via `.env`
- Optional: Docker containerization

### Frontend Deployment
- Static site build (npm run build)
- Served via CDN or static hosting
- Environment configuration via `.env`

## 📡 API Contract

### Key Endpoints

**Search Endpoint**
```
POST /api/v1/search
Body: {
  "query": "therapist specializing in anxiety",
  "criteria": { "location": "New York", "insurance": "UnitedHealth" }
}
Response: [{ id, name, specialty, location, ... }]
```

**Filters Endpoint**
```
GET /api/v1/filters
Response: { specialties: [...], locations: [...], insurances: [...] }
```

**Health Check**
```
GET /health
Response: { status: "ok" }
```

## 🗄️ Database Schema

### Core Tables
- `therapists` - Profile information + embedding vector
- `specialties` - Available specialties
- `locations` - Geographic data
- `insurance_providers` - Insurance information

### Vector Storage
- pgvector extension stores embeddings as `vector(1536)` type
- Indexed for fast similarity search

## 🔧 Configuration

### Environment Variables
```
LOCAL_DB_HOST/PORT/USER/PASS/NAME - Local PostgreSQL
PROD_DB_HOST/PORT/USER/PASS/NAME - Production database
ENVIRONMENT - local|development|production
```

See `.env.example` for complete template.

## 📊 Monitoring & Logging

- Application logs: Standard output
- Database: Monitor connection pool
- Search quality: Track query response times
- Future: Add metrics collection (Prometheus)

---

For more details, see individual README files in [backend/](../backend/) and [frontend/](../frontend/)
