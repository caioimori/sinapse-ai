# Support

Use the channel that matches the request so maintainers can respond with the
right context and without exposing sensitive data.

| Need | Channel |
|---|---|
| Setup, usage, or design question | [GitHub Discussions](https://github.com/caioimori/sinapse-ai/discussions/categories/q-a) |
| Reproducible framework bug | [Bug report](https://github.com/caioimori/sinapse-ai/issues/new?template=1-bug-report.yml) |
| Product proposal | [Feature request](https://github.com/caioimori/sinapse-ai/issues/new?template=2-feature-request.yml) |
| Security vulnerability | [Private vulnerability report](https://github.com/caioimori/sinapse-ai/security/advisories/new) |
| Community conduct incident | Follow the private path in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |

Before opening a request, use the current package and collect diagnostics:

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
node --version
npm --version
```

Include the operating system, provider (`claude-code`, `codex`, or both), exact
command, complete error text, expected behavior, and a minimal reproduction.
Replace usernames, tokens, customer data, and private paths with placeholders.

## Support boundaries

Community support covers the open-source framework, installer, updater, native
provider adapters, and public documentation. It does not guarantee debugging of
private application code, third-party CLI incidents, model output quality, or
production infrastructure.

Response time is best effort. Security reports follow the targets in
[SECURITY.md](SECURITY.md); public issues and discussions do not carry an SLA.

## Self-service paths

- [Getting started](docs/getting-started.md)
- [Installation and updates](docs/installation/README.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Provider integration](docs/guides/ide-integration.md)
- [Agent reference](docs/agent-reference-guide.md)
