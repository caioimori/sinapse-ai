# Claude Code Internals — Deep Reference

> Source: Analysis from source code leak (npm v2.1.88, March 31 2026). 512K+ lines TypeScript, 1,902 files, 35 subsystems, 184 tools, 44 feature flags.

---

## Architecture Overview

### 5 Architectural Layers

| Layer | Function | Components |
|-------|----------|------------|
| **Agent Loop** | Task decomposition, tool selection | Tool calls, file reads, retries |
| **Context & Memory** | Knowledge persistence | CLAUDE.md, auto-memory, history |
| **Execution Surface** | System actions | Read, Edit, Bash, subagents, worktrees |
| **Governance & Safety** | Permission limits | Permission modes, hooks, sandboxing |
| **Extensibility** | New capabilities | Skills, plugins, MCP, Agent SDK |

### Scale

| Metric | Value |
|--------|-------|
| Source lines | 512,000+ TypeScript |
| Source files | 1,902 |
| Subsystems | 35 |
| Tool modules | 184 |
| Commands | 207 |
| Feature flags | 44 |
| Built-in skills | 20 modules |
| Bridge modules | 31 |

---

## Agent Loop

The fundamental loop is deliberately minimal (~20 lines). The 512K lines represent **supporting infrastructure**, not control logic.

```
1. User Input → Add as message to session
2. API Call → stream with current context
3. Message Assembly → Collect text + tool-use events
4. Tool Detection → Extract pending tool invocations
5. Permission Authorization → Check against PermissionPolicy
6. Hook Execution → Run PreToolUse/PostToolUse via HookRunner
7. Tool Execution → Delegate to ToolExecutor
8. Result Recording → Store tool results as messages
9. Loop → Repeat until no pending tools or max_iterations
```

**Key insight:** "Overengineering control flow (state machines, DAG orchestration) is misplaced effort. Keep iteration patterns austere and invest in the ecosystem surrounding them."

### Query Engine

`QueryEngine.ts` = 46,000 lines, single file containing all LLM API interaction.

**4 layers:**
1. `submitMessage()` — validate and build system prompt
2. `queryLoop()` — `while(true)` agentic loop
3. `queryModel/callModel` — Anthropic API wrapper with streaming
4. Stop hooks + token budget logic

**7 continuation reasons:**
1. `max_output_tokens_escalate`
2. `max_output_tokens_recovery`
3. `reactive_compact_retry`
4. `collapse_drain_retry`
5. `stop_hook_blocking`
6. `token_budget_continuation`
7. Tool-use loop (implicit)

### Retry Logic

- Up to 10 retries with exponential backoff + jitter
- 529 (Overloaded): foreground retries, background bails immediately
- Opus Fallback: after 3 consecutive 529s on Opus, triggers `FallbackTriggeredError`
- Context Overflow 400: computes new `maxTokensOverride`
- Persistent Mode: indefinite retry, 30-min cap, heartbeat messages

---

## Boot Sequence (12 Phases)

```
Phase 1: CliEntry — CLI argument parsing
Phase 2: FastPathVersion — version check
Phase 3: StartupProfiler — performance profiling
Phase 4: SystemPromptFastPath — system prompt pre-computation
Phase 5: ChromeMcpFastPath — Chrome MCP fast path
Phase 6: DaemonWorkerFastPath — daemon worker initialization
Phase 7: BridgeFastPath — IDE bridge initialization
Phase 8: DaemonFastPath — daemon mode fast path
Phase 9: BackgroundSessionFastPath — background session
Phase 10: TemplateFastPath — template processing
Phase 11: EnvironmentRunnerFastPath — environment runner
Phase 12: MainRuntime — full runtime initialization
```

**Parallel prefetch during startup (~135ms window):**
- `startMdmRawRead()` — MDM policy queries (20-40ms)
- `startKeychainPrefetch()` — OAuth + API keys (~65ms on macOS)

**Bare Mode** (`--bare` / `CLAUDE_CODE_SIMPLE`): eliminates UDS server, teammate snapshot, session memory, plugin hooks, attribution, deferred prefetches. For CI/scripted use.

