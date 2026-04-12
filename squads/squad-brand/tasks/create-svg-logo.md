---
task: create-svg-logo
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

# Task: create-svg-logo

## Metadata
- **Agent:** brand-creative-engineer (Forge)
- **Squad:** squad-brand
- **Trigger:** `*create-svg-logo` ou logo system definido por Iris
- **Inputs:** Logo system spec, paleta, tipografia
- **Outputs:** Logo SVG files + PNG multi-resolucao

## Description
Cria logo via SVG code — infinitamente escalavel, editavel e leve. Gera todas as variacoes especificadas por Iris.

## Steps
1. Receber spec de Iris (conceito, forma, cores, regras)
2. Definir viewBox e grid geometrico (ex: 0 0 200 60 para horizontal)
3. Construir forma principal com paths, circles, rects, polygons
4. Aplicar cores da paleta (fill, stroke) usando classes CSS para theming
5. Criar 6 variacoes SVG: horizontal, vertical, icone, mono, negativa, fundo colorido
6. Otimizar cada SVG (remover metadados, minificar paths, remover grupos vazios)
7. Testar escalabilidade: 16px (favicon) → 24px → 48px → 200px → 1000px+
8. Exportar PNG em multiplas resolucoes: @1x, @2x (retina), @4x (print)
9. Gerar favicon.ico (16x16, 32x32, 48x48)
10. Gerar apple-touch-icon (180x180)
11. Organizar em pasta: /logos/{variation}/{format}/

## Validation Criteria
- SVG valido (W3C validator)
- Cores exatamente da paleta (hex match)
- 6 variacoes criadas
- Escalavel de 16px a qualquer tamanho sem perda
- PNG exportado em @1x, @2x, @4x
- Favicon e apple-touch-icon gerados

## Output Format
Pasta organizada com SVGs otimizados + PNGs multi-resolucao + favicon + apple-touch-icon.
