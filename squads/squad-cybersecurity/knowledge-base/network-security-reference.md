# Network Security Reference

## Purpose

Reference for network security controls — firewalls, WAF, DDoS protection, VPN alternatives, mTLS, network segmentation, and IDS/IPS. Used by Wire (network-security-engineer).

---

## Network Security Architecture

### Defense in Depth — Layer Model

```
Internet
    |
[Cloudflare / CDN Edge]     -- DDoS, WAF, Bot management, TLS termination
    |
[Load Balancer]              -- Health checks, SSL passthrough option
    |
[WAF (application layer)]    -- OWASP rules, rate limiting, custom rules
    |
[Application Servers]        -- In private subnet, no direct internet access
    |
[Service Mesh mTLS]          -- Istio/Linkerd for service-to-service encryption
    |
[Database Subnet]            -- No inbound from internet, only from app layer
    |
[Network Security Groups]    -- Stateful firewall rules, least-privilege
```

Every layer should fail securely and independently. If the WAF is bypassed, the network firewall still limits access. If the load balancer is misconfigured, the app servers are still in a private subnet.

---

## Firewalls

### Network Security Groups (Cloud Firewall)

Cloud firewalls (AWS Security Groups, Azure NSGs, GCP Firewall Rules) operate as distributed stateful firewalls. Core principles:

**Default posture:** Deny all inbound, permit all outbound (then restrict outbound as needed).

```bash
# AWS Security Group for web servers
aws ec2 create-security-group \
  --group-name web-server-sg \
  --description "Security group for web servers"

# Allow HTTPS from internet
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow HTTP (redirect to HTTPS at app level)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow SSH ONLY from bastion host, not internet
# NEVER: --cidr 0.0.0.0/0 for SSH (port 22)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxx \
  --protocol tcp \
  --port 22 \
  --source-group sg-bastion-id

# Database security group -- only from app tier
aws ec2 authorize-security-group-ingress \
  --group-id sg-db \
  --protocol tcp \
  --port 5432 \
  --source-group sg-app-servers
```

### Firewall Rule Audit

```bash
# Find overpermissive AWS Security Group rules
# All security groups with SSH or RDP open to internet
aws ec2 describe-security-groups --query \
  "SecurityGroups[?IpPermissions[?contains(IpRanges[].CidrIp, '0.0.0.0/0') && \
  (FromPort==\`22\` || FromPort==\`3389\`)]].[GroupId,GroupName]" \
  --output table

# Find security groups with all traffic allowed
aws ec2 describe-security-groups --query \
  "SecurityGroups[?IpPermissions[?IpProtocol=='-1' && \
  contains(IpRanges[].CidrIp, '0.0.0.0/0')]].[GroupId,GroupName]"
```

---

## Web Application Firewall (WAF)

### Cloudflare WAF (Primary for most deployments)

Cloudflare WAF operates at the edge, blocking attacks before they reach origin servers.

**Rule categories:**

| Rule Set | Coverage | Recommendation |
|----------|----------|---------------|
| Cloudflare Managed Rules | Emerging threats, 0-day | Enable in production |
| OWASP Core Rule Set | SQLi, XSS, path traversal | Enable, tune for false positives |
| Custom Rules | Application-specific | Write for your attack surface |
| Rate Limiting Rules | Brute force, DDoS | Essential for auth endpoints |

**Rate limiting configuration:**
```javascript
// Cloudflare Rate Limiting Rule examples

// Login endpoint -- 5 requests per minute per IP
{
  expression: '(http.request.uri.path eq "/api/auth/login")',
  action: 'block',
  characteristics: ['ip.src'],
  period: 60,
  requestsPerPeriod: 5,
  mitigationTimeout: 300
}

// API endpoints -- 100 requests per minute per authenticated user
{
  expression: '(http.request.uri.path matches "^/api/")',
  action: 'challenge',
  characteristics: ['cf.unique_visitor_id'],
  period: 60,
  requestsPerPeriod: 100
}
```