---

## System Prompt Construction

### 6 Assembly Layers

1. Priority Resolver (`systemPrompt.ts`) — waterfall decision tree
2. Content Factory (`prompts.ts`) — static + dynamic sections
3. Section Registry (`systemPromptSections.ts`) — memoization control
4. CLAUDE.md Loader (`claudemd.ts`) — multi-scope file discovery
5. Memory System (`memdir/memdir.ts`) — auto-memory injection
6. Cache Boundary — global vs session-scoped split

### Cache Boundary: `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__`

**Before boundary (static, globally cached — shared across ALL users):**
- Intro (identity, URL guard, cyber-risk)
- System (markdown, permission modes, injection warnings)
- Doing Tasks (YAGNI, security, code-style)
- Actions (reversibility, blast-radius)
- Using Tools (hierarchy, parallelism)
- Tone & Style (no emojis, file:line refs)
- Output Efficiency

**After boundary (dynamic, session-specific):**

| Section | Cache | Content |
|---------|-------|---------|
| session_guidance | memoized | Questions, shell tips, agent contracts |
| memory | memoized | CLAUDE.md hierarchy + MEMORY.md |
| env_info_simple | memoized | CWD, git, shell, platform, model, cutoff |
| mcp_instructions | **volatile** | Per-server instructions (reconnect-aware) |
| scratchpad | memoized | Session directory + rules |
| token_budget | memoized | Target approach instruction |

**Constants:**
- `MAX_INSTRUCTION_FILE_CHARS`: 4,000 characters per file
- `MAX_TOTAL_INSTRUCTION_CHARS`: 12,000 characters total
- `FRONTIER_MODEL_NAME`: "Opus 4.6"

### CLAUDE.md Hierarchy (4 scopes)

1. **Managed** (`/etc/claude-code/CLAUDE.md`) — machine-wide, cannot be overridden
2. **User** (`~/.claude/CLAUDE.md`) — cross-project private
3. **Project** (`CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md`) — versioned in git
4. **Local** (`CLAUDE.local.md`) — project-specific private

**@include directive:**
```
@shared-rules.md           (relative)
@~/company/standards.md    (home-relative)
@/absolute/path/rules.md   (absolute)
```

**Path filtering (frontmatter):**
```yaml
---
paths:
  - src/components/**
  - "*.tsx"
---
Always use named exports in React components.
```

---

## Memory Architecture

### Three-Layer Self-Healing Memory

| Layer | Storage | Access | Size Limit |
|-------|---------|--------|------------|
| MEMORY.md index | Always in context | Instant | 200 lines / 25KB |
| Topic files | On-demand | Per request | Variable |
| Session transcripts | grep-searchable only | Never auto-loaded | Unlimited |

**Design principles:**
- Memory treated as **hints**, not ground truth
- Agent instructed to **verify against actual codebase** before acting
- **Strict Write Discipline** — updates only after successful actions

### AutoDream — Memory Consolidation

**3-gate trigger (ALL required):**
1. >= 24 hours since last cycle
2. >= 5 sessions completed
3. Consolidation lock (prevents concurrency)

**4 phases:**
1. **Orient** — read memory directory and MEMORY.md
2. **Gather** — collect new info from daily logs
3. **Consolidate** — merge new with existing, remove contradictions
4. **Prune** — maintain MEMORY.md < 200 lines/25KB

Runs in **forked subagent with read-only Bash access**. Feature gated under KAIROS.

---

## Compaction System

### 5 Compaction Strategies (pipeline order)

| Strategy | API Calls | Description |
|----------|-----------|-------------|
| **Tool Result Budget** | 0 | Caps individual result sizes |
| **Snip Compact** | 0 | Removes unnecessary intermediate messages |
| **MicroCompact** | 0 | Merges consecutive tool-result/user pairs into summaries |
| **Context Collapse** | 0 | Read-time projection over history with staged commits |
| **AutoCompact** | 1 | Complete summarization via forked agent |

**AutoCompact triggers at ~95% context window capacity (25% remaining).**

