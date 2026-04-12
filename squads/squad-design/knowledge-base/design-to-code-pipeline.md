# Knowledge Base: Design-to-Code Pipeline

## Escopo
Pipeline completo de design para codigo — Figma Dev Mode, Code Connect, Storybook 8-10, visual regression testing (Chromatic, Percy) e single source of truth. Fonte: MS-002 Design System Research (2026-04-07).

---

## 1. Abordagens do Espectro

### Abordagem 1 — Inspecao Manual (Tradicional)
Designer cria no Figma. Desenvolvedor abre Dev Mode, inspeciona propriedades, recria manualmente. Lento, error-prone, maior fonte de inconsistencia.

### Abordagem 2 — Figma-to-Code Generators
Ferramentas (Anima, Locofy, Builder.io) que exportam designs como HTML/CSS/React. Melhoraram significativamente com IA (2024-2025), mas codigo raramente e production-ready — serve como ponto de partida.

### Abordagem 3 — Design Tokens + Componentes Mapeados (Estado da Arte)
O design system define tokens e componentes tanto no Figma quanto no codigo. O mapeamento e explicito. O desenvolvedor identifica qual componente usar e quais props — nao "traduz".

### Abordagem 4 — Code Connect (Figma, 2024 — Melhor Pratica)
Componentes Figma vinculados diretamente a componentes de codigo. Quando o dev inspeciona um Button no Figma, ve o codigo React exato.

**Fluxo unificado (estado da arte):**
```
Figma (Design Tokens + Components)
  → Style Dictionary (Token Transformation)
    → React/Vue Components (Code)
      → Storybook (Documentation + Testing)
        → Chromatic (Visual Regression)
          → Production (Deployed)
```

---

## 2. Figma Dev Mode (2023-2026)

### Timeline de Features

| Feature | Lancamento | Impacto |
|---------|-----------|---------|
| Components | 2016 | Reuso de elementos de design |
| Design Tokens (Styles) | 2018 | Cores, tipografia, effects reutilizaveis |
| Auto Layout | 2019, major 2022 | Layout responsivo |
| Variants | 2020 | Multiplas variantes em componente unico |
| **Dev Mode** | 2023 | Inspecao otimizada para desenvolvedores |
| **Variables** | 2023 | Design tokens nativos com modes (light/dark) |
| **Code Connect** | 2024 | Mapeamento direto Figma ↔ codigo |
| Multi-edit | 2024 | Editar multiplas instancias simultaneamente |
| AI features | 2024-2025 | Geracao, busca, organizacao por IA |
| **Git Integration** | 2025-2026 | Branch, commit e merge para GitHub/GitLab |
| **Bidirectional Code Sync** | 2025-2026 | Componentes Figma sincronizam com codebases React |
| **MCP Server** | 2025-2026 | Dev Mode como contexto para geracao de codigo por IA |

### Figma Variables (2023)
- Suporta modes: light, dark, brand-a, brand-b
- Tipos: color, number, string, boolean
- Organizadas em colecoes (ex: "Primitives", "Semantic", "Component")
- Limitacao: nao suporta todos os tipos W3C DTCG (sem shadow, typography compostos)
- Parceiro com Tokens Studio para pipeline completa

---

## 3. Figma Code Connect (2024)

Code Connect mapeia componentes Figma diretamente a componentes de codigo. Resultado: desenvolvedor inspeciona componente no Figma e ve o codigo real de uso — nao uma aproximacao.

### Setup

```bash
npm install @figma/code-connect
npx figma connect publish
```

### Definindo um mapeamento

```typescript
// button.figma.tsx
import figma from '@figma/code-connect'
import { Button } from '@/components/ui/button'

figma.connect(Button, 'https://www.figma.com/file/...?node-id=...', {
  props: {
    variant: figma.enum('Variant', {
      'Primary': 'primary',
      'Secondary': 'secondary',
      'Outline': 'outline',
      'Ghost': 'ghost',
      'Destructive': 'destructive',
    }),
    size: figma.enum('Size', {
      'Small': 'sm',
      'Medium': 'md',
      'Large': 'lg',
    }),
    label: figma.string('Label'),
    disabled: figma.boolean('Disabled'),
    loading: figma.boolean('Loading'),
  },
  example: ({ variant, size, label, disabled, loading }) => (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      // loading handled via aria-busy
    >
      {label}
    </Button>
  ),
})
```

