# Governance

SINAPSE AI uses maintainer-led, evidence-based governance. The public repository
is open to contributions; merge, release, security, and protected-framework
authority remain explicit.

## Principles

1. **User impact before activity.** Work is prioritized by validated need, risk,
   and maintenance cost.
2. **Documentation before implementation.** Material code changes start from a
   ready story or an approved specification.
3. **One canonical source.** Generated provider adapters do not become competing
   sources of truth.
4. **Evidence before merge.** Tests, parity checks, security gates, and review
   support decisions.
5. **Conservative operations.** Destructive or externally visible actions use
   explicit authority and rollback planning.

## Roles

| Role | Authority |
|---|---|
| Maintainers | Triage, roadmap, architecture decisions, moderation, merge policy |
| CODEOWNERS | Required review for owned surfaces |
| Contributors | Proposals, code, tests, documentation, review |
| Security maintainers | Private vulnerability triage and coordinated disclosure |
| DevOps maintainer | Exclusive package publication, release tags, and protected pushes |

AI agents operate under the same ownership model. They do not gain authority
from generating a change: the repository gate and responsible maintainer remain
the decision point.

## Decision process

Small, reversible changes are decided in pull-request review. Material changes
to public behavior, architecture, provider support, governance, licensing, or
protected layers begin as an issue, discussion, RFC, or specification.

A material proposal should document:

- problem, affected users, and evidence;
- considered options and tradeoffs;
- compatibility, migration, and rollback;
- security and provider-parity impact;
- ownership and long-term maintenance cost.

Maintainers seek practical consensus. When consensus is not available, the
repository owner makes the final decision and records the rationale in the PR,
issue, or RFC.

## Change and release policy

`main` must remain releasable. Changes arrive through reviewed pull requests and
are squash-merged with Conventional Commit titles. Only the canonical release
workflow may publish npm artifacts or create release tags.

Breaking changes require an explicit migration path. Security fixes may use a
private patch branch and coordinated disclosure. See
[docs/guides/release-process.md](docs/guides/release-process.md).

## Framework boundaries

The Constitution and protected framework layers are not normal contribution
surfaces. A change to those boundaries requires a dedicated proposal, impact
analysis, tests, and maintainer approval. Runtime/project surfaces remain open to
normal contribution through [CONTRIBUTING.md](CONTRIBUTING.md).

## Conduct and conflicts

Participation follows [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Reviewers must
disclose material conflicts of interest and step back when impartial review is
not possible.

This document describes current project governance and can evolve through the
same public proposal and review process.
