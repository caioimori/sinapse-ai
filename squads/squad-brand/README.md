# squad-brand

Squad de classe mundial para criacao, gestao e evolucao de sistemas de marca completos. 100% de cobertura auditada.

## Visao Geral

| Campo | Valor |
|-------|-------|
| **Nome** | squad-brand |
| **Versao** | 2.0.0 |
| **Tier** | 1 (Uso Imediato) |
| **Agentes** | 10 especialistas |
| **Tasks** | 64 workflows executaveis |
| **Workflows** | 4 ciclos completos |
| **Knowledge Bases** | 13 bases de conhecimento |
| **Cobertura** | 78/78 itens auditados (100%) |
| **Local** | `~/sinapse/squad-brand/` |
| **Referencia** | [Sinapse](https://github.com/caio-imori/sinapse) |

## Proposito

Criar sistemas de marca world-class cobrindo TODAS as dimensoes de um brand system profissional: estrategia, identidade visual, assets criativos, colateral corporativo, design system, motion, identidade sonora, auditoria de qualidade e compilacao de entregas. Opera como fabrica de marcas atemporal — o maquinario (processos, protocolos, knowledge bases) e padronizado, mas cada marca que sai e unica.

## Agentes — 10 Especialistas

| # | ID | Persona | Arquetipo | Papel | Tasks |
|---|-----|---------|-----------|-------|-------|
| 1 | brand-orqx | **Meridian** | Conductor | Coordena squad, gerencia handoffs | 2 |
| 2 | brand-strategist | **Athena** | Strategist | DNA estrategico, posicionamento, arquetipo, naming, personas | 12 |
| 3 | brand-identity-designer | **Iris** | Artist | Paleta, tipografia, logo, photography, illustration, data viz | 11 |
| 4 | brand-creative-engineer | **Forge** | Builder-Creator | SVG via codigo, IA generativa, mockups, apparel, web design | 9 |
| 5 | brand-collateral-designer | **Vellum** | Craftsman | Business cards, stationery, apresentacoes, packaging, signage | 11 |
| 6 | brand-system-architect | **Grid** | Architect | Design tokens, componentes, grid, dark mode/theming | 4 |
| 7 | brand-motion-vfx | **Flux** | Animator | Motion language, micro-interactions, video templates, Lottie | 5 |
| 8 | brand-sonic-designer | **Echo** | Composer | Audio logo, sonic identity, notification sounds | 4 |
| 9 | brand-auditor | **Sentinel** | Guardian | Quality gate, coerencia, diagnostico | 3 |
| 10 | brand-compiler | **Atlas** | Compiler | Brandbook, asset kit, onboarding, governance | 5 |

## Cobertura Completa (78/78)

### A. Fundacao Estrategica (16/16)
Posicionamento, arquetipo, manifesto, tom de voz, message house, narrativa, diferenciacao, personas, naming, brand architecture, analise competitiva, brand promise, personalidade, valores, elevator pitch, tagline

### B. Identidade Visual (13/13)
Logo system, paleta psicologica, tipografia, moodboard, visual guidelines, photography direction, illustration style, iconografia, patterns, graphic vocabulary, image treatments, data visualization, infographics

### C. Identidade Verbal (6/6)
Tom de voz, message house, vocabulario, writing guidelines, naming conventions, social voice/hashtags

### D. Aplicacoes & Colateral (20/20)
Social templates, mockups, apparel, sneakers, jackets, outfits, business cards, letterhead, email signature, apresentacoes, proposals, web design, vehicle wrap, packaging, signage, merchandise, profile/cover images, thumbnails, newsletter, invoice

### E. Design System (8/8)
Tokens, componentes, grid, spacing, breakpoints, acessibilidade, dark mode/theming, documentacao

### F. Motion & Multimedia (9/9)
Motion principles, micro-interactions, page transitions, loading states, scroll animations, video intro/outro, lower thirds, sonic branding, animation library (Lottie)

### G. Entrega (6/6)
Brandbook, quick reference, asset kit, delivery package, brand onboarding guide, brand governance

## Workflows

### 1. Zero-to-Brand System Cycle (Principal)
Ciclo completo de criacao de marca do zero. 9 fases com quality gates:
```
Strategy → Identity → Assets → Collateral → Design System → Motion → Sonic → Audit → Compile
```

### 2. Client IDV Delivery Cycle
Entregas faseadas para aprovacao de cliente:
```
Entrega 1: Estrategia → Entrega 2: Visual → Entrega 3: Assets + Collateral → Entrega 4: Sistema → Entrega 5: Final
```

### 3. Brand Application Cycle
Aplicar marca existente a novo projeto/contexto.

### 4. Brand Diagnosis Cycle
Diagnosticar e corrigir desalinhamentos de marca.

## Comandos Rapidos

```bash
# Ativacao
@squad-brand

# Projeto novo (marca do zero)
*start-brand-project {nome_cliente} --type zero

# Projeto cliente IDV
*start-brand-project {nome_cliente} --type client-idv

# Projeto com marca existente
*start-brand-project {nome_cliente} --type refresh

# Diagnostico
*start-brand-project {nome_cliente} --type diagnosis

# Status
*brand-status

# Auditoria
*audit-brand --scope all

# Compilar brandbook
*compile-brandbook
```

## Estrutura de Arquivos

```
squad-brand/
├── squad.yaml                         # Manifest v2.0
├── README.md                          # Este arquivo
├── agents/                            # 10 agentes especialistas
│   ├── brand-orqx.md          # Meridian — Conductor
│   ├── brand-strategist.md            # Athena — Strategist
│   ├── brand-identity-designer.md     # Iris — Artist
│   ├── brand-creative-engineer.md     # Forge — Builder-Creator
│   ├── brand-collateral-designer.md   # Vellum — Craftsman
│   ├── brand-system-architect.md      # Grid — Architect
│   ├── brand-motion-vfx.md            # Flux — Animator
│   ├── brand-sonic-designer.md        # Echo — Composer
│   ├── brand-auditor.md               # Sentinel — Guardian
│   └── brand-compiler.md              # Atlas — Compiler
├── tasks/                             # 64 tasks executaveis
├── workflows/                         # 4 ciclos
│   ├── zero-to-brand-system-cycle.yaml
│   ├── client-idv-delivery-cycle.yaml
│   ├── brand-application-cycle.yaml
│   └── brand-diagnosis-cycle.yaml
├── knowledge-bases/                   # 13 bases de conhecimento
├── checklists/                        # Quality gates
├── templates/                         # Templates de entrega
└── data/                              # Dados estaticos
```

## Quality Standards

Cada output deve atingir minimo **4.0/5.0** em 5 dimensoes:

| Dimensao | Criterio |
|----------|----------|
| **Profundidade** | Agentes com protocolos + decision trees |
| **Praticidade** | Workflows testados com caso real |
| **Integracao** | Handoffs bidirecionais + context-aware |
| **Clareza** | Docs que qualquer LLM entende |
| **Evolucao** | Pipeline de melhoria continua |

## Cross-Squad Integration

| Squad | Quando Usar |
|-------|-------------|
| `squad-design` | Implementar design system em codigo, UX/UI |
| `squad-animations` | Motion design e animacoes |
| `squad-content` | Conteudo de marca |
| `squad-copy` | Copy e messaging |

---
*squad-brand v2.0.0 — 10 agentes | 64 tasks | 78/78 cobertura | Criado por squad-creator (Craft)*
