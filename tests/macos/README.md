# macOS validation

This suite validates the package produced by the current commit on native Intel
and Apple Silicon GitHub runners. Installation tests never fetch an unreviewed
`latest` build: they pack the checked-out repository, install that tarball in a
temporary project, and isolate `HOME` and the npm cache.

## CI matrix

| Runner | Architecture | Primary smoke test |
|---|---|---|
| `macos-15-intel` | `x86_64` | `test-intel-installation.sh` |
| `macos-14` | `arm64` | `test-apple-silicon-installation.sh` |

The workflow also checks shell compatibility, paths, line endings, permissions,
package-manager behavior, performance, security, and rollback behavior. See
[macos-testing.yml](../../.github/workflows/macos-testing.yml).

## Run locally

On macOS:

```bash
chmod +x tests/macos/*.sh
tests/macos/run-all-tests.sh
```

Run one acceptance criterion:

```bash
tests/macos/run-all-tests.sh --test AC1
tests/macos/run-all-tests.sh --test AC8
```

The performance test stays local by default. Enable its release-only npm
registry assertion explicitly:

```bash
SINAPSE_VALIDATE_PUBLIC_RELEASE=true tests/macos/test-performance.sh
```

The architecture-specific wrappers fail when executed on the wrong runner. The
master runner skips the incompatible architecture automatically.

## Installation contract

The shared smoke test asserts that the local tarball:

1. installs with npm without lifecycle scripts;
2. completes `sinapse-ai install` in a temporary project;
3. creates Claude Code and Codex integration surfaces;
4. reports its version and help without errors; and
5. does not write into the runner's real home directory.

For public installation and updates, users run:

```bash
npx sinapse-ai@latest install
```

## Evidence

Scripts write timestamped logs under `/tmp/sinapse-test-*.log`. The GitHub
workflow uploads them as artifacts and publishes a compact architecture summary
on pull requests.

For a release candidate, follow the
[manual verification guide](MANUAL-TESTING-GUIDE.md) and attach only redacted
logs to an issue or release record.
