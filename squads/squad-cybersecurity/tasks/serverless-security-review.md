---
task: serverless-security-review
responsavel: "cloud-security-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: serverless_platform
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["AWS-Lambda", "Azure-Functions", "GCP-CloudFunctions", "Cloudflare-Workers", "multi-platform"]
  - campo: function_inventory
    tipo: list
    origem: "user input"
    obrigatorio: true

Saida:
  - campo: serverless_security_report
    tipo: document
    destino: "dev team, stakeholders"

Checklist:
  - "[ ] Inventory all serverless functions"
  - "[ ] Review IAM permissions per function"
  - "[ ] Assess input validation and injection risks"
  - "[ ] Check event source security"
  - "[ ] Review secrets and environment variables"
  - "[ ] Evaluate monitoring and logging"
  - "[ ] Assess dependency security"
  - "[ ] Produce remediation plan"
---

# Task: Serverless Security Review

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Nimbus (cloud-security-engineer)
- **Complexity:** Standard

## Objective

Review the security posture of serverless functions and event-driven architectures, covering function permissions, input validation, event source security, secrets management, dependency vulnerabilities, and observability. Address the unique security challenges of serverless computing.

> **AUTHORIZED REVIEW ONLY:** This review requires read access to function configurations and code. No modifications to production functions during the assessment.

## Pre-Conditions

- Read access to serverless function configurations
- Access to function code or deployment packages
- Understanding of event sources and triggers
- Knowledge of function dependencies and integrations

## Inputs

- Serverless platform (AWS Lambda, Azure Functions, GCP Cloud Functions, etc.)
- Function inventory (names, triggers, purpose)
- Function code access
- Event source configurations
- Related infrastructure (API Gateway, queues, storage)

## Steps

### 1. Function Inventory and Classification
Catalog all serverless functions:
| Function | Runtime | Trigger | Data Sensitivity | Internet-Facing | Last Updated |
|----------|---------|---------|-----------------|-----------------|-------------|
| | | | | | |

### 2. IAM Permission Review
Assess each function's execution role:
- Principle of least privilege adherence
- Overly broad permissions (Resource: *)
- Cross-service access scope
- Temporary credential usage
- Permission boundaries applied
- Unused permissions

### 3. Input Validation and Injection Testing
Review function inputs for security:
| Input Source | Validation | Injection Risk | Finding |
|-------------|-----------|---------------|---------|
| API Gateway | | SQL, command, SSTI | |
| S3 events | | Path traversal, XXE | |
| Queue messages | | Deserialization | |
| Database streams | | Injection | |
| Direct invocation | | Payload manipulation | |

### 4. Event Source Security
Assess the security of event triggers:
- API Gateway authentication and authorization
- Queue/topic access policies
- Storage bucket event permissions
- Database trigger security
- Schedule trigger (preventing unauthorized invocation)
- Cross-account event sources

### 5. Environment and Secrets Security
Review sensitive data handling:
- Secrets in environment variables (encrypted vs plaintext)
- Secrets manager integration
- Encryption key management
- Temporary file handling (/tmp)
- Environment variable exposure in logs
- Function configuration exposure

### 6. Dependency Security
Analyze function dependencies:
- Vulnerability scanning of packages (npm, pip, etc.)
- Outdated dependency detection
- License compliance
- Dependency pinning
- Layer security (shared dependencies)
- Custom runtime security

### 7. Network Security
Assess network configuration:
- VPC configuration (when applicable)
- Outbound network restrictions
- Private endpoint access
- API Gateway WAF configuration
- DDoS protection
- IP restriction capabilities

### 8. Monitoring and Observability
Verify security monitoring:
| Aspect | Status | Finding |
|--------|--------|---------|
| Function logging enabled | | |
| Log level appropriate | | |
| Error handling (no sensitive data) | | |
| Invocation monitoring | | |
| Performance anomaly detection | | |
| Cost anomaly alerting | | |

### 9. Configuration Security
Review function configuration:
- Timeout settings (prevent runaway execution)
- Memory allocation (prevent abuse)
- Concurrency limits (prevent DoS)
- Dead letter queue configuration
- Retry policies
- Versioning and alias management

### 10. Compile Serverless Security Report
Document findings with serverless-specific remediation guidance.

## Output

```yaml
serverless_security_report:
  platform: ""
  date: ""
  author: "Nimbus (cloud-security-engineer)"

  functions_reviewed: 0
  functions_total: 0

  findings_summary:
    critical: 0
    high: 0
    medium: 0
    low: 0

  findings:
    - function: ""
      finding: ""
      severity: ""
      category: "[iam/input/event-source/secrets/dependency/network/config]"
      remediation: ""

  overall_posture: "[strong/adequate/needs-improvement/weak]"
```

## Quality Criteria

- [ ] All functions inventoried and classified
- [ ] IAM permissions reviewed for least privilege
- [ ] Input validation assessed for all event sources
- [ ] Secrets management evaluated
- [ ] Dependencies scanned for vulnerabilities
- [ ] Monitoring and logging verified
- [ ] Remediation specific to serverless patterns
- [ ] No production functions modified during review
