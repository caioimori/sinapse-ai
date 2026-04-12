# Knowledge Base: Design Token Architecture

## Escopo
Referencia completa de arquitetura de design tokens — taxonomia de tres niveis, W3C DTCG spec, export pipeline e governanca.

---

## 1. Three-Tier Token Architecture

### Visao Geral
```
L1 Primitive → L2 Semantic → L3 Component
   (What)        (Why)         (Where)
```

| Tier | Nome | Papel | Exemplo |
|------|------|-------|---------|
| L1 | Primitive | Raw design values | `color.blue.500: #3B82F6` |
| L2 | Semantic | Intent/purpose mapping | `color.action.primary: {color.blue.500}` |
| L3 | Component | Component-specific | `button.primary.bg: {color.action.primary}` |

### Regras de Referencia
| Regra | Descricao |
|-------|----------|
| L3 → L2 | Component tokens SEMPRE referenciam semantic |
| L2 → L1 | Semantic tokens SEMPRE referenciam primitive |
| L3 → L1 | PROIBIDO — quebra a cadeia semantica |
| L1 → L1 | PROIBIDO — primitives sao valores finais |

---

## 2. W3C Design Token Community Group (DTCG) Spec

### Formato JSON
```json
{
  "$name": "Design Tokens",
  "$description": "Token collection following W3C DTCG spec",

  "color": {
    "blue": {
      "500": {
        "$type": "color",
        "$value": "#3B82F6",
        "$description": "Primary blue"
      }
    }
  },

  "spacing": {
    "4": {
      "$type": "dimension",
      "$value": "16px",
      "$description": "Standard spacing unit"
    }
  },

  "font": {
    "size": {
      "base": {
        "$type": "dimension",
        "$value": "16px"
      }
    },
    "weight": {
      "regular": {
        "$type": "fontWeight",
        "$value": 400
      }
    }
  },

  "duration": {
    "fast": {
      "$type": "duration",
      "$value": "150ms"
    }
  }
}
```

### Tipos DTCG Suportados
| $type | Valor | Exemplo |
|-------|-------|---------|
| color | Hex, RGB, HSL | `"#3B82F6"` |
| dimension | px, rem, em | `"16px"` |
| fontFamily | String | `"Inter, sans-serif"` |
| fontWeight | Number | `400` |
| duration | ms, s | `"200ms"` |
| cubicBezier | Array [4] | `[0.4, 0, 0.2, 1]` |
| number | Number | `1.5` |
| strokeStyle | String/Object | `"solid"` |
| border | Object | `{ color, width, style }` |
| transition | Object | `{ duration, delay, timingFunction }` |
| shadow | Object/Array | `{ color, offsetX, offsetY, blur, spread }` |
| gradient | Object | `{ type, stops }` |
| typography | Object | `{ fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }` |

### Alias/Reference Syntax
```json
{
  "color": {
    "action": {
      "primary": {
        "$type": "color",
        "$value": "{color.blue.500}"
      }
    }
  }
}
```

---

## 3. L1 — Primitive Tokens

### Color Palette (11 Steps)
| Step | Lightness | Uso Tipico |
|------|----------|-----------|
| 50 | Lightest | Backgrounds, subtle tints |
| 100 | Very light | Hover backgrounds |
| 200 | Light | Active backgrounds, borders |
| 300 | Medium light | Disabled states |
| 400 | Medium | Icons secondary |
| 500 | Base | Primary brand, icons |
| 600 | Medium dark | Hover on dark elements |
| 700 | Dark | Active on dark elements |
| 800 | Very dark | Text secondary |
| 900 | Darkest | Text primary |
| 950 | Near black | High-contrast text |

### Palettes Obrigatorias
| Palette | Uso |
|---------|-----|
| Gray/Neutral | Backgrounds, text, borders |
| Brand Primary | Primary actions, links |
| Brand Secondary | Supporting elements |
| Success (Green) | Positive feedback |
| Warning (Amber) | Caution states |
| Error (Red) | Destructive, errors |
| Info (Blue) | Informational |

### Spacing Scale (4px Base)
```
0, 1(4px), 2(8px), 3(12px), 4(16px), 5(20px), 6(24px),
8(32px), 10(40px), 12(48px), 16(64px), 20(80px), 24(96px)
```

### Typography Primitives
| Token | Values |
|-------|--------|
| font.family.sans | `'Inter', system-ui, sans-serif` |
| font.family.mono | `'JetBrains Mono', monospace` |
| font.size.* | 12, 14, 16, 18, 20, 24, 30, 36, 48, 60px |
| font.weight.* | 400, 500, 600, 700 |
| font.lineHeight.* | tight(1.25), normal(1.5), relaxed(1.75) |
| font.letterSpacing.* | tight(-0.025em), normal(0), wide(0.025em) |

