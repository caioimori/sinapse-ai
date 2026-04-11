# Claude Code Internals Reference

Comprehensive reference covering Claude Code's production architecture, agent loop, tools, hooks, memory, compaction, MCP, skills, KAIROS, autoDream, swarm patterns, AGI levels, and the broader ecosystem of LLM coding tools.

**Sources:** Leaked source code analysis (v2.1.88), claw-code clean-room rewrite, architecture deep dives, competing frameworks analysis, 80+ sources across skills ecosystem, swarm intelligence, and AGI research.

---

## 1. Codebase Scale and Structure

### The Leak Event (March 31, 2026)

A 59.8 MB JavaScript source map file was accidentally included in npm package v2.1.88 due to a missing `*.map` entry in `.npmignore`. Bun (which Anthropic acquired late 2025) generates source maps by default.

**Scale of exposure:**

| Metric | Value |
|--------|-------|
| Lines of TypeScript | 512,000+ |
| Source files | 1,902 |
| Commands | 207 |
| Tools | 184 |
| Subsystems | 35 |
| Hidden feature flags | 44 (covering 20+ unshipped features) |

The clean-room rewrite (claw-code) reached 163,000 GitHub stars, becoming the fastest-growing repository in GitHub history.

### Technical Stack

- **Runtime:** Bun
- **Language:** TypeScript (strict mode)
- **UI:** React + Ink (terminal renderer with game-engine-style optimization)
- **Authentication:** OAuth 2.0
- **LSP:** Language Server Protocol integration
- **MCP:** Model Context Protocol integration

### 35 Subsystems

| Subsystem | Modules | Purpose |
|-----------|---------|---------|
| components | 389 | UI components (React + Ink terminal) |
| services | 130 | Backend services (analytics, API, OAuth, MCP, plugins, memory) |
| hooks | 104 | Event hooks (notifications, tool permissions, file suggestions) |
| commands | ~85 | Slash commands (/commit, /review, /compact, /mcp, /memory) |
| tools | ~184 | Agent tools (BashTool, FileReadTool, AgentTool, etc.) |
| bridge | 31 | IDE integration (REPL, JWT, messaging, polling) |
| skills | 20 | Skill system (batch, loop, remember, simplify, etc.) |
| memdir | 8 | Memory directory (findRelevantMemories, memoryScan, memoryAge) |
| coordinator | 1 | Multi-agent coordination mode |

---

## 2. Core Architecture -- The Agent Loop

The fundamental agent loop is deliberately minimal (~20 lines). The 512,000 lines represent the supporting infrastructure, not control logic.

### Loop Pattern

```
1. User Input -> Add as message to session
2. API Call -> ApiClient::stream() with current context
3. Message Assembly -> Collect text + tool-use events
4. Tool Detection -> Extract pending tool invocations
5. Permission Authorization -> Check against PermissionPolicy
6. Hook Execution -> Run PreToolUse/PostToolUse via HookRunner
7. Tool Execution -> Delegate to ToolExecutor::execute()
8. Result Recording -> Store tool results as messages
9. Loop -> Repeat until no pending tools or max_iterations
```

**Key insight:** "Overengineering control flow (state machines, DAG orchestration) is misplaced effort. Keep iteration patterns austere and invest in the ecosystem surrounding them."

### 5 Architectural Layers

| Layer | Function | Components |
|-------|----------|------------|
| Agent Loop | Task decomposition, tool selection | Tool calls, file reads, retries |
| Context and Memory | Knowledge persistence | CLAUDE.md, auto-memory, history |
| Execution Surface | System actions | Read, Edit, Bash, subagents, worktrees |
| Governance and Safety | Permission limits | Permission modes, hooks, sandboxing |
| Extensibility | New capabilities | Skills, plugins, MCP, Agent SDK |

### Query Engine

`QueryEngine.ts` is 46,000 lines. Four layers:

1. `submitMessage()` -- validate and build system prompt
2. `query()`/`queryLoop()` -- `while(true)` agentic loop
3. `queryModel`/`callModel` -- Anthropic API wrapper with streaming
4. Stop hooks + token budget logic

### 7 Continuation Reasons

