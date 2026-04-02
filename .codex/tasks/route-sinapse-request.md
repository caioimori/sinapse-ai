# Codex Route Task

## Purpose

Diagnose a request and choose the smallest correct Codex routing path.

## Required Inputs

- Request description

## Steps

1. Read `.codex/catalog.json`.
2. Classify the request as one of:
   - simple + single-domain
   - complex + single-domain
   - complex + multi-domain
   - framework/development workflow
3. Prefer the smallest correct path:
   - simple + single-domain -> specialist or direct squad agent from `.codex/agents`
   - complex + single-domain -> relevant `*-orqx`
   - complex + multi-domain -> `sinapse-orqx` orchestration plan
   - framework/development workflow -> `sinapse-pm`, `sinapse-po`, `sinapse-sm`, `sinapse-dev`, or `sinapse-qa`
4. If the request depends on a starred command, resolve it through `.codex/command-registry.json`.
5. Return the recommended route with rationale and next action.

## Output Contract

- Diagnosis
- Recommended agent or orqx
- Why that route is correct
- Immediate next command or handoff
