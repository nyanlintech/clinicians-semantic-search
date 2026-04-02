# Clinicians Semantic Search

A full-stack web application for semantic search of mental health therapists using AI embeddings. This project combines FastAPI backend with semantic search capabilities and a modern React frontend for therapist discovery and filtering.

## Live Demo

- **Deployed app:** https://clinicians-semantic-search.pages.dev/

https://github.com/user-attachments/assets/9997edff-b6f1-4e9c-bc1e-c0f2bdfe9f00

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
- **Embeddings:** Sentence Transformers (all-MiniLM-L6-v2)
- **ORM:** SQLAlchemy
- **Language:** Python 3.10+

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Material UI v5 (MUI) with Emotion

## 📋 Prerequisites

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Node.js 18+ with [yarn](https://yarnpkg.com/)
- PostgreSQL 14+ with pgvector extension
- Git

## 🚀 Quick Start

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Copy environment template
cp .env.example .env
# Edit .env with your database credentials

# Install dependencies (uses uv — install from https://docs.astral.sh/uv/)
uv sync

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
yarn

# Start development server
yarn dev
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
cd backend
uv run uvicorn app.main:app --reload  # Start dev server
uv run pytest                         # Run tests
uv run python -m app.scripts.test_search  # Test search functionality

# Frontend
cd frontend
yarn dev                            # Start dev server
yarn build                          # Build for production
yarn lint                           # Run linter
```

## 🐛 Troubleshooting

For common issues and solutions, see [QUICK_START.md](docs/QUICK_START.md).

## 📧 Questions?

Feel free to open an issue on GitHub or check the documentation folders.
