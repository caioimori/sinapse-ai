---
task: api-security-testing
responsavel: "penetration-tester"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: api_documentation
    tipo: document
    origem: "user input"
    obrigatorio: true
  - campo: authorization
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: api_type
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["REST", "GraphQL", "gRPC", "SOAP", "WebSocket"]

Saida:
  - campo: api_security_report
    tipo: document
    destino: "stakeholders, dev team"

Checklist:
  - "[ ] Verify authorization and scope"
  - "[ ] Map all API endpoints and methods"
  - "[ ] Test OWASP API Security Top 10"
  - "[ ] Validate authentication mechanisms"
  - "[ ] Test rate limiting and abuse prevention"
  - "[ ] Check data exposure and filtering"
  - "[ ] Score findings with CVSS"
  - "[ ] Provide API-specific remediation"
---

# Task: API Security Testing

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Breach (penetration-tester)
- **Complexity:** Complex

## Objective

Execute a comprehensive API security assessment following the OWASP API Security Top 10 (2023) methodology. Test authentication, authorization, data exposure, rate limiting, and business logic across REST, GraphQL, gRPC, or SOAP APIs.

> **AUTHORIZED TESTING ONLY:** API security testing must be performed only against APIs you are authorized to test. Written authorization is required. Respect rate limits and avoid denial-of-service conditions.

## Pre-Conditions

- Written authorization from API owner
- API documentation (OpenAPI/Swagger, GraphQL schema, or equivalent)
- Valid API credentials for testing
- Test environment preferred (production testing needs explicit approval)

## Inputs

- API documentation (OpenAPI spec, Postman collection, GraphQL schema)
- Written authorization
- API type (REST, GraphQL, gRPC, SOAP, WebSocket)
- Authentication credentials (API keys, OAuth tokens, JWT)
- Rate limit information (to avoid accidental DoS)

## Steps

### 1. API Discovery and Mapping
Enumerate the complete API surface:
- Parse OpenAPI/Swagger documentation
- Discover undocumented endpoints (fuzzing with authorization)
- Map all HTTP methods per endpoint
- Identify parameters, headers, and request bodies
- Document authentication requirements per endpoint

### 2. API1:2023 — Broken Object Level Authorization (BOLA)
Test for:
- Access to other users' resources by ID manipulation
- Predictable resource identifiers
- Missing authorization checks on object access
- Horizontal privilege escalation via API

### 3. API2:2023 — Broken Authentication
Assess:
- Authentication mechanism strength
- Token generation and validation
- Session management
- Credential exposure in URLs or logs
- Brute force and credential stuffing protection
- OAuth/OIDC implementation flaws

### 4. API3:2023 — Broken Object Property Level Authorization
Test for:
- Mass assignment vulnerabilities
- Excessive data exposure in responses
- Ability to modify restricted properties
- Hidden fields accessible via API

### 5. API4:2023 — Unrestricted Resource Consumption
Verify:
- Rate limiting implementation and bypass
- Request size limits
- Pagination limits
- Batch operation limits
- File upload size restrictions
- GraphQL query depth and complexity limits

### 6. API5:2023 — Broken Function Level Authorization
Test:
- Administrative endpoints accessible to regular users
- Vertical privilege escalation
- HTTP method tampering (GET vs POST vs PUT)
- Missing role-based access control

### 7. API6-API10:2023 — Advanced API Risks
- **API6: Unrestricted Access to Sensitive Business Flows** — Test for automation abuse, scraping, bot protection
- **API7: Server-Side Request Forgery** — Test internal resource access via API parameters
- **API8: Security Misconfiguration** — CORS, error handling, debug modes, unnecessary HTTP methods
- **API9: Improper Inventory Management** — Old API versions, deprecated endpoints, shadow APIs
- **API10: Unsafe Consumption of APIs** — Third-party API trust, input validation on API responses

### 8. GraphQL-Specific Testing (if applicable)
- Introspection query exposure
- Query depth and complexity attacks
- Batching attacks
- Field suggestion enumeration
- Alias-based rate limit bypass

### 9. Input Validation Testing
For each endpoint parameter:
- SQL injection
- NoSQL injection
- Command injection
- Path traversal
- XXE (XML External Entity)
- Deserialization attacks
- Type confusion

### 10. Compile API Security Report
Document each finding with:
- OWASP API Security category
- CVSS v3.1 score
- Affected endpoint(s) and method(s)
- Request/response evidence
- Business impact assessment
- Specific remediation for the API framework in use

## Output

```yaml
api_security_report:
  api_name: ""
  api_type: ""
  date: ""
  authorization: "confirmed"

  endpoints_tested: 0
  endpoints_total: 0

  findings_summary:
    critical: 0
    high: 0
    medium: 0
    low: 0

  owasp_api_coverage:
    API1_BOLA: "[pass/fail/partial]"
    API2_broken_auth: "[pass/fail/partial]"
    API3_property_auth: "[pass/fail/partial]"
    API4_resource_consumption: "[pass/fail/partial]"
    API5_function_auth: "[pass/fail/partial]"
    API6_business_flows: "[pass/fail/partial]"
    API7_SSRF: "[pass/fail/partial]"
    API8_misconfiguration: "[pass/fail/partial]"
    API9_inventory: "[pass/fail/partial]"
    API10_unsafe_consumption: "[pass/fail/partial]"

  findings:
    - title: ""
      api_category: ""
      endpoint: ""
      method: ""
      cvss: 0.0
      evidence: ""
      remediation: ""
```

## Quality Criteria

- [ ] Written authorization confirmed before testing
- [ ] All OWASP API Security Top 10 categories tested
- [ ] Every endpoint tested for BOLA
- [ ] Authentication and session management fully assessed
- [ ] Rate limiting tested without causing service disruption
- [ ] All findings include request/response evidence
- [ ] Remediation guidance specific to the API framework
- [ ] No testing outside authorized scope
