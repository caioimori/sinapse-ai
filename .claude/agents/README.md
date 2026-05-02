# `.claude/agents/` — Activator Pattern

> Block 3a (pre-GA hardening). Decision 2a from clinical audit dim-4.

## What lives here

This directory contains **two kinds** of files. Both are intentional. Block 2 of the pre-GA audit (dim-4 subagents) found 134 of 178 files are 4-line stubs while 45 carry full YAML frontmatter — this README makes the design explicit so future contributors do not "fix" a stub thinking it is a bug.

### 1. Activator stubs (~134 files)

Tiny 4-line pointers like:

```markdown
---
name: ad-copywriter
---

Activate agent: ad-copywriter
```

When Claude Code loads, it indexes every file under `.claude/agents/` so the user can invoke `@ad-copywriter` or `/SINAPSE:agents:ad-copywriter` in chat. The stub is the **discoverable surface**: it lets Claude Code recognize the name and route the request. The actual persona, tools, and instructions live elsewhere — typically in `squads/squad-X/agents/*.md` or in the SINAPSE skill registry — and load on demand.

**Why stubs and not full subagents for these?**

- A full subagent file ships with its own tool list, instructions, and persona definition (see the next group). That payload travels with `.claude/agents/` to every install.
- Most personas (ad-copywriter, designers, council members, etc.) are content-heavy — their wisdom lives in the squad knowledge bases, not in tool wiring. A stub plus on-demand load keeps `.claude/agents/` light and fast.
- Stubs make the namespace browseable (`ls .claude/agents/`) without forcing every persona to declare a Claude Code subagent contract.

### 2. Full subagents (~45 files, with frontmatter)

Files like `analyst.md`, `architect.md`, `developer.md`, `quality-gate.md` ship with the complete Claude Code subagent shape:

```markdown
---
name: developer
description: …
tools: Read, Edit, Bash, …
---

(Full persona definition + commands)
```

These are the **framework core** agents that Claude Code spawns directly with a defined tool budget. They need the full subagent contract because they execute autonomous tool sequences (story creation, code edits, QA gates, push operations).

## Adding a new agent

| If the agent is… | Use this pattern |
|---|---|
| A content-heavy persona (copywriter, designer, advisor, council member) | **Stub** — `name:` frontmatter + 1-line activate body. Real definition lives in `squads/squad-X/agents/`. |
| A framework agent that runs tool sequences (story flow, QA, devops) | **Full subagent** — frontmatter with `name`, `description`, `tools`, plus full persona body. |

Whichever kind you ship, also register the agent in `entity-registry.yaml` and run `npm run sync:ide` so the install manifest sees it.

## Open question (post-GA follow-up)

If telemetry shows specific stubs invoked very frequently, it may pay to convert them to full subagents — bigger payload upfront in exchange for tool affordances at invocation time. We will revisit per-stub after v1.0.0 ships.

## Related references

- `entity-registry.yaml` — canonical entity list (stubs + full subagents both registered)
- `.sinapse-ai/development/agents/` — framework agent source-of-truth (kebab-case files)
- `squads/squad-X/agents/` — squad agent source-of-truth (full persona definitions)
- `docs/audits/audit-dim-04-subagents.md` — audit that grandfathered the activator pattern

---

*Last reviewed: Block 3a (pre-GA hardening).*
