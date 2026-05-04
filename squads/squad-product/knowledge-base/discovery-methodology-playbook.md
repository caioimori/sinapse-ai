# Discovery Methodology Playbook

## Purpose
Guia pratico de metodologias de discovery com instrucoes de quando e como usar cada metodo.

## Core Philosophy
Discovery is a continuous habit, not a phase. The goal is to reduce risk before investing in development by gathering evidence about user needs, market context, and solution viability.

## Continuous Discovery Habits — Teresa Torres (Deep Reference)

Teresa Torres (Continuous Discovery Habits, 2021) formalizou o framework mais completo de discovery moderno. Central piece: o **Opportunity Solution Tree (OST)**.

### Opportunity Solution Tree

```
Desired Outcome (metrica de negocio — ex: aumentar retencao D30)
├── Opportunity 1 (problema/necessidade do usuario)
│   ├── Solution A → Assumption Map → Experiment
│   ├── Solution B → Assumption Map → Experiment
│   └── Solution C → Assumption Map → Experiment
├── Opportunity 2 (problema/necessidade do usuario)
│   ├── Solution A → Assumption Map → Experiment
│   └── Solution B → Assumption Map → Experiment
└── Opportunity 3 (problema/necessidade do usuario)
    └── Solutions...
```

**Principios da OST:**
1. Outcomes sao metricas de negocio — nao features, nao outputs
2. Opportunities sao necessidades, desejos e pain points dos usuarios — nao solucoes
3. Solutions devem ser testadas via experimentos antes de serem construidas
4. Product Trio (PM + Design + Engineering) trabalha junto — nao PM sozinho

### Weekly Touchpoints (O Habito Central)

Torres argumenta que o maior erro em discovery e fazer pesquisa em "fases" — um sprint de discovery antes de um sprint de desenvolvimento. Isso cria gaps de feedback lentos.

**O habito semanal:**
```
Toda semana:
  - Pelo menos 1 entrevista com usuario (produto trio presente)
  - Sintetizar insights no OST
  - Identificar oportunidades novas ou validar/invalidar existentes
  - Decidir experimento para a proxima semana
```

**Por que semanal?**
- Ciclos mensais = 12 aprendizados por ano
- Ciclos semanais = 52 aprendizados por ano
- A velocidade de aprendizado determina a velocidade de product-market fit

### Assumption Mapping

Antes de construir qualquer solucao, mapear as hipoteses que precisam ser verdadeiras para a solucao funcionar:

```
Para cada solucao identificada na OST:
  1. Listar todas as hipoteses (desirable / viable / feasible / usable)
  2. Rankear por: [impacto no resultado] × [incerteza]
  3. A hipotese mais critica e mais incerta = proximo experimento
  
Quadrantes:
  Alta incerteza + Alto impacto → Testar primeiro
  Alta incerteza + Baixo impacto → Testar depois
  Baixa incerteza + Alto impacto → Monitorar
  Baixa incerteza + Baixo impacto → Ignorar (por ora)
```

**Tipos de hipoteses:**
- **Desirability:** Usuarios querem isso? Resolve o problema deles?
- **Viability:** O negocio pode sustentar isso? (preco, operacao, legal)
- **Feasibility:** O time consegue construir isso? (tech, tempo, recursos)
- **Usability:** Os usuarios conseguem usar? (UX, aprendizado)

### Story Mapping (Jeff Patton)

Story maps visualizam a jornada do usuario com o produto para identificar oportunidades de discovery:

```
Activities (niveis altos da jornada):
  Descobrir → Registrar → Configurar → Usar → Compartilhar

Tasks (acoes especificas por activity):
  Descobrir: [busca Google] [ver ad] [recomendacao amigo]
  Registrar: [criar conta] [verificar email] [configurar perfil]
  ...

Stories (detalhes de implementacao) ficam abaixo das tasks
```

Story mapping e especialmente util para:
- Identificar lacunas na jornada atual
- Priorizar o "walking skeleton" (fluxo minimo de valor)
- Alinhar toda a equipe na visao do produto

## Method Selection Guide

### By Research Question Type
| Question | Best Methods | Sample Size |
|----------|-------------|-------------|
| "Do users have this problem?" | Problem interviews, support analysis | 5-8 interviews |
| "How do users solve this today?" | Contextual inquiry, diary study | 5-8 sessions |
| "Will users use this solution?" | Prototype test, smoke test | 5-8 users |
| "Which design works better?" | A/B test, usability test | 5-8 (usability) / 1000+ (A/B) |
| "How many users are affected?" | Analytics, survey | 50+ survey / full dataset |
| "What do users value most?" | MaxDiff, conjoint, interviews | 50+ (quantitative) |

