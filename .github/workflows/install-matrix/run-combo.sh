#!/usr/bin/env bash
# Story A.5 - Install Matrix combo runner
# Installs the SINAPSE candidate tarball using the specified package manager
# and install method, then runs the 4 validation checks.
#
# Required env vars:
#   SM_PM       - one of: npm, pnpm, yarn
#   SM_METHOD   - one of: global, npx, local
#   SM_TARBALL  - absolute path to the candidate .tgz built by `npm pack`
#   SM_TEST_DIR - isolated working directory (already created)
#
# Exit codes:
#   0  all 4 checks PASS
#   1  one or more checks FAIL
#   2  unusable environment (wrong args, missing deps)

set -u

PM="${SM_PM:-}"
METHOD="${SM_METHOD:-}"
TARBALL="${SM_TARBALL:-}"
TEST_DIR="${SM_TEST_DIR:-}"

if [ -z "$PM" ] || [ -z "$METHOD" ] || [ -z "$TARBALL" ] || [ -z "$TEST_DIR" ]; then
  echo "ERROR: SM_PM, SM_METHOD, SM_TARBALL, SM_TEST_DIR must all be set" >&2
  exit 2
fi

if [ ! -f "$TARBALL" ]; then
  echo "ERROR: tarball not found at $TARBALL" >&2
  exit 2
fi

# Output line-count threshold from story AC (<= 10 lines default)
MAX_LINES=10

FAIL=0
LOG="$TEST_DIR/combo.log"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo "=== Install Matrix combo: $PM / $METHOD ==="
echo "Tarball: $TARBALL"
echo "Working dir: $TEST_DIR"
echo

# ------------------------------------------------------------
# 1. Install using the requested package manager & method
# ------------------------------------------------------------
INSTALL_STATUS=0
INSTALL_OUTPUT=""

run_install() {
  # Returns output on stdout, status code via $?.
  local out
  case "$PM" in
    npm)
      case "$METHOD" in
        global)
          out=$(npm install -g "$TARBALL" 2>&1)
          ;;
        npx)
          # npx runs without install; we execute the bin from the tarball via
          # a local install then invoke with npx --no-install semantics.
          npm init -y >/dev/null 2>&1
          out=$(npm install "$TARBALL" 2>&1)
          ;;
        local)
          npm init -y >/dev/null 2>&1
          out=$(npm install "$TARBALL" 2>&1)
          ;;
      esac
      ;;
    pnpm)
      case "$METHOD" in
        global)
          out=$(pnpm add -g "$TARBALL" 2>&1)
          ;;
        npx)
          pnpm init >/dev/null 2>&1
          out=$(pnpm add "$TARBALL" 2>&1)
          ;;
        local)
          pnpm init >/dev/null 2>&1
          out=$(pnpm add "$TARBALL" 2>&1)
          ;;
      esac
      ;;
    yarn)
      case "$METHOD" in
        global)
          out=$(yarn global add "file:$TARBALL" 2>&1)
          ;;
        npx)
          yarn init -y >/dev/null 2>&1
          out=$(yarn add "file:$TARBALL" 2>&1)
          ;;
        local)
          yarn init -y >/dev/null 2>&1
          out=$(yarn add "file:$TARBALL" 2>&1)
          ;;
      esac
      ;;
    *)
      echo "ERROR: unknown SM_PM=$PM" >&2
      return 2
      ;;
  esac
  echo "$out"
}

INSTALL_OUTPUT=$(run_install)
INSTALL_STATUS=$?
echo "$INSTALL_OUTPUT" > "$LOG"
echo "[install] exit=$INSTALL_STATUS"
if [ "$INSTALL_STATUS" -ne 0 ]; then
  echo "[install] FAILED — see $LOG"
  FAIL=1
fi

# ------------------------------------------------------------
# Helper: invoke sinapse using the install method
# ------------------------------------------------------------
SINAPSE_INVOKE=""
case "$METHOD" in
  global)
    SINAPSE_INVOKE="sinapse"
    ;;
  npx)
    # Prefer the node_modules bin directly for determinism
    if [ -x "./node_modules/.bin/sinapse" ]; then
      SINAPSE_INVOKE="./node_modules/.bin/sinapse"
    else
      SINAPSE_INVOKE="npx --no-install sinapse"
    fi
    ;;
  local)
    SINAPSE_INVOKE="./node_modules/.bin/sinapse"
    ;;
