# Hook Governance Rules

> Applies to ALL agents. Hooks are the enforcement layer of the Constitution.

## Active Hook Registry

### PreToolUse — Bash
| Hook | Purpose | Behavior |
|------|---------|----------|
| `enforce-git-push-authority.sh` | Art. II — Only @devops can push | BLOCK (deny) |
| `sql-governance.py` | Security — Block dangerous SQL | BLOCK (exit 2) |
| `enforce-delegation.cjs` | Art. VIII — Orchestrators can't execute | BLOCK (exit 2) |

### PreToolUse — Write|Edit
| Hook | Purpose | Behavior |
|------|---------|----------|
| `enforce-architecture-first.cjs` | Art. III — Docs before protected code | BLOCK (exit 2) |
| `write-path-validation.cjs` | Convention — Warn wrong doc paths | WARN (exit 0) |
| `enforce-story-gate.cjs` | Art. III — Story required for code | BLOCK (exit 2) |
| `slug-validation.py` | Convention — Validate naming | WARN (exit 0) |
| `mind-clone-governance.py` | Cloning — DNA required | BLOCK (exit 2) |
| `enforce-delegation.cjs` | Art. VIII — Orchestrators can't execute | BLOCK (exit 2) |

### PreToolUse — Read
| Hook | Purpose | Behavior |
|------|---------|----------|
| `read-protection.py` | Security — Control sensitive file access | WARN (exit 0) |

### UserPromptSubmit
| Hook | Purpose | Behavior |
|------|---------|----------|
| `synapse-wrapper.cjs` | SYNAPSE context injection | ALLOW (exit 0) |

### PreCompact
| Hook | Purpose | Behavior |
|------|---------|----------|
| `precompact-wrapper.cjs` | Session digest before compaction | ALLOW (exit 0) |

## Hook Design Principles

1. **Fail-open** — If a hook crashes or can't parse input, exit 0 (allow)
2. **Fast** — Each hook must complete in < 5 seconds
3. **Silent on success** — Only output on block or warning
4. **Deterministic** — Same input always produces same output
5. **No side effects** — Hooks read state but don't modify it

## Adding New Hooks

1. Create script in `.claude/hooks/` (prefer CJS for portability)
2. Add entry to `.claude/settings.json` under appropriate event
3. Document in this file (hook-governance.md)
4. Test with mock JSON via stdin
5. Verify fail-open behavior with invalid input

## Exit Code Protocol

| Code | Meaning | Effect |
|------|---------|--------|
| 0 | Allow | Operation proceeds |
| 2 | Block | Operation denied, message shown to model |
| Other | Ignored | Operation proceeds (treated as 0) |
