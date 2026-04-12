---
task: design-illustration-system
responsavel: "@brand-identity-designer"
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

# Task: Design Brand Illustration System

> Definir sistema de ilustracao proprietario da marca — estilo, regras, aplicacoes e guidelines para producao consistente.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-identity-designer (Iris) |
| **Co-agents** | brand-creative-engineer (Forge) producao, brand-strategist (Athena) alinhamento com personalidade |
| **Trigger** | Quando marca precisa de ilustracoes proprietarias para comunicacao, produto, conteudo ou interfaces |
| **Input** | Brand personality, color palette, visual guidelines, moodboard, target contexts de uso |
| **Output** | `illustration-system.md` + style sheet + exemplos de referencia |
| **Handoff** | → brand-creative-engineer (Forge) para producao de assets + brand-compiler (Atlas) para brandbook |
| **Complexity** | complex |
| **Referencias** | Mailchimp (Freddie + illustration system), Slack (unique illustration style), Notion (flat/minimal), Shopify (Polaris illustrations), Google (Material Design illustrations), Headspace (organic/warm), Dropbox (2017 rebrand illustration system) |

---

## Fundamentacao

Ilustracoes proprietarias sao um dos **distinctive brand assets** mais poderosos (Byron Sharp, "How Brands Grow"). Diferente de fotografia (que pode ser replicada), um sistema de ilustracao unico cria reconhecimento instantaneo sem logo. Mailchimp, Slack e Notion sao reconhecidos por suas ilustracoes antes mesmo de ver o logotipo.

```
SEM SISTEMA              COM SISTEMA
┌─────────────┐          ┌─────────────┐
│ Ilustracoes │          │ Ilustracoes │
│ genericas   │    →     │ unicas e    │
│ stock-like  │          │ reconheciveis│
│ sem padrao  │          │ com DNA da  │
│             │          │ marca       │
└─────────────┘          └─────────────┘
 Zero recall              Distinctive asset
```

---

## Steps

### Step 1: Definir Proposito do Sistema de Ilustracao

| Pergunta | Resposta |
|----------|---------|
| Por que a marca precisa de ilustracoes? | {comunicacao, produto, conteudo, interface, todos} |
| Que emocao as ilustracoes devem transmitir? | {alinhado com brand personality} |
| Onde serao usadas primariamente? | {social, site, app, apresentacoes, materiais impressos} |
| Qual o volume de producao esperado? | {ocasional, regular, alto volume} |
| Quem vai produzir? | {designer interno, freelancer, IA generativa, mix} |

### Step 2: Definir Estilo Visual

**Selecionar estilo base (pode ser mix):**

| Estilo | Caracteristicas | Quando Usar | Referencia |
|--------|----------------|-------------|-----------|
| **Flat/Minimal** | Formas simples, sem sombra, cores solidas | Tech, SaaS, moderno | Notion, Stripe |
| **Isometrico** | Perspectiva 3D sem ponto de fuga | Dados, processos, tech | Slack, Asana |
| **Line Art** | Tracos finos, minimalista, elegante | Premium, editorial, institucional | Apple, Aesop |
| **Organico/Hand-drawn** | Tracos imperfeitos, caloroso, humano | Wellness, educacao, comunidade | Headspace, Mailchimp |
| **Geometric** | Formas geometricas abstratas, bold | Corporativo, moderno, bold | IBM, Uber |
| **3D Render** | Objetos tridimensionais renderizados | Tech, produto, premium | Apple, Google |
| **Colagem/Mixed Media** | Mix de elementos, texturas, fotos + vetores | Criativo, editorial, cultura | Spotify Wrapped |
| **Cartoon/Character** | Personagens estilizados, narrativo | Consumer, educacao, comunidade | Duolingo, Mailchimp |

### Step 3: Definir Parametros Tecnicos

| Parametro | Especificacao |
|-----------|--------------|
| **Proporcao de traço** | {espessura em px ou pt, uniforme vs variavel} |
| **Paleta** | {cores do brand system, com regra de uso para ilustracoes} |
| **Cantos** | {arredondados Xpx, retos, mix} |
| **Proporcoes humanas** | {realista, estilizado Xheads, simplificado} |
| **Nivel de detalhe** | {minimo, medio, alto} |
| **Perspectiva** | {frontal, isometrica, 3/4, variavel} |
| **Sombras** | {nenhuma, flat shadow, soft shadow, drop shadow} |
| **Texturas** | {nenhuma, grain, noise, paper, custom} |
| **Background** | {transparente, cor solida, gradiente, cenario} |
| **Grid base** | {modulo Xpx, area segura, margens} |

