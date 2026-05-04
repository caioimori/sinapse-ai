---
task: orchestrate-animation-project
responsavel: "@animations-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: animation_brief
    tipo: document
    origem: "animation-interpreter ou usuario"
    obrigatorio: true
  - campo: project_context
    tipo: object
    origem: "brand system, wireframes, tech stack"
    obrigatorio: false

Saida:
  - campo: execution_plan
    tipo: document
    destino: "agentes especializados"

Checklist:
  - "[ ] Analisar brief e classificar complexidade"
  - "[ ] Selecionar agentes necessarios"
  - "[ ] Definir sequencia de execucao"
  - "[ ] Mapear dependencias entre agentes"
  - "[ ] Estimar timeline e recursos"
  - "[ ] Iniciar pipeline de execucao"
---

# Task: Orchestrate Animation Project

## Metadata
- **Agent:** animations-orqx (Kinetic)
- **Squad:** squad-animations
- **Complexity:** CRITICAL

## Objetivo
Receber Animation Brief e orquestrar todo o pipeline de execucao, delegando para os agentes corretos na ordem correta.

## Pipeline de Decisao
1. **Classificar projeto:** micro-interaction | scroll | 3D | generative | page-transition | compound
2. **Selecionar workflow:** prompt-to-animation | scroll-experience | 3d-scene | generative-art
3. **Alocar agentes:** baseado no tipo e complexidade
4. **Definir dependencias:** fase por fase
5. **Iniciar execucao:** delegar para primeiro agente
