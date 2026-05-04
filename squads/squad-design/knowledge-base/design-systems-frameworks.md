# Knowledge Base: Design Systems & Frameworks Reference

## Escopo
Referencia completa de design systems — arquitetura 5-camadas, governance models, Atomic Design, component libraries, CSS approaches, DesignOps, e frameworks de mercado.

---

## 1. Arquitetura de 5 Camadas (EightShapes / Nathan Curtis)

```
┌─────────────────────────────────────────┐
│           5. TEMPLATES                  │  Layouts de pagina completos
├─────────────────────────────────────────┤
│           4. PATTERNS                   │  Composicoes de UI (forms, nav, cards)
├─────────────────────────────────────────┤
│           3. COMPONENTS                 │  Elementos reutilizaveis (Button, Input)
├─────────────────────────────────────────┤
│           2. TOKENS                     │  Valores de design (cores, spacing, type)
├─────────────────────────────────────────┤
│           1. FOUNDATIONS                │  Principios, brand, voz e tom
└─────────────────────────────────────────┘
```

| Camada | Papel | Mutabilidade |
|--------|-------|-------------|
| **Foundations** | Principios, brand personality, design principles | Raramente muda — e a "constituicao" |
| **Tokens** | Valores numericos de decisions de design | Muda com theming, dark mode, brands |
| **Components** | Elementos reutilizaveis com API documentada | Evolui com versioning semantico |
| **Patterns** | Composicoes que resolvem UX recorrente | Cresce com o produto |
| **Templates** | Layouts completos de pagina | Especificos por produto |

**Principio central:** Dependencia flui de baixo para cima. Mudar uma Foundation (cor primaria como token) propaga automaticamente para todos os componentes que a referenciam.

---

## 2. Atomic Design (Brad Frost, 2013/2016)

### 5 Niveis

| Nivel | Analogia Quimica | Descricao | Exemplos |
|-------|-----------------|-----------|----------|
| **Atoms** | Atomo | Elementos basicos irredutiveis | Button, Input, Label, Icon, Badge |
| **Molecules** | Molecula | Grupos de atoms com funcao | Search Field, Form Field, Card Action |
| **Organisms** | Organismo | Secoes compostas | Header, Product Card, Data Table |
| **Templates** | Blueprint | Layouts sem conteudo real | Dashboard Layout, Settings Page |
| **Pages** | Pagina final | Templates com conteudo real | Dashboard com dados reais |

### Hierarquia Simplificada (pratica moderna)
```
Primitives → Components → Patterns → Layouts
```
A maioria dos design systems na pratica usa essa hierarquia, mas o pensamento composicional de Frost permanece como base intelectual.

### Criticas validas
- Fronteira molecule/organism e nebulosa
- Templates e Pages sao mais sobre conteudo que sobre componentes
- Metafora quimica nao escala perfeitamente

---

## 3. System of Systems (Federated Architecture)

### Modelo Umbrella (Google Material)
```
          ┌──────────────────────┐
          │  Material Design     │  ← Core System (foundations + tokens)
          └──────────┬───────────┘
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│ Android │   │ Flutter │   │  Web    │
│ (M3)    │   │  (M3)   │   │ (MWC)  │
└─────────┘   └─────────┘   └─────────┘
```

### Modelo Hub & Spoke (Salesforce)
O Lightning Design System (SLDS) e o hub central. Cada produto (Sales Cloud, Service Cloud) e um spoke que estende o hub com componentes especificos.

### Modelo Multi-Brand (Natura &Co)
Core tokens e componentes "neutros" tematizados via L1 tokens de marca. O mesmo `<Button>` renderiza verde para Natura, rosa para Avon — apenas tokens mudam, nao o componente.

---

## 4. Governance Models

### Modelo Centralizado
| Vantagem | Desvantagem |
|----------|-------------|
| Consistencia maxima | Bottleneck (gargalo no time central) |
| Qualidade alta | Lento para atender demandas |
| Governanca forte | Desconexao com necessidades reais |

**Exemplos:** Salesforce (Lightning), IBM (Carbon), Microsoft (Fluent)

### Modelo Federado (Community-Driven)
| Vantagem | Desvantagem |
|----------|-------------|
| Rapido — times criam o que precisam | Risco de inconsistencia |
| Engajamento alto | Precisa de processos rigorosos de review |
| Evolui com o produto | Overhead de coordenacao |

