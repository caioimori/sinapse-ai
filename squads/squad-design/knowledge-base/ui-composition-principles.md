# Knowledge Base: UI Composition Principles

## Escopo
Principios de composicao visual para interfaces digitais — grid, espacamento, hierarquia, cor, tipografia e padroes de layout.

---

## 1. Grid Systems

### Anatomia do Grid
| Elemento | Descricao | Valor Tipico |
|----------|----------|-------------|
| Columns | Divisoes verticais | 4 (mobile), 8 (tablet), 12 (desktop) |
| Gutters | Espaco entre colunas | 16px (mobile), 24px (tablet), 32px (desktop) |
| Margins | Espaco nas bordas | 16px (mobile), 32px (tablet), auto (desktop) |
| Container | Largura maxima | 1280px ou 1440px |

### Breakpoints Padrao
| Nome | Width | Columns | Gutter | Margin |
|------|-------|---------|--------|--------|
| xs | 0-639px | 4 | 16px | 16px |
| sm | 640-767px | 4 | 16px | 24px |
| md | 768-1023px | 8 | 24px | 32px |
| lg | 1024-1279px | 12 | 24px | 32px |
| xl | 1280-1535px | 12 | 32px | auto |
| 2xl | 1536px+ | 12 | 32px | auto |

### Grid Patterns
| Pattern | Colunas | Uso |
|---------|---------|-----|
| Full-width | 12/12 | Heroes, banners |
| 8-4 | Content + sidebar | Blog, docs |
| 6-6 | Equal split | Feature comparison |
| 4-4-4 | Three equal | Card grids |
| 3-3-3-3 | Four equal | Product grids |
| 3-6-3 | Center-focused | Forms, content |

---

## 2. Spacing System

### Escala 4px Base
| Token | Value | Uso Comum |
|-------|-------|----------|
| space-0 | 0px | Reset |
| space-1 | 4px | Inline elements, icon gaps |
| space-2 | 8px | Related elements |
| space-3 | 12px | List items |
| space-4 | 16px | Component internal padding |
| space-5 | 20px | Section padding (mobile) |
| space-6 | 24px | Card padding |
| space-8 | 32px | Section gaps |
| space-10 | 40px | Large section padding |
| space-12 | 48px | Section separation |
| space-16 | 64px | Page section gaps |
| space-20 | 80px | Hero spacing |
| space-24 | 96px | Major section dividers |

### Principios de Espacamento
| Principio | Regra |
|-----------|-------|
| Proximity | Elementos relacionados ficam mais proximos |
| Grouping | Espaco entre grupos > espaco dentro de grupos |
| Consistency | Mesmo tipo de espaco para mesma relacao |
| Rhythm | Espacamento cria ritmo vertical consistente |
| Breathing room | Elementos precisam de ar ao redor |

---

## 3. Visual Hierarchy

### Ferramentas de Hierarquia
| Ferramenta | Impacto | Exemplo |
|-----------|--------|---------|
| Size | Alto | Headline grande vs body text |
| Weight | Medio | Bold vs regular |
| Color | Alto | Primary vs muted text |
| Contrast | Alto | Dark text on light bg |
| Position | Medio | Topo-esquerda = mais importante |
| Whitespace | Medio | Mais espaco = mais destaque |
| Depth/elevation | Baixo | Shadow indica layer acima |

### Niveis de Hierarquia
| Nivel | Papel | CSS |
|-------|-------|-----|
| L1 | Titulo principal | text-4xl/5xl, font-bold, primary |
| L2 | Subtitulos | text-2xl/3xl, font-semibold, primary |
| L3 | Labels, headings menores | text-lg/xl, font-medium, secondary |
| L4 | Body text | text-base, font-normal, secondary |
| L5 | Captions, meta | text-sm, font-normal, muted |
| L6 | Fine print | text-xs, font-normal, muted |

---

## 4. Color Composition

### Color Roles
| Role | Uso | Proporcao |
|------|-----|----------|
| Background | Canvas principal | ~60% |
| Surface | Cards, sections | ~25% |
| Primary | CTAs, links, key actions | ~10% |
| Secondary | Supporting elements | ~3% |
| Accent | Highlights, badges | ~2% |
| Destructive | Errors, delete actions | Sparingly |
| Success/Warning/Info | Feedback states | Sparingly |