### AWS WAF v2

```bash
# Create WAF WebACL with managed rules
aws wafv2 create-web-acl \
  --name "production-waf" \
  --scope REGIONAL \
  --default-action Allow={} \
  --rules '[
    {
      "Name": "AWSManagedRulesCommonRuleSet",
      "Priority": 0,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesCommonRuleSet"
        }
      },
      "Action": {"Block":{}},
      "VisibilityConfig": {...}
    }
  ]'
```

---

## DDoS Protection

### Attack Categories

| Attack Type | Layer | Example | Defense |
|------------|-------|---------|---------|
| Volumetric | L3/L4 | UDP flood, ICMP flood | CDN/Anycast absorption |
| Protocol | L4 | SYN flood, Smurf | SYN cookies, upstream filtering |
| Application | L7 | HTTP flood, Slowloris | WAF, rate limiting, bot management |
| Amplification | L3/L4 | DNS/NTP amplification | Block UDP amplifiers |

### Defense Strategy

**Layer 1: CDN/Anycast absorption (primary defense)**
```
Cloudflare / AWS CloudFront / Azure Front Door

Benefits:
- Absorbs volumetric attacks at the edge (100Gbps+ capacity)
- Origin IP hidden from attackers
- Always-on protection included in free/basic tiers
- DDoS traffic scrubbed before reaching origin
```

**Layer 2: Rate limiting**
```nginx
# Nginx rate limiting for self-hosted (complement to CDN)
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

server {
  location /api/ {
    limit_req zone=api burst=20 nodelay;
    limit_req_status 429;
  }

  location /auth/ {
    limit_req zone=login burst=5;
    limit_req_status 429;
  }
}
```

**Layer 3: Application-level (Express.js)**
```javascript
const rateLimit = require('express-rate-limit')

// Trust Cloudflare's forwarded IP (when behind Cloudflare)
app.set('trust proxy', 1)

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  keyGenerator: (req) => req.ip,  // Use real IP from X-Forwarded-For
})
```

---

## mTLS (Mutual TLS) — Service-to-Service

### Why mTLS

Standard TLS authenticates the server to the client. Mutual TLS adds client authentication — both sides prove their identity. This is the foundation of zero trust service mesh.

### Service Mesh Implementation

**Istio (Kubernetes):**
```yaml
# Enforce mTLS for entire namespace
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT  # Reject all non-mTLS traffic

---
# Allow traffic only from specific service
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: payment-service-policy
  namespace: production
spec:
  selector:
    matchLabels:
      app: payment-service
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/production/sa/checkout-service"]
    to:
    - operation:
        methods: ["POST"]
        paths: ["/api/charge"]
```

**Linkerd (simpler, lower overhead):**
```bash
# Inject Linkerd sidecar -- automatic mTLS
kubectl annotate namespace production linkerd.io/inject=enabled

# Check mTLS is working
linkerd viz edges deployment -n production
# Should show "secured" for all traffic
```

---

## VPN Alternatives

### Traditional VPN Problems

| Problem | Impact |
|---------|--------|
| Lateral movement risk | Once on VPN, can reach all internal services |
| Client management overhead | Updates, certificates, split-tunneling issues |
| Performance | VPN concentrator bottleneck |
| "Always trusted inside" fallacy | VPN doesn't equal zero trust |

### Modern Alternatives

**Cloudflare WARP + Access (Zero Trust Network Access):**
```
Architecture:
User device (WARP client) → Cloudflare edge → Identity check (SSO) → Internal resource

Benefits:
- Per-application access (not network-wide)
- No VPN concentrator bottleneck
- Audit log of every access
- Device posture enforcement
- Works on any device, any network
```

**Tailscale (WireGuard-based mesh):**
```bash
# Set up Tailscale for small teams / internal tools
# Install on each device: tailscale.com/download

# Key features:
# - Peer-to-peer WireGuard connections (fast, low overhead)
# - ACL-based access control per device
# - Magic DNS for service discovery
# - Works across NAT without port forwarding
# - SSO integration (Google, GitHub, Okta)
```

