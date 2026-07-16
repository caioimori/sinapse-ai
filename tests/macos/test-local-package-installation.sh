#!/bin/bash
set -euo pipefail

EXPECTED_ARCH="${1:?expected architecture is required}"
PLATFORM_LABEL="${2:?platform label is required}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_FILE="/tmp/sinapse-test-package-$(date +%Y%m%d-%H%M%S).log"
WORK_ROOT="$(mktemp -d)"

cleanup() {
  rm -rf "$WORK_ROOT"
}
trap cleanup EXIT

log() {
  printf '%s\n' "$1" | tee -a "$LOG_FILE"
}

fail() {
  log "[FAIL] $1"
  exit 1
}

[[ "$(uname -s)" == "Darwin" ]] || fail "This test requires macOS."
ACTUAL_ARCH="$(uname -m)"
[[ "$ACTUAL_ARCH" == "$EXPECTED_ARCH" ]] \
  || fail "Expected $EXPECTED_ARCH, got $ACTUAL_ARCH."

log "[INFO] Testing $PLATFORM_LABEL ($ACTUAL_ARCH) with Node $(node --version)."

TARBALL_NAME="$(cd "$REPO_ROOT" && npm pack --ignore-scripts --silent --pack-destination "$WORK_ROOT" | tail -n 1)"
TARBALL="$WORK_ROOT/$TARBALL_NAME"
[[ -f "$TARBALL" ]] || fail "npm pack did not produce a tarball."

PROJECT_DIR="$WORK_ROOT/project"
HOME_DIR="$WORK_ROOT/home"
CACHE_DIR="$WORK_ROOT/cache"
mkdir -p "$PROJECT_DIR" "$HOME_DIR" "$CACHE_DIR"

(
  cd "$PROJECT_DIR"
  npm init --yes >/dev/null
  npm install "$TARBALL" --ignore-scripts --no-audit --no-fund >/dev/null

  HOME="$HOME_DIR" \
  npm_config_cache="$CACHE_DIR" \
  CI=true \
  ./node_modules/.bin/sinapse-ai install

  test -f .claude/CLAUDE.md
  test -f AGENTS.md
  test -d .agents/skills
  ./node_modules/.bin/sinapse-ai --version
  ./node_modules/.bin/sinapse-ai --help >/dev/null
)

log "[PASS] Local sinapse-ai tarball installed on $PLATFORM_LABEL."
