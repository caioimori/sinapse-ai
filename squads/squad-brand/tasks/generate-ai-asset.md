---
task: generate-ai-asset
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

# Task: generate-ai-asset

## Metadata
- **Agent:** brand-creative-engineer (Forge)
- **Squad:** squad-brand
- **Trigger:** `*generate-ai-asset`
- **Inputs:** Descricao do asset, visual guidelines, ai-api-capabilities.md
- **Outputs:** Asset gerado via IA + post-processado

## Description
Gera asset individual via IA generativa com prompt engineering profissional.

## Steps
1. Receber descricao do asset desejado
2. Selecionar API adequada:
   - DALL-E 3: fotorrealismo, mockups, product shots
   - Ideogram: texto em imagem, logos, tipografia
   - Gemini: versatil, estilos variados
3. Compor prompt estruturado: [sujeito] + [estilo] + [branding specs] + [iluminacao] + [angulo] + [background] + [qualidade]
4. Adicionar negative prompts (evitar: text, watermark, blurry, distorted)
5. Gerar 3 variacoes
6. Avaliar contra guidelines (cores, estilo, coerencia)
7. Refinar prompt se necessario (max 3 iteracoes)
8. Post-processar se necessario (overlay de logo, color correction, crop)
9. Exportar em formato adequado (PNG para raster, SVG overlay se aplicavel)

## Validation Criteria
- Asset alinhado com visual guidelines
- Cores da paleta presentes
- Qualidade profissional (sem artefatos de IA obvios)
- Max 3 iteracoes de refinamento

## Output Format
Asset final em alta resolucao + prompt utilizado documentado para reproducao.