Agora, quando um dev inspeciona um Button Primary/Large no Figma, ve exatamente:
```tsx
import { Button } from '@/components/ui/button'
<Button variant="primary" size="lg">Submit</Button>
```

---

## 4. Storybook (v8 → v10)

### O que Storybook faz
- Renderiza componentes em isolamento (sem contexto de app)
- Documenta variantes e estados via "stories"
- Permite teste interativo (mudar props em tempo real via Controls)
- Integra addons para a11y, responsive, docs, actions, viewport
- Gera documentacao automatica via MDX ou autodocs
- Suporta React, Vue, Angular, Svelte, Web Components, HTML

### Story Completa (CSF3)

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'destructive'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    a11y: { disable: false },
    chromatic: { delay: 300 },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Button' },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving...' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Cannot click' },
};

// Interaction test com Play Function
export const WithClick: Story = {
  args: { variant: 'primary', children: 'Click me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Click me' });
    await userEvent.click(button);
    await expect(button).toBeInTheDocument();
  },
};
```

### Evolucao de Versoes

| Versao | Lancamento | Feature Principal |
|--------|-----------|-------------------|
| v8 | Marco 2024 | Portable stories, Visual tests built-in, RSC experimental |
| v9 | Mid 2025 | Storybook Test (parceria Vitest), Svelte 5 + React Native, -50% install size |
| v10 | Out 2025 | ESM-only, -29% install size adicional, CSF Factories (preview), tag exclusion |

### Addons Essenciais

| Addon | Funcao |
|-------|--------|
| `@storybook/addon-controls` | Modificar props interativamente |
| `@storybook/addon-actions` | Log de eventos (onClick, onChange) |
| `@storybook/addon-viewport` | Simular diferentes tamanhos de tela |
| `@storybook/addon-a11y` | Auditoria de acessibilidade (axe-core) |
| `@storybook/addon-interactions` | Testes de interacao com Play Functions |
| `@chromatic-com/storybook` | Visual regression (Chromatic) |
| `@storybook/blocks` (MDX) | Documentacao rica com Canvas, Controls |

---

## 5. Visual Regression Testing

Visual regression testing compara screenshots de componentes entre versoes para detectar mudancas visuais nao intencionais.

### Chromatic (pelos criadores do Storybook)

Ferramenta dominante para visual regression. Processo:

```
1. Renderiza cada story em browsers reais (Chrome, Firefox, Safari)
2. Captura screenshots em pixel-perfect
3. Compara com baseline anterior (pixel diff)
4. Mostra diff visual para mudancas detectadas
5. Requer aprovacao humana para mudancas intencionais
6. Atualiza baseline apos aprovacao
```

**Setup GitHub Actions:**
```yaml
# .github/workflows/chromatic.yml
name: Chromatic
on: [push]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Install dependencies
        run: npm ci
      - name: Run Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_TOKEN }}
          onlyChanged: true  # Turbosnap: so testa mudancas
```

**Turbosnap:** Detecta automaticamente quais stories precisam re-testar baseado em quais arquivos mudaram. Reduz tempo de CI em 50-80%.

### Percy (BrowserStack)
Alternativa ao Chromatic. Foco em full-page screenshots. Integra com Storybook, Cypress, Playwright.

### Playwright Screenshots (DIY)
```typescript
// button.visual.spec.ts
import { test, expect } from '@playwright/test';

test('button primary visual', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=components-button--primary');
  await expect(page.locator('button')).toHaveScreenshot('button-primary.png', {
    threshold: 0.1, // 10% de tolerancia para anti-aliasing
  });
});
```

### Estrategia Pratica
```
Nivel 1 — Storybook + Chromatic (recomendado para 95% dos casos)
  • Cada story = baseline visual
  • PR = comparacao automatica
  • Aprovacao por designer ou lider tecnico

