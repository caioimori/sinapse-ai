# Security Scanning Rules

> Applies to ALL agents writing code or configuration files.

## Secret Detection

NEVER commit files containing:
- API keys, tokens, or passwords in plaintext
- `.env` files with real values (use `.env.example` with placeholders)
- OAuth credentials (`access_token`, `refresh_token`, `client_secret`)
- Private keys (RSA, SSH, PGP)
- Database connection strings with credentials
- Webhook URLs with embedded tokens

## Path Traversal Prevention

When handling file paths from user input or external sources:
- Reject paths containing `..` segments
- Reject absolute paths outside project root
- Normalize paths before validation (`path.resolve()` then check prefix)
- Never construct paths with string concatenation from untrusted input

## SQL Injection Prevention

- Always use parameterized queries — never string interpolation
- Supabase RPC functions must use `$1, $2` parameter placeholders
- Edge functions must validate and sanitize all query parameters
- `sql-governance.py` hook blocks dangerous SQL patterns automatically

## Dependency Security

- Review new dependencies before adding (`npm audit`)
- Prefer well-maintained packages (>1K weekly downloads, recent updates)
- Pin exact versions in production dependencies
- Never install packages with known critical vulnerabilities

## Hooks Enforcement

Active security hooks in `.claude/settings.json`:
- `sql-governance.py` — blocks dangerous SQL in Bash commands
- `read-protection.py` — controls access to sensitive config files
- `enforce-architecture-first.cjs` — requires docs before protected code paths
