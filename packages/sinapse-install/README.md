# sinapse-install compatibility package

This workspace package contains internal installer compatibility code. It is not
published as `@sinapse/sinapse-install` and must not be installed directly.

Use the public `sinapse-ai` package from the target project directory:

```bash
npx sinapse-ai@latest install
```

The no-flag path configures Claude Code and Codex for a fresh project. Provider
selection, updates, ownership, and recovery are documented in
[../../docs/installation/README.md](../../docs/installation/README.md).

Contributors changing this package must validate the public CLI, default and
single-provider installation paths, update preservation, manifest contents, and
provider parity. The package directory is an implementation detail; public
documentation and examples must continue to use `sinapse-ai`.
