---
task: apply-principles-framework
responsavel: "@ray-dalio"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: situation
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: principles_analysis
    tipo: document
    destino: Console

Checklist:
  - "[ ] Situacao diagnosticada com root cause"
  - "[ ] 5-Step Process aplicado"
  - "[ ] Principios relevantes identificados"
  - "[ ] Plano de acao com metricas"
---

# Task: Apply Principles-Based Framework

## Metadata
- **Squad:** squad-council
- **Agent:** Ray Dalio
- **Complexity:** Standard

## Objetivo
Aplicar o framework de Principios de Ray Dalio a uma situacao ou decisao. Diagnosticar a raiz do problema usando o 5-Step Process e identificar principios relevantes para guiar a acao.

## Passos

### 1. Diagnose the Machine
- Qual e a situacao atual? (descricao objetiva)
- Qual e o resultado desejado?
- Qual e a diferenca entre os dois? (gap analysis)
- Qual e o root cause do gap? (perguntar "por que" ate chegar a raiz)

### 2. Apply the 5-Step Process
1. **Goals:** Quais sao os objetivos claros e priorizados?
2. **Problems:** Quais problemas estao no caminho?
3. **Diagnosis:** Quais sao as causas raiz (nao sintomas)?
4. **Design:** Qual e o plano para contornar os problemas?
5. **Execution:** Como garantir a implementacao?

### 3. Identify Relevant Principles
- Quais principios de Dalio se aplicam?
- Pain + Reflection = Progress — que dor pode virar principio?
- Ego barrier ou blind spot barrier presentes?
- Decisao deve ser believability-weighted?

### 4. Design Action Plan
- Acoes concretas com responsaveis
- Metricas para medir progresso
- Checkpoints para revisao
- Expected value calculation quando relevante

## Output
```yaml
principles_analysis:
  situation: "{descricao objetiva}"
  root_cause: "{causa raiz}"
  relevant_principles: ["{principios aplicaveis}"]
  five_step_plan:
    goals: ["{objetivos}"]
    problems: ["{problemas}"]
    diagnosis: "{diagnostico}"]
    design: "{plano}"]
    execution: "{implementacao}"]
  action_items: ["{acoes concretas}"]
```
