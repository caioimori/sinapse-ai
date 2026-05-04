# Skill Creation Patterns

> Complete guide to the Agent Skills ecosystem. Based on skills-ecosystem-analysis research (April 2026). 1,060+ skills catalogued, 33 platforms supporting the format.

---

## The Agent Skills Standard

### What Skills Are

Skills are **portable, on-demand capability packages** that teach agents how to accomplish domain-specific tasks. Not tools (which provide programmatic access) — skills are **knowledge and workflow instructions** that agents load when needed.

**The key difference:**
| Concept | What it is | When to use |
|---------|-----------|-------------|
| **Skill** | Instructions + resources teaching the agent a workflow | Agent needs domain expertise or methodology |
| **MCP Tool** | Server exposing programmatic actions via protocol | Agent needs API/DB/external service access |
| **Hook** | Script intercepting lifecycle events | Enforcement, validation, automation |
| **CLAUDE.md** | Global project instructions | Conventions, rules, project context |

### Format Standard (agentskills.io)

The `SKILL.md` format is supported by **33 platforms** (April 2026), including Claude Code, Codex, Gemini CLI, Cursor, VS Code, GitHub Copilot, and 27+ others.

**Key principle:** Write once, run anywhere.

---

## SKILL.md File Format

### Directory Structure

```
skill-name/
  SKILL.md          # REQUIRED: metadata + instructions
  scripts/          # Optional: executable scripts
  references/       # Optional: supplementary documentation
  assets/           # Optional: templates, static resources
  LICENSE.txt       # Optional: license
```

**Rule:** Folder name MUST match the `name` field in frontmatter.

### Frontmatter Specification

| Field | Required | Constraints | Description |
|-------|----------|-------------|-------------|
| `name` | Yes | Max 64 chars, lowercase + hyphens, no consecutive hyphens | Unique identifier |
| `description` | Yes | Max 1024 chars | What it does AND when to use it |
| `license` | No | License name or file reference | Distribution terms |
| `compatibility` | No | Max 500 chars | Environment requirements |
| `metadata` | No | `map<string, string>` | Arbitrary key-value pairs |
| `allowed-tools` | No | Experimental | Pre-approved tools list |

**Minimal example:**
```yaml
---
name: pdf-processing
description: Extract PDF text, fill forms, merge files. Use when handling PDFs.
---
```

**Complete example:**
```yaml
---
name: security-audit
description: |
  Audit code for security vulnerabilities including injection flaws, 
  auth issues, and secret exposure. Use when reviewing PR diffs, 
  new features, or when user mentions security review.
license: Apache-2.0
compatibility: Requires Python 3.12+
metadata:
  author: squad-claude
  version: "1.0"
  category: security
allowed-tools: Read Grep Glob Bash(git diff *)
---
```

### Progressive Disclosure (3 levels)

The most critical architectural pattern in the skill system:

| Level | What loads | When | Ideal size |
|-------|-----------|------|-----------|
| 1. Metadata | `name` + `description` | Always (startup) | ~100 tokens |
| 2. Instructions | Full SKILL.md body | When skill is activated | < 5,000 tokens (~500 lines) |
| 3. Resources | Files in scripts/, references/, assets/ | On-demand | Unlimited |

**Critical rule: Keep SKILL.md under 500 lines.** Move detailed reference material to separate files.

---

## Quality Patterns

### Writing Effective Descriptions

The description is NOT just documentation — it's the **primary activation mechanism**. Agents use descriptions to decide when to invoke skills.

**Anti-pattern (vague):**
```yaml
description: "Helps with code review"
```

**Best practice (specific + trigger keywords):**
```yaml
description: |
  Review code changes for security vulnerabilities, logic errors, and style violations.
  Use when: reviewing PRs, auditing new features, after implementing auth/payment code,
  or when user asks for code review, security check, or audit.
```

**Anthropic recommendation:** Make descriptions "a bit pushy" to counter the tendency of under-triggering. Include specific keywords users might say.

