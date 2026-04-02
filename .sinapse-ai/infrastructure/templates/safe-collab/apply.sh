#!/bin/bash
# apply.sh — Apply safe-collab template to a target project
# Usage: bash apply.sh <target-dir> <owner-github> <collab-github> [user1-prefix] [user2-prefix]
#
# Example:
#   bash apply.sh /path/to/my-project caioimori Matheus-soier caio soier

set -e

TARGET="${1:?Usage: bash apply.sh <target-dir> <owner-github> <collab-github> [user1] [user2]}"
OWNER="${2:?Missing owner GitHub username}"
COLLAB="${3:?Missing collaborator GitHub username}"
USER1="${4:-dev1}"
USER2="${5:-dev2}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Safe Collaboration Setup ==="
echo "Target: $TARGET"
echo "Owner: @$OWNER"
echo "Collaborator: @$COLLAB"
echo "Branch prefixes: $USER1/, $USER2/"
echo ""

# Create directories
mkdir -p "$TARGET/.claude/rules"
mkdir -p "$TARGET/.github"
mkdir -p "$TARGET/docs/guides"

# Copy and customize rule file
sed -e "s/{{USER_1}}/$USER1/g" \
    -e "s/{{USER_2}}/$USER2/g" \
    -e "s/{{user1}}/$USER1/g" \
    -e "s/{{user2}}/$USER2/g" \
    "$SCRIPT_DIR/safe-collaboration-rule.md" > "$TARGET/.claude/rules/safe-collaboration.md"
echo "[OK] .claude/rules/safe-collaboration.md"

# Copy PR template
cp "$SCRIPT_DIR/pull_request_template.md" "$TARGET/.github/PULL_REQUEST_TEMPLATE.md"
echo "[OK] .github/PULL_REQUEST_TEMPLATE.md"

# Copy and customize CODEOWNERS
sed -e "s/{{PROJECT_NAME}}/$(basename "$TARGET")/g" \
    -e "s/{{OWNER_GITHUB}}/$OWNER/g" \
    -e "s/{{COLLAB_GITHUB}}/$COLLAB/g" \
    "$SCRIPT_DIR/CODEOWNERS.template" > "$TARGET/.github/CODEOWNERS"
echo "[OK] .github/CODEOWNERS"

# Copy workflow guide
cp "$SCRIPT_DIR/parallel-workflow-guide.md" "$TARGET/docs/guides/parallel-workflow.md"
echo "[OK] docs/guides/parallel-workflow.md"

# Add runtime patterns to .gitignore if not already present
GITIGNORE="$TARGET/.gitignore"
if [ -f "$GITIGNORE" ]; then
  if ! grep -q '.sinapse-ai/.cache/' "$GITIGNORE" 2>/dev/null; then
    echo "" >> "$GITIGNORE"
    echo "# SINAPSE runtime artifacts" >> "$GITIGNORE"
    echo ".sinapse-ai/.cache/" >> "$GITIGNORE"
    echo ".sinapse-ai/.tmp/" >> "$GITIGNORE"
    echo "[OK] .gitignore updated"
  else
    echo "[OK] .gitignore already has runtime patterns"
  fi
else
  echo "[SKIP] No .gitignore found"
fi

echo ""
echo "=== Files applied. Now configure GitHub: ==="
echo ""
echo "1. Settings > Rules > Rulesets > New ruleset (target: main)"
echo "   - Block direct pushes"
echo "   - Require 1 PR approval"
echo "   - Block force pushes"
echo "   - Block branch deletion"
echo "   - Dismiss stale reviews"
echo ""
echo "2. Settings > Collaborators"
echo "   - Add @$COLLAB with Write permission"
echo ""
echo "3. Settings > General"
echo "   - Check 'Automatically delete head branches'"
echo ""
echo "Done. Safe collaboration is ready."
