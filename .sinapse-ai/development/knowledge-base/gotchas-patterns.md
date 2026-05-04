# Gotchas & Error Patterns

> **Agente(s):** ALL agents
> **Uso:** Consult BEFORE debugging -- the answer may already be here.
> Auto-populated by agents when encountering recurring errors.

---

## Format

Each entry follows:
- **Pattern:** What the error looks like
- **Root Cause:** Why it happens
- **Fix:** How to resolve it
- **Agents:** Which agents encounter this
- **Added:** Date first documented

---

## Git & CI/CD Gotchas

### G-GIT-01: Push blocked by hook

- **Pattern:** `BLOCKED: Only @devops (Pipeline) can execute git push` when any agent tries to push
- **Root Cause:** `enforce-git-push-authority.sh` hook enforces Constitution Article II -- only @devops has push authority
- **Fix:** Delegate push to @devops via `*push`. Never attempt `git push` from @developer or other agents
- **Agents:** @developer, @architect, @quality-gate
- **Added:** 2026-01-15

### G-GIT-02: Working on main branch

- **Pattern:** Agent starts coding directly on `main`, later blocked by branch protection or creates merge conflicts
- **Root Cause:** Session start did not follow Safe Collaboration protocol (auto-branch)
- **Fix:** Always create a feature branch before any work. Pattern: `{user}/{type}/{short-desc}` (e.g., `caio/feat/new-feature`). Run `git fetch origin` + check branch at session start
- **Agents:** @developer
- **Added:** 2026-01-15

### G-GIT-03: Merge conflict on package-lock.json

- **Pattern:** `CONFLICT (content): Merge conflict in package-lock.json` after pulling main
- **Root Cause:** Two branches modified dependencies independently
- **Fix:** Delete `package-lock.json`, run `npm install` to regenerate, then commit the new lockfile. Never manually resolve lockfile conflicts
- **Agents:** @developer, @devops
- **Added:** 2026-02-10

---

## Hook & Permission Gotchas

### G-HOOK-01: Story gate blocks code writing

- **Pattern:** `BLOCKED: No story found for this work` when trying to Write/Edit source files
- **Root Cause:** `enforce-story-gate.cjs` requires a valid story in `docs/stories/` with status >= Ready before code changes
- **Fix:** Create a story via @sprint-lead `*draft`, validate via @product-lead `*validate`, then proceed with implementation. Framework governance work by @sinapse-orqx is exempt
- **Agents:** @developer
- **Added:** 2026-01-20

### G-HOOK-02: Architecture-first gate blocks protected paths

- **Pattern:** `BLOCKED: Architecture documentation required before modifying protected paths` when editing core files
- **Root Cause:** `enforce-architecture-first.cjs` requires architecture docs before modifying L1/L2 paths
- **Fix:** Document the architectural decision first, then modify the code. Check `.claude/rules/hook-governance.md` for which paths are protected
- **Agents:** @developer, @architect
- **Added:** 2026-02-01

### G-HOOK-03: Delegation hook blocks orchestrator execution

- **Pattern:** `BLOCKED: Orchestrators cannot execute domain work directly` when an orchestrator tries to write code
- **Root Cause:** `enforce-delegation.cjs` enforces Constitution Article VIII -- orchestrators must delegate
- **Fix:** The orchestrator must delegate to the appropriate specialist agent. Orchestrators can only do routing, diagnostics, and coordination
- **Agents:** @sinapse-orqx, all *-orqx orchestrators
- **Added:** 2026-02-15

### G-HOOK-04: Hook crashes but operation proceeds

- **Pattern:** Hook outputs an error traceback but the operation is NOT blocked (exit code 0)
- **Root Cause:** Hooks follow fail-open design -- if a hook crashes or cannot parse input, it exits 0 (allow)
- **Fix:** This is by design. Fix the hook itself if the crash is recurring, but do not rely on broken hooks for enforcement. Report to @devops
- **Agents:** ALL
- **Added:** 2026-03-01

---

## Testing Gotchas

### G-TEST-01: Tests pass locally but fail in CI

