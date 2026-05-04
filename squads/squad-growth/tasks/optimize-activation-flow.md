---
task: optimize-activation-flow
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

# Task: Optimize Activation Flow

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Standard

## Objetivo
Otimizar activation flow — melhorar a taxa de usuarios que atingem o "aha moment" (primeiro valor) rapidamente apos o signup, convertendo signups em usuarios ativos e reduzindo early churn.

## Entrada
- Current signup-to-activation funnel data
- "Aha moment" definition
- User behavior data (first 7 days)
- Drop-off analysis

## Passos

### 1. Aha Moment Definition
| Produto | Aha Moment | Metrica de Ativacao |
|---------|-----------|-------------------|
| SaaS | Primeiro resultado tangivel | Feature X used within D3 |
| E-commerce | Primeira compra satisfatoria | Purchase + no return D7 |
| Marketplace | Primeiro match/transacao | First successful transaction |
| Content | Primeiro engajamento profundo | 3+ articles read or subscribe |
| Social | Primeira conexao significativa | 7 friends added in D10 (Facebook) |

**Definir para este produto:**
| Criterio | Valor |
|----------|-------|
| Aha moment event | |
| Time window | Dentro de ___ dias do signup |
| Current activation rate | ___% |
| Target activation rate | ___% |

### 2. Activation Funnel
| Step | Evento | Rate Atual | Target | Drop-off |
|------|--------|-----------|--------|---------|
| Signup complete | sign_up_complete | 100% | 100% | — |
| Email verified | email_verified | | | |
| Profile complete | profile_complete | | | |
| First action | first_core_action | | | |
| Aha moment | aha_moment_reached | | | |
| Retained D7 | return_visit_d7 | | | |

### 3. Activation Barriers
| Barreira | Tipo | Impacto | Solucao |
|---------|------|--------|---------|
| Long signup form | Friction | Alto | Progressive profiling |
| Unclear next step | Confusion | Alto | Guided onboarding |
| Feature overload | Overwhelm | Medio | Focus on core action |
| No immediate value | Value gap | Alto | Quick win / sample data |
| Verification required | Friction | Medio | Defer verification |
| Empty state | Engagement | Alto | Pre-populated data, templates |
| Missing context | Understanding | Medio | Tooltips, guided tour |

### 4. Activation Strategies
| Estrategia | Descricao | Impacto Esperado |
|-----------|----------|-----------------|
| Single Sign-On | Google/Apple login, reduce fields | +15-30% signup completion |
| Progressive profiling | Ask minimum upfront, rest later | +10-20% activation |
| Welcome flow | Step-by-step guided first experience | +20-40% aha moment |
| Template/sample data | Pre-populate with useful examples | +15-25% first action |
| Checklist gamification | "Complete your setup" progress bar | +10-20% feature adoption |
| Personalized path | Branch flow based on user goal | +15-30% activation |
| Time-to-value focus | Skip non-essential steps | +20-35% activation |
| Social proof in flow | "10,000 users completed this" | +5-10% completion |

### 5. Behavioral Triggers (First 7 Days)
| Dia | Trigger | Canal | Mensagem |
|-----|---------|-------|---------|
| D0 | Signup, not activated | In-app | Welcome modal + first action CTA |
| D0+2h | Signup, left without action | Email | "Complete your setup in 2 min" |
| D1 | Not returned | Push/Email | Quick tip + value reminder |
| D2 | Returned but no core action | In-app | Guided tour prompt |
| D3 | Core action done, not aha | Email | "Try [advanced feature] next" |
| D5 | Still not activated | Email | Social proof + limited offer |
| D7 | Not activated | Email | "Need help?" + personal touch |

### 6. A/B Test Ideas for Activation
| Teste | Variante A | Variante B | Metrica |
|-------|-----------|-----------|---------|
| Signup flow | Multi-step form | Single page | Signup completion |
| First screen | Feature tour | Quick action CTA | Time to first action |
| Onboarding | Self-guided | Interactive walkthrough | Aha moment rate |
| Empty state | Blank canvas | Pre-loaded template | First creation |
| CTA copy | "Get Started" | "See it in action" | Click-through |

### 7. Activation Metrics
| Metrica | Formula | Target |
|---------|---------|--------|
| Signup-to-Activation Rate | Activated D7 / Signups | > 40% |
| Time to Activation | Median time signup → aha | < 1 hour |
| Time to First Action | Median time signup → first action | < 5 min |
| Setup Completion Rate | Completed setup / Started setup | > 70% |
| D1 Return Rate | Returned D1 / Signups | > 30% |
| Activation-to-Retention | Retained D30 / Activated D7 | > 60% |

## Saida
- Aha moment definition + validation
- Activation funnel analysis
- Barrier identification + solutions
- Behavioral trigger sequence
- A/B test backlog
- Activation metrics dashboard

## Validacao
- [ ] Aha moment definido e validado com dados
- [ ] Funnel de ativacao mapeado com drop-offs
- [ ] Barreiras identificadas e priorizadas
- [ ] Estrategias de otimizacao selecionadas
- [ ] Trigger sequence configurada (D0-D7)
- [ ] A/B tests priorizados
- [ ] Metricas de ativacao trackadas