### Instruction Principles

1. **Imperative, not declarative** — "Do X" not "X should be done"
2. **Concrete examples** — Every skill should have input/output examples
3. **Decision trees** — Complex skills need explicit when/when-not-to-use branches
4. **Reference templates** — Link to templates in sub-folders, don't inline everything
5. **No inventions** — Skills teach existing patterns, not invented ones
6. **Scripts as black boxes** — Scripts in `scripts/` should be called with `--help` first, not read inline

### Decision Tree Pattern

```markdown
## When to Use This Skill

Use this skill when:
- User mentions "security review", "audit", "vulnerability"
- PR contains changes to auth, payments, or user data
- New API endpoints are being added

Do NOT use when:
- Simple read-only changes (cosmetic, docs)
- Test-only changes
- User explicitly asks for implementation help (not review)

## Decision Process

1. Read the diff/changed files
2. Check for [high-risk patterns]:
   - SQL string concatenation → BLOCK, flag injection risk
   - Hardcoded credentials → BLOCK, flag secret exposure
   - Missing input validation → WARN, suggest Zod schema
   - RLS disabled → BLOCK, flag security regression
3. Summarize findings by severity: CRITICAL / HIGH / MEDIUM / LOW
```

---

## Official Anthropic Skills (17 skills)

### Plugin: document-skills (source-available)

| Skill | Capability |
|-------|-----------|
| `docx` | Word document creation/editing with tracked changes |
| `pdf` | Full PDF manipulation (extract, merge, fill forms) |
| `pptx` | PowerPoint creation/editing |
| `xlsx` | Excel creation/editing with formulas and charts |

### Plugin: example-skills (Apache 2.0)

| Skill | Capability |
|-------|-----------|
| `algorithmic-art` | Generative art with p5.js and seeded randomness |
| `brand-guidelines` | Anthropic visual identity application |
| `canvas-design` | Visual design in PNG/PDF |
| `doc-coauthoring` | Document co-authoring |
| `frontend-design` | Production-grade interfaces without "AI slop" |
| `internal-comms` | Internal communications (status reports, newsletters) |
| `mcp-builder` | Guide for creating MCP servers |
| `skill-creator` | Meta-skill for creating new skills |
| `slack-gif-creator` | Animated GIFs optimized for Slack |
| `theme-factory` | Visual theme creation |
| `web-artifacts-builder` | Interactive HTML artifacts |
| `webapp-testing` | Web app testing with Playwright |

### Plugin: claude-api

