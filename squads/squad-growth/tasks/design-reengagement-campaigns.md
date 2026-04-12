---
task: design-reengagement-campaigns
responsavel: "@ga-growth-hacker"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Design Re-engagement Campaigns

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Standard

## Objetivo
Desenhar campanhas de re-engajamento — criar estrategia multi-canal para reativar usuarios inativos e churned, segmentando por tempo de inatividade, valor e probabilidade de retorno.

## Entrada
- Inactive/churned user segments
- Last activity data
- Historical value (LTV/spend)
- Previous engagement patterns
- Churn reason data (if available)

## Passos

### 1. Inactivity Segmentation
| Segmento | Inatividade | Probabilidade de Retorno | Investimento |
|---------|-----------|------------------------|-------------|
| At Risk | 7-14 days | Alta (60-80%) | Alto — prevent churn |
| Lapsed | 15-30 days | Media (30-50%) | Medio |
| Dormant | 31-90 days | Baixa (10-25%) | Seletivo por valor |
| Churned | 91-180 days | Muito baixa (5-10%) | Apenas high-value |
| Lost | 180+ days | Minimal (< 5%) | Ultimo esforco ou sunset |

### 2. Re-engagement Campaign Matrix
| Segmento | Canal 1 | Canal 2 | Canal 3 | Incentivo |
|---------|---------|---------|---------|----------|
| At Risk | In-app message | Push notification | Email | Feature highlight |
| Lapsed | Email sequence | Push | Retargeting ads | Discount/offer |
| Dormant | Email win-back | Retargeting | Direct mail (high value) | Special offer |
| Churned | Personal email/call | Retargeting | Social | Major upgrade/discount |
| Lost | Final email | — | — | Survey + final offer |

### 3. Email Sequence — At Risk (7-14 days)
| Email | Timing | Subject Line | Conteudo | CTA |
|-------|--------|-------------|---------|-----|
| 1 | Day 7 | "We miss you, [Name]!" | Show what they're missing | "See what's new" |
| 2 | Day 10 | "[X] happened while you were away" | Personalized updates/activity | "Catch up now" |
| 3 | Day 14 | "Quick question, [Name]" | Ask if they need help | "Reply" or "Get help" |

### 4. Email Sequence — Lapsed (15-30 days)
| Email | Timing | Subject Line | Conteudo | CTA |
|-------|--------|-------------|---------|-----|
| 1 | Day 15 | "Things have changed since you left" | New features, improvements | "See what's new" |
| 2 | Day 20 | "[Name], here's a gift for you" | Exclusive discount or credit | "Claim your offer" |
| 3 | Day 25 | "Your [data/project] is waiting" | Remind of stored value | "Continue where you left off" |
| 4 | Day 30 | "Last chance: [offer] expires tomorrow" | Urgency + final offer | "Come back now" |

### 5. Email Sequence — Dormant/Churned (31-90+ days)
| Email | Timing | Subject Line | Conteudo | CTA |
|-------|--------|-------------|---------|-----|
| 1 | Day 45 | "A lot has changed at [Product]" | Major updates roundup | "See the new [Product]" |
| 2 | Day 60 | "[Name], we'd love you back" | Emotional + special offer | "Reactivate with [discount]" |
| 3 | Day 90 | "Before we say goodbye..." | Ask why they left + final offer | "Tell us why" or "Come back" |

### 6. Multi-Channel Orchestration
```
Day 0: User becomes "At Risk" (no activity 7 days)
  │
  ├─ Day 7: Email 1 (content-focused)
  ├─ Day 8: Push notification (if enabled)
  │
  ├─ Day 10: Email 2 (personalized)
  │    └─ If opened but no action: In-app banner next visit
  │
  ├─ Day 14: Email 3 (help-focused)
  │    └─ If no open: Start retargeting ads
  │
  ├─ Day 20: Email 4 (incentive)
  │    └─ Retargeting ads with offer
  │
  ├─ Day 30: Email 5 (urgency)
  │    └─ If high-value: Personal outreach (CS team)
  │
  ├─ Day 60: Win-back email (major changes)
  │
  └─ Day 90: Sunset email (final + survey)
       └─ If no response: Move to suppression list
```

### 7. Personalization Strategies
| Tipo | Dados Usados | Exemplo |
|------|-------------|---------|
| Content-based | Last features used | "Your dashboard has new insights" |
| Achievement-based | Progress/level | "You were at Level 4 — pick up where you left off" |
| Social-based | Team/friends activity | "Your team posted 5 updates" |
| Value-based | Revenue/savings generated | "You saved R$2,400 last quarter" |
| Fear of loss | Data/content at risk | "Your projects will be archived in 30 days" |
| Surprise | Random reward | "We saved you a gift — claim in 24h" |

### 8. Re-engagement Metrics
| Metrica | Formula | Target |
|---------|---------|--------|
| Reactivation rate | Reactivated users / Campaign recipients | > 10% (at-risk), > 5% (dormant) |
| Email open rate | Opens / Delivered | > 25% |
| Email click rate | Clicks / Opens | > 5% |
| Return visit rate | Users who visited / Recipients | > 15% |
| Re-retained D30 | Still active 30 days after reactivation | > 40% |
| Revenue from reactivated | Revenue from segment / Total revenue | Track MoM |
| Campaign ROI | (Revenue gained - Campaign cost) / Cost | > 3x |
| Unsubscribe rate | Unsubs / Delivered | < 1% |

## Saida
- Re-engagement campaign strategy
- Email sequences per segment
- Multi-channel orchestration flow
- Personalization playbook
- Metrics dashboard spec
- Suppression/sunset policy

## Validacao
- [ ] Segmentos de inatividade definidos (5 niveis)
- [ ] Campanhas desenhadas por segmento
- [ ] Email sequences com timing e copy
- [ ] Multi-channel orchestration documentado
- [ ] Personalizacao implementada
- [ ] Sunset policy definida
- [ ] Metricas de eficacia trackadas
