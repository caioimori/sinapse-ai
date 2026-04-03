# Epic: .sinapse-ai/ Folder Reorganization

**Status:** Draft
**Priority:** Low
**Complexity:** Medium (migration paths needed)

## Context

The `.sinapse-ai/` directory has 7 auxiliary folders sitting at root level that should be organized into the 4 pillar structure (core, data, development, infrastructure).

## Current State

Folders with active code references (MUST NOT break):

| Folder | References | Current Consumer |
|--------|-----------|-----------------|
| `cli/` | 38+ refs | `bin/sinapse.js` |
| `data/` | 48+ refs | entity-registry, config |
| `utils/` | 15+ refs | tests |
| `workflow-intelligence/` | 13+ refs | tests |
| `schemas/` | config ref | `migrate-agent.js` |
| `elicitation/` | config ref | `core-config-template.js` |
| `scripts/` | config ref | `core-config-template.js` |

## Proposed Target

```
.sinapse-ai/
  core/           # cli/, utils/, workflow-intelligence/ (move here)
  data/           # Already correct
  development/    # schemas/, elicitation/ (move here)
  infrastructure/ # scripts/ (move here)
```

## Requirements

1. Create migration path (symlinks or re-exports) to avoid breaking imports
2. Update all require/import paths
3. Update installer FOLDERS_TO_COPY
4. Update tests
5. Validate with `npm test` + `npm run lint`

## Risk

- Breaking imports in installed projects (need installer migration)
- Breaking CI/CD pipelines
- Requires coordinated update across multiple files

## Decision

Defer until a natural refactor opportunity. The current structure works, and reorganization is cosmetic improvement with real migration risk.
