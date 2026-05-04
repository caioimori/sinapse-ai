---
task: create-workshop-materials
responsavel: "@slide-designer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "pipeline or manual"
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

# Task: create-workshop-materials

## Metadata
- **Agent:** slide-designer (Deck)
- **Squad:** squad-courses
- **Complexity:** STANDARD

## Objetivo
Criar materiais de workshop

## Steps
1. Receber inputs e contexto do curso
2. Executar operacao principal
3. Validar output contra criterios pedagogicos
4. Entregar artefato para proxima fase

## Criterios de Qualidade
- Alinhado aos learning outcomes
- Nivel adequado para audiencia
- Formato consistente com tipo de curso
- Pronto para proxima fase