Nivel 2 — Playwright screenshots (full app testing)
  • Pages completas, nao apenas componentes isolados
  • Detecta problemas de integracao entre componentes

Nivel 3 — BrowserStack / Percy (cross-browser)
  • Chrome, Firefox, Safari, Edge em versoes multiplas
  • iOS Safari, Android Chrome
```

---

## 6. Single Source of Truth

O objetivo final: mudancas em tokens propagam automaticamente para todas as plataformas.

```
TOKENS (SSOT para valores visuais)
  tokens/colors.json
  tokens/spacing.json
  tokens/typography.json
       │
       ├─── Figma Variables (via Tokens Studio sync)
       │        Designer ve tokens atualizados no Figma
       │
       ├─── CSS Variables (via Style Dictionary)
       │        :root { --color-primary: oklch(60% 0.15 250); }
       │
       ├─── TypeScript constants (via Style Dictionary)
       │        export const colorPrimary = 'oklch(60% 0.15 250)'
       │
       ├─── iOS Swift (via Style Dictionary)
       │        static let colorPrimary = UIColor(...)
       │
       └─── Android XML (via Style Dictionary)
                <color name="color_primary">...</color>

COMPONENTES (SSOT para comportamento)
  Button.tsx (codigo)
       │
       ├─── Button.stories.tsx (documentacao + testes)
       ├─── Button.figma.tsx (Code Connect mapeamento)
       └─── Button.visual.spec.ts (visual regression)
```

---

## 7. Design Engineering (Continuo)

**Design Engineering** — profissionais que operam confortavelmente em design e codigo — e a resposta para a lacuna de "traducao".

### Perfil do Design Engineer
- Confortavel em Figma E em codigo React/Vue
- Entende tokens, componentes, e ARIA
- Capaz de prototipar em codigo (nao apenas Figma)
- Ponte entre designers e engenheiros

**Sarah Drasner** (VP of Developer Experience, Netlify) exemplifica: engenheira com profunda sensibilidade visual, dominio de animacao, tipografia e composicao.

### Responsabilidades
| Area | O que faz |
|------|-----------|
| Token pipeline | Configura e mantem Style Dictionary |
| Figma hygiene | Define convencoes, mantem componentes Figma |
| Code Connect | Mapeia Figma para codigo |
| Storybook | Escreve stories e documentacao |
| Prototipagem | Prototipos de alta fidelidade em codigo |
| Bridge | Facilita comunicacao design-dev |

---

## 8. Checklist de Pipeline

### Por Componente
```
Design:
- [ ] Componente Figma criado com variantes completas
- [ ] Variables/tokens aplicados (sem cores hardcoded)
- [ ] Especificacao de acessibilidade na descricao
- [ ] Code Connect definido (.figma.tsx)

Codigo:
- [ ] Componente implementado com TypeScript estrito
- [ ] Tokens CSS usados para todos os valores visuais
- [ ] Acessibilidade (ARIA, keyboard, focus)
- [ ] forwardRef e displayName

Documentacao:
- [ ] Stories para cada variante e estado
- [ ] MDX com when/when-not-to-use
- [ ] Prop table completa (autodocs)

Testing:
- [ ] Unit tests (Testing Library + Vitest)
- [ ] a11y test (jest-axe)
- [ ] Chromatic baseline criada

Tokens:
- [ ] Component tokens (L3) criados
- [ ] Style Dictionary build passa
- [ ] CSS variables corretas em light + dark mode
```

---

## Referencias
- Figma Code Connect documentation — figma.com/developers/code-connect
- Storybook documentation — storybook.js.org
- Chromatic documentation — chromatic.com/docs
- MS-002 Design System Research — SINAPSE (2026-04-07)
- Sarah Drasner — "SVG Animations" (O'Reilly, 2017)