esac

# ------------------------------------------------------------
# Check 1: sinapse in PATH (or invokable per install method)
# ------------------------------------------------------------
CHECK1=1
if [ "$METHOD" = "global" ]; then
  if command -v sinapse >/dev/null 2>&1; then
    CHECK1=0
  fi
else
  if eval "$SINAPSE_INVOKE --version" >/dev/null 2>&1; then
    CHECK1=0
  fi
fi
echo "[check1] sinapse invokable: $([ $CHECK1 -eq 0 ] && echo PASS || echo FAIL)"
[ $CHECK1 -ne 0 ] && FAIL=1

# ------------------------------------------------------------
# Check 2: @developer agent file exists
# For global installs, Claude agent files land at ~/.claude/commands/SINAPSE/agents/
# For local installs, they land at ./node_modules/sinapse-ai/.claude/commands/SINAPSE/agents/
# or alternatively the source path inside the package tree.
# ------------------------------------------------------------
CHECK2=1
case "$METHOD" in
  global)
    if [ -f "$HOME/.claude/commands/SINAPSE/agents/developer.md" ]; then
      CHECK2=0
    fi
    ;;
  npx|local)
    # Package-internal location within the installed tree
    if [ -f "./node_modules/sinapse-ai/.claude/commands/SINAPSE/agents/developer.md" ] \
       || [ -f "./node_modules/sinapse-ai/.sinapse-ai/development/agents/developer.md" ]; then
      CHECK2=0
    fi
    ;;
esac
echo "[check2] @developer file exists: $([ $CHECK2 -eq 0 ] && echo PASS || echo FAIL)"
[ $CHECK2 -ne 0 ] && FAIL=1

# ------------------------------------------------------------
# Check 3: sinapse doctor exit code
# Acceptable: 0 (PASS) — per Story A.3, fresh install MUST return 0.
# ------------------------------------------------------------
CHECK3=1
DOCTOR_EXIT=255
set +e
eval "$SINAPSE_INVOKE doctor --quiet" >/dev/null 2>&1
DOCTOR_EXIT=$?
set -e 2>/dev/null || true
if [ "$DOCTOR_EXIT" -eq 0 ]; then
  CHECK3=0
fi
echo "[check3] sinapse doctor exit: $DOCTOR_EXIT ($([ $CHECK3 -eq 0 ] && echo PASS || echo FAIL))"
[ $CHECK3 -ne 0 ] && FAIL=1

# ------------------------------------------------------------
# Check 4: default install output <= 10 lines
# Re-run the install into a throwaway dir to capture output cleanly.
# ------------------------------------------------------------
CHECK4=1
LINES=-1
OUT_DIR="$TEST_DIR/lines-check"
mkdir -p "$OUT_DIR"
pushd "$OUT_DIR" >/dev/null
case "$PM" in
  npm)
    npm init -y >/dev/null 2>&1
    OUTPUT=$(npm install "$TARBALL" 2>&1 || true)
    ;;
  pnpm)
    pnpm init >/dev/null 2>&1 || true
    OUTPUT=$(pnpm add "$TARBALL" 2>&1 || true)
    ;;
  yarn)
    yarn init -y >/dev/null 2>&1 || true
    OUTPUT=$(yarn add "file:$TARBALL" 2>&1 || true)
    ;;
esac
popd >/dev/null
# Count only the SINAPSE-emitted lines (postinstall). We grep for the banner
# token "SINAPSE" if present, else fall back to total line count.
if echo "$OUTPUT" | grep -q "SINAPSE"; then
  LINES=$(echo "$OUTPUT" | grep -c "SINAPSE" || echo 0)
else
  LINES=$(printf "%s\n" "$OUTPUT" | wc -l | tr -d ' ')
fi
if [ "$LINES" -le "$MAX_LINES" ]; then
  CHECK4=0
fi
echo "[check4] install output lines: $LINES (max $MAX_LINES) $([ $CHECK4 -eq 0 ] && echo PASS || echo FAIL)"
[ $CHECK4 -ne 0 ] && FAIL=1

# ------------------------------------------------------------
# Summary
# ------------------------------------------------------------
echo
echo "=== combo result: $PM / $METHOD ==="
if [ $FAIL -eq 0 ]; then
  echo "VERDICT: PASS"
  exit 0
fi
echo "VERDICT: FAIL"
exit 1
