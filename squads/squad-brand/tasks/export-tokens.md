---
task: export-tokens
responsavel: "@brand-system-architect"
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

# Task: export-tokens

## Metadata
- **Agent:** brand-system-architect (Grid)
- **Squad:** squad-brand
- **Trigger:** `*export-tokens`
- **Inputs:** Token system completo (3 niveis)
- **Outputs:** Tokens em 4+ formatos + docs de integracao

## Description
Exporta tokens em multiplos formatos consumiveis por diferentes tech stacks.

## Steps
1. **CSS Custom Properties:** `:root { --color-primary-500: #xxx; }` com fallbacks
2. **JSON:** formato flat (`{"color.primary.500": "#xxx"}`) e nested (`{color: {primary: {500: "#xxx"}}}`)
3. **SCSS:** variables (`$color-primary-500: #xxx;`) e maps (`$colors: (primary: (500: #xxx))`)
4. **Tailwind config:** `module.exports = { theme: { extend: { colors: {...} } } }`
5. **Style Dictionary config** (para CI/CD automatizado)
6. Documentar como consumir cada formato:
   - React: import CSS ou use CSS-in-JS
   - Vue: import CSS
   - Vanilla HTML: link CSS file
   - Mobile (React Native): JSON import
7. Incluir instrucoes de setup para cada framework

## Validation Criteria
- 4+ formatos gerados
- Valores identicos em todos os formatos
- Documentacao de consumo por framework
- Style Dictionary config para automacao

## Output Format
/tokens/ directory com css/, json/, scss/, tailwind/ + README de integracao.
