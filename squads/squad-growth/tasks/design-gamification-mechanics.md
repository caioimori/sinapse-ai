---
task: design-gamification-mechanics
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

# Task: Design Gamification Mechanics

## Metadata
- **Squad:** squad-growth
- **Agent:** Lever (ga-growth-hacker)
- **Complexity:** Standard

## Objetivo
Desenhar mecanicas de gamificacao — implementar elementos de game design que aumentam engajamento, motivacao intrinseca e retencao sem comprometer a experiencia core do produto.

## Entrada
- User behavior data
- Engagement metrics
- Product core actions
- Target behaviors to incentivize

## Passos

### 1. Octalysis Framework (Yu-kai Chou)
| Core Drive | Descricao | Mecanica | Tipo |
|-----------|----------|---------|------|
| 1. Epic Meaning | Sentir-se parte de algo maior | Mission statement, community | White hat |
| 2. Development | Crescimento e conquista | XP, levels, badges | White hat |
| 3. Empowerment | Criatividade e feedback | Custom creations, boosters | White hat |
| 4. Ownership | Posse e acumulo | Collections, virtual goods, data | White hat |
| 5. Social Influence | Conexao social | Teams, gifting, mentoring | Neutral |
| 6. Scarcity | Escassez e impaciencia | Limited time, countdown, exclusivity | Black hat |
| 7. Unpredictability | Curiosidade e surpresa | Random rewards, mystery boxes | Black hat |
| 8. Avoidance | Evitar perda | Streaks, expiring points, FOMO | Black hat |

### 2. Gamification Elements Catalog
| Elemento | Tipo | Impacto | Complexidade |
|---------|------|--------|-------------|
| Points/XP | Progress | Medio | Baixa |
| Badges/Achievements | Recognition | Medio | Baixa |
| Leaderboards | Competition | Alto | Media |
| Levels/Tiers | Progression | Alto | Media |
| Streaks | Consistency | Alto | Baixa |
| Challenges/Quests | Engagement | Alto | Media |
| Progress bars | Completion | Medio | Baixa |
| Unlockable features | Aspiration | Alto | Alta |
| Virtual currency | Economy | Alto | Alta |
| Teams/Guilds | Collaboration | Alto | Alta |

### 3. Points & XP System
| Acao | XP | Frequencia Max | Categoria |
|------|-----|---------------|----------|
| Login diario | 10 | 1/day | Engagement |
| Completar core action | 50 | Unlimited | Value |
| Completar onboarding item | 100 | 1/item | Setup |
| Convidar amigo (aceito) | 200 | 5/week | Growth |
| Streak de 7 dias | 150 (bonus) | 1/week | Retention |
| Primeiro uso de feature | 75 | 1/feature | Discovery |
| Feedback/review | 50 | 1/week | Community |

### 4. Level/Tier System
| Level | XP Required | Titulo | Beneficio |
|-------|------------|--------|----------|
| 1 | 0 | Novato | Acesso basico |
| 2 | 500 | Aprendiz | Badge visivel |
| 3 | 1,500 | Praticante | Feature desbloqueada |
| 4 | 3,500 | Especialista | Priority support |
| 5 | 7,000 | Master | Beta access |
| 6 | 12,000 | Expert | Custom profile |
| 7 | 20,000 | Legend | Hall of fame + mentor status |

### 5. Achievement/Badge System
| Badge | Criterio | Raridade | Motivacao |
|-------|---------|---------|----------|
| First Steps | Complete onboarding | Common (80%) | Setup |
| Consistent | 7-day streak | Uncommon (40%) | Habit |
| Explorer | Use 5 different features | Uncommon (30%) | Discovery |
| Connector | Invite 3 friends | Rare (15%) | Viral |
| Power User | 30-day streak | Rare (10%) | Retention |
| Top Performer | Top 10% in leaderboard | Epic (5%) | Competition |
| Veteran | Active for 12 months | Legendary (2%) | Loyalty |

### 6. Anti-Patterns (O que NAO fazer)
| Anti-Pattern | Problema | Alternativa |
|-------------|---------|------------|
| Gamification antes do valor | User nao entende o produto | Primeiro value, depois game |
| Reward trivial actions | Inflacao de pontos, perda de sentido | Reward meaningful actions |
| Excessive competition | Desmotiva 80% dos users | Cooperative + self-improvement |
| Mandatory gamification | Frustra users serios | Opt-in, hide if not engaged |
| Pay-to-win | Percebido como injusto | Cosmetic-only premium |
| Complex economy | Confusing, hard to balance | Simple, transparent rules |
| Fake scarcity | Erode trust | Real scarcity or none |

### 7. Gamification Metrics
| Metrica | Formula | Target |
|---------|---------|--------|
| Feature adoption lift | Adoption with gamification / without | > 1.3x |
| Engagement increase | DAU/MAU with vs without | > 15% lift |
| Retention impact | D30 retention gamified vs control | > 10pp lift |
| Badge collection rate | Avg badges per user at D30 | 3-5 badges |
| Leaderboard participation | Users checking leaderboard / Total | > 25% |
| Streak maintenance | Users maintaining 7+ day streak | > 15% |
| Gamification opt-out | Users hiding/disabling elements | < 10% |

## Saida
- Gamification design document
- Points/XP system spec
- Level/tier progression
- Achievement catalog
- Anti-pattern checklist
- Metrics dashboard spec

## Validacao
- [ ] Framework de gamificacao selecionado (Octalysis ou similar)
- [ ] Balance entre white hat e black hat drives
- [ ] Points system com acoes e pesos definidos
- [ ] Level progression com beneficios tangíveis
- [ ] Anti-patterns verificados
- [ ] Metricas de impacto definidas
- [ ] Plano de A/B test para validar
