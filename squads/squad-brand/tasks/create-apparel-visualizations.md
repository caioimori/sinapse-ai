---
task: create-apparel-visualizations
responsavel: "@brand-creative-engineer"
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

# Task: create-apparel-visualizations

## Metadata
- **Agent:** brand-creative-engineer (Forge)
- **Squad:** squad-brand
- **Trigger:** `*create-apparel`
- **Inputs:** Visual guidelines, prompt-engineering-visual.md, product-categories.md
- **Outputs:** Apparel visualizations com branding

## Description
Cria visualizacoes de vestuario e calcados com branding aplicado. Streetwear, techwear, casual e formal.

## Steps
1. Definir pecas: t-shirt, hoodie, jacket, sneaker, cap, polo, windbreaker
2. Definir estilo por peca (streetwear, techwear, casual, formal)
3. Para cada peca, compor prompt:
   - [peca] + [cor base da paleta] + [branding: logo no peito/costas/manga/lateral]
   - [style: streetwear/techwear/minimal] + [angulo: front/back/detail/folded]
   - [qualidade: professional fashion photography, studio lighting]
4. Gerar 3 variacoes por peca
5. Compor outfits completos (full-body com modelo + todas as pecas)
6. Avaliar contra guidelines (cores, logo placement, estilo)
7. Organizar em pasta assets/apparel/{peca}/

## Validation Criteria
- Pecas sao vestiveis e realistas
- Branding visivel mas nao excessivo
- Cores da paleta aplicadas corretamente
- Outfits completos sao coesos
- 3+ variacoes por peca

## Output Format
Pasta /assets/apparel/ com visualizacoes por peca + outfits completos.
