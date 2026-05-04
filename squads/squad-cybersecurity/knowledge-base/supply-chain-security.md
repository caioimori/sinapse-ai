# Supply Chain Security Reference

## Purpose

Reference for software supply chain security — SLSA framework, Sigstore signing, SBOM generation, dependency scanning, and real-world attack context. Used by Breach (penetration-tester) and Govern (compliance-officer).

---

## The Post-SolarWinds Landscape

The period after SolarWinds (December 2020) and Log4Shell (December 2021) transformed supply chain security from a theoretical concern to a regulatory requirement.

**Key regulatory drivers:**
- **US Executive Order 14028** (May 2021) — mandated SBOM requirements and Zero Trust standards for software sold to the US federal government
- **EO 14144** (January 2025) — added detailed requirements
- **EO 14306** (June 2025) — rescinded parts of 14144 but maintained NIST SP 800-218 (SSDF) guidance
- The private market adopted these standards independently of federal timelines

---

## Real-World Attacks (2025-2026)

| Date | Target | Weekly Downloads | Attack Vector | Impact |
|------|--------|-----------------|---------------|--------|
| Dec 2021 | Log4j (Log4Shell) | Billions | RCE vulnerability in ubiquitous library | Most critical vuln of the decade |
| Sep 2025 | debug, chalk + 16 npm packages | 2.6 billion combined | Maintainer phishing, credential theft | Malicious code injected into popular packages |
| Mar 2026 | Axios | 100M+ | North Korean APT credential theft | Supply chain code execution |

**Log4Shell lesson:** When Log4j was disclosed, most organizations did not know if they used it or where. SBOMs answer that question instantly.

---

## SBOM: Software Bill of Materials

### What It Is

A formal, machine-readable inventory of every software component (libraries, dependencies, versions) in an application. The analogy: just as physical products have ingredient lists, software should have component lists.

### Standard Formats

| Format | Owner | Best For |
|--------|-------|---------|
| **SPDX** | Linux Foundation | Broad ecosystem, NTIA-compliant |
| **CycloneDX** | OWASP | Security-focused, vulnerability correlations |
| **SWID** | ISO/IEC 19770 | Enterprise software asset management |

### Generation Tools

| Tool | Language/Ecosystem | Output |
|------|-------------------|--------|
| **Syft** (Anchore) | Multi-language, containers | SPDX, CycloneDX |
| **CycloneDX CLI** | Multi-language | CycloneDX |
| **grype** (Anchore) | Multi-language | Vulnerability scanner against SBOM |
| **cosign** | Containers | Sign and verify SBOM artifacts |
| **trivy** | Containers, filesystems | SBOM + vulnerability scanning |
| **jake** | Python | pip/conda SBOMs |

### SBOM Workflow in CI/CD

```yaml
# GitHub Actions — generate SBOM on every release
- name: Generate SBOM
  uses: anchore/sbom-action@v0
  with:
    format: 'spdx-json'
    output-file: 'sbom.spdx.json'

- name: Scan SBOM for vulnerabilities
  uses: anchore/scan-action@v3
  with:
    sbom: 'sbom.spdx.json'
    fail-build: 'true'
    severity-cutoff: 'high'
```

### When a CVE Drops: SBOM Value

Without SBOM — manual audit of hundreds of repos, hours or days to determine exposure.
With SBOM — query: `grep "log4j" */sbom.spdx.json` — instantly know every affected app.

---

## SLSA: Supply-chain Levels for Software Artifacts

### What It Is

Framework created by Google's security team, now under OpenSSF (Open Source Security Foundation). Defines incremental levels of guarantee about how a software artifact was built.

SLSA 1.0 finalized in 2023. Considered baseline for serious supply chain security as of 2025.

### The Four Levels

| Level | Requirements | Guarantees | Achieved By |
|-------|-------------|-----------|-------------|
| **SLSA 1** | Build process documented | Minimal — easy starting point | Documentation + any CI |
| **SLSA 2** | Build by hosted CI service, provenance generated | Build provenance available | GitHub Actions, Google Cloud Build |
| **SLSA 3** | Isolated build environment, unforgeable provenance, traceable deps | Hard to tamper with build | GitHub Actions with SLSA generator |
| **SLSA 4** | Hermetic, reproducible build, two-person review | Highest assurance | Advanced build systems |

### SLSA in GitHub Actions

```yaml
# Generate SLSA provenance automatically with GitHub Actions
- name: Generate SLSA Provenance
  uses: slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@v1
  with:
    base64-subjects: "${{ needs.build.outputs.hashes }}"
```

### Verification

```bash
# Verify artifact provenance
slsa-verifier verify-artifact my-binary \
  --provenance-path provenance.intoto.jsonl \
  --source-uri github.com/my-org/my-repo \
  --source-tag v1.0.0
```

---

## Sigstore: Keyless Code Signing

### What It Is

An OpenSSF project that simplifies digital signing of software using OIDC identity instead of long-lived private keys. Components:

| Component | Function |
|-----------|----------|
| **Cosign** | CLI to sign/verify containers and other artifacts |
| **Fulcio** | Certificate Authority — issues short-lived certificates for signatures |
| **Rekor** | Immutable transparency log — records all signatures |