**Preserved during compaction:**
- CLAUDE.md (re-read from disk after each compaction)
- User requests and key code snippets
- "Compact Instructions" from CLAUDE.md

**Lost during compaction:**
- Instructions given in conversation (NOT in CLAUDE.md)
- Error messages, line numbers, variable values, stack traces
- Reasoning behind decisions
- Specific debugging details

**CompactionConfig defaults:**
- `preserve_recent_messages`: 4
- `max_estimated_tokens`: 10,000

**Known bug (fixed):** Before 3-failure circuit breaker, continuous autocompaction retry burned ~250,000 API calls per day globally.

### Compact Instructions

Section in CLAUDE.md that controls what to preserve:
```markdown
## Compact instructions
- Preserve code paths and unresolved security questions
- Preserve diff summaries and failed test output
```

---

## Permission System

### 6 Permission Modes

| Mode | Auto-approve | Use Case |
|------|-------------|----------|
| `default` | Read only | Sensitive work |
| `acceptEdits` | Read + edit | Iteration with gate on commands |
| `plan` | Read, plan, explore | Design before modifying |
| `auto` | Everything (with classifier) | Long tasks, Team/Enterprise (requires Sonnet 4.6+) |
| `bypassPermissions` | Everything, no checks | VM testing environments only |
| `dontAsk` | Pre-approved only | Policy-driven lockdown |

### Permission Rule Syntax

```json
{
  "permissions": {
    "allow": ["Bash(git diff *)", "Read(.)", "Edit(src/*)"],
    "ask": ["Bash(npm run *)", "WebFetch(*)"],
    "deny": ["Bash(rm *)", "Read(.env*)"]
  }
}
```

**Evaluation order:** deny > ask > allow (first match wins).

### 5-Layer Permission Gauntlet

1. Tool-level checks (Bash validates destructive commands)
2. Settings allowlist/denylist (glob patterns)
3. Sandbox policy (path, command, network)
4. Permission mode (default, acceptEdits, plan, auto, bypass)
5. Hook overrides (PreToolUse)

---

## Prompt Caching

### Strategy

- Static content FIRST, dynamic content LAST
- `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` separates cacheable from session-specific
- Tool definitions separated alphabetically (built-in first, MCP after) to preserve cache breakpoints

### 14 Cache-Break Vectors Monitored

- Adding MCP tool
- Timestamp in system prompt
- Switching model mid-session
- Changing images in prompt
- Modifying tool settings
(+ 9 more tracked in `promptCacheBreakDetection.ts`)

### Cost Impact

| Scenario | Cost per 100-turn Opus session |
|----------|-------------------------------|
| Without caching | $50-100 |
| With caching | $10-19 |

### Sticky Latches

`afkModeHeaderLatched` and `fastModeHeaderLatched` prevent cache busts when user toggles settings mid-session. Once latched, cannot be unlatched (by design).

### Fork Children & Cache Sharing

Fork children use **identical placeholder text** for each `tool_result` block, guaranteeing byte-identical prefixes. "Spawning five forked agents costs barely more than 1."

---

## Deferred Tools (Tool Search)

### Problem Solved

Tool definitions consumed ~14-16K tokens in the system prompt.

### Solution (since v2.1.69)

ALL built-in tools (Bash, Read, Edit, Write, etc.) deferred via ToolSearch.

**Result:** ~14-16K tokens → ~968 tokens (**93% reduction**).

### How It Works

1. Claude sees only ToolSearch + non-deferred tools
2. When it needs a tool, searches via keyword or `select:mcp__tool_name`
3. Returns 3-5 `tool_reference` blocks most relevant
4. References automatically expanded throughout history

### Configuration

```
ENABLE_TOOL_SEARCH=auto   # threshold-based (10% of context window)
ENABLE_TOOL_SEARCH=true   # always deferred
ENABLE_TOOL_SEARCH=false  # all upfront
```

---

## Bash Security System

### Scale
- **9,707 lines** across 3 files
- **23+ numbered security validators**
- Uses **tree-sitter WASM parser** to build AST of every command before execution

