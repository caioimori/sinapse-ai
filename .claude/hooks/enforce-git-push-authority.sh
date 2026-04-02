#!/bin/bash
# enforce-git-push-authority.sh
# PreToolUse hook: blocks "git push" commands in Bash tool
# Only meant to run when agent is NOT @devops
# Uses node (not jq) for JSON parsing — works on Windows/Git Bash
# FAIL-CLOSED: if parsing fails, blocks the command (exit 2)
# Hardened v2: also detects indirect execution via script files and pipes

INPUT=$(cat)

# Extract command from JSON using node (available on all SINAPSE systems)
COMMAND=$(echo "$INPUT" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try{console.log(JSON.parse(d).tool_input.command||'')}
    catch(e){process.exit(1)}
  });
" 2>/dev/null)

# Fail-closed: if node parsing failed, block the command
if [ $? -ne 0 ]; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Hook failed to parse input — blocking for safety. Contact @devops."}}'
  exit 0
fi

# Helper: deny with message
deny() {
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Git push is EXCLUSIVE to @devops agent. Activate @devops for push operations."}}'
  exit 0
}

# 1. Direct git push (existing check)
if echo "$COMMAND" | grep -qiE '\bgit\s+push\b'; then
  deny
fi

# 2. Indirect: bash/sh/source executing a script file that contains git push
SCRIPT_FILE=$(echo "$COMMAND" | grep -oP '(?:bash|sh|source|\.)\s+\K[^\s;|&]+' 2>/dev/null | head -1)
if [ -n "$SCRIPT_FILE" ] && [ -f "$SCRIPT_FILE" ]; then
  if grep -qiE '\bgit\s+push\b' "$SCRIPT_FILE" 2>/dev/null; then
    deny
  fi
fi

# 3. Pipe-to-shell patterns (cat file | bash, echo cmd | sh)
if echo "$COMMAND" | grep -qiE '\|\s*(ba)?sh\b'; then
  # Only block if push-related content is likely
  if echo "$COMMAND" | grep -qiE 'push'; then
    deny
  fi
fi

# 4. eval/exec patterns with push
if echo "$COMMAND" | grep -qiE '\b(eval|exec)\b.*push'; then
  deny
fi

# 5. node -e / python -c executing push
if echo "$COMMAND" | grep -qiE '(node\s+-e|python[3]?\s+-c).*push'; then
  deny
fi

# Allow all other commands
exit 0
