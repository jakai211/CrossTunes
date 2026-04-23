#!/bin/bash

# CrossTunes Log Viewer
# Usage: ./view_logs.sh [backend|website|all] [lines]

LOG_TYPE=${1:-all}
LINES=${2:-20}

echo "=== CrossTunes Login Logs ==="
echo "Showing last $LINES entries"
echo

if [ "$LOG_TYPE" = "backend" ] || [ "$LOG_TYPE" = "all" ]; then
    echo "📊 BACKEND LOGINS:"
    if [ -f "logs/backend/login.log" ]; then
        tail -$LINES logs/backend/login.log | jq -r '. | "\(.timestamp) - \(.email) (\(.name)) - Success: \(.success)"' 2>/dev/null || tail -$LINES logs/backend/login.log
    else
        echo "No backend login logs found"
    fi
    echo
fi

if [ "$LOG_TYPE" = "website" ] || [ "$LOG_TYPE" = "all" ]; then
    echo "🌐 WEBSITE LOGINS:"
    if [ -f "logs/website/login.log" ]; then
        tail -$LINES logs/website/login.log | jq -r '. | "\(.timestamp) - \(.email) (\(.name)) - Success: \(.success)"' 2>/dev/null || tail -$LINES logs/website/login.log
    else
        echo "No website login logs found"
    fi
    echo
fi

echo "=== Recent Errors ==="
if [ -f "logs/backend/error.log" ]; then
    echo "Backend errors:"
    tail -5 logs/backend/error.log | jq -r '. | "\(.timestamp) - \(.message)"' 2>/dev/null || tail -5 logs/backend/error.log
fi

if [ -f "logs/website/error.log" ]; then
    echo "Website errors:"
    tail -5 logs/website/error.log | jq -r '. | "\(.timestamp) - \(.message)"' 2>/dev/null || tail -5 logs/website/error.log
fi