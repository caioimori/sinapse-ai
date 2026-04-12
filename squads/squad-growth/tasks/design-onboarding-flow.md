---
task: design-onboarding-flow
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

# Task: Design Onboarding Flow

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Standard

## Objetivo
Desenhar onboarding flow — criar experiencia de primeiro uso que guia o usuario do signup ao primeiro valor, maximizando ativacao e criando habito de uso.

## Entrada
- User personas and goals
- Core product value proposition
- Current onboarding flow (if exists)
- Activation data and benchmarks

## Passos

### 1. Onboarding Patterns
| Pattern | Descricao | Melhor Para | Exemplo |
|---------|----------|------------|---------|
| Product Tour | Walkthrough guiado do produto | Complex SaaS | Notion, Figma |
| Progressive Disclosure | Revela features gradualmente | Feature-rich products | Slack |
| Task-Based | "Complete essas 3 tarefas" | Goal-oriented products | Asana |
| Wizard | Step-by-step setup obrigatorio | Config-heavy products | HubSpot |
| Learn by Doing | Sandbox com dados de exemplo | Creative tools | Canva |
| Video Walkthrough | Video curto mostrando valor | Visual products | Loom |
| Empty State CTA | Guide via empty states | Simple products | Todoist |

### 2. Onboarding Flow Structure
```
┌────────────────────────────────────────┐
│ PHASE 1: SIGNUP (minimize friction)    │
│ • Social login (Google/Apple)          │
│ • Email + password only               │
│ • Skip everything non-essential        │
│              │                         │
│              ▼                         │
│ PHASE 2: PERSONALIZATION (1-3 questions)│
│ • "What's your role?"                  │
│ • "What's your main goal?"             │
│ • "How big is your team?"              │
│ → Customize experience based on answers│
│              │                         │
│              ▼                         │
│ PHASE 3: QUICK WIN (< 2 minutes)      │
│ • Template selection or sample data    │
│ • Guide to first core action           │
│ • Celebrate completion!                │
│              │                         │
│              ▼                         │
│ PHASE 4: DEEPER VALUE (next session)   │
│ • Advanced features introduction       │
│ • Team invite prompt                   │
│ • Integration setup                    │
│              │                         │
│              ▼                         │
│ PHASE 5: HABIT (first 2 weeks)         │
│ • Streak/progress tracking             │
│ • Contextual tips per feature          │
│ • Milestone celebrations               │
└────────────────────────────────────────┘
```

### 3. Onboarding Checklist Design
| Item | Descricao | Reward | Priority |
|------|----------|--------|---------|
| Complete profile | Foto + bio | Personalized experience | P1 |
| First core action | Criar/fazer primeiro item | Celebracao + badge | P0 |
| Explore feature X | Usar feature secundaria | Tooltip unlock | P2 |
| Invite teammate | Convidar 1 pessoa | Extended trial / bonus | P1 |
| Connect integration | Integrar ferramenta externa | Workflow automation | P2 |

**Design rules:**
- Maximum 5 items in checklist
- Most important item first
- Show progress (3/5 complete)
- Allow skip but encourage completion

### 4. Personalization Branches
| Resposta | Path | Conteudo Adaptado |
|---------|------|------------------|
| Role: Marketing | Marketing-focused tour | Templates de marketing, dashboards de campanha |
| Role: Developer | Technical tour | API docs, integracoes, CLI |
| Role: Manager | Overview tour | Dashboards, reports, team features |
| Goal: Save time | Efficiency path | Automations, templates, shortcuts |
| Goal: Grow revenue | Growth path | Analytics, A/B testing, funnels |
| Team: Solo | Individual setup | Personal workspace |
| Team: 2-10 | Team setup | Invite flow, shared spaces |
| Team: 10+ | Enterprise setup | Admin panel, roles, SSO |

### 5. Empty State Strategy
| Tela | Empty State Atual | Otimizado |
|------|-------------------|----------|
| Dashboard | "No data yet" | Pre-populated sample dashboard + "Start tracking" CTA |
| Projects | "No projects" | Template gallery + "Create from template" CTA |
| Team | "No members" | "Invite your team" + social proof ("Teams of 3+ are 2x more productive") |
| Reports | "No reports" | Sample report + "Generate your first report" |

### 6. Onboarding Emails (Lifecycle Sequence)
| Email # | Timing | Subject | Conteudo | CTA |
|---------|--------|---------|---------|-----|
| 1 | Immediate | Welcome to [Product]! | Quick start guide (3 steps) | "Complete setup" |
| 2 | D1 | Your first [action] in 2 min | Tutorial for core action | "Try now" |
| 3 | D3 | Did you know about [feature]? | Secondary feature intro | "Explore" |
| 4 | D5 | [Name], your progress | Checklist progress summary | "Keep going" |
| 5 | D7 | Teams get 2x more value | Team invite prompt | "Invite team" |
| 6 | D14 | Your first 2 weeks recap | Value delivered summary | "Upgrade" or "Share" |

### 7. Onboarding Metrics
| Metrica | Formula | Target |
|---------|---------|--------|
| Signup-to-Setup | Completed setup / Started signup | > 60% |
| Setup Completion Time | Median time to finish onboarding | < 3 min |
| Checklist Completion | Items completed / Total items | > 60% |
| Quick Win Rate | Users reaching first value / Signups | > 50% |
| D1 Return Rate | Users returning D1 / Signups | > 30% |
| Onboarding NPS | NPS survey after onboarding | > 40 |
| Skip Rate | Users who skip onboarding / Total | < 30% |
| Feature Discovery Rate | Users using 3+ features D7 / Total | > 40% |

## Saida
- Onboarding flow design (visual)
- Personalization matrix
- Empty state designs
- Email lifecycle sequence
- Checklist specification
- Metrics dashboard

## Validacao
- [ ] Pattern de onboarding selecionado com justificativa
- [ ] Flow de 5 fases documentado
- [ ] Personalizacao com pelo menos 3 branches
- [ ] Empty states otimizados
- [ ] Email sequence (6 emails, D0-D14)
- [ ] Checklist com max 5 items
- [ ] Metricas de onboarding definidas
