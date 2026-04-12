# SINAPSE Framework Security Audit

**Date:** 2026-04-10
**Auditor:** Claude Opus 4.6 (automated code review)
**Scope:** SINAPSE framework code (.claude/hooks/, .sinapse-ai/core/, packages/installer/, bin/)
**Mode:** YOLO (framework governance)

## Executive Summary

**Overall Security Posture: GOOD**

The SINAPSE framework demonstrates a mature security posture with multiple defense layers: hook-based enforcement, secret scanning, SQL governance, path validation, and manifest signature verification. The codebase consistently follows fail-open/fail-closed patterns as documented, and no hardcoded secrets were found in production code. However, there are several medium-severity findings that should be addressed to reach enterprise-grade security.

---

## Findings

### CRITICAL

**No critical security issues found.**

The framework has no exposed credentials, no arbitrary code execution from user input, and no exploitable injection vectors in its current form.

---

### HIGH

#### H-1: `eval()` usage in test-discovery.js (Code Injection Risk)

**File:** `.sinapse-ai/infrastructure/scripts/test-discovery.js:724`
**Code:**
```javascript
return eval('(' + match[1] + ')');
```

**Risk:** This `eval()` call parses `module.exports` from Jest config files. While the input comes from local project files (not external user input), it could execute arbitrary code if a malicious Jest config is present in the repository. An attacker who gains write access to `jest.config.js` could execute arbitrary code through this path.

**Recommendation:** Replace with `JSON.parse()`, `vm.runInNewContext()` with a frozen sandbox, or a dedicated config parser like `require()` with `Module._resolveFilename` validation.

---

#### H-2: Shell Command Injection in pr-review-ai.js

**File:** `.sinapse-ai/infrastructure/scripts/pr-review-ai.js:846`
**Code:**
```javascript
execSync(`gh pr comment ${prNumber} --body "${body.replace(/"/g, '\\"')}"`, { ... });
```

**Risk:** The `body` variable (derived from review content) is inserted into a shell command with only double-quote escaping. Characters like `$(...)`, backticks, `\n`, and `$()` can still break out of the quoting on Unix shells. The `prNumber` parameter is also interpolated without sanitization -- if sourced from user input, it could inject shell commands.

**Recommendation:**
- Use `execFileSync('gh', ['pr', 'comment', prNumber, '--body', body])` (array form avoids shell interpretation entirely).
- Apply the same fix to lines 853-854 (`gh pr review`).
- Validate `prNumber` is strictly numeric.

---

#### H-3: Shell Command Injection in terminal-spawner.js

**File:** `.sinapse-ai/core/orchestration/terminal-spawner.js:557`
**Code:**
```javascript
const result = execSync(`bash "${scriptPath}" ${args.join(' ')}`, { ... });
```

**Risk:** The `args` array is joined with spaces and interpolated directly into a shell command string. If any element of `args` contains shell metacharacters (`;`, `|`, `$()`, backticks), they will be interpreted by the shell.

**Recommendation:** Use `execFileSync('bash', [scriptPath, ...args])` to pass arguments as an array, preventing shell interpretation.

---

#### H-4: Manifest Signature Verification Uses Placeholder Key

**File:** `packages/installer/src/installer/manifest-signature.js:45`
**Code:**
```javascript
publicKey: 'REPLACE_WITH_ACTUAL_PUBLIC_KEY_BASE64_HERE',
```

**Risk:** The manifest signature verification system is fully implemented and well-designed, but the public key is still a placeholder. This means the signature verification chain provides zero assurance in its current state. While the code correctly detects and reports the placeholder, any code that calls `loadAndVerifyManifest()` with `requireSignature: false` (which appears to be the current behavior) bypasses verification entirely.

**Recommendation:** Generate an Ed25519 keypair, replace the placeholder with the actual public key, and set `requireSignature: true` in production flows.

---

### MEDIUM

#### M-1: Unsanitized Path Interpolation in symlink-manager.js

**File:** `.sinapse-ai/core/mcp/symlink-manager.js:66,103,315,383`
**Code:**
```javascript
execSync(`fsutil reparsepoint query "${linkPath}"`, { ... });
execSync(`mklink /J "${linkPath}" "${globalPath}"`, { ... });
execSync(`rmdir "${linkPath}"`, { ... });
```

**Risk:** `linkPath` and `globalPath` are interpolated into shell commands. On Windows, paths containing `"` or `&` characters could break out of the quoting. While these paths are typically derived from `path.join()` operations on project-controlled values (not direct user input), a crafted project directory name could theoretically exploit this.

**Recommendation:** Use `execFileSync('cmd', ['/c', 'mklink', '/J', linkPath, globalPath])` or validate paths against a strict character set before interpolation.

---

#### M-2: PATH Manipulation in cli.js Without Validation

**File:** `bin/cli.js:691`
**Code:**
```javascript
execSync(`setx PATH "${newPath}"`, { encoding: 'utf8', stdio: 'pipe' });
```

**Risk:** The `newPath` variable is constructed from the current PATH value plus a new segment. If the current PATH contains malicious content (unlikely but possible in a compromised environment), this could inject commands via the `setx` call.

