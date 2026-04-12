---
task: productize-yourself
responsavel: "@naval-ravikant"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: person_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: productize_plan
    tipo: document
    destino: Console

Checklist:
  - "[ ] Specific knowledge mapeado"
  - "[ ] Leverage selecionado"
  - "[ ] Accountability definida"
  - "[ ] Plano de productizacao criado"
---

# Task: Productize Yourself

## Metadata
- **Squad:** squad-council
- **Agent:** Naval Ravikant
- **Complexity:** Standard

## Objetivo
Ajudar o usuario a aplicar a formula "Productize Yourself" — encontrar specific knowledge, escolher leverage, assumir accountability, e criar um produto ou servico que escala sem trocar tempo por dinheiro.

## Passos

### 1. Discovery Session
- O que voce faria de graca porque ama?
- Que problemas voce resolve que outros nao conseguem?
- Que combinacao unica de habilidades voce tem?
- Onde sua experiencia e intransferivel?

### 2. Specific Knowledge Audit
| Area | Curiosidade Genuina? | Dificil de Treinar? | Demanda de Mercado? |
|------|---------------------|--------------------|--------------------|
| | Sim/Nao | Sim/Nao | Sim/Nao |

O sweet spot e: curiosidade genuina + dificil de treinar + demanda existente.

### 3. Leverage Selection
- Code: pode virar software, API, ferramenta?
- Media: pode virar conteudo, curso, newsletter, podcast?
- Capital: pode virar investimento, fund, portfolio?
- Labor: precisa de equipe? (ultimo recurso)

### 4. Accountability Design
- Colocar seu nome no produto/servico
- Assumir risco publicamente
- Construir reputacao baseada em resultados

### 5. Productization Roadmap
- MVP do produto/servico (30 dias)
- Validacao com 10 clientes (60 dias)
- Escala com leverage escolhido (90+ dias)
- Metricas de compounding para acompanhar
