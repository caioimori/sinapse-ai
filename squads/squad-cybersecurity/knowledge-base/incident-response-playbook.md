# Incident Response Playbook

## Purpose

Structured incident response methodology and communication templates for Rapid (incident-responder). Based on NIST SP 800-61 Rev. 2, SANS IR Process, and practical web application context including LGPD notification requirements.

---

## IR Framework Overview

Two complementary frameworks inform this playbook:

| Framework | Phases | Best For |
|-----------|--------|---------|
| **NIST SP 800-61** | Preparation → Detection & Analysis → Containment/Eradication/Recovery → Post-Incident | Comprehensive, government-aligned |
| **SANS 6-Step** | Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned | Practical, widely adopted |

This playbook uses NIST structure with SANS terminology for clarity.

---

## Severity Classification

Before executing the playbook, classify severity using the Fortress severity matrix:

| Level | Indicators | Response SLA | Escalation |
|-------|-----------|-------------|------------|
| **CRITICAL** | Active data exfiltration, ransomware deployed, zero-day exploited in production | 15 minutes to initial response | Rapid + Sentinel + Wire immediately |
| **HIGH** | Confirmed unauthorized access, credentials compromised, significant data exposed | 1 hour to initial assessment | Rapid primary, Sentinel support |
| **MEDIUM** | Suspicious activity confirmed, policy violation, limited exposure | 24 hours to initial assessment | Rapid assessment |
| **LOW** | Anomaly detected, potential policy violation | 5 business days | Scheduled review |

---

## Phase 1: Preparation (Before Any Incident)

The effectiveness of incident response is determined almost entirely by preparation quality.

### Preparation Checklist

```
Documentation
[ ] Incident response plan approved and tested
[ ] Contact list current: CISO, legal, PR, DPO, ANPD contact
[ ] Asset inventory current — know what you're protecting
[ ] Data classification documented — know what data you hold
[ ] LGPD breach notification procedure documented

Technical Readiness
[ ] Centralized logging operational (SIEM, CloudWatch, Datadog)
[ ] Alerting rules configured and tuned
[ ] Forensic tools available (disk images, memory capture)
[ ] Out-of-band communication channel exists (separate from primary systems)
[ ] Backup integrity verified and restoration tested within 90 days

Legal and Compliance
[ ] Legal counsel identified and on retainer (or internal legal briefed)
[ ] Cyber insurance policy reviewed — coverage understood
[ ] ANPD (Brazil) notification procedure documented — 3 business days SLA
[ ] Regulatory notification requirements identified per data type
[ ] Evidence preservation procedures documented

Training
[ ] IR team trained on procedures
[ ] Tabletop exercise conducted in last 12 months
[ ] After-hours escalation procedure known to all team members
```

---

## Phase 2: Detection and Analysis

### Detection Sources

| Source | What It Detects | Priority |
|--------|----------------|---------|
| SIEM alerts | Anomalous access patterns, known attack signatures | High |
| User reports | Unusual behavior, phishing reports, lockout issues | High |
| Automated scans | Vulnerability confirmations, configuration changes | Medium |
| Third-party notification | Vendor/partner breach affecting your data | High |
| Threat intelligence | IOCs matching your environment | Medium |
| Audit log review | Scheduled review finds anomalies | Low |

### Initial Triage Questions

When an alert fires or report arrives, answer in order:

1. **What is the affected system/data?** — identify scope
2. **What is the timeline?** — when did this start?
3. **Is this still ongoing?** — active vs. historical incident
4. **What data could be exposed?** — PII, credentials, financial, IP
5. **Is the attacker still present?** — look for persistence indicators
6. **What is the business impact?** — revenue, reputation, legal

### Evidence Collection (Do This First)

Preserve evidence before taking containment actions that might destroy it:

```bash
# Capture volatile memory before shutdown or isolation
# Linux
sudo avml /media/evidence/memory.lime

# Windows
# Use WinPmem or DumpIt

# Capture running processes
ps aux > /evidence/processes.txt
netstat -natp > /evidence/network.txt
last > /evidence/last-logins.txt

# Capture logs before they rotate
cp /var/log/auth.log /evidence/
cp /var/log/nginx/access.log /evidence/
cp /var/log/nginx/error.log /evidence/

# Create filesystem image (if forensic analysis needed)
sudo dd if=/dev/sda of=/media/evidence/disk.img bs=4M status=progress
# Hash the image
sha256sum /media/evidence/disk.img > /media/evidence/disk.img.sha256
```

