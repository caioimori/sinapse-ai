---
task: create-vehicle-wrap
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

# Task: create-vehicle-wrap

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-vehicle-wrap`
- **Inputs:** Visual guidelines, logo, paleta, tipo de veiculo
- **Outputs:** Vehicle wrap design + mockup + specs

## Description
Cria design de vehicle wrap — outdoor movel com maximo impacto visual.

## Steps
1. Obter template lateral/traseira do veiculo (carro, van, caminhao)
2. Aplicar branding priorizando visibilidade a distancia:
   - Logo grande (visivel a 30+ metros)
   - Cores primarias dominantes
   - Info essencial: site, telefone (maximo 2 linhas de texto)
3. Considerar janelas e curvas do veiculo (safe zones)
4. Criar design lateral + traseira + capô (se aplicavel)
5. Gerar mockup em veiculo real via IA generativa
6. Documentar specs: vinyl tipo (cast vs calendered), laminacao, dimensoes, instalacao

## Validation Criteria
- Visivel e legivel a 30+ metros
- Informacao minima (nao poluido)
- Specs de vinyl e instalacao documentados
- Mockup realista

## Output Format
Design por face do veiculo + mockup + spec sheet.
