# Codex Delegation Parity

## Purpose

Codex delegation parity makes `sinapse-orqx -> squad orqx -> specialist` routing explicit, inspectable, and validator-backed without changing `.claude/**`.

The contract lives in:

- `.codex/delegation-parity.json`
- `.codex/handoff-packet.parity.schema.json`
- `.codex/scripts/resolve-codex-delegation-parity.js`
- `.sinapse-ai/infrastructure/scripts/validate-codex-delegation.js`

## Routing Classes

- `validator-backed`: route is approved, resource-backed, and structurally validated
- `codex-only-shim`: route is intentionally implemented as a Codex compatibility layer
- `exploratory`: route is documented and discoverable, but not a guaranteed runtime-equivalent path

## Current Contract

The current Codex delegation matrix validates:

- 19 orchestrators
- 5 framework agents
- 7 approved routes

Approved route families:

- single-domain squad delegation
- framework workflow delegation
- multi-domain launch orchestration
- exploratory delegation with explicit shared-surface risk

## Supported Routes

### Validator-Backed

- `brand-discovery`
- `content-funnel-alignment`
- `growth-seo-audit`
- `claude-project-setup`
- `framework-story-delivery`

### Codex-Only Shim

- `multi-domain-launch`

### Exploratory

- `research-competitor-positioning`

## Handoff Packet

Each route produces a normalized handoff packet with:

- `mission`
- `phase`
- `owner`
- `classification`
- `inputs`
- `outputs`
- `validators`
- `sharedSurfaceRisk`
- `nextHandoff`
- `delegationChain`

This packet is the reviewable unit for Codex orchestration.

## CLI Usage

Inspect a route:

```bash
node .codex/scripts/resolve-codex-delegation-parity.js framework-story-delivery
```

Inspect JSON:

```bash
node .codex/scripts/resolve-codex-delegation-parity.js framework-story-delivery --json
```

Inspect only the handoff packet:

```bash
node .codex/scripts/resolve-codex-delegation-parity.js framework-story-delivery --packet
```

Legacy source-aware lookup is still accepted for compatibility:

```bash
node .codex/scripts/resolve-codex-delegation-parity.js sinapse-orqx framework-story-delivery --json
```

## Validation

Primary checks:

- `npm run validate:codex-delegation`
- `npm run validate:codex-sync`

Secondary checks:

- `npm run validate:codex-commands`
- `npm run validate:codex-integration`
- `npm run validate:codex-skills`
- `npm run validate:paths`

## Guardrails

- Do not treat exploratory routes as runtime guarantees
- Do not change `.claude/**` to make a Codex-only route pass
- Prefer extending the Codex matrix before altering shared framework behavior
- Keep framework-agent delegation backed by `.codex/command-registry.json`
