# Context Window Optimization

> Token diet, compaction strategies, and 1M context management. Based on Claude Code internals + MS-009 Agentic Second Brain research.

---

## The Context Window as a Resource

**Karpathy (2025):** "Think of the LLM as a CPU, and its context window as RAM. Your job as an engineer is analogous to an OS: load exactly the right code and data for the task."

**Willison (2025):** "Context engineering is what we do instead of fine-tuning."

The context window is the scarcest resource in agentic systems. Every token has real cost. Every irrelevant token reduces quality.

---

## Context Budget Breakdown

### Claude Code Session Anatomy

```
TOTAL WINDOW: ~200,000 tokens (Sonnet/Opus)
  ├── System Prompt (static):   ~2,000 tokens (1%)       [CACHED]
  ├── CLAUDE.md hierarchy:      1-10,000 tokens (0.5-5%) [CACHED]
  ├── Rules files (loaded):     500-5,000 tokens (0.25-2.5%) [CACHED]
  ├── Tool definitions:         ~968 tokens (0.5%)        [DEFERRED]
  │   (after deferred loading; was 14-16K without)
  ├── Conversation history:     grows per turn            [COMPACTED]
  ├── Tool outputs:             variable                  [BUDGETED]
  └── Response budget:          ~50-100K tokens           [RESERVED]
```

### Token Sources by Control Level

| Source | Typical Size | Your Control |
|--------|-------------|--------------|
| System prompt | ~2-4K | None (fixed by CC) |
| CLAUDE.md (all levels) | 1-10K | Full |
| .claude/rules/ (loaded) | 0.5-5K | Full (conditional loading) |
| Conversation history | Grows per turn | Partial |
| Tool outputs | Variable | Partial (hooks) |
| MCP tool schemas | ~100-500 per server | Partial |
| Tool definitions | ~968 (deferred) or 14-16K (upfront) | Full |

**CLAUDE.md and rules = highest leverage targets** (full control, loaded every turn).

---

## Claude Code Compaction System

### 5-Layer Pipeline

| Layer | Strategy | API Cost | When |
|-------|----------|----------|------|
| **Tool Result Budget** | Caps individual result sizes | 0 | Continuous |
| **Snip Compact** | Removes unnecessary intermediate messages | 0 | As needed |
| **MicroCompact** | Merges consecutive tool-result/user pairs | 0 | Per turn |
| **Context Collapse** | Read-time projection over history | 0 | Near limit |
| **AutoCompact** | Complete summarization via forked agent | 1 | ~95% capacity |

**AutoCompact trigger:** ~95% context window capacity (25% remaining).

### What Survives Compaction

**Preserved:**
- CLAUDE.md (re-read from disk after each compaction)
- User requests and key code snippets
- "Compact Instructions" from CLAUDE.md
- Active plans and pending work

**Lost:**
- Instructions given in conversation (NOT in CLAUDE.md) — **put important instructions in CLAUDE.md, not chat**
- Error messages, line numbers, variable values, stack traces
- Reasoning behind decisions
- Specific debugging details

### Compact Instructions Section

Add to CLAUDE.md to control what AutoCompact preserves:

```markdown
## Compact instructions
- Preserve code paths and unresolved security questions
- Preserve diff summaries and failed test output
- Preserve current story ID and acceptance criteria
- Preserve any pending tasks and their status
```

---

## Token Reduction Techniques

### 1. Deferred Tool Loading (93% reduction on tool definitions)

The biggest single optimization since v2.1.69:

```
Before: ~14,000-16,000 tokens for all tool definitions
After:  ~968 tokens (ToolSearch + non-deferred tools)
```

Tools are discovered on-demand via `ToolSearchTool`. Only activated tools add to context.

### 2. Static/Dynamic Prompt Separation

```
[Static — before boundary]      ← Cached, shared across all users
  Identity, guidelines, tasks,
  actions, tools, tone, output
  ─────────────────────────────
[SYSTEM_PROMPT_DYNAMIC_BOUNDARY]
  ─────────────────────────────
[Dynamic — after boundary]      ← Not cached, session-specific
  Project context, CLAUDE.md,
  memory, env info, MCP instructions
```

**Cache hit rate** = biggest cost lever. A cache miss on static content = **5x cost for that turn**.

### 3. Rules File Conditional Loading

Without `paths:` frontmatter: rule loads globally (every interaction).
With `paths:` frontmatter: rule loads only when editing matching files.

```yaml
---
paths:
  - "src/api/**/*.ts"
---
# API Route Rules
Only loaded when editing API files.
```

**Strategy:** Convert global rules to scoped rules wherever possible.

### 4. CLAUDE.md Token Diet

**High-value content (include):**
- Project identity (1 sentence)
- Technology stack (table format)
- Non-obvious directory structure
- Conventions that differ from standard practices
- Anti-patterns (prevents costly mistakes)
- Common commands (build, test, lint)
- Known gotchas

**Low-value content (exclude):**
- Generic programming advice (Claude already knows)
- Standard framework conventions (React, Express, etc.)
- Obvious file purposes
- Long code examples (use one-liners or references)
- Historical context (why decisions were made)
- Duplicate information

### 5. Document Sharding

Large documents split into focused shards:

| Format | Token Size |
|--------|-----------|
| Single large PRD | ~5,000 tokens |
| Sharded (per section) | ~300 tokens each |
| **Savings** | **74-90%** |

