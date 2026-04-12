---
task: model-viral-coefficient
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

# Task: Model Viral Coefficient

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Standard

## Objetivo
Modelar coeficiente viral (K-factor) — quantificar e otimizar a capacidade do produto de crescer organicamente atraves de convites, compartilhamentos e word-of-mouth, identificando alavancas para maximizar viralidade.

## Entrada
- User invite/share behavior data
- Signup source attribution
- Referral program data (if exists)
- Social sharing data

## Passos

### 1. Viral Coefficient Formula
```
K = i × c

K = Viral Coefficient (K-factor)
i = Average invitations sent per user
c = Conversion rate of invitations to new users

When K > 1: Viral growth (each user brings > 1 new user)
When K = 0.5-1.0: Viral amplification (subsidizes acquisition cost)
When K < 0.5: Minimal viral effect
```

### 2. Viral Cycle Components
| Componente | Metrica | Otimizacao |
|-----------|---------|-----------|
| Awareness | % users who know they can invite | In-app prompts, education |
| Intent | % users who want to invite | Value delivery, delight moments |
| Action | % users who actually send invite | Reduce friction, one-click share |
| Reach | Avg invites sent per inviter | Multiple channels, contacts import |
| Impression | % invitees who see the invite | Channel selection, message quality |
| Click | % who click invite link | CTA copy, social proof |
| Signup | % who complete signup | Landing page optimization |
| Activation | % who reach aha moment | Onboarding optimization |

### 3. K-Factor Calculation
```sql
-- K-Factor calculation
WITH invite_data AS (
  SELECT
    DATE_TRUNC('week', invite_date) AS week,
    COUNT(DISTINCT inviter_id) AS inviters,
    COUNT(*) AS total_invites,
    COUNT(CASE WHEN accepted = true THEN 1 END) AS accepted_invites
  FROM invites
  WHERE invite_date >= CURRENT_DATE - 90
  GROUP BY DATE_TRUNC('week', invite_date)
),
user_base AS (
  SELECT
    DATE_TRUNC('week', signup_date) AS week,
    COUNT(DISTINCT user_id) AS total_users
  FROM users
  GROUP BY DATE_TRUNC('week', signup_date)
)
SELECT
  id.week,
  ub.total_users,
  id.inviters,
  id.total_invites,
  id.accepted_invites,
  -- i = invites per user (all users, not just inviters)
  ROUND(id.total_invites::DECIMAL / ub.total_users, 2) AS i_factor,
  -- c = conversion rate
  ROUND(id.accepted_invites::DECIMAL / NULLIF(id.total_invites, 0), 4) AS c_factor,
  -- K = i × c
  ROUND(
    (id.total_invites::DECIMAL / ub.total_users) *
    (id.accepted_invites::DECIMAL / NULLIF(id.total_invites, 0)),
    4
  ) AS k_factor
FROM invite_data id
JOIN user_base ub ON id.week = ub.week
ORDER BY id.week DESC;
```

### 4. Viral Cycle Time
```
Total Users after n cycles = U × (1 + K + K² + K³ + ... + Kⁿ)

If K < 1: Converges to U / (1 - K)
If K = 1: Linear growth (U × n)
If K > 1: Exponential growth
```

| Cycle Time | Impacto | Exemplo |
|-----------|---------|---------|
| < 1 day | Maximum viral | Chat apps (WhatsApp) |
| 1-3 days | Strong viral | Social media (Instagram) |
| 1-2 weeks | Moderate viral | Productivity tools (Notion) |
| 1+ month | Slow viral | Enterprise SaaS |

**Growth projection with K and cycle time:**
| Ciclo | K=0.3, 7d | K=0.5, 7d | K=0.8, 7d | K=1.2, 7d |
|-------|----------|----------|----------|----------|
| Start | 1,000 | 1,000 | 1,000 | 1,000 |
| Cycle 1 | 1,300 | 1,500 | 1,800 | 2,200 |
| Cycle 2 | 1,390 | 1,750 | 2,440 | 3,640 |
| Cycle 3 | 1,417 | 1,875 | 2,952 | 5,568 |
| Cycle 5 | 1,428 | 1,968 | 3,689 | 12,471 |
| Steady state | 1,429 | 2,000 | 5,000 | ∞ (exponential) |

### 5. K-Factor Optimization Levers
| Lever | Impact on i | Impact on c | Difficulty |
|-------|-----------|-----------|-----------|
| One-click share button | ++ | | Low |
| Contacts import | ++ | | Medium |
| Share at delight moment | + | | Medium |
| Personalized invite message | | ++ | Low |
| Social proof on landing | | ++ | Low |
| Double-sided reward | ++ | ++ | Medium |
| Reduce signup friction | | ++ | Medium |
| Rich link previews (OG tags) | | + | Low |
| WhatsApp native share (BR) | ++ | + | Low |
| Referral leaderboard | ++ | | Medium |

### 6. Benchmarks by Industry
| Industria | K-Factor Tipico | Top Performers |
|----------|----------------|---------------|
| Social networks | 0.5-2.0 | > 2.0 (early stage) |
| Messaging | 0.8-1.5 | > 1.5 |
| Productivity SaaS | 0.2-0.5 | > 0.5 |
| E-commerce | 0.1-0.3 | > 0.3 |
| Enterprise B2B | 0.05-0.2 | > 0.2 |
| Gaming | 0.3-0.8 | > 0.8 |
| Fintech | 0.2-0.5 | > 0.5 |

### 7. Viral Dashboard
| Metrica | Visualization | Refresh |
|---------|-------------|---------|
| K-Factor trend | Line chart (weekly) | Weekly |
| Inviter rate | % of users who invite | Weekly |
| Invites per inviter | Histogram | Weekly |
| Invite conversion funnel | Funnel chart | Weekly |
| Viral growth contribution | % of new users from viral | Weekly |
| Cycle time | Days (median) | Weekly |
| K-Factor by channel | Bar chart (WhatsApp, Email, Link) | Weekly |

## Saida
- K-Factor calculation + trend
- Viral funnel analysis
- Optimization recommendations
- Growth projection model
- Viral dashboard spec

## Validacao
- [ ] K-Factor calculado com dados reais
- [ ] Viral funnel mapeado (8 steps)
- [ ] Cycle time medido
- [ ] Growth projection com cenarios
- [ ] Pelo menos 5 optimization levers identificados
- [ ] Dashboard de viral metrics definido
- [ ] Benchmark comparativo incluido
