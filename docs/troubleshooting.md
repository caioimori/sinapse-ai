# Troubleshooting

The maintained troubleshooting contract lives in
[Installation troubleshooting](installation/troubleshooting.md).

Start from the project root:

```bash
node --version
npm --version
npm config get registry
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Do not use `sudo`, pipe remote scripts into a shell, or delete the complete
managed tree as a first response. Preserve the project, inspect `git status`,
and include redacted diagnostics when opening a support request.