### Step 4: Criar Regras DO/DON'T

**DO (Fazer):**
- [ ] Usar APENAS cores da paleta da marca (ou derivacoes documentadas)
- [ ] Manter proporcoes e estilo consistentes entre todas as pecas
- [ ] Respeitar o grid base definido
- [ ] Manter coerencia emocional com brand personality
- [ ] Variar composicao mantendo estilo reconhecivel
- [ ] Incluir diversidade nas representacoes humanas

**DON'T (Nao fazer):**
- [ ] Misturar estilos de ilustracao diferentes na mesma marca
- [ ] Usar cores fora da paleta sem aprovacao
- [ ] Criar ilustracoes que contradigam o tom da marca
- [ ] Usar stock illustrations genericas no lugar do sistema proprietario
- [ ] Ignorar acessibilidade (contraste minimo 3:1 para elementos significativos)
- [ ] Adicionar detalhes excessivos que quebrem a legibilidade em tamanhos pequenos

### Step 5: Definir Categorias de Ilustracao

| Categoria | Uso | Complexidade | Tamanho Tipico |
|-----------|-----|-------------|----------------|
| **Spot illustrations** | Icones, decoracoes, micro-animacoes | Baixa | 64-256px |
| **Hero illustrations** | Headers, banners, destaque | Alta | 800-1920px |
| **Scene illustrations** | Narrativas, processos, contextos | Alta | 1080-1920px |
| **Decorative elements** | Patterns, shapes, backgrounds | Baixa-Media | Variavel |
| **Data visualization** | Graficos, infograficos, diagramas | Media | Variavel |
| **Character illustrations** | Personas, avatares, mascotes | Media-Alta | 256-1024px |
| **Product illustrations** | Mockups, features, interfaces | Media | Variavel |

### Step 6: Definir Guidelines para Producao com IA Generativa

Se a marca usar IA para produzir ilustracoes (Midjourney, DALL-E, Stable Diffusion, etc.):

| Aspecto | Guideline |
|---------|----------|
| **Prompt base** | Documentar prompt-template que reproduz o estilo da marca |
| **Consistencia** | Usar seed/style reference para manter coerencia |
| **Pos-producao** | Definir ajustes obrigatorios (cores, cleanup, vetorizacao) |
| **Limites** | O que NAO pode ser gerado por IA (ex: logo, tipografia) |
| **Direitos** | Verificar licenciamento do modelo/ferramenta |
| **QA** | Checklist de aprovacao antes de uso (brand alignment, qualidade tecnica) |

**Prompt Template Base:**
```
{estilo definido no Step 2}, {paleta: cores HEX},
{proporcoes Step 3}, {nivel de detalhe},
{tema/cena desejada}, {emocao alinhada com brand personality},
no text, clean background, vector-style
```

### Step 7: Criar Style Sheet de Referencia

Documento visual com:
- [ ] 9-12 ilustracoes exemplo cobrindo todas as categorias
- [ ] Paleta de cores aplicada a ilustracoes (com amostras)
- [ ] Demonstracao de DO/DON'T lado a lado
- [ ] Escala de complexidade (simples → detalhado)
- [ ] Exemplos de aplicacao em contexto (social, site, app, print)
- [ ] Comparativo: o que e da marca vs o que NAO e da marca

### Step 8: Definir Integracao com Brand System

| Elemento | Relacao com Ilustracao |
|----------|----------------------|
| **Logo** | Ilustracoes NAO substituem o logo. Coexistem. |
| **Cores** | Paleta de cores e UNICA — ilustracoes usam mesma paleta |
| **Tipografia** | Texto dentro de ilustracoes segue typographic system |
| **Photography** | Definir quando usar foto vs ilustracao vs mix |
| **Motion** | Estilo de animacao das ilustracoes (se aplicavel) |
| **Tone of voice** | Ilustracoes refletem a personalidade verbal da marca |

### Step 9: Handoff

```yaml
handoff:
  to: brand-creative-engineer (Forge)
  artifact: illustration-system.md + style-sheet
  context: "Sistema de ilustracao completo: estilo, parametros, categorias, DO/DON'T, prompt templates, style sheet"
  also_to:
    - brand-compiler (Atlas): "Incluir como capitulo 'Illustration System' no brandbook"
    - brand-auditor (Sentinel): "Adicionar check de consistencia de ilustracoes no audit"
    - brand-motion-vfx (Flux): "Adaptar para animacao se aplicavel"
  next: "Forge produz primeiras ilustracoes. Atlas documenta no brandbook."
```