- **Pattern:** `npm test` passes on developer machine but CI reports failures
- **Root Cause:** Common causes: (1) tests depend on OS-specific paths (Windows backslashes vs Unix forward slashes), (2) timezone-dependent assertions, (3) missing environment variables in CI, (4) test execution order dependency
- **Fix:** Use `path.join()` or `path.posix` for paths. Use UTC in date assertions. Add required env vars to CI config. Ensure tests are independently runnable with `--randomize`
- **Agents:** @developer, @quality-gate
- **Added:** 2026-02-20

### G-TEST-02: MSW handlers not intercepting requests

- **Pattern:** Integration tests hit real API endpoints instead of MSW mocks, causing timeouts or unexpected data
- **Root Cause:** MSW server not started before tests, or handler URL does not match the actual request URL (trailing slashes, query params, base URL mismatch)
- **Fix:** Verify `server.listen()` in `beforeAll`, `server.resetHandlers()` in `afterEach`, `server.close()` in `afterAll`. Match URLs exactly including protocol and path
- **Agents:** @developer, @quality-gate
- **Added:** 2026-03-10

### G-TEST-03: Vitest snapshot mismatch after dependency update

- **Pattern:** `Snapshot mismatch` errors across multiple test files after updating a UI library
- **Root Cause:** Component HTML output changed with the library update, invalidating stored snapshots
- **Fix:** Review the snapshot diffs. If changes are expected, run `vitest --update` to regenerate snapshots. Prefer `toHaveTextContent`/`toHaveAttribute` assertions over snapshots for resilience
- **Agents:** @developer
- **Added:** 2026-03-15

---

## MCP & Browser Gotchas

### G-MCP-01: Docker MCP secrets not passed to containers

- **Pattern:** `docker mcp tools ls` shows "(N prompts)" instead of "(N tools)". MCP server starts but fails authentication
- **Root Cause:** Docker MCP Toolkit secrets store and template interpolation do not work properly (known bug Dec 2025+). Credentials set via `docker mcp secret set` are NOT passed to containers
- **Fix:** Edit `~/.docker/mcp/catalogs/docker-mcp.yaml` directly with hardcoded env values. See `.claude/rules/mcp-usage.md` for details
- **Agents:** @devops
- **Added:** 2026-01-10

### G-MCP-02: Using docker-gateway for local file operations

- **Pattern:** File read/write fails with path errors like `/mnt/c/Users/...` not found, or operations are unexpectedly slow
- **Root Cause:** Using `docker-gateway` MCP for operations that should use native Claude Code tools. Docker runs in a Linux container with different filesystem paths
- **Fix:** Always use native tools for local operations: `Read` for files, `Write`/`Edit` for writing, `Bash` for commands, `Grep` for search. Only use docker-gateway for MCP servers running inside Docker (EXA, Context7, Apify)
- **Agents:** ALL
- **Added:** 2026-01-25

### G-MCP-03: Chrome DevTools MCP connection refused

- **Pattern:** `Connection refused` or `Cannot connect to browser` when using chrome-devtools MCP
- **Root Cause:** Chrome not launched with remote debugging enabled, or port conflict
- **Fix:** Launch Chrome with `--remote-debugging-port=9222`. Ensure no other process is using port 9222. On Windows, close all Chrome instances first
- **Agents:** @developer, @quality-gate
- **Added:** 2026-02-28

---

## Supabase & Database Gotchas

### G-DB-01: RLS enabled but no policies -- data inaccessible

- **Pattern:** Supabase queries return empty arrays even though data exists in the table
- **Root Cause:** RLS was enabled on the table (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) but no policies were created. PostgreSQL default is deny-all when RLS is active without policies
- **Fix:** Create explicit policies for each operation (SELECT, INSERT, UPDATE, DELETE). At minimum: `CREATE POLICY "allow_authenticated" ON table FOR SELECT TO authenticated USING (true)`
- **Agents:** @data-engineer, @developer
- **Added:** 2026-01-15

### G-DB-02: RLS performance degradation -- slow queries