Only load the shard relevant to current task.

### 6. Image Optimization

| Image Size | Token Cost |
|-----------|-----------|
| 200×200 pixels | 54 tokens |
| 1000×1000 pixels | 1,334 tokens |
| **Savings with cropping** | **25x** |

Always crop/resize images to minimum necessary for the task.

### 7. File Format Efficiency

| Format | Token Efficiency vs JSON | Notes |
|--------|------------------------|-------|
| Markdown | -16% tokens | Best for instructions, docs |
| YAML | Better for nested | 62% accuracy in nested structures |
| JSON | Baseline | Standard for schemas, APIs |

**Recommendation:**
- CLAUDE.md: Markdown
- Config: YAML frontmatter + Markdown body
- Skills/Agents: YAML frontmatter in `.md` files
- Settings: JSON
- Files: < 300 lines each

### 8. Model Routing (Tiered)

Not all decisions require frontier-class inference:

| Decision Type | Model | Cost Multiplier |
|-------------|-------|----------------|
| Planning complex tasks | Opus | 1.0x (baseline) |
| Code implementation | Sonnet | 0.33x |
| Permission checks | Haiku | 0.067x |
| Frustration detection | Regex | ~0x |
| Context compression (micro) | None (no API call) | 0x |

**Savings:** 40-70% total cost reduction with proper routing.

---

## 14 Cache-Break Vectors

Claude Code monitors 14 vectors that invalidate prompt cache:

1. Adding an MCP tool
2. Putting timestamp in system prompt (use in message instead)
3. Switching model mid-session
4. Changing images in prompt
5. Modifying tool settings
6. Adding/removing CLAUDE.md files
7. Changing rule files
8. Updating agent definitions
9. Modifying hook configurations
10. Changing environment variables in settings
11. Adding new MCP server instructions
12. Updating agent memory
13. Modifying project structure detected by hooks
14. Permission mode changes

**Sticky latches:** `afkModeHeaderLatched` and `fastModeHeaderLatched` prevent cache busts when toggling settings mid-session. Once latched, remains latched for session duration.

---

## Context Engineering for Multi-Agent

### Cache Sharing Between Subagents

Fork children use **byte-identical system prompt prefixes** to share KV cache:

```
Parent system prompt (cached):
  [System guidelines]
  [Project context]
  [CLAUDE.md]
  [Tool definitions]
  ────────────────────
  [Agent-specific task] ← unique per agent
```

**Cost:** "Spawning five forked agents costs barely more than 1."

**Requirement:** Agent prompts must be designed to maximize shared prefix length.

### Agent Memory Context Budget

For SINAPSE agents, recommended allocation:

```
200K token session:
  Agent persona (CLAUDE.md + rules): ~5K (2.5%)
  HOT memory (current task): ~20K (10%)
  WARM memory (retrieved context): ~30K (15%)
  Conversation history (compacted): ~20K (10%)
  Tool outputs (last N results): ~50K (25%)
  Response budget: ~75K (37.5%)
```

---

## The `lost-in-the-middle` Effect

Research finding: LLMs show significantly degraded performance when critical information appears in the **middle** of a long context. Performance peaks when information is at the beginning or end.

**Mitigation strategies:**
1. Put most important instructions in system prompt (beginning)
2. Put current task at end of context (just before response)
3. Use compaction to remove middle noise
4. Structure long contexts with clear section headers
5. Use explicit attention anchors ("IMPORTANT:", "CRITICAL:")

---

## Practical Optimization Checklist

### Before Starting a Session

- [ ] CLAUDE.md is under 200 lines
- [ ] No global rules that should be scoped rules
- [ ] Images cropped to necessary size
- [ ] `ENABLE_TOOL_SEARCH=auto` configured
- [ ] Compact instructions section in CLAUDE.md

### Before Each Agent Turn

- [ ] Is conversation history manageable? (< 50% of budget)
- [ ] Have tool outputs been budgeted? (large outputs truncated)
- [ ] Is the current task clearly specified in last message?
- [ ] Any irrelevant context that should be cleared?

### Red Flags (Memory Full Indicators)

- Claude asking for information it should have from CLAUDE.md
- Claude losing track of requirements mid-task
- Responses getting shorter and less detailed
- Claude proposing solutions already tried
- `/compact` triggered automatically

**Action on red flags:** Use `/compact` or `/clear` immediately. Or add key context to CLAUDE.md so it survives compaction.

---

## SINAPSE Context Architecture

### System Prompt Allocation

```
~/.claude/CLAUDE.md (global):     ~2K tokens
Project CLAUDE.md:                ~3K tokens
.claude/rules/ (all):             ~5K tokens
──────────────────────────────────
Total baseline:                   ~10K tokens
```

### Agent Memory Allocation

Each SINAPSE agent file: target < 300 lines / ~3K tokens.

**Why:** Agents are loaded into context when activated. Large agent definitions increase baseline cost for every session turn.

### KB Files in Context

Knowledge base files are NOT automatically loaded. They are:
- Referenced in CLAUDE.md or rules
- Loaded on-demand when agent needs specific knowledge
- Ideal for: reference material, patterns, examples

**Recommendation:** Keep KB files as standalone reference documents. Link from CLAUDE.md with `see squads/claude-code-mastery/knowledge-base/X.md` comments, not full @include.