1. `max_output_tokens_escalate`
2. `max_output_tokens_recovery`
3. `reactive_compact_retry`
4. `collapse_drain_retry`
5. `stop_hook_blocking`
6. `token_budget_continuation`
7. Tool-use loop (implicit)

### Retry Logic

- Up to 10 retries with exponential backoff + jitter
- 529 (Overloaded): Only foreground retries; background bails immediately
- Opus Fallback: After 3 consecutive 529s on Opus, triggers FallbackTriggeredError
- OAuth 401: Forces token refresh
- Context Overflow 400: Computes new maxTokensOverride
- Persistent Mode: Indefinite retry with 30min cap and heartbeat messages

---

## 3. System Prompt and Context Engineering

### Prompt Construction Constants

- `MAX_INSTRUCTION_FILE_CHARS`: 4,000 characters per file
- `MAX_TOTAL_INSTRUCTION_CHARS`: 12,000 characters total
- `FRONTIER_MODEL_NAME`: "Opus 4.6"

### Cache Optimization Strategy

The architectural constraint around which the entire product is built:

```
[Static System Prompt] -> CACHED (shared across all users)
  |
[SYSTEM_PROMPT_DYNAMIC_BOUNDARY]
  |
[Dynamic Content: CLAUDE.md, git status, date] -> NOT CACHED (session-specific)
```

- Static content first, dynamic content last
- All Claude Code users share the same system prompt cache
- 14 tracked cache-break vectors monitored for invalidation
- Adding an MCP tool, putting a timestamp in system prompt, switching models -- each invalidates the cache and 5x costs for that turn

**Cost impact:**

| Scenario | Cost per 100-turn Opus session |
|----------|-------------------------------|
| Without caching | $50-100 |
| With caching | $10-19 |

### 6-Layer Prompt Assembly

1. **Priority Resolver** -- waterfall decision tree
2. **Content Factory** -- static + dynamic sections
3. **Section Registry** -- memoization control
4. **CLAUDE.md Loader** -- multi-scope file discovery
5. **Memory System** -- auto-memory injection
6. **Cache Boundary** -- global vs session-scoped split

### Static Sections (before boundary, globally cacheable)

- Intro (identity, URL guard, cyber-risk)
- System (markdown, permission modes, injection warnings)
- Doing Tasks (YAGNI, security, code-style)
- Actions (reversibility, blast-radius)
- Using Tools (hierarchy, parallelism)
- Tone and Style (no emojis, file:line refs)
- Output Efficiency

### Dynamic Sections (after boundary, session-specific)

| Section | Cache Behavior | Content |
|---------|---------------|---------|
| session_guidance | memoized | Questions, shell tips, agent contracts |
| memory | memoized | CLAUDE.md hierarchy + MEMORY.md |
| env_info_simple | memoized | CWD, git, shell, platform, model, cutoff |
| mcp_instructions | **volatile** | Per-server instructions (reconnect-aware) |
| scratchpad | memoized | Session directory + rules |
| token_budget | memoized | Target approach instruction |

### CLAUDE.md Hierarchy (4 scopes)

| Scope | Location | Sharing |
|-------|----------|---------|
| Managed | `/etc/claude-code/CLAUDE.md` | Machine-wide |
| User | `~/.claude/CLAUDE.md` | Cross-project, private |
| Project | `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md` | Git-versioned |
| Local | `CLAUDE.local.md` | Project-specific, private |

Discovery walks ascending from CWD to root. Files closer to CWD appear later (higher effective priority).

### @include Directive

```
@shared-rules.md           (relative)
@./scripts/lint.md          (relative explicit)
@~/company/standards.md     (home-relative)
@/absolute/path/rules.md   (absolute)
```

Includes are inserted BEFORE the file that includes them. Circular references prevented.

### Path-Scoped Rules

```yaml
---
paths:
  - src/components/**
  - "*.tsx"
---
```

Rules only load when working on files matching the globs.

---

## 4. Tool System

### Architecture Principles

Each tool is self-contained with: input schema (Zod), permission level (per-tool), execution logic, output formatting, UI component (React + Ink), and prompt template.

**Key insight:** "Agents with 5-8 well-described, purpose-built tools consistently outperform agents with a single omnibus tool -- even when the omnibus tool is technically more capable."

### Tool Interface: `Tool<Input, Output, P>`

Three generics: Zod input schema, output type, progress event shape.