| Skill | Capability |
|-------|-----------|
| `claude-api` | Claude API documentation and SDK (Python, TS, Java, Go, Ruby, C#, PHP) |

---

## Ecosystem Numbers (April 2026)

| Metric | Value |
|--------|-------|
| Skills catalogued (VoltAgent/awesome-agent-skills) | 1,060+ |
| Dev teams contributing | 38+ |
| Categories | 11+ |
| Official vendor skills | 307 |
| Community skills | 144+ |
| Platforms supporting SKILL.md format | 33 |
| Notable community frameworks | Tens to hundreds of K stars (varies) |

### Quality Distribution

| Tier | Description | Estimated % |
|------|-------------|-------------|
| S-tier | Official Anthropic + top-tier security-reviewed sources | ~5% |
| A-tier | Official vendors (Vercel, Netlify, Expo, Microsoft) | ~15% |
| B-tier | Strong community (documented, tested) | ~25% |
| C-tier | Basic community (functional, no polish) | ~35% |
| D-tier | Low-effort / AI-generated bulk | ~20% |

---

## Community Skill Framework Patterns

Community skill frameworks commonly converge on a shared set of high-value meta-skills,
which inform SINAPSE's own skill taxonomy.

### Common Skill Categories Observed

- Structured ideation / brainstorming
- Parallel agent orchestration
- Implementation plan execution
- Branch finalization flows
- Code review reception / solicitation
- Subagent-driven development
- Systematic debugging
- TDD workflow
- Worktrees for parallelism
- Pre-delivery verification
- Implementation plan writing
- Meta-skills for creating skills

### Recurring Methodology (5 steps)

1. Understand what user wants (spec)
2. Show spec in digestible chunks
3. Create implementation plan suited to a junior-level contributor
4. Subagent-driven development (one agent per task)
5. Two-stage review (spec compliance + code quality)

---

## Skills for SINAPSE Squad-Claude

### Existing Skills to Build

| Skill | Priority | Description |
|-------|----------|-------------|
| `claude-code-audit` | High | Audit CC configuration, hooks, settings |
| `sinapse-setup` | High | Initialize SINAPSE in a new project |
| `agent-persona-creation` | High | Create new agent .md files |
| `hooks-architecture` | Medium | Design and implement hook systems |
| `mcp-server-setup` | Medium | Configure and test MCP servers |
| `context-optimization` | Medium | Analyze and reduce context window usage |
| `skill-creation` | High | Meta-skill — create new SINAPSE skills |
| `squad-publishing` | Low | Package and publish squads |

### Skill Template for SINAPSE

```yaml
---
name: {skill-name}
description: |
  {What it does in 1-2 sentences}. 
  Use when: {specific trigger conditions — include keywords users say}.
license: Apache-2.0
metadata:
  author: squad-claude
  version: "1.0"
  category: {claude-code|configuration|agent|workflow}
allowed-tools: {space-separated list or omit}
---

## Purpose

{Brief purpose statement}

## Prerequisites

- {Requirement 1}
- {Requirement 2}

## When to Use

Use this skill when:
- {Trigger condition 1}
- {Trigger condition 2}

Do NOT use when:
- {Anti-trigger 1}

## Process

1. **{Step 1}**
   {Instructions}

2. **{Step 2}**
   {Instructions}

## Outputs

- `{file/artifact}` — {description}

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| {issue} | {cause} | {fix} |
```

---

## Plugin Distribution System

### Plugin Manifest (marketplace.json)

```json
{
  "name": "sinapse-claude-skills",
  "plugins": [
    {
      "name": "development-workflow",
      "description": "Skills for Claude Code configuration and SINAPSE workflows",
      "source": "./",
      "strict": false,
      "skills": [
        "./skills/claude-code-audit",
        "./skills/sinapse-setup",
        "./skills/agent-persona-creation"
      ]
    }
  ]
}
```

### Installation

```bash
/plugin marketplace add sinapse-ai/squad-claude-skills
/plugin install development-workflow@sinapse-claude-skills
```

### Namespacing

Skills from plugins receive prefix: `plugin-name:skill-name`

Example: `sinapse-claude:claude-code-audit`

---

## Platform Compatibility Matrix

| Platform | Support | Notes |
|----------|---------|-------|
| Claude Code | Full | Native marketplace |
| Codex | Full | `.codex/skills/` directory |
| Gemini CLI | Full | Standard SKILL.md |
| Cursor | Full | Marketplace |
| VS Code | Full | Extension integration |
| GitHub Copilot | Full | Instruction-based |
| OpenCode | Full | Fetch + install |
| OpenHands | Full | Cloud platform |
| Spring AI | Native | Framework integration |
| 25+ others | Full | Via agentskills.io spec |

---

## Anti-Patterns

| Anti-pattern | Problem | Fix |
|-------------|---------|-----|
| Vague description | Skill never triggers | Add specific keywords + trigger conditions |
| SKILL.md > 500 lines | Context pollution | Move details to `references/` subfolder |
| Scripts inlined in SKILL.md | Unmanageable | Put in `scripts/`, call with `--help` first |
| Inventing workflows | No grounding | Only document validated, existing patterns |
| Single monolithic skill | Hard to maintain | Split into focused single-responsibility skills |
| No examples | Agents misuse skill | Include concrete input/output examples |
| Hardcoded paths | Portability failures | Use relative paths and env vars |
