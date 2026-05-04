---
task: diagnose-root-cause
responsavel: "@ray-dalio"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: problem
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: root_cause_diagnosis
    tipo: document
    destino: Console

Checklist:
  - "[ ] Sintomas separados de causas"
  - "[ ] Causas proximais separadas de causas raiz"
  - "[ ] Root cause identificada no nivel da maquina"
  - "[ ] Plano de redesign proposto"
---

# Task: Deep Root-Cause Diagnosis

## Metadata
- **Squad:** squad-council
- **Agent:** Ray Dalio
- **Complexity:** Standard

## Objetivo
Conduzir diagnostico profundo de root cause usando a metodologia Dalio. Separar sintomas de causas, causas proximais de causas raiz, e chegar ao nivel da maquina (design flaw ou pessoa errada no papel).

## Passos

### 1. Describe the Problem (sintomas)
- O que esta acontecendo? (fatos observaveis)
- Quando comecou?
- Quem esta afetado?
- Qual e o impacto?

### 2. Identify Proximate Causes
- Quais acoes (ou falta de acoes) levaram ao problema?
- O que mudou recentemente?
- Quais processos falharam?

### 3. Dig to Root Causes
Perguntar "por que?" repetidamente ate chegar a:
- Design flaw na maquina (processo, sistema, estrutura)
- Pessoa errada no papel (values, abilities, ou skills inadequados)
- Principio ausente (nenhuma regra governa esta situacao)

### 4. Verify Root Cause
- Se corrigirmos esta causa, o problema desaparece?
- Esta causa explica TODOS os sintomas?
- Existem multiplas causas raiz?

### 5. Design Solution
- Redesign da maquina para eliminar a causa raiz
- Novo principio para prevenir recorrencia
- Metricas para verificar que a correcao funciona

## Output
```yaml
root_cause_diagnosis:
  symptoms: ["{sintomas observaveis}"]
  proximate_causes: ["{causas proximais}"]
  root_causes: ["{causas raiz}"]
  machine_level: "design_flaw | wrong_person | missing_principle"
  solution_design: "{redesign proposto}"
  new_principle: "{principio para prevenir recorrencia}"
```
