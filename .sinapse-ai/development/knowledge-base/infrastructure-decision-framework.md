# Infrastructure Decision Framework

> **Agente(s):** @architect (Stratum)
> **Fonte:** enterprise-infrastructure-patterns.md, aws-cloud-infrastructure.md, load-testing-capacity-planning.md
> **Uso:** Consultar ao definir stack de infraestrutura para projetos novos ou ao avaliar necessidade de scaling

---

## 1. Sistema de Tiers

### Tier 1: MVP (0-1K usuarios, <$50/mes)

| Componente | Servico | Custo |
|-----------|---------|-------|
| Frontend | Vercel (Hobby/Pro) | $0-20/mes |
| Backend/API | Vercel Serverless / Supabase Edge Functions | Incluso |
| Database | Supabase Free/Pro (PostgreSQL) | $0-25/mes |
| Auth | Supabase Auth (GoTrue) | Incluso |
| Storage | Supabase Storage (S3-compatible) | Incluso |
| CDN | Vercel Edge Network | Incluso |
| Monitoring | Vercel Analytics + Sentry Free | $0 |

**Quando usar:** MVP, validacao de produto, projetos pessoais, startups pre-revenue.

### Tier 2: Growth (1K-50K usuarios, $50-500/mes)

| Componente | Servico | Custo Estimado |
|-----------|---------|----------------|
| Frontend | Vercel Pro | $20/mes |
| Backend/API | Vercel + Supabase Edge Functions | $25-100/mes |
| Database | Supabase Pro (dedicated compute) | $25-100/mes |
| Cache | Upstash Redis | $10-50/mes |
| CDN/Security | Cloudflare Pro | $20/mes |
| Feature Flags | GrowthBook (self-hosted) | $0 |
| Monitoring | Sentry + Vercel Analytics | $26-50/mes |
| Email | Resend / SendGrid | $0-20/mes |

**Adicoes vs Tier 1:** Cloudflare (WAF, DDoS, cache), Redis (session, rate limiting), monitoring dedicado.

### Tier 3: Scale (50K-500K usuarios, $500-5K/mes)

| Componente | Servico | Custo Estimado |
|-----------|---------|----------------|
| Frontend | Vercel Enterprise ou CloudFront + S3 | $100-500/mes |
| Backend/API | Supabase + AWS Lambda / ECS Fargate | $200-1K/mes |
| Database | Supabase Pro + Read Replicas ou Aurora Serverless v2 | $100-500/mes |
| Cache | ElastiCache Redis ou Upstash Pro | $50-200/mes |
| CDN/Security | Cloudflare Business + WAF | $200/mes |
| Queue | SQS / EventBridge | $10-50/mes |
| Search | Meilisearch / Typesense | $50-200/mes |
| Monitoring | Datadog / Grafana Cloud | $100-500/mes |

**Adicoes vs Tier 2:** Read replicas, queues asincronas, search engine dedicado, observability profunda.

### Tier 4: Enterprise (500K+ usuarios, $5K+/mes)

| Componente | Servico | Custo Estimado |
|-----------|---------|----------------|
| Compute | ECS Fargate / EKS + Lambda (hibrido) | $1-5K/mes |
| Database | Aurora PostgreSQL + DynamoDB (polyglot) | $500-2K/mes |
| Cache | ElastiCache Redis Cluster | $200-1K/mes |
| CDN | CloudFront + Cloudflare (dual) | $500-2K/mes |
| Queue/Events | SQS + EventBridge + Step Functions | $50-500/mes |
| Search | Elasticsearch / OpenSearch | $500-2K/mes |
| IaC | Terraform + AWS CDK | $0 (tooling) |
| CI/CD | GitHub Actions + ArgoCD | $0-500/mes |
| Security | AWS WAF + Shield + GuardDuty | $500-3K/mes |
| Monitoring | Datadog / Grafana Cloud | $500-2K/mes |

**Adicoes vs Tier 3:** Multi-AZ, multi-region, IaC completo, GitOps, security stack dedicado.

---

## 2. Decision Tree: Qual Tier Escolher?

```
Quantos usuarios esperados nos proximos 6 meses?
|
+-- < 1K --> TIER 1 (Vercel + Supabase)
|
+-- 1K-50K --> Tem requisitos de cache ou rate limiting?
|   |-- SIM --> TIER 2 (+ Cloudflare + Redis)
|   +-- NAO --> TIER 1 (escalar depois)
|
+-- 50K-500K --> Precisa de processamento assincrono?
|   |-- SIM --> TIER 3 (+ AWS Lambda/SQS)
|   +-- NAO --> TIER 2 estendido
|
+-- > 500K --> Precisa de multi-region ou compliance enterprise?
    |-- SIM --> TIER 4 (full AWS)
    +-- NAO --> TIER 3 estendido
```

---

## 3. Triggers de Graduacao ("Quando Escalar")

### Tier 1 --> Tier 2