- **Pattern:** API response times increase from <100ms to 500ms+ as data grows, EXPLAIN ANALYZE shows sequential scans
- **Root Cause:** RLS policy columns not indexed, or `auth.uid()` called without wrapping in `SELECT` subquery
- **Fix:** (1) Index all columns used in RLS policies: `CREATE INDEX idx_user ON table(user_id)`. (2) Use `(SELECT auth.uid()) = user_id` instead of `auth.uid() = user_id` (up to 95% faster due to caching). (3) Add explicit `.eq()` filters in SDK queries
- **Agents:** @data-engineer, @developer
- **Added:** 2026-02-05

### G-DB-03: service_role key exposed in frontend

- **Pattern:** Security scan detects `service_role` key in client-side bundle or `NEXT_PUBLIC_` variable
- **Root Cause:** Developer accidentally used service_role key (which bypasses RLS) instead of anon key in frontend code
- **Fix:** Immediately rotate the exposed key in Supabase Dashboard. Use ONLY `anon` key with `NEXT_PUBLIC_` prefix. Keep `service_role` in server-only env vars (no `NEXT_PUBLIC_` prefix). Add secret scanning hook
- **Agents:** @developer, @devops
- **Added:** 2026-01-20

### G-DB-04: SQL Editor bypasses RLS -- false sense of security

- **Pattern:** Developer tests RLS policies in Supabase SQL Editor and sees all data, concluding RLS is broken
- **Root Cause:** The SQL Editor runs with superuser/service_role privileges, which bypasses RLS entirely
- **Fix:** Test RLS policies using the Supabase client SDK (JS/Python) with the anon key, not the SQL Editor. Alternatively, use `SET ROLE authenticated; SET request.jwt.claims = '{"sub":"user-uuid"}'` in SQL to simulate a user
- **Agents:** @data-engineer, @developer
- **Added:** 2026-03-01

---

## NPM & Publishing Gotchas

### G-NPM-01: npm publish fails with 403

- **Pattern:** `npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/sinapse-ai` when publishing
- **Root Cause:** (1) Not logged in to npm, (2) package name already taken by another user, (3) npm token expired, or (4) 2FA required but not provided
- **Fix:** Run `npm login` to refresh auth. Check package name availability with `npm view <name>`. For scoped packages, ensure the org exists. For 2FA, use `npm publish --otp=<code>`
- **Agents:** @devops
- **Added:** 2026-02-10

### G-NPM-02: Version conflict on publish

- **Pattern:** `npm ERR! 403 - cannot publish over previously published version` when trying to publish
- **Root Cause:** The version in `package.json` already exists on the npm registry
- **Fix:** Bump the version using `npm version patch|minor|major` before publishing. Use `pre-commit-version-check.sh` hook to catch this early
- **Agents:** @devops
- **Added:** 2026-02-15

---

## Next.js & Vercel Gotchas

### G-NEXT-01: Server Component importing client-only code

- **Pattern:** `Error: useState is not a function` or `Error: window is not defined` in a Server Component
- **Root Cause:** Server Components cannot use React hooks (useState, useEffect, etc.) or browser APIs (window, document). All components are Server Components by default in App Router
- **Fix:** Add `'use client'` directive at the top of files that need interactivity. Keep the client boundary as small as possible -- pass Server Components as `children` to Client Components
- **Agents:** @developer
- **Added:** 2026-03-05

### G-NEXT-02: NEXT_PUBLIC_ variable undefined at runtime

- **Pattern:** `process.env.NEXT_PUBLIC_API_URL` is `undefined` in the browser even though it is set in `.env.local`
- **Root Cause:** `NEXT_PUBLIC_` variables are inlined at BUILD time, not runtime. If the variable was added after the last build, it will not be available
- **Fix:** Restart the dev server (`npm run dev`) after adding new env vars. For production, redeploy after changing environment variables in Vercel Dashboard
- **Agents:** @developer
- **Added:** 2026-03-10

---

## How to Add New Entries

When encountering a recurring error (seen 2+ times), add a new entry:

1. Choose the appropriate category (or create a new one)
2. Use the next sequential ID: `G-{CATEGORY}-{NN}`
3. Fill in all fields: Pattern, Root Cause, Fix, Agents, Added
4. Keep descriptions concise -- max 3 lines per field
5. Reference relevant documentation or hook files when applicable
