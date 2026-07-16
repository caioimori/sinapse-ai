#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_FILE="/tmp/sinapse-test-perf-$(date +%Y%m%d-%H%M%S).log"
WORK_ROOT="$(mktemp -d)"
MAX_INSTALL_SECONDS=300
MAX_CLI_SECONDS=5

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
command -v node >/dev/null || fail "Node.js is required."
command -v npm >/dev/null || fail "npm is required."

log "[INFO] Platform: $(sw_vers -productVersion) $(uname -m)"
log "[INFO] Runtime: Node $(node --version), npm $(npm --version)"

TARBALL_NAME="$(cd "$REPO_ROOT" && npm pack --ignore-scripts --silent --pack-destination "$WORK_ROOT" | tail -n 1)"
TARBALL="$WORK_ROOT/$TARBALL_NAME"
[[ -f "$TARBALL" ]] || fail "npm pack did not produce a tarball."

PROJECT_DIR="$WORK_ROOT/project"
HOME_DIR="$WORK_ROOT/home"
CACHE_DIR="$WORK_ROOT/cache"
mkdir -p "$PROJECT_DIR" "$HOME_DIR" "$CACHE_DIR"

cd "$PROJECT_DIR"
npm init --yes >/dev/null

INSTALL_STARTED="$(date +%s)"
npm install "$TARBALL" --ignore-scripts --no-audit --no-fund >/dev/null
HOME="$HOME_DIR" npm_config_cache="$CACHE_DIR" CI=true \
  ./node_modules/.bin/sinapse-ai install >/dev/null
INSTALL_SECONDS=$(( $(date +%s) - INSTALL_STARTED ))

if (( INSTALL_SECONDS > MAX_INSTALL_SECONDS )); then
  fail "Local package installation took ${INSTALL_SECONDS}s; limit is ${MAX_INSTALL_SECONDS}s."
fi
log "[PASS] Local package installation: ${INSTALL_SECONDS}s"

CLI_STARTED="$(date +%s)"
./node_modules/.bin/sinapse-ai --version >/dev/null
./node_modules/.bin/sinapse-ai --help >/dev/null
CLI_SECONDS=$(( $(date +%s) - CLI_STARTED ))

if (( CLI_SECONDS > MAX_CLI_SECONDS )); then
  fail "Version and help took ${CLI_SECONDS}s; limit is ${MAX_CLI_SECONDS}s."
fi
log "[PASS] Version and help: ${CLI_SECONDS}s"

PUBLISHED_VERSION="$(npm view sinapse-ai version --silent)"
[[ -n "$PUBLISHED_VERSION" ]] || fail "npm registry did not return sinapse-ai version."
log "[PASS] npm registry package exists: sinapse-ai@$PUBLISHED_VERSION"

log "[INFO] CPU cores: $(sysctl -n hw.ncpu)"
log "[INFO] Memory bytes: $(sysctl -n hw.memsize)"
log "[PASS] Performance validation completed."
