# Research Synthesis for SINAPSE Mega-Upgrade

> **Date:** 2026-04-10
> **Sources:** 12 research files from `caioimori-pesquisas/docs/research/`
> **Purpose:** Actionable findings distilled for SINAPSE framework implementation

---

## 1. Token Economy Optimizations

### Current State
SINAPSE loads ~10 rules files globally (~5,000-8,000 tokens), a CLAUDE.md of ~200+ lines (~1,500-2,000 tokens), plus MCP server definitions (~2,000-14,000 per server). Total overhead before any user message: 25,000-35,000 tokens minimum, potentially 70,000+ with many MCP servers. CLAUDE.md survives ALL compaction, consuming tokens in EVERY request.

### Gaps

| Gap | Impact |
|-----|--------|
| CLAUDE.md is oversized (400+ lines project + global) | ~3,000-4,000 tokens consumed per request, never compacted |
| Rules files lack `paths:` frontmatter scoping | All rules load globally instead of on-demand |
| No compaction strategy documented | Users hit 95% trigger (too late), should compact at 60% |
| MCP servers loaded eagerly | Each server definition adds 2,000-14,000 tokens permanently |
| No model routing for subagents | Opus used for routine tasks where Haiku would suffice |
| Subagent spawn overhead not optimized | Each spawn costs 20,000+ tokens minimum |

### Recommendations

1. **Slim CLAUDE.md to <150 lines** (save ~1,000-1,500 tokens/request)
   - File: `.claude/CLAUDE.md` -- move specialized instructions to Skills
   - Move workflow details, agent activation tables, and tool guidance to `.claude/skills/` or `.claude/rules/` with `paths:` frontmatter
   - Keep only: project structure, core conventions, critical gates, and navigation pointers

2. **Add `paths:` frontmatter to ALL non-universal rules**
   - Files: `.claude/rules/workflow-execution.md`, `.claude/rules/documentation-first.md`, `.claude/rules/tool-examples.md`
   - Rules that apply only during development work should scope to `["docs/stories/**", "packages/**", "tests/**"]`
   - Estimated savings: 3,000-5,000 tokens when working on non-code files

3. **Implement compaction strategy in CLAUDE.md**
   - Add compact instructions: "When compacting, focus on: active story, code changes, architectural decisions, blockers, file paths modified"
   - Recommend `/compact` at 60% context usage, not default 83%

4. **Use YAML over JSON for all framework configs**
   - YAML saves 20-30% tokens vs JSON for hierarchical data
   - Agent definitions, workflow configs, and squad configs already use YAML (good)
   - Impact: ~500-1,000 tokens saved per complex config loaded

5. **Route subagent tasks by cost tier**
   - Simple file reads/searches: avoid subagent entirely (save 20,000 tokens per avoided spawn)
   - Routine QA checks, linting: Haiku subagents
   - Architecture decisions, complex implementation: Opus/Sonnet

6. **MCP Tier 3 deferred loading (already implemented)**
   - Current tool-registry.yaml 3-tier system is correct
   - Validate that non-essential MCPs are truly deferred at runtime
   - Target: <30,000 tokens overhead at session start

### Impact
- Token savings: 30-50% reduction in per-request overhead
- Cost savings: ~$2-4/dev/day at current Sonnet pricing
- Context headroom: 15-25% more usable context window

---

## 2. Framework Architecture Improvements

### Current State
SINAPSE has a proprietary YAML+MD architecture with Constitution, agents, tasks, workflows, and hooks. It runs exclusively on Claude Code. AIOX-Core (direct competitor) supports Claude Code, Gemini CLI, Codex CLI, and Cursor with varying levels of parity.

### Gaps

| Gap | Impact |
|-----|--------|
| No multi-IDE support | Locked to Claude Code users only |
| No AGENTS.md generation | Misses 24+ tool compatibility via universal standard |
| No SKILL.md export layer | Cannot distribute squads to 33+ platforms |
| Memory system lacks session-digest | Knowledge lost when sessions close |
| No Gotchas/error pattern memory | Repeated mistakes not captured automatically |
| No crash recovery mechanism | Mid-task failures require manual restart |
| Agent handoff loses scratchpad data in practice | Scratchpad protocol defined but not enforced |

