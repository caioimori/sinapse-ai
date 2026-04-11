---
name: verify
description: Verify implementation matches story acceptance criteria
trigger: After implementation, before QA gate
agents: [developer, quality-gate]
---

# Verify Skill

## Usage

Invoke with `*verify` or `/verify` after completing implementation.

## Steps

1. Read the active story file
2. Extract all acceptance criteria (Given/When/Then)
3. For each criterion:
   - Check if implementation exists (grep for relevant code)
   - Run relevant test if available (`npm test -- --grep "AC description"`)
   - Mark as PASS / FAIL / PARTIAL
4. Generate verification report
5. If all PASS — recommend proceeding to QA gate
6. If any FAIL — list specific gaps with file paths and line numbers

## Output Format

```
## Verification Report — Story {story_id}

| AC   | Status  | Evidence                              |
|------|---------|---------------------------------------|
| AC-1 | PASS    | test-auth.test.js line 42             |
| AC-2 | FAIL    | No implementation found for edge case |
| AC-3 | PARTIAL | Logic exists but no test coverage     |

### Summary
- Total: {n} | Pass: {p} | Fail: {f} | Partial: {pt}
- Recommendation: {PROCEED_TO_QA | FIX_REQUIRED}
```

## Rules

- Never mark PASS without evidence (test result or code reference)
- PARTIAL means logic exists but lacks test or handles only happy path
- If no story is active, prompt user for story path
- Do not modify any code — this skill is read-only verification

## Integration

- Called automatically at end of `dev-develop-story` task
- Can be called standalone by any agent for spot-checks
- Output can feed into QA gate as pre-verification artifact
