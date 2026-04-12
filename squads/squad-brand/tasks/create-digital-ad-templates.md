---
task: create-digital-ad-templates
responsavel: "@brand-creative-engineer"
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

# Task: Create Digital Ad Templates

> Criar templates de anúncios digitais para todas as plataformas de mídia paga.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-creative-engineer (Forge) |
| **Co-agents** | brand-identity-designer (Iris) direção visual, brand-collateral-designer (Vellum) specs |
| **Trigger** | Após identidade visual e guidelines definidos |
| **Input** | Paleta de cores, tipografia, logo system, photography direction, graphic vocabulary |
| **Output** | `digital-ad-templates/` (Figma/Canva + specs) |
| **Handoff** | → brand-compiler (Atlas) para inclusão no brandbook |

---

## Steps

### Step 1: Mapear Plataformas e Formatos
Definir quais plataformas a marca usa e seus formatos obrigatórios:

| Plataforma | Formato | Dimensão (px) | Aspecto | Prioridade |
|-----------|---------|---------------|---------|-----------|
| **Meta (FB/IG)** | Feed single | 1080×1080 | 1:1 | Alta |
| | Feed vertical | 1080×1350 | 4:5 | Alta |
| | Stories/Reels | 1080×1920 | 9:16 | Alta |
| | Carousel | 1080×1080 (×10) | 1:1 | Alta |
| | Cover | 820×312 | ~2.6:1 | Média |
| **Google Ads** | Responsive display | 1200×628 | ~1.9:1 | Alta |
| | Square | 1200×1200 | 1:1 | Alta |
| | Leaderboard | 728×90 | ~8:1 | Média |
| | Skyscraper | 160×600 | ~1:3.75 | Média |
| | Banner mobile | 320×50 | ~6.4:1 | Média |
| **YouTube** | Thumbnail | 1280×720 | 16:9 | Alta |
| | Pre-roll end card | 1920×1080 | 16:9 | Alta |
| | Display companion | 300×250 | ~1.2:1 | Média |
| **LinkedIn** | Single image | 1200×627 | ~1.9:1 | Média |
| | Sponsored content | 1200×627 | ~1.9:1 | Média |
| **TikTok** | In-feed | 1080×1920 | 9:16 | Alta |
| | TopView | 1080×1920 | 9:16 | Média |
| **Pinterest** | Standard pin | 1000×1500 | 2:3 | Condicional |
| **X (Twitter)** | Single image | 1600×900 | 16:9 | Condicional |

### Step 2: Definir Sistema de Grid por Formato
Para cada formato, definir zones:

**Template 1:1 (1080×1080):**
```
┌──────────────────────┐
│   LOGO ZONE (10%)    │
├──────────────────────┤
│                      │
│   HERO ZONE (50%)    │
│   (imagem/produto)   │
│                      │
├──────────────────────┤
│  HEADLINE ZONE (20%) │
├──────────────────────┤
│  CTA ZONE (10%)      │
│  LEGAL (10%)         │
└──────────────────────┘
```

**Template 9:16 (1080×1920):**
```
┌──────────────────────┐
│   SAFE ZONE TOP      │
│   (status bar 10%)   │
├──────────────────────┤
│   LOGO ZONE (8%)     │
├──────────────────────┤
│                      │
│   HERO ZONE (40%)    │
│                      │
├──────────────────────┤
│  HEADLINE (15%)      │
├──────────────────────┤
│  BODY TEXT (12%)     │
├──────────────────────┤
│  CTA ZONE (8%)       │
│  SAFE ZONE BOTTOM    │
│  (nav bar 7%)        │
└──────────────────────┘
```

### Step 3: Definir Variantes por Objetivo
Para cada formato, criar variantes por objetivo de campanha:

| Objetivo | Layout Focus | CTA Estilo | Cor Dominante |
|----------|-------------|-----------|--------------|
| **Awareness** | Hero image grande, logo proeminente | Suave, "Saiba mais" | Brand primária |
| **Consideration** | Benefício + produto | Médio, "Descubra" | Brand primária |
| **Conversion** | Oferta + urgência + produto | Forte, "Compre agora" | CTA color (contraste) |
| **Retargeting** | Produto visto + benefício | Forte, "Voltar" | Brand + accent |
| **Lead gen** | Valor + formulário preview | Forte, "Baixe grátis" | CTA color |
| **App install** | Screenshot + rating | Store badges | Brand primária |
| **Event** | Data + local + visual | "Inscreva-se" | Brand + event accent |

