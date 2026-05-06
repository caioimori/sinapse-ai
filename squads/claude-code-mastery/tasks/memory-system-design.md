---
task: memory-system-design
responsavel: "@skill-craftsman"
responsavel_type: Agent
atomic_layer: Task
elicit: false
Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true
Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Validar inputs"
  - "[ ] Executar steps"
  - "[ ] Verificar qualidade"
  - "[ ] Gerar output"
---

# Memory System Design

## Objective

Design a persistent memory system for Claude Code projects that retains important context across sessions, manages agent-specific memories, and provides efficient retrieval of historical decisions, patterns, and learnings without overwhelming the context window.

## Pre-Conditions

- Project with multi-session workflow (context lost between sessions)
- Important decisions and patterns that need to persist identified
- Agent or role-specific memory requirements documented
- Storage location and format preferences established
- Context budget for memory loading defined

## Steps

1. **Identify Memory Categories** — Define what types of information need persistence: architectural decisions (ADRs), coding patterns established, user preferences, project conventions, error resolutions, performance baselines, and workflow configurations. Categorize as critical (always load), frequent (load on demand), and archival (search when needed).
2. **Design Memory Schema** — Create a structured format for memory entries: unique ID, category, creation date, last accessed date, relevance score, content, source (which agent/session created it), and expiration policy. Use YAML or JSON for machine readability.
3. **Plan Storage Architecture** — Define where memories are stored: MEMORY.md files per agent (simple, git-tracked), a centralized memory database (structured, queryable), or a hybrid approach. Consider git-friendliness, searchability, and token efficiency.
4. **Implement Memory Lifecycle** — Design the full lifecycle: creation (when new memory is added), validation (is it worth remembering?), consolidation (merge related memories), retrieval (find relevant memories for current task), deprecation (mark outdated), and pruning (remove expired/low-value entries).
5. **Design Retrieval Strategy** — Create rules for loading memories into context: always-load memories go in CLAUDE.md or rules, task-triggered memories load based on file paths or agent activation, and search-based memories are retrieved on demand via grep or index.
6. **Build Memory Scoring System** — Implement a scoring system that prioritizes memories: recency (recently created/accessed score higher), frequency (frequently accessed score higher), impact (memories that prevented errors score higher), and relevance (memories matching current task context score higher).
7. **Create Memory Compaction** — Design how memories are compressed over time: detailed entries age into summaries, multiple related entries merge into patterns, and specific examples generalize into rules. Define compaction triggers (memory count threshold, age threshold).
8. **Implement Cross-Agent Memory Sharing** — Design how agents share memories: shared memory space for team-wide decisions, agent-specific memory for persona-related learnings, and handoff memories for agent-to-agent transitions (reference the agent-handoff protocol).
9. **Add Memory Validation Gates** — Create quality gates for new memories: is this information not already known by Claude? Is it specific enough to be useful? Is it stable (not likely to change next session)? Does it fit within the memory budget? Reject memories that fail validation.
10. **Design Memory Dashboard** — Create a memory health report: total memory entries, token budget usage, memory age distribution, most/least accessed entries, candidates for compaction, and candidates for pruning.

## Output

```markdown
# Memory System Design

## Memory Categories
| Category | Load Strategy | Max Entries | Token Budget |
|----------|-------------|-------------|-------------|

## Memory Schema
```yaml
memory:
  id: "{uuid}"
  category: "{category}"
  created: "{date}"
  last_accessed: "{date}"
  relevance_score: {1-10}
  source_agent: "{agent_id}"
  content: "{memory content}"
  expiration: "{policy}"
```

## Storage Architecture
- Primary: {storage method}
- Index: {search/retrieval method}
- Backup: {backup strategy}

## Lifecycle Rules
| Phase | Trigger | Action | Output |
|-------|---------|--------|--------|

## Retrieval Rules
| Context | Memories Loaded | Method |
|---------|----------------|--------|

## Compaction Rules
| Trigger | Action | Example |
|---------|--------|---------|

## Memory Budget
- Total budget: {tokens}
- Always-load: {tokens} ({%})
- On-demand: {tokens} ({%})
- Search: unlimited (not pre-loaded)
```

## Quality Criteria

- Memory system must operate within defined token budget (no context overflow)
- Retrieval must surface relevant memories with at least 80% precision
- Compaction must reduce memory token count by at least 30% without losing critical information
- Cross-agent memory sharing must respect agent boundaries (no leaking persona-specific memories)
- Memory validation gates must reject at least 40% of candidate memories (ensuring quality)
- Memory dashboard must accurately report current state and actionable recommendations
