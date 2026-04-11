---
name: story-fast-track
description: Auto-create and validate story for trivial fixes
trigger: Bug fix or docs change under 50 lines affecting 3 or fewer files
agents: [developer, sprint-lead]
---

# Story Fast-Track Skill

## Usage

Invoke with `*fast-track` or `/fast-track` for trivial changes that need a story but not full validation.

## Eligibility Criteria (ALL must be true)

| Criterion | Threshold |
|-----------|-----------|
| Change type | Bug fix, docs, typo, config |
| Lines changed | <= 50 |
| Files affected | <= 3 |
| Architecture impact | None |
| New dependencies | None |
| Database changes | None |
| API surface changes | None |

If ANY criterion fails, fall back to the standard SDC workflow (full story + @product-lead validation).

## Protocol

### 1. Verify Eligibility
```bash
git diff --stat          # files and lines
git diff --name-only     # file list
```

Reject if: files in `.sinapse-ai/core/` or `bin/`, new deps, migrations, or API route changes.

### 2. Auto-Generate Story

Create at `docs/stories/active/fast-track-{YYYYMMDD}-{slug}.story.md` with:
- Frontmatter: `id: FT-{YYYYMMDD}-{seq}`, `status: Ready`, `fast-tracked: true`, `complexity: XS`
- Auto-generated description from git diff summary
- 3 acceptance criteria: change applied, no regressions, tests pass
- Scope IN (affected files) and OUT (everything else)
- Change log with auto-creation entry

### 3. Auto-Validate

Fast-track stories skip manual @product-lead validation (trivially small scope, no architectural decisions, minimal risk). Status set directly to `Ready`.

### 4. Proceed

Developer proceeds immediately after story creation.

## Output

```
## Fast-Track — {story_id}
- Eligibility: PASSED (type={type}, lines={n}, files={n})
- Story: docs/stories/active/{filename}
- Status: Ready (auto-validated)
- Proceed: YES
```

## Rules
- Fast-track is a CONVENIENCE, not an escape hatch — abuse is a process violation
- If in doubt about eligibility, use standard SDC
- Fast-tracked stories still require QA gate after implementation
- Maximum 3 fast-track stories per day per developer (prevents abuse)
- Reference: `.sinapse-ai/development/workflows/fast-track.yaml`
- Constitution Article III exception: trivial scope justifies bypassing manual validation
