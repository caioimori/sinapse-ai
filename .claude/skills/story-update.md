---
name: story-update
description: Story lifecycle management — activates automatically when editing story files
paths: ["docs/stories/**"]
allowed-tools: [Read, Edit, Grep, Glob]
user-invocable: false
---

# Story Lifecycle Management

When editing story files, follow these rules from the Story Development Cycle:

## What You CAN Edit
- Checkboxes: `[ ]` → `[x]` (mark tasks complete)
- Dev Agent Record section
- Debug Log section
- Completion Notes section
- File List section (add created/modified files)
- Change Log section
- Status field (following valid transitions)

## What You CANNOT Edit
- Title
- Description
- Acceptance Criteria
- Dev Notes (authored by @sprint-lead)
- Testing sections (authored by @quality-gate)
- Scope (IN/OUT)

## Valid Status Transitions
```
Draft → Ready (only @product-lead via *validate)
Ready → InProgress (only @developer via *develop)
InProgress → InReview (only @developer when tasks complete)
InReview → Done (only @quality-gate via *qa-gate PASS)
InReview → InProgress (only @quality-gate via *qa-gate FAIL)
```

## File List Format
When updating File List, use this format:
```markdown
### File List
| File | Action | Description |
|------|--------|-------------|
| src/components/Feature.tsx | Created | Main feature component |
| src/utils/helper.ts | Modified | Added helper function |
```

## Checkbox Rules
- Mark `[x]` ONLY after ALL validations pass (lint, typecheck, test)
- Never mark a task complete if tests are failing
- Update File List BEFORE marking checkbox
