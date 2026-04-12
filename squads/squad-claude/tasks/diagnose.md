---
task: diagnose
responsavel: "@claude-orqx"
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

# Diagnose

## Objective

Diagnose and resolve Claude Code issues by systematically narrowing down the problem domain, identifying root causes, and providing actionable fixes. Covers configuration errors, hook failures, MCP connectivity issues, context overflow, and permission problems.

## Inputs

- Symptom description (what is going wrong)
- Error messages (if any)
- Recent changes to configuration (if known)
- Claude Code version
- Operating system and shell environment

## Steps

1. **Classify Symptom** — Categorize the issue: Configuration (wrong behavior), Hook (automation failure), MCP (connection/tool error), Context (overflow/degradation), Permission (blocked action), or Unknown.
2. **Gather Diagnostics** — Read relevant configuration files based on classification. For config issues: settings.json + CLAUDE.md. For hooks: hook definitions + recent logs. For MCP: server configs + connection status. For context: measure token footprint.
3. **Check Common Causes** — Run through the common causes checklist for the classified category: syntax errors, missing fields, version incompatibilities, permission mismatches, stale caches.
4. **Identify Root Cause** — Trace the symptom to its root cause using elimination. Document the causal chain: trigger -> intermediate effect -> observed symptom.
5. **Design Fix** — Create a specific, minimal fix that addresses the root cause without side effects. Include rollback instructions.
6. **Validate Fix** — Verify the fix resolves the symptom and does not introduce regressions. If the fix involves config changes, run the relevant audit task.
7. **Document Resolution** — Record the issue, root cause, and fix for future reference.

## Quality Gates

- Root cause must be identified (not just symptom treated)
- Fix must be minimal (no unnecessary changes)
- Rollback instructions must be provided
- Resolution must be documented

## Output Format

```markdown
# Diagnosis Report

## Symptom
{description}

## Classification
{category}

## Root Cause
{explanation with causal chain}

## Fix
{step-by-step fix instructions}

## Rollback
{how to undo the fix if needed}

## Prevention
{how to prevent this issue in the future}
```
