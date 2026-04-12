---
task: "api-security-audit"
responsavel: "penetration-tester"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: api_specification
    tipo: document
    origem: "user input"
    obrigatorio: true
  - campo: authorization
    tipo: text
    origem: "user input"
    obrigatorio: true
Saida:
  - campo: api_audit_report
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Verify authorization"
  - "[ ] Review API specification and documentation"
  - "[ ] Test all OWASP API Top 10 categories"
  - "[ ] Test authentication mechanisms"
  - "[ ] Test rate limiting and resource consumption"
  - "[ ] Test input validation across all endpoints"
  - "[ ] Assess data exposure in responses"
  - "[ ] Produce findings report"
---

# API Security Audit

## Objective

Conduct a comprehensive security audit of an API against the OWASP API Security Top 10 2023. Assess authentication, authorization, input validation, rate limiting, and data exposure. Requires explicit authorization.

## Inputs

- API specification (OpenAPI/Swagger, GraphQL schema, or documentation)
- Base URL and authentication credentials
- Written authorization
- Expected API consumers and use cases

## Steps

1. **Verify authorization** — Confirm testing scope includes all API endpoints. Document authorization.

2. **API mapping** — Enumerate all endpoints, methods, parameters, and response schemas. Identify undocumented endpoints.

3. **Authentication analysis** — Test token mechanisms (JWT, OAuth, API keys), token expiration, refresh flows, and credential handling.

4. **BOLA testing (API1)** — Test every object reference for unauthorized access. Vary user context to test horizontal and vertical access.

5. **Authorization testing (API3, API5)** — Test function-level and property-level authorization. Check mass assignment, response filtering.

6. **Rate limiting (API4)** — Test resource consumption limits, pagination abuse, query complexity (GraphQL), and batch operation abuse.

7. **Input validation** — Test all parameters for injection, type confusion, boundary violations, and unexpected input handling.

8. **Data exposure** — Review all response payloads for excessive data exposure, sensitive field leakage, and verbose error messages.

9. **Inventory and documentation (API9)** — Verify API versioning, deprecated endpoint handling, and documentation accuracy.

## Quality Gates

- All OWASP API Top 10 categories assessed
- BOLA tested on every object-referencing endpoint
- Rate limiting verified with measured thresholds
- Every finding includes specific HTTP request/response evidence
