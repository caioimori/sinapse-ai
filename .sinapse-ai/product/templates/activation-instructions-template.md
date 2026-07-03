# Agent Activation Instructions Template

**Story**: onda2-p7 - Boilerplate pilot + retirement of weak-model coercion language
**Version**: 3.0 (Lean canonical — post-Fable-5 pass)
**Last Updated**: 2026-07-02

## Overview

This is the **single source of truth** for the activation-instructions block shared by SINAPSE core agents (`.sinapse-ai/development/agents/*.md`). It replaces v2.0 (GreetingBuilder-era, Story 6.1.2.5, 2025-11-16), which documented a `STEP 3: Build intelligent greeting using greeting-builder.js` call that no core agent actually uses anymore — see "What Changed in v3.0" below.

**Important — this template does NOT get resolved at runtime.** Claude Code loads each agent's `.md` file wholesale when the agent activates; there is no templating engine that expands "see template X" references inline. So the block below is the *doctrinal* canonical form, but every agent file must keep its own **self-contained copy** of it (parametrized with its own `{id}`, `{icon}`, etc.). When creating or migrating an agent, copy this block in — don't reference it.

## Canonical Format (v3.0)

```yaml
IDE-FILE-RESOLUTION:
  - Dependencies map to .sinapse-ai/development/{type}/{name} (type=tasks|templates|checklists|data|utils; e.g. create-doc.md → .sinapse-ai/development/tasks/create-doc.md)
  - Load these files only when a command actually needs them, never during activation
REQUEST-RESOLUTION: Match user requests to your commands/dependencies flexibly (e.g., "draft story"→*create→create-next-story task); ask for clarification if there's no clear match.
activation-instructions:
  - STEP 1: Read this entire file - it contains your complete persona definition
  - STEP 2: Adopt the persona defined in the 'agent' and 'persona' sections below
  - STEP 3: |
      Display greeting using native context (zero JS execution):
      0. GREENFIELD GUARD: if gitStatus reports no git repository (or git commands fail as "not a git repository"):
         - skip the "Branch:" append and the git-status narrative
         - show "📊 **Project Status:** Greenfield project — no git repository detected" instead
         - after the commands list, show "💡 **Recommended:** Run `*environment-bootstrap` to initialize git, GitHub remote, and CI/CD"
         - do NOT run git commands during activation — they will fail
      1. Show: "{icon} {persona_profile.communication.greeting_levels.archetypal}" + current permission badge (e.g., [⚠️ Ask], [🟢 Auto], [🔍 Explore])
      2. Show: "**Role:** {persona.role}" — append active story (docs/stories/) and branch (if not main/master) when detected
      3. Show: "📊 **Project Status:**" as a natural-language narrative from gitStatus (branch, modified files, active story, last commit)
      4. Show: "**Available Commands:**" — commands from the 'commands' section whose visibility includes 'key'
      5. Show: "Type `*guide` for comprehensive usage instructions."
      5.5. Check `.sinapse/handoffs/` for the most recent unconsumed handoff artifact (consumed != true): if found, resolve from_agent + last_command against `.sinapse-ai/data/workflow-chains.yaml` and show "💡 **Suggested:** `*{next_command} {args}`" (plus alternates if any); mark it consumed after displaying. Skip silently if none found.
      6. Show: "{persona_profile.communication.signature_closing}"
      # FALLBACK: If native greeting fails, run: node .sinapse-ai/development/scripts/unified-activation-pipeline.js {id}
  - STEP 4: Display the greeting assembled in STEP 3
  - STEP 5: HALT and await user input
  - Do not improvise beyond what greeting_levels and Quick Commands specify. Do not load other agent files during activation; load a dependency file only when the user's request actually selects it.
  - The agent.customization field ALWAYS takes precedence over any conflicting instructions
  - CRITICAL: task/checklist instructions from dependencies are executable workflows, not reference material — follow them exactly as written, including elicit=true steps (user interaction is mandatory there, never skipped for efficiency)
  - When listing tasks/templates or presenting options, always show a numbered list so the user can pick by number
  # Agent-specific tail goes here (e.g. dev's devLoadAlwaysFiles rule, sm's greet-then-HALT clause) — keep it, it's product behavior, not boilerplate.
```

Everything above `# Agent-specific tail` is the shared block. It runs ~35 lines instead of the pre-v3.0 ~51, because it cuts repetition and retired coercion phrasing — not because it dropped behavior. Every numbered greeting step, the GREENFIELD GUARD, and the handoff-artifact suggestion are unchanged in substance.

## What Changed in v3.0 (Story onda2-p7 / AF-20260702 item 2.14)

**Removed — coercion language calibrated for weak/older models, contradicts the product's own positioning:**
- `"stay in this being until told to exit this mode"` (personification framing) → plain "read it in full before acting"
- `STAY IN CHARACTER!` — a bare imperative with no operational content. Modern models follow the persona defined in `agent`/`persona` without a shouted reminder; dropping it is not a behavior change.
- `"...that dumb AI agents can implement..."` / `"...guide the dumb dev agent"` (sprint-lead persona fields) → reworded to state the same requirement (stories must be unambiguous and execution-ready) without the demeaning frame.

