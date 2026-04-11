---
name: debug
description: Structured debugging assistance when agent is stuck
trigger: On repeated failure or explicit invocation
agents: [developer, quality-gate]
---

# Debug Skill

## Usage

Invoke with `*debug` or `/debug` when stuck on an error after 2+ failed attempts.

## Protocol

### 1. Capture Context
- Current error message (full stack trace)
- What was attempted (last 2-3 actions)
- Expected vs actual behavior
- Relevant file paths and line numbers

### 2. Classify Error
| Category | Examples | First Action |
|----------|----------|-------------|
| Syntax | SyntaxError, unexpected token | Check recent edits for typos |
| Type | TypeError, undefined is not | Trace variable origin, check types |
| Runtime | ENOENT, ECONNREFUSED | Verify paths, ports, services |
| Logic | Wrong output, infinite loop | Add logging, isolate with minimal repro |
| Config | Module not found, env missing | Check package.json, .env, tsconfig |
| Test | Assertion failed, timeout | Compare expected vs actual values |

### 3. Investigate (max 5 minutes)
1. Read the error source file at the failing line
2. Check recent git diff for unintended changes
3. Search codebase for similar patterns that work
4. Check if dependency versions match (package.json vs lock)
5. Verify environment (Node version, env vars)

### 4. Fix or Escalate
- If root cause found — apply fix, verify, continue
- If unclear after 5 min — document findings, escalate to user
- Never loop on the same approach more than twice

## Anti-Patterns
- Guessing without reading the actual error
- Changing multiple things at once (isolate changes)
- Ignoring stack traces (read bottom-up for root cause)
- Retrying the exact same command expecting different results

## Output
```
## Debug Report
- Error: {error_type}: {message}
- Root Cause: {explanation}
- Fix Applied: {description of change}
- Verified: {how it was confirmed working}
```
