---
task: "code-security-review"
responsavel: "penetration-tester"
responsavel_type: "agent"
atomic_layer: true
elicit: false
Entrada:
  - campo: code_files
    tipo: list
    origem: "repository"
    obrigatorio: true
  - campo: language
    tipo: text
    origem: "auto-detect or user input"
    obrigatorio: true
Saida:
  - campo: security_review
    tipo: document
    destino: "development team"
Checklist:
  - "[ ] Identify language-specific vulnerability patterns"
  - "[ ] Check for injection vulnerabilities"
  - "[ ] Check for authentication/authorization flaws"
  - "[ ] Check for cryptographic issues"
  - "[ ] Check for sensitive data handling"
  - "[ ] Check for dependency vulnerabilities"
  - "[ ] Provide specific fix recommendations"
---

# Code Security Review

## Objective

Perform a security-focused code review to identify vulnerabilities, insecure patterns, and security anti-patterns. Provide specific, line-level remediation guidance.

## Inputs

- Source code files or pull request diff
- Programming language and framework
- Application context (what the code does)

## Steps

1. **Understand context** — What does this code do? What data does it handle? What trust boundaries does it cross?

2. **Injection analysis** — SQL injection, command injection, XSS, SSTI, path traversal. Check all user input handling paths.

3. **Authentication review** — Password handling, session management, token generation, credential storage, MFA implementation.

4. **Authorization review** — Access control checks, IDOR patterns, privilege boundary enforcement, role validation.

5. **Cryptography review** — Algorithm selection, key management, random number generation, hashing (passwords vs data integrity), TLS configuration.

6. **Sensitive data handling** — PII handling, logging of sensitive data, error message exposure, secrets in code, environment variable handling.

7. **Dependency analysis** — Known vulnerable dependencies, outdated libraries, license issues, supply chain risks.

8. **Language-specific checks** — Deserialization (Java, Python, PHP), prototype pollution (JavaScript), memory safety (C/C++), type confusion.

## Quality Gates

- Every finding references specific code lines
- Severity is assessed in application context
- Fix recommendations include code examples
- False positives are documented with reasoning
