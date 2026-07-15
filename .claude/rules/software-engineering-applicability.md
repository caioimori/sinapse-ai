# Software Engineering Applicability

Before selecting a project workflow, classify greenfield or brownfield,
affected surfaces, data classes, deployment targets, reversibility and security,
privacy and availability risk. Use the provider-neutral contract in
`packages/engineering-applicability/index.js`; do not invent unknown signals.

Treat QA as mandatory. Brownfield changes require characterization tests and an
incremental change strategy. Frontend requires design-system grounding and
desktop/mobile visual validation. Frontend/API requires application-security
review. Database changes require migration, rollback and access-control review.
Irreversible actions require explicit human approval. Full rationale:
`docs/framework/software-engineering-applicability.md`.
