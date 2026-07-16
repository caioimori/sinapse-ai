# Security Policy

Security reports are handled privately and with the minimum disclosure required
to reproduce, assess, and fix the issue.

## Supported versions

| Release line | Security support |
|---|---|
| Latest version published to the npm `latest` channel | Supported |
| Older releases and prerelease channels | Upgrade required before support |

The current public version is shown on the
[npm package page](https://www.npmjs.com/package/sinapse-ai). Security fixes are
released on the latest stable line; maintainers may backport a fix when the
impact and adoption justify it, but no backport is guaranteed.

## Report a vulnerability

Use
[GitHub Private Vulnerability Reporting](https://github.com/caioimori/sinapse-ai/security/advisories/new).
Do not open a public issue, discussion, or pull request for a vulnerability that
has not been coordinated.

Include, when available:

- affected version, operating system, Node.js version, and provider;
- a minimal reproduction or proof of concept;
- expected and observed behavior;
- impact, attack prerequisites, and affected data;
- suggested remediation or mitigations.

Remove real secrets, personal data, customer data, and destructive payloads from
the report. A redacted reproduction is preferable to production evidence.

## Response targets

| Stage | Target |
|---|---|
| Acknowledgement | 2 business days |
| Initial severity assessment | 5 business days |
| Remediation plan for confirmed critical/high issues | 10 business days |
| Coordinated disclosure | After a fix or mitigation is available |

Targets are not a guarantee. Complexity, upstream dependencies, and reporter
coordination may change the timeline. We will keep the reporter informed when a
confirmed issue exceeds a target.

## Scope

This policy covers:

- the `sinapse-ai` package published on npm;
- this repository and its GitHub Actions;
- the Claude Code and Codex adapters installed by the package;
- the installer, updater, hooks, validators, and generated manifests.

Third-party CLIs, models, package registries, React Bits source code, and user
projects are outside our ownership. Reports showing that SINAPSE exposes or
misconfigures those systems remain in scope.

## Security model

SINAPSE uses defense in depth:

- protected framework layers and conservative file operations;
- secret scanning and dependency review in development workflows;
- story, authority, provider-parity, and release-readiness gates;
- explicit rules for destructive database operations and credential handling;
- isolated installation tests across supported providers and platforms.

Controls reduce risk; they do not make generated code automatically secure.
Users remain responsible for reviewing changes, managing credentials, enabling
database policies, and validating production deployments.

## Safe harbor

We support good-faith security research performed to improve the project. When
you respect privacy, avoid unnecessary disruption, use the private reporting
channel, and give us reasonable time to remediate, we will not pursue action
against you for the research itself.

This safe-harbor statement does not authorize access to third-party data,
service degradation, social engineering, persistence, or destruction.

Last reviewed: 2026-07-16.
