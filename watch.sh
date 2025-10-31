#!/usr/bin/env bash
# watch-restart.sh
# Simple watcher for Arch Linux
# - watches folder recursively
# - runs a single command (no args) and restarts it when files change
# - requires inotifywait (inotify-tools)

set -euo pipefail

WATCH_DIR="$HOME/y/ags/widget"
CMD="ags run app.tsx"   # <-- set the command (no arguments) you want to run

if ! command -v inotifywait >/dev/null 2>&1; then
    echo "inotifywait not found. Install: sudo pacman -S inotify-tools"
    exit 1
fi

child_pid=0

start_cmd() {
    # start the command in its own process group so we can kill whole tree
    setsid $CMD >/dev/null 2>&1 &
    child_pid=$!
    echo "[watch] started pid=$child_pid"
}

stop_cmd() {
    if [[ $child_pid -ne 0 ]]; then
        if kill -0 "$child_pid" 2>/dev/null; then
            echo "[watch] stopping pid=$child_pid"
            # kill the process group
            kill -TERM -"$child_pid" 2>/dev/null || true
            sleep 0.2
            if kill -0 "$child_pid" 2>/dev/null; then
                kill -KILL -"$child_pid" 2>/dev/null || true
            fi
        fi
        wait "$child_pid" 2>/dev/null || true
        child_pid=0
    fi
}

cleanup() {
    echo
    echo "[watch] exiting"
    stop_cmd
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "[watch] watching: $WATCH_DIR"
start_cmd

# watch for common write/create/remove/move events
inotifywait -m -r -e close_write,create,move,delete --format '%w%f %e' "$WATCH_DIR" |
while read -r path ev; do
    echo "[watch] change detected: $path ($ev) — restarting"
    stop_cmd
    start_cmd
done
