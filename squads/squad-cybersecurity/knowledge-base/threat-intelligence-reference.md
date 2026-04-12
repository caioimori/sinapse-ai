# Threat Intelligence Reference

## Purpose

Reference guide for threat intelligence concepts, adversary categorization, common attack patterns, and defensive priorities. Used across all Cyber Defense Squad agents for consistent threat understanding.

---

## Threat Actor Categories

### Nation-State / APT (Advanced Persistent Threat)
- **Motivation:** Espionage, intellectual property theft, geopolitical advantage, sabotage
- **Resources:** State-funded, highly skilled, custom tooling, zero-day capabilities
- **Persistence:** Months to years of dwell time
- **Examples:** APT28 (Fancy Bear), APT29 (Cozy Bear), APT41, Lazarus Group
- **Defense priority:** Detection of lateral movement, data exfiltration monitoring, supply chain integrity

### Cybercrime / Financially Motivated
- **Motivation:** Financial gain — ransomware, fraud, theft, extortion
- **Resources:** Moderate to high, growing sophistication, RaaS (Ransomware as a Service)
- **Persistence:** Days to weeks, opportunistic targeting
- **Examples:** REvil, Conti, LockBit, FIN7, Scattered Spider
- **Defense priority:** Email security, endpoint protection, backup integrity, access control

### Hacktivists
- **Motivation:** Political or social agenda, disruption, public embarrassment
- **Resources:** Low to moderate, often use known tools and techniques
- **Persistence:** Short campaigns, high visibility
- **Examples:** Anonymous, various issue-specific groups
- **Defense priority:** DDoS protection, web application security, data leak prevention

### Insider Threats
- **Motivation:** Financial gain, revenge, ideology, negligence
- **Resources:** Existing access to systems and data
- **Persistence:** Varies — may be one-time or sustained
- **Types:** Malicious insider, negligent insider, compromised insider
- **Defense priority:** DLP, behavioral analytics, access monitoring, least privilege

---

## Common Attack Patterns (by Kill Chain Stage)

### Initial Access (TA0001)
| Technique | ATT&CK ID | Prevalence | Primary Defense |
|-----------|-----------|------------|----------------|
| Phishing with attachment | T1566.001 | Very High | Email security, user training |
| Phishing with link | T1566.002 | Very High | URL filtering, user training |
| Exploit public-facing app | T1190 | High | Patching, WAF, pentest |
| Valid accounts | T1078 | High | MFA, credential monitoring |
| Supply chain compromise | T1195 | Medium | Vendor assessment, SCA |
| Drive-by compromise | T1189 | Medium | Browser isolation, patching |

### Execution (TA0002)
| Technique | ATT&CK ID | Prevalence | Primary Defense |
|-----------|-----------|------------|----------------|
| PowerShell | T1059.001 | Very High | Script block logging, AMSI, constrained mode |
| Command shell | T1059.003 | High | Process monitoring, EDR |
| User execution | T1204 | High | User training, application control |
| Scheduled task/job | T1053 | High | Scheduled task monitoring |

### Persistence (TA0003)
| Technique | ATT&CK ID | Prevalence | Primary Defense |
|-----------|-----------|------------|----------------|
| Scheduled task/job | T1053 | Very High | Scheduled task monitoring |
| Registry run keys | T1547.001 | High | Registry monitoring |
| Web shell | T1505.003 | High | File integrity monitoring, web server hardening |
| Account creation | T1136 | Medium | Account creation alerting |

### Privilege Escalation (TA0004)
| Technique | ATT&CK ID | Prevalence | Primary Defense |
|-----------|-----------|------------|----------------|
| Exploitation for privilege escalation | T1068 | High | Patching, least privilege |
| Access token manipulation | T1134 | High | Token monitoring, EDR |
| Abuse elevation control mechanism | T1548 | Medium | UAC enforcement, sudoers review |

### Lateral Movement (TA0008)
| Technique | ATT&CK ID | Prevalence | Primary Defense |
|-----------|-----------|------------|----------------|
| Remote services (RDP, SSH, SMB) | T1021 | Very High | Network segmentation, MFA |
| Pass-the-Hash | T1550.002 | High | Credential Guard, LAPS |
| Remote desktop protocol | T1021.001 | High | NLA, MFA, network segmentation |
| SMB/Windows admin shares | T1021.002 | High | Disable admin shares, segmentation |

