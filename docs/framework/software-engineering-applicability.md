# Software Engineering Applicability

SINAPSE does not execute all 275 documented engineering workflows for every
change. It selects an applicable subset from project type, affected surfaces,
change kind, data classes, deployment target, reversibility and risk.

The Phase 0/1 contract is implemented in
`packages/engineering-applicability/index.js`. It is deterministic,
provider-neutral and advisory. Claude Code and Codex receive the exact same
canonical decision; their adapters may change presentation only.

## Mandatory baseline

Until the protected workflow templates are evolved through framework
governance, agents must apply these minimum obligations even where a legacy YAML
marks a review optional:

- every implementation requires a Ready story/spec, traceability and QA;
- brownfield changes require characterization tests and an incremental change
  strategy before implementation;
- frontend work requires design-system grounding and visual validation at
  desktop and mobile sizes;
- exposed frontend/API work requires application-security review;
- database changes require schema, migration, rollback and access-control review;
- high security, privacy or availability risk adds the respective specialist
  review;
- irreversible actions require an explicit human checkpoint;
- push, PR, release and deploy remain exclusive to DevOps authority.

The advisory engine does not itself block, execute, verify evidence or waive a
gate. Those capabilities require later stories in the applicability epic.
