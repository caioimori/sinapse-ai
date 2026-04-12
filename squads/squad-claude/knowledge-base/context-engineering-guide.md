# Context Engineering Guide

## Overview

Context engineering is the practice of designing, optimizing, and maintaining the information that Claude Code receives in its context window. Every token matters — wasted tokens reduce capacity for actual work, while missing tokens cause misunderstandings and errors.

## The Context Budget

Claude Code's context window is shared across multiple sources:

```
Total Context = System Prompt + CLAUDE.md + Rules + Conversation + Tool Outputs + MCP Tools
```

| Source | Typical Size | Control Level |
|--------|-------------|---------------|
| System Prompt | ~2-4K tokens | None (fixed by Claude Code) |
| CLAUDE.md (all levels) | 1-10K tokens | Full control |
| .claude/rules/ (loaded) | 0.5-5K tokens | Full control (conditional loading) |
| Conversation history | Grows per turn | Partial (prompt design) |
| Tool outputs | Variable | Partial (output filtering hooks) |
| MCP tool schemas | ~100-500 per server | Partial (choose which servers) |

**Key insight:** CLAUDE.md and rules are the highest-leverage optimization targets because you have full control over them and they are loaded on every turn.

---

## CLAUDE.md Best Practices

### What to Include (High Value)

1. **Project identity** — One sentence: what this project is and does
2. **Technology stack** — Framework, language, key libraries (as a table, not paragraphs)
3. **Directory structure** — Only non-obvious directories and their purposes
4. **Coding conventions** — Only conventions that differ from standard practices
5. **Anti-patterns** — What Claude Code should NOT do (high-value, prevents costly mistakes)
6. **Common commands** — Build, test, lint, deploy commands
7. **Known gotchas** — Non-obvious project-specific traps

### What to Omit (Low Value)

1. **Generic programming advice** — Claude already knows how to write clean code
2. **Standard framework conventions** — Claude knows React, Next.js, Express conventions
3. **Obvious file purposes** — Don't explain that `package.json` manages dependencies
4. **Long code examples** — Use one-liners or references, not full implementations
5. **Historical context** — Why decisions were made matters less than what the current state is
6. **Duplicate information** — If it's in a rule file, don't repeat it in CLAUDE.md

### Structure Template

```markdown
# {Project Name}

{One sentence description}

## Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Backend | Node.js + Express |
| Database | PostgreSQL via Supabase |
| Testing | Jest + RTL |

## Structure
- `src/components/` — React components (PascalCase)
- `src/api/` — API routes (kebab-case)
- `src/lib/` — Shared utilities

## Commands
- `npm run dev` — Start dev server (port 3000)
- `npm test` — Run tests
- `npm run lint` — ESLint + Prettier

## Anti-Patterns
- NEVER use `any` type — always define explicit types
- NEVER import from `src/` using relative paths — use `@/` alias
- NEVER commit .env files

## Gotchas
- Auth middleware must be applied before route handlers
- Supabase RLS policies apply even in server-side contexts
```

### CLAUDE.md Hierarchy

Claude Code loads CLAUDE.md files hierarchically:

1. **Root CLAUDE.md** — Always loaded. Contains project-wide instructions.
2. **Directory CLAUDE.md** — Loaded when files in that directory are being edited. Contains directory-specific instructions.

**Strategy:** Put universal instructions in root, put context-specific instructions in directory-level files or .claude/rules/.

---

## Rules Architecture

### Global Rules (No paths: frontmatter)

Files in `.claude/rules/` without `paths:` frontmatter load on every interaction. Use sparingly — each global rule consumes context on every turn.

**Good candidates for global rules:**
- Git conventions
- Code review standards
- Security policies
- Agent authority matrix

### Contextual Rules (With paths: frontmatter)

Files with `paths:` frontmatter only load when matching files are being edited. This is the key to context efficiency.

```yaml
---
paths:
  - "src/components/**/*.tsx"
  - "src/components/**/*.ts"
---

# React Component Rules

- Use functional components with hooks
- Export components as named exports
- Co-locate component tests as ComponentName.test.tsx
- Use CSS Modules for styling (ComponentName.module.css)
```

### Rule Organization Strategy

```
.claude/rules/
├── git-conventions.md          # Global (no paths:)
├── security-policies.md        # Global (no paths:)
├── react-components.md         # paths: src/components/**
├── api-routes.md               # paths: src/api/**
├── database-queries.md         # paths: src/db/**, src/lib/db/**
├── testing-standards.md        # paths: **/*.test.*, **/*.spec.*
└── ci-cd-workflows.md          # paths: .github/workflows/**
```

