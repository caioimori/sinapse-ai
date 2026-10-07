# Production dependency remediation

Verified locally on 2026-10-02. Scope: dependencies included by `npm audit --omit=dev`; this is not an audit of development dependencies or a guarantee against unknown vulnerabilities.

| Package | Before | After | Change |
| --- | --- | --- | --- |
| js-yaml | 4.3.0 | 4.3.2 | Direct range and matching override raised to ^4.3.2 |
| fast-uri | 3.1.4 | 3.1.8 | Transitive override raised to ^3.1.8 |

Both remain in their existing major versions. `npm view js-yaml@4.3.2 version engines repository dist.integrity --json` and the equivalent command for fast-uri 3.1.8 confirmed published versions, the official nodeca/js-yaml and fastify/fast-uri repositories, and registry integrity digests before installation. Neither package declares an engines restriction in the returned metadata. Project Node requirement remains >=18; execution was verified on Node 24.13.1, not every supported Node release.

The lockfile changed only the root js-yaml requirement and these two package records (versions, registry URLs, integrity values). No additional dependencies or major upgrades were introduced. Installed using `npm update js-yaml fast-uri --ignore-scripts --no-audit --no-fund`.

## Advisory evidence

The before audit reports two vulnerable package entries of high severity. js-yaml: [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj), [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh). fast-uri: [GHSA-7p8r-x3mc-p8w7](https://github.com/advisories/GHSA-7p8r-x3mc-p8w7), [GHSA-5jgf-p345-68v8](https://github.com/advisories/GHSA-5jgf-p345-68v8), [GHSA-f65p-4m7j-42xc](https://github.com/advisories/GHSA-f65p-4m7j-42xc), [GHSA-fph4-wmhf-6fwf](https://github.com/advisories/GHSA-fph4-wmhf-6fwf), [GHSA-jqff-g426-hqxp](https://github.com/advisories/GHSA-jqff-g426-hqxp), [GHSA-qw65-cvwx-89v3](https://github.com/advisories/GHSA-qw65-cvwx-89v3), and moderate [GHSA-hrr3-gc8f-f4qj](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj).

## Verification

- Before: `dependency-audit.json`, two high vulnerable package entries.
- After: `dependency-audit-after.json`, `npm audit --omit=dev --json` exit 0 and zero reported vulnerabilities within that scope.
- `npm run validate:squad-schema:strict`: all 17 squads passed, no warnings or failures.
- `npx --no-install jest tests/scripts/validate-squad-yaml.test.js tests/scripts/validate-story-meta.test.js tests/schemas/validate-schemas.test.js --runInBand`: three suites and 45 tests passed. Exercises existing YAML parsing, story metadata, and AJV schema validation paths.

Changes are local to the framework evolution worktree; no publish, deployment, global installation, or upstream scripts were executed.