**AWS Systems Manager Session Manager:**
```bash
# SSH/RDP replacement -- no port 22/3389 needed
# No inbound firewall rules required

# Connect to EC2 without SSH
aws ssm start-session --target i-1234567890abcdef0

# Benefits:
# - Encrypted channel via SSM API
# - Audit log in CloudTrail
# - IAM-based access control
# - No bastion hosts needed
```

---

## Network Segmentation

### Subnetting Strategy

```
VPC: 10.0.0.0/16
  |
  ├── Public Subnets (10.0.0.0/24, 10.0.1.0/24)
  │     └── Load balancers, NAT gateways
  │         Internet Gateway → Public Subnet → Private Subnet
  │
  ├── Private Application Subnets (10.0.10.0/24, 10.0.11.0/24)
  │     └── Application servers, ECS tasks, Lambda in VPC
  │         No direct internet access (NAT gateway for outbound only)
  │
  ├── Private Database Subnets (10.0.20.0/24, 10.0.21.0/24)
  │     └── RDS, ElastiCache, databases
  │         No internet access at all (no NAT gateway)
  │         Only accessible from application subnets
  │
  └── Management Subnet (10.0.30.0/24)
        └── Bastion host (if needed), monitoring agents
            Limited to specific trusted IPs only
```

### Kubernetes Network Policies

```yaml
# Default deny-all policy (apply to every namespace)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

---
# Allow only specific traffic to API service
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-server-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api-server
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx-ingress
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
```

---

## IDS/IPS (Intrusion Detection/Prevention)

### Network-Based Detection

| Tool | Type | Deployment |
|------|------|-----------|
| **Suricata** | NIDS/NIPS | Network tap or inline |
| **Snort** | NIDS | Network tap |
| **Zeek (Bro)** | NSM | Passive monitoring, log generation |
| **AWS Network Firewall** | Managed NIDS/NIPS | AWS VPCs |

### Host-Based Detection

| Tool | Type | Focus |
|------|------|-------|
| **Falco** | HIDS (eBPF) | Container/Kubernetes runtime |
| **OSSEC/Wazuh** | HIDS | File integrity, log analysis |
| **CrowdStrike Falcon** | EDR | Endpoint behavior |
| **Cilium Tetragon** | eBPF | K8s security observability |

**Falco for Kubernetes runtime detection:**
```yaml
# Example Falco rule -- detect web shell activity
- rule: Suspicious Web Shell Activity
  desc: Detect execution of commands via web shell
  condition: >
    spawned_process and
    proc.pname in (apache2, nginx, httpd) and
    proc.name in (bash, sh, python, perl, ruby)
  output: >
    Web shell detected (user=%user.name command=%proc.cmdline
    container=%container.name)
  priority: CRITICAL
  tags: [web, shell, attack]
```

---

## Legacy Protocol Security

### Protocols to Disable Immediately

| Protocol | Replacement | Why Deprecated |
|----------|------------|---------------|
| SSLv3 | TLS 1.3 | POODLE attack |
| TLS 1.0 | TLS 1.2+ | BEAST, POODLE |
| TLS 1.1 | TLS 1.2+ | Weak ciphers |
| Telnet | SSH | Cleartext protocol |
| FTP | SFTP/FTPS | Cleartext protocol |
| SNMPv1/v2 | SNMPv3 | No authentication |
| HTTP | HTTPS | Cleartext |

```nginx
# Nginx -- only TLS 1.2 and 1.3
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;

# HSTS -- force HTTPS for 2 years
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

---

## Sources

- NIST SP 800-41 (Firewalls): https://csrc.nist.gov/publications/detail/sp/800-41/rev-1/final
- CIS Benchmarks (Networking): https://www.cisecurity.org/cis-benchmarks
- Cloudflare Security Learning: https://www.cloudflare.com/learning/security/
- Istio Security: https://istio.io/latest/docs/concepts/security/
- Falco: https://falco.org/docs/
