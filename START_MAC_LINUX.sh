#!/bin/bash
echo "============================================"
echo "  TaskFlow - Real-time Task Manager"
echo "  24BIT0441 Rachana P - BITE304L"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is NOT installed!"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js: $(node --version)"

# Install if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "[INFO] Installing dependencies..."
    npm install
    echo "[OK] Dependencies installed!"
fi

echo ""
echo "[INFO] Starting TaskFlow server..."
echo "[INFO] Open your browser at: http://localhost:5000"
echo "[INFO] Press Ctrl+C to stop"
echo ""

# Open browser after delay (Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    (sleep 2 && open http://localhost:5000) &
# Open browser after delay (Linux)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    (sleep 2 && xdg-open http://localhost:5000 2>/dev/null) &
fi

node backend/server.js
