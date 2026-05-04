# Scrum Master Agent Memory (Sync)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Key Patterns
- CommonJS (`require`/`module.exports`), NOT ES Modules
- ES2022, Node.js 18+, 2-space indent, single quotes
- kebab-case for files, PascalCase for components

### Project Structure
- `docs/stories/epics/` — Epic directories with INDEX.md + stories
- `.sinapse-ai/development/templates/` — Story templates
- `.sinapse-ai/development/checklists/` — Draft checklists

### Git Rules
- NEVER push — delegate to @devops
- Conventional commits: `docs:` for story creation

### Story Conventions
- Story naming: `story-{PREFIX}-{N}-{slug}.md`
- Epic INDEX.md tracks all stories with status
- Stories flow: Draft → Ready → InProgress → InReview → Done
- Epic 10 stories use frontmatter YAML header + numbered flat filename (e.g., `10.17-slug.story.md`)
- 10.15 = InReview, 10.16 = Done (as of 2026-04-11); next available = 10.17

### Authorial Hygiene Rules
- ZERO external framework references in committed files — the exact forbidden-terms regex lives in `scripts/validate-no-external-refs.js` (case-insensitive `\b` word-boundary match)
- Allow-list of files that may legitimately contain such terms: `LICENSE` (legal MIT attribution) and `docs/research-synthesis-for-upgrade.md` (historical process document) — hardcoded in the same validator
- Story 10.17 created the CI guard (`external-refs-validation` job) that enforces this permanently on every PR
- Drafting rule for @sprint-lead: when writing story notes about this policy, NEVER repeat the forbidden terms as literal text — reference `scripts/validate-no-external-refs.js` instead

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

