---
task: create-packaging
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

# Task: create-packaging

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-packaging`
- **Inputs:** Visual guidelines, logo, paleta CMYK, graphic vocabulary
- **Outputs:** Packaging design + dieline + mockup + specs

## Description
Cria design de packaging com dieline tecnico e mockup 3D.

## Steps
1. Identificar tipo: caixa (tuck end, sleeve), sacola (paper bag), tubo, envelope, pouch
2. Definir dimensoes e criar dieline (planificacao tecnica)
3. Aplicar branding: logo (posicao e tamanho), cores da paleta, pattern, tipografia
4. Considerar informacoes obrigatorias: legal text, barcode area (40x30mm min), ingredientes
5. Definir acabamentos: laminacao (fosca/brilho), hot stamping, relevo, verniz localizado
6. Gerar mockup 3D via IA generativa
7. Documentar specs de producao: material (papel, gramatura), cores (CMYK + Pantone), acabamento
8. Incluir unboxing experience (interior, tissue paper, card insert se aplicavel)

## Validation Criteria
- Dieline tecnico com dimensoes corretas
- CMYK + specs de acabamento
- Mockup 3D realista
- Informacoes obrigatorias posicionadas
- Experiencia de unboxing considerada

## Output Format
Design + dieline + mockup + spec sheet de producao.
