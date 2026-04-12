---
task: mobile-app-security-review
responsavel: "penetration-tester"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: app_package
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: authorization
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: platform
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["iOS", "Android", "cross-platform"]

Saida:
  - campo: mobile_security_report
    tipo: document
    destino: "stakeholders, dev team"

Checklist:
  - "[ ] Verify authorization"
  - "[ ] Analyze binary and static code"
  - "[ ] Test data storage security"
  - "[ ] Assess network communication security"
  - "[ ] Test authentication and session handling"
  - "[ ] Evaluate platform-specific controls"
  - "[ ] Check for sensitive data leakage"
  - "[ ] Score findings with CVSS"
---

# Task: Mobile Application Security Review

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Breach (penetration-tester)
- **Complexity:** Complex

## Objective

Conduct a security review of a mobile application (iOS, Android, or cross-platform) following the OWASP Mobile Application Security Verification Standard (MASVS) and Mobile Application Security Testing Guide (MASTG). Assess data storage, network security, authentication, code quality, and platform-specific security controls.

> **AUTHORIZED TESTING ONLY:** This review must be performed only on applications owned by or explicitly authorized for testing by the client. Reverse engineering is performed solely for security assessment within the authorized scope.

## Pre-Conditions

- Written authorization from application owner
- Application binary (APK/IPA) or source code access
- Test devices or emulators configured
- Test account credentials
- Backend API documentation (if available)

## Inputs

- Application package (APK, IPA, or source code)
- Written authorization
- Platform (iOS, Android, cross-platform)
- Test credentials for multiple roles
- Backend API endpoints

## Steps

### 1. Static Analysis
Analyze the application binary without execution:
- Decompile and review code structure (authorized reverse engineering)
- Identify hardcoded credentials, API keys, secrets
- Review encryption implementations
- Check for debugging flags and verbose logging
- Analyze third-party library usage and known vulnerabilities
- Review AndroidManifest.xml / Info.plist for misconfigurations

### 2. Data Storage Security (MASVS-STORAGE)
Test for sensitive data in:
| Storage Location | Platform | Risk |
|-----------------|----------|------|
| SharedPreferences / NSUserDefaults | Both | Unencrypted storage |
| SQLite databases | Both | Plaintext data |
| Keychain / Keystore | Both | Misconfigured access |
| External storage | Android | World-readable |
| Application logs | Both | Sensitive data logging |
| Clipboard | Both | Data leakage |
| Backup files | Both | Unencrypted backups |
| Screenshots/snapshots | Both | Sensitive screen capture |

### 3. Network Communication Security (MASVS-NETWORK)
Assess:
- TLS implementation and certificate validation
- Certificate pinning implementation and bypass resistance
- Cleartext traffic detection
- Network security configuration (Android) / ATS (iOS)
- Proxy detection and bypass
- API endpoint security

### 4. Authentication and Session Management (MASVS-AUTH)
Test:
- Biometric authentication implementation
- Session token handling and storage
- Token refresh and expiration
- Logout implementation (local and server-side)
- Deep link authentication bypass
- Account lockout on mobile

### 5. Cryptography Review (MASVS-CRYPTO)
Evaluate:
- Encryption algorithms used (AES, RSA parameters)
- Key generation and storage
- Random number generation
- Custom cryptographic implementations
- Key derivation functions

### 6. Platform-Specific Security (MASVS-PLATFORM)
**Android:**
- Exported components (activities, services, receivers, providers)
- Intent handling and validation
- WebView security configuration
- Content provider security
- Permission model

**iOS:**
- URL scheme handling
- Universal links configuration
- App Transport Security
- Keychain access groups
- Extension security

### 7. Code Quality and Tampering (MASVS-RESILIENCE)
Assess:
- Root/jailbreak detection
- Debugger detection
- Code obfuscation
- Integrity verification
- Anti-tampering mechanisms
- Runtime manipulation resistance

### 8. Third-Party SDK Analysis
Review integrated SDKs:
- Analytics SDKs (data collection practices)
- Ad network SDKs (privacy implications)
- Push notification SDKs (token security)
- Payment SDKs (PCI compliance)
- Known vulnerabilities in SDK versions

### 9. Backend API Testing
Test the mobile API backend for:
- BOLA and BFLA vulnerabilities
- Mobile-specific API endpoints
- Push notification security
- Deep link parameter injection
- API versioning and deprecated endpoints

### 10. Compile Mobile Security Report
Document findings mapped to MASVS categories with CVSS scores and platform-specific remediation.

## Output

```yaml
mobile_security_report:
  app_name: ""
  platform: ""
  version: ""
  date: ""
  authorization: "confirmed"

  masvs_coverage:
    STORAGE: "[pass/fail/partial]"
    NETWORK: "[pass/fail/partial]"
    AUTH: "[pass/fail/partial]"
    CRYPTO: "[pass/fail/partial]"
    PLATFORM: "[pass/fail/partial]"
    RESILIENCE: "[pass/fail/partial]"

  findings:
    - title: ""
      masvs_category: ""
      cvss: 0.0
      platform: ""
      evidence: ""
      remediation: ""

  overall_rating: "[secure/adequate/needs-work/insecure]"
```

## Quality Criteria

- [ ] Written authorization confirmed
- [ ] All MASVS categories assessed
- [ ] Data storage tested for sensitive data leakage
- [ ] Network communication security verified
- [ ] Platform-specific controls evaluated
- [ ] Third-party SDKs analyzed for risk
- [ ] All findings include CVSS scores and evidence
- [ ] Remediation specific to platform and framework