---

## 4. L2 — Semantic Tokens

### Color Semantics
| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| bg.primary | white | gray.950 | Page background |
| bg.secondary | gray.50 | gray.900 | Section background |
| bg.tertiary | gray.100 | gray.800 | Card background |
| fg.primary | gray.900 | gray.50 | Primary text |
| fg.secondary | gray.600 | gray.400 | Secondary text |
| fg.muted | gray.400 | gray.500 | Placeholder, disabled |
| action.primary | blue.600 | blue.400 | Primary CTAs |
| action.primary.hover | blue.700 | blue.300 | Hover state |
| border.default | gray.200 | gray.700 | Default borders |
| border.strong | gray.300 | gray.600 | Emphasized borders |
| feedback.success | green.600 | green.400 | Success messages |
| feedback.error | red.600 | red.400 | Error messages |
| feedback.warning | amber.600 | amber.400 | Warning messages |

### Spacing Semantics
| Token | Value | Uso |
|-------|-------|-----|
| spacing.component.xs | space.1 (4px) | Inline gaps |
| spacing.component.sm | space.2 (8px) | Related elements |
| spacing.component.md | space.4 (16px) | Component padding |
| spacing.component.lg | space.6 (24px) | Card padding |
| spacing.section.sm | space.8 (32px) | Small sections |
| spacing.section.md | space.12 (48px) | Medium sections |
| spacing.section.lg | space.16 (64px) | Large sections |
| spacing.page | space.20 (80px) | Page sections |

---

## 5. L3 — Component Tokens

### Button Example
```json
{
  "button": {
    "primary": {
      "bg": { "$value": "{color.action.primary}" },
      "bg-hover": { "$value": "{color.action.primary.hover}" },
      "fg": { "$value": "{color.on-action.primary}" },
      "border-radius": { "$value": "{radius.md}" },
      "padding-x": { "$value": "{spacing.component.md}" },
      "padding-y": { "$value": "{spacing.component.sm}" },
      "font-size": { "$value": "{font.size.sm}" },
      "font-weight": { "$value": "{font.weight.medium}" }
    },
    "size": {
      "sm": {
        "height": { "$value": "32px" },
        "padding-x": { "$value": "{spacing.component.sm}" },
        "font-size": { "$value": "{font.size.xs}" }
      },
      "md": {
        "height": { "$value": "40px" },
        "padding-x": { "$value": "{spacing.component.md}" },
        "font-size": { "$value": "{font.size.sm}" }
      },
      "lg": {
        "height": { "$value": "48px" },
        "padding-x": { "$value": "{spacing.component.lg}" },
        "font-size": { "$value": "{font.size.base}" }
      }
    }
  }
}
```

---

## 6. Export Pipeline (Style Dictionary)

### Configuracao
```javascript
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: { outputReferences: true }
      }]
    },
    typescript: {
      transformGroup: 'js',
      buildPath: 'dist/ts/',
      files: [{
        destination: 'tokens.ts',
        format: 'javascript/es6'
      }]
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'dist/tailwind/',
      files: [{
        destination: 'theme.js',
        format: 'javascript/module-flat'
      }]
    }
  }
};
```

### Output Formats
| Formato | Arquivo | Consumer |
|---------|---------|---------|
| CSS Custom Properties | tokens.css | Browser runtime |
| TypeScript constants | tokens.ts | Type-safe JS |
| SCSS variables | _tokens.scss | Legacy SCSS |
| JSON flat | tokens.json | Tool integration |
| Tailwind theme | theme.js | tailwind.config.js |

---

## 7. Multi-Brand Theming

### Arquitetura
```
tokens/
├── core/           ← L3 (shared across all brands)
│   ├── button.json
│   └── input.json
├── semantic/       ← L2 (shared structure, may vary)
│   ├── colors.json
│   └── spacing.json
└── brands/         ← L1 (unique per brand)
    ├── brand-a/
    │   ├── colors.json
    │   └── typography.json
    └── brand-b/
        ├── colors.json
        └── typography.json
```

### Regra de Ouro
> L3 e compartilhado. L2 e estruturalmente identico. Apenas L1 varia por marca.

---

## 8. Token Governance

### Lifecycle
```
Proposal → Review → Alpha → Beta → Stable → Deprecated → Removed
```

| Stage | Regra |
|-------|-------|
| Proposal | RFC com justificativa |
| Review | Design + Dev approval |
| Alpha | Uso interno, pode mudar |
| Beta | Uso em produção limitado |
| Stable | Fully supported, SemVer |
| Deprecated | 2 minor versions notice |
| Removed | Next major version |

