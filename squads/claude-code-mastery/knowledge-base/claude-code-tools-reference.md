# Claude Code Tools Reference

> Complete inventory of all 184 tool modules across 35 subsystems. Based on source code analysis (v2.1.88 leak, April 2026).

---

## Tool System Architecture

### Core Interface: `Tool<Input, Output, P>`

Three generics: Zod input schema, output type, progress event shape.

**Required members:**
- `name` — primary identifier
- `aliases` — legacy names
- `inputSchema` — Zod schema (source of truth for validation)
- `maxResultSizeChars` — trigger for disk persistence
- `call()` — async execution, receives args, context, permission function, parent message
- `checkPermissions()` — validation before execution
- `isConcurrencySafe(input)` — can run in parallel?
- `isReadOnly(input)` — read-only operation?
- `isDestructive?()` — optional flag

**`buildTool()` factory defaults (fail-closed):**
```
isConcurrencySafe: () => false    // assumes state mutation
isReadOnly: () => false
isDestructive: () => false
checkPermissions: () => Promise.resolve({ behavior: 'allow' })
```

### 3-Tier Tool Pipeline

1. **`getAllBaseTools()`** — exhaustive catalog with feature flags and env var gating
2. **`getTools()`** — filter by mode (simple, REPL, deny rules, `isEnabled()`)
3. **`assembleToolPool()`** — built-ins alphabetically as prefix, MCP tools alphabetically after (separation preserves cache breakpoints)

### Concurrency Orchestration

`partitionToolCalls()` groups consecutive safe tools:
- Tools with `isConcurrencySafe(input) === true` run in parallel
- Non-safe tools break batches and run serially
- Ceiling: `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` (default 10)

---

## Complete Tool Catalog

### File Operations (~40 registered, ~20 enabled by default)

| Tool | Category | Default On | Description |
|------|----------|-----------|-------------|
| `FileReadTool` | File | Yes | Read file contents |
| `FileEditTool` | File | Yes | Edit existing files (diff-based) |
| `FileWriteTool` | File | Yes | Create/overwrite files |
| `GlobTool` | File | Yes | File pattern matching |
| `GrepTool` | File | Yes | Content search with regex |
| `NotebookEditTool` | File | Yes | Jupyter notebook editing |

### Shell Execution

| Tool | Category | Default On | Notes |
|------|----------|-----------|-------|
| `BashTool` | Shell | Yes | 16 modules, AST-based security, errors abort siblings |
| `PowerShellTool` | Shell | Windows | 14 modules, git safety |
| `REPLTool` | Shell | No | Interactive REPL mode |

**BashTool special treatment:**
- Only tool whose errors abort siblings (implicit dependency chains)
- Starts security classifier speculatively BEFORE hooks
- 23 security checks in `bashSecurity.ts`
- 18 Zsh builtins blocked

### Agent System

| Tool | Modules | Description |
|------|---------|-------------|
| `AgentTool` | 20 | Core agent spawning, fork model, built-in agents |
| `forkSubagent.ts` | — | Fork model for subagent creation |
| `runAgent.ts` | — | Agent execution runtime |
| `resumeAgent.ts` | — | Agent resumption |
| `agentMemory.ts` | — | Agent-specific memory |
| `agentMemorySnapshot.ts` | — | Memory snapshots |

**Built-in agents:** `generalPurposeAgent`, `planAgent`, `verificationAgent`, `exploreAgent`, `clawCodeGuideAgent`

### MCP Tools

| Tool | Modules | Description |
|------|---------|-------------|
| `MCPTool` | 4 | Core MCP protocol integration |
| `ListMcpResourcesTool` | 3 | List available MCP resources |
| `ReadMcpResourceTool` | 3 | Read MCP resources |
| `McpAuthTool` | 1 | MCP authentication |

**MCP tool naming convention:**
```
mcp__{server}__{tool}
```
Example: "weather tool" on "Example Server" → `mcp__Example_Server__weather_tool`

