---
name: Squad proposal
about: Propose a non-overlapping domain squad for the SINAPSE ecosystem
title: 'feat(squad): '
labels: ['squad-proposal', 'status: needs-triage']
assignees: ''
---

## Problem and domain

Describe the users, jobs, and evidence that justify a dedicated squad.

## Boundary

- Proposed squad ID:
- Existing squads reviewed:
- Authority this squad owns:
- Authority it must not own:

## Proposed catalog

| Agent ID | Role | Distinct authority | Primary tasks |
|---|---|---|---|
| `example-specialist` |  |  |  |

## Workflows and integration

Describe routing, handoffs, dependencies, security implications, and failure
modes. Include at least two concrete end-to-end use cases.

## Provider experience

```text
Claude Code: @example-specialist
Codex:       $sinapse-agent example-specialist
```

## Distribution

- [ ] Canonical `squad.yaml` is planned.
- [ ] Every task pointer will resolve on disk.
- [ ] Claude Code and Codex surfaces will be generated and validated.
- [ ] Tests, README, examples, license, and maintenance ownership are defined.
- [ ] The proposal does not require secrets or a proprietary dependency to load.

## Maintainer

State who will maintain the squad and how compatibility issues will be handled.
