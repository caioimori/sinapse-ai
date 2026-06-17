# SINAPSE-AI Security Guide

> For vulnerability reporting, see [SECURITY.md](../SECURITY.md)

---

## Table of Contents

1. [Security Architecture Overview](#security-architecture-overview)
2. [Secret Management](#secret-management)
3. [MCP Server Trust Model](#mcp-server-trust-model)
4. [Agent Security Boundaries](#agent-security-boundaries)
5. [Hook Architecture](#hook-architecture)
6. [Best Practices for Users](#best-practices-for-users)
7. [Constitutional Enforcement](#constitutional-enforcement)

---

## Security Architecture Overview

SINAPSE-AI implements a defense-in-depth security model with multiple enforcement layers:

```
Constitution (Article X)
  |
  +-- 25 Pre-Deploy Blockers (3 tiers)
  |     +-- Tier 1: Absolute Blockers (deploy impossible)
  |     +-- Tier 2: Compliance Blockers (LGPD)
  |     +-- Tier 3: Operational Blockers
  |
  +-- 19 Claude Code Hooks (real-time enforcement)
  |     +-- Secret scanning
  |     +-- SQL governance
  |     +-- Architecture-first gates
  |     +-- Push authority control
  |
  +-- Quality Gates (pre-commit, PR, human review)
```

Security is not optional in SINAPSE-AI. It is enforced at the constitutional level (Article X -- NON-NEGOTIABLE) and automated through hooks and gates that block violations before they reach production.

---

## Secret Management

### How SINAPSE-AI Handles Secrets

SINAPSE-AI uses a hook-based secret scanning system that runs on every file write and commit operation.

**Active hook:** `secret-scanning.cjs`

**Scanned patterns include:**
- AWS access keys and secret keys
- Stripe API keys (live and test)
- SSH private keys (RSA, ED25519, ECDSA)
- GitHub tokens (personal, OAuth, app)
- Google API keys and OAuth credentials
- Slack tokens and webhooks
- Database connection strings with embedded credentials
- JWT tokens and Bearer tokens
- Generic high-entropy strings matching key patterns

**Behavior on detection:**
- The commit is **blocked** immediately
- The agent is notified with the specific file and pattern match
- The file is removed from staging
- The user is warned to rotate the detected credential

### Environment Variable Rules

| Rule | Enforcement |
|------|-------------|
| `.env` files must be in `.gitignore` | Hook blocks commits containing `.env` |
| `.env.example` must use placeholders | Manual review during QA gate |
| `NEXT_PUBLIC_*` variables are public | Never put secrets in `NEXT_PUBLIC_*` |
| `service_role` keys never in frontend | Hook scans `src/`, `app/`, `pages/` directories |

---

## MCP Server Trust Model

SINAPSE-AI uses a tiered approach to MCP (Model Context Protocol) server trust:

### Docker Isolation

MCP servers that require authentication or access external services run inside Docker containers via Docker MCP Toolkit. This provides:

- **Process isolation:** MCP servers cannot access the host filesystem directly
- **Network segmentation:** Each container has its own network namespace
- **Credential isolation:** API keys are injected via Docker environment variables, not stored in project files

### Native Tool Preference

SINAPSE-AI always prefers native Claude Code tools over MCP equivalents:

| Task | Preferred Tool | Why |
|------|---------------|-----|
| File read/write | Read, Write, Edit | Runs locally, no network |
| Search | Grep, Glob | Faster, no external calls |
| Commands | Bash | Direct host execution |

MCP servers are only used when native tools cannot provide the required capability (web search, browser automation, external API access).

### MCP Governance

Only the DevOps agent (`@devops` / Pipeline) has authority to:
- Add or remove MCP servers
- Configure MCP credentials
- Manage Docker MCP infrastructure

Other agents are consumers only -- they cannot modify MCP configuration.

---

## Agent Security Boundaries

### Framework Protection Layers (L1-L4)

SINAPSE-AI enforces a 4-layer boundary model that controls what agents can and cannot modify:

| Layer | Protection | What It Contains |
|-------|-----------|-----------------|
| **L1** Framework Core | NEVER modify | Core modules, Constitution, CLI binaries |
| **L2** Framework Templates | NEVER modify | Tasks, templates, checklists, workflows |
| **L3** Project Config | Controlled | Data files, agent memory, config |
| **L4** Project Runtime | Open | Stories, packages, tests |

These boundaries are enforced deterministically through deny rules in `.claude/settings.json`, not through agent honor system.

### Agent Authority Matrix

Each agent has explicit permissions defining what operations it can perform:

| Agent | Can Do | Cannot Do |
|-------|--------|-----------|
| `@developer` | Write code, commit locally | Push to remote, create PRs |
| `@devops` | Push, create PRs, manage CI | Write application code |
| `@architect` | Design decisions | Write implementation code |
| `@data-engineer` | Schema design, migrations | Application code, git push |

The `enforce-delegation.cjs` hook blocks orchestrator agents from executing domain work directly, enforcing the delegation matrix at runtime.

### Git Push Authority

Only `@devops` (Pipeline) can execute `git push`. The `enforce-git-push-authority.sh` hook intercepts all Bash commands and blocks any push attempt from other agents.

---

## Hook Architecture

SINAPSE-AI uses 19 Claude Code hooks organized by trigger event:

### Hook Event Map

| Event | Hook | Purpose | Behavior |
|-------|------|---------|----------|
| **UserPromptSubmit** | `synapse-wrapper.cjs` | Context injection | Allow |
| **PreToolUse (Bash)** | `enforce-git-push-authority.sh` | Block unauthorized push | Block |
| **PreToolUse (Bash)** | `sql-governance.py` | Block dangerous SQL | Block |
| **PreToolUse (Bash)** | `enforce-delegation.cjs` | Block direct orchestrator work | Block |
| **PreToolUse (Write/Edit)** | `enforce-architecture-first.cjs` | Require docs before code | Block |
| **PreToolUse (Write/Edit)** | `write-path-validation.cjs` | Warn on wrong paths | Warn |
| **PreToolUse (Write/Edit)** | `enforce-story-gate.cjs` | Require story for code | Block |
| **PreToolUse (Write/Edit)** | `slug-validation.py` | Validate naming | Warn |
| **PreToolUse (Write/Edit)** | `mind-clone-governance.py` | Require DNA for clones | Block |
| **PreToolUse (Write/Edit)** | `enforce-delegation.cjs` | Block direct orchestrator work | Block |
| **PreToolUse (Read)** | `read-protection.py` | Control sensitive file access | Warn |
| **PreCompact** | `precompact-wrapper.cjs` | Session digest capture | Allow |

### Design Principles

1. **Fail-open for advisory hooks, fail-CLOSED for security guards** -- Advisory/observability hooks (validation, naming, capture) exit with code 0 (allow) if they crash or cannot parse input, so a hook bug never blocks all development. The **security guards are the deliberate exception**: the git pre-commit secret-scan, destructive-SQL guard, and framework-boundary guard fail-**closed** — if a guard cannot run, cannot read a staged file, or is uncertain, it **BLOCKS** the commit. A scanner that cannot run must never let a secret or a `DROP TABLE` through.
2. **Fast** -- Each hook must complete in under 5 seconds.
3. **Silent on success** -- Hooks only produce output when blocking or warning.
4. **Deterministic** -- Same input always produces the same output.
5. **No side effects** -- Hooks read state but do not modify it.

### Exit Code Protocol

| Code | Meaning | Effect |
|------|---------|--------|
| 0 | Allow | Operation proceeds normally |
| 2 | Block | Operation denied, message shown |
| Other | Ignored | Treated as 0 (allow) |

---

## Best Practices for Users

### After Installing SINAPSE-AI

1. **Verify hook installation**: Run `npx sinapse-ai doctor` to confirm all hooks are registered
2. **Check `.gitignore`**: Ensure `.env`, `.sinapse/`, and other sensitive paths are listed
3. **Review MCP servers**: Only enable MCP servers you trust and need
4. **Set up branch protection**: Enable branch protection on `main` in GitHub settings

### During Development

1. **Never commit `.env` files** -- Use `.env.example` with placeholder values
2. **Use parameterized queries** -- Never use string interpolation for SQL
3. **Review generated code** -- AI-generated code should be reviewed before production
4. **Keep dependencies updated** -- Run `npm audit` regularly
5. **Use feature branches** -- SINAPSE-AI automatically creates branches and never works on `main`

### For Production Deployments

1. **Enable RLS on all tables** with user data (see [RLS Patterns](../.sinapse-ai/data/rls-security-patterns.md))
2. **Never expose `service_role`** keys in frontend code
3. **Configure CORS** with explicit origins (never use `origin: '*'` in production)
4. **Add rate limiting** to all public API endpoints
5. **Set up security headers** using helmet or equivalent middleware

---

## Constitutional Enforcement

SINAPSE-AI's Constitution (Article X -- Security and Data Protection) defines 25 mandatory pre-deploy blockers:

### Tier 1: Absolute Blockers (10 items)

These make deployment impossible if violated:
- Tables without RLS enabled
- Hardcoded API keys in source code
- `service_role` exposed in frontend
- Missing MFA on admin accounts
- APIs without authentication
- SQL with string concatenation
- Critical/high dependency vulnerabilities
- Secrets detected in codebase
- Default credentials in production
- Missing TLS encryption

### Tier 2: Compliance Blockers (7 items)

These make deployment illegal in Brazil (LGPD):
- Missing DPO/Data Protection Officer
- No breach notification capability
- Missing consent mechanism
- No data subject rights portal
- International transfer without SCCs
- Children's data without parental consent
- Missing published privacy policy

### Tier 3: Operational Blockers (8 items)

These make deployment irresponsible:
- No asset inventory
- No centralized logging
- No incident response plan
- No backup verification
- No vulnerability scanning
- No network segmentation
- No vendor security assessment
- No SSL enforcement on database

For the complete checklist and implementation details, see the Constitution at `.sinapse-ai/constitution.md`.

---

*Last updated: 2026-04-03*