### IOC Analysis

When examining suspicious artifacts:

```bash
# Check file hash against VirusTotal
sha256sum suspicious_file | awk '{print $1}' | xargs -I{} curl -s \
  "https://www.virustotal.com/api/v3/files/{}" -H "x-apikey: $VT_API_KEY"

# Check IP against threat intel
curl "https://api.abuseipdb.com/api/v2/check?ipAddress=1.2.3.4" \
  -H "Key: $ABUSEIPDB_API_KEY" -H "Accept: application/json"

# Analyze network connections
netstat -natp | grep ESTABLISHED
ss -tulpn

# Check for web shells (common indicator for web app compromises)
find /var/www -name "*.php" -newer /var/www/index.php -exec ls -la {} \;
grep -r "eval(base64_decode" /var/www/ --include="*.php"
grep -r "system($_" /var/www/ --include="*.php"
```

---

## Phase 3: Containment

### Containment Decision Tree

```
Is the attacker actively present and causing damage?
  YES → Emergency containment (isolate immediately, accept service disruption)
  NO → Coordinated containment (observe and gather evidence while containing)

Can you contain without losing all evidence?
  YES → Contain first, preserve evidence
  NO → Preserve evidence first (set time limit: max 2 hours)

Is this a web application compromise?
  YES → See Web App Containment below
  
Is this a cloud account compromise?
  YES → See Cloud Account Containment below
```

### Web Application Containment

```bash
# 1. Preserve logs before any action
# Copy all access logs, error logs, application logs

# 2. Revoke compromised sessions immediately
# Supabase: invalidate all user sessions
# In Supabase dashboard → Authentication → Users → Invalidate session
# Or via API:
curl -X DELETE "https://api.supabase.io/v1/projects/$PROJECT_ID/auth/users/$USER_ID/sessions" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY"

# 3. Rotate compromised credentials
# API keys, database passwords, JWT secrets

# 4. Block malicious IPs at WAF/Cloudflare
# In Cloudflare Dashboard → Security → WAF → Custom Rules
# Or via API:
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/firewall/rules" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -d '{"action":"block","filter":{"expression":"ip.src eq 1.2.3.4"}}'

# 5. Enable forced MFA if credentials leaked
# Force re-authentication for all users

# 6. Deploy emergency WAF rules (temporary, until fix deployed)
# Block attack pattern that was exploited
```

### Cloud Account Containment

```bash
# AWS: Disable compromised IAM user immediately
aws iam update-user --user-name compromised-user
aws iam delete-access-key --user-name compromised-user --access-key-id AKID...

# Revoke all active sessions for a role
aws iam put-role-policy --role-name MyRole --policy-name DenyAll \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*"}]}'

# GCP: Disable service account
gcloud iam service-accounts disable compromised-sa@project.iam.gserviceaccount.com

# Azure: Disable user account
az ad user update --id compromised@tenant.com --account-enabled false
```

---

## Phase 4: Eradication

After containment, remove the attacker's foothold:

### Eradication Checklist

```
[ ] Identified and removed all malicious files (web shells, backdoors, malware)
[ ] Compared current application code against known-good baseline
[ ] Closed all unauthorized accounts or access paths
[ ] Rotated all credentials that could be compromised
[ ] Removed all persistence mechanisms (cron jobs, startup scripts, scheduled tasks)
[ ] Identified and patched the vulnerability that was exploited
[ ] Scanned all systems in same network segment for related compromise
[ ] Verified no exfiltration pathways remain
```

### Web Shell Detection

```bash
# Common web shell indicators
find /var/www -name "*.php" -type f | xargs grep -l "eval\|base64_decode\|system\|exec\|passthru"
find /var/www -name "*.php" -newer /etc/passwd  # Recently modified PHP files
find /var/www -name "*.php.jpg"  # Double extension files
find /uploads -name "*.php"  # PHP in upload directories (should never exist)
```

---

## Phase 5: Recovery

