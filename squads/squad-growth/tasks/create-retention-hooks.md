---
task: create-retention-hooks
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

# Task: Create Retention Hooks

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Advanced

## Objetivo
Criar retention hooks — implementar mecanismos psicologicos e de produto que criam habito de uso, aumentam switching costs e reduzem churn, usando frameworks como Hook Model (Nir Eyal) e Fogg Behavior Model.

## Entrada
- User behavior patterns
- Churn analysis data
- Product feature usage data
- Competitive analysis

## Passos

### 1. Hook Model Framework (Nir Eyal)
```
┌──────────────────────────────────────┐
│           HOOK CYCLE                 │
│                                      │
│  TRIGGER ──────► ACTION              │
│     ▲                 │              │
│     │                 ▼              │
│  INVESTMENT ◄── VARIABLE REWARD      │
│                                      │
└──────────────────────────────────────┘
```

| Fase | Descricao | Exemplo |
|------|----------|---------|
| Trigger | Externo (push, email) ou Interno (emocao, rotina) | "You have 3 new notifications" |
| Action | Acao simples com motivacao + habilidade | Click, open app, check dashboard |
| Variable Reward | Recompensa imprevisivel (Tribe, Hunt, Self) | New content, metrics update, achievement |
| Investment | Usuario deposita valor (dados, tempo, social) | Profile, connections, custom config |

### 2. Trigger Design
| Tipo | Mecanismo | Exemplo | Frequency |
|------|----------|---------|----------|
| External: Push | Notificacao mobile | "Weekly report ready" | Weekly |
| External: Email | Digest/summary | "Your stats this week" | Weekly |
| External: In-app | Badge/indicator | Red dot on new feature | On event |
| Internal: Routine | Habito associado | "Check dashboard every morning" | Daily |
| Internal: Emotion | FOMO, curiosity | "What are my numbers today?" | Daily |
| Internal: Social | Social obligation | "Team member needs your input" | On event |

**Trigger Graduation:**
```
External triggers (weeks 1-4)
  → Paired triggers (weeks 4-8): external + internal forming
    → Internal triggers (week 8+): habit formed, external optional
```

### 3. Variable Reward Types
| Tipo | Descricao | Implementacao |
|------|----------|-------------|
| Rewards of the Tribe | Social validation | Likes, comments, leaderboards |
| Rewards of the Hunt | Information/resources | New insights, deals, content |
| Rewards of the Self | Mastery/completion | Progress bars, achievements, streaks |

### 4. Investment Mechanisms (Switching Costs)
| Investment Type | Exemplo | Switching Cost |
|----------------|---------|---------------|
| Data/content | Documents, projects, history | Muito alto |
| Social connections | Team members, followers | Alto |
| Configuration | Custom workflows, settings | Alto |
| Learning curve | Mastered shortcuts, features | Medio |
| Reputation | Reviews, badges, level | Alto |
| Financial | Annual plan, credits acumulados | Alto |
| Integration | Connected tools, APIs | Muito alto |

### 5. Fogg Behavior Model Application
```
B = M × A × P (Behavior = Motivation × Ability × Prompt)
```

| Componente | Otimizacao | Tatica |
|-----------|-----------|--------|
| Motivation | Increase desire to act | Show value delivered, social proof, loss aversion |
| Ability | Make action easier | Reduce steps, pre-fill, shortcuts, defaults |
| Prompt | Trigger at right moment | Contextual triggers, time-based, event-based |

**Key insight:** If motivation is low, make action incredibly easy. If ability is high, lighter prompts work.

### 6. Retention Hook Catalog
| Hook | Mecanismo Psicologico | Implementacao |
|------|---------------------|-------------|
| Streaks | Loss aversion + consistency | Duolingo-style day counter |
| Progress bars | Endowed progress effect | "Your profile is 70% complete" |
| Personalized digest | Curiosity + FOMO | Weekly email with unique insights |
| Leaderboard | Competition + social proof | Ranking between users/teams |
| Stored value | Sunk cost + investment | Saved preferences, history, data |
| Anniversaries | Milestone + reflection | "You've been with us for 1 year!" |
| Social proof alerts | Tribe rewards | "[Friend] just completed [action]" |
| Expiring benefits | Scarcity + loss aversion | "Use your 3 free credits before Friday" |
| Surprise rewards | Variable ratio reinforcement | Random bonus, surprise feature unlock |
| Community content | Tribe + hunt rewards | New posts from followed topics |

### 7. Retention Hook Prioritization
| Hook | Impacto na Retencao | Custo de Implementacao | Tempo | Prioridade |
|------|-------------------|---------------------|-------|-----------|
| | Alto/Medio/Baixo | Alto/Medio/Baixo | Days/Weeks | P0/P1/P2 |

### 8. Measurement
| Metrica | Medida | Target |
|---------|--------|--------|
| Hook engagement rate | Users engaging with hook / Total | > 30% |
| Habit zone users | Users with internal triggers / Total | > 20% |
| DAU/MAU stickiness | Daily active / Monthly active | > 20% |
| Retention lift | Retention with hook vs without | > 10pp |
| Investment depth | Avg stored data/config per user | Increasing MoM |
| Time to habit | Days until internal trigger forms | < 21 days |

## Saida
- Hook Model analysis for product
- Trigger strategy (external → internal)
- Variable reward design
- Investment mechanism catalog
- Retention hook priority list
- Measurement framework

## Validacao
- [ ] Hook Model aplicado ao produto (4 fases)
- [ ] Fogg Model usado para otimizar cada hook
- [ ] Pelo menos 5 retention hooks desenhados
- [ ] Trigger graduation path definido
- [ ] Investment mechanisms identificados
- [ ] Hooks priorizados por impacto vs custo
- [ ] Metricas de eficacia definidas
