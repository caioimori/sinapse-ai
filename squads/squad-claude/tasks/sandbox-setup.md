---
task: sandbox-setup
responsavel: "@roadmap-sentinel"
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

# Sandbox Setup

## Objective

Set up a sandbox environment for safely testing new Claude Code features, experimental configurations, and upgrades before applying them to production projects. Ensure isolation from production codebases.

## Inputs

- Features to test (new hooks, MCP servers, configuration changes)
- Production configuration (to replicate baseline)
- Isolation requirements (separate repo? branch? Docker container?)
- Test scenarios to validate

## Steps

1. **Create Isolated Environment** — Set up a sandbox: clone the production repo to a test directory, create a test branch, or spin up a Docker container. Ensure no writes to production.
2. **Replicate Production Config** — Copy production .claude/ configuration to the sandbox. This establishes the baseline for comparison.
3. **Apply Experimental Changes** — Add the new features, configurations, or upgrades to be tested. Document exactly what was changed from baseline.
4. **Design Test Scenarios** — For each change, create specific test scenarios: trigger conditions, expected behavior, failure cases, and performance benchmarks.
5. **Execute Tests** — Run each test scenario in the sandbox. Record results: passed/failed, performance impact, unexpected behaviors, error messages.
6. **Compare with Baseline** — Run the same scenarios with the original configuration. Compare results to isolate the impact of the changes.
7. **Generate Report** — Produce a go/no-go recommendation with evidence from testing. Include rollback instructions if the feature is adopted and problems emerge later.

## Quality Gates

- Sandbox must be fully isolated from production
- All test scenarios must be executed
- Performance comparison must include baseline measurements
- Report must include explicit go/no-go recommendation

## Output Format

```markdown
# Sandbox Test Report

## Feature Tested: {name}

## Environment
- Isolation: {method}
- Baseline: {production config version}
- Changes: {list}

## Test Results
| Scenario | Expected | Actual | Status |
|----------|----------|--------|--------|

## Performance Impact
| Metric | Baseline | With Change | Delta |
|--------|----------|-------------|-------|

## Recommendation: {GO / NO-GO}
## Rationale: {evidence-based}
```
