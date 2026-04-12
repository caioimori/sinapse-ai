---
task: design-visual-hierarchy
responsavel: "@dx-ui-designer"
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

# Task: Design Visual Hierarchy

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Standard

## Objetivo
Projetar a hierarquia visual do produto — garantir que a importancia relativa de cada elemento e comunicada visualmente de forma clara e intencional.

## Entrada
- Content hierarchy (de Compass)
- Brand tokens (tipografia, cores)
- Screen layouts
- User scanning patterns

## Passos

### 1. Definir Visual Weight System
| Fator | Como comunica importancia |
|-------|--------------------------|
| Tamanho | Maior = mais importante |
| Peso tipografico | Bolder = mais importante |
| Cor/Contraste | Maior contraste = mais atencao |
| Posicao | Topo-esquerda = primeiro (LTR) |
| Whitespace | Mais espaco ao redor = mais destaque |
| Isolamento | Elemento isolado atrai atencao |
| Profundidade | Elevation/shadow = destaque |

### 2. Criar Type Scale
```yaml
type_scale:
  ratio: 1.25  # Major Third (ou 1.333 Perfect Fourth)
  base: 16px

  levels:
    - name: "display-xl"
      size: "3.815rem"  # ~61px
      weight: 800
      line_height: 1.1
      letter_spacing: "-0.02em"
      usage: "Hero headlines only"

    - name: "display"
      size: "3.052rem"  # ~49px
      weight: 700
      line_height: 1.15
      usage: "Landing page headlines"

    - name: "h1"
      size: "2.441rem"  # ~39px
      weight: 700
      line_height: 1.2
      usage: "Page titles"

    - name: "h2"
      size: "1.953rem"  # ~31px
      weight: 600
      line_height: 1.25
      usage: "Section headings"

    - name: "h3"
      size: "1.563rem"  # ~25px
      weight: 600
      line_height: 1.3
      usage: "Subsection headings"

    - name: "h4"
      size: "1.25rem"  # 20px
      weight: 500
      line_height: 1.35
      usage: "Card titles"

    - name: "body-lg"
      size: "1.125rem"  # 18px
      weight: 400
      line_height: 1.6
      usage: "Lead paragraphs"

    - name: "body"
      size: "1rem"  # 16px
      weight: 400
      line_height: 1.5
      usage: "Body text"

    - name: "body-sm"
      size: "0.875rem"  # 14px
      weight: 400
      line_height: 1.5
      usage: "Secondary text, captions"

    - name: "caption"
      size: "0.75rem"  # 12px
      weight: 500
      line_height: 1.4
      usage: "Labels, badges, metadata"
```

### 3. Aplicar Squint Test
Borrar a tela (squint) — os 3 elementos mais importantes devem permanecer identificaveis. Se nao:
- Aumentar contraste do elemento
- Aumentar tamanho
- Adicionar whitespace ao redor
- Remover distractions competidoras

### 4. Criar Color Emphasis System
| Nivel | Cor | Uso |
|-------|-----|-----|
| Primary emphasis | Brand primary | CTAs, key actions |
| Secondary emphasis | Brand secondary | Supporting actions |
| Default | Neutral-900 | Body text, content |
| Subtle | Neutral-500 | Secondary text |
| Muted | Neutral-400 | Placeholders, disabled |
| Inverse | White on dark | Contrasting sections |

### 5. Documentar Elevation Scale
| Level | Shadow | Uso |
|-------|--------|-----|
| 0 | none | Flat elements, inline |
| 1 | 0 1px 2px rgba(0,0,0,0.05) | Cards, subtle lift |
| 2 | 0 4px 6px rgba(0,0,0,0.07) | Dropdowns, popovers |
| 3 | 0 10px 15px rgba(0,0,0,0.1) | Modals, dialogs |
| 4 | 0 20px 25px rgba(0,0,0,0.15) | Toasts, high-priority |

## Saida
- Visual hierarchy specification
- Type scale completa
- Color emphasis system
- Elevation scale
- Do/Don't examples

## Validacao
- [ ] Type scale com ratio consistente
- [ ] Color emphasis system definido
- [ ] Squint test passa em todas as paginas-chave
- [ ] Elevation scale documentada
- [ ] Contraste minimo WCAG 2.2 AA (4.5:1 texto, 3:1 UI)
