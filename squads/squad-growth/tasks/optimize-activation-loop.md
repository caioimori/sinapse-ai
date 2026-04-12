---
task: optimize-activation-loop
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

# Task: Optimize Activation Loop

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Advanced

## Objetivo
Optimize user activation by identifying the aha moment, reducing time-to-value, designing activation milestones, implementing progressive onboarding, and measuring activation rate by cohort and channel.

## Entrada
- User behavior data (event-level)
- Signup-to-activation funnel metrics
- Cohort retention curves
- Onboarding flow current state

## Passos

### 1. Identify Aha Moment
- Correlate early user actions (day 0-7) with long-term retention (day 30+)
- Find the action most predictive of retention
- Examples: "added 3 friends in first week" (Facebook), "sent first message" (Slack)

**Analysis approach:**
```
For each early action A:
  retention_with_A = % of users who did A and retained at day 30
  retention_without_A = % of users who didn't do A and retained at day 30
  lift = retention_with_A / retention_without_A
  → Highest lift = strongest aha moment candidate
```

### 2. Reduce Time-to-Value
| Friction Point | Optimization |
|---------------|-------------|
| Long signup form | Progressive profiling, social login |
| Complex setup | Smart defaults, templates |
| Empty state | Pre-populated data, sample content |
| Feature overload | Guided tour, progressive disclosure |
| Unclear next step | Clear CTAs, checklist |

### 3. Activation Milestones
| Milestone | Description | Target Time |
|-----------|-------------|------------|
| Signup complete | Account created and verified | < 2 min |
| First value action | Core feature used once | < 10 min |
| Aha moment | Predictive action completed | < 24 hours |
| Habit formation | Repeated use (3+ sessions) | < 7 days |
| Activated | Meets activation criteria | < 14 days |

### 4. Progressive Onboarding
- **Step 1:** Essential setup only (name, role)
- **Step 2:** Guided first action (with tooltip/coach marks)
- **Step 3:** Second key action with contextual help
- **Step 4:** Social/collaborative feature introduction
- **Step 5:** Advanced features unlocked gradually

### 5. Measure Activation by Cohort and Channel
| Dimension | Metrics |
|-----------|---------|
| By cohort (weekly) | Activation rate, time-to-activate, drop-off step |
| By channel | Activation rate per acquisition source |
| By device | Mobile vs desktop activation completion |
| By plan | Free vs paid activation patterns |
| By segment | User type/persona activation differences |

## Saida
- Aha moment identification with data evidence
- Time-to-value optimization plan
- Activation milestone framework
- Progressive onboarding design
- Activation dashboard with cohort/channel breakdowns

## Validacao
- [ ] Aha moment identified with correlation data
- [ ] Time-to-value friction points mapped with solutions
- [ ] Activation milestones defined with target timeframes
- [ ] Progressive onboarding flow designed
- [ ] Activation metrics defined by cohort and channel
- [ ] Experiment plan for activation improvements
