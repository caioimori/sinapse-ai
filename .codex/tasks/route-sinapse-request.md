# Codex Route Task

## Purpose

Diagnose a request and choose the smallest correct Codex routing path.

## Required Inputs

- Request description

## Steps

1. Read `.codex/catalog.json`.
2. Read `.codex/delegation-matrix.json`.
3. Classify the request as one of:
   - simple + single-domain
   - complex + single-domain
   - complex + multi-domain
   - framework/development workflow
4. Prefer the smallest correct path:
   - simple + single-domain -> relevant `*-orqx` or validated framework agent
   - complex + single-domain -> relevant `*-orqx`
   - complex + multi-domain -> `sinapse-orqx` orchestration plan
   - framework/development workflow -> `sinapse-pm`, `sinapse-po`, `sinapse-sm`, `sinapse-dev`, or `sinapse-qa`
5. When the request matches an approved handoff route, resolve it through `.codex/delegation-matrix.json`.
6. If the request depends on a starred command, resolve it through `.codex/command-registry.json`.
7. Only recommend direct specialist routing from `.codex/agents` when the delegation matrix marks it as `exploratory`.
8. Return the recommended route with rationale, classification, and next action.

## Output Contract

- Diagnosis
- Recommended agent or orqx
- Why that route is correct
- Immediate next command or handoff