### Security Checks Include

- 18 Zsh builtins blocked
- Zsh equals expansion (`=curl` permission bypass)
- Unicode zero-width space injection defense
- IFS null-byte injection defense
- Token bypasses
- Redirect validation
- URL-encoded path traversal
- Unicode normalization attacks
- Backslash injection

### Known Vulnerabilities (post-leak)

**Parser Differential:** Three parsers with conflicting edge-case behavior. Attackers with CR-embedded commands can get validator approval while bash interprets differently.

**Early-Allow Short Circuits:** `validateGitCommit` returns "allow", bypassing all subsequent checks.

---

## Agent Definition System

### 3 Agent Types (Discriminated Union)

**Built-In** (`source: 'built-in'`):
- System prompts via `getSystemPrompt({toolUseContext})`
- Cannot be overridden by user files
- Types: general-purpose, Explore, Plan, verification, fork, statusline-setup

**Custom** (`source: userSettings | projectSettings | policySettings`):
- Loaded from `.claude/agents/*.md`
- System prompt in markdown body, config in YAML frontmatter

**Plugin** (`source: 'plugin'`):
- Via `--plugin-dir`
- Treated as admin-trusted for MCP

### Built-In Agent Profiles

| Agent | Model | Tools | Mode | Notes |
|-------|-------|-------|------|-------|
| general-purpose | default | All (`['*']`) | sync/async | Default delegation |
| Explore | haiku (external) | Read-only | sync | `omitClaudeMd: true`, saves ~5-15 Gtok/week |
| Plan | inherit | Read-only | sync | `omitClaudeMd: true` |
| verification | inherit | No Edit/Write | async (forced) | `background: true`, ends with VERDICT |
| fork | inherit | All + cache-identical | experimental | Parallelization with cache sharing |

### Custom Agent Frontmatter

```yaml
---
name: security-reviewer
description: Reviews code for security vulnerabilities
model: opus
tools: [Read, Grep, Glob, Bash]
disallowedTools: [Edit, Write]
permissionMode: plan
maxTurns: 20
background: false
isolation: worktree
memory: project
mcpServers: [memory-server]
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
skills: [security-review]
initialPrompt: "Review the staged changes for vulnerabilities"
effort: high
requiredMcpServers: [security-scanner]
---
You are a senior security engineer.
```

---

## Multi-Agent Coordinator Mode

### 3 Execution Models

1. **Fork model** — forked subagents sharing cache
2. **Teammate model** — collaborative agents with independent context windows
3. **Worktree model** — git worktree isolation

### Coordinator Orchestration Pattern (4 phases)

1. **Research** — workers investigate codebase in parallel
2. **Synthesis** — coordinator reads findings, crafts specs
3. **Implementation** — workers execute changes per spec
4. **Verification** — separate testing workers

**Communication:** Task files on disk + `SendMessageTool` (no shared memory).

**SendMessageTool targets:**
- `teammate name` — written to mailbox, auto-resumes if stopped
- `"*"` — broadcast to all except sender
- `"team-lead"` — graceful shutdown approve/reject
- `"uds:<path>"` — Unix domain socket cross-session

### Cache Sharing Economics

Sub-agents pay only for unique instructions by sharing byte-identical context copies that share the KV cache. Without cache sharing, multi-agent parallelism incurs massive token penalties.

---

## Unreleased Systems

### KAIROS — Autonomous Daemon Mode

Referenced 150+ times in source. Named after Ancient Greek "at the right time."

- Autonomous operation via periodic `<tick>` prompts asking "anything worth doing right now?"
- **15-second blocking budget** per decision cycle
- **Append-only daily log files** for audit trails
- GitHub webhooks, 5-minute cron cycles
- Background memory consolidation via `/dream`
- Exclusive tools: `SendUserFileTool`, `PushNotificationTool`, `SubscribePRTool`

### ULTRAPLAN — Remote Planning

- Offloads complex planning to Cloud Container Runtime running Opus 4.6
- **30-minute planning window**
- Polls every 3 seconds with "teleport sentinel" result retrieval
- Browser UI for live monitoring (approve/reject plan)

