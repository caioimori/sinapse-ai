# Contributing a Squad

Squads are contributed to this repository under `squads/`. There is no separate
official squad marketplace or distribution repository in the current public
product contract.

## Before implementation

Open the squad proposal issue template and document:

- user problem and domain evidence;
- non-overlapping authority;
- proposed agents, tasks, and workflows;
- Claude Code and Codex experience;
- maintenance, security, dependencies, and license.

## Required structure

```text
squads/squad-example/
  squad.yaml
  README.md
  agents/
  tasks/
  workflows/      # when needed
  knowledge-base/ # when needed
  tests/          # when needed
```

`squad.yaml` is canonical. Every declared file and task pointer must exist.
Provider adapters are generated from canonical definitions and must not be
maintained by hand.

## Validation

```bash
npm run validate:squad-schema:strict
npm run validate:squad-yaml
npm run sync:providers
npm run validate:parity
node .codex/scripts/resolve-codex-agent.js --stats
```

Include a README, activation examples for both providers, tests, dependency and
secret requirements, compatibility notes, and a maintainer. Follow
[CONTRIBUTING.md](../../CONTRIBUTING.md) and the squad pull-request template.
