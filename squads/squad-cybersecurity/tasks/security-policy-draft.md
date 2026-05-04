---
task: "security-policy-draft"
responsavel: "compliance-officer"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: policy_type
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: applicable_frameworks
    tipo: list
    origem: "user input"
    obrigatorio: false
  - campo: organization_context
    tipo: text
    origem: "user input"
    obrigatorio: true
Saida:
  - campo: policy_document
    tipo: document
    destino: "management, legal"
Checklist:
  - "[ ] Define policy scope and applicability"
  - "[ ] Draft policy statements aligned with frameworks"
  - "[ ] Include roles and responsibilities"
  - "[ ] Define enforcement mechanisms"
  - "[ ] Include exception process"
  - "[ ] Set review schedule"
  - "[ ] Map to applicable regulatory requirements"
---

# Security Policy Draft

## Objective

Draft a security policy document that is clear, enforceable, and aligned with applicable regulatory frameworks. Policies must be actionable, not aspirational.

## Inputs

- Policy type (Information Security, Access Control, Incident Response, Acceptable Use, Data Classification, etc.)
- Applicable frameworks (SOC 2, ISO 27001, GDPR, etc.)
- Organization context (size, industry, risk appetite)
- Existing policies (if updating)

## Steps

1. **Define scope** — Who does this policy apply to? What systems, data, or processes does it cover? What are the exclusions?

2. **State the purpose** — Why does this policy exist? What risk does it address? What compliance requirements does it satisfy?

3. **Draft policy statements** — Clear, measurable requirements. Use "MUST" for mandatory, "SHOULD" for recommended, "MAY" for optional. Avoid ambiguous language.

4. **Define roles** — Who is responsible for implementation? Who enforces? Who approves exceptions? Who reviews?

5. **Enforcement** — What are the consequences of non-compliance? How is compliance monitored?

6. **Exception process** — How are exceptions requested, reviewed, approved, documented, and time-limited?

7. **Framework mapping** — Map each policy statement to the specific framework control it satisfies.

8. **Review schedule** — Define annual review cycle, triggered review conditions, and approval authority for changes.

## Quality Gates

- Policy language must be unambiguous and measurable
- Every statement must use MUST/SHOULD/MAY consistently
- Framework mapping must reference specific control IDs
- Exception process must be defined
- Review schedule must be specified
