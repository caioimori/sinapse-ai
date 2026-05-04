# Knowledge Base: WCAG & ARIA Reference

## Escopo
Referencia completa de WCAG 2.2 Level AA e ARIA patterns — criterios de sucesso, padroes de widgets acessiveis e tecnicas de implementacao.

---

## 1. WCAG 2.2 — Principios POUR

### Perceivable (Perceptivel)
| Criterio | Level | Descricao |
|----------|-------|----------|
| 1.1.1 Non-text Content | A | Alt text para imagens, icons |
| 1.2.1 Audio/Video (prerecorded) | A | Captions para media |
| 1.2.2 Captions (prerecorded) | A | Legendas sincronizadas |
| 1.2.3 Audio Description | A | Descricao de video |
| 1.2.5 Audio Description (prerecorded) | AA | Audio description completa |
| 1.3.1 Info and Relationships | A | Semantica HTML (headings, lists, tables) |
| 1.3.2 Meaningful Sequence | A | DOM order = visual order |
| 1.3.3 Sensory Characteristics | A | Nao depender so de cor/forma |
| 1.3.4 Orientation | AA | Funcionar em portrait e landscape |
| 1.3.5 Identify Input Purpose | AA | autocomplete em forms |
| 1.4.1 Use of Color | A | Cor nao como unico indicador |
| 1.4.2 Audio Control | A | Pausar audio automatico |
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 texto, 3:1 grande |
| 1.4.4 Resize Text | AA | Funcionar em 200% zoom |
| 1.4.5 Images of Text | AA | Nao usar imagens de texto |
| 1.4.10 Reflow | AA | Sem scroll horizontal ate 320px |
| 1.4.11 Non-text Contrast | AA | 3:1 para UI components |
| 1.4.12 Text Spacing | AA | Override de spacing funciona |
| 1.4.13 Content on Hover/Focus | AA | Tooltips acessiveis |

### Operable (Operavel)
| Criterio | Level | Descricao |
|----------|-------|----------|
| 2.1.1 Keyboard | A | Tudo operavel por teclado |
| 2.1.2 No Keyboard Trap | A | Foco nunca fica preso |
| 2.1.4 Character Key Shortcuts | A | Atalhos desativaveis |
| 2.2.1 Timing Adjustable | A | Timeouts ajustaveis |
| 2.2.2 Pause, Stop, Hide | A | Controlar animacoes |
| 2.3.1 Three Flashes | A | Sem flashes > 3/s |
| 2.4.1 Bypass Blocks | A | Skip links |
| 2.4.2 Page Titled | A | `<title>` descritivo |
| 2.4.3 Focus Order | A | Tab order logico |
| 2.4.4 Link Purpose (in Context) | A | Links descritivos |
| 2.4.5 Multiple Ways | AA | 2+ formas de achar pagina |
| 2.4.6 Headings and Labels | AA | Headings descritivos |
| 2.4.7 Focus Visible | AA | Focus indicator visivel |
| **2.4.11 Focus Not Obscured (Min)** | **AA (NEW 2.2)** | **Foco nao totalmente obstruido** |
| **2.4.13 Focus Appearance** | **AAA (NEW 2.2)** | **Focus indicator minimo 2px** |
| 2.5.1 Pointer Gestures | A | Alternativa a gestos complexos |
| 2.5.2 Pointer Cancellation | A | Cancel ao soltar (nao pressionar) |
| 2.5.3 Label in Name | A | Nome acessivel inclui texto visivel |
| 2.5.4 Motion Actuation | A | Alternativa a motion |
| **2.5.7 Dragging Movements** | **AA (NEW 2.2)** | **Alternativa a drag-and-drop** |
| **2.5.8 Target Size (Min)** | **AA (NEW 2.2)** | **Targets >= 24x24px** |