### Exfiltration (TA0010)
| Technique | ATT&CK ID | Prevalence | Primary Defense |
|-----------|-----------|------------|----------------|
| Exfiltration over C2 channel | T1041 | Very High | Network monitoring, DLP |
| Exfiltration over web service | T1567 | High | Cloud access security, DLP |
| Exfiltration over DNS | T1048.003 | Medium | DNS monitoring, DNS security |

---

## Top Vulnerability Categories (Recurring)

### Web Applications
1. **Broken Access Control** — IDOR, privilege escalation, forced browsing
2. **Injection** — SQLi, XSS, command injection, SSTI
3. **Authentication weaknesses** — Weak passwords, missing MFA, session issues
4. **Security misconfiguration** — Default creds, verbose errors, missing headers
5. **Cryptographic failures** — Weak TLS, plaintext storage, poor key management

### Cloud Infrastructure
1. **Overprivileged IAM** — Wildcard permissions, unused admin roles
2. **Public storage** — S3 buckets, Azure blobs, GCS buckets with public access
3. **Missing encryption** — Data at rest without encryption, weak TLS
4. **Missing logging** — CloudTrail disabled, no flow logs
5. **Insecure defaults** — Default VPC, IMDSv1, permissive security groups

### Network
1. **Flat networks** — No segmentation, lateral movement trivial
2. **Overpermissive firewalls** — any/any rules, unused rules
3. **Missing monitoring** — No IDS/IPS, no network flow analysis
4. **Legacy protocols** — SSLv3, TLS 1.0, telnet, FTP, SNMPv1
5. **Exposed management interfaces** — SSH/RDP to internet, unprotected admin panels

---

## Indicator of Compromise (IOC) Types

| IOC Type | Examples | Enrichment Sources | TTL (Time to Live) |
|----------|---------|-------------------|-------------------|
| IP Address | Malicious C2, scanner IPs | VirusTotal, AbuseIPDB, Shodan | Days to weeks |
| Domain | Phishing domains, C2 domains | WHOIS, PassiveDNS, URLhaus | Days to months |
| URL | Malware download, phishing pages | URLhaus, PhishTank | Hours to days |
| File Hash (SHA256) | Malware samples, tools | VirusTotal, MalwareBazaar | Months to years |
| Email Address | Phishing sender, C2 contact | HIBP, reputation services | Weeks to months |
| JA3/JA3S | TLS fingerprints for C2 | ja3er.com, threat intel feeds | Months |
| User Agent | Malware communication patterns | Custom analysis | Weeks to months |

### IOC Confidence Levels

| Level | Definition | Action |
|-------|-----------|--------|
| **Confirmed** | Directly observed in verified malicious activity | Block immediately, hunt in environment |
| **Probable** | Strong circumstantial evidence, multiple sources agree | Block at perimeter, alert on internal |
| **Possible** | Limited evidence, single source | Monitor only, do not block (false positive risk) |
| **Unknown** | Insufficient data to assess | Collect more data before acting |

---

## Defense Prioritization Framework

### Quick Wins (Highest ROI)
1. **MFA everywhere** — Blocks credential-based attacks
2. **Patch critical vulns within 48h** — Reduces exploitation window
3. **Email security** — Gateway filtering, DMARC, user training
4. **Endpoint protection** — EDR on all endpoints
5. **Backup integrity** — 3-2-1 rule, tested restoration

### Foundation (Must-Have)
1. **Asset inventory** — Cannot protect what you do not know
2. **Network segmentation** — Limits blast radius
3. **Log collection** — Cannot detect what you do not see
4. **Access control** — Least privilege, regular reviews
5. **Vulnerability management** — Regular scanning and remediation

### Advanced (Maturity Indicators)
1. **Threat hunting** — Proactive search beyond detections
2. **Detection engineering** — Custom rules mapped to ATT&CK
3. **Zero trust architecture** — Identity-centric access
4. **Red team exercises** — Realistic adversary emulation
5. **Automated response** — SOAR for common incident types

---

## Ethical Guidelines — MANDATORY

All threat intelligence work within the Cyber Defense Squad operates under these non-negotiable principles:

1. **Intelligence serves defense** — All analysis is conducted to improve defensive posture, never to enable attacks
2. **No unauthorized collection** — Intelligence gathering respects legal boundaries and privacy
3. **Responsible disclosure** — New vulnerabilities discovered are reported through proper channels
4. **TLP compliance** — Information sharing respects Traffic Light Protocol classifications
5. **No offensive action** — Threat intelligence informs defense; it does not authorize retaliation
6. **Attribution caution** — Attribution is difficult; report confidence levels, avoid speculation
7. **Privacy respect** — Personal data encountered during analysis is handled per applicable data protection laws
