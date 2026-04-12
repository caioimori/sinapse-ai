---
task: define-color-palette
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

# Task: define-color-palette

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*define-color-palette` ou discovery aprovado
- **Inputs:** Arquetipo, personalidade, posicionamento, color-psychology.md
- **Outputs:** Color system completo

## Description
Define paleta de cores com fundamento psicologico. Cada cor justificada pelo arquetipo e posicionamento.

## Steps
1. Consultar knowledge base color-psychology.md
2. Mapear arquetipo para familia de cores natural
3. Definir cor primaria (70% do uso visual) — justificar significado psicologico
4. Definir cor secundaria (25%) — contraste harmonico com primaria
5. Definir cor acento (5%) — para CTAs, highlights, elementos interativos
6. Gerar escala de luminosidade para cada cor (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
7. Definir cores semanticas: success (verde), warning (amarelo), error (vermelho), info (azul)
8. Definir cores neutras: gray scale (50-900), white, black
9. Testar acessibilidade WCAG AA (4.5:1 texto, 3:1 elementos UI):
   - Texto primario sobre surface primaria
   - Texto sobre cada cor da paleta
   - Simular daltonismo (protanopia, deuteranopia, tritanopia)
10. Documentar em todos os formatos: HEX, RGB, HSL, CMYK, Pantone closest match
11. Criar combinacoes aprovadas (quais cores podem ser usadas juntas)
12. Documentar combinacoes proibidas

## Validation Criteria
- Cor primaria tem justificativa psicologica documentada
- Escala 50-900 para cada cor principal
- Todas as combinacoes texto/fundo passam WCAG AA
- Documentado em 5 formatos (HEX, RGB, HSL, CMYK, Pantone)
- Proporcao 70/25/5 definida

## Output Format
```markdown
# Color System — {brand_name}

## Primaria: {nome}
- HEX: #... | RGB: ... | HSL: ... | CMYK: ... | Pantone: ...
- Justificativa: {psicologia + arquetipo}
- Escala: 50→900

## Secundaria: {nome}
...

## Acento: {nome}
...

## Semanticas
- Success: ... | Warning: ... | Error: ... | Info: ...

## Acessibilidade
| Combinacao | Ratio | WCAG | Status |
```