Required members:
- `name` -- primary identifier
- `inputSchema` -- Zod schema (source of truth)
- `maxResultSizeChars` -- trigger for disk persistence
- `call()` -- async execution
- `checkPermissions()` -- pre-execution validation
- `isConcurrencySafe(input)` -- can run in parallel?
- `isReadOnly(input)` -- read-only operation?

Factory defaults fail-closed: `isConcurrencySafe: false`, `isReadOnly: false`, `isDestructive: false`.

### 3-Tier Registration Pipeline

1. `getAllBaseTools()` -- exhaustive catalog with feature flags and env var gating
2. `getTools()` -- filter by mode (simple, REPL, deny rules, `isEnabled()`)
3. `assembleToolPool()` -- built-ins alphabetic first, MCP tools alphabetic after (preserves cache breakpoints)

### Tool Categories

| Category | Tools |
|----------|-------|
| Execution | BashTool, PowerShellTool, REPLTool, AgentTool |
| File | FileReadTool, FileEditTool, FileWriteTool, GlobTool, GrepTool |
| Web | WebFetchTool, WebSearchTool, WebBrowserTool |
| Dev | LSPTool, NotebookEditTool, MCPTool, EnterWorktreeTool |
| Control | TaskCreateTool, ScheduleCronTool, TeamCreateTool, RemoteTriggerTool |
| KAIROS-only | SendUserFile, PushNotification, SubscribePR |
| Internal-only | ConfigTool, TungstenTool, SuggestBackgroundPRTool |
| Agent | AgentTool, SendMessageTool, TaskStopTool, TaskOutputTool |
| MCP | ListMcpResourcesTool, ReadMcpResourceTool, MonitorTool, McpAuthTool |

### Execution Pipeline (`toolExecution.ts`)

1. Zod validation (`inputSchema.safeParse`)
2. Semantic validation (path traversal, size limits)
3. Speculative classifier (Bash security check starts before hooks)
4. `backfillObservableInput` (clone for hooks and canUseTool)
5. PreToolUse hooks
6. `canUseTool()` -- main permission gate
7. `tool.call()` -- actual execution
8. PostToolUse hooks
9. Result serialization with size budget

Three copies of input maintained: API-bound original, backfilled observable clone, hook-updated call input.

### Concurrency Orchestration

`partitionToolCalls()` groups consecutive safe tools for parallel execution. Non-safe tools break batches and run serially. Ceiling: `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` (default 10).

### Bash Tool: Special Treatment

- Only tool whose errors abort siblings (implicit dependency chains)
- 23 security checks in `bashSecurity.ts`
- 9,707 lines across 3 files
- Uses tree-sitter WASM parser to build AST of every command
- 18 Zsh builtins blocked
- Defense against zero-width space injection, IFS null-byte injection, Unicode injection

### Deferred Tools and Tool Search

Original problem: tool definitions consumed ~14-16K tokens in system prompt.

Solution (since v2.1.69): ALL built-in tools deferred via ToolSearch.

**Reduction:** ~14-16K tokens to ~968 tokens (93% reduction).

How it works: Claude sees only ToolSearch + non-deferred tools. When needed, searches via keyword or `select:tool_name`. Returns 3-5 tool references that expand automatically.

---

## 5. Permission System

### 6 Permission Modes

| Mode | Auto-Allowed | Use |
|------|-------------|-----|
| default | Read only | Sensitive work |
| acceptEdits | Read + edit | Iteration with command gate |
| plan | Read, plan, explore | Design before modify |
| auto | Everything (with classifier) | Long tasks, Team/Enterprise |
| bypassPermissions | Everything, no checks | Test VMs only |
| dontAsk | Pre-approved only | Policy-driven lockdown |

### Configuration Hierarchy

```
Managed > CLI flags > Local > Project > User > Defaults
```

### Permission Rules

```json
{
  "permissions": {
    "allow": ["Bash(git diff *)", "Read(.)", "Edit(src/*)"],
    "ask": ["Bash(npm run *)", "WebFetch(*)"],
    "deny": ["Bash(rm *)", "Read(.env*)"]
  }
}
```

Evaluation: deny > ask > allow (first match wins).