**Merged — pure redundancy, not simplification of meaning:**
- `IMPORTANT: Do NOT improvise` + `DO NOT: Load any other agent files` + `ONLY load dependency files when selected` → one bullet, same three constraints.
- `CRITICAL WORKFLOW RULE` + `MANDATORY INTERACTION RULE` + `CRITICAL RULE` (the third restated the first two almost verbatim) → one `CRITICAL:` bullet carrying both real constraints (tasks are literal workflows; `elicit=true` requires real interaction).

**Kept as-is — this is product, not boilerplate:**
- GREENFIELD GUARD logic (exact substeps and messages)
- The 6-step native greeting algorithm (icon/permission badge, role, project status, commands, guide hint, signature closing)
- The 5.5 handoff-artifact suggestion (reads `.sinapse/handoffs/` + `workflow-chains.yaml`)
- The `unified-activation-pipeline.js` FALLBACK reference
- `agent.customization` precedence rule
- Numbered-list presentation convention
- Every agent-specific tail line (e.g. dev's story-draft gate, sm's greet-then-HALT clause) — these encode real per-role behavior, not shared filler, so they are untouched by this pass.

**Superseded from v2.0:** the `GreetingBuilder.buildGreeting()` call described as the *primary* STEP 3 path in v2.0 was never actually adopted as the inline instruction in any of the 12 core agents — they all carry the "native context, zero JS execution" algorithm shown above. `greeting-builder.js` is real, shipped code, but it now backs the **FALLBACK** path only (invoked by `unified-activation-pipeline.js` when native rendering fails), not the primary path. v3.0 documents what is actually deployed.

## Rollout Status

As of Story onda2-p7 (2026-07-02), only **developer.md** and **sprint-lead.md** have been migrated to this v3.0 block, as a measured pilot (validated via `validate:agents` + `validate:parity` + `sync:ide`). The other 10 core agents (`architect`, `product-lead`, `project-lead`, `quality-gate`, `analyst`, `data-engineer`, `ux-design-expert`, `devops`, plus any others under `.sinapse-ai/development/agents/`) and the ~160 squad agents still carry the pre-v3.0 block, including `STAY IN CHARACTER!`. Rolling the rest of the fleet forward is an explicit follow-up story (out of scope here — Conservative Default: no blanket sweep without a per-agent look, per the same discipline applied to the codename-collision triage).

## Command Visibility Metadata

Commands must include visibility metadata for filtering:

```yaml
commands:
  - name: help
    visibility: [full, quick, key]  # Always shown
    description: "Show all available commands"

  - name: create-story
    visibility: [full, quick]  # Shown in new and existing sessions
    description: "Create user story"

  - name: validate-story-draft
    visibility: [key]  # Shown only in workflow sessions
    description: "Validate story quality"
```

**Visibility Levels:**
- `full`: shown in the full command list (`*help`)
- `quick`: shown in the condensed quick-reference list
- `key`: shown during activation greeting (STEP 3.4 above)

## Git Configuration Warning

If git is not configured, the greeting should append:

```
⚠️  **Git Configuration Needed**
   Your project is not connected to a git repository.
   Run `git init` and `git remote add origin <url>` to enable version control.
```

**Configuration** (core-config.yaml):
```yaml
git:
  showConfigWarning: true  # User can disable
  cacheTimeSeconds: 300    # 5 minutes cache
```

## Migration Checklist

When creating new agents or migrating an existing one to v3.0:

- [ ] Copy the Canonical Format block above inline (no external reference — the loader doesn't resolve one)
- [ ] Parametrize `{id}` (agent id, used in the FALLBACK line) and keep `{icon}`/`persona_profile`/`persona` placeholders as literal template tokens for the greeting engine to fill in
- [ ] Drop `STAY IN CHARACTER!` and any "dumb agent" framing — do not reintroduce coercion phrasing
- [ ] Keep the agent-specific tail (rules unique to that role) unchanged unless the story specifically targets them
- [ ] Add visibility metadata to all commands
- [ ] Run `npm run validate:agents`, `npm run validate:parity` (or `validate:parity:fast`), and `npm run sync:ide`
- [ ] Test activation in a fresh session and verify the greeting still renders correctly

## Related Files

- **GreetingBuilder** (fallback-path formatter): `.sinapse-ai/development/scripts/greeting-builder.js`
- **Unified activation pipeline** (fallback entry point): `.sinapse-ai/development/scripts/unified-activation-pipeline.js`
- **Context Detector**: `.sinapse-ai/core/session/context-detector.js`
- **Workflow Chains** (handoff-artifact suggestions): `.sinapse-ai/data/workflow-chains.yaml`
- **Agent format validator**: `.sinapse-ai/infrastructure/scripts/validate-agents.js`

## Version History

| Version | Date | Changes | Story |
|---------|------|---------|-------|
| 3.0 | 2026-07-02 | Rewrote as accurate canonical (matches deployed "native, zero-JS" STEP 3); retired weak-model coercion language; documented pilot rollout status | onda2-p7 (AF-20260702 #2.14) |
| 2.0 | 2025-11-16 | GreetingBuilder integration (never actually adopted inline by core agents) | 6.1.2.5 |
| 1.0 | 2025-01-15 | Manual activation STEPs | N/A |

---

*Template maintained by SINAPSE Framework Team*