### Recommendations

1. **Generate AGENTS.md as universal compatibility layer**
   - New file: `bin/generators/agents-md-generator.js`
   - AGENTS.md is the Linux Foundation standard, supported by 24+ tools including Codex, Gemini CLI, Cursor, Copilot
   - Generate from SINAPSE source of truth (Constitution + core rules + agent summary)
   - Transpilation strategy:
     - Level 1: `AGENTS.md` (universal, 24+ tools)
     - Level 2: `CLAUDE.md` (Claude-specific with hooks/rules), `GEMINI.md`, `.cursor/rules/*.mdc`
     - Level 3: `.gemini/agents/*.md`, `.github/agents/*.agent.md` (tool-specific agents)
     - Level 4: `.claude/hooks/`, Codex `hooks.json` (lifecycle hooks)

2. **Create SKILL.md export layer for squads**
   - New directory: `squads/{squad-name}/SKILL.md` per squad
   - Follow Agent Skills spec (agentskills.io): name, description (pushy), license, compatibility, metadata
   - Progressive disclosure: SKILL.md (<500 lines) + `references/` + `assets/`
   - Distribution: `sinapse-ai/skills` GitHub repo, Claude Code marketplace, officialskills.sh
   - Naming convention: `sinapse-{squad}-{skill}` (e.g., `sinapse-research-deep-dive`)

3. **Implement Memory Intelligence System (from AIOX analysis)**
   - New module: `.sinapse-ai/core/memory/`
   - Components to build:
     - **Gotchas memory**: Auto-capture errors after 3 identical occurrences in 24h, persist in `.sinapse/gotchas.json`
     - **Session digest**: PreCompact hook extracts structured knowledge before compaction (already have `precompact-wrapper.cjs`)
     - **Attention scoring**: HOT (>0.7, always loaded) / WARM (0.3-0.7, loaded on init) / COLD (<0.3, on-demand via `*recall`)
     - **Token budget**: Default 2,000 tokens per agent activation, configurable
   - 4 cognitive sectors: Episodic (7d TTL), Semantic (365d), Procedural (30d), Reflective (infinite)

4. **Add crash detection and recovery**
   - Detect: last activity >30min ago AND last action was not PAUSE/COMPLETED/ABORT
   - Options: CONTINUE, REVIEW, RESTART, DISCARD
   - Persist session state in `.sinapse/session-state.json`

5. **Adopt planning agent pattern (from Windsurf)**
   - Separate planning agent that maintains long-term plan while main agent executes short-term actions
   - Implement for complex epics: planning agent refines plan, execution agent takes atomic actions
   - Store plans in `.claude/plans/` (already supported by Claude Code)

### Impact
- Multi-IDE: 5-10x potential user base expansion
- Skill distribution: Access to 33+ platforms and 1,060+ skill ecosystem
- Memory system: 40-60% reduction in repeated mistakes across sessions

---

## 3. NPM Publishing & Distribution

### Current State
SINAPSE publishes as `sinapse-ai` on NPM with `npx sinapse-ai install` as the entry point. Uses `bin/sinapse-init.js` and `bin/sinapse.js`. No scoped package, no OIDC publishing, no changesets for versioning.

### Gaps

| Gap | Impact |
|-----|--------|
| Not scoped (`@sinapse-ai/core`) | Looks unprofessional, no namespace protection |
| No OIDC token-free publishing | Manual NPM_TOKEN management, security risk |
| No changesets for versioning | Manual version bumps, no automated changelogs |
| No CI/CD publish pipeline | Manual `npm publish` instead of automated |
| No `exports` field in package.json | Missing conditional ESM/CJS resolution |
| Installer not interactive (@clack/prompts) | Inferior UX vs AIOX-Core and create-t3-app |
| No multi-IDE target selection in installer | Only generates Claude Code config |

### Recommendations

