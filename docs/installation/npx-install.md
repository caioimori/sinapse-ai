# Using npx

`npx` runs the public package without requiring a permanent global installation.

```bash
cd /path/to/project
npx sinapse-ai@latest install
```

Always include `@latest` for installation and update operations so an older npx
cache entry does not silently select stale framework code.

## Fresh and existing projects

The same command supports both. The installer detects existing managed state,
preserves project-owned content, and reuses a saved provider choice.

```bash
# Change provider selection intentionally
npx sinapse-ai@latest install --reconfigure

# Refresh only managed surfaces intentionally
npx sinapse-ai@latest install --force
```

Do not run installation from a home directory or npm's temporary package cache.
The current working directory is the target project.

## Deterministic reproduction

For a bug reproduction, replace `latest` with an exact published version:

```bash
npx sinapse-ai@1.27.0 install
```

Use exact versions only for diagnostics or controlled CI. Normal users should
return to `@latest` after reproducing the issue.