### Naming Convention
| Regra | Exemplo |
|-------|---------|
| kebab-case | `color-action-primary` |
| Category first | `color.`, `spacing.`, `font.` |
| No abbreviations | `background` not `bg` in token name |
| Descriptive | `color.feedback.error` not `color.red` |

---

---

## 9. OKLCH Color Space (Modern Color Theory)

### Por que OKLCH substitui HSL

OKLCH (2020, Bjorn Ottosson) resolve o problema fundamental do HSL: luminosidade matematica ≠ luminosidade percebida. Em HSL, amarelo `hsl(60, 100%, 50%)` e azul `hsl(240, 100%, 50%)` tem a mesma `lightness` matematica mas luminancias percebidas dramaticamente diferentes.

Em OKLCH, cores com o mesmo valor L realmente parecem ter a mesma luminosidade perceptual. Isso permite gerar escalas de cor coerentes programaticamente.

**Anatomia de OKLCH:**
```
oklch(L C H)
      │ │ │
      │ │ └── Hue: 0-360 (angulo na roda de cores)
      │ └──── Chroma: 0-0.37 (saturacao — 0 = cinza puro)
      └────── Lightness: 0-1 (0 = preto, 1 = branco)
```

**Escala de azul perceptualmente uniforme:**
```css
:root {
  --blue-50:  oklch(97% 0.02 250);
  --blue-100: oklch(93% 0.04 250);
  --blue-200: oklch(87% 0.08 250);
  --blue-300: oklch(78% 0.12 250);
  --blue-400: oklch(68% 0.16 250);
  --blue-500: oklch(58% 0.20 250);
  --blue-600: oklch(48% 0.18 250);
  --blue-700: oklch(38% 0.15 250);
  --blue-800: oklch(28% 0.12 250);
  --blue-900: oklch(18% 0.08 250);
}
```

### CSS Color Functions Modernas

**`color-mix()` para variantes:**
```css
:root {
  --brand: oklch(60% 0.15 250);
  --brand-light: color-mix(in oklch, var(--brand) 70%, white);
  --brand-dark:  color-mix(in oklch, var(--brand) 70%, black);
  --brand-muted: oklch(from var(--brand) l calc(c * 0.4) h);
}
```

**Relative color syntax (CSS Color Level 5):**
```css
:root {
  --brand-light: oklch(from var(--brand) calc(l + 0.2) c h);
  --brand-dark:  oklch(from var(--brand) calc(l - 0.2) c h);
  --brand-alpha: oklch(from var(--brand) l c h / 0.5);
}
```

### Adocao na Industria

| Sistema | Status OKLCH |
|---------|-------------|
| Tailwind CSS v4 (Jan 2025) | Paleta nativa em OKLCH |
| Material 3 (Google) | Dynamic Color usa OKLCH internamente |
| W3C DTCG spec | Aceita `oklch()` como valor de `color` type |
| oklch.com (Lea Verou / MIT) | Ferramenta interativa de exploracao |

**Lea Verou** (pesquisadora MIT, CSS Working Group) e a principal defensora de OKLCH na web. Sua ferramenta oklch.com permite explorar o espaco de cor e copiar valores para CSS.

### Contraste WCAG com OKLCH

Para verificar contraste em OKLCH, use o lightness como proxy inicial (L < 0.5 = dark, L > 0.5 = light) mas sempre valide com ferramentas APCA (Accessible Perceptual Contrast Algorithm) ou o algoritmo WCAG 2.x para conformidade oficial.

---

## 10. Figma Variables Pipeline (2023-2026)

### Figma Variables vs Tokens Studio

| Feature | Figma Variables (nativo) | Tokens Studio (plugin) |
|---------|------------------------|----------------------|
| Modes (light/dark) | Sim, nativo | Sim, com token sets |
| Tipos suportados | Color, number, string, boolean | Todos os tipos W3C DTCG |
| Git sync | Sim (2025-2026) | Sim (GitHub/GitLab/Azure DevOps) |
| W3C DTCG export | Parcial | Nativo |
| Multi-brand | Via modes | Via token sets compostos |
| CI/CD integration | Via REST API | Via plugin + GitHub |

**Recomendacao:** Figma Variables para o dia-a-dia no Figma, Tokens Studio para a pipeline automatizada com Style Dictionary.

### Pipeline Completo

