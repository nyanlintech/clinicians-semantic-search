# Contributing to Clinicians Semantic Search

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 📋 Code of Conduct

Be respectful and professional. We aim to maintain a welcoming and inclusive community.

## 🚀 Getting Started

### 1. Fork & Clone
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/clinicians-semantic-search.git
cd clinicians-semantic-search
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b bugfix/issue-description
```

### 3. Set Up Development Environment

Follow the setup instructions in [README.md](README.md) and [Quick Start Guide](docs/QUICK_START.md).

## 💻 Development Guidelines

### Backend (Python)

#### Code Style
- Follow PEP 8 guidelines
- Use type hints for all functions
- Maximum line length: 100 characters
- Use meaningful variable names

#### Structure
```python
# Imports
from typing import List
from fastapi import APIRouter

# Constants
DEFAULT_TIMEOUT = 30

# Classes/Functions
class MyClass:
    """Class docstring."""
    pass

def my_function(param: str) -> str:
    """Function docstring."""
    pass
```

#### Testing
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_search.py

# Run with coverage
pytest --cov=app tests/
```

#### Linting
```bash
# Install dev dependencies
pip install black flake8 mypy

# Format code
black app/

# Check linting
flake8 app/
mypy app/
```

### Frontend (React/TypeScript)

#### Code Style
- Use functional components
- Use hooks for state management
- Meaningful component and variable names
- Self-documenting code

#### Structure
```typescript
// Imports
import React, { useState } from 'react';

// Types
interface Props {
  title: string;
  onSubmit?: (data: string) => void;
}

// Component
const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  const [state, setState] = useState('');
  
  return <div>{title}</div>;
};

export default MyComponent;
```

#### Linting
```bash
# Run ESLint
npm run lint

# Format with prettier (if configured)
npm run format
```

#### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 🔄 Git Workflow

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add semantic search functionality
fix: Resolve database connection timeout
docs: Update API documentation
refactor: Simplify embedding service
test: Add search endpoint tests
chore: Update dependencies
```

Prefix convention:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Before Pushing

```bash
# Ensure code is properly formatted
black app/  # Backend

# Run linting
flake8 app/
npm run lint  # Frontend

# Run tests
pytest
npm test  # Frontend

# Update if needed
git pull origin main
```

## 📝 Pull Request Process

### 1. Create PR
- Push your feature branch
- Create a pull request on GitHub
- Fill in the PR template completely

### 2. PR Description Should Include
- **Description**: What does this PR do?
- **Type**: Bug fix, feature, documentation, etc.
- **Testing**: How was this tested?
- **Related Issues**: Closes #123
- **Checklist**:
  - [ ] Code follows style guidelines
  - [ ] Tests added/updated
  - [ ] Documentation updated
  - [ ] No breaking changes

### 3. Code Review
- Reviewers will provide feedback
- Make requested changes
- Push updates to the same branch
- Maintain a clean commit history

### 4. Merging
- Ensure all checks pass
- Squash commits if needed
- Merge to main branch

## 🐛 Reporting Issues

### Bug Reports
Include:
1. **Description** - What is the problem?
2. **Steps to Reproduce** - How to replicate it?
3. **Expected Behavior** - What should happen?
4. **Actual Behavior** - What happens instead?
5. **Environment** - OS, Python/Node version, etc.
6. **Logs/Screenshots** - Error messages or relevant output

### Feature Requests
Include:
1. **Description** - What feature do you want?
2. **Use Case** - Why is this needed?
3. **Proposed Solution** - How should it work?
4. **Alternatives** - Other approaches?

## 📚 Documentation

### Code Documentation
- Add docstrings to all functions/classes
- Use clear, descriptive language
- Include parameter descriptions and return types

```python
def search_therapists(query: str, limit: int = 10) -> List[Therapist]:
    """
    Search for therapists using semantic search.
    
    Args:
        query: Natural language search query
        limit: Maximum number of results (default: 10)
    
    Returns:
        List of matching Therapist objects sorted by relevance
        
    Raises:
        ValueError: If query is empty
    """
    pass
```

### Documentation Files
- Update relevant docs when making changes
- Keep README.md current
- Update CHANGELOG if maintaining one

## 🚀 Deployment

### Backend
```bash
cd backend
pip install -e .
# Follow deployment script in scripts/deploy/deploy-backend.sh
```

### Frontend
```bash
cd frontend
npm run build
# Follow deployment script in scripts/deploy/deploy-frontend.sh
```

## 📖 Resources

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [Architecture Documentation](docs/ARCHITECTURE.md)
- [Quick Start Guide](docs/QUICK_START.md)

## 🤝 Getting Help

- Check existing issues and discussions
- Review documentation
- Ask in pull request comments
- Open a new issue with your question

## ✨ Thank You!

Your contributions help make this project better. We appreciate your effort and look forward to working with you!