1. **Migrate to scoped package `@sinapse-ai/core`**
   - File: `package.json` -- change `name` to `@sinapse-ai/core`
   - Add `publishConfig: { "access": "public" }`
   - Register `@sinapse-ai` org on npmjs.com
   - Maintain `sinapse-ai` as redirect package

2. **Implement OIDC token-free publishing via GitHub Actions**
   - New file: `.github/workflows/publish.yml`
   - Use `id-token: write` permission for OIDC
   - Configure NPM provenance (`--provenance` flag)
   - Zero secrets needed -- GitHub OIDC authenticates directly with NPM
   - Reference: npm provenance docs, used by Astro, Turborepo

3. **Add changesets for versioning**
   - Install: `@changesets/cli`, `@changesets/changelog-github`
   - New file: `.changeset/config.json`
   - Workflow: developer creates changeset -> PR merged -> changeset-bot creates release PR -> merge releases
   - Generates changelogs automatically from changeset descriptions

4. **Add `exports` field to package.json**
   - Conditional exports for ESM/CJS dual support
   - Separate types entry for TypeScript
   - Pattern from research:
     ```json
     "exports": {
       ".": {
         "import": { "types": "./dist/index.d.ts", "default": "./dist/index.mjs" },
         "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
       }
     }
     ```

5. **Upgrade installer with @clack/prompts and multi-IDE target**
   - File: `bin/sinapse-init.js` -- replace current prompts with `@clack/prompts`
   - Add step: "Select LLM target" (Claude Code, Codex CLI, Gemini CLI, Cursor, Copilot, Multiple)
   - Generate appropriate config files per selection
   - Reference: AIOX-Core installer, create-t3-app, Astro CLI

6. **Pre-publish checklist (automated)**
   - `npm run prepublishOnly` should run: `npm run lint && npm run typecheck && npm test && npm run build`
   - Add `files` allowlist to package.json (never `.npmignore`)
   - Dry-run validation: `npm publish --dry-run` in CI

### Impact
- Professional distribution matching top-tier frameworks
- Zero-touch publishing via OIDC (no secret rotation needed)
- Automated versioning and changelogs

---

## 4. Software Engineering Patterns

### Current State
SINAPSE has coding conventions in CLAUDE.md (naming, imports, TypeScript rules). The framework recommends but does not enforce specific architecture patterns. Knowledge bases exist for animations squad but not for general engineering patterns.

### Gaps

| Gap | Impact |
|-----|--------|
| No architecture decision tree for projects | Users don't know when to use Monolith vs Modular Monolith |
| No testing strategy framework | No Testing Trophy/Pyramid guidance |
| File naming conventions not comprehensive | Missing `.service.ts`, `.types.ts` suffix patterns |
| No Screaming Architecture enforcement | Top-level structure doesn't communicate domain |
| No Clean Architecture / Hexagonal templates | No scaffolding for production-grade patterns |
| Animation squad KB lacks decision trees | Knowledge bases are reference, not actionable |

### Recommendations

1. **Add architecture decision tree to knowledge base**
   - New file: `squads/squad-development/knowledge-base/architecture-decision-tree.md`
   - Content: Decision tree from research --
     - Team <=5: Monolith
     - Team 3-15: Modular Monolith (golden standard 2025-2026)
     - Team 10+, independent domains: Selective microservices
   - Include: Clean Architecture layers, Hexagonal Architecture, DDD strategic patterns

2. **Formalize naming conventions with suffix system**
   - Update: `.claude/CLAUDE.md` or create `.claude/rules/naming-conventions.md` with `paths: ["packages/**", "apps/**"]`
   - Artifact naming: `{name}.{type}.{ext}` for framework files (e.g., `create-story.task.md`)
   - Application naming: kebab-case for files, PascalCase for components/classes
   - Full table from research covering: services, types, tests, configs, constants, schemas, stories

3. **Create testing strategy knowledge base**
   - New file: `squads/squad-development/knowledge-base/testing-strategy.md`
   - Testing Trophy (Kent C. Dodds): Integration > Unit > E2E > Static
   - Coverage targets: 80% minimum (pre-commit gate)
   - Patterns: Arrange-Act-Assert, Given-When-Then for stories
   - Anti-patterns: testing implementation details, snapshot overuse