Auto mode: Requires Sonnet 4.6+, Team/Enterprise. Separate classifier reviews each action. Broad rules (`Bash(*)`) discarded; narrow rules (`Bash(npm test)`) kept.

---

## 6. Hook System

### 26 Hook Events

| Event | When | Blockable |
|-------|------|-----------|
| SessionStart | Session starts/resumes | No |
| InstructionsLoaded | CLAUDE.md/rules loaded | No |
| UserPromptSubmit | User submits prompt | Yes |
| PreToolUse | Before tool executes | Yes |
| PermissionRequest | Permission dialog | Yes |
| PostToolUse | After tool succeeds | No |
| PostToolUseFailure | After tool fails | No |
| SubagentStart | Subagent spawned | No |
| SubagentStop | Subagent terminates | Yes |
| TaskCreated/TaskCompleted | Task lifecycle | Yes |
| Stop | Claude finishes response | Yes |
| TeammateIdle | Teammate goes idle | Yes |
| ConfigChange | Config changes | Yes |
| WorktreeCreate/WorktreeRemove | Worktree lifecycle | Yes/No |
| PreCompact/PostCompact | Compaction lifecycle | No |
| SessionEnd | Session ends | No |

### 4 Handler Types

| Type | Usage | Description |
|------|-------|-------------|
| command | 95% | Shell script execution |
| http | Remote | HTTP endpoint call |
| prompt | Single-turn | LLM evaluation |
| agent | Multi-turn | Subagent with tool access |

Precedence: agent > prompt > shell hooks.

### Exit Codes

| Code | Meaning | Effect |
|------|---------|--------|
| 0 | Allow | Operation proceeds |
| 2 | Block | Operation denied |
| Other | Warning | Non-blocking error |

### Matcher Syntax

```json
{ "matcher": "Bash" }              // exact match
{ "matcher": "Edit|Write" }        // either tool
{ "matcher": "mcp__memory__.*" }   // regex
{ "if": "Bash(git *)" }            // permission rule syntax
```

---

## 7. Memory Architecture

### Three-Layer Self-Healing Memory

MEMORY.md is a lightweight index (~150 chars/line, max 200 lines / ~25KB) that acts as a pointer system, never storing raw data.

Design principles:
- Memory treated as hints, not ground truth
- Agent must verify against actual codebase before acting
- Strict Write Discipline -- updates only after successful actions

### Memory Hierarchy

| Layer | Always Loaded | Purpose |
|-------|--------------|---------|
| MEMORY.md index | Yes | Navigation, pointers |
| Topic files | On-demand | Detailed knowledge |
| Session transcripts | Grep-searchable only | Never loaded directly |

### autoDream -- Memory Consolidation

4-phase process:

1. **Orient** -- Read MEMORY.md, scan existing memory files
2. **Gather** -- Check logs for outdated/contradictory memories
3. **Consolidate** -- Merge observations, resolve conflicts
4. **Prune** -- Maintain <=200 lines / ~25KB limit

**Triple-gate trigger (ALL required):**
- >= 24 hours since last consolidation
- >= 5 new sessions minimum
- No active consolidation process (file-based advisory lock)

Runs as a forked sub-agent with Bash read-only access during idle periods. Currently gated under KAIROS flag.

---

## 8. Compaction System

### 5 Compaction Strategies

| Layer | Strategy | API Calls | Details |
|-------|----------|-----------|---------|
| Tool Result Budget | Cap individual result sizes | Zero | Per-result limits |
| Snip Compact | Remove unnecessary intermediate messages | Zero | Local editing |
| Microcompact | Merge consecutive tool-result/user pairs | Zero | Local cache editing |
| Context Collapse | Read-time projection with staged commits | Zero | Progressive removal |
| AutoCompact | Full summarization via forked agent | 1 | 13K token buffer, up to 20K summaries, 3-failure circuit breaker |

### What is Preserved

- CLAUDE.md (re-read from disk after each compaction)
- User requests and key code snippets
- "Compact Instructions" section from CLAUDE.md

### What is Lost

- Instructions given in conversation (not in CLAUDE.md)
- Error messages, line numbers, variable values, stack traces
- Reasoning behind decisions
- Debugging details

### Compact Instructions

Section in CLAUDE.md that controls preservation:

```markdown
## Compact instructions
- Preserve code paths and unresolved security questions
- Preserve diff summaries and failed test output
```