### Recovery Sequence

1. **Verify eradication** — ensure attacker has no remaining access
2. **Restore from clean backup** if system was compromised at the file/OS level
3. **Deploy patched code** with the vulnerability fixed
4. **Monitor intensively** for first 48-72 hours after recovery
5. **Gradually restore access** — don't turn everything on at once
6. **Validate functionality** — confirm application works correctly
7. **Communicate recovery** to affected users and stakeholders

### Backup Restoration

```bash
# Verify backup integrity before restoration
sha256sum backup.tar.gz
# Compare with stored hash from when backup was created

# For Supabase:
# Restore from backup via Supabase Dashboard
# Settings → Database → Backups → Select backup → Restore

# For self-managed PostgreSQL:
pg_restore -h localhost -U postgres -d mydb clean_backup.dump

# For filesystem:
tar xzf clean_backup.tar.gz --directory /var/www/html/
# Verify file hashes after restoration
```

---

## Phase 6: Post-Incident Review

Conduct within 7 days of resolution.

### Post-Mortem Template (Blameless)

```markdown
# Post-Mortem: [Incident Name] — [Date]

## Impact Summary
- Duration:
- Systems affected:
- Users affected:
- Data exposed (if any):
- Business impact:

## Root Cause
[What was the underlying vulnerability or failure that enabled the incident?]

## Timeline
[When events were, accurate to the minute]

## What Went Well
- Detection was fast because...
- Containment was effective because...

## What Could Improve
- We could have detected faster if...
- Containment was slow because...

## Action Items
| Action | Owner | Due Date | Priority |
|--------|-------|----------|---------|
| [Specific fix] | [Person] | [Date] | [P1/P2/P3] |

## Lessons Learned
[3-5 key takeaways for the broader team]
```

---

## LGPD Breach Notification

Brazilian law requires notification within 3 business days of becoming aware of a breach involving personal data.

### Decision Tree: Do I Need to Notify?

```
Was personal data accessed, exposed, or stolen?
  YES → Was the data encrypted in a way that prevents access?
          NO → Notification required
          YES → May not be required (consult legal)
  NO → No notification required

Is this a security incident without personal data exposure?
  → No LGPD notification required (but document for internal records)
```

### ANPD Notification Requirements

```
Timeframe: 3 business days from discovery
Channel:   ANPD portal (https://www.gov.br/anpd/pt-br)
           Email: anpd@anpd.gov.br

Required Information:
- Description of what happened
- Date of incident and date of discovery
- Categories and volume of personal data affected
- Categories of data subjects affected
- Potential consequences of the incident
- Technical and organizational measures adopted
- DPO contact information
- Measures implemented to mitigate effects
```

### Notification to Data Subjects

```
Timeline:  As soon as reasonably practicable after ANPD notification
Content:
- Plain language description of what happened
- What personal data was involved
- What risks exist for the individual
- What the organization has done
- What the individual can do to protect themselves
- Contact information for questions
```

### Communication Templates

**Initial internal notification (within 1 hour of detection):**
```
SUBJECT: [CONFIDENTIAL] Security Incident Alert — [Severity Level]

Incident detected at [time] on [date].
Type: [breach/unauthorized access/data exposure]
Affected systems: [list]
Currently investigating.

Initial IR team activated: [names]
Next update at: [time]
War room: [location/link]
```

**User notification template:**
```
Dear [User],

We are writing to inform you about a security incident that may have affected 
your account on [Application Name].

What happened:
On [date], we discovered [brief description of incident].

What information was involved:
[Specific data types: email, name, etc. — be specific, not vague]

What we have done:
- [Action 1]
- [Action 2]

What you should do:
- Change your password immediately at [URL]
- Enable two-factor authentication
- Monitor your email for unusual activity

If you have questions, contact us at [security@example.com]

Sincerely,
[Organization]
```

---

## Sources

- NIST SP 800-61 Rev. 2: https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final
- CISA Federal IR Playbooks: https://www.cisa.gov/sites/default/files/2024-08/Federal_Government_Cybersecurity_Incident_and_Vulnerability_Response_Playbooks_508C.pdf
- LGPD Art. 48: http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD Breach Notification: https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-resolucao-sobre-comunicacao-de-incidentes
