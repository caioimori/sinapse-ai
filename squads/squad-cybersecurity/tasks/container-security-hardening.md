---
task: container-security-hardening
responsavel: "cloud-security-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: container_platform
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["Docker", "Kubernetes", "ECS", "AKS", "GKE", "multi-platform"]
  - campo: current_setup
    tipo: text
    origem: "user input"
    obrigatorio: true

Saida:
  - campo: container_hardening_plan
    tipo: document
    destino: "dev team, devops, stakeholders"

Checklist:
  - "[ ] Assess current container security baseline"
  - "[ ] Review image build pipeline security"
  - "[ ] Evaluate runtime security controls"
  - "[ ] Assess orchestrator configuration"
  - "[ ] Review network policies"
  - "[ ] Check secrets management"
  - "[ ] Validate supply chain security"
  - "[ ] Produce hardening implementation plan"
---

# Task: Container Security Hardening

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Nimbus (cloud-security-engineer)
- **Complexity:** Complex

## Objective

Assess and harden container infrastructure security across the build, deploy, and runtime phases. Cover image security, orchestrator configuration, network policies, secrets management, runtime protection, and supply chain integrity for Docker, Kubernetes, and managed container services.

> **DEFENSIVE HARDENING:** This task focuses on strengthening container security through configuration improvements and best practices. All assessments use authorized access only.

## Pre-Conditions

- Access to container platform (read access minimum)
- Understanding of current container architecture
- Knowledge of deployed workloads
- Container security baseline (CIS Docker/Kubernetes Benchmark)

## Inputs

- Container platform (Docker, Kubernetes, ECS, AKS, GKE)
- Current container setup description
- Dockerfiles and container manifests (if available)
- CI/CD pipeline configuration
- Current security controls in place

## Steps

### 1. Assess Current Security Baseline
Evaluate against CIS Benchmarks:
| Category | CIS Control | Status | Priority |
|----------|------------|--------|----------|
| Host configuration | Docker daemon hardening | | |
| Image configuration | Trusted base images | | |
| Runtime configuration | Container privileges | | |
| Orchestrator | K8s API security | | |
| Network | Network policies | | |
| Secrets | Secret management | | |

### 2. Image Build Security
Harden the image build pipeline:
- Use minimal base images (distroless, Alpine)
- Pin image versions (no :latest in production)
- Scan images for vulnerabilities (Trivy, Snyk, Grype)
- Implement multi-stage builds to reduce attack surface
- Remove unnecessary packages and tools
- Set non-root USER directive
- Add HEALTHCHECK directive
- Sign images (Cosign, Notary)

### 3. Image Supply Chain Security
Verify image provenance:
- Trusted base image registry
- Image signing and verification
- SBOM generation for container images
- Vulnerability scanning in CI/CD pipeline
- Admission controllers to block unsigned/unscanned images
- Private registry configuration and access control

### 4. Runtime Security Configuration
Harden container runtime:
| Control | Description | Implementation |
|---------|-----------|---------------|
| Read-only root filesystem | Prevent runtime modifications | `readOnlyRootFilesystem: true` |
| No privilege escalation | Block setuid/setgid | `allowPrivilegeEscalation: false` |
| Drop capabilities | Remove unneeded Linux capabilities | `drop: [ALL]` |
| Non-root user | Run as non-root | `runAsNonRoot: true` |
| Resource limits | Prevent resource abuse | CPU/memory limits |
| Seccomp profiles | Restrict syscalls | Default or custom profile |
| AppArmor/SELinux | Mandatory access control | Enforce profiles |

### 5. Kubernetes Security (if applicable)
Harden orchestrator configuration:
- API server authentication and authorization (RBAC)
- Admission controllers (PodSecurity, OPA/Gatekeeper)
- etcd encryption at rest
- Audit logging enabled
- Node authorization
- Service account token management
- Pod Security Standards enforcement

### 6. Network Policies
Implement network segmentation:
- Default deny all ingress/egress
- Allow only required communication paths
- Isolate namespaces
- Restrict pod-to-pod communication
- Egress control for internet access
- Service mesh security (mTLS)

### 7. Secrets Management
Secure sensitive data:
- No secrets in Dockerfiles or images
- External secrets management (Vault, AWS Secrets Manager)
- Encrypted secrets at rest (K8s secrets encryption)
- Secret rotation automation
- Access control for secrets
- Audit logging for secret access

### 8. Monitoring and Detection
Implement runtime security monitoring:
- Container behavior monitoring (Falco, Sysdig)
- Image drift detection
- Anomalous process execution alerting
- Network anomaly detection
- File integrity monitoring
- Container escape attempt detection

### 9. CI/CD Pipeline Security
Secure the container deployment pipeline:
- Pipeline access control
- Image scanning gates (block critical CVEs)
- Policy-as-code enforcement
- Deployment approval workflows
- Rollback procedures
- Artifact integrity verification

### 10. Produce Hardening Implementation Plan
Compile findings into a phased implementation plan prioritized by risk and effort.

## Output

```yaml
container_hardening_plan:
  platform: ""
  date: ""
  author: "Nimbus (cloud-security-engineer)"

  baseline_assessment:
    cis_compliance: ""
    critical_findings: 0
    high_findings: 0

  hardening_actions:
    - category: ""
      action: ""
      priority: "[P1/P2/P3]"
      effort: "[low/medium/high]"
      implementation: ""
      verification: ""

  phases:
    phase_1_immediate:
      actions: []
      timeline: ""
    phase_2_short_term:
      actions: []
      timeline: ""
    phase_3_long_term:
      actions: []
      timeline: ""
```

## Quality Criteria

- [ ] CIS Benchmark assessment completed
- [ ] Image build security reviewed
- [ ] Supply chain integrity controls assessed
- [ ] Runtime security configuration evaluated
- [ ] Network policies reviewed or recommended
- [ ] Secrets management assessed
- [ ] Implementation plan phased by priority
- [ ] Hardening actions include verification steps
