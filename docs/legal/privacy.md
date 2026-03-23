# Privacy Policy

**Last updated:** 2025-12-08

> 🇧🇷 [Versão em Português](PRIVACY-PT.md)

## Overview

SINAPSE (AI-Orchestrated System) is an open-source project maintained by SynkraAI Inc. This privacy policy explains how we handle any data that may be collected when you use SINAPSE.

## Data Collection

### What We Don't Collect

SINAPSE does **NOT** collect:

- Personal identification information
- Usage analytics or telemetry data
- Code or project content from your repositories
- API keys or credentials
- Browsing history or tracking data

### What May Be Collected (Consent-Based)

SINAPSE uses a **consent-based telemetry system**. The system is designed as follows:

- **Consent Manager**: A consent management component is initialized by default to handle user preferences
- **No automatic collection**: No data is collected until you explicitly grant consent
- **Default state**: All telemetry consents default to "not granted" (`null` or `false`)
- **Interactive consent**: You will be prompted to grant or deny consent for specific features

If you grant consent, the following may be collected:

- Anonymous crash reports (no personally identifiable information)
- Anonymous usage statistics (feature usage patterns only)
- Performance metrics (anonymized)
- Error reports (for stability improvements)

**To completely disable the consent manager**, set `telemetry.enabled: false` in your configuration:

```javascript
const sinapse = new SINAPSE({
  telemetry: { enabled: false },
});
```

You can also revoke consent at any time through the consent management interface or by deleting the `.sinapse/telemetry/` directory.

## Local Data Storage

SINAPSE stores some data locally on your machine:

- Configuration files (`.sinapse/`, `.sinapse-ai/`)
- Project status cache (`.sinapse/project-status.yaml`)
- Decision logs (`.ai/` directory)
- Story files and documentation

This data never leaves your local machine unless you explicitly share it (e.g., by pushing to a Git repository).

## Third-Party Services

When using SINAPSE, you may interact with third-party services:

| Service          | Purpose                                   | Privacy Policy                                                                                     |
| ---------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **GitHub**       | Repository hosting, issue tracking        | [GitHub Privacy](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement) |
| **npm**          | Package distribution                      | [npm Privacy](https://docs.npmjs.com/policies/privacy)                                             |
| **AI Providers** | Claude, OpenAI, etc. (configured by user) | See respective provider policies                                                                   |
| **MCP Servers**  | Tool integrations (user-configured)       | Varies by server                                                                                   |

**Important:** Your interactions with these services are governed by their respective privacy policies. SINAPSE does not control or have access to data you share with these services.

## Your Rights

You have the right to:

- **Opt-out** of any data collection at any time
- **Delete** all local data by removing the `.sinapse/` and `.ai/` directories
- **Inspect** all stored data (it's stored in plain text/YAML format)
- **Request information** about any data collected (if telemetry is enabled)

## Open Source Transparency

As an open-source project, all code is publicly available for inspection:

- Repository: [github.com/SynkraAI/sinapse-ai](https://github.com/SynkraAI/sinapse-ai)
- No hidden data collection mechanisms
- All configuration options are documented

## Children's Privacy

SINAPSE is a development tool intended for professional use. We do not knowingly collect any information from children under 13 years of age.

## Security

We take security seriously:

- No sensitive data transmission by default
- Local-first architecture
- API keys and credentials are never stored by SINAPSE (users manage their own)
- Regular security audits of the codebase

For security vulnerabilities, please [open an issue](https://github.com/SynkraAI/sinapse-ai/issues) or email security@SynkraAI.com.

## Contact

For privacy concerns or questions:

- **GitHub Issues:** [Open an issue](https://github.com/SynkraAI/sinapse-ai/issues)
- **Email:** privacy@SynkraAI.com
- **Discord:** [Community Server](https://discord.gg/gk8jAdXWmj)

## Changes to This Policy

We will update this policy as needed. Changes will be:

- Documented in the [CHANGELOG](CHANGELOG.md)
- Reflected in the "Last updated" date above
- Announced in major releases if significant

## Attribution

This privacy policy is adapted from open-source privacy policy templates and follows best practices for open-source projects.

---

**Copyright (c) 2025 SynkraAI Inc.**
