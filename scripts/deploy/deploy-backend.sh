#!/bin/bash
echo "Deploying backend to Render..."

# Get the project root directory (two levels up from this script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

cd "$PROJECT_ROOT/backend"
git add .
git commit -m "Deploy backend - $(date)"
git push origin main

echo "✅ Backend deployment triggered!"
echo "📊 Check Render dashboard for status"
echo "🔗 Your API will be available at: https://your-app-name.onrender.com"