### Why Keyless Signing Matters

Traditional signing problems:
- Private keys can leak, be stolen, or get lost
- Key management is operationally complex
- Revoking a compromised key is difficult

Sigstore solution:
1. Developer authenticates via OIDC (GitHub, Google, Microsoft identity)
2. Fulcio issues a certificate valid for 10 minutes
3. Cosign uses the certificate to sign the artifact
4. Signature is recorded in Rekor (immutable, public transparency log)
5. Certificate expires — no long-lived key to steal

### Signing Containers

```bash
# Sign a container image
cosign sign --key cosign.key gcr.io/my-project/my-image:v1.0.0

# Keyless signing (uses OIDC identity from CI environment)
cosign sign gcr.io/my-project/my-image:v1.0.0

# Verify a signature
cosign verify \
  --certificate-identity user@example.com \
  --certificate-oidc-issuer https://accounts.google.com \
  gcr.io/my-project/my-image:v1.0.0
```

### Adoption Status (2025)

- Standard in Kubernetes release builds
- Standard in many CNCF projects
- GitHub Container Registry supports automatic Sigstore signing
- npm and PyPI adding signing support

---

## Dependency Scanning Tools

### SAST (Static Analysis Security Testing)

| Tool | Strengths | Free Tier |
|------|-----------|-----------|
| **Snyk Code** | 19+ languages, AI fix suggestions, IDE integration | Yes |
| **Semgrep** | Custom rule writing, pattern matching, fast | Yes |
| **SonarQube** | Comprehensive, CI/CD integration | Community edition |
| **GitHub Advanced Security (GHAS)** | Integrated with GitHub workflow (CodeQL) | For public repos |

### SCA (Software Composition Analysis)

| Tool | Strengths | Free Tier |
|------|-----------|-----------|
| **Snyk Open Source** | Largest vulnerability database | Yes |
| **GitHub Dependabot** | Native GitHub integration, auto-PRs | Yes |
| **Grype** (Anchore) | Fast, integrates with Syft/SBOM | Yes |
| **Trivy** | All-in-one: containers + filesystem + SBOM | Yes |
| **OWASP Dependency-Check** | Widely used, good for enterprise | Yes |

### Secret Scanning

```bash
# Detect secrets in code before commit
npx gitleaks detect

# GitHub native — enable in repository settings
# Settings > Code security > Secret scanning > Enable

# Pre-commit hook with git-secrets
git secrets --install
git secrets --register-aws
```

---

## Dependency Management Best Practices

### Lockfile Discipline

```bash
# In CI, always use lockfile-enforcing commands
npm ci          # NOT npm install
pip install --require-hashes -r requirements.txt
poetry install --no-root

# Commit lockfiles to version control
# package-lock.json, yarn.lock, Pipfile.lock — always commit
```

### Version Pinning Strategy

```json
// package.json — exact versions, no caret or tilde
{
  "dependencies": {
    "axios": "1.7.2",       // exact — NOT "^1.7.2"
    "express": "4.18.2"     // exact — NOT "~4.18.2"
  }
}
```

**7-Day Cooldown Rule:** Do not immediately adopt newly published package versions. Malicious packages are often detected within 48-72 hours. Waiting 7 days before updating significantly reduces supply chain risk.

### Automated Updates with Review

```yaml
# .github/dependabot.yml — automated dependency updates with human review
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      production-dependencies:
        dependency-type: "production"
      development-dependencies:
        dependency-type: "development"
```

### Private Registry Mirror

For high-security environments, mirror public packages through a private registry:
- **Artifactory** — enterprise-grade with vulnerability scanning
- **Verdaccio** — open source npm proxy/registry
- **AWS CodeArtifact** — managed, integrates with IAM
- This approach allows inspection/approval before packages reach developers

---

## Secure CI/CD Pipeline

### Hardening Checklist

```
[ ] Secrets stored in vault or CI secrets manager — never in code
[ ] Branch protection on main — no direct pushes
[ ] Required code reviews before merge
[ ] Signed commits (git commit -S)
[ ] Signed container images (Cosign)
[ ] SBOM generated and stored with every release
[ ] Dependency scanning (SCA) in every PR
[ ] SAST scanning in every PR
[ ] Secret scanning enabled (GitHub, GitLab)
[ ] Audit logs for all pipeline runs
[ ] Least privilege for CI service accounts
[ ] SLSA Level 2+ provenance for releases
```

### GitHub Actions Security

```yaml
# Minimal permissions for workflow
permissions:
  contents: read      # Only what's needed
  security-events: write  # For uploading security results

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # Pin actions to specific commit SHA, not tag
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
      
      # Never: actions/checkout@v4 (tag can be moved)
```

---

## Sources

- NIST SP 800-218 (SSDF): https://csrc.nist.gov/publications/detail/sp/800-218/final
- OpenSSF SLSA: https://slsa.dev/
- Sigstore: https://sigstore.dev/
- CISA Software Supply Chain Security: https://www.cisa.gov/software-supply-chain-security
- Anchore SBOMs 2025: https://anchore.com/blog/software-supply-chain-security-in-2025-sboms-take-center-stage/
- OWASP Dependency-Check: https://owasp.org/www-project-dependency-check/