### Understandable (Compreensivel)
| Criterio | Level | Descricao |
|----------|-------|----------|
| 3.1.1 Language of Page | A | `lang` attribute |
| 3.1.2 Language of Parts | AA | `lang` em trechos de outra lingua |
| 3.2.1 On Focus | A | Sem mudanca de contexto no focus |
| 3.2.2 On Input | A | Sem mudanca inesperada no input |
| 3.2.3 Consistent Navigation | AA | Nav consistente entre paginas |
| 3.2.4 Consistent Identification | AA | Mesma funcao = mesmo nome |
| **3.2.6 Consistent Help** | **A (NEW 2.2)** | **Help no mesmo lugar relativo** |
| 3.3.1 Error Identification | A | Erros identificados em texto |
| 3.3.2 Labels or Instructions | A | Labels em todos os inputs |
| 3.3.3 Error Suggestion | AA | Sugestao de correcao |
| 3.3.4 Error Prevention (Legal) | AA | Reversivel, verificavel, confirmavel |
| **3.3.7 Redundant Entry** | **A (NEW 2.2)** | **Nao pedir dados ja informados** |
| **3.3.8 Accessible Auth (Min)** | **AA (NEW 2.2)** | **Auth sem cognitive test** |

### Robust (Robusto)
| Criterio | Level | Descricao |
|----------|-------|----------|
| 4.1.2 Name, Role, Value | A | ARIA correto para custom widgets |
| 4.1.3 Status Messages | AA | Live regions para feedback |

---

## 2. ARIA Roles

### Landmark Roles
| Role | HTML Semantico | Uso |
|------|---------------|-----|
| banner | `<header>` | Header principal |
| navigation | `<nav>` | Blocos de navegacao |
| main | `<main>` | Conteudo principal (1 por pagina) |
| complementary | `<aside>` | Conteudo complementar |
| contentinfo | `<footer>` | Footer principal |
| search | `<search>` | Busca |
| region | `<section>` | Secao com label |
| form | `<form>` | Formulario com label |

### Widget Roles
| Role | Uso | Keyboard |
|------|-----|---------|
| button | Acoes | Enter, Space |
| link | Navegacao | Enter |
| checkbox | On/off | Space |
| radio | Selecao unica | Arrow keys |
| switch | Toggle | Space |
| tab | Tab navigation | Arrow keys |
| tabpanel | Tab content | — |
| dialog | Modal | Escape (close) |
| alertdialog | Modal critico | Escape |
| menu | Menu de opcoes | Arrow keys, Enter |
| menuitem | Item de menu | Enter |
| combobox | Autocomplete | Arrow keys, Enter |
| listbox | Lista selecionavel | Arrow keys |
| slider | Range | Arrow keys |
| tree | Hierarquia | Arrow keys |
| tooltip | Dica contextual | — |

---

## 3. ARIA Patterns (APG)

### Dialog (Modal)
```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Action</h2>
  <p>Are you sure you want to proceed?</p>
  <button>Cancel</button>
  <button>Confirm</button>
</div>
```
| Requisito | Implementacao |
|-----------|-------------|
| Focus trap | Focus nao sai do dialog |
| Initial focus | Primeiro focusable ou close button |
| Escape | Fecha o dialog |
| Return focus | Volta ao trigger element |
| aria-modal | `true` |
| Backdrop | Click fecha (opcional) |

### Tabs
```html
<div role="tablist" aria-label="Settings">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
    General
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">
    Security
  </button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  <!-- General settings -->
</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
  <!-- Security settings -->
</div>
```
| Requisito | Implementacao |
|-----------|-------------|
| Arrow keys | Move entre tabs |
| Home/End | First/last tab |
| Active tab | `aria-selected="true"`, `tabindex="0"` |
| Inactive tab | `aria-selected="false"`, `tabindex="-1"` |

### Accordion
```html
<div>
  <h3>
    <button aria-expanded="true" aria-controls="section-1-content" id="section-1">
      Section 1
    </button>
  </h3>
  <div id="section-1-content" role="region" aria-labelledby="section-1">
    <!-- Content -->
  </div>
</div>
```

### Combobox (Autocomplete)
```html
<div>
  <label for="city-input">City</label>
  <input
    id="city-input"
    role="combobox"
    aria-expanded="true"
    aria-controls="city-listbox"
    aria-activedescendant="city-opt-2"
    aria-autocomplete="list"
  />
  <ul id="city-listbox" role="listbox">
    <li id="city-opt-1" role="option">New York</li>
    <li id="city-opt-2" role="option" aria-selected="true">London</li>
    <li id="city-opt-3" role="option">Tokyo</li>
  </ul>
</div>
```

