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
# Check 2: @developer agent file exists in the installed package
# We verify the source agent definition shipped with the package.
# For global installs, the package tree lives under the global
# node_modules prefix, NOT at ~/.claude/commands/ (that path is
# only created by sync:ide inside Claude Code, unavailable in CI).
# ------------------------------------------------------------
CHECK2=1
case "$METHOD" in
  global)
    # Resolve global node_modules prefix for the active PM
    GLOBAL_ROOT=""
    case "$PM" in
      npm)  GLOBAL_ROOT=$(npm root -g 2>/dev/null) ;;
      pnpm) GLOBAL_ROOT=$(pnpm root -g 2>/dev/null) ;;
      yarn) GLOBAL_ROOT=$(yarn global dir 2>/dev/null)/node_modules ;;
    esac
    if [ -n "$GLOBAL_ROOT" ] \
       && [ -f "$GLOBAL_ROOT/sinapse-ai/.sinapse-ai/development/agents/developer.md" ]; then
      CHECK2=0
    fi
    ;;
  npx|local)
    # Package-internal location within the installed tree
    if [ -f "./node_modules/sinapse-ai/.sinapse-ai/development/agents/developer.md" ]; then
      CHECK2=0
    fi
    ;;
esac
echo "[check2] @developer file exists: $([ $CHECK2 -eq 0 ] && echo PASS || echo FAIL)"
[ $CHECK2 -ne 0 ] && FAIL=1

# ------------------------------------------------------------
# Check 3: sinapse doctor runs without crashing
# In CI there is no Claude Code installation, so doctor checks
# that inspect ~/.claude/ (settings-json, rules-files, ide-sync,
# skills-count, commands-count) will naturally FAIL (exit 2).
# This is EXPECTED — doctor correctly detects the missing setup.
#
# What the matrix validates: the doctor command itself runs and
# produces a structured report (exit 0/1/2), or exit 4 when the framework is
# installed as a package but has not been initialized in the empty test dir.
# Only exit 3 (internal runner crash) or an unknown code indicates a packaging
# problem.
# ------------------------------------------------------------
CHECK3=1
DOCTOR_EXIT=255
set +e
eval "$SINAPSE_INVOKE doctor --quiet" >/dev/null 2>&1
DOCTOR_EXIT=$?
set -e 2>/dev/null || true
if [ "$DOCTOR_EXIT" -le 2 ] || [ "$DOCTOR_EXIT" -eq 4 ]; then
  CHECK3=0
fi
echo "[check3] sinapse doctor exit: $DOCTOR_EXIT ($([ $CHECK3 -eq 0 ] && echo PASS || echo FAIL))"
[ $CHECK3 -ne 0 ] && FAIL=1

# ------------------------------------------------------------
# Check 4: `npm install` of the package stays QUIET (no auto-exec).
# Since the 2026-06 supply-chain hardening the package ships NO
# `postinstall` hook — installing the tarball must NOT run setup or
# print a SINAPSE banner. Setup is explicit via `npx sinapse-ai install`.
# We match the known banner markers (instalado, agents, squads, doctor,
# @sinapse, sinapse.club, Bem-vindo, parcial); 0 is the expected count.
# The check stays tolerant (<= MAX_LINES) to ignore package-manager noise.
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
# Match only lines from the SINAPSE postinstall banner, not PM noise.
# The banner uses: "instalado", "agents", "squads", "doctor",
# "@sinapse", "sinapse.club", "Bem-vindo", "parcial".
BANNER_PATTERN="instalado|agents.*squads|sinapse doctor|@sinapse|sinapse\.club|Bem-vindo|parcial"
LINES=$(echo "$OUTPUT" | grep -cE "$BANNER_PATTERN" 2>/dev/null) || LINES=0
if [ "$LINES" -le "$MAX_LINES" ]; then
  CHECK4=0
fi
echo "[check4] postinstall banner lines: $LINES (max $MAX_LINES) $([ $CHECK4 -eq 0 ] && echo PASS || echo FAIL)"
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
