# sinapse-ai/governance/proposals/

FrameworkProposals — formal change requests to evolve the SINAPSE framework based on AuditFindings.

See [`../evolution-pipeline.md`](../evolution-pipeline.md) for full pipeline.

## Layout

```text
proposals/
├── README.md                              # this file
├── PROP-<YYYYMMDD>-<slug>.yaml            # active proposals (PENDING / APPROVED / NEEDS_REVISION)
└── archive/                               # rejected or superseded proposals
    └── PROP-<YYYYMMDD>-<slug>.yaml
```

## Status of a proposal

- **PENDING** — awaiting the maintainer's review
- **APPROVED** — the maintainer signed; implementer can open PR in sinapse-ai
- **REJECTED** — the maintainer declined; proposal moves to `archive/` with rationale
- **NEEDS_REVISION** — the maintainer requested changes; proposer addresses and resubmits

## Authority

Only the maintainer sets the `orchestrator_decision` field. Any agent can write a proposal but cannot self-approve.
