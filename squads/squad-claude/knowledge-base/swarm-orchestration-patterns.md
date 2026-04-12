# Swarm Orchestration Patterns

> Multi-agent frameworks comparison, orchestration patterns, and implementation guidance. Based on MS-009 research + Claude Code internals analysis (April 2026).

---

## Framework Landscape (2026)

### 9 Frameworks Compared

| Framework | Architecture | Control Level | Ideal For | Maturity |
|-----------|-------------|---------------|-----------|----------|
| **LangGraph** | State machine with directed graph | Maximum (nodes, edges, conditional routing) | Enterprise production, complex flows | High |
| **CrewAI** | Role-playing + task delegation | Medium (roles, tasks, SOPs) | Rapid prototyping, conceptual teams | High |
| **Claude Agent SDK** | Claude-native with tool use | Medium | Claude ecosystem, Sonnet 4.5/4.6 | High |
| **OpenAI Agents SDK** | Agents with handoffs + guardrails | Medium | OpenAI ecosystem | High |
| **Google ADK** | Agent Development Kit | Medium | Google/Gemini ecosystem | High |
| **Microsoft Agent Framework** | AutoGen + Semantic Kernel unified | Medium-High | Enterprise Microsoft stack | New (2026) |
| **AG2 (AutoGen fork)** | Multi-agent conversation | Low-Medium | Open-source community | Active |
| **deepagents (LangChain)** | Batteries-included harness | Medium | Long-horizon tasks, LangChain users | Growing |
| **Ruflo** | 60+ agent swarm with MCP | N/A | Claude Code native | New |

**Note (April 2026):** Microsoft retired AutoGen in favor of new Microsoft Agent Framework, unifying AutoGen + Semantic Kernel. AutoGen is maintenance-only. Community fork: AG2 (ag2ai/ag2).

---

## Claude Code Multi-Agent Architecture

### 3 Execution Models

#### 1. Fork Model (Experimental)

Subagents created with **byte-identical context copies** for cache sharing.

**Key innovation:** Fork children use identical placeholder text for each `tool_result` block, guaranteeing prefix-identical prompts across all workers. "Spawning five forked agents costs barely more than 1."

```
Parent Agent (with full context)
  → forkSubagent() × N
  → Children: identical system prompt prefix + unique task
  → KV cache shared across all children
  → Cost: ~1.0x base (not N×)
```

#### 2. Teammate Model

Independent agents with separate context windows.

**Communication:** Task files on disk + `SendMessageTool` — **no shared memory**.

```json
// SendMessageTool targets
{ "target": "teammate-name" }  // written to mailbox
{ "target": "*" }               // broadcast to all
{ "target": "team-lead" }       // shutdown approve/reject
{ "target": "uds:/path" }       // Unix domain socket
```

#### 3. Worktree Model

Git worktree isolation for parallel implementation.

```bash
# Each agent gets isolated git worktree
git worktree add .worktrees/agent-auth -b agent/auth
git worktree add .worktrees/agent-ui -b agent/ui

# Agents work independently
# No merge conflicts during parallel work
# Human reviews and merges when both complete
```

---

## Claude Code Coordinator Mode

### 4-Phase Pattern

```
Phase 1: Research (parallel)
  Workers investigate different parts of codebase simultaneously
  Each worker returns compact findings report

Phase 2: Synthesis
  Coordinator reads all findings
  Crafts detailed implementation specs

Phase 3: Implementation (parallel)
  Workers execute per-spec changes in isolated worktrees
  Specs ensure no file conflicts

Phase 4: Verification
  Separate testing workers validate changes
  Report back with PASS/FAIL verdicts
```

**Coordinator instructions (from source):**
- "Parallelism is your superpower"
- "Do not rubber-stamp weak work"

### Coordinator Mode Implementation

Implemented via system prompt, not code:

```markdown
## Coordinator Instructions

You are orchestrating a team of worker agents.

Your responsibilities:
1. Decompose the task into independent units
2. Assign each unit to a worker with clear specs
3. Wait for all workers to complete
4. Synthesize results — do not rubber-stamp weak work
5. If a worker fails, diagnose and re-assign

Rules:
- Workers work in isolated git worktrees
- Workers communicate via SendMessageTool only
- You manage the overall task state
- Parallelism is your superpower
```

---

## Reasoning Patterns for Agents

### 5 Core Patterns

