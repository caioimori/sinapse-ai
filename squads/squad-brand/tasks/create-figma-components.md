---
task: create-figma-components
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

# Task: create-figma-components

## Metadata
- **Agent:** brand-creative-engineer (Forge)
- **Squad:** squad-brand
- **Trigger:** `*create-figma-components` ou design system definido
- **Inputs:** Design system specs, tokens, componentes documentados
- **Outputs:** Componentes criados no Figma via MCP

## Description
Cria componentes reais no Figma usando Figma MCP. Auto Layout, variaveis e tokens.

## Steps
1. Conectar via Figma MCP (figma_get_status)
2. Criar Section para organizar ("Brand System Components")
3. Criar variaveis Figma para tokens (cores, spacing, typography)
4. Para cada componente do design system:
   - Criar frame com Auto Layout
   - Aplicar tokens como variaveis Figma
   - Criar variantes (size, state, variant)
   - Definir component properties
5. Validar visualmente com figma_take_screenshot
6. Iterar se necessario (max 3 iteracoes)
7. Organizar componentes por categoria na Section
8. Documentar component properties

## Validation Criteria
- Componentes usam Auto Layout (nao posicao absoluta)
- Tokens aplicados como variaveis (nao hardcoded)
- Variantes criadas (sizes, states)
- Screenshot validado visualmente
- Organizados em Section

## Output Format
Componentes no Figma + documentacao de properties.
