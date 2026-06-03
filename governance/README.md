# sinapse-ai/governance/

Governance documents for the SINAPSE framework. This is where the framework's **own evolution rules** live.

## Documents

| Document | Purpose |
|---|---|
| [`evolution-pipeline.md`](evolution-pipeline.md) | Defines how the framework evolves: audit → proposal → approval → PR → distribution |
| `handoff-types.md` (TBD) | Distinguishes contract handoffs vs micro-handoffs vs phase handoffs |

## Layout

```text
governance/
├── README.md                       # this file
├── evolution-pipeline.md           # core pipeline spec
├── proposals/                      # FrameworkProposal YAMLs awaiting/processed by the maintainer
│   ├── README.md
│   ├── PROP-<YYYYMMDD>-<slug>.yaml
│   └── archive/                    # rejected or superseded proposals
├── patterns/                       # approved framework patterns
│   ├── README.md                   # catalog of patterns
│   └── <pattern-name>.md
└── templates/                      # YAML templates for finding + proposal
    ├── audit-finding-tmpl.yaml
    └── framework-proposal-tmpl.yaml
```

## Authority

- **Authors of governance docs:** any agent or the maintainer
- **Approver of governance changes:** the maintainer (sole orchestrator approver)
- **Implementers:** @sinapse-orqx + relevant specialist agents
