# Token Economy Guide

> Practical strategies for managing Claude Code context window efficiently.
> Based on SINAPSE research-02 (token economy) findings.

---

## When to Compact

| Trigger | Default | Recommended |
|---------|---------|-------------|
| Auto-compact threshold | 83% context usage | 60% context usage |
| Manual `/compact` | User-initiated | At every agent switch, after large file reads |
| Pre-agent-switch | Not automatic | Use handoff protocol (~379 tokens vs ~3-5K) |

**Why 60%?** At 83% the model is already losing coherence on early context. Compacting at 60% preserves decision quality and avoids "context amnesia" on key instructions.

---

## What Survives Compaction

| Component | Survives? | Notes |
|-----------|-----------|-------|
| CLAUDE.md (project + global) | YES | Always re-injected |
| Active rules (`.claude/rules/`) | YES | Path-filtered rules re-evaluated |
| Tool definitions (Tier 1) | YES | Native tools always available |
| Current file contents | NO | Must re-read after compact |
| Conversation history | PARTIAL | Summarized, not verbatim |
| Agent persona | NO | Must re-activate agent |
| Handoff artifacts | YES | Stored in `.sinapse/handoffs/` |
| PreCompact hook digest | YES | `precompact-wrapper.cjs` saves session state |

---

## Token Cost per Component

### Fixed Costs (every session)

| Component | Approx. Tokens | Notes |
|-----------|---------------|-------|
| Global CLAUDE.md | ~890 | `~/.claude/CLAUDE.md` |
| Project CLAUDE.md | ~1,800 | `.claude/CLAUDE.md` |
| Each rule file | 500-2,000 | `.claude/rules/*.md` |
| Total rules (12 files) | ~12,000 | Loaded on session start |
| System prompt overhead | ~2,000 | Claude Code harness |
| **Baseline per session** | **~17,000** | Before any work begins |

### Variable Costs

| Component | Approx. Tokens | Notes |
|-----------|---------------|-------|
| Agent persona activation | ~800 | Full agent profile |
| Agent handoff artifact | ~379 | Compacted from ~3-5K |
| Sub-agent spawn | ~20,000 min | Task tool creates new context |
| Tool search result | ~500-1,500 | Per deferred tool schema loaded |
| File read (typical) | ~1,000-5,000 | Depends on file size |
| Grep/Glob results | ~200-2,000 | Depends on match count |
| MCP tool definition | ~300-800 | Per tool schema |

---

## Model Routing Table

| Task Type | Recommended Model | Rationale |
|-----------|------------------|-----------|
| Architecture decisions | Opus | Needs deep reasoning |
| Code implementation | Opus / Sonnet | Opus for complex, Sonnet for routine |
| Code review | Sonnet | Pattern matching, fast feedback |
| Research / analysis | Opus | Multi-source synthesis |
| Documentation | Sonnet | Structured output, fast |
| Quick Q&A / lookups | Haiku | Minimal context needed |
| Sub-agent workers | Haiku / Sonnet | Cost-effective for scoped tasks |
| Bulk file processing | Haiku | High throughput, low cost |

---

## Optimization Strategies

### 1. YAML over JSON for Configuration

YAML is 15-30% more token-efficient than JSON for the same data:

```yaml
# YAML: ~45 tokens
name: feature
status: active
tags:
  - ci
  - security
```

```json
// JSON: ~60 tokens
{
  "name": "feature",
  "status": "active",
  "tags": ["ci", "security"]
}
```

### 2. Path-Filtered Rules

Rules with `paths:` frontmatter only load when working on matching files:

```yaml
---
paths:
  - "packages/db/**"
  - "migrations/**"
---
# Database rules (only loaded for DB work)
```

This avoids loading ~2K tokens of DB rules when doing frontend work.

### 3. Deferred Tool Loading (3-Tier Mesh)

| Tier | Loading | Token Impact |
|------|---------|-------------|
| Tier 1 (Always) | Session start | ~5K fixed cost |
| Tier 2 (Deferred) | Agent activation | ~2K per agent |
| Tier 3 (Deferred) | Tool search | ~500-1.5K on demand |

Never load Tier 3 tools speculatively. Use `ToolSearch` only when needed.

### 4. Agent Handoff Compaction

Each agent switch without handoff protocol wastes ~3-5K tokens. With protocol:

| Switches | Without Protocol | With Protocol | Savings |
|----------|-----------------|---------------|---------|
| 1 | ~8K | ~5.4K | 33% |
| 2 | ~12K | ~5.2K | 57% |
| 3 | ~16K | ~5.6K | 65% |

### 5. Batch Tool Calls

Independent operations should run in parallel:

```
# Bad: 3 sequential turns (~500 tokens overhead each)
Read file A → Read file B → Read file C

# Good: 1 parallel turn (~500 tokens overhead once)
Read file A | Read file B | Read file C
```

### 6. Targeted File Reads

```
# Bad: Read entire 500-line file
Read(file, offset=0)

# Good: Read only the function you need
Read(file, offset=142, limit=30)
```

### 7. Limit Search Results

Always use `head_limit` on Grep/Glob to avoid flooding context:

```
# Bad: returns 250 matches (default)
Grep(pattern="TODO")

# Good: returns top 10
Grep(pattern="TODO", head_limit=10)
```

---

## Anti-Patterns

| Anti-Pattern | Token Waste | Fix |
|-------------|-------------|-----|
| Reading same file multiple times | ~2-5K per read | Read once, reference line numbers |
| Loading all MCP tools eagerly | ~10-20K | Use 3-Tier deferred loading |
| Full agent persona on every switch | ~3-5K per switch | Use handoff protocol |
| Unbounded grep results | ~5-10K | Use head_limit |
| Re-reading files after edit | ~2-5K | Edit tool confirms success |
| Spawning sub-agents for simple tasks | ~20K minimum | Do inline if <5 tool calls |
| Not compacting before long tasks | Gradual degradation | Compact at 60% |

---

## Quick Reference: Context Budget

For a 200K token context window:

| Allocation | Tokens | % |
|-----------|--------|---|
| System + CLAUDE.md + Rules | ~17K | 8.5% |
| Active agent + tools | ~5K | 2.5% |
| Working memory (files, results) | ~80K | 40% |
| Conversation history | ~58K | 29% |
| Safety buffer (compact at 60%) | ~40K | 20% |

**Target:** Keep working memory under 80K by reading only what you need and compacting frequently.
