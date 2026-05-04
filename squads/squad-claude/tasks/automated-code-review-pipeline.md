---
task: automated-code-review-pipeline
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

# Automated Code Review Pipeline

## Objective

Build an automated code review pipeline that uses Claude Code hooks, linting tools, and AI-powered analysis to review code changes before they are committed or pushed. Produce a pipeline that catches bugs, style violations, security issues, and architectural drift automatically.

## Pre-Conditions

- Project has linting and formatting tools configured (ESLint, Prettier, etc.)
- Git repository initialized with branch protection awareness
- Claude Code hooks system available
- Code review criteria and standards documented
- CI/CD pipeline accessible for integration (optional for full pipeline)

## Steps

1. **Define Review Stages** — Design the pipeline stages in order: Stage 1 (Pre-commit) — syntax and format checks; Stage 2 (Pre-push) — lint, type check, test; Stage 3 (PR) — AI-powered semantic review, security scan, architecture compliance.
2. **Configure Pre-Commit Hooks** — Set up PostToolUse hooks that trigger after Bash(git commit): run linter on staged files, verify formatting compliance, check for debug statements (console.log, TODO), and validate import conventions.
3. **Build Lint Gate** — Create a PreToolUse hook for Bash that detects git push commands and blocks them if: linting fails, type checking fails, or test suite has failures. Provide clear error messages indicating what to fix.
4. **Design AI Review Prompt** — Create a structured prompt for AI-powered code review: include diff context, coding standards reference, common anti-patterns to check, security checklist, and output format (findings with severity, line numbers, and suggestions).
5. **Implement Security Scanning** — Add checks for common security issues: hardcoded credentials (API keys, passwords in code), unsafe eval or exec calls, SQL injection patterns, XSS vulnerabilities in templates, and sensitive data in logs.
6. **Add Architecture Compliance Check** — Create rules that validate architectural decisions: import boundaries (no frontend importing backend), layer violations (UI accessing database directly), dependency direction enforcement, and file placement rules.
7. **Configure Feedback Format** — Design the review output format: severity levels (Critical/Warning/Info), file and line references, explanation of the issue, suggested fix with code example, and link to relevant coding standard.
8. **Implement Self-Healing Loop** — For auto-fixable issues (formatting, import sorting, simple lint fixes), implement automatic correction: detect the issue, apply the fix, re-run validation, and report what was auto-fixed. Maximum 2 self-healing iterations.
9. **Set Up Review Reporting** — Create a review summary that aggregates all findings: total issues by severity, files with most issues, recurring patterns, and trend analysis (is code quality improving or degrading over time).
10. **Test the Pipeline** — Run the pipeline against: clean code (should pass), code with known issues (should catch all), large diffs (should complete in reasonable time), and edge cases (binary files, generated code, lock files).
11. **Document and Onboard** — Write setup instructions, explain how to bypass the pipeline in emergencies (with justification requirement), how to add new review rules, and how to interpret review results.

## Output

```markdown
# Automated Code Review Pipeline

## Pipeline Stages
| Stage | Trigger | Checks | Blocking? | Auto-Fix? |
|-------|---------|--------|-----------|-----------|

## Hook Configuration
{JSON configuration for all review hooks}

## Review Rules
| Rule | Category | Severity | Auto-Fixable | Description |
|------|----------|----------|-------------|-------------|

## AI Review Prompt
{complete prompt template for semantic review}

## Self-Healing Config
| Issue Type | Fix Strategy | Max Iterations |
|-----------|-------------|----------------|

## Setup Instructions
1. {step-by-step setup}

## Emergency Bypass
- Command: {bypass command}
- Requirement: {justification process}
```

## Quality Criteria

- Pipeline must catch at least 90% of lint violations and formatting issues
- Security scanning must detect hardcoded credentials with zero false negatives
- Self-healing must successfully auto-fix formatting and import issues
- Full pipeline execution must complete within 30 seconds for typical diffs
- Review output must include actionable suggestions (not just "there is a problem")
- Emergency bypass must be documented and require explicit justification
