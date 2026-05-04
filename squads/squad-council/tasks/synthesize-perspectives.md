---
task: synthesize-perspectives
responsavel: "@council-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: perspectives
    tipo: array
    origem: "council session"
    obrigatorio: true

Saida:
  - campo: synthesis
    tipo: document
    destino: Console

Checklist:
  - "[ ] Concordancias mapeadas"
  - "[ ] Discordancias mapeadas com razoes"
  - "[ ] Tensoes produtivas identificadas"
  - "[ ] Blind spots revelados"
  - "[ ] Insight de ordem superior extraido"
---

# Task: Synthesize Multi-Advisor Perspectives

## Metadata
- **Squad:** squad-council
- **Agent:** Zenith (council-orqx)
- **Complexity:** High

## Objetivo
Sintetizar perspectivas de multiplos conselheiros em uma recomendacao coerente. Nao e uma media — e encontrar o insight de ordem superior que emerge quando multiplas perspectivas sao mantidas simultaneamente.

## Entrada
- Array de perspectivas de conselheiros (2-5)
- Questao estrategica original
- Contexto do negocio

## Passos

### 1. Map Agreement
- Onde os conselheiros convergem?
- Quais principios sao compartilhados?
- Que evidencias suportam a convergencia?

### 2. Map Disagreement
- Onde divergem e por que?
- As divergencias sao sobre fatos ou valores?
- Quem tem mais expertise no ponto de divergencia?

### 3. Identify Tensions
- Quais divergencias representam tradeoffs genuinos?
- Quais representam premissas diferentes?
- Onde a tensao e produtiva (gera insight)?

### 4. Reveal Blind Spots
- O que nenhum conselheiro abordou?
- Que perspectiva esta faltando?
- Que stakeholder nao foi considerado?

### 5. Extract Higher-Order Insight
- O que emerge quando todas as perspectivas sao mantidas juntas?
- Existe um "e" que reconcilia posicoes opostas?
- Qual e o insight que nenhum advisor individual teria alcancado?

## Output
```yaml
synthesis:
  agreements: ["{pontos de convergencia}"]
  disagreements: ["{pontos de divergencia com razoes}"]
  tensions: ["{tradeoffs genuinos}"]
  blind_spots: ["{areas nao abordadas}"]
  higher_order_insight: "{insight emergente}"
  recommendation: "{recomendacao sintetizada}"
  dissenting_views: ["{contra-argumentos fortes}"]
```
