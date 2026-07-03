---
paths:
  - ".sinapse-ai/development/agents/**"
---

# Agent Handoff Protocol — Context Compaction

## Purpose

Preserve working continuity when switching between SINAPSE agents (`@agent` commands). Each agent switch passes forward a structured handoff artifact — active story, key decisions, files touched, blockers, next action — instead of the previous agent's full persona. (Context-window accounting was retired: with 1M-class windows and native auto-compact, the old token arithmetic no longer applies — see DEC-05.)

## When This Applies

This protocol activates whenever:
1. A user invokes a new agent via `@agent-name` or `/SINAPSE:agents:agent-name`
2. The current session already has a different agent active

## Handoff Protocol

### On Agent Switch (outgoing agent)

Before loading the new agent, mentally generate a handoff artifact with:

```yaml
handoff:
  from_agent: "{current_agent_id}"
  to_agent: "{new_agent_id}"
  story_context:
    story_id: "{active story ID}"
    story_path: "{active story path}"
    story_status: "{current status}"
    current_task: "{last task being worked on}"
    branch: "{current git branch}"
  decisions:
    - "{key decision 1}"
    - "{key decision 2}"
  files_modified:
    - "{file 1}"
    - "{file 2}"
  blockers:
    - "{any active blockers}"
  next_action: "{what the incoming agent should do}"
```

### On Agent Switch (incoming agent)

The incoming agent receives:
1. Its own **full agent profile** (persona, commands, dependencies)
2. The **handoff artifact** from the previous agent (compact summary)
3. **NOT** the previous agent's full persona/instructions/tool definitions

### Scratchpad Protocol (v1.1)

**Before starting work**, the incoming agent MUST:
1. Check if `.sinapse/scratchpad/{story-id}/` exists
2. If yes, read ALL files in that directory (discoveries from previous agents)
3. Use those insights to inform decisions (avoid rediscovering known issues)

**Before handing off**, the outgoing agent SHOULD:
1. Write key discoveries to `.sinapse/scratchpad/{story-id}/{agent-id}.md`
2. Include the scratchpad path in the handoff artifact `scratchpad_path` field
3. Keep each file under 2KB (focused insights, not logs)

### Artifact discipline

Keep the artifact SHORT and factual (a screenful): up to 5 decisions, 10 files,
3 blockers. It is a signal for the incoming agent, not a log.

### What to Preserve (ALWAYS include)

- Active story ID and path
- Current task being worked on
- Git branch name
- Key architectural decisions made
- Files created or modified
- Active blockers

### What to Discard (NEVER carry forward)

- Previous agent's full persona definition
- Previous agent's command list
- Previous agent's dependency list
- Previous agent's tool configurations
- Previous agent's CodeRabbit integration details
- Previous agent's greeting templates

## Storage

Persisting the artifact to disk is OPTIONAL (`.sinapse/handoffs/`, runtime,
gitignored) — measured 2026-07-02: zero artifacts ever written; the artifact's value
is in the conversation, not the file.

## Template Reference

Full template: `.sinapse-ai/development/templates/agent-handoff-tmpl.yaml`

## Example

Session flow: `@sm` creates story → `@dev` implements → `@qa` reviews

After `@sm` → `@dev` switch: `@dev` starts from the handoff artifact (story ID,
decisions, files, next action) — it does not re-derive `@sm`'s reasoning, and it
does not need `@sm`'s persona.
