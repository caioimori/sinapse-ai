#!/bin/bash
# ============================================================================
# chrome-debug — Manual Chrome debug launch
# ============================================================================
# For users to run directly when they want to start/restart the debug session.
# Cross-platform: macOS, Linux, Windows (Git Bash / MSYS2).
#
# Usage: chrome-debug [PORT]
#   PORT defaults to 9222
#
# Behavior:
#   1. If Chrome debug is already running, exits early (no-op)
#   2. Kills only debug-profile Chrome instances (never the user's browser)
#   3. Launches Chrome with remote debugging flags
#   4. Waits for startup and reports result
#
# Exit codes:
#   0 — Chrome debug is running
#   1 — Failed to start Chrome debug
# ============================================================================
set -e

PORT="${1:-9222}"
CHROME_DEBUG_PROFILE="$HOME/.chrome-debug-profile"
CDP="http://127.0.0.1:$PORT/json/version"
MAX_WAIT=15  # seconds (more generous for manual use)

# Colors (only when stdout is a terminal)
if [ -t 1 ]; then
  GREEN='\033[0;32m'
  RED='\033[0;31m'
  YELLOW='\033[1;33m'
  CYAN='\033[0;36m'
  NC='\033[0m'
else
  GREEN='' RED='' YELLOW='' CYAN='' NC=''
fi

# ----------------------------------------------------------------------------
# Detect OS
# ----------------------------------------------------------------------------
UNAME="$(uname -s)"
case "$UNAME" in
  Darwin)  OS="macos"   ;;
  Linux)   OS="linux"   ;;
  MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
  *)
    echo -e "${RED}ERROR: Unsupported OS: $UNAME${NC}" >&2
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
      for cmd in google-chrome google-chrome-stable chromium-browser chromium; do
        if command -v "$cmd" &>/dev/null; then
          command -v "$cmd"
          return 0
        fi
      done
      ;;
    windows)
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
# Check if Chrome debug is reachable via CDP
# ----------------------------------------------------------------------------
check_cdp() {
  curl -sf "$CDP" -o /dev/null --max-time 1 2>/dev/null
}

# ----------------------------------------------------------------------------
# Kill only debug-profile Chrome instances
# ----------------------------------------------------------------------------
kill_debug_chrome() {
  echo -e "${YELLOW}Stopping existing debug-profile Chrome instances...${NC}"
  case "$OS" in
    macos|linux)
      local pids
      pids="$(pgrep -f "user-data-dir=$CHROME_DEBUG_PROFILE" 2>/dev/null)" || true
      if [ -n "$pids" ]; then
        echo "$pids" | xargs kill 2>/dev/null || true
        sleep 2
        echo -e "  ${GREEN}Stopped${NC}"
      else
        echo -e "  ${CYAN}No debug instances found${NC}"
      fi
      ;;
    windows)
      local killed=0
      powershell.exe -NoProfile -Command "
        Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" |
        Where-Object { \$_.CommandLine -like '*user-data-dir=*chrome-debug-profile*' } |
        ForEach-Object { Stop-Process -Id \$_.ProcessId -Force -ErrorAction SilentlyContinue }
      " &>/dev/null && killed=1 || true
      if [ "$killed" -eq 1 ]; then
        sleep 2
        echo -e "  ${GREEN}Stopped${NC}"
      else
        echo -e "  ${CYAN}No debug instances found${NC}"
      fi
      ;;
  esac
}

# ============================================================================
# Main
# ============================================================================

echo -e "${CYAN}Chrome Debug Launcher${NC}"
echo -e "  Port: $PORT"
echo -e "  Profile: $CHROME_DEBUG_PROFILE"
echo -e "  OS: $OS"
echo ""

# Step 1: Check if already running
if check_cdp; then
  echo -e "${GREEN}Chrome debug already running on port $PORT${NC}"
  # Show version info
  local_version="$(curl -sf "$CDP" --max-time 2 2>/dev/null)" || true
  if [ -n "$local_version" ]; then
    echo -e "  $(echo "$local_version" | grep -o '"Browser":"[^"]*"' 2>/dev/null || true)"
  fi
  exit 0
fi

# Step 2: Find Chrome
CHROME_BIN="$(find_chrome)" || {
  echo -e "${RED}ERROR: Google Chrome not found.${NC}" >&2
  echo "" >&2
  echo "Install Chrome from: https://www.google.com/chrome/" >&2
  case "$OS" in
    linux)
      echo "Or try: sudo apt install google-chrome-stable" >&2
      echo "    or: sudo snap install chromium" >&2
      ;;
  esac
  exit 1
}
echo -e "  Chrome: $CHROME_BIN"

# Step 3: Kill stale debug-profile instances
kill_debug_chrome

# Step 4: Launch Chrome
echo -e "${CYAN}Launching Chrome with remote debugging on port $PORT...${NC}"

case "$OS" in
  macos|linux)
    "$CHROME_BIN" \
      --remote-debugging-port="$PORT" \
      --user-data-dir="$CHROME_DEBUG_PROFILE" \
      --no-first-run \
      &>/dev/null &
    ;;
  windows)
    start "" "$CHROME_BIN" \
      --remote-debugging-port="$PORT" \
      --user-data-dir="$CHROME_DEBUG_PROFILE" \
      --no-first-run \
      &>/dev/null 2>&1 || \
    "$CHROME_BIN" \
      --remote-debugging-port="$PORT" \
      --user-data-dir="$CHROME_DEBUG_PROFILE" \
      --no-first-run \
      &>/dev/null &
    ;;
esac

# Step 5: Wait for Chrome to become reachable
echo -n "  Waiting"
elapsed=0
while [ "$elapsed" -lt "$MAX_WAIT" ]; do
  if check_cdp; then
    echo ""
    echo -e "${GREEN}Chrome debug ready on port $PORT${NC}"
    local_version="$(curl -sf "$CDP" --max-time 2 2>/dev/null)" || true
    if [ -n "$local_version" ]; then
      echo -e "  $(echo "$local_version" | grep -o '"Browser":"[^"]*"' 2>/dev/null || true)"
    fi
    echo ""
    echo -e "  CDP endpoint: $CDP"
    echo -e "  DevTools:     http://127.0.0.1:$PORT"
    exit 0
  fi
  echo -n "."
  sleep 1
  elapsed=$((elapsed + 1))
done

echo ""
echo -e "${RED}ERROR: Chrome failed to start with debugging after ${MAX_WAIT}s${NC}" >&2
echo "" >&2
echo "Troubleshooting:" >&2
echo "  1. Close all Chrome windows and try again" >&2
echo "  2. Delete the debug profile: rm -rf $CHROME_DEBUG_PROFILE" >&2
echo "  3. Check if port $PORT is in use by another process" >&2
exit 1
