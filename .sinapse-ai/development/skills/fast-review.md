---
name: fast-review
description: Quick code review focused on common issues
trigger: Before commit or on demand
agents: [developer, quality-gate]
---

# Fast Review Skill

## Usage

Invoke with `*fast-review` or `/fast-review` before committing changes.

## What It Checks

### 1. Code Quality (auto)
- Unused imports or variables
- Console.log / debugger statements left in code
- TODO/FIXME/HACK comments without ticket reference
- Functions exceeding 50 lines
- Files exceeding 300 lines

### 2. TypeScript (auto)
```bash
npx tsc --noEmit 2>&1 | head -20
```

### 3. Lint (auto)
```bash
npx eslint --quiet {changed_files} 2>&1 | head -30
```

### 4. Pattern Checks (read-only)
- Relative imports (should be absolute per Constitution Art. VI)
- `any` type usage (should use proper types)
- Missing error handling in async functions
- API calls without try/catch

### 5. Test Coverage (if tests exist)
- New functions should have corresponding tests
- Modified functions — existing tests still pass

## Execution

1. Get changed files: `git diff --name-only --cached` (staged) or `git diff --name-only` (unstaged)
2. Run checks 1-4 on changed files only
3. Summarize findings

## Output Format

```
## Fast Review — {n} files checked

| Category | Issues | Severity |
|----------|--------|----------|
| Quality | 2 console.logs | LOW |
| TypeScript | 0 errors | - |
| Lint | 1 warning | LOW |
| Patterns | 1 relative import | MEDIUM |

Verdict: CLEAN | MINOR_ISSUES | NEEDS_FIX
```

## Rules
- CLEAN = no issues found, safe to commit
- MINOR_ISSUES = proceed but consider fixing (LOW severity only)
- NEEDS_FIX = MEDIUM+ issues must be resolved before commit
- This is lighter than full CodeRabbit — use for quick iterations
- For PR-level review, use CodeRabbit instead
