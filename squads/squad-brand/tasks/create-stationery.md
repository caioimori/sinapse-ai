---
task: create-stationery
responsavel: "@brand-collateral-designer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: create-stationery

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-stationery`
- **Inputs:** Visual guidelines, paleta CMYK, logo specs
- **Outputs:** Stationery set completo (letterhead, envelope, folder, cartao)

## Description
Cria set completo de stationery corporativo.

## Steps
1. Letterhead A4 (210x297mm): header com logo, footer com dados empresa, margens para conteudo
2. Envelope DL (220x110mm): logo e endereco remetente, posicionamento de janela
3. Envelope C5 (229x162mm): versao para documentos maiores
4. Pasta/folder (220x310mm com bolso): logo e pattern na frente, bolso interno
5. Cartao de agradecimento (A6 105x148mm): mensagem personalizada, design premium
6. Aplicar CMYK + bleed 3mm + safe zone 5mm em todas as pecas
7. Manter consistencia visual entre todas as pecas (mesma linguagem)
8. Gerar mockups para cada peca
9. Documentar specs de producao

## Validation Criteria
- 5 pecas criadas com dimensoes corretas
- CMYK com bleed e safe zone
- Consistencia visual entre pecas
- Specs de producao documentadas

## Output Format
Designs + mockups + spec sheet por peca.