**Token impact:** If a project has 5 contextual rules at ~500 tokens each, only 1-2 load per interaction instead of all 5. That's 1.5-2K tokens saved per turn.

---

## Context Compression Strategies

### Strategy 1: Tables Over Prose

**Before (85 tokens):**
> When writing API routes, you should always use the Express router pattern. Each route should be in its own file. The file name should use kebab-case. The route handler function should use camelCase. Always include error handling middleware.

**After (45 tokens):**

| API Convention | Rule |
|---------------|------|
| Pattern | Express router, one route per file |
| File naming | kebab-case |
| Function naming | camelCase |
| Error handling | Always include middleware |

### Strategy 2: Reference Over Reproduce

**Before (200+ tokens):**
```typescript
// Full example of how to create a component
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button className={styles[variant]} onClick={onClick}>
      {label}
    </button>
  );
};
```

**After (30 tokens):**
> Components: See `src/components/Button/Button.tsx` for reference pattern (named export, CSS Modules, typed props).

### Strategy 3: Conditional Loading

Move specialized knowledge to `.claude/rules/` with `paths:` frontmatter instead of keeping it in the always-loaded CLAUDE.md.

**Before:** 8K token CLAUDE.md with React, API, database, and testing sections all loading every time.

**After:** 2K token CLAUDE.md (universal) + 4 rule files at 1.5K each, loading only when relevant. Typical turn loads 2K + 1.5K = 3.5K instead of 8K.

### Strategy 4: Eliminate Redundancy

Common duplications to consolidate:
- Same coding standards in CLAUDE.md AND in rules files
- Same anti-patterns listed in multiple rule files
- Same command references in CLAUDE.md AND in CI/CD rules
- Same directory descriptions in CLAUDE.md AND in directory-level CLAUDE.md files

---

## Memory Management

### Session Memory

Claude Code maintains conversation context within a session. To manage it:

1. **Front-load important context** — Put critical instructions early in the conversation
2. **Avoid repetition** — Don't re-explain what's in CLAUDE.md each turn
3. **Use tool outputs wisely** — Don't Read files unless needed; each Read consumes tokens
4. **Batch operations** — Multiple parallel tool calls in one turn instead of sequential turns

### Cross-Session Memory

Claude Code does not retain memory across sessions. To maintain continuity:

1. **CLAUDE.md** — Persistent project knowledge
2. **Agent MEMORY.md files** — Agent-specific state per squad
3. **Story files** — Task progress tracking
4. **Git history** — Code change context

### Context Window Overflow

When the context window fills up:
- Claude Code truncates oldest conversation messages
- CLAUDE.md and rules are always preserved (they reload fresh)
- Tool outputs from early in the conversation may be lost

**Mitigation:** Keep CLAUDE.md concise so more room is available for conversation.

---

## Context Rot Detection

### Indicators of Context Rot

| Indicator | Description | Detection Method |
|-----------|-------------|-----------------|
| **Staleness** | References to files, commands, or features that no longer exist | Compare references against current project state |
| **Redundancy** | Same information in multiple places | Diff CLAUDE.md against rules files |
| **Contradiction** | Conflicting instructions across files | Cross-reference rules for conflicts |
| **Bloat** | Information Claude Code already knows generically | Review for standard framework conventions |
| **Orphaned rules** | Rules with `paths:` patterns matching no files | Validate glob patterns against file tree |

### Maintenance Schedule

| Frequency | Action |
|-----------|--------|
| Per sprint | Check for staleness (removed features, changed paths) |
| Monthly | Full redundancy and contradiction scan |
| Per major refactor | Update all file path references |
| Quarterly | Full context rot audit (all indicators) |

---

## Measuring Context Efficiency

### Tokens Per Value Unit

Calculate how many tokens are spent per unit of value:

- **Essential tokens:** Content Claude Code cannot function correctly without
- **Helpful tokens:** Content that improves quality but is not critical
- **Waste tokens:** Content that adds no value (redundant, stale, generic)

**Target ratio:** >= 80% essential + helpful, < 20% waste.

### Context Load per Interaction

Monitor the average number of tokens loaded per interaction:

- Base load: System prompt + root CLAUDE.md + global rules
- Variable load: Contextual rules + conversation
- Tool load: MCP schemas + tool outputs

**Target:** Base load should be < 30% of total context capacity, leaving >= 70% for conversation and tool outputs.