4. **Add scaffolding templates for common project types**
   - Directory: `.sinapse-ai/development/templates/scaffolds/`
   - Templates: `modular-monolith/`, `next-app/`, `api-service/`, `saas-multi-tenant/`
   - Each includes: directory structure, base configs, example modules

5. **Implement anti-hallucination patterns in agent definitions**
   - Add to all agent `.md` files: "If you don't have sufficient information, say so explicitly rather than guessing"
   - Add to @developer: "NEVER edit a file without reading it first. NEVER import a package without verifying it exists. NEVER reference a path without checking it exists."
   - Add dependency verification hook: validate `package.json` additions against npm registry
   - Chain-of-Verification pattern for complex architectural decisions

### Impact
- Consistent production-grade code from day one
- 36% reduction in hallucination-caused errors (from CoVe research)
- Faster onboarding with architecture decision trees

---

## 5. Infrastructure & Security Hardening

### Current State
SINAPSE has a comprehensive security rule (`.claude/rules/security-data-protection.md`) with 25 deployment blockers, LGPD compliance checklist, and RLS enforcement. Infrastructure defaults to Vercel + Supabase stack for projects.

### Gaps

| Gap | Impact |
|-----|--------|
| No Supabase schema templates | Users start from scratch every project |
| No RLS performance optimization guidance | RLS without indexes causes 95%+ slowdown |
| No Edge Functions templates | Common patterns (webhooks, auth) not templated |
| No Database Branching workflow | Preview environments not integrated |
| No Vault usage for secrets | Secrets managed ad-hoc, not via Supabase Vault |
| OWASP 2025 not reflected in security rule | Missing A05 (Security Misconfiguration) depth |
| No CI/CD security scanning pipeline | Dependabot configured but no SAST/DAST |
| No FinOps awareness | Cloud costs not tracked or optimized |
| No supply chain security (SBOM) | No Software Bill of Materials generation |

### Recommendations

1. **Create Supabase schema templates**
   - New file: `squads/squad-development/knowledge-base/supabase-schema-patterns.md`
   - Templates: SaaS multi-tenant (shared table + tenant_id), Fintech (append-only transactions + audit log), CMS, E-commerce
   - Include RLS policies for each pattern
   - Include performance optimization: `(SELECT auth.uid())` pattern (95% faster), index columns in policies

