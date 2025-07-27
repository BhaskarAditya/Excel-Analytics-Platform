#!/usr/bin/env bash
# Filename: deploy.sh

set -e    # Exit immediately if any command exits with a non-zero status
set -o pipefail

# 1. Backend setup
echo "➡ Setting up backend..."
cd backend || { echo "❌ Failed to enter backend directory"; exit 1; }
npm install
echo "✅ Back-end dependencies installed"
node server.js &
BACKEND_PID=$!
echo "🚀 Backend running (PID: $BACKEND_PID)"

# 2. Frontend setup
echo "➡ Setting up frontend..."
cd ../frontend || { echo "❌ Failed to enter frontend directory"; exit 1; }
npm install
echo "✅ Front-end dependencies installed"
npm start &
FRONTEND_PID=$!
echo "🚀 Frontend running (PID: $FRONTEND_PID)"

# 3. Wait for both processes
echo "🎯 Both processes are running. Press Ctrl+C to exit."

wait $BACKEND_PID
wait $FRONTEND_PID