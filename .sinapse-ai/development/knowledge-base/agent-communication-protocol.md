# Agent Communication Protocol — Scratchpad & Messaging

> Version 1.1 | Enforcement layer for agent-handoff.md Scratchpad Protocol

## Purpose

Enable persistent inter-agent knowledge sharing within a story context using the stigmergy pattern (indirect communication through environment modification, inspired by swarm intelligence). Agents leave traces in a shared scratchpad that subsequent agents read, avoiding redundant discovery and preserving institutional knowledge across handoffs.

## Scratchpad Structure

```
.sinapse/scratchpad/{story-id}/
  {agent-id}.md          # Per-agent discovery file (max 2KB)
  _summary.md            # Auto-generated cross-agent summary (optional)
```

Example:
```
.sinapse/scratchpad/6.1.4/
  developer.md           # Pixel's discoveries during implementation
  quality-gate.md        # Litmus's findings during QA
  architect.md           # Stratum's design decisions
  _summary.md            # Merged summary for quick onboarding
```

## What to Write

Each agent's scratchpad file MUST contain ONLY actionable information:

```markdown
# {Agent Name} — Story {story-id} Scratchpad

## Key Discoveries
- {Finding that would save the next agent time}
- {Unexpected behavior or edge case found}

## Decisions Made
- {Decision}: {Rationale} (alternatives considered: {list})

## Files Modified
- `path/to/file.ext` — {what changed and why}

## Blockers Found
- {Blocker description} — Status: {resolved|active|escalated}

## Warnings for Next Agent
- {Gotcha or trap that the next agent should know about}
```

## When to Write

| Event | Action | Required? |
|-------|--------|-----------|
| Before agent handoff (`@agent` switch) | Write scratchpad file | YES |
| After resolving a non-obvious blocker | Append to scratchpad | SHOULD |
| After making an architectural decision | Append to scratchpad | SHOULD |
| After discovering unexpected behavior | Append to scratchpad | SHOULD |

## When to Read

| Event | Action | Required? |
|-------|--------|-----------|
| Agent activation (incoming) | Read ALL files in story scratchpad | YES |
| Before making a decision that might conflict | Check scratchpad for prior decisions | SHOULD |
| Before investigating a bug | Check if already documented | SHOULD |

## File Size Limits

| Constraint | Limit |
|------------|-------|
| Per-agent file | 2KB max |
| Total scratchpad per story | 10KB max |
| Max agent files per story | 6 |

If a file approaches 2KB, prioritize: Warnings > Blockers > Decisions > Discoveries > Files Modified.

## Cleanup Protocol

| Event | Action |
|-------|--------|
| Story status changes to `Done` | Archive scratchpad to `.sinapse/scratchpad/archive/{story-id}/` |
| Story status changes to `Done` + 7 days | Delete archived scratchpad (optional) |
| Manual cleanup | `rm -rf .sinapse/scratchpad/{story-id}/` |

Archive preserves knowledge for future reference (similar bugs, patterns) while keeping the active scratchpad directory clean.

## Cross-Agent Messaging via Terminal Bus

For **real-time** communication between agents running in separate terminals, use the Terminal Bus (`.claude/rules/terminal-bus.md`):

| Need | Mechanism |
|------|-----------|
| Persistent knowledge sharing | Scratchpad (this protocol) |
| Real-time notifications | Terminal Bus (`mcp__terminal-bus__send_message`) |
| Status broadcasts | Terminal Bus (`mcp__terminal-bus__broadcast`) |
| Context sharing | Terminal Bus (`mcp__terminal-bus__share_context`) |

### Integration Pattern

When an agent writes a critical blocker to the scratchpad AND another agent is known to be active in a different terminal:

1. Write to scratchpad (persistent record)
2. Send Terminal Bus message (real-time alert):
   ```
   "BLOCKER found in story {id}: {brief description}. See scratchpad for details."
   ```

## Stigmergy Pattern Reference

This protocol implements **stigmergy** from swarm intelligence research:
- Agents modify the environment (scratchpad files) rather than communicating directly
- Subsequent agents observe environmental changes and adapt behavior
- No central coordinator needed for knowledge transfer
- Knowledge persists beyond individual agent sessions
- Scales naturally as more agents participate in a story

## Anti-Patterns

- Writing raw logs or verbose output to scratchpad (use summaries)
- Writing scratchpad entries for trivial findings (must save next agent real time)
- Reading scratchpad but ignoring its contents (rediscovering known issues)
- Deleting another agent's scratchpad file (append-only within a story lifecycle)
- Using scratchpad for inter-story communication (scope is per-story)

## .gitignore

The `.sinapse/` directory (including `scratchpad/`) is gitignored by default. Scratchpad data is ephemeral runtime state, not version-controlled artifacts.
