---
task: create-mockup-batch
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

# Task: create-mockup-batch

## Metadata
- **Agent:** brand-creative-engineer (Forge)
- **Squad:** squad-brand
- **Trigger:** `*create-mockup` ou `*batch-assets --list mockups`
- **Inputs:** Visual guidelines, product-categories.md, prompt-engineering-visual.md
- **Outputs:** Mockups fotorrealistas organizados por categoria

## Description
Cria lote de mockups de produto via IA generativa. Gera visualizacoes fotorrealistas de como a marca aparece em objetos fisicos.

## Steps
1. Selecionar produtos de product-categories.md (bags, bottles, mugs, phone cases, etc)
2. Para cada produto, compor prompt estruturado:
   - [produto] + [angulo recomendado] + [iluminacao studio] + [branding: logo + cores + pattern]
   - [estilo: photorealistic 3D render] + [background: clean studio or contextual]
   - [qualidade: 8K, high detail, professional product photography]
3. Selecionar API adequada (DALL-E para fotorrealismo, Ideogram para texto)
4. Gerar 3 variacoes por produto
5. Avaliar cada variacao contra guidelines (cores corretas? logo legivel? estilo coerente?)
6. Refinar prompt e regenerar se necessario (max 3 iteracoes)
7. Post-processar se necessario (overlay de logo via SVG para precisao)
8. Validar coerencia visual entre todos os mockups (parecem da mesma marca?)
9. Organizar em pasta assets/mockups/{categoria}/

## Validation Criteria
- Mockups fotorrealistas e profissionais
- Cores da paleta visiveis e corretas
- Logo legivel e bem posicionado
- Coerencia visual entre todos os mockups
- Minimo 3 variacoes por produto

## Output Format
Pasta /assets/mockups/ organizada por categoria com 3+ variacoes por produto.
