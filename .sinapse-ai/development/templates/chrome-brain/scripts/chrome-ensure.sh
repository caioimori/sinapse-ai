#!/bin/bash
# ============================================================================
# chrome-ensure — Fast check + auto-launch Chrome debug profile
# ============================================================================
# Called by PreToolUse hook. Ensures Chrome is running with remote debugging.
# Cross-platform: macOS, Linux, Windows (Git Bash / MSYS2).
#
# Usage: chrome-ensure [PORT]
#   PORT defaults to 9222
#
# Exit codes:
#   0 — Chrome debug is running and reachable
#   1 — Failed to start Chrome debug within timeout
# ============================================================================
set -e

PORT="${1:-9222}"
CHROME_DEBUG_PROFILE="$HOME/.chrome-debug-profile"
CDP="http://127.0.0.1:$PORT/json/version"
MAX_WAIT=10  # seconds

# ----------------------------------------------------------------------------
# Detect OS
# ----------------------------------------------------------------------------
UNAME="$(uname -s)"
case "$UNAME" in
  Darwin)  OS="macos"   ;;
  Linux)   OS="linux"   ;;
  MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
  *)
    echo "BLOCKED: Unsupported OS: $UNAME" >&2
    exit 1
    ;;
esac

# ----------------------------------------------------------------------------
# Locate Chrome binary
# ----------------------------------------------------------------------------
find_chrome() {
  case "$OS" in
    macos)
      local chrome_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      if [ -x "$chrome_path" ]; then
        echo "$chrome_path"
        return 0
      fi
      ;;
    linux)
      # Try common names in order of preference
      for cmd in google-chrome google-chrome-stable chromium-browser chromium; do
        if command -v "$cmd" &>/dev/null; then
          command -v "$cmd"
          return 0
        fi
      done
      ;;
    windows)
      # Git Bash / MSYS2 path style
      local local_app_data=""
      if [ -n "$LOCALAPPDATA" ]; then
        local_app_data="$(cygpath -u "$LOCALAPPDATA" 2>/dev/null || echo "")"
      fi
      for chrome_path in \
        "/c/Program Files/Google/Chrome/Application/chrome.exe" \
        "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
        "${local_app_data:+$local_app_data/Google/Chrome/Application/chrome.exe}"; do
        [ -z "$chrome_path" ] && continue
        if [ -f "$chrome_path" ]; then
          echo "$chrome_path"
          return 0
        fi
      done
      # Try native Windows path via cmd.exe as fallback
      local win_path
      win_path="$(cmd.exe /c "where chrome.exe" 2>/dev/null | tr -d '\r' | head -1)" || true
      if [ -n "$win_path" ]; then
        echo "$win_path"
        return 0
      fi
      ;;
  esac
  return 1
}

# ----------------------------------------------------------------------------
# Check if Chrome debug is reachable (fast path, ~50ms on hit)
# ----------------------------------------------------------------------------
check_cdp() {
  curl -sf "$CDP" -o /dev/null --max-time 1 2>/dev/null
}

# ----------------------------------------------------------------------------
# Check if debug port is in use (fallback when curl is unavailable)
# ----------------------------------------------------------------------------
check_port_in_use() {
  case "$OS" in
    macos)
      lsof -iTCP:"$PORT" -sTCP:LISTEN &>/dev/null
      ;;
    linux)
      if command -v ss &>/dev/null; then
        ss -tlnp 2>/dev/null | grep -q ":$PORT "
      elif command -v lsof &>/dev/null; then
        lsof -iTCP:"$PORT" -sTCP:LISTEN &>/dev/null
      else
        # netstat as last resort
        netstat -tlnp 2>/dev/null | grep -q ":$PORT "
      fi
      ;;
    windows)
      netstat -ano 2>/dev/null | grep -q "LISTENING.*:$PORT "
      ;;
  esac
}

# ----------------------------------------------------------------------------
# Kill only debug profile Chrome instances (never the normal browser)
# ----------------------------------------------------------------------------
kill_debug_chrome() {
  case "$OS" in
    macos|linux)
      # Only kill processes matching our debug profile directory
      local pids
      pids="$(pgrep -f "user-data-dir=$CHROME_DEBUG_PROFILE" 2>/dev/null)" || true
      if [ -n "$pids" ]; then
        echo "$pids" | xargs kill 2>/dev/null || true
        sleep 1
      fi
      ;;
    windows)
      # On Windows, use PowerShell to find and kill Chrome with our debug profile
      powershell.exe -NoProfile -Command "
        Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" |
        Where-Object { \$_.CommandLine -like '*user-data-dir=*chrome-debug-profile*' } |
        ForEach-Object { Stop-Process -Id \$_.ProcessId -Force -ErrorAction SilentlyContinue }
      " &>/dev/null || true
      sleep 1
      ;;
  esac
}

# ----------------------------------------------------------------------------
# Launch Chrome with remote debugging
# ----------------------------------------------------------------------------
launch_chrome() {
  local chrome_bin
  chrome_bin="$(find_chrome)" || {
    echo "BLOCKED: Google Chrome not found. Install Chrome and retry." >&2
    exit 1
  }

  # Kill any stale debug-profile instances on our port
  if check_port_in_use; then
    kill_debug_chrome
  fi

  # Launch in background, suppress output
  case "$OS" in
    macos|linux)
      "$chrome_bin" \
        --remote-debugging-port="$PORT" \
        --user-data-dir="$CHROME_DEBUG_PROFILE" \
        --no-first-run \
        &>/dev/null &
      ;;
    windows)
      # On Git Bash, start detaches the process properly
      start "" "$chrome_bin" \
        --remote-debugging-port="$PORT" \
        --user-data-dir="$CHROME_DEBUG_PROFILE" \
        --no-first-run \
        &>/dev/null 2>&1 || \
      "$chrome_bin" \
        --remote-debugging-port="$PORT" \
        --user-data-dir="$CHROME_DEBUG_PROFILE" \
        --no-first-run \
        &>/dev/null &
      ;;
  esac
}

# ============================================================================
# Main
# ============================================================================

# Fast path: already running (~50ms check)
if check_cdp; then
  exit 0
fi

# Slow path: launch Chrome and wait
launch_chrome

# Wait for Chrome to become reachable
elapsed=0
while [ "$elapsed" -lt "$MAX_WAIT" ]; do
  if check_cdp; then
    exit 0
  fi
  sleep 1
  elapsed=$((elapsed + 1))
done

# Final check after timeout
if check_cdp; then
  exit 0
fi

echo "BLOCKED: Chrome debug failed to start on port $PORT after ${MAX_WAIT}s. Run 'chrome-debug' manually." >&2
exit 1
