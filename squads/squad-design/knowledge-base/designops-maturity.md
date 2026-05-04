# Knowledge Base: DesignOps & Maturity Model

## Escopo
DesignOps como disciplina — modelos de time, maturity model (5 niveis), metricas de adocao, ROI, living documentation e governance. Fonte: MS-002 Design System Research (2026-04-07).

---

## 1. DesignOps como Disciplina

**Dave Malouf** cunhou o termo "DesignOps" (2014) para descrever as praticas, processos e infraestrutura que permitem ao design escalar em uma organizacao. Assim como DevOps elimina atritos entre desenvolvimento e operacoes, DesignOps elimina atritos entre design e o resto da organizacao.

### Dominios do DesignOps
| Dominio | O que inclui |
|---------|-------------|
| **People** | Hiring, onboarding, career growth, team structure |
| **Workflow** | Processos de design, ferramentas, handoffs, ritmo |
| **Craft** | Design systems, quality standards, design principles |
| **Impact** | Metricas, ROI, business alignment, advocacy |

---

## 2. InVision Design Maturity Model (5 Niveis)

| Level | Nome | Caracteristicas |
|-------|------|----------------|
| **1** | **Ad Hoc** | Sem sistema. Componentes criados individualmente. Inconsistencia total. Design e siloed. |
| **2** | **Emerging** | Style guide basico. Algumas convencoes. Adocao inconsistente. Primeiros tokens aparecem. |
| **3** | **Defined** | Design system formal. Tokens, componentes, documentacao. Time dedicado ou parcial. Storybook ativo. |
| **4** | **Managed** | Sistema maduro. Metricas de adocao. Governance claro. Contribuicao federada. RFC process ativo. |
| **5** | **Optimized** | Sistema como produto. Inovacao continua. Benchmark para a industria. Design e infraestrutura. |

### Onde a Industria esta (2024-2026)
- **Maioria das organizacoes:** Level 2-3
- **Organizacoes lider** (Google, IBM, Salesforce, Shopify, GitHub): Level 4-5
- **Startups (0-50 pessoas):** Level 1-2 (normal — premature abstraction e um risco real)

### Sinais de cada nivel

**Level 2 → 3 (quando investir em DS):**
- 3+ times de produto trabalhando em paralelo
- Inconsistencias visuais frequentes entre telas
- Tempo significativo gasto em refactor visual
- Designers recriando os mesmos componentes

**Level 3 → 4 (quando formalizar governance):**
- Times ignorando o DS ou criando paralelos
- Bottleneck no time central para aprovar componentes
- Adocao estagnada em 50-60% das telas
- Requests de componentes sem processo claro

**Level 4 → 5 (DS como produto maduro):**
- Metricas de adocao monitoradas continuamente
- Contribuicoes regulares de times de produto
- Roadmap publico com features planejadas
- NPS > 50 entre times consumidores

---

## 3. Team Models

### Modelo Centralizado (Dedicated Team)
**Estrutura:** 3-8 pessoas: 1-2 designers, 2-4 engenheiros, 1 PM/DesignOps
**Times de produto sao consumidoras**

| Vantagem | Desvantagem |
|----------|-------------|
| Consistencia maxima | Bottleneck (gargalo) |
| Qualidade alta e consistente | Lento para atender demandas |
| Ownership clara | Desconexao com necessidades reais |

**Exemplos:** Salesforce (Lightning), IBM (Carbon), Microsoft (Fluent)
**Quando usar:** Organizacoes 500+ pessoas, multiplos produtos

### Modelo Federado (Community-Driven)
**Estrutura:** Sem time dedicado. Board de representantes de cada time.

| Vantagem | Desvantagem |
|----------|-------------|
| Rapido — times criam o que precisam | Risco de inconsistencia |
| Alto engajamento | Precisa de processos rigorosos |
| Sistema evolui com produto | Overhead de coordenacao |

**Quando usar:** Startups ou organizacoes onde time dedicado nao e viavel

### Modelo Hibrido (Hub + Spokes) — Padrao 2024-2026
**Estrutura:** Time central pequeno (2-4 pessoas) mantem core + governance. Times contribuem via RFC.

**Exemplos:** Shopify (Polaris), GitHub (Primer), Atlassian
**Quando usar:** Organizacoes 50-500 pessoas, modelo mais comum e recomendado

---

## 4. Design System como Produto (Dan Mall)

**Dan Mall**, autor de "Design That Scales" (2022), articula a licao mais importante: tratar o design system como um **produto**, nao como um projeto.

| Projeto | Produto |
|---------|---------|
| Tem inicio, meio e fim | Evolui continuamente |
| Orcamento define o escopo | Feedback dos usuarios define o roadmap |
| "Pronto" quando entregue | Nunca "pronto" |
| Sem metricas de sucesso | KPIs e NPS monitorados |
| Time desband ao final | Time permanente com ownership |

### Praticas de Product Management para DS

```yaml
Roadmap publico:
  - O que esta em desenvolvimento (Q1/Q2)
  - O que esta planejado (Q3/Q4)
  - O que e backlog

Changelog detalhado:
  - O que mudou em cada versao
  - Por que mudou
  - Como migrar (codemod quando possivel)

Office hours:
  - Sessoes semanais para duvidas e feedback
  - Abertas para todos os times

Analytics de uso:
  - Quais componentes sao mais usados
  - Quais tem mais issues abertas
  - Quais tem menor adocao (candidatos a deprecacao)

Deprecation notices:
  - Anunciado com 2 minor releases de antecedencia
  - Codemod fornecido quando possivel
  - Migration guide documentado
```

---

## 5. Metricas de Adocao

