# Codex Status Task

## Purpose

Report the validated Codex capability surface for SINAPSE in this repository.

## Steps

1. Read `.codex/catalog.json`.
2. Summarize:
   - expanded Codex catalog mode
   - agent and skill coverage
   - validated commands available through `.codex/command-registry.json`
3. Mention the current Codex validation commands:
   - `npm run validate:codex-sync`
   - `npm run validate:codex-integration`
   - `npm run validate:codex-commands`
   - `npm run validate:codex-skills`
   - `npm run validate:paths`
4. If relevant, mention known external blockers outside Codex-only scope:
   - shared canonical parse issues
   - non-Codex failures in `validate:parity`

## Output Contract

- Short current-status summary
- Validated capability list
- Remaining blockers split into Codex-only vs external/shared
