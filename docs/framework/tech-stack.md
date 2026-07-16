# SINAPSE Technology Stack

> **English** | [Português](../pt/framework/tech-stack.md)

This document describes the technology that is present in the repository. The
authoritative versions are `package.json`, `package-lock.json`, and the pinned
GitHub Actions workflows. Proposed technologies belong in an RFC, not in this
inventory.

## Runtime contract

| Surface | Current contract |
|---|---|
| Runtime | Node.js 18 or newer |
| Package manager | npm 9 or newer; canonical lockfile is `package-lock.json` |
| Module system | CommonJS package with declared types and package exports |
| Platforms | Windows, macOS, and Linux |
| Public package | `sinapse-ai` on npm |
| Primary entrypoint | `npx sinapse-ai@latest install` |

CI exercises Node.js 18, 20, 22, and 24 where compatibility coverage is
required. Node.js 20 is used by several deterministic validation jobs. The
package `engines` field remains the source of truth for the supported minimum.

## Production dependencies

The runtime is intentionally CLI-oriented:

| Capability | Packages |
|---|---|
| CLI and prompts | `commander`, `@clack/prompts`, `inquirer`, `ora`, `chalk`, `cli-progress` |
| Files and processes | `fs-extra`, `fast-glob`, `chokidar`, `cross-spawn`, `execa`, `proper-lockfile`, `tar` |
| Structured data | `yaml`, `js-yaml`, `ajv`, `ajv-formats`, `handlebars` |
| Versioning and comparison | `semver`, `diff` |
| Terminal output | `asciichart` |

Exact semver ranges are deliberately not duplicated here. Inspect them with:

```bash
node -e "const p=require('./package.json'); console.log(p.dependencies)"
npm ls --depth=0
```

## Engineering toolchain

| Concern | Tooling |
|---|---|
| Tests and coverage | Jest 30 |
| Static analysis | ESLint 9 with `eslint.config.js` |
| Type checking | TypeScript 5 in `--noEmit` mode |
| Formatting | Prettier 3 |
| Local gates | Husky and lint-staged |
| Release notes and publication | semantic-release with npm and GitHub plugins |
| CI and security | GitHub Actions, CodeQL, secret scanning, constitutional gates |

The release process is intentionally split: release preparation opens a pull
request, and publication runs only after protected approval. See the
[release process](../guides/release-process.md).

## Architecture boundaries

- L1 core is immutable.
- L2 templates and infrastructure are extend-only.
- L3 configuration is mutable with guardrails.
- L4 project stories, packages, squads, and tests are project-owned.
- Claude Code and Codex adapters resolve the same canonical definitions.
- The CLI owns behavior; dashboards may observe but do not control it.

## Verification

Use repository commands instead of undocumented performance or bundle-size
claims:

```bash
npm ci --ignore-scripts
npm run lint
npm run typecheck
npm test
npm run validate:parity
npm pack --dry-run
npm audit --omit=dev
```

Do not run automatic dependency rewrites as a default remediation. Review the
dependency path, update deliberately, run the relevant matrix, and preserve the
lockfile evidence.

Last verified against the repository on 2026-07-16.