| Pattern | Description | Best For |
|---------|-------------|---------|
| **ReAct** | Reason + Act in loop: think → execute → observe | Tasks with tools (search, edit) |
| **Chain of Thought (CoT)** | Linear step-by-step reasoning | Sequential problems, math |
| **Tree of Thought (ToT)** | Explore multiple reasoning paths as tree | Problems with multiple solutions |
| **Graph of Thought (GoT)** | Reasoning as graph — can merge/refine thoughts | Complex synthesis from multiple sources |
| **Reflection** | Agent evaluates and critiques its own output | Quality improvement, self-correction |

### ReAct Pattern (Production Standard)

```
[Thought]: I need to find all TypeScript files that import from auth module
[Action]: Grep(pattern="from.*auth", glob="**/*.ts")
[Observation]: Found 23 files
[Thought]: Now I need to check if any use the deprecated method
[Action]: Grep(pattern="useDeprecatedAuth", files=<previous results>)
[Observation]: 5 files use deprecated method
[Thought]: I have a complete picture. Should create migration plan.
[Response]: Here is the migration plan for 5 affected files...
```

---

## Agentic Architecture for Second Brain

### 6-Agent Specialization Model

```
[Main Orchestrator]
  |
  |-- [Capture Agent]     → Monitors sources, ingests content
  |-- [Curation Agent]    → Connects, tags, classifies notes
  |-- [Research Agent]    → Searches, navigates, discovers
  |-- [Synthesis Agent]   → Summarizes, combines, produces
  |-- [Quality Agent]     → Validates, scores, suggests improvements
  |-- [Maintenance Agent] → Detects decay, archives, cleans up
```

**For SINAPSE squads, this maps to:**
```
[sinapse-orqx / squad *-orqx]
  |-- @developer → implementation tasks
  |-- @quality-gate → validation tasks
  |-- @architect → design tasks
  |-- @analyst → research tasks
```

---

## Task Decomposition Patterns

### Pattern 1: Independence Decomposition

**Goal:** Minimize coordination overhead by creating truly independent subtasks.

```python
def decompose_for_parallelism(epic):
    subtasks = []
    for story in epic.stories:
        # Check: does this story touch files other stories touch?
        if not overlaps_with_others(story, epic.stories):
            subtasks.append(ParallelTask(story))
        else:
            subtasks.append(SequentialTask(story))
    return subtasks
```

**Claude Code rule:** "If two agents need to communicate more than 3 times during a task, they should probably be one agent."

### Pattern 2: Pipeline Chain

Sequential processing where each stage transforms the output:

```
Stage 1: Analyze (subagent)
  → produces: analysis.json (compact artifact)
  ↓
Stage 2: Design (subagent)
  → receives: analysis.json
  → produces: design.md (compact artifact)
  ↓
Stage 3: Implement (subagent)
  → receives: design.md
  → produces: code changes
  ↓
Stage 4: Review (subagent)
  → receives: code changes
  → produces: review verdict
```

**Key principle:** Each stage produces a **compact artifact** as input to the next. No raw context carried forward.

### Pattern 3: Specialist Routing

```
Orchestrator classifies task
  → Database work → @data-engineer agent
  → UI work → @ux-design-expert agent
  → API work → @developer agent
  → Testing → @quality-gate agent
```

Each specialist has domain-specific instructions and tool permissions focused on their area.

### Pattern 4: Critic-Generator Loop

```
Generator Agent → produces initial output
  → Critic Agent → evaluates output
  → If APPROVED: done
  → If NEEDS_REVISION: Generator revises (max N iterations)
  → If BLOCKED: Escalate to human
```

Used in SINAPSE for story validation (sprint-lead creates → product-lead validates → developer implements → quality-gate reviews).

---

## Parallel Execution Guidelines

### Right-Sizing Agent Teams

| Task Complexity | Team Size | Pattern |
|----------------|-----------|---------|
| Simple (< 5 files) | 1 agent | No team needed |
| Medium (5-15 files) | 2-3 agents | Implement + review |
| Large (15-50 files) | 3-5 agents | Parallel workers + orchestrator |
| Epic (50+ files) | 5-8 agents | Full team topology |

**Over-decomposition creates more coordination overhead than parallelism saves.**

### Concurrency Safety Rules

```python
# From Claude Code source
class ConcurrencyModel:
    # Tools default to non-concurrent (assume state mutation)
    isConcurrencySafe = False
    
    # Only mark concurrent-safe when PROVEN independent
    # Examples of safe: Read(different files), Grep, Glob
    # Examples of unsafe: Edit(same file), sequential git operations
```

**CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY** = 10 (default cap).

---

## Swarm Communication Protocols

### Event-Driven Communication

```
Agent A completes task
  → Writes result to shared task file
  → Broadcasts via SendMessageTool("*", "task_complete")
  → Orchestrator receives notification
  → Orchestrator routes to next stage
```

### Mailbox Pattern

```python
# Worker sends to orchestrator
SendMessageTool(target="orchestrator", message={
    "type": "result",
    "task_id": "auth-module",
    "status": "complete",
    "artifacts": ["src/auth/", "tests/auth/"],
    "verdict": "PASS",
    "notes": "Found 2 minor issues, both fixed"
})

# Worker requests permission for dangerous op
SendMessageTool(target="orchestrator", message={
    "type": "permission_request",
    "operation": "delete_legacy_files",
    "files": ["src/old-auth.ts", "src/auth-v1.ts"],
    "justification": "Replaced by new implementation"
})
```

### Permission Queue (Coordinator Mode)

Workers request authorization for dangerous operations via a queue:
1. Worker sends permission request to coordinator
2. Coordinator evaluates (or escalates to human)
3. Coordinator responds: APPROVE / DENY / MODIFY
4. Worker proceeds or adjusts plan

**Atomic Claim Mechanism:** `createResolveOnce` prevents duplicate handling of the same request.

---

## BMAD Method Patterns

BMAD (Breakthrough Method for Agile AI-Driven Development) v6 provides patterns SINAPSE can adopt.

### Document Sharding

Large documents split into focused pieces:
- Standard: ~5,000 tokens per document
- Sharded: ~300 tokens per shard
- **74-90% token consumption reduction**

**Applied to SINAPSE PRDs:** Instead of one large PRD.md, shard into:
- `prd-overview.md` (~300 tokens)
- `prd-requirements-fr.md` (~300 tokens)
- `prd-requirements-nfr.md` (~300 tokens)
- `prd-constraints.md` (~300 tokens)
- `prd-acceptance-criteria.md` (~300 tokens)

Agents load only the shards they need.

### Party Mode

Multiple agent personas collaborating within a single session — relevant context shared, irrelevant context excluded per persona.

**SINAPSE equivalent:** Each `@agent` activation follows the handoff protocol, compacting previous agent to ~379 tokens.

---

## Guardrails and Governance

### Authority Matrix (SINAPSE)

| Agent | Can Write | Read-Only | Blocked |
|-------|-----------|-----------|---------|
| @developer | `packages/`, `src/`, stories (checkboxes) | Everything | `git push`, `gh pr` |
| @quality-gate | `tests/`, review files | Source code | Write to src/ |
| @architect | `docs/architecture/` | System-wide | Application code |
| @devops | Remote operations | Everything | — |
| @sinapse-orqx | Everything | Everything | — |

### Escalation Protocol

```
Agent cannot complete task
  → Escalate to @sinapse-orqx
  
Quality gate fails
  → Return to @developer with specific feedback
  
Constitutional violation detected
  → BLOCK, require fix before proceeding
  
Agent boundary conflict
  → @sinapse-orqx mediates
```

### Infinite Loop Prevention

```python
# Maximum iterations per task
MAX_ITERATIONS = {
    "qa_loop": 5,
    "reflection_loop": 3,
    "research_loop": 10,
    "synthesis_loop": 3
}

# Break conditions
if iteration > max_iterations:
    raise EscalateToHuman("Max iterations reached")

if delta_tokens < 500 and iterations > 3:
    early_stop("Diminishing returns detected")
```

---

## Anti-Patterns

| Anti-pattern | Problem | Fix |
|-------------|---------|-----|
| Agent proliferation | Too many agents without clear coordination | One agent per concern, max 8 per epic |
| Infinite loops | Agents calling each other without stop condition | Max iterations + break conditions |
| Authority confusion | Multiple agents with authority over same resource | Clear ownership matrix |
| Skill bloat | Too many overlapping skills | Audit for duplicates quarterly |
| Over-parallelization | Coordination overhead > parallelism savings | Right-size teams (see table above) |
| Tight coupling | Agents sharing mutable state | Communication via immutable artifacts only |
| Bypassing orchestrator | User → specialist directly (multi-squad work) | Always route through orchestrator |