### Step 4: Criar Templates Base
Para cada formato × objetivo, criar template com:

| Elemento | Spec | Editável? |
|----------|------|----------|
| Logo | Posição fixa, tamanho mínimo respeitado | Posição (4 cantos) |
| Headline | Fonte, tamanho, cor, max caracteres | Texto, cor (dentro da paleta) |
| Body text | Fonte, tamanho, cor, max linhas | Texto |
| CTA button | Cor, border-radius, padding, fonte | Texto, cor (primária/secundária) |
| Imagem hero | Proporção, tratamento | Imagem (dentro do estilo) |
| Background | Cor sólida ou gradiente da marca | Cor (dentro da paleta) |
| Legal/disclaimer | Tamanho mínimo, posição | Texto |
| Safe zones | Margens de plataforma | NÃO editável |

### Step 5: Definir Copy Guidelines para Ads
| Elemento | Max Caracteres | Tom | Exemplo |
|----------|---------------|-----|---------|
| Headline (image) | 5-8 palavras | Impactante, direto | "Transforme seu espaço" |
| Body (image) | 15-20 palavras | Benefício + CTA | "Design inteligente para quem..." |
| Headline (text ad) | 30 caracteres | SEO + benefit | "Móveis sob medida | Entrega grátis" |
| Description (text ad) | 90 caracteres | Benefício + urgência | "Projetos exclusivos com até 40% off..." |
| CTA | 2-3 palavras | Ação clara | "Compre agora", "Saiba mais" |

### Step 6: Criar Sistema de Naming de Arquivos
```
{brand}_{platform}_{format}_{objective}_{variant}_{version}
```
Exemplo: `marca_meta_feed-square_awareness_v1_01.png`

| Componente | Opções |
|-----------|--------|
| platform | meta, google, youtube, linkedin, tiktok, pinterest, x |
| format | feed-square, feed-vertical, stories, carousel, display-responsive, etc |
| objective | awareness, consideration, conversion, retarget, leadgen |
| variant | v1, v2, v3 (A/B tests) |

### Step 7: Exportar Templates
| Formato de Entrega | Para Quem | Spec |
|-------------------|----------|------|
| Figma components | Design team | Auto-layout, variantes, slots |
| Canva templates | Marketing team | Brand kit aplicado, locked elements |
| PSD layers | Agência/freelancer | Smart objects, camadas nomeadas |
| HTML5 (display) | Ad ops | AMPHTML ou GWD, 150KB max |
| Specs PDF | Qualquer | Guidelines de uso dos templates |

### Step 8: Criar Checklist de Quality Assurance
Para cada ad criado, verificar:

- [ ] Logo visível e legível no tamanho final
- [ ] Texto dentro do limite de caracteres
- [ ] Contraste texto/fundo ≥ 4.5:1
- [ ] Safe zones respeitadas (nada cortado)
- [ ] CTA visível e clicável (tappable area ≥ 44×44px)
- [ ] Imagem em alta resolução (2x para retina)
- [ ] Cores dentro da paleta da marca
- [ ] Tipografia correta (fonte, peso, tamanho)
- [ ] Regra dos 20% de texto (Meta) respeitada
- [ ] Disclaimer/legal presente se necessário
- [ ] Arquivo no tamanho correto da plataforma
- [ ] Naming convention seguida
- [ ] A/B variant pronta (se aplicável)

### Step 9: Handoff
```yaml
handoff:
  to: brand-compiler (Atlas)
  artifact: digital-ad-templates/
  context: "Templates de ads digitais para todas as plataformas com specs e guidelines"
  also_to:
    - brand-collateral-designer (Vellum): "Integrar com outros templates de comunicação"
  next: "Atlas inclui no brandbook como capítulo de Digital Advertising"
```