---

## 4. ARIA States and Properties

### Comuns
| Atributo | Tipo | Uso |
|----------|------|-----|
| aria-label | String | Nome acessivel (sem texto visivel) |
| aria-labelledby | ID ref | Nome acessivel (de outro elemento) |
| aria-describedby | ID ref | Descricao adicional |
| aria-hidden | Boolean | Esconder de AT |
| aria-disabled | Boolean | Desabilitado (sem remover do tab order) |
| aria-expanded | Boolean | Expandido/colapsado |
| aria-selected | Boolean | Selecionado (tabs, listbox) |
| aria-checked | Boolean/mixed | Checked (checkbox, switch) |
| aria-pressed | Boolean | Toggle button |
| aria-current | Token | Pagina/step/item atual |
| aria-invalid | Boolean | Input com erro |
| aria-required | Boolean | Campo obrigatorio |
| aria-busy | Boolean | Loading |
| aria-live | Token | Live region (polite/assertive) |

### Live Regions
| Atributo | Valor | Uso |
|----------|-------|-----|
| aria-live="polite" | Polite | Anunciar quando conveniente |
| aria-live="assertive" | Assertive | Anunciar imediatamente |
| role="status" | Polite implito | Status messages |
| role="alert" | Assertive implicito | Alertas urgentes |
| aria-atomic | Boolean | Anunciar tudo ou so mudancas |

---

## 5. Five Rules of ARIA

| # | Regra | Descricao |
|---|-------|----------|
| 1 | Use HTML nativo | Se existe elemento HTML, use-o |
| 2 | Nao mude semantica | Nao adicionar role a semantica nativa |
| 3 | Keyboard acessivel | Todo ARIA interativo = keyboard operavel |
| 4 | Nao esconder focusables | `aria-hidden` nao em elementos focusaveis |
| 5 | Nomes acessiveis | Todo interativo tem nome acessivel |

---

## 6. Testing Reference

### Automated Tools
| Ferramenta | Cobertura | Integracao |
|-----------|----------|-----------|
| axe-core | ~57% das issues | Jest, Playwright, CI |
| Lighthouse a11y | ~30% | CI, Chrome DevTools |
| eslint-plugin-jsx-a11y | Static analysis | ESLint config |
| Pa11y | Automated scanning | CI pipeline |

### Manual Tests (sempre necessarios)
| Teste | O que verifica |
|-------|-------------|
| Keyboard navigation | Tab order, focus management, shortcuts |
| Screen reader | Announcements, reading order, live regions |
| Zoom 200% | Layout nao quebra |
| High contrast | Conteudo visivel no modo alto contraste |
| Reduced motion | Animacoes respeitam preferencia |
| Color only | Info nao depende so de cor |
| Focus visible | Focus indicator sempre visivel |

### Screen Reader Testing Matrix
| Screen Reader | Browser | OS |
|--------------|---------|-----|
| NVDA | Firefox | Windows |
| JAWS | Chrome | Windows |
| VoiceOver | Safari | macOS |
| VoiceOver | Safari | iOS |
| TalkBack | Chrome | Android |

---

## 7. Common Patterns Quick Reference

### Skip Link
```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white">
  Skip to main content
</a>
```

