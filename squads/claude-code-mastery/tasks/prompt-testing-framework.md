---
task: prompt-testing-framework
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

# Prompt Testing Framework

## Objective

Create a systematic framework for testing, evaluating, and iterating on prompts. Establish repeatable test suites with defined metrics, regression detection, and A/B comparison capabilities to ensure prompt quality over time.

## Pre-Conditions

- Prompts to be tested are documented and versioned
- Test cases with expected outputs are available or can be created
- Evaluation criteria defined (accuracy, format compliance, tone, safety)
- Access to run prompts against the target model
- Baseline metrics established for comparison

## Steps

1. **Define Test Dimensions** — Establish what aspects of prompt output to evaluate: factual accuracy, format compliance, tone consistency, safety adherence, completeness, latency, and token efficiency. Weight each dimension by importance for the use case.
2. **Create Test Case Categories** — Organize test cases into: happy path (standard inputs), edge cases (boundary conditions), adversarial (attempting to break the prompt), regression (previously fixed issues), and performance (token/latency benchmarks).
3. **Build Test Suite Structure** — Design the test suite format: each test case includes input, expected output pattern, evaluation criteria, category tag, and priority level. Use a structured format (YAML or JSON) for automation compatibility.
4. **Design Evaluation Rubrics** — For each test dimension, create a 1-5 scoring rubric with concrete examples at each level. Define pass/fail thresholds (e.g., format compliance must score 4+, accuracy must score 3+).
5. **Implement Comparison Protocol** — Define how to compare prompt versions: run identical test suites against both versions, compute dimension-level scores, flag regressions (any dimension drops by 1+ points), and compute overall quality delta.
6. **Create Regression Test Suite** — Build a permanent set of test cases from past failures. Every time a prompt bug is found and fixed, add the trigger input to the regression suite. This suite must pass before any prompt version is promoted.
7. **Design Reporting Format** — Create a test report template showing: overall score, per-dimension scores, pass/fail per test case, regressions detected, comparison with previous version, and recommended actions.
8. **Build Iteration Protocol** — Define the prompt improvement cycle: run tests, identify lowest-scoring dimensions, hypothesize improvements, implement changes, re-test, compare, promote or revert. Maximum 5 iterations per improvement cycle.
9. **Establish Quality Gates** — Define promotion criteria: minimum overall score, no regressions from previous version, all critical test cases pass, regression suite 100% pass rate. Document the gate checklist.
10. **Document the Framework** — Write a complete guide: how to add test cases, how to run the suite, how to interpret results, how to iterate, and how to maintain the framework over time.

## Output

```markdown
# Prompt Testing Framework

## Test Dimensions
| Dimension | Weight | Pass Threshold | Rubric Reference |
|-----------|--------|---------------|------------------|

## Test Suite
| ID | Category | Input | Expected Pattern | Dimensions Tested |
|----|----------|-------|-----------------|-------------------|

## Evaluation Rubric
### {Dimension}
| Score | Description | Example |
|-------|------------|---------|

## Quality Gates
- [ ] Overall score >= {threshold}
- [ ] Zero regressions
- [ ] Critical tests 100% pass
- [ ] Regression suite 100% pass

## Iteration Log
| Version | Date | Score | Delta | Changes |
|---------|------|-------|-------|---------|
```

## Quality Criteria

- Framework must include at least 20 test cases across all categories
- Evaluation rubrics must have concrete examples at every score level
- Regression suite must be automated (no manual scoring for pass/fail)
- Test reports must be generated in under 5 minutes for a standard suite
- Framework must detect prompt regressions with at least 90% accuracy
- Documentation must enable a new team member to run tests independently
