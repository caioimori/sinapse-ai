# Release Process

SINAPSE AI has one release writer: the `Semantic Release` GitHub Actions
workflow. Legacy tag-driven publishers are archived and must not be re-enabled
without a governance decision.

## Preconditions

- Release changes are merged to protected `main` through a pull request.
- Required checks and CODEOWNERS review are complete.
- The package passes release readiness, provider parity, and isolated install
  validation.
- npm and GitHub credentials are available only to the protected release job.
- The DevOps maintainer explicitly authorizes the run.

## Versioning

The workflow derives SemVer from Conventional Commit titles:

| Commit | Version impact |
|---|---|
| `fix:` | patch |
| `feat:` | minor |
| `type!:` or `BREAKING CHANGE:` | major |
| `docs:`, `test:`, `chore:` | no release by default |

Do not edit `package.json` version or create tags manually in a normal change.
The release-preparation workflow owns version and changelog updates. The
publication workflow owns npm publication, tag creation, and GitHub Release
notes.

## Execution

1. DevOps reviews `main`, recent commits, open security alerts, and npm state.
2. Dispatch `Release Preparation` from `main`; it opens a version/changelog PR.
3. Review and merge that PR through the normal protected-branch gates.
4. Dispatch `Semantic Release` from `main` and approve `npm-production`.
5. Confirm npm publication, GitHub tag/release, provenance, and changelog state.
6. Smoke-test `npx sinapse-ai@<version> install` in isolated directories for
   Claude Code, Codex, and the default dual-provider path.
7. Record any exception or rollback in the release notes.

## Failure and rollback

Never overwrite an npm version. If publication partially succeeds, determine
which public artifacts exist before retrying. Correct forward with a new patch
release unless npm support or a verified security procedure requires another
action.

Draft or historical releases are not deleted as routine cleanup. Removing a
public release, tag, or npm version requires explicit approval and an incident
record.
