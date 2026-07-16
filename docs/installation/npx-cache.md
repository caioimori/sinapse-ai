# npx Cache

If npm has just published a release but `npx` appears to execute older code,
compare the registry and local output:

```bash
npm view sinapse-ai version
npx sinapse-ai@latest status
```

Then retry with a clean temporary cache.

macOS or Linux:

```bash
npm cache verify
npm_config_cache="$(mktemp -d)" npx --yes sinapse-ai@latest status
```

Windows PowerShell:

```powershell
npm cache verify
$env:npm_config_cache = Join-Path ([IO.Path]::GetTempPath()) "sinapse-npx-$([guid]::NewGuid())"
npx --yes sinapse-ai@latest status
Remove-Item Env:npm_config_cache
```

For a deterministic reproduction, use the exact published version:

```bash
npx sinapse-ai@1.27.0 status
```

Do not delete the entire npm cache as a first response. Registry propagation,
corporate proxies, and stale lockfiles can look like a local cache problem.
Capture `npm config get registry`, the exact command, and diagnostic output when
opening a support request.