2. **Add RLS performance optimization to security rule**
   - Update: `.claude/rules/security-data-protection.md`
   - Critical additions:
     - Always index columns referenced in RLS policies
     - Wrap `auth.uid()` in `SELECT`: `(SELECT auth.uid()) = user_id` (caches result)
     - Use `security_invoker = true` on views (Postgres 15+)
     - Specify roles with `TO authenticated` in all policies
     - Add explicit SDK-side filters (don't rely solely on RLS)

3. **Create Edge Functions template library**
   - New directory: `.sinapse-ai/development/templates/edge-functions/`
   - Templates: webhook-handler, stripe-payment, auth-callback, og-image-generator, ai-inference
   - Include: CORS headers, JWT validation, error handling patterns

4. **Integrate Supabase Branching in @devops workflow**
   - Update: `.sinapse-ai/development/agents/devops.md`
   - Add commands: `*preview-branch` (create for PR), `*staging-branch` (persistent)
   - Workflow: PR -> auto-create preview branch -> apply migrations -> test -> merge -> cleanup

5. **Add supply chain security**
   - New hook: `.claude/hooks/dependency-audit.cjs` -- run `npm audit --audit-level=high` before push
   - Add to pre-push gate: reject if critical/high vulnerabilities found
   - Generate SBOM: `npx @cyclonedx/cyclonedx-npm --output-file sbom.json`
   - Slopsquatting prevention: verify all new dependencies exist in npm registry (20% of AI-suggested packages are fabricated)

6. **Add FinOps awareness to infrastructure decisions**
   - New file: `squads/squad-development/knowledge-base/cloud-cost-patterns.md`
   - Decision matrix: Vercel (startups, <$200/mo) vs AWS/GCP (scale, $1K+/mo) vs Cloudflare (edge-first, zero egress)
   - Supabase pricing tiers and when to upgrade
   - GPU cost awareness: H100 prices dropped 64% in 2025, use spot instances

### Impact
- Security: Prevents data breaches like the 170+ Lovable apps exposed in 2025
- Performance: 95%+ improvement in RLS query performance with proper optimization
- Compliance: LGPD-ready from first migration

---

## 6. Skills & Swarm Patterns

### Current State
SINAPSE has 20+ squads with specialized agents and knowledge bases. Squads are distributed as local files. No skill marketplace presence. No cross-platform distribution. Agent Skills format (SKILL.md) is the de facto standard across 33 platforms.

### Gaps

| Gap | Impact |
|-----|--------|
| No SKILL.md format adoption | Cannot distribute to 33+ platforms |
| No skills marketplace presence | Zero visibility in officialskills.sh ecosystem |
| No progressive disclosure in agent loading | Full agent persona loaded always (~3-5K tokens each) |
| Squads not exportable standalone | Requires full SINAPSE install |
| No swarm orchestration patterns | Can't parallelize multi-agent work efficiently |
| No worktree-based parallelism | Single branch, serial execution |

### Recommendations

1. **Export squads as Agent Skills (SKILL.md)**
   - For each squad, create: `squads/{squad}/SKILL.md`
   - Format per agentskills.io spec:
     ```yaml
     ---
     name: sinapse-{squad}-{capability}
     description: >
       [What it does]. [When to use -- be pushy].
       Use when: [explicit trigger keywords].
     license: UNLICENSED
     compatibility: Requires SINAPSE for full features. Works standalone for basics.
     metadata:
       author: sinapse-ai
       version: "1.0"
       squad: "{squad-name}"
     ---
     ```
   - Priority squads for export: research (deep-research, competitive-analysis), development (story-creation, qa-gate), brand (brand-audit)

2. **Create sinapse-ai/skills public repository**
   - Structure: One directory per skill, `marketplace.json` at root
   - Plugin packs: One plugin per squad (e.g., `research-skills@sinapse-marketplace`)
   - Register on officialskills.sh directory
   - Test cross-platform: Claude Code, Codex, Gemini CLI, Cursor

3. **Implement Git Worktree parallelism (from AIOX)**
   - New feature for @devops: `*create-worktree {branch-name}`
   - Enables parallel agent work on different branches simultaneously
   - Each worktree gets isolated context (no git conflicts)
   - Merge back via `*merge-worktree`
   - Critical for: parallel story implementation, QA while dev continues

4. **Adopt subagent-driven development pattern (from Superpowers)**
   - For complex features: main agent creates plan, spawns subagent per task
   - Each subagent works in isolated context with clean window
   - Subagent condenses findings to 1,000-2,000 token summary
   - Main agent coordinates and integrates
   - Implementation: extend `@developer` with `*parallel-tasks` command

5. **Build meta-skill `sinapse-methodology`**
   - Equivalent to `obra/superpowers` (134K stars)
   - Single SKILL.md that teaches the SINAPSE methodology
   - Content: Constitution summary, SDC workflow, delegation matrix, quality gates
   - Works standalone in any Claude Code / Codex / Gemini CLI project
   - Positioning: "Superpowers on steroids" -- not just skills, but orchestrated system

6. **Swarm orchestration patterns for multi-story delivery**
   - Pattern 1: **Pipeline** -- sequential stages (SDC already does this)
   - Pattern 2: **Fan-out/Fan-in** -- parallel stories, merge at epic level
   - Pattern 3: **Stigmergy** -- agents communicate via shared artifacts (scratchpad)
   - Pattern 4: **Hierarchical** -- orchestrator delegates to squad leads, who delegate to specialists
   - Implement stigmergy first: `.sinapse/scratchpad/{story-id}/{agent-id}.md` (already in handoff protocol, needs enforcement)

### Impact
- Distribution: Access to ecosystem of 33 platforms and 1,060+ skills
- Parallelism: 2-3x throughput for multi-story epics with worktrees
- Visibility: Positioning alongside Superpowers (134K stars) and Anthropic official skills (110K stars)

---

## 7. Legal & Compliance

### Current State
SINAPSE has LGPD compliance checklist in security rule with 7 compliance blockers (Tier 2 of 25 deployment blockers). Legal research covers comprehensive Brazilian law including LGPD, CDC, Marco Civil, and emerging AI regulation.

### Gaps

| Gap | Impact |
|-----|--------|
| No LGPD implementation templates | Consent forms, privacy policies not templated |
| No AI regulation awareness (PL 2338/2023) | Marco Legal da IA in legislative pipeline |
| No contract templates for SaaS/clients | Terms of Service, Privacy Policy not standardized |
| No DPO/Encarregado workflow | Art. 41 compliance not operationalized |
| No breach notification procedure | 3-day ANPD notification requirement not automated |
| ANPD now full regulatory agency (Lei 15.352/2026) | Enforcement will increase significantly |

### Recommendations

1. **Create LGPD compliance templates**
   - New directory: `.sinapse-ai/development/templates/legal/`
   - Templates: `privacy-policy.md`, `terms-of-service.md`, `consent-form.md`, `dpo-designation.md`
   - Parameterized with project name, company, data types collected
   - Portuguese (required by law) + English versions

2. **Add AI regulation monitoring**
   - Track: PL 2338/2023 (Marco Legal da IA) -- approved Senate Dec 2024, pending Camara
   - Key provisions: risk classification (unacceptable/high/low), impact assessment obligations, transparency requirements
   - Add to security rule: AI-specific compliance check when deploying AI-powered features
   - Resolucao CNJ 615/2025: Politica de IA no Judiciario (relevant for legal tech clients)

3. **Create breach notification procedure**
   - New template: `.sinapse-ai/development/templates/security/breach-notification-procedure.md`
   - Timeline: detect -> classify (72h for ANPD, 48h for affected users)
   - ANPD form template pre-filled
   - Automated alert via webhook when security events detected
   - LGPD Resolucao 15 compliance

4. **Intellectual property documentation for AI-generated code**
   - Template: `IP-assignment-clause.md` for contracts
   - Cover: ownership of AI-generated code, client vs developer rights
   - Based on: Art. 7 Lei 9.610/98 (Copyright) and emerging AI authorship case law
   - Critical for: Astro Brand Studio client contracts, Colegio Modulo deliverables

### Impact
- Compliance: Full LGPD readiness for all SINAPSE-generated projects
- Legal protection: Contract templates prevent IP disputes
- Future-proofing: AI regulation preparedness before Marco Legal da IA takes effect

---

## 8. Priority Implementation Matrix

### CRITICAL (Do First -- High Impact, Low-Medium Effort)

| # | Action | Source | Effort | Impact |
|---|--------|--------|--------|--------|
| C1 | Slim CLAUDE.md to <150 lines, move rest to Skills/Rules | Token Economy | 1-2 days | 30-50% token savings per request |
| C2 | Add `paths:` frontmatter to non-universal rules | Token Economy | 1 day | 3,000-5,000 tokens saved per message |
| C3 | Generate AGENTS.md as universal compatibility layer | Multi-LLM, Skills | 2-3 days | 24+ tool compatibility |
| C4 | Add RLS performance patterns to security rule | Infrastructure | 0.5 day | 95% query performance improvement |
| C5 | Implement anti-hallucination directives in agent defs | Hallucinations | 1 day | 36% error reduction |
| C6 | Add slopsquatting prevention hook (verify packages) | Hallucinations | 1 day | Blocks 20% fabricated package installs |

### HIGH (Do Next -- High Impact, Medium Effort)

| # | Action | Source | Effort | Impact |
|---|--------|--------|--------|--------|
| H1 | Export top 5 squads as SKILL.md format | Skills Ecosystem | 3-5 days | Access to 33 platforms |
| H2 | Implement Gotchas memory system | AIOX Analysis | 3-4 days | Auto-capture repeated errors |
| H3 | Migrate to `@sinapse-ai/core` scoped package | NPM Publishing | 1-2 days | Professional distribution |
| H4 | Implement OIDC token-free publishing via GitHub Actions | NPM Publishing | 1-2 days | Zero-touch, zero-secret publishing |
| H5 | Add changesets for versioning | NPM Publishing | 1 day | Automated changelogs |
| H6 | Create Supabase schema templates (SaaS, Fintech) | Infrastructure | 2-3 days | Production-ready schemas from day 1 |
| H7 | Add architecture decision tree to knowledge base | Software Engineering | 1-2 days | Correct architecture from start |
| H8 | Upgrade installer with @clack/prompts + multi-IDE target | Multi-LLM | 3-5 days | Better UX, multi-platform support |
| H9 | Create `sinapse-methodology` meta-skill | Skills Ecosystem | 2-3 days | Standalone SINAPSE methodology |

### MEDIUM (Do Later -- Medium Impact, Various Effort)

| # | Action | Source | Effort | Impact |
|---|--------|--------|--------|--------|
| M1 | Build transpiler for Gemini `.gemini/agents/`, Cursor `.cursor/rules/`, Copilot `.github/agents/` | Multi-LLM | 1-2 weeks | Full multi-IDE support |
| M2 | Implement session-digest in PreCompact hook | AIOX Analysis | 2-3 days | Knowledge preservation across sessions |
| M3 | Create `sinapse-ai/skills` public repository + marketplace | Skills Ecosystem | 3-5 days | Marketplace presence |
| M4 | Add Git Worktree parallelism to @devops | Skills/Swarm | 3-5 days | 2-3x multi-story throughput |
| M5 | Create LGPD compliance templates | Legal | 2-3 days | Legal readiness for all projects |
| M6 | Add Edge Functions template library | Infrastructure | 2-3 days | Faster Supabase development |
| M7 | Implement attention scoring for memory (HOT/WARM/COLD) | AIOX Analysis | 1-2 weeks | Smart memory retrieval |
| M8 | Add testing strategy knowledge base | Software Engineering | 1-2 days | Consistent test quality |
| M9 | Create scaffolding templates (modular monolith, next-app) | Software Engineering | 1 week | Fast project setup |
| M10 | Implement crash detection and recovery | AIOX Analysis | 2-3 days | Session resilience |
| M11 | Add supply chain security (SBOM, dependency audit) | Infrastructure | 1-2 days | Prevent supply chain attacks |
| M12 | Implement subagent-driven development pattern | Skills/Swarm | 1 week | Parallel task execution |
| M13 | Add FinOps awareness knowledge base | Infrastructure | 1-2 days | Cloud cost optimization |
| M14 | Create breach notification procedure template | Legal | 1 day | LGPD Art. 48 compliance |

### Summary Metrics

| Priority | Items | Total Effort | Combined Impact |
|----------|-------|--------------|-----------------|
| CRITICAL | 6 | ~7 days | Foundation: token savings, compatibility, security |
| HIGH | 9 | ~20 days | Growth: distribution, memory, publishing, UX |
| MEDIUM | 14 | ~50 days | Maturity: multi-IDE, legal, advanced patterns |

### Key Competitive Positioning

Based on the comparative analysis across all research:

1. **SINAPSE is the most sophisticated framework in the ecosystem** -- no competitor has Constitution + multi-squad + governance + quality gates + delegation matrix
2. **The gap is distribution** -- Superpowers has 134K stars, Anthropic skills 110K stars, SINAPSE has local-only distribution
3. **AGENTS.md + SKILL.md are the bridges** -- adopting these standards immediately gives access to 33+ platforms without changing internal architecture
4. **Memory and crash recovery are differentiators** -- AIOX has the blueprint but implementation gaps; SINAPSE can leapfrog
5. **Token economy is existential** -- at $6/dev/day average, a framework that multiplies cost 7-15x via subagents won't be adopted; obsessive optimization is required

---

*Research synthesis by Claude Opus 4.6 from 12 research documents totaling ~300,000+ tokens of source material.*
*All recommendations reference specific files to create or modify in the SINAPSE codebase.*
