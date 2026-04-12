---
task: wireless-security-assessment
responsavel: "network-security-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: wireless_infrastructure
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: authorization
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: assessment_scope
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["corporate-wifi", "guest-wifi", "full", "policy-review-only"]

Saida:
  - campo: wireless_security_report
    tipo: document
    destino: "stakeholders, cyber-orqx"

Checklist:
  - "[ ] Verify authorization"
  - "[ ] Inventory all wireless networks"
  - "[ ] Assess authentication and encryption"
  - "[ ] Review network segmentation"
  - "[ ] Check rogue AP detection"
  - "[ ] Evaluate guest network isolation"
  - "[ ] Test wireless policies"
  - "[ ] Produce remediation plan"
---

# Task: Wireless Security Assessment

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Wire (network-security-engineer)
- **Complexity:** Standard

## Objective

Assess the security of wireless network infrastructure including corporate Wi-Fi, guest networks, and IoT wireless. Evaluate authentication, encryption, segmentation, rogue access point detection, and wireless policies. Produce hardening recommendations.

> **AUTHORIZED ASSESSMENT ONLY:** Wireless security testing must be performed only on networks owned by or authorized for testing by the organization. No unauthorized scanning or connection to third-party networks. Ensure compliance with local wireless regulations.

## Pre-Conditions

- Written authorization for wireless assessment
- Access to wireless controller/management
- Physical access to facilities (if site survey needed)
- Understanding of wireless infrastructure architecture
- Compliance with local wireless regulations

## Inputs

- Wireless infrastructure description (controllers, APs, SSIDs)
- Written authorization
- Assessment scope (corporate WiFi, guest, full, policy review only)
- Wireless policies and standards
- Network diagrams showing wireless segmentation

## Steps

### 1. Wireless Network Inventory
Catalog all wireless networks:
| SSID | Band | Authentication | Encryption | VLAN | Purpose | Hidden |
|------|------|---------------|-----------|------|---------|--------|
| | | | | | | |

### 2. Authentication Security Assessment
Review wireless authentication:
| Network | Auth Method | Strength | Finding |
|---------|-----------|----------|---------|
| Corporate | WPA3-Enterprise/802.1X | Strong | |
| Corporate | WPA2-Enterprise/802.1X | Adequate | |
| Guest | Captive portal | Acceptable | |
| Legacy | WPA2-PSK | Weak if shared | |
| Any | WEP or Open | Critical | |

### 3. Encryption Assessment
Evaluate encryption standards:
- WPA3 adoption status
- WPA2 configuration (CCMP vs TKIP)
- Protected Management Frames (PMF)
- Opportunistic Wireless Encryption (OWE) for guest
- Certificate-based authentication
- RADIUS server security

### 4. Network Segmentation Review
Verify wireless network isolation:
- Corporate wireless to wired LAN access
- Guest network isolation from corporate
- IoT network segmentation
- VLAN assignment correctness
- Inter-SSID communication blocking
- Firewall rules between wireless segments

### 5. Rogue Access Point Detection
Assess rogue AP defense:
- Wireless Intrusion Prevention System (WIPS) deployment
- Rogue AP detection capabilities
- Evil twin detection
- Unauthorized SSID monitoring
- Alert and response procedures for rogue APs
- Physical security of network drops

### 6. Wireless Controller Security
Review management plane security:
- Controller access control (admin accounts)
- Management interface exposure (not on guest network)
- Firmware version and patch status
- Configuration backup security
- Audit logging enabled
- Default credential removal

### 7. Client Security Controls
Assess controls for wireless clients:
- 802.1X supplicant configuration
- Certificate distribution and management
- BYOD vs corporate device policies
- Wireless profile management (MDM)
- Client isolation on guest networks
- Captive portal security (HTTPS)

### 8. Signal and Coverage Assessment
Review wireless signal security:
- Signal bleed outside facility boundaries
- Appropriate power level configuration
- Channel management (avoiding interference)
- Coverage gaps that force users to insecure alternatives
- Indoor/outdoor AP configuration

### 9. Policy and Compliance Review
Assess wireless security policies:
| Policy Area | Exists | Adequate | Finding |
|------------|--------|---------|---------|
| Acceptable use for wireless | | | |
| Guest network access policy | | | |
| BYOD wireless policy | | | |
| Rogue AP response procedure | | | |
| Wireless decommissioning | | | |
| Periodic assessment schedule | | | |

### 10. Compile Wireless Security Report
Document findings with prioritized remediation recommendations.

## Output

```yaml
wireless_security_report:
  date: ""
  author: "Wire (network-security-engineer)"
  authorization: "confirmed"

  networks_assessed: 0
  access_points: 0

  findings_summary:
    critical: 0
    high: 0
    medium: 0
    low: 0

  findings:
    - network: ""
      finding: ""
      severity: ""
      remediation: ""

  overall_posture: "[strong/adequate/needs-improvement/weak]"
```

## Quality Criteria

- [ ] Written authorization verified
- [ ] All wireless networks inventoried
- [ ] Authentication and encryption assessed per network
- [ ] Network segmentation verified
- [ ] Rogue AP detection capabilities evaluated
- [ ] Controller security reviewed
- [ ] Policy compliance assessed
- [ ] Remediation recommendations prioritized
