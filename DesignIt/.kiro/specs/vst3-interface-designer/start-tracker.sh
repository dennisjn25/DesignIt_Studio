#!/bin/bash

echo "Starting VST3 Interface Designer Progress Tracker..."
echo "Updates every 5 minutes. Press Ctrl+C to stop."
echo ""

cd "$(dirname "$0")/scripts"
node progress-updater.js