### Task Management

| Tool | Modules | Description |
|------|---------|-------------|
| `TaskCreateTool` | 3 | Create background tasks |
| `TaskGetTool` | 3 | Get task status |
| `TaskListTool` | 3 | List all tasks |
| `TaskUpdateTool` | 3 | Update task state |
| `TaskStopTool` | 3 | Stop running tasks |
| `TaskOutputTool` | 2 | Get task output |

### Multi-Agent Team Tools

| Tool | Modules | Description |
|------|---------|-------------|
| `TeamCreateTool` | 4 | Create agent team |
| `TeamDeleteTool` | 4 | Delete agent team |
| `SendMessageTool` | 4 | Send message to teammate or broadcast |
| `AskUserQuestionTool` | 2 | Ask user for input |

### Planning & Navigation

| Tool | Modules | Description |
|------|---------|-------------|
| `EnterPlanModeTool` | 4 | Enter plan-only mode |
| `ExitPlanModeTool` | 4 | Exit plan mode |
| `EnterWorktreeTool` | 4 | Enter git worktree isolation |
| `ExitWorktreeTool` | 4 | Exit worktree |
| `BriefTool` | 5 | Create structured brief |

### Web Tools

| Tool | Modules | Description |
|------|---------|-------------|
| `WebFetchTool` | 5 | Fetch web content |
| `WebSearchTool` | 3 | Search the web |
| `WebBrowserTool` | — | Browser automation (feature-flagged) |

### IDE Integration

| Tool | Modules | Description |
|------|---------|-------------|
| `LSPTool` | 6 | Language Server Protocol integration |
| `NotebookEditTool` | 4 | Jupyter notebook support |

**LSP modules:** `LSPTool`, `UI`, `formatters`, `prompt`, `schemas`, `symbolContext`

### Scheduling & Automation

| Tool | Modules | Description |
|------|---------|-------------|
| `ScheduleCronTool` | 5 | Create scheduled tasks |
| `CronDeleteTool` | — | Delete scheduled tasks |
| `CronListTool` | — | List scheduled tasks |
| `RemoteTriggerTool` | 3 | Remote task triggering |

### Utility Tools

| Tool | Modules | Description |
|------|---------|-------------|
| `ToolSearchTool` | 3 | Search/discover available tools (deferred loading) |
| `TodoWriteTool` | 3 | Task/todo tracking |
| `ConfigTool` | 5 | Configuration management (internal) |
| `SkillTool` | 4 | Skill invocation |
| `SleepTool` | 1 | Wait/delay |
| `SyntheticOutputTool` | 1 | Generate synthetic output |

### KAIROS-Exclusive Tools (unreleased)

| Tool | Description |
|------|-------------|
| `SendUserFileTool` | Send file to user via push notification |
| `PushNotificationTool` | Push notification to user devices |
| `SubscribePRTool` | Subscribe to GitHub PR events |

### Internal/Debug Tools

| Tool | Availability |
|------|-------------|
| `TungstenTool` | Internal Anthropic only (`USER_TYPE === 'ant'`) |
| `SuggestBackgroundPRTool` | Internal |
| `MonitorTool` | MCP monitoring |

---

## Tool Execution Pipeline

`runToolUse()` orchestrates:

```
1. Zod validation — inputSchema.safeParse(input)
2. Semantic validation — path traversal, size limits
3. Speculative classifier — Bash commands start security check before hooks
4. backfillObservableInput — shallow clone for hooks and canUseTool
5. PreToolUse hooks — async generators yielding progress/permission
6. canUseTool() — primary permission gate
7. tool.call() — actual execution
8. PostToolUse hooks — after completion
9. Result serialization — size budget processing
```

**3 copies of input maintained:**
1. API-bound original — for cache/serialization
2. Backfilled observable clone — for hooks and canUseTool
3. Hook-updated call input — potentially modified for execution

---

