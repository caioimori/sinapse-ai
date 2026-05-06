---
task: ai-testing-automation
responsavel: "@hooks-architect"
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

# AI Testing Automation

## Objective

Design and implement AI-assisted testing automation that leverages Claude Code to generate, maintain, and execute test suites. Create a system that automatically generates tests from code changes, identifies untested paths, and maintains test quality over time.

## Pre-Conditions

- Testing framework configured (Jest, Vitest, Playwright, etc.)
- Code coverage tools installed and baseline measured
- Existing test suite (even if minimal) available for pattern learning
- CI/CD pipeline accessible for test integration
- Code quality standards and testing requirements documented

## Steps

1. **Analyze Current Test Coverage** — Run coverage tools to establish baseline: line coverage, branch coverage, function coverage. Identify critical paths with zero coverage and high-risk areas (payment processing, authentication, data mutation) that need priority testing.
2. **Design Test Generation Strategy** — Define the AI test generation approach: for unit tests, analyze function signatures and generate tests for happy path, error cases, and boundary values; for integration tests, analyze API endpoints and generate request/response tests; for E2E tests, analyze user flows and generate scenario tests.
3. **Create Test Templates** — Build templates that Claude Code uses when generating tests: describe/it structure, arrange-act-assert pattern, mock setup conventions, fixture patterns, and assertion style. Templates must match the project's existing test patterns.
4. **Implement Change-Triggered Generation** — Set up PostToolUse hooks that detect when source files are modified and automatically suggest or generate corresponding test updates. Track which source files have tests and which don't.
5. **Build Test Quality Validation** — Create checks for generated tests: tests must actually test behavior (not just call functions), assertions must be meaningful (not `expect(true).toBe(true)`), mocks must be realistic, and tests must be deterministic (no flaky tests).
6. **Design Edge Case Discovery** — Implement a system that analyzes function signatures, type definitions, and error handling paths to identify edge cases: null/undefined inputs, empty arrays, boundary numbers, concurrent access, timeout scenarios, and type coercion traps.
7. **Create Mutation Testing Integration** — Set up mutation testing to validate test effectiveness: introduce small code changes (mutations), run tests, verify that tests catch the mutations. Track mutation score alongside coverage.
8. **Implement Test Maintenance Workflow** — Design a workflow for when tests break due to code changes: detect broken tests, analyze the diff to determine if tests need updating or if the code change introduced a bug, suggest test fixes, and update automatically when safe.
9. **Build Reporting Dashboard** — Create a test health report: coverage trends, test generation rate, flaky test tracker, mutation score, untested critical paths, and recommended next tests to write.
10. **Configure CI Integration** — Wire the testing automation into the CI pipeline: generate tests as part of PR creation, run generated tests in CI, block merge if coverage drops, and report test quality metrics on the PR.

## Output

```markdown
# AI Testing Automation Setup

## Coverage Baseline
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Line coverage | {%} | {%} | {%} |
| Branch coverage | {%} | {%} | {%} |
| Function coverage | {%} | {%} | {%} |

## Test Generation Config
| Source Pattern | Test Pattern | Strategy | Template |
|---------------|-------------|----------|----------|

## Hook Configuration
{hooks for change-triggered test generation}

## Test Templates
### Unit Test Template
{template code}

### Integration Test Template
{template code}

## Edge Case Patterns
| Pattern | Detection Rule | Test Strategy |
|---------|---------------|---------------|

## CI Integration
{pipeline configuration}

## Reporting
- Dashboard location: {path}
- Update frequency: {cadence}
```

## Quality Criteria

- Generated tests must pass on first run (no manual fixes needed) at least 85% of the time
- Generated tests must achieve meaningful assertion coverage (not trivial assertions)
- Change-triggered generation must detect source-test relationships accurately
- Mutation testing score must improve by at least 10% after automation is applied
- Test maintenance workflow must correctly classify broken tests as "test needs update" vs. "bug detected" at least 80% of the time
- Full test generation cycle must complete within 60 seconds per source file
