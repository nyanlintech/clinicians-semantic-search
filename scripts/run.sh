#!/bin/bash

# Fast Script Runner for PDX Therapist Search
# Usage: ./run.sh [command] [optional-args]

# Function to find project root by looking for key files/directories
find_project_root() {
    local current_dir="$1"
    
    # Check if we're at the project root (has backend/, frontend/, scripts/ directories)
    if [[ -d "$current_dir/backend" && -d "$current_dir/frontend" && -d "$current_dir/scripts" ]]; then
        echo "$current_dir"
        return 0
    fi
    
    # If we're at the root filesystem, we didn't find the project
    if [[ "$current_dir" == "/" ]]; then
        return 1
    fi
    
    # Go up one directory and try again
    find_project_root "$(dirname "$current_dir")"
}

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Find the project root starting from the script's location
PROJECT_ROOT=$(find_project_root "$SCRIPT_DIR")

if [[ $? -ne 0 ]]; then
    echo "Error: Could not find project root. Make sure you're running this from within the project directory."
    exit 1
fi

# Change to project root directory
cd "$PROJECT_ROOT"

case $1 in
  # Development commands - Individual services
  "backend"|"dev-backend")
    if [ "$2" = "prod" ]; then
        bash "$PROJECT_ROOT/scripts/dev/start-prod-db.sh"
    elif [ "$2" = "dev" ] || [ -z "$2" ]; then
        bash "$PROJECT_ROOT/scripts/dev/start-dev-db.sh"
    else
        echo "Usage: ./run.sh backend [dev|prod]"
        echo "   dev     - Start backend with development database (local)"
        echo "   prod    - Start backend with production database (Supabase)"
        exit 1
    fi
    ;;
    
  "frontend"|"dev-frontend")
    echo "Starting frontend..."
    bash "$PROJECT_ROOT/scripts/dev/start-frontend.sh"
    ;;
    
  # Utility commands
  "status")
    echo "Checking system status..."
    bash "$PROJECT_ROOT/scripts/utils/check-status.sh"
    ;;
    
  "migrate")
    if [ -z "$2" ]; then
      echo "Usage: ./run.sh migrate [load|clean|test|load-prod]"
      echo "   load      - Load therapist data to development DB"
      echo "   clean     - Clean encoding issues"
      echo "   test      - Test search functionality"
      echo "   load-prod - Load therapist data to production DB"
      exit 1
    fi
    echo "Migrating data..."
    bash "$PROJECT_ROOT/scripts/utils/migrate-data.sh" "$2"
    ;;
    
  "setup-db")
    if [ -z "$2" ]; then
      echo "Usage: ./run.sh setup-db [dev|prod]"
      exit 1
    fi
    echo "Setting up database..."
    bash "$PROJECT_ROOT/scripts/utils/setup-db.sh" "$2"
    ;;
    
  "reset-db")
    if [ -z "$2" ]; then
      echo "Usage: ./run.sh reset-db [dev|prod]"
      exit 1
    fi
    echo "Resetting database..."
    bash "$PROJECT_ROOT/scripts/utils/reset-db.sh" "$2"
    ;;
    
  # Deployment commands
  "deploy-backend")
    echo "Deploying backend..."
    bash "$PROJECT_ROOT/scripts/deploy/deploy-backend.sh"
    ;;
    
  "deploy-frontend")
    echo "Deploying frontend..."
    bash "$PROJECT_ROOT/scripts/deploy/deploy-frontend.sh"
    ;;
    
  # Help and info
  "help"|"-h"|"--help"|"")
    echo "PDX Therapist Search - Fast Script Runner"
    echo ""
    echo "Available commands:"
    echo ""
    echo "Development (run in separate terminals):"
    echo "  ./run.sh backend [env]  - Start backend server"
    echo "    • dev                 - Start with development database (local)"
    echo "    • prod                - Start with production database (Supabase)"
    echo "  ./run.sh frontend       - Start frontend server"
    echo ""
    echo "Utilities:"
    echo "  ./run.sh status         - Check system status"
    echo "  ./run.sh migrate [cmd]  - Data migration commands"
    echo "    • load               - Load therapist data to development DB"
    echo "    • clean              - Clean encoding issues"
    echo "    • test               - Test search functionality"
    echo "    • load-prod          - Load therapist data to production DB"
    echo "    • update-fields      - Update existing records with new field defaults"
    echo "  ./run.sh setup-db [env] - Setup database"
    echo "    • dev                - Setup development database"
    echo "    • prod               - Setup production database"
    echo "  ./run.sh reset-db [env] - Reset database (drop & recreate tables)"
    echo "    • dev                - Reset development database"
    echo "    • prod               - Reset production database (requires confirmation)"
    echo ""
    echo "Deployment:"
    echo "  ./run.sh deploy-backend - Deploy backend to Render"
    echo "  ./run.sh deploy-frontend- Deploy frontend"
    echo ""
    echo "Examples:"
    echo "  ./run.sh backend dev     - Start backend with development DB"
    echo "  ./run.sh backend prod    - Start backend with production DB"
    echo "  ./run.sh backend         - Start backend with development DB (default)"
    echo "  ./run.sh frontend        - Start frontend"
    echo ""
    echo "Help:"
    echo "  ./run.sh help          - Show this help message"
    ;;
    
  *)
    echo "Unknown command: $1"
    echo "Run './run.sh help' for available commands"
    exit 1
    ;;
esac