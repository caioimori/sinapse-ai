---
task: "container-security-review"
responsavel: "cloud-security-engineer"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: container_environment
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: dockerfiles
    tipo: list
    origem: "repository"
    obrigatorio: false
  - campo: k8s_manifests
    tipo: list
    origem: "repository"
    obrigatorio: false
Saida:
  - campo: container_security_report
    tipo: document
    destino: "development team, stakeholders"
Checklist:
  - "[ ] Review Dockerfile security (base images, user, secrets)"
  - "[ ] Scan container images for vulnerabilities"
  - "[ ] Review Kubernetes RBAC configuration"
  - "[ ] Check Pod Security Standards enforcement"
  - "[ ] Review network policies"
  - "[ ] Assess secrets management"
  - "[ ] Check admission controllers"
  - "[ ] Review supply chain security"
---

# Container Security Review

## Objective

Assess security of container images, Dockerfiles, Kubernetes configurations, and container runtime settings. Cover the full container lifecycle from build to runtime.

## Inputs

- Container environment description (Docker, Kubernetes, ECS, etc.)
- Dockerfiles and build configurations
- Kubernetes manifests (deployments, services, RBAC, network policies)
- Registry configuration

## Steps

1. **Image security** — Review base images (official, minimal, up-to-date), scan for CVEs, check for hardcoded secrets, verify non-root user, assess image size and layers.

2. **Dockerfile review** — Check for security anti-patterns: running as root, ADD vs COPY, secrets in build args, unnecessary packages, missing health checks.

3. **Kubernetes RBAC** — Review cluster roles, role bindings, service account permissions. Identify overprivileged service accounts and unnecessary cluster-admin bindings.

4. **Pod Security** — Check for privileged containers, host namespace sharing, capabilities, seccomp/AppArmor profiles, read-only root filesystem.

5. **Network Policies** — Verify pod-to-pod communication is restricted by default. Check for missing network policies that allow unrestricted lateral movement.

6. **Secrets management** — Verify secrets are not in environment variables or ConfigMaps in plain text. Check for external secrets management (Vault, Sealed Secrets, External Secrets Operator).

7. **Admission control** — Verify policy enforcement (OPA/Gatekeeper, Kyverno) is in place to prevent insecure deployments.

8. **Supply chain** — Check image signing, SBOM generation, registry access controls, and CI/CD pipeline security.

## Quality Gates

- All Dockerfiles reviewed for security anti-patterns
- Images scanned for known vulnerabilities
- Kubernetes RBAC reviewed for least privilege
- Network policies assessed for default-deny enforcement