### Modelo Hibrido (Hub + Spokes) — Mais Comum 2024-2026
Time central (2-4 pessoas) mantem core components + governance. Contribuidores de equipes adicionam via RFC process.

**Exemplos:** Shopify (Polaris), GitHub (Primer), Atlassian

### RFC Process (Request for Comments)
```
1. Proposer cria RFC document
   (problema, solucao proposta, API, acessibilidade, timeline)
2. Review period (7-14 dias) — feedback da comunidade
3. Decisao: aceitar, modificar ou rejeitar
4. Implementacao (proposer ou core team)
5. Review de codigo + review de design
6. Publicacao + documentacao
```

### Promotion Model
```
1. Time cria componente local para necessidade especifica
2. Componente e util para outros times → candidato a promocao
3. Core team avalia: reuso potencial, qualidade, acessibilidade
4. Se aprovado → migra para o sistema central
```

---

## 5. CSS Approaches para Design Systems

### Tailwind CSS (94K+ stars, v4 Jan 2025)
Utility-first framework por Adam Wathan e Steve Schoger.

**Tailwind v4 novidades (lancado 22 Jan 2025):**
- Engine reescrito do zero: full builds ate 5x mais rapidos, incremental 100x+
- Configuracao CSS-first (nao mais `tailwind.config.js` obrigatorio)
- Deteccao automatica de conteudo
- Paleta de cores modernizada em **OKLCH**
- Suporte nativo a cascade layers, `@property`, `color-mix()`

```tsx
<button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold
  py-2 px-4 rounded-lg shadow-md transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
  Button
</button>
```

### CSS Modules
Escopoamento local por arquivo. Zero runtime overhead. Simples e previsivel.

```css
/* Button.module.css */
.button { background: var(--color-primary); padding: 8px 16px; }
.button:hover { background: var(--color-primary-hover); }
```

### vanilla-extract (9K+ stars)
CSS-in-TypeScript com zero runtime. Estilos escritos em TypeScript, compilados para CSS em build time.

```typescript
// button.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const button = style({
  background: vars.color.primary,
  padding: `${vars.spacing[2]} ${vars.spacing[4]}`,
  borderRadius: vars.radius.md,
  ':hover': { background: vars.color.primaryHover },
});
```

### Panda CSS (5K+ stars)
Por Segun Adebayo (criador do Chakra UI). Combina utilities (Tailwind) com CSS-in-JS (tipagem, recipes) e zero runtime.

```typescript
const button = cva({
  base: { display: 'flex', alignItems: 'center' },
  variants: {
    variant: {
      primary: { bg: 'blue.500', color: 'white' },
      secondary: { bg: 'gray.100', color: 'gray.900' },
    },
    size: {
      sm: { px: '3', py: '1', fontSize: 'sm' },
      md: { px: '4', py: '2', fontSize: 'md' },
    },
  },
});
```

### CSS Layers (Cascade Layers)
`@layer` controla especificidade sem `!important`:

```css
@layer reset, tokens, components, utilities;

@layer tokens {
  :root { --color-primary: oklch(60% 0.15 250); }
}
@layer components {
  .button { background: var(--color-primary); }
}
@layer utilities {
  .text-primary { color: var(--color-primary); }
}
```

---

## 6. Component Libraries React (Comparacao)

| Biblioteca | Stars (Apr 2026) | Abordagem | Base | Bundle |
|-----------|-----------------|-----------|------|--------|
| Material UI (MUI) | 97K+ | Styled Material Design | Emotion/CSS vars | Pesado (~70KB) |
| Ant Design | 93K+ | Enterprise components | Less/CSS | Pesado |
| Tailwind CSS | 94K+ | Utility framework | PostCSS | Zero runtime |
| shadcn/ui | 112K+ | Copy-paste components | Radix + Tailwind | Minimal (voce owns) |
| Chakra UI v3 | 38K+ | Component library | Ark UI (headless) | Medio |
| Mantine | 27K+ | Full-featured | CSS Modules | Medio |
| Radix UI | Base para shadcn | Headless primitives | None | Minimal |

### Material UI (MUI) — 97K+ stars
A mais popular biblioteca React. Implementa Material Design com extensoes proprias. 70+ componentes, customizavel via theme. MUI v6 (2025) introduziu suporte a CSS variables e melhor zero-runtime styling.

### shadcn/ui — 112K+ stars (fenomeno 2023-2026)
**Nao e um pacote npm** — e uma colecao de componentes copy-paste sobre Radix UI + Tailwind CSS. Voce executa `npx shadcn@latest add button` e o componente e copiado para seu projeto, totalmente customizavel.

