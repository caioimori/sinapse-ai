---
task: select-typography
responsavel: "@brand-identity-designer"
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

# Task: select-typography

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*select-typography` ou paleta definida
- **Inputs:** Arquetipo, posicionamento, typography-personality.md
- **Outputs:** Sistema tipografico completo

## Description
Seleciona sistema tipografico com personalidade alinhada ao arquetipo. Define hierarquia, scale e regras de uso.

## Steps
1. Consultar typography-personality.md
2. Mapear arquetipo para classificacao tipografica adequada
3. Selecionar Display font (headlines, hero text — impacto)
4. Selecionar Body font (texto corrido — legibilidade)
5. Selecionar Mono/Accent font (codigo, dados, destaques — se necessario)
6. Validar pairing (contraste, concordancia, sem conflito)
7. Definir type scale com ratio escolhido:
   - h1: {size}px / {line-height} / {weight}
   - h2-h6: escalando proporcionalmente
   - body: {size}px / {line-height} / {weight}
   - small: {size}px
   - caption: {size}px
8. Definir responsive type scale (mobile vs desktop)
9. Definir letter-spacing por uso (headings vs body)
10. Definir font weights disponiveis (regular, medium, semibold, bold)
11. Testar legibilidade em tamanhos pequenos (12px+)
12. Documentar font files, CDN links, fallback stack
13. Definir regras de uso (quando usar display vs body vs mono)

## Validation Criteria
- Font pairing tem contraste harmonico (nao conflito)
- Type scale e matematicamente consistente (ratio definido)
- Legivel em 12px (body text minimum)
- Personalidade tipografica alinhada com arquetipo
- Font files e fallbacks documentados
- Responsive scale definido

## Output Format
```markdown
# Typography System — {brand_name}

## Fontes
- Display: {font_name} — {justificativa}
- Body: {font_name} — {justificativa}
- Mono: {font_name} (se aplicavel)

## Type Scale (ratio: {ratio})
| Level | Size | Line-Height | Weight | Use |
| h1 | 48px | 1.1 | Bold | Hero headlines |
...

## Regras de Uso
- Headlines: sempre Display
- Body text: sempre Body
...
```