### Dashboard de Adocao
| Metrica | Como medir | Target |
|---------|-----------|--------|
| Coverage | % de telas usando componentes do sistema | > 80% |
| Adoption rate | % de times usando o sistema | > 90% |
| Token compliance | % de valores visuais via tokens (vs hardcoded) | > 95% |
| Component reuse | # de instancias por componente | > 10 (media) |
| Contribution rate | # de PRs de equipes de produto / mes | 2-5 |
| Satisfaction (NPS) | Survey trimestral | > 50 |
| Time to implement | Tempo medio para nova tela | Reducao > 40% |
| Design-dev parity | % com equivalente Figma + codigo | > 90% |

### Ferramentas de Medicao
- **Omlet** (YC-backed): Analisa codebase automaticamente e gera dashboard de adocao por componente
- **Figma Analytics:** Quais componentes Figma sao mais duplicados/usados
- **Custom ESLint:** Regras que detectam uso de elementos HTML nativos (button, input) em vez de componentes do DS

---

## 6. ROI Calculation

### Formula Simplificada
```
ROI = ((Horas economizadas × Custo/hora) - Investimento) / Investimento

Horas economizadas = (Tempo sem DS - Tempo com DS) × Numero de features
```

### Benchmark Industria (Sparkbox 2023)
- Reducao media de **34%** no tempo de desenvolvimento
- Reducao de **29%** em bugs visuais
- **89%** reportam melhoria em consistencia
- **72%** reportam melhoria em velocidade

### Cases
| Empresa | DS | Impacto |
|---------|-----|---------|
| Salesforce | Lightning Design System | $2B+ economizados anualmente em produtividade |
| Shopify | Polaris | -50% no tempo de construcao de novas telas |
| IBM | Carbon | Reducao significativa em QA de acessibilidade |

---

## 7. Living Documentation

### Principios
1. **Colocalizada com o codigo** — story/doc no mesmo diretorio que o componente
2. **Automaticamente extraida** — TypeScript types geram prop tables sem esforco manual
3. **Interativa** — leitor pode mudar props e ver resultado em tempo real
4. **Contextualizada** — quando usar, quando nao usar, alternativas
5. **Versionada** — versionada junto com o codigo

### Plataformas de Documentacao

**Storybook (open-source, pelos criadores do Chromatic):**
- Renderiza componentes em isolamento
- MDX para documentacao rica
- Addons: a11y, viewport, controls, actions, docs
- Visual regression via Chromatic
- v10 (Out 2025): ESM-only, -29% install size

**Zeroheight (SaaS):** Conecta Figma, Storybook e codigo. Designers contribuem sem tocar codigo.

**Supernova (SaaS):** Sincroniza com Figma automaticamente, gera docs. Multi-brand, design tokens.

**Knapsack (SaaS):** Multi-framework (React, Vue, Angular, Web Components) na mesma documentacao.

### Storybook MDX Example
```mdx
{/* Button.mdx */}
import { Meta, Canvas, Controls } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button
Buttons trigger actions. Use for form submissions, confirmations, interactive processes.

## When to use
- **Primary:** Main action (max 1 per view)
- **Secondary:** Supporting actions
- **Ghost:** Low-emphasis (cancel, dismiss)

## When NOT to use
- Navigation → use `<Link>` instead
- Toggling → use `<Toggle>` instead

<Canvas of={ButtonStories.Primary} />
<Controls />
```

---

## 8. Versioning Strategy (SemVer)

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes (rename prop, remove component, change behavior)
MINOR: New features backward-compatible (add prop, add component)
PATCH: Bug fixes, performance improvements
```

### Breaking Change Management
```
1. Deprecation first: @deprecated com mensagem clara + no console
2. Codemods: Scripts jscodeshift para migracao automatica
3. Migration guide: Documentar exatamente o que mudar
4. Grace period: 2 minor releases com deprecated ativo
5. Removal: Proximo major release
```

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  /** @deprecated Use `variant` instead. Will be removed in v5.0 */
  type?: 'primary' | 'secondary';
}
```

---

## 9. Contribution Checklist

Para um componente entrar no design system, ele deve:

```
Tecnico:
- [ ] TypeScript com tipos completos (sem `any`)
- [ ] forwardRef implementado
- [ ] displayName definido
- [ ] className merge com cn()
- [ ] Default props sensatos

Acessibilidade:
- [ ] Elementos ARIA corretos (role, aria-*)
- [ ] Keyboard navigation funcionando
- [ ] Focus indicator visivel (WCAG 2.4.7)
- [ ] Testado com axe-core (zero violations)
- [ ] Testado com teclado manualmente

Visual:
- [ ] Funciona em light mode e dark mode
- [ ] Funciona em todos os breakpoints
- [ ] Tokens usados para todos os valores visuais (sem hardcoded)

Estados:
- [ ] Default, hover, active, focus, disabled
- [ ] Loading (quando aplicavel)
- [ ] Error (quando aplicavel)
- [ ] Empty (quando aplicavel)

Documentacao:
- [ ] Storybook stories para cada variante e estado
- [ ] MDX com when to use / when not to use
- [ ] API reference completa

Testes:
- [ ] Unit tests (render, props, events)
- [ ] a11y test (jest-axe)
- [ ] Visual regression (Chromatic baseline)

Tokens:
- [ ] Component tokens criados (L3)
- [ ] Tokens referenciam semantic layer (L2)
```

---

## Referencias
- Dave Malouf — DesignOps (2014)
- Dan Mall — "Design That Scales" (2022)
- InVision Design Maturity Model
- Sparkbox Design Systems Survey 2023
- Nathan Curtis — Design System Operations (EightShapes)
- MS-002 Design System Research — SINAPSE (2026-04-07)