### Visually Hidden (sr-only)
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Focus Indicator
```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

---

---

## 8. WCAG 2.2 — Status Legal e Adocao (2025-2026)

### Aprovacao como ISO/IEC
WCAG 2.2 foi publicado pelo W3C em outubro 2023 e aprovado como **ISO/IEC 40500:2025** em outubro de 2025. Essa aprovacao acelerou adocao global — leis e regulamentos que referenciam o padrao ISO passam a exigir WCAG 2.2.

### European Accessibility Act (EAA)
Efetivo em **junho de 2025**, o EAA exige que produtos e servicos digitais vendidos na UE atendam requisitos de acessibilidade baseados em WCAG 2.1/2.2. Empresas brasileiras que vendem para a Europa precisam estar em conformidade.

### WCAG 3.0 (Em Desenvolvimento)
WCAG 3.0 esta em desenvolvimento mas ainda a anos de se tornar recomendacao oficial. **WCAG 2.2 permanece o estado da arte** e o padrao a implementar.

### Brasil — LBI
Lei Brasileira de Inclusao (Lei 13.146/2015) exige acessibilidade digital para toda empresa com sede ou representacao no Brasil. O nivel minimo exigido e WCAG AA. Ver `brazilian-design-context.md` para detalhes completos.

---

## 9. Inclusive Design (Alem do Minimo)

Acessibilidade = cumprir requisitos tecnicos (o minimo legal).
**Inclusive Design** = projetar para a diversidade humana desde o inicio.

### Microsoft Inclusive Design Toolkit — 3 Tipos de Exclusao

| Tipo | Descricao | Exemplos |
|------|-----------|---------|
| **Permanente** | Condicao permanente | Cego, surdo, amputado |
| **Temporaria** | Condicao temporaria | Olho inflamado, braco quebrado |
| **Situacional** | Contexto especifico | Dirigindo, ambiente barulhento, sol na tela |

**Principio:** Projetar para exclusao permanente beneficia todos.

Exemplos de "design inclusivo que escala":
- **Legendas** (criadas para surdos) → usadas por 80% da audiencia (ambiente barulhento, aprendendo idioma)
- **Contraste alto** (criado para baixa visao) → beneficia qualquer um sob sol forte
- **Tela grande** (criada para idosos) → preferida por todos em uso casual

### Heydon Pickering — Componentes Inclusivos
Autor de "Inclusive Components" (2019) — cada capitulo detalha como construir componentes verdadeiramente inclusivos (card, toggle, notification, data table). Nao apenas tecnicamente acessivel, mas inclusivo na concepcao.

**inclusive-components.design** — Recurso gratuito online.

---

## 10. Automated a11y Testing — Stack Completa

### axe-core (Deque Systems)
Motor de teste mais utilizado. 100+ regras WCAG. Detecta ~30-40% de problemas automaticamente.

```typescript
// jest-axe — teste unitario
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('Button: sem violacoes de acessibilidade', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

```typescript
// @axe-core/playwright — testes E2E
import { checkA11y } from 'axe-playwright';

test('pagina sem violacoes', async ({ page }) => {
  await page.goto('/');
  await checkA11y(page, null, {
    axeOptions: { runOnly: ['wcag2a', 'wcag2aa', 'wcag22aa'] },
  });
});
```

### Storybook a11y Addon
```typescript
// .storybook/main.ts
export default {
  addons: ['@storybook/addon-a11y'],
};
// Exibe painel de acessibilidade em cada story
// Roda axe-core em tempo real no browser
// Mostra violations, warnings e passes com links para regras
```

### Stack Completa

| Ferramenta | Quando usar | Cobertura |
|-----------|------------|---------|
| `jest-axe` | Unit tests (por componente) | ~30-40% das issues |
| `@storybook/addon-a11y` | Desenvolvimento (real-time) | ~30-40% |
| `@axe-core/playwright` | E2E tests (paginas completas) | ~30-40% |
| Lighthouse a11y | CI gate (score) | ~20-30% |
| `eslint-plugin-jsx-a11y` | Static analysis (code) | Problemas estaticos |
| **Manual keyboard** | Teste manual | Issues de fluxo |
| **Screen reader** | Teste manual | Announcements |

### O que Automatizacao NAO detecta (teste manual obrigatorio)
- Logica de focus management em fluxos complexos
- Qualidade de anuncios de screen reader
- Adequacao dos labels e textos alternativos (semantica, nao sintaxe)
- Sequencia de leitura logica
- Cognitive load e clareza

---

## Referencias
- W3C WCAG 2.2 Specification — w3.org/WAI/WCAG22
- W3C ARIA Authoring Practices Guide (APG) — w3.org/WAI/ARIA/apg
- W3C ARIA 1.2 Specification — w3.org/TR/wai-aria-1.2
- ISO/IEC 40500:2025 — iso.org
- European Accessibility Act — ec.europa.eu
- WebAIM — Testing resources — webaim.org
- Deque University — axe-core rules — deque.com/axe
- Heydon Pickering — inclusive-components.design
- Microsoft Inclusive Design Toolkit — microsoft.com/design/inclusive
- lei Brasileira de Inclusao (LBI) — Lei 13.146/2015
