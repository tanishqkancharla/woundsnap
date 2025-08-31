#!/bin/bash

# Development server management tool for Woundsnap
# Usage: ./dev_server.sh [start|stop|tail] [args...]

TEMP_DIR="/tmp/dev_server"
PID_FILE="$TEMP_DIR/pid.txt"
LOG_FILE="$TEMP_DIR/server.log"

case "$1" in
    start)
        echo "Starting development server..."
        
        # Clean parcel cache
        if [ -d ".parcel-cache" ]; then
            echo "Removing .parcel-cache directory..."
            rm -rf .parcel-cache
        fi
        
        # Create temp directory
        mkdir -p "$TEMP_DIR"
        
        # Check if already running
        if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
            echo "Dev server already running (PID: $(cat "$PID_FILE"))"
            exit 1
        fi
        
        # Start the dev server in background, pipe logs to file
        npm run dev > "$LOG_FILE" 2>&1 &
        DEV_PID=$!
        
        # Save PID to file
        echo "$DEV_PID" > "$PID_FILE"
        
        echo "Dev server started (PID: $DEV_PID)"
        echo "Logs: $LOG_FILE"
        ;;
        
    stop)
        echo "Stopping development server..."
        
        if [ ! -f "$PID_FILE" ]; then
            echo "No PID file found. Server may not be running."
            exit 1
        fi
        
        PID=$(cat "$PID_FILE")
        
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID"
            rm -f "$PID_FILE"
            echo "Dev server stopped (PID: $PID)"
        else
            echo "Process $PID not found. Cleaning up PID file."
            rm -f "$PID_FILE"
        fi
        ;;
        
    tail)
        if [ ! -f "$LOG_FILE" ]; then
            echo "Log file not found: $LOG_FILE"
            echo "Is the dev server running?"
            exit 1
        fi
        
        # Check for persistent flags and reject them
        shift
        for arg in "$@"; do
            case "$arg" in
                -f|--follow|-F|--retry)
                    echo "Error: Persistent tail options (-f, --follow, -F, --retry) are not supported"
                    echo "Use 'tail' without persistent flags to view recent logs"
                    exit 1
                    ;;
            esac
        done
        
        # Show last 20 lines by default, or pass through non-persistent arguments
        if [ $# -eq 0 ]; then
            tail -n 20 "$LOG_FILE"
        else
            tail "$@" "$LOG_FILE"
        fi
        ;;
        
    *)
        echo "Usage: $0 [start|stop|tail] [args...]"
        echo ""
        echo "Commands:"
        echo "  start    Start the development server in background"
        echo "  stop     Stop the development server"
        echo "  tail     Show server logs (supports tail options except persistent ones)"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 tail"
        echo "  $0 tail -n 50"
        echo "  $0 stop"
        exit 1
        ;;
esac
