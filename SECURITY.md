# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 7.x     | Yes       |
| < 7.0   | No        |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in SINAPSE-AI, please report it responsibly.

### Preferred Method

Use [GitHub Security Advisories](https://github.com/caioimori/sinapse-ai/security/advisories/new) to report vulnerabilities privately.

### Alternative Method

If you cannot use Security Advisories, open a private issue or contact the maintainers directly.

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 5 business days
- **Resolution (Critical):** Within 30 days
- **Resolution (High):** Within 60 days
- **Resolution (Medium/Low):** Next release cycle

### Safe Harbor

We support responsible security research. If you follow responsible disclosure practices, we will not pursue legal action against you.

We consider security research conducted in accordance with this policy to be:

- Authorized concerning any applicable anti-hacking laws
- Authorized concerning any relevant anti-circumvention laws
- Exempt from restrictions in our Terms of Service that would interfere with conducting security research

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

## Security Architecture

SINAPSE-AI implements a multi-layer security model:

### Constitutional Enforcement (Article X)

- 25 pre-deploy security blockers across 3 tiers
- LGPD compliance controls
- Based on OWASP Top 10, NIST CSF 2.0, CIS Controls v8

### Hook-Based Real-Time Protection

- 19 active Claude Code hooks enforcing security rules
- Secret scanning (20+ patterns: AWS, Stripe, SSH keys, etc.)
- SQL injection prevention
- Git push authority control
- Architecture-first enforcement

### Quality Gates

- 3-layer quality pipeline (pre-commit, PR automation, human review)
- CodeRabbit integration for automated code review
- Mandatory story validation before code changes

## Scope

This policy applies to the `sinapse-ai` npm package and the `caioimori/sinapse-ai` GitHub repository.

---

*Last updated: 2026-04-03*