### Method Quick Reference

**User Interviews (Generative)**
- When: Understanding problems, motivations, context
- Duration: 45-60 min per session
- Sample: 5-8 per segment
- Output: Insight cards, pattern analysis
- Key rule: No pitching, follow The Mom Test

**Usability Testing (Evaluative)**
- When: Testing if a design works
- Duration: 45-60 min per session
- Sample: 5 users find ~85% of issues (Nielsen)
- Output: Task success rates, finding cards
- Key rule: Test tasks, not features

**Surveys (Quantitative)**
- When: Validating qualitative findings at scale
- Duration: <5 min to complete
- Sample: 50+ for patterns, 200+ for significance
- Output: Statistical validation, segmentation
- Key rule: Never use alone (combine with qualitative)

**Analytics Analysis**
- When: Understanding behavior patterns
- Duration: Hours of analysis
- Sample: Full user base
- Output: Funnel analysis, cohort analysis, feature usage
- Key rule: Shows WHAT, not WHY (pair with interviews)

**Prototype Testing**
- When: Validating solution before development
- Duration: 30-60 min per session
- Sample: 5-8 users
- Output: Usability findings, design recommendations
- Key rule: Test the concept, not the polish

**A/B Experiment**
- When: Measuring causal impact of change
- Duration: 1-4 weeks (depends on traffic)
- Sample: Calculated per experiment (see formula)
- Output: Statistical result, learning card
- Key rule: No peeking before planned end date

## Triangulation Framework
Always use 2+ methods to validate important findings:
```
Qualitative (WHY) + Quantitative (HOW MANY) = Strong Evidence
Behavioral (WHAT THEY DO) + Attitudinal (WHAT THEY SAY) = Complete Picture
```

## Research Ethics
- Always get informed consent
- Protect participant privacy (no PII in reports)
- Compensate participants fairly
- Be honest about purpose of research
- Allow participants to stop at any time
- Never deceive participants about product intent

## Jobs-to-be-Done (JTBD) — Deep Reference

Clayton Christensen / Bob Moesta framework para entender a motivacao real por tras de comportamentos do usuario.

### Os 3 Tipos de Job

```
Functional Job: O que o usuario quer fazer
  "Enviar arquivo grande rapidamente para um cliente"

Emotional Job: Como quer se sentir ao fazer isso
  "Parecer profissional e organizado"

Social Job: Como quer ser percebido pelos outros
  "Ser o tipo de pessoa que usa ferramentas modernas"
```

**Para produto:** Construir para o Functional Job sem considerar Emotional e Social Job frequentemente cria produtos tecnicamente corretos mas que ninguem adota.

### Switch Interview (Bob Moesta)

Para entender por que usuarios mudaram de produto (ou adotaram o novo):

```
Timeline Interview:
  1. "Quando voce primeiro pensou em procurar uma alternativa?"
  2. "O que aconteceu que fez isso urgente?"
  3. "O que voce fez primeiro?" (buying journey)
  4. "Quais outras opcoes voce considerou?"
  5. "Por que voce escolheu [nosso produto]?"
  6. "Como foi o primeiro uso? O que voce esperava?"
  7. "O que mudou desde que voce comecou a usar?"
```

### Four Forces of Progress (Bob Moesta)

Para entender por que um usuario muda (ou nao muda) de produto:

```
Forces pulling TOWARDS mudanca:
  + Push: frustracao com a solucao atual ("isso me atrasa toda semana")
  + Pull: atracao pela nova solucao ("ouvi que funciona perfeitamente para X")

Forces pulling AGAINST mudanca:
  - Habit: inertia da solucao atual ("ja sei como usar")
  - Anxiety: medo de que a nova nao funcione ("e se perder meus dados?")

Mudanca so acontece quando Push + Pull > Habit + Anxiety
```

**Aplicacao para produto:** Se usuarios nao adotam, a causa pode ser Push insuficiente (problema nao e grande o suficiente) ou Anxiety muito alta (onboarding assustador, dados de migracao).

## Common Pitfalls
| Pitfall | Prevention |
|---------|-----------|
| Confirmation bias | Have someone else review findings |
| Leading questions | Pilot test interview guide |
| Small sample conclusions | State confidence levels honestly |
| Recency bias | Look at patterns, not individual stories |
| Survivorship bias | Include churned/inactive users |
| Selection bias | Recruit diverse participants |
| Discovery theater | Fazer entrevistas sem conectar insights ao OST e ao backlog |
| HiPPO override | Dados de usuarios devem superar opinioes de stakeholders — documentar evidencia |
