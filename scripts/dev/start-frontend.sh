#!/bin/bash
echo ""
echo "----------------------------------------------"
echo ""
echo "Starting frontend..."
echo ""
echo "----------------------------------------------"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

cd "$PROJECT_ROOT/frontend"
yarn dev