### Known Bug

Comment from March 10, 2026: "1,279 sessions had 50+ consecutive failures...wasting ~250K API calls/day globally." Mitigation: `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3`.

---

## 9. MCP Integration

### Tool Naming Convention

```
mcp__{server}__{tool}
```

Both components normalized: non-alphanumeric replaced with underscores.

### 6 Transport Types

| Transport | Description |
|-----------|-------------|
| Stdio | Local process execution |
| SSE | Server-Sent Events (legacy) |
| HTTP | Remote endpoints with optional OAuth |
| WebSocket | Real-time bidirectional |
| SDK | Built-in implementations |
| ManagedProxy | Anthropic-hosted proxy |

### Architecture Principle

"Claude Code isn't built on top of MCP. It IS MCP -- every capability, including Computer Use, runs as a tool call."

Computer Use is `@ant/computer-use-mcp` -- a dedicated MCP server, not special-cased functionality.

### MCP Instructions

`getMcpInstructions()` iterates connected servers, extracting `instructions` fields. MCP instructions are volatile because servers can connect/disconnect between turns.

---

## 10. Agent System

### Agent Definitions (Discriminated Union)

| Source | Loading | Override |
|--------|---------|----------|
| Built-In | Dynamic system prompts | Cannot be overridden |
| Custom | `.claude/agents/*.md` with YAML frontmatter | User-configurable |
| Plugin | Via `--plugin-dir` | Admin-trusted for MCP |

### Built-In Agents

| Agent | Model | Tools | Mode |
|-------|-------|-------|------|
| general-purpose | default | All (`['*']`) | sync/async |
| Explore | haiku (external) / inherit (internal) | Read-only | sync |
| Plan | inherit | Read-only | sync |
| verification | inherit | No Edit/Write; allows /tmp scripts | async (forced) |
| fork | inherit | All + cache-identical tools | experimental |

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
skills: [security-review]
initialPrompt: "Review the staged changes for vulnerabilities"
effort: high
---
You are a senior security engineer.
```

### Sync vs Async Execution

6 conditions force async:
1. `run_in_background === true`
2. Agent definition `background: true`
3. Coordinator mode active
4. Fork experiment (`FORK_SUBAGENT` gate)
5. KAIROS assistant mode
6. Proactive mode

### Fork Path (Experimental)

Children use identical placeholder text for each `tool_result`, guaranteeing byte-identical prefixes for prompt caching. "Spawning five forked agents costs barely more than 1."

---

## 11. Multi-Agent and Coordinator Mode

### Three Execution Models

| Model | Description | Communication |
|-------|-------------|---------------|
| Fork | Forked sub-agents | Cache-sharing, report to parent |
| Teammate | Collaborative agents | Task files on disk + SendMessageTool |
| Worktree | Git worktree isolation | Isolated codebases, review/merge by user |

### Agent Teams

A session acts as team lead, coordinating teammates with independent context windows.

**SendMessageTool routing:**

| Target | Behavior |
|--------|----------|
| teammate name | Written to mailbox; auto-resumes if stopped |
| `"*"` | Broadcast to all except sender |
| `"team-lead"` | Approve/reject graceful shutdown |
| `"uds:<path>"` | Unix domain socket cross-session |
| `"bridge:<session-id>"` | Remote control via Anthropic servers |

### Coordinator Mode (4 phases)

Implemented via system prompt, not code:

1. **Research** -- workers investigate codebase in parallel
2. **Synthesis** -- coordinator reads findings, crafts specs
3. **Implementation** -- workers execute changes per spec
4. **Verification** -- tests changes

### Cache Sharing Economics

Sub-agents pay only for unique instructions by sharing byte-identical context copies. Without cache sharing, multi-agent parallelism incurs massive token penalties.

Workers operate in isolated git worktrees (avoiding merge conflicts).

---

## 12. Skills and Plugins

### Skills (SKILL.md Format)

```yaml
---
name: explain-code
description: Explains code with visual diagrams
disable-model-invocation: true
user-invocable: false
allowed-tools: [Read, Grep, Glob]
---
Instructions for the skill...
$ARGUMENTS for dynamic values
```

### Progressive Disclosure (3 levels)

| Level | Loaded | When | Size |
|-------|--------|------|------|
| Metadata | name + description | Always (startup) | ~100 tokens |
| Instructions | Full SKILL.md body | When skill activated | <5000 tokens |
| Resources | scripts/, references/, assets/ | On demand | Unlimited |

Keep SKILL.md below 500 lines. Move detailed reference material to separate files.

### Plugins

Bundles of skills + agents + hooks + MCP + LSP:

```
.claude-plugin/
  plugin.json        # Manifest
skills/              # SKILL.md files
agents/              # Subagent definitions
hooks/               # hooks.json
.mcp.json            # MCP server configs
```

### Agent Skills Ecosystem (2026)

| Metric | Value |
|--------|-------|
| Skills cataloged | 1,060+ |
| Platforms supporting format | 33 |
| Official vendor skills | 307 |
| Community skills | 144+ |

The SKILL.md format is the de facto universal standard, supported by Claude Code, Codex, Gemini CLI, Cursor, VS Code, GitHub Copilot, and 27+ other clients.

### Top Repositories

| Repository | Stars | Description |
|------------|-------|-------------|
| obra/superpowers | 134K | Complete dev methodology framework |
| anthropics/skills | 110K | Official Anthropic skills + spec |
| anthropics/claude-code | 108K | Official Claude Code CLI |
| trailofbits/skills | 4.2K | 73 security-focused skills |

---

## 13. Unreleased Systems (Feature-Flagged)

### KAIROS -- Autonomous Daemon Mode

Referenced 150+ times in source. Named after Ancient Greek "at the right time."

- Autonomous operation via periodic `<tick>` prompts
- 15-second blocking budget per decision cycle
- Append-only daily log files for audit trails
- GitHub webhooks, 5-minute cron cycles
- Background memory consolidation via `/dream`
- Exclusive tools: SendUserFileTool, PushNotificationTool, SubscribePRTool

### ULTRAPLAN -- Remote Planning

- Offloads complex planning to Cloud Container Runtime running Opus 4.6
- 30-minute planning window
- Polls every 3 seconds with "teleport sentinel" result retrieval
- Browser UI for live monitoring (approve/reject plan)

### BUDDY -- Digital Pet System

- Tamagotchi-style companion with 18 species
- Gacha mechanics, 1% shiny odds
- Rarity tiers, procedurally generated stats

### Feature Flags (44 total)

Notable compile-time flags: PROACTIVE, KAIROS, COORDINATOR_MODE, BUDDY, BRIDGE_MODE, VOICE_MODE, FORK_SUBAGENT, ANTI_DISTILLATION_CC.

Notable runtime flags (GrowthBook, `tengu_` prefix): `tengu_anti_distill_fake_tool_injection`, `tengu_penguins_off` (Fast Mode kill-switch).

### Model Codenames

| Codename | Maps To |
|----------|---------|
| Tengu | Claude Code (project codename) |
| Capybara | New model family (possibly Mythos) |
| Fennec | Opus 4.6 |
| Numbat | Unreleased model |
| Penguin Mode | Fast Mode |
| Chicago | Computer Use |

### Anti-Distillation (2 layers)

**Layer 1 -- Fake Tool Injection:** When flag enabled, decoy tool definitions injected into system prompt. Requires 4 simultaneous conditions.

**Layer 2 -- Connector-Text Summarization:** Server returns cryptographically signed summaries rather than full reasoning chains. Internal users only.

### Undercover Mode

Identity masking for external repositories. Enabled by default for Anthropic employees in non-allowlisted repos. Strips Co-Authored-By attribution, forbids mentioning internal codenames, suppresses "Claude Code" references. No force-OFF mechanism documented.

---

## 14. Boot Sequence

### 6-Phase Startup

**Phase 1 -- CLI Entrypoint:** Fast-path for `--version`, `--daemon-worker` without loading heavy modules.

**Phase 2 -- Parallel Prefetch (~135ms):** Three concurrent operations: MDM policy queries (20-40ms), OAuth/API key prefetch (~65ms), results cached before needed.

**Phase 3 -- Commander Parsing:** Settings, CLI args, env vars, migrations (schema v11).

**Phase 4 -- Setup Orchestration:** 13 ordered steps including setCwd (must precede hooks), captureHooksConfigSnapshot, worktree creation, background jobs.

**Phase 5 -- Global State:** Session identity, usage counters, flags, "sticky latches" preventing mid-session cache busts.

**Phase 6 -- Ink Render:** React/Ink TUI with deferred prefetches after first render.

### Bare Mode (`--bare`)

For scripted/SDK use. Eliminates: UDS server, teammate snapshot, session memory, plugin hooks, attribution, deferred prefetches. Optimized for CI latency.

---

## 15. Sandboxing

### OS-Level Primitives

| Platform | Technology |
|----------|-----------|
| macOS | Seatbelt |
| Linux/WSL2 | bubblewrap |
| Windows (native) | Planned |

### Isolation

- **Filesystem:** Read/write in CWD; blocks outside
- **Network:** Access via unix domain socket proxy enforcing domain allowlists
- **Child processes:** Inherit sandbox restrictions

Impact: Reduces permission prompts by 84% in internal use.

---

## 16. Bridge System (IDE Integration)

### VS Code Extension

- Native panel with inline edits and IDE-style diff reviews
- Review/edit plans before accepting
- Auto-accept edits
- @-mention files with line ranges
- Multiple conversations in tabs

### Bridge Protocol

Bidirectional messaging connecting local CLI with claude.ai/code, iOS, Android. CLI makes HTTPS requests outbound only (no inbound ports). NOT a network tunnel -- forwards structured application messages.

---

## 17. Security Architecture

### Bash Validation System

- 9,707 lines across 3 files
- 23+ numbered security validators
- Tree-sitter WASM parser builds AST of every command

### Known Vulnerabilities

**Parser Differential:** Three different parsers have conflicting edge-case behavior. Commands with embedded carriage returns can get validator approval while bash interprets differently.

**Subcommand Limit Bypass:** Commands with >50 subcommands override security analysis.

**Early-Allow Short Circuits:** Some validators return "allow" bypassing subsequent checks.

---

## 18. Swarm Intelligence Patterns

### Biological Foundations

| System | Mechanism | Application |
|--------|-----------|-------------|
| Ant colonies | Pheromone trails (stigmergy) | ACO -- optimal routes |
| Bird flocks | Alignment, cohesion, separation | Boids/PSO -- continuous optimization |
| Bee swarms | Waggle dance communication | Bee Colony -- multi-objective optimization |

### Core Principles

1. **Self-organization:** Global structures emerge from simple local interactions
2. **Stigmergy:** Indirect communication through the environment
3. **Emergence:** Complex behaviors from simple rules
4. **Decentralization:** No central leader; resilient to individual failures
5. **Positive feedback:** Amplification mechanisms (pheromone reinforcement)
6. **Negative feedback:** Evaporation, saturation -- prevents local optima

### Modern AI Agent Swarm Frameworks

| Framework | Architecture | State | Production-Ready |
|-----------|-------------|-------|-----------------|
| LangGraph | Graph-based | Robust (persistent) | Yes |
| CrewAI | Role-based | Layers (ChromaDB+SQLite) | Yes |
| AutoGen/AG2 | Conversational | Session (no persistence) | Partial (maintenance mode) |
| OpenAI Swarm | Handoff-based | None (stateless) | No |
| Claude Code Teams | Peer communication | Task files + messages | Experimental |
| Ruflo | Hive Mind | Shared knowledge | Yes (Claude only) |
| MetaGPT | SOP-based | Shared documents | Partial |

### Swarm Patterns for Development

| Pattern | Description | Example |
|---------|-------------|---------|
| Orchestrator-Worker | Central coordinator dispatches to workers | SINAPSE Imperator, Ruflo Queen |
| Peer-to-Peer | Agents operate as equals, direct communication | Claude Code Agent Teams |
| Hierarchical | Tree of agents with authority relationships | Agency Swarm, MetaGPT |
| Blackboard | Shared workspace agents read/write | LangGraph state graph |
| Stigmergic | Indirect communication via environment artifacts | Git branches, TODO comments |
| Pipeline | Sequential processing chain | SINAPSE SDC workflow |

### SINAPSE Comparison

SINAPSE uses primarily Orchestrator-Worker (Imperator at top, squad orchestrators, specialists) with Pipeline for SDC workflow. The handoff/scratchpad system adds Stigmergy elements. No competitor has the combination of squads + orchestration + constitution + quality gates.

---

## 19. LLM Coding Tool Comparison

### Instruction File Comparison

| Tool | File | Format |
|------|------|--------|
| Claude Code | `CLAUDE.md` | Markdown |
| Codex CLI | `AGENTS.md` | Markdown |
| Gemini CLI | `GEMINI.md` | Markdown (with @import) |
| Cursor | `.cursor/rules/*/RULE.md` | Markdown + YAML frontmatter |
| GitHub Copilot | `copilot-instructions.md` | Markdown |
| Windsurf | `.windsurf/rules/*.md` | Markdown + YAML frontmatter |

### Feature Comparison

| Feature | Claude Code | Codex | Gemini CLI | Cursor |
|---------|-------------|-------|-----------|--------|
| Hooks | 26 events | 2 events | N/A | N/A |
| Memory | Auto (MEMORY.md) | None | Not documented | Notepads (manual) |
| Subagents | Yes (agents/ + Teams) | Yes (config.toml) | Yes (agents/) | Via MCP |
| Skills | SKILL.md | SKILL.md | N/A | N/A |
| Sandboxing | Seatbelt/bubblewrap | Docker | Docker/Podman | N/A |

---

## 20. AGI Levels and Timeline

### Classification Systems

**OpenAI 5-Level Framework (2024):**

| Level | Name | Description | Status (2026) |
|-------|------|-------------|---------------|
| L1 | Chatbots | Conversational AI | Achieved |
| L2 | Reasoners | PhD-level reasoning | Achieved (o3, Claude) |
| L3 | Agents | Autonomous multi-step tasks | In progress |
| L4 | Innovators | AI that invents and creates | Emerging |
| L5 | Organizations | AI that runs organizations | Theoretical |

### Industry Predictions (2026)

| Source | Prediction |
|--------|-----------|
| Anthropic (Dario Amodei) | "Powerful AI" within 2-3 years (Jan 2025) |
| OpenAI (Sam Altman) | "We now believe we know how to build AGI" (Jun 2025) |
| DeepMind (Demis Hassabis) | Critical breakthroughs possible in 5-10 years (2025) |
| Ray Kurzweil | 2029 for human-level AI (maintained since 2005) |

### What AGI Means for Development Frameworks

1. **L3 (Agents):** Frameworks like SINAPSE become orchestration layers managing autonomous agents
2. **L4 (Innovators):** Frameworks shift from instruction-execution to goal-specification
3. **L5 (Organizations):** Frameworks become the operating system for AI-run organizations

### Key Technical Challenges

- Persistent memory and learning across sessions
- Reliable multi-step planning and execution
- Self-correction and error recovery
- Transfer learning across domains
- Alignment and safety guarantees

---

## 21. Implications for SINAPSE

### Architecture Lessons

1. **Keep the agent loop simple** -- SINAPSE's orchestration is already well-designed; avoid over-engineering control flow
2. **Invest in the surrounding ecosystem** -- Tools, hooks, memory, compaction are where sophistication pays off
3. **Cache optimization is existential** -- System prompt design directly impacts cost
4. **Safety through proximity** -- Security rules embedded in tool descriptions, not separate policy files
5. **Progressive disclosure for skills** -- SINAPSE's agent.md + tasks/ + knowledge-base/ naturally follows this pattern

### Competitive Position

| Dimension | SINAPSE | Best Competitor |
|-----------|---------|-----------------|
| Cross-domain orchestration | 20+ squads | None |
| Constitution/governance | Formal, enforced | None |
| Quality gates | Automatic (hooks + QA) | obra/superpowers (2-stage review) |
| Memory + context | Agent memory + scratchpad | None |
| Skill format | Proprietary (powerful) | SKILL.md (universal) |

### Strategic Recommendations

1. Export squad knowledge as SKILL.md for 33-platform reach
2. Position as "Superpowers on steroids" -- not just skills but orchestrated system
3. Monitor KAIROS pattern for autonomous agent capabilities
4. Adopt prompt caching strategies from Claude Code architecture
5. Implement Deferred Tool pattern to reduce context consumption

---

*Knowledge base compiled from research conducted by Prism (Research Operations Conductor) and Scope (Research Analyst) -- SINAPSE Research Initiative*
