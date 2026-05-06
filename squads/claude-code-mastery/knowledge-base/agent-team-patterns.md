# Agent Team Patterns

## Overview

Claude Code supports multi-agent architectures through subagents, worktree isolation, and orchestration patterns. This guide covers how to design, deploy, and manage agent teams for complex development tasks.

## Subagent Fundamentals

### What Is a Subagent?

A subagent is a Claude Code instance spawned by the main agent to handle a specific task. Subagents:

- Have their own context window (do not share the parent's conversation history)
- Inherit project configuration (CLAUDE.md, rules, settings)
- Can be given a scoped task description
- Report results back to the parent agent
- Can operate in isolated worktrees

### When to Use Subagents

| Scenario | Use Subagent? | Rationale |
|----------|--------------|-----------|
| Independent research task | Yes | Does not pollute main context |
| Parallel feature implementation | Yes | Can work in separate worktree |
| Simple file edit | No | Overhead not justified |
| Task requiring main conversation context | No | Context not shared |
| Long-running background validation | Yes | Does not block main agent |
| Code review of changes | Yes | Clean perspective without implementation bias |

### Subagent Configuration

Subagents are spawned via the Task tool with specific instructions:

```
TaskCreate:
  description: "Review the authentication module for security vulnerabilities"
  context: "Focus on SQL injection, XSS, and CSRF. Check src/auth/ directory."
```

The subagent receives:
- The task description as its primary directive
- Project-level CLAUDE.md and rules (same as parent)
- Its own fresh conversation context
- Access to the same tools as the parent (unless restricted)

---

## Agent Team Patterns

### Pattern 1: Research Agent

**Purpose:** Gather information without consuming main agent's context.

**Architecture:**
```
Main Agent
  └── Research Subagent
        ├── Read multiple files
        ├── Search codebase
        ├── Analyze patterns
        └── Return summary (compact)
```

**Use case:** "Before implementing feature X, research how similar patterns are implemented in this codebase."

**Key design decision:** The research agent returns a SUMMARY, not raw data. This compresses potentially thousands of tokens of file contents into a focused report.

### Pattern 2: Validation Agent

**Purpose:** Review work without the implementation agent's biases.

**Architecture:**
```
Main Agent (implements)
  └── Validation Subagent (reviews)
        ├── Read implemented files
        ├── Run tests
        ├── Check standards
        └── Return verdict + issues
```

**Use case:** After implementing a feature, spawn a validation agent to review the code with fresh eyes.

**Key design decision:** The validation agent has no knowledge of the implementation decisions or trade-offs — it judges the code purely on its own merits.

### Pattern 3: Parallel Workers

**Purpose:** Implement multiple independent features simultaneously.

**Architecture:**
```
Orchestrator Agent
  ├── Worker A (worktree: feature/auth)
  │     └── Implement authentication
  ├── Worker B (worktree: feature/dashboard)
  │     └── Implement dashboard
  └── Worker C (worktree: feature/api)
        └── Implement API routes

  Sync Point: Merge all worktrees
```

**Use case:** Decompose an epic into independent stories that can be implemented in parallel.

**Key design decisions:**
- Each worker operates in its own Git worktree (full isolation)
- Workers MUST NOT modify the same files (enforced by decomposition)
- Orchestrator waits for all workers, then merges

### Pattern 4: Pipeline Chain

**Purpose:** Sequential processing where each stage transforms the output.

**Architecture:**
```
Main Agent
  └── Stage 1: Analyze (subagent)
        └── Stage 2: Design (subagent)
              └── Stage 3: Implement (subagent)
                    └── Stage 4: Review (subagent)
```

**Use case:** Spec pipeline where analysis informs design, design informs implementation, implementation is reviewed.

**Key design decision:** Each stage produces a compact artifact that serves as input to the next stage. No raw context is carried forward.

### Pattern 5: Specialist Delegation

**Purpose:** Route subtasks to agents with domain-specific expertise.

**Architecture:**
```
Orchestrator
  ├── Database Specialist → Schema changes
  ├── Frontend Specialist → UI components
  ├── Backend Specialist → API routes
  └── Test Specialist → Test coverage
```

**Use case:** A full-stack feature that touches database, backend, frontend, and tests.

**Key design decision:** Each specialist has domain-specific instructions in its task description, focusing it on its area of expertise.

---

## Worktree Isolation

### How Worktrees Work

Git worktrees allow multiple working directories from the same repository, each on a different branch:

```bash
# Create a worktree for parallel work
git worktree add ../project-feature-auth feature/auth

# List active worktrees
git worktree list

# Remove after merge
git worktree remove ../project-feature-auth
```

### When to Use Worktrees

| Condition | Worktree? | Alternative |
|-----------|-----------|-------------|
| Agents modify different files | Optional | Same branch works |
| Agents modify same files | Required | Impossible without isolation |
| Need to test changes independently | Required | Cannot isolate on same branch |
| Simple sequential work | No | Unnecessary overhead |
| Long-running parallel tasks | Yes | Prevents blocking |

### Worktree Lifecycle

```
1. CREATE
   git worktree add ../worktree-{name} -b {branch-name}

2. CONFIGURE
   Ensure .claude/ config is accessible in worktree

3. EXECUTE
   Subagent works in worktree directory

4. VERIFY
   Run tests in worktree before merge

5. MERGE
   git checkout main && git merge {branch-name}

6. CLEANUP
   git worktree remove ../worktree-{name}
   git branch -d {branch-name}
```

### Branch Naming Convention

```
agent/{agent-type}/{feature-slug}

Examples:
  agent/worker-1/auth-module
  agent/worker-2/dashboard-ui
  agent/reviewer/security-audit
  agent/research/codebase-analysis
```

### Merge Strategy

| Conflict Level | Strategy |
|----------------|----------|
| No conflicts (different files) | Fast-forward or automatic merge |
| Minor conflicts (same file, different sections) | Automatic merge with verification |
| Major conflicts (same lines) | Human review or re-decompose task |

---

## Team Topologies

### Stream-Aligned Teams

**Pattern:** One agent team per feature or user story.

**Structure:**
```
Feature Team A:
  - Implementer (writes code)
  - Reviewer (validates code)
  - Tester (writes and runs tests)
```

**Best for:** Projects with clearly separable features.

### Platform Teams

**Pattern:** Shared agents that provide services to multiple feature teams.

**Structure:**
```
Platform Agents:
  - Database Agent (schema changes for anyone)
  - CI/CD Agent (pipeline management)
  - Documentation Agent (keeps docs updated)

Feature Teams call Platform Agents as needed.
```

**Best for:** Projects where infrastructure work cuts across features.

### Enabling Teams

**Pattern:** Agents that coach and review but don't implement.

**Structure:**
```
Enabling Agents:
  - Architecture Reviewer (reviews design decisions)
  - Security Auditor (reviews security implications)
  - Performance Advisor (reviews performance impact)

Feature Teams consult Enabling Agents at key decision points.
```

**Best for:** Projects needing quality gates without blocking implementation.

---

## Orchestration Best Practices

### 1. Minimize Coordination Overhead

Every inter-agent interaction has a cost (tokens, latency, potential for miscommunication). Design for maximum agent independence.

**Rule of thumb:** If two agents need to communicate more than 3 times during a task, they should probably be one agent.

### 2. Define Clear Contracts

Each agent should have explicit:
- **Input:** What it receives (format, required fields)
- **Output:** What it produces (format, completeness criteria)
- **Scope:** What files it can touch
- **Constraints:** What it must not do

### 3. Handle Failures Gracefully

```
Agent fails → Check error type
  ├── Transient (timeout, rate limit) → Retry (max 2)
  ├── Permanent (bad input, impossible task) → Report to orchestrator
  └── Unknown → Escalate to human
```

### 4. Monitor Agent Performance

Track per-agent:
- Completion rate
- Average execution time
- Token consumption
- Error rate
- Output quality (via review agents)

### 5. Right-Size the Team

| Task Complexity | Recommended Team Size |
|----------------|----------------------|
| Simple (< 5 files) | 1 agent (no team needed) |
| Medium (5-15 files) | 2-3 agents (implement + review) |
| Large (15-50 files) | 3-5 agents (parallel workers + orchestrator) |
| Epic (50+ files) | 5-8 agents (full team topology) |

Over-decomposition creates more coordination overhead than it saves in parallelism.