```
1. Design no Figma → Tokens Studio (gerencia tokens)
2. Tokens Studio → Push para GitHub (JSON W3C DTCG)
3. GitHub → CI/CD (GitHub Actions) → Style Dictionary build
4. Style Dictionary → Outputs:
   ├── CSS Custom Properties (browsers)
   ├── SCSS Variables (legacy support)
   ├── TypeScript constants (type-safe JS)
   ├── Swift (iOS)
   ├── XML/Kotlin (Android)
   └── Tailwind theme (tailwind.config.js)
5. Outputs → Publicados como pacote npm (@org/tokens)
6. Times consomem @org/tokens como dependencia
```

### Figma Code Connect (2024)

Code Connect mapeia componentes Figma diretamente a componentes de codigo:

```typescript
// button.figma.tsx — define o mapeamento
import figma from '@figma/code-connect'
import { Button } from './Button'

figma.connect(Button, 'https://figma.com/...', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Ghost: 'ghost',
    }),
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
    label: figma.string('Label'),
  },
  example: ({ variant, size, label }) => (
    <Button variant={variant} size={size}>{label}</Button>
  ),
})
```

Quando um desenvolvedor inspeciona o componente no Figma Dev Mode, ve o codigo React real com as props corretas — nao uma aproximacao.

---

## 11. Style Dictionary 4.0 (2024)

### Novidades da v4

| Feature | Descricao |
|---------|----------|
| W3C DTCG default | Formato $value/$type e o padrao (nao mais legado) |
| Token references | Aliases resolvidos automaticamente no output |
| ESM custom transforms | Transforms escritos em ES Modules |
| TypeScript types | Tipagem completa da API de configuracao |
| Async transforms | Transforms podem ser assincronos |

### Configuracao v4 (ESM)
```javascript
// style-dictionary.config.mjs
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: { outputReferences: true, selector: ':root' }
      }]
    },
    'css-dark': {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      source: ['tokens/themes/dark.json'],
      files: [{
        destination: 'tokens-dark.css',
        format: 'css/variables',
        options: { selector: '[data-theme="dark"]' }
      }]
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'dist/ios/',
      files: [{
        destination: 'Tokens.swift',
        format: 'ios-swift/class.swift'
      }]
    },
    android: {
      transformGroup: 'android',
      buildPath: 'dist/android/',
      files: [{
        destination: 'tokens.xml',
        format: 'android/resources'
      }]
    }
  }
});

await sd.buildAllPlatforms();
```

---

## 12. Token Governance (Processo Completo)

### Lifecycle Completo
```
Proposal → RFC Review → Alpha → Beta → Stable → Deprecated → Removed
```

| Stage | Criterio de Entrada | SemVer |
|-------|--------------------|-|
| Proposal | RFC document criado | — |
| Alpha | RFC aprovado, implementado | `v0.x.x-alpha` |
| Beta | Testado em 1+ produto | `v0.x.x-beta` |
| Stable | Testado em 3+ produtos | `v1.0.0` |
| Deprecated | Substituicao identificada | `@deprecated` |
| Removed | 2 minor releases de notice | `MAJOR` bump |

### RFC Document Template
```markdown
## Token RFC: [token-name]

### Problema
[Qual problema esse token resolve?]

### Proposta
[Nome, valor, tier (L1/L2/L3), tipo DTCG]

### Alternativas Consideradas
[Quais alternativas foram avaliadas?]

### Impacto
[Quantos componentes/produtos sao afetados?]

### Timeline
[Proposta de datas para cada stage]
```

### Naming Convention Completa
| Nivel | Padrao | Exemplo |
|-------|--------|---------|
| L1 Primitive | `{category}.{scale}` | `color.blue.500` |
| L2 Semantic | `{category}.{context}.{role}` | `color.surface.default` |
| L3 Component | `{component}.{variant}.{property}.{state}` | `button.primary.bg.hover` |

**Regras estritas:**
- kebab-case em nomes de arquivo, dot.notation nos tokens
- Plural para colecoes (`colors.json`), singular para tokens (`color.blue.500`)
- Sem abreviacoes em nomes de tokens (`background` nao `bg`)
- Estado sempre por ultimo na hierarquia (`.hover`, `.focus`, `.disabled`)

---

## Referencias
- W3C Design Token Community Group Spec — versao estavel 2025.10 (design-tokens.github.io)
- Style Dictionary 4.0 documentation (amzn.github.io/style-dictionary)
- Tokens Studio documentation (tokens.studio)
- Nathan Curtis — Token taxonomy articles (medium.com/@nathanacurtis)
- Jina Anne — Design Tokens Origin (Salesforce SLDS, 2014)
- Lea Verou — OKLCH tool (oklch.com)
- Figma Code Connect documentation (figma.com/developers/code-connect)