**Recommendation:** Validate `newPath` against a strict pattern (only path separators, alphanumeric, and common path characters) before execution.

---

#### M-3: Git Command Injection in semantic-merge-engine.js

**File:** `.sinapse-ai/core/execution/semantic-merge-engine.js:1524,1534,1567`
**Code:**
```javascript
const fileList = execSync(`git ls-tree -r --name-only ${branch}`, { ... });
const content = execSync(`git show ${branch}:${filePath}`, { ... });
```

**Risk:** The `branch` and `filePath` variables are interpolated into shell commands. A branch name like `main; rm -rf /` or a file path with shell metacharacters could execute arbitrary commands.

**Recommendation:** Use `execFileSync('git', ['ls-tree', '-r', '--name-only', branch])` array form. Validate branch names against `^[a-zA-Z0-9/_.\-]+$`.

---

#### M-4: Git Command Injection in changelog-generator.js and diff-generator.js

**File:** `.sinapse-ai/infrastructure/scripts/changelog-generator.js:142,189`
**File:** `.sinapse-ai/infrastructure/scripts/diff-generator.js:52`
**Code:**
```javascript
const log = execSync(`git log ${since}..${until} --format="${format}" --no-merges`, { ... });
return execSync(`git diff ${fromCommit} ${toCommit}`, { encoding: 'utf-8' });
```

**Risk:** The `since`, `until`, `fromCommit`, `toCommit`, and `format` parameters are interpolated directly into shell command strings. These could contain shell metacharacters if sourced from branch names or tags with special characters.

**Recommendation:** Use `execFileSync` with array arguments.

---

#### M-5: enforce-git-push-authority.sh Fail-Closed with Potential Bypass

**File:** `.claude/hooks/enforce-git-push-authority.sh`

**Risk (Minor):** While the hook correctly blocks direct `git push`, `eval`/`exec` patterns, and pipe-to-shell patterns, there are some bypass vectors:
1. Using `xargs` to execute git push: `echo "push" | xargs git` would not be caught.
2. Aliased commands or functions defined in the command itself.
3. The `$()` subshell pattern: `$(git push origin main)` embedded in another command.
4. Using `env` or `command`: `env git push origin main` or `command git push`.

**Recommendation:** Consider adding checks for `xargs`, `env`, `command` prefixes, and `$(...)` subshell patterns containing push. Alternatively, use a deny-by-default approach that only allows known-safe git commands.

---

#### M-6: Large File Check Uses Unsanitized File Paths in Shell Commands

**File:** `.sinapse-ai/core/health-check/checks/repository/large-files.js:72`
**Code:**
```javascript
const _sizeOutput = execSync(`git ls-files -s "${file}"`, { ... });
```

**Risk:** `file` comes from `git ls-files` output. While git typically produces safe filenames, repositories can contain files with shell metacharacters in their names (e.g., files with `$`, backticks, or newlines).

**Recommendation:** Use `execFileSync('git', ['ls-files', '-s', file])`.

---

#### M-7: issue-triage.js Passes Unvalidated Input to gh CLI

**File:** `.sinapse-ai/development/scripts/issue-triage.js:23`
**Code:**
```javascript
return execSync(`gh ${cmd}`, { encoding: 'utf8', timeout: 60000 });
```

**Risk:** The `cmd` parameter is interpolated directly into a shell command. If `cmd` contains shell metacharacters, arbitrary command execution is possible.

**Recommendation:** Use `execFileSync('gh', cmd.split(' '))` or validate `cmd` strictly.

---

### LOW / INFORMATIONAL

#### L-1: Hooks Consistently Follow Fail-Open Pattern (POSITIVE)

All CJS/Python hooks correctly implement the documented fail-open behavior:
- `enforce-story-gate.cjs`: `process.exit(0)` on parse failure (line 159)
- `enforce-architecture-first.cjs`: `process.exit(0)` on parse failure (line 111)
- `enforce-delegation.cjs`: `process.exit(0)` on parse failure (line 89)
- `secret-scanning.cjs`: `process.exit(0)` on parse failure (line 115)
- `sql-governance.py`: `sys.exit(0)` on JSONDecodeError (line 127)
- `slug-validation.py`: `sys.exit(0)` on JSONDecodeError (line 108)
- `mind-clone-governance.py`: `sys.exit(0)` on JSONDecodeError (line 116)
- `read-protection.py`: `sys.exit(0)` on JSONDecodeError (line 97)
- `verify-packages.cjs`: `process.exit(0)` on crash (line 80)

**Exception:** `enforce-git-push-authority.sh` is intentionally **fail-closed** (blocks on parse failure, line 22-25). This is documented and appropriate since git push authority is the most security-critical hook.

#### L-2: stdin JSON Parsing Is Consistently Validated (POSITIVE)

All hooks read stdin JSON safely using `JSON.parse()` within try/catch blocks. No hook processes raw stdin without parsing first.

#### L-3: No Hardcoded Secrets in Production Code (POSITIVE)

