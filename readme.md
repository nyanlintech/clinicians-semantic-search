# Clinicians Semantic Search

A full-stack web application for semantic search of mental health therapists using AI embeddings. This project combines FastAPI backend with semantic search capabilities and a modern React frontend for therapist discovery and filtering.

## 🎯 Features

- **Semantic Search** - Find therapists using natural language queries powered by embeddings
- **Multi-Criteria Filtering** - Filter by specialties, location, insurance, and more
- **Vector Database** - PostgreSQL with pgvector for efficient similarity search
- **Modern UI** - React + TypeScript frontend with Vite
- **RESTful API** - FastAPI backend with comprehensive endpoints
- **Auto-Updating** - Scheduled data ingestion and embedding updates

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Contributing](#contributing)

## 📁 Project Structure

```
clinicians-semantic-search/
├── backend/              # FastAPI backend
│   ├── app/             # Application code
│   ├── data/            # Data files (not committed)
│   ├── README.md        # Backend documentation
│   └── pyproject.toml   # Python dependencies
├── frontend/            # React + TypeScript frontend
│   ├── src/             # Source code
│   ├── README.md        # Frontend documentation
│   └── package.json     # Node dependencies
├── scripts/             # Development and deployment scripts
├── docs/                # Project documentation
└── README.md            # This file
```

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL with pgvector
- **Embeddings:** OpenAI or similar
- **ORM:** SQLAlchemy
- **Language:** Python 3.10+

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** CSS

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ with pgvector extension
- Git

## 🚀 Quick Start

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Copy environment template
cp .env.example .env
# Edit .env with your database credentials

# Install dependencies
pip install -e .

# Initialize database
python -c "from app.db.init_db import init_db; init_db()"

# Start development server
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Full Setup with Scripts

See [QUICK_START.md](docs/QUICK_START.md) for detailed setup instructions and available scripts.

## 📚 Documentation

- **[Backend README](backend/README.md)** - Backend setup and API documentation
- **[Frontend README](frontend/README.md)** - Frontend setup and component guide
- **[Quick Start Guide](docs/QUICK_START.md)** - Development scripts and commands
- **[Architecture](docs/ARCHITECTURE.md)** - System design and data flow
- **[API Reference](docs/API.md)** - Detailed API endpoints

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Code style and conventions
- Testing requirements
- Commit message format
- Pull request process

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🔧 Common Commands

```bash
# Backend
cd backend && source .venv/bin/activate
uvicorn app.main:app --reload      # Start dev server
pytest                              # Run tests
python -m app.scripts.test_search   # Test search functionality

# Frontend
cd frontend
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run lint                        # Run linter
```

## 🐛 Troubleshooting

For common issues and solutions, see [QUICK_START.md](docs/QUICK_START.md).

## 📧 Questions?

Feel free to open an issue on GitHub or check the documentation folders.