### Feature Flags (44 total, selected)

| Flag | Feature |
|------|---------|
| `PROACTIVE` / `KAIROS` | Always-on assistant daemon |
| `COORDINATOR_MODE` | Multi-agent orchestration |
| `BUDDY` | Companion pet system (Tamagotchi) |
| `BRIDGE_MODE` | claude.ai remote control |
| `VOICE_MODE` | Voice commands via Deepgram Nova 3 |
| `FORK_SUBAGENT` | Fork parallelization |
| `ANTI_DISTILLATION_CC` | Fake tool injection |

### Model Codenames

| Codename | Maps To |
|----------|---------|
| Tengu | Claude Code project codename |
| Capybara | New model family (possibly "Mythos") |
| Fennec | Opus 4.6 |
| Numbat | Unreleased model |
| Penguin Mode | Fast Mode |
| Chicago | Computer Use |

---

## Cost Optimization Patterns

### 7 Optimization Levers (40-70% total reduction possible)

| Technique | Savings |
|-----------|---------|
| Model routing (Opus plan + Sonnet implement) | High |
| Deferred tools (Tool Search) | 93% on tool definitions |
| Prompt caching | 60-80% on repeat turns |
| Image cropping (200x200 = 54 tokens vs 1000x1000 = 1,334 tokens) | 25x on images |
| Compact instructions ("Just the code, no commentary") | Medium |
| `/clear` between tasks | Clears irrelevant history |
| Fork agents for parallelism | "barely more than 1x cost" |

### Model Pricing Reference

| Model | Input (per M tokens) | Output (per M tokens) | Cache Creation | Cache Read |
|-------|----------------------|----------------------|----------------|------------|
| Haiku | $1.00 | $5.00 | — | — |
| Sonnet | $15.00 | $75.00 | $18.75 | $1.50 |
| Opus | $15.00 | $75.00 | $18.75 | $1.50 |

### Tiered Model Routing

Not all decisions need frontier models:
- **Permission checks:** Claude Haiku pre-screens dangerous commands
- **Frustration detection:** Regex patterns (zero API calls)
- **Context compression:** MicroCompact (zero API calls)
- **Planning:** Opus for complex planning, Sonnet for implementation

---

## Skills System

### Structure

```
skill-name/
  SKILL.md          # REQUIRED: metadata + instructions
  scripts/          # Optional: executable code
  references/       # Optional: additional docs
  assets/           # Optional: templates, static resources
```

### SKILL.md Format

```yaml
---
name: explain-code
description: Explains code with visual diagrams
disable-model-invocation: true    # Only user can invoke
user-invocable: false             # Only Claude can invoke
allowed-tools: [Read, Grep, Glob]
---
Instructions for the skill...
$ARGUMENTS for dynamic values
$0, $1 for indexed arguments
```

### 20 Built-in Skill Modules

`batch`, `clawApi`, `clawApiContent`, `clawInChrome`, `debug`, `keybindings`, `loop`, `remember`, `scheduleRemoteAgents`, `simplify`, `skillify`, `stuck`, `updateConfig`, `verify`, `verifyContent`, `bundledSkills`, `loadSkillsDir`, `mcpSkillBuilders`

---

## SINAPSE Architectural Lessons

From the source code analysis, 7 lessons for SINAPSE:

1. **Minimal Core Loop, Maximum Infrastructure** — keep orchestration loop simple (~20 lines), invest in tools and context management
2. **Safety Through Proximity** — embed constraints in tool descriptions, not separate policy files
3. **Structured Tools Over Generic Commands** — every frequently-executed command should be a dedicated, typed, gated tool
4. **Cache Architecture as Competitive Advantage** — separate static from dynamic prompt content, track 14 cache-break vectors
5. **Memory as Indexed Hints** — lightweight index with verification-on-retrieval, never raw facts
6. **Cache-Sharing for Multi-Agent** — byte-identical context copies enable cheap parallelism
7. **Tiered Model Routing** — Haiku for permission checks, regex for frustration, Sonnet for implementation, Opus for planning
