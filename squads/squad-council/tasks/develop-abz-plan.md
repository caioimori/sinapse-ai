---
task: develop-abz-plan
responsavel: "@reid-hoffman"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: career_or_business
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: abz_plan
    tipo: document
    destino: Console

Checklist:
  - "[ ] Plan A definido com hipoteses"
  - "[ ] Plan B identificado como pivot adjacente"
  - "[ ] Plan Z definido como lifeboat"
  - "[ ] Network assets mapeados"
---

# Task: Develop ABZ Plan

## Metadata
- **Squad:** squad-council
- **Agent:** Reid Hoffman
- **Complexity:** Standard

## Objetivo
Desenvolver um plano ABZ para uma decisao de carreira ou negocio. Plan A (hipotese atual), Plan B (pivot adjacente), Plan Z (lifeboat).

## Passos

### 1. Plan A — Current Best Hypothesis
- Qual e sua estrategia atual?
- Que vantagens competitivas sustentam isso?
- Quais premissas precisam ser verdadeiras?
- Que metricas indicam que Plan A esta funcionando?
- Timeline: quando saberemos se funciona?

### 2. Plan B — Adjacent Pivot
- Se Plan A precisar de ajuste, o que muda?
- Quais aprendizados de Plan A se transferem?
- Plan B deve ser ADJACENTE a Plan A (nao completamente diferente)
- Que sinais indicariam hora de pivotar para Plan B?

### 3. Plan Z — The Lifeboat
- Se tudo der errado, qual e seu floor?
- O que garante sobrevivencia basica?
- Plan Z deve ser CONCRETO (nao vago)
- Exemplos: voltar para emprego anterior, morar com familia, freelancing
- Ter Plan Z claro AUMENTA tolerancia a risco em Plan A

### 4. Network Assets
- Quem no seu network pode ajudar com Plan A?
- Quem sao os weak ties que podem revelar oportunidades para Plan B?
- Que relacoes precisam ser cultivadas agora?

### 5. Permanent Beta Check
- Voce esta tratando sua carreira/negocio como produto em beta permanente?
- Que experimentos de baixo custo pode rodar para testar premissas?
- Como esta investindo em R&D pessoal (aprendizado, skills)?