Filosofia: "componentes sao seus, nao de uma dependencia."

Em 2025-2026, ferramentas de IA (Claude Code, v0, Lovable) adotaram shadcn como biblioteca UI padrao, acelerando adocao massivamente (250K+ weekly npm installs). Em 2026, lancou Visual Project Builder e expandiu para Vue e Svelte.

### Radix UI
Criada pela WorkOS. Primitivos de interface (Dialog, Dropdown, Tabs, Accordion, Tooltip) que sao:
- Acessiveis out-of-the-box (ARIA patterns corretos, keyboard navigation)
- Unstyled (total liberdade visual)
- Composiveis (compound components API)
- Controlados e nao-controlados

### Chakra UI v3 (38K+ stars)
Por Segun Adebayo. Foco em DX e acessibilidade. v3 (2025) reconstruiu sobre Ark UI (headless) para melhor performance.

### Ant Design (93K+ stars)
Biblioteca chinesa (Alibaba) massivamente popular na Asia. Rica em componentes enterprise (Table complexo, DatePicker, Layout). Excelente para admin panels e dashboards.

---

## 7. Headless Components

O padrao headless separa **logica/comportamento** da **apresentacao visual**. O componente headless gerencia estado, acessibilidade, keyboard navigation e ARIA — mas sem estilos visuais.

| Biblioteca | Mantida por | Approach |
|-----------|-------------|----------|
| **Radix UI** | WorkOS | React unstyled com a11y impecavel |
| **Headless UI** | Tailwind Labs | Para Tailwind CSS (React + Vue) |
| **React Aria** | Adobe | Hooks de acessibilidade (base do Spectrum) |
| **Ark UI** | Chakra/Segun Adebayo | Multi-framework (React, Vue, Solid) |
| **Kobalte** | Comunidade | Headless para Solid.js |
| **Melt UI** | Comunidade | Headless para Svelte |

---

## 8. Web Components

Padroes nativos (Custom Elements + Shadow DOM + HTML Templates) para componentes sem framework.

**Lit (Google — 18K+ stars):** Principal biblioteca para Web Components.

```typescript
@customElement('my-button')
class MyButton extends LitElement {
  @property() variant: 'primary' | 'secondary' = 'primary';
  @property({ type: Boolean }) loading = false;

  render() {
    return html`
      <button class="btn btn-${this.variant}" ?disabled=${this.loading}>
        <slot></slot>
      </button>
    `;
  }
}
```

**Organizacoes usando Web Components:** Google (Material Web), SAP (UI5), Salesforce (Lightning Web Components), ING Bank (Lion). Caso de uso mais forte: multiplos frameworks.

---

## 9. ROI e Metricas

### ROI Benchmark (Sparkbox Design Systems Survey 2023)
- Reducao media de **34%** no tempo de desenvolvimento
- Reducao media de **29%** em bugs visuais
- **89%** reportam melhoria em consistencia
- **72%** reportam melhoria em velocidade

### Cases notaveis
- **Salesforce Lightning:** Estimados $2B+ economizados anualmente
- **Shopify Polaris:** Reducao de 50% no tempo de construcao de novas telas

### Metricas de Adocao
| Metrica | Como medir | Target |
|---------|-----------|--------|
| Coverage | % de telas usando componentes do sistema | > 80% |
| Token compliance | % de valores visuais via tokens | > 95% |
| Component reuse | # de instancias por componente | > 10 (media) |
| Design-dev parity | % de componentes com equivalente Figma+codigo | > 90% |
| Time to implement | Tempo para nova tela | Reducao > 40% |
| Satisfaction NPS | Survey trimestral | > 50 |

### Ferramentas de Medicao
- **Omlet** (YC-backed): Analisa codebase e mede adocao automaticamente
- **Figma Analytics:** Quais componentes sao mais usados no Figma
- **Custom ESLint rules:** Detectam uso de componentes nao-aprovados

---

## 10. Foundations — Tipografia, Spacing e Motion

### Type Scale (Modular Scale)
**Tim Brown** (Adobe) popularizou o conceito de modular scale — tamanhos com relacao matematica:

