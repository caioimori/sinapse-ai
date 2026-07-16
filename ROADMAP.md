# Product Roadmap

This roadmap communicates direction, not a delivery promise. Priorities may
change with security findings, user evidence, maintainer capacity, and upstream
Claude Code or Codex changes.

## Now: product reliability

- Keep the canonical `npx sinapse-ai@latest install` path reliable for new and
  existing projects.
- Maintain measurable Claude Code and Codex parity across agents, skills, rules,
  hooks, and tasks.
- Consolidate GitHub Flow, release automation, security reporting, and public
  documentation around one source of truth.
- Expand isolated installation and update coverage across Windows, Linux, and
  macOS.
- Make public metrics, compatibility claims, and release notes verifiable.

## Next: adoption and extensibility

- Improve first-run routing and provider-aware diagnostics.
- Formalize the public extension contract for squads, skills, tasks, and
  knowledge bases.
- Publish migration and compatibility guarantees for framework-managed files.
- Add end-to-end examples for greenfield, brownfield, security, and frontend
  workflows.
- Improve observability of orchestration decisions without collecting private
  project content.

## Later: ecosystem

- Versioned squad distribution with provenance and compatibility metadata.
- Reusable organization policies on top of the four-layer ownership model.
- Benchmarks for routing quality, workflow completion, and provider drift.
- Optional integrations that preserve CLI-first control and local ownership.

## How priorities are selected

Roadmap candidates are evaluated against user impact, evidence, security risk,
provider parity, maintenance cost, and fit with the Constitution. Open a
[feature request](https://github.com/caioimori/sinapse-ai/issues/new?template=2-feature-request.yml)
or start a [discussion](https://github.com/caioimori/sinapse-ai/discussions) with
the problem and concrete use case.

Completed work is recorded in [CHANGELOG.md](CHANGELOG.md) and GitHub Releases.
