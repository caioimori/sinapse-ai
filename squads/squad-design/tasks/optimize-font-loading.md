---
task: optimize-font-loading
responsavel: "@dx-performance-engineer"
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

# Task: Optimize Font Loading

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Standard

## Objetivo
Otimizar carregamento de web fonts — minimizar FOUT/FOIT, reduzir tamanho e garantir que fonts nao impactam LCP.

## Entrada
- Selected typefaces
- Character sets needed
- Performance budgets (fonts < 100KB)
- Browser targets

## Passos

### 1. Font Strategy
| Aspecto | Recomendacao |
|---------|-------------|
| Fonte | next/font (auto-optimization) |
| Formato | WOFF2 (melhor compressao) |
| Subsetting | Latin only (ou conforme necessidade) |
| Weights | Max 3-4 (regular, medium, semibold, bold) |
| Italics | Apenas se realmente usado |
| Variable font | Preferir quando disponivel |

### 2. Next.js Font Optimization
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Font Budget
| Item | Budget |
|------|--------|
| Total font files | < 100KB |
| Per weight | < 25KB (WOFF2) |
| Max weights loaded | 4 |
| Variable font | < 50KB (all weights) |
| Font files count | <= 2 files |

### 4. font-display Strategy
| Valor | Comportamento | Quando |
|-------|--------------|--------|
| swap | Fallback → swap when loaded | Default (best for LCP) |
| optional | Fallback → swap only if cached | Best for CLS |
| fallback | Short block → swap if fast | Balance |
| block | Invisible → show when loaded | Never for body text |

### 5. Self-Hosting vs CDN
| Approach | Pros | Cons |
|----------|------|------|
| Self-host (next/font) | No external request, preload | Need to manage updates |
| Google Fonts CDN | Easy, cached globally | Extra DNS + connection |
| **Recomendacao** | Self-host via next/font | Best performance |

### 6. Fallback Font Matching
```css
/* Size-adjusted fallback to prevent CLS */
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  ascent-override: 90.44%;
  descent-override: 22.25%;
  line-gap-override: 0%;
  size-adjust: 107.64%;
}
```

Next.js handles this automatically with `adjustFontFallback`.

## Saida
- Font loading configuration
- next/font setup
- Font budget documentation
- Fallback font configuration
- Performance impact measurement

## Validacao
- [ ] Fonts self-hosted via next/font
- [ ] WOFF2 format only
- [ ] Total < 100KB
- [ ] font-display: swap configurado
- [ ] Subsets definidos (latin)
- [ ] No FOIT (invisible text)
- [ ] Fallback font size-matched
