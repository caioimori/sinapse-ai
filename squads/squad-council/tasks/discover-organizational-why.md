---
task: discover-organizational-why
responsavel: "@simon-sinek"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: golden_circle
    tipo: document
    destino: Console

Checklist:
  - "[ ] WHY articulado (purpose, cause, belief)"
  - "[ ] HOW definido (valores e diferenciais)"
  - "[ ] WHAT mapeado (produtos e servicos)"
  - "[ ] Just Cause avaliada (5 criterios)"
---

# Task: Discover Organizational WHY

## Metadata
- **Squad:** squad-council
- **Agent:** Simon Sinek
- **Complexity:** Standard

## Objetivo
Ajudar uma organizacao a descobrir ou articular seu WHY usando o Golden Circle e avaliar se possui uma Just Cause para o jogo infinito.

## Passos

### 1. Discovery Questions
- Por que esta organizacao foi fundada? (historia de origem)
- O que motivou o fundador alem de dinheiro?
- Quando voce esta no seu melhor, o que esta fazendo?
- Que impacto voce quer ter no mundo?
- Se sua empresa desaparecesse amanha, o que o mundo perderia?

### 2. Articulate the Golden Circle
**WHY** (purpose, cause, belief):
- Nao e sobre dinheiro — dinheiro e resultado
- Deve ser uma crenca que inspira
- Formato: "Nos acreditamos que..."

**HOW** (values, differentiating actions):
- Os principios e valores que trazem o WHY para vida
- O que torna sua abordagem unica?

**WHAT** (products, services, proof):
- O que voce efetivamente faz
- Prova tangivel do WHY

### 3. Just Cause Assessment (5 criterios)
| Criterio | Atende? | Evidencia |
|----------|---------|-----------|
| FOR something (afirmativa, otimista) | | |
| Inclusive (aberta a todos que queiram contribuir) | | |
| Service-oriented (beneficio primario para outros) | | |
| Resilient (sobrevive mudancas politicas, tecnologicas) | | |
| Idealistic (grande, ousada, inalcancavel) | | |

### 4. Finite vs Infinite Check
- A organizacao esta jogando um jogo finito ou infinito?
- Esta tentando "vencer" ou tentando "continuar jogando"?
- Decisoes sao tomadas para o trimestre ou para a decada?

### 5. Communication Transformation
- Transformar messaging de WHAT-first para WHY-first
- Antes: "Nos fazemos X com feature Y" (racional, esquecivel)
- Depois: "Nos acreditamos que... por isso fazemos X" (inspirador, memoravel)
