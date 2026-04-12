---
task: tag-confidence-levels
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

# Task: tag-confidence-levels

## Metadata
- **Agent:** cognitive-extractor (Cortex)
- **Squad:** squad-cloning
- **Complexity:** STANDARD

## Objetivo
Tagar DIRETO INFERIDO HIPOTESE

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
