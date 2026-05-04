---
task: ci-cd-setup
responsavel: "@project-integrator"
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

# CI/CD Setup

## Objective

Integrate Claude Code into CI/CD pipelines for automated code review, generation, and validation. Configure GitHub Actions, GitLab CI, or other CI systems to leverage Claude Code in the development workflow.

## Inputs

- CI/CD platform (GitHub Actions, GitLab CI, Jenkins, CircleCI)
- Pipeline triggers (PR, push, schedule)
- Claude Code tasks to automate (code review, test generation, documentation)
- API key management strategy
- Cost constraints (API usage limits)

## Steps

1. **Assess Pipeline Requirements** — Determine which Claude Code operations should run in CI/CD: PR review, commit message validation, test generation, documentation updates, code quality checks.
2. **Design Pipeline Stage** — Create a dedicated Claude Code stage in the CI/CD pipeline. Position it after build/test but before deploy. Define when it runs (all PRs? only specific paths?).
3. **Configure Authentication** — Set up API key management using CI/CD secrets. Ensure keys are scoped appropriately and rotated regularly. Never hardcode keys.
4. **Create Pipeline Configuration** — Write the CI/CD configuration file (workflow YAML, Jenkinsfile, etc.) with Claude Code invocation commands, timeout settings, and failure handling.
5. **Implement Cost Controls** — Add guards: max token limits per run, path-based filtering (only run on changed files), caching of previous results, scheduling limits.
6. **Add Reporting** — Configure pipeline to output Claude Code results as PR comments, check annotations, or pipeline artifacts.
7. **Test Pipeline** — Run the pipeline on a test PR to verify: correct trigger, successful authentication, accurate results, proper reporting, and acceptable cost.

## Quality Gates

- API keys must be stored as CI/CD secrets (never in code)
- Pipeline must have timeout configured (prevent runaway costs)
- Cost controls must be implemented and tested
- Pipeline failure must not block deployment (unless configured as required check)

## Output Format

Complete CI/CD configuration file plus documentation of the pipeline design, cost controls, and maintenance procedures.