| Razao | Nome | Valores (base 16px) | Uso |
|-------|------|---------------------|-----|
| 1.125 | Major Second | 14, 16, 18, 20, 23 | Interfaces densas |
| 1.200 | Minor Third | 13, 16, 19, 23, 28 | Padrao utilitario |
| 1.250 | Major Third | 13, 16, 20, 25, 31 | Equilibrado (mais comum) |
| 1.333 | Perfect Fourth | 12, 16, 21, 28, 38 | Expressivo |
| 1.500 | Perfect Fifth | 11, 16, 24, 36, 54 | Dramatico (landing pages) |

**Fluid Type (Utopia.fyi):** Elimina media queries para tipografia, interpolando com `clamp()`. Ver `responsive-modern-css.md` secao 11.

**Variable Fonts:** Um arquivo substitui 9+ arquivos estaticos. Inter Variable, Roboto Flex, Geist Variable sao os mais usados. Ver `responsive-modern-css.md` secao 12.

### Grid de 4px / 8px (Padrao da Industria)
Base 4px e o padrao universal: Material Design, Tailwind CSS, Polaris, Carbon. Divide bem em qualquer device pixel ratio.

```
Escala: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
```

### Motion Tokens (12 Principios de Animacao)
Baseado nos **12 principios de animacao da Disney** (Frank Thomas e Ollie Johnston, 1981). Para interfaces, os mais relevantes:

- **Easing:** Nada começa/para instantaneamente
- **Anticipation:** Sinalizar que algo vai acontecer
- **Follow-through:** Overshoot leve ao atingir destino

```json
{
  "motion": {
    "duration": {
      "instant":  { "$value": "50ms",  "$type": "duration" },
      "fast":     { "$value": "100ms", "$type": "duration" },
      "normal":   { "$value": "200ms", "$type": "duration" },
      "slow":     { "$value": "300ms", "$type": "duration" },
      "slower":   { "$value": "500ms", "$type": "duration" }
    },
    "easing": {
      "default": { "$value": "cubic-bezier(0.4, 0, 0.2, 1)",   "$type": "cubicBezier" },
      "in":      { "$value": "cubic-bezier(0.4, 0, 1, 1)",     "$type": "cubicBezier" },
      "out":     { "$value": "cubic-bezier(0, 0, 0.2, 1)",     "$type": "cubicBezier" },
      "spring":  { "$value": "cubic-bezier(0.175, 0.885, 0.32, 1.275)", "$type": "cubicBezier" }
    }
  }
}
```

**Animation vocabulary (patterns de uso):**
| Pattern | Quando | Exemplos |
|---------|--------|---------|
| Fade | Aparecer/desaparecer sem mover | Tooltip, notification |
| Slide | Entrar de uma direcao | Drawer, panel, sheet |
| Scale | Crescer/diminuir | Modal opening, zoom |
| Spring | Fisica de mola | Drag and drop, pull to refresh |
| Stagger | Grupo em sequencia | List items, cards grid |

**Framer Motion (23K+ stars):**
```tsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

**Reduced Motion (acessibilidade obrigatoria):**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Personagens Fundadores

| Pessoa | Contribuicao | Obra Principal |
|--------|-------------|----------------|
| **Brad Frost** | Atomic Design (2013/2016) | "Atomic Design" (2016) |
| **Nathan Curtis** | DS Operations, governance, token taxonomy | EightShapes articles |
| **Jina Anne** | Design Tokens (inventou o conceito, 2014) | W3C DTCG co-chair |
| **Dan Mall** | DS como produto, team models | "Design That Scales" (2022) |
| **Alla Kholmatova** | Framework teorico de DS como linguagem | "Design Systems" (Smashing, 2017) |
| **Adam Wathan** | Tailwind CSS, utility-first | "Refactoring UI" (2018) |
| **Segun Adebayo** | Chakra UI, Panda CSS, Ark UI | Developer advocate |
| **Heydon Pickering** | Componentes acessiveis | "Inclusive Components" (2019) |
| **Lea Verou** | OKLCH, CSS moderno | "CSS Secrets" (O'Reilly, 2015) |
| **Matias Duarte** | Material Design (Google) | material.io |

---

## Referencias
- Brad Frost — "Atomic Design" (2016) — atomicdesign.bradfrost.com
- Nathan Curtis — EightShapes articles — medium.com/@nathanacurtis
- Dan Mall — "Design That Scales" (2022)
- Alla Kholmatova — "Design Systems" (Smashing Magazine, 2017)
- Sparkbox Design Systems Survey 2023
- shadcn/ui — ui.shadcn.com
- Radix UI — radix-ui.com
- Tailwind CSS v4 — tailwindcss.com/blog/tailwindcss-v4