| Sinal | Metrica | Acao |
|-------|---------|------|
| Latencia subindo | p95 > 500ms em API | Adicionar Redis para cache |
| Rate limiting necessario | Abuso detectado | Cloudflare + Upstash rate limit |
| Cold starts impactando UX | > 1s em Edge Functions | Avaliar Provisioned Concurrency |
| DDoS ou bot traffic | Spikes inexplicaveis | Cloudflare WAF |

### Tier 2 --> Tier 3

| Sinal | Metrica | Acao |
|-------|---------|------|
| DB CPU > 70% sustentado | Dashboard Supabase | Read Replicas ou compute maior |
| Filas de processamento crescendo | Jobs falhando/atrasando | SQS + Lambda async |
| Busca textual lenta | Full-text search > 200ms | Meilisearch / Typesense dedicado |
| Custo Vercel > $500/mes | Fatura mensal | Avaliar CloudFront + S3 |

### Tier 3 --> Tier 4

| Sinal | Metrica | Acao |
|-------|---------|------|
| Necessidade de multi-region | Usuarios globais | Aurora Global + CloudFront |
| Compliance (SOC2, HIPAA) | Requisito de cliente | AWS Organizations + SCPs |
| Infra manual nao escala | > 20 servicos | IaC (Terraform/CDK) + GitOps |
| Incidentes frequentes | > 2 outages/mes | Observability completa + chaos engineering |

---

## 4. Comparativo de Compute (AWS)

| Criterio | Lambda | ECS/Fargate | App Runner | EC2 |
|----------|--------|-------------|------------|-----|
| Execucao max | 15 min | Ilimitado | Ilimitado | Ilimitado |
| Cold start | 200ms-15s | 30-60s | Rapido | N/A |
| Scaling | ms (auto) | min (auto) | Auto | ASG (min) |
| Complexidade | Baixa | Media-Alta | Baixa | Alta |
| Melhor para | Event-driven, APIs | Containers, sustentado | MVPs, simples | Legacy, GPU |

**Decision tree:**
```
Execucao > 15 min?
|-- SIM --> Containers (ECS/Fargate) ou EC2
|-- NAO --> Event-driven ou HTTP API leve?
    |-- SIM --> Lambda
    +-- NAO --> Equipe sabe containers?
        |-- SIM --> ECS/Fargate
        +-- NAO --> App Runner
```

**Breakeven serverless vs containers:** ~15 req/s sustentados. Abaixo = Lambda mais barato. Acima = containers mais custo-efetivos.

---

## 5. Comparativo de Storage (AWS)

| Criterio | S3 | EBS | EFS |
|----------|-----|-----|-----|
| Tipo | Object | Block | File (NFS) |
| Durabilidade | 11 nines | 5 nines | 11 nines |
| Custo/GB/mes | $0.023 | $0.08 | $0.30 |
| Melhor para | Objetos, backups, static | Databases, boot volumes | Shared filesystems |

**Regra:** EBS para velocidade, EFS para acesso compartilhado, S3 para escala e custo.

---

## 6. Deployment Strategies

| Estrategia | Custo Infra | Rollback | Risco | Melhor Para |
|-----------|-------------|----------|-------|-------------|
| Blue/Green | 2x (dobro) | Instantaneo | Medio | Releases maiores |
| Canary | +pequeno | Rapido | Baixo | Apps de alta evolucao |
| Rolling Update | Existente | Lento | Medio | Mudancas incrementais |

```
Orcamento para dobrar infra?
|-- SIM --> Blue/Green
|-- NAO --> Controle fino de % de usuarios?
    |-- SIM --> Canary
    +-- NAO --> Rolling Update
```

---

## 7. IaC Decision Framework

```
100% AWS?
|-- SIM --> Prefere linguagens de programacao?
|   |-- SIM --> AWS CDK
|   +-- NAO --> CloudFormation
+-- NAO --> Equipe de infra ou dev?
    |-- INFRA --> Terraform
    +-- DEV --> Pulumi
```

---

## 8. Load Testing Quick Reference

| Tipo de Teste | Pergunta que Responde | Quando Usar |
|--------------|----------------------|-------------|
| Smoke | Script funciona? | Antes de todo teste |
| Load | Performa sob carga normal? | Pre-lancamento |
| Stress | O que acontece alem do normal? | Pre-lancamento |
| Spike | Sobrevive a picos (Black Friday)? | Pre-evento |
| Soak | Memory leaks? Degradacao? | Pos-lancamento |
| Breakpoint | Capacidade maxima? | Capacity planning |

**Ferramenta recomendada:** k6 (JS/TS nativo, CI/CD, thresholds como SLOs).

**Metricas-chave (NUNCA usar media):**
- p50 < 200ms | p95 < 500ms | p99 < 1000ms
- Error rate < 0.1%
- CPU < 70% sustentado

---

## 9. Cross-References

- Database scaling: ver `database-scaling-patterns.md`
- Environments e secrets: ver `environment-deployment-patterns.md`
- Security pre-deploy: ver `security-pre-deploy-checklist.md`
