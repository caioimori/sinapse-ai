#!/bin/bash
# ============================================================================
# chrome-brain-log — Session logger for Chrome Brain
# ============================================================================
# Called by PostToolUse hook. Logs tool usage and tracks screenshot count.
# Cross-platform: macOS, Linux, Windows (Git Bash / MSYS2).
#
# Environment:
#   HOOK_TOOL_NAME — Name of the tool that was used (set by Claude Code)
#
# Behavior:
#   - Logs tool name + timestamp to ~/.chrome-brain/session-YYYYMMDD.log
#   - Tracks screenshot count in ~/.chrome-brain/.screenshot-count
#   - WARNING at 12 screenshots, CRITICAL at 15
#   - ALWAYS exits 0 (never blocks the tool pipeline)
#
# Usage: chrome-brain-log
# ============================================================================

# IMPORTANT: No set -e here. This script must NEVER fail or block the tool.

LOG_DIR="$HOME/.chrome-brain"
TODAY="$(date +%Y%m%d)"
LOG_FILE="$LOG_DIR/session-${TODAY}.log"
COUNTER_FILE="$LOG_DIR/.screenshot-count"

# Ensure log directory exists
mkdir -p "$LOG_DIR" 2>/dev/null || true

# ----------------------------------------------------------------------------
# Read tool name from environment
# ----------------------------------------------------------------------------
TOOL_NAME="${HOOK_TOOL_NAME:-unknown}"
TIMESTAMP="$(date +%H:%M:%S)"

# ----------------------------------------------------------------------------
# Append to session log
# ----------------------------------------------------------------------------
echo "$TIMESTAMP $TOOL_NAME" >> "$LOG_FILE" 2>/dev/null || true

# ----------------------------------------------------------------------------
# Track screenshot count and emit warnings
# ----------------------------------------------------------------------------
if echo "$TOOL_NAME" | grep -qE "take_screenshot|take_snapshot|screenshot"; then
  # Read current count (default 0 if file missing or unreadable)
  COUNT="$(cat "$COUNTER_FILE" 2>/dev/null)" || COUNT=0

  # Validate that COUNT is numeric
  case "$COUNT" in
    ''|*[!0-9]*) COUNT=0 ;;
  esac

  COUNT=$((COUNT + 1))

  # Write updated count
  echo "$COUNT" > "$COUNTER_FILE" 2>/dev/null || true

  # Emit warnings at thresholds
  if [ "$COUNT" -ge 15 ]; then
    echo "CRITICAL: ${COUNT} screenshots in this session. Session at risk of exceeding 20MB API limit. Save state NOW." >&2
  elif [ "$COUNT" -ge 12 ]; then
    echo "WARNING: ${COUNT} screenshots in this session. Consider saving state and rotating." >&2
  fi
fi

# Always exit 0 — never block the tool pipeline
exit 0
