# sinapse-ai/audits/

Framework-level AuditFindings that were promoted from consumer projects as framework candidates.

See [`../governance/evolution-pipeline.md`](../governance/evolution-pipeline.md) for the full promotion flow.

## Layout

```text
audits/
├── README.md                              # this file
├── promoted/                              # findings that became FrameworkProposals
│   └── AF-<YYYYMMDD>-<slug>.yaml
└── archived/                              # findings that stayed scope-bound (project-only)
    └── AF-<YYYYMMDD>-<slug>.yaml
```

## Lifecycle

1. **Project discovers issue** → Agent writes `AF-<YYYYMMDD>-<slug>.yaml` in `<project>/docs/audits/`
2. **Auditor flags** `framework_candidate: true|false`
3. **@sinapse-orqx triages** — if framework-candidate: drafts FrameworkProposal in `governance/proposals/`
4. **the maintainer approves** → finding copied to `audits/promoted/`
5. **If rejected or scope-bound** → finding moved to `audits/archived/` (or left in project)

## What belongs here

- **`promoted/`** — AuditFindings where the FrameworkProposal was APPROVED by the maintainer and shipped as a sinapse-ai PR. These are the institutional memory of what real production usage taught the framework.
- **`archived/`** — AuditFindings that were evaluated as framework-candidates but ultimately stayed project-bound (REJECTED proposal or `framework_candidate: false`).

## What does NOT belong here

- Project-level audit findings (those live in `<project>/docs/audits/`)
- FrameworkProposals (those live in `governance/proposals/`)
- Approved pattern documents (those live in `governance/patterns/`)

## Authority

- **Any agent or the maintainer** can write an AuditFinding (in the project's `docs/audits/`)
- **@sinapse-orqx** decides if it's a framework-candidate and drafts the proposal
- **the maintainer** is the sole approver for promotion to `promoted/`
