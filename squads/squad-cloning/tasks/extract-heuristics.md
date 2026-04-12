---
task: extract-heuristics
responsavel: "@cognitive-extractor"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "pipeline"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "next phase"

Checklist:
  - "[ ] Validar inputs"
  - "[ ] Executar steps"
  - "[ ] Verificar qualidade"
  - "[ ] Gerar output"
---

# Task: extract-heuristics

## Metadata
- **Agent:** cognitive-extractor (Cortex)
- **Squad:** squad-cloning
- **Complexity:** STANDARD

## Objetivo
Layer 2: Identificar regras de decisao

## Steps
1. Receber inputs da fase anterior
2. Executar operacao principal
3. Validar output contra criterios
4. Entregar artefato para proxima fase

## Criterios de Qualidade
- Output segue formato esperado
- Nenhum dado inventado
- Tags de confianca aplicadas
- Gaps documentados