### 60-30-10 Rule
| Proporcao | Aplicacao |
|-----------|----------|
| 60% | Neutral backgrounds (white, gray-50) |
| 30% | Secondary colors (surfaces, borders) |
| 10% | Primary brand color (CTAs, highlights) |

### Color in Dark Mode
| Regra | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Backgrounds | White → Gray scale | Gray-900 → Gray-950 |
| Text | Gray-900 | Gray-100 |
| Surfaces | White, Gray-50 | Gray-800, Gray-850 |
| Primary | Saturated | Slightly desaturated |
| Elevation | Shadow increases | Lightness increases |
| Borders | Gray-200 | Gray-700 |

---

## 5. Typography Composition

### Type Scale (1.250 Major Third)
| Step | Size | Line Height | Uso |
|------|------|------------|-----|
| xs | 12px | 16px | Badges, overlines |
| sm | 14px | 20px | Captions, labels |
| base | 16px | 24px | Body text |
| lg | 18px | 28px | Lead paragraphs |
| xl | 20px | 28px | H4, card titles |
| 2xl | 24px | 32px | H3, section titles |
| 3xl | 30px | 36px | H2, page titles |
| 4xl | 36px | 40px | H1, hero titles |
| 5xl | 48px | 1 | Display headings |
| 6xl | 60px | 1 | Hero display |

### Line Length
| Contexto | Caracteres | CSS |
|----------|-----------|-----|
| Body text | 45-75 chars | max-width: 65ch |
| Short text | 20-40 chars | max-width: 40ch |
| Wide layout | 75-90 chars | max-width: 85ch |

### Line Height por Contexto
| Contexto | Multiplicador |
|----------|-------------|
| Body text | 1.5 (24px @ 16px) |
| Headings | 1.1-1.3 |
| UI labels | 1.25 |
| Dense tables | 1.25 |
| Code | 1.5-1.7 |

---

## 6. Component Composition Patterns

### Card Anatomy
```
┌─────────────────────────┐
│  [Image]                │  ← Optional media
│                         │
│  Overline Label         │  ← Category, date
│  Card Title             │  ← Primary info
│  Supporting text that   │  ← Description
│  provides context...    │
│                         │
│  [Action] [Action]      │  ← CTAs
└─────────────────────────┘
```

### Form Layout
```
Label ←────────── Always above
┌─────────────────────────┐
│ Placeholder text...     │  ← Input
└─────────────────────────┘
Helper text or error       ← Below input
```

### Page Section Pattern
```
[Section spacing: 64-96px]
  [Content max-width: 1280px]
    [Eyebrow / Overline]
    [Section Heading]
    [Section Description]
    [Content spacing: 32-48px]
      [Content Grid / Cards / Text]
    [Optional CTA]
[Section spacing: 64-96px]
```

---

## 7. Layout Patterns

### Common Page Layouts
| Layout | Descricao | Uso |
|--------|----------|-----|
| Single column | Uma coluna centrada | Articles, forms |
| Two column | Content + sidebar | Docs, settings |
| Grid | Grid de cards/items | Products, portfolios |
| Magazine | Varied grid sizes | News, editorial |
| Dashboard | Widgets in grid | Analytics, admin |
| Split screen | Two equal halves | Comparisons, auth pages |

### Content Density
| Densidade | Spacing | Uso |
|-----------|---------|-----|
| Comfortable | padding: 24-32px, gap: 24px | Marketing, content sites |
| Regular | padding: 16-24px, gap: 16px | Most applications |
| Compact | padding: 8-16px, gap: 8px | Data-heavy dashboards |
| Dense | padding: 4-8px, gap: 4px | Tables, spreadsheets |

---

## 8. Visual Balance Checklist

| Check | Descricao |
|-------|----------|
| Alignment | Todos os elementos alinham a um grid/eixo? |
| Proximity | Elementos relacionados estao proximos? |
| Repetition | Padroes visuais sao consistentes? |
| Contrast | Hierarquia visual e clara? |
| Whitespace | Ha espaco suficiente entre elementos? |
| Symmetry | Peso visual e equilibrado? |
| Focus | Ha um ponto focal claro? |
| Flow | O olhar segue um caminho natural? |

---

## Referencias
- Refactoring UI (Adam Wathan & Steve Schoger)
- Material Design Guidelines (Google)
- Human Interface Guidelines (Apple)
- Laws of UX (Jon Yablonski)
