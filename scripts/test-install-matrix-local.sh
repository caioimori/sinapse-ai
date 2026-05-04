#!/usr/bin/env bash
# Story A.5 - Local install matrix helper
#
# Best-effort local validation of the install matrix. You can only fully
# validate the OS you are currently running on — the other 2 OSes are
# covered by the GitHub Actions workflow `.github/workflows/install-matrix.yml`
# on release PRs.
#
# Usage:
#   bash scripts/test-install-matrix-local.sh              # runs all PMs x methods available locally
#   bash scripts/test-install-matrix-local.sh --pm npm     # limit to one PM
#   bash scripts/test-install-matrix-local.sh --method global
#   bash scripts/test-install-matrix-local.sh --only npm:global,pnpm:local
#
# What it does:
#   1. Packs the current repo with `npm pack` into a tarball
#   2. For each selected (pm, method) combo, creates a scratch dir and runs
#      the SAME combo runner used by CI: .github/workflows/install-matrix/run-combo.sh
#   3. Prints a summary table of local results
#
# What it does NOT do:
#   - Run on OSes other than the current one
#   - Replace the CI workflow (the gate for rc -> latest promotion)

set -u

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# Defaults
FILTER_PM=""
FILTER_METHOD=""
ONLY=""

while [ $# -gt 0 ]; do
  case "$1" in
    --pm)     FILTER_PM="$2"; shift 2 ;;
    --method) FILTER_METHOD="$2"; shift 2 ;;
    --only)   ONLY="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,30p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 2
      ;;
  esac
done

# Detect OS (for informational purposes only)
OS_KIND="unknown"
case "$(uname -s 2>/dev/null || echo Windows)" in
  Linux*)  OS_KIND="linux" ;;
  Darwin*) OS_KIND="macos" ;;
  MINGW*|CYGWIN*|MSYS*|Windows*) OS_KIND="windows" ;;
esac

echo "=== Local install matrix helper ==="
echo "OS:          $OS_KIND"
echo "Repo:        $REPO_ROOT"
echo "Node:        $(node --version 2>/dev/null || echo 'NOT FOUND')"
echo "npm:         $(npm --version 2>/dev/null || echo 'NOT FOUND')"
echo "pnpm:        $(pnpm --version 2>/dev/null || echo 'NOT INSTALLED (skipped)')"
echo "yarn:        $(yarn --version 2>/dev/null || echo 'NOT INSTALLED (skipped)')"
echo

# Build tarball once
echo "[1/3] Packing candidate tarball..."
TARBALL_REL=$(npm pack --silent 2>/dev/null | tail -n1)
if [ -z "$TARBALL_REL" ] || [ ! -f "$TARBALL_REL" ]; then
  echo "ERROR: failed to pack candidate" >&2
  exit 1
fi
TARBALL="$REPO_ROOT/$TARBALL_REL"
echo "  tarball: $TARBALL"
echo

# Enumerate combos
ALL_PMS="npm pnpm yarn"
ALL_METHODS="global npx local"
RESULTS=()

should_run() {
  local pm="$1" method="$2"
  if [ -n "$FILTER_PM" ] && [ "$pm" != "$FILTER_PM" ]; then return 1; fi
  if [ -n "$FILTER_METHOD" ] && [ "$method" != "$FILTER_METHOD" ]; then return 1; fi
  if [ -n "$ONLY" ]; then
    case ",$ONLY," in
      *,"$pm:$method",*) return 0 ;;
      *) return 1 ;;
    esac
  fi
  return 0
}

has_pm() {
  command -v "$1" >/dev/null 2>&1
}

echo "[2/3] Running combos..."
TMP_BASE="$(mktemp -d 2>/dev/null || mktemp -d -t install-matrix)"
trap 'rm -rf "$TMP_BASE"' EXIT

for pm in $ALL_PMS; do
  if ! has_pm "$pm"; then
    echo "  skip $pm/* — $pm not installed locally"
    continue
  fi
  for method in $ALL_METHODS; do
    if ! should_run "$pm" "$method"; then continue; fi
    echo "  -> $pm / $method"
    SM_PM="$pm" \
    SM_METHOD="$method" \
    SM_TARBALL="$TARBALL" \
    SM_TEST_DIR="$TMP_BASE/$pm-$method" \
      bash "$REPO_ROOT/.github/workflows/install-matrix/run-combo.sh"
    code=$?
    if [ $code -eq 0 ]; then
      RESULTS+=("PASS|$pm|$method")
    else
      RESULTS+=("FAIL|$pm|$method")
    fi
    echo
  done
done

echo "[3/3] Local matrix summary ($OS_KIND):"
printf "  %-6s %-6s %-8s %s\n" "STATUS" "PM" "METHOD" ""
printf "  %-6s %-6s %-8s %s\n" "------" "----" "------" ""
PASS_COUNT=0
FAIL_COUNT=0
for row in "${RESULTS[@]:-}"; do
  IFS='|' read -r status pm method <<<"$row"
  printf "  %-6s %-6s %-8s\n" "$status" "$pm" "$method"
  case "$status" in
    PASS) PASS_COUNT=$((PASS_COUNT+1)) ;;
    FAIL) FAIL_COUNT=$((FAIL_COUNT+1)) ;;
  esac
done
echo
echo "  PASS: $PASS_COUNT   FAIL: $FAIL_COUNT"
echo
echo "NOTE: Local runs validate only $OS_KIND. The full 27-combo gate runs in CI"
echo "      via .github/workflows/install-matrix.yml on release PRs."

# Cleanup tarball
rm -f "$TARBALL" 2>/dev/null || true

if [ $FAIL_COUNT -gt 0 ]; then
  exit 1
fi
exit 0