Grep for API keys, tokens, passwords, and credentials found matches only in:
- Test files (intentional test fixtures)
- `.docker/llm-routing/config.yaml` (uses `os.environ/` pattern, not actual values)
- `.github/workflows/` (uses `${{ secrets.GITHUB_TOKEN }}` properly)
- `i18n.js` (UI strings mentioning "password", not actual passwords)

No real credentials were found in production code.

#### L-4: .gitignore Properly Covers Sensitive Files (POSITIVE)

`.env`, `.env.local`, `.env.*.local`, `.env.production`, `.env.development`, `.env.test` are all listed in `.gitignore`.

#### L-5: security-utils.js Is Well-Implemented (POSITIVE)

The `security-utils.js` module provides:
- Path traversal prevention with `..` and null byte detection
- Base path containment validation
- Input sanitization for filenames, identifiers, shell, and HTML
- JSON size and depth limits
- In-memory rate limiting

This module exists but is not consistently used across the codebase (see recommendations).

#### L-6: Hook Timeout Safety (POSITIVE)

`synapse-engine.cjs` has a 5s timeout, `precompact-session-digest.cjs` has a 9s timeout, and both wrappers (`synapse-wrapper.cjs`, `precompact-wrapper.cjs`) add process-level timeouts (8s, 12s respectively). This prevents hooks from blocking Claude Code indefinitely.

#### L-7: Cross-Platform Path Handling (POSITIVE)

Multiple files correctly normalize Windows backslashes to forward slashes (`filePath.replace(/\\/g, '/')`). The `relativize()` functions in hooks handle both path separator conventions.

#### L-8: openInBrowser() in graph-dashboard/cli.js

**File:** `.sinapse-ai/core/graph-dashboard/cli.js:155`

The `filePath` parameter is interpolated into a shell command (`start`, `open`, `xdg-open`). However, this path is always constructed by the framework itself (not user input), so the risk is minimal. Noted for completeness.

#### L-9: Duplicate Hook Implementations (Python + CJS)

Several hooks exist in both Python and CJS versions:
- `enforce-architecture-first.py` / `enforce-architecture-first.cjs`
- `write-path-validation.py` / `write-path-validation.cjs`

This duplication increases maintenance burden and the risk of behavioral divergence. Only one version per hook should be active (configured in settings.json).

---

## Recommendations

### Priority 1 (Fix Soon)

1. **Replace `eval()` in test-discovery.js** (H-1) with a safe config parser. This is the only actual `eval()` in production code.

2. **Fix shell injection in pr-review-ai.js** (H-2) by switching to `execFileSync` with array arguments for all `gh` CLI calls.

3. **Fix shell injection in terminal-spawner.js** (H-3) by switching to `execFileSync` array form.

4. **Activate manifest signature verification** (H-4) by generating and deploying the Ed25519 keypair.

### Priority 2 (Fix Next Sprint)

5. **Audit all `execSync` calls with string interpolation** and convert to `execFileSync` with array arguments. The pattern `execSync(\`command ${variable}\`)` should be considered a code smell. Priority files:
   - `semantic-merge-engine.js` (M-3)
   - `changelog-generator.js`, `diff-generator.js` (M-4)
   - `symlink-manager.js` (M-1)
   - `large-files.js` (M-6)
   - `issue-triage.js` (M-7)

6. **Adopt `security-utils.js` consistently**: The path validation, input sanitization, and JSON validation utilities already exist in `.sinapse-ai/core/utils/security-utils.js` but are not imported by any of the files flagged above. Create a lint rule or ESLint plugin that flags `execSync` with template literals.

### Priority 3 (Harden)

7. **Add `xargs`, `env`, `command`, and `$(...)` bypass checks** to `enforce-git-push-authority.sh` (M-5).

8. **Remove duplicate Python hooks** (L-9) to reduce maintenance surface. The CJS versions are preferred for cross-platform portability.

9. **Add input validation for git branch names** across the codebase. A simple regex like `/^[a-zA-Z0-9/_.\-]+$/` would prevent most injection vectors through branch name parameters.

10. **Consider a centralized `safeExec()` wrapper** that validates arguments before executing shell commands, similar to how `security-utils.js` centralizes path validation. This would provide defense-in-depth for all `execSync` calls.

---

## Positive Security Patterns Observed

The framework demonstrates several mature security practices worth preserving:

1. **Defense in depth**: Multiple layers (hooks, settings.json deny rules, git pre-commit, framework guard) enforce the same security boundaries.
2. **Consistent fail-open**: All hooks except the intentionally fail-closed push authority hook follow the fail-open principle, preventing hook bugs from blocking development.
3. **Secret scanning at multiple layers**: Claude Code hooks (secret-scanning.cjs), git pre-commit (staged-secret-scan.js), and PR review (pr-review-ai.js) all independently scan for secrets.
4. **Manifest integrity**: The signature verification infrastructure is well-designed with DoS protections (file size limits), though the key needs activation.
5. **Atomic writes**: The `atomic-write.js` utility prevents file corruption during crashes.
6. **Security utilities module**: `security-utils.js` provides a solid foundation for input validation.