## Deferred Tool Loading (Tool Search)

### Context Window Savings

| Before (v2.1.68) | After (v2.1.69+) |
|------------------|------------------|
| ~14-16K tokens for tool definitions | ~968 tokens |
| All tools upfront | Only ToolSearch + non-deferred |

**93% reduction in tool definition tokens.**

### How Tool Search Works

1. Claude sees only `ToolSearchTool` + non-deferred tools at session start
2. When task requires a specific tool, calls `ToolSearchTool` with keyword
3. Returns 3-5 `tool_reference` blocks (most relevant matches)
4. References auto-expanded throughout conversation history
5. Tool now available for use in subsequent turns

### Configuration

```bash
# Threshold-based (loads when context > 10% full) — recommended
ENABLE_TOOL_SEARCH=auto

# Always deferred
ENABLE_TOOL_SEARCH=true

# All upfront (pre-v2.1.69 behavior)
ENABLE_TOOL_SEARCH=false
```

---

## Safety Architecture

### Safety Through Proximity

"Safety rules appear in the immediate context of the action they govern" — embedded directly in tool descriptions rather than separate policy files. This makes them harder for LLMs to overlook.

**Applied in SINAPSE:** Hook governance rules embedded in tool-specific hook scripts, not just in documentation.

### Tool Authority Matrix

| Agent Type | Tool Access |
|-----------|-------------|
| Built-in general-purpose | `['*']` — all tools |
| Built-in Explore | Read-only tools only |
| Built-in Plan | Read-only tools only |
| Built-in verification | No Edit/Write; allows /tmp scripts |
| Custom agents | Configured via `tools` + `disallowedTools` frontmatter |

### Permission Escalation Flow

```
ReadOnly → WorkspaceWrite → DangerFullAccess → Prompt → Allow
```

- Tools default to requiring `DangerFullAccess` unless explicitly configured
- Missing prompters deny escalation requests
- `Prompt` mode triggers interactive user decision-making

---

## MCP Transport Types

| Transport | Description | Use Case |
|-----------|-------------|----------|
| **Stdio** | Local process execution | Local CLI tools, scripts |
| **SSE** | Server-Sent Events (deprecated → HTTP) | Remote endpoints |
| **HTTP** | Remote endpoints with optional OAuth | Cloud services (recommended) |
| **WebSocket** | Real-time bidirectional | Real-time data |
| **SDK** | Built-in implementations | No external process needed |
| **ManagedProxy** | Anthropic-hosted proxy | Managed services |

**"Claude Code isn't built on top of MCP. It IS MCP — every capability, including Computer Use, runs as a tool call."**

Computer Use is implemented as `@ant/computer-use-mcp` — a dedicated MCP server, not special-cased functionality.

### MCP Tool Discovery: Deferred Loading

MCP tools are deferred by default — only tool names consume context until used. Tool Search discovers them on-demand. `ENABLE_TOOL_SEARCH=auto` for threshold-based loading.

---

## SINAPSE Tool Selection Guidance

### When to use each approach

| Scenario | Tool | Reason |
|----------|------|--------|
| Read files | `Read` (native) | Faster, no overhead |
| Write/edit files | `Write`/`Edit` (native) | Direct filesystem access |
| Run shell commands | `Bash` (native) | Security validation included |
| Search files | `Glob` (native) | Optimized pattern matching |
| Search content | `Grep` (native) | Regex with line numbers |
| Library documentation | Context7 (MCP) | Up-to-date docs |
| Web research | EXA (MCP via Docker) | Current information |
| Browser automation | Playwright (MCP) | Full browser control |
| Database operations | Supabase (MCP) | Native SQL operations |
| Code analysis | Nogic (MCP, essential) | Import chain, usage tracking |
| Dependency graphs | Code-Graph (MCP, essential) | Circular dependency detection |

**Rule:** Always prefer Tier 1 native tools. Only escalate to MCP when native tools cannot accomplish the task.
