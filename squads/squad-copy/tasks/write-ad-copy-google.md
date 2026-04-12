---
task: write-ad-copy-google
responsavel: "@conversion-writer"
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

# Task: Write Google Ad Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** STANDARD
- **Depends on:** keyword research, copy brief, landing page
- **Feeds:** squad-growth

## Objetivo
Escrever copy para Google Ads (Search, Display, YouTube) que maximiza CTR e Quality Score — respeitando character limits enquanto comunica valor e diferenciacao.

## Entrada
- Keywords alvo (primarias e secundarias)
- Landing page destino
- USPs e key benefits
- Competitor ads (para diferenciacao)
- Budget e bid strategy

## Passos

### 1. Google Search Ads (RSA — Responsive Search Ads)
**Limites:**
- Headlines: 15 headlines de ate 30 caracteres cada
- Descriptions: 4 descricoes de ate 90 caracteres cada
- Display URL paths: 2 paths de ate 15 caracteres cada

**Framework de Headlines (15 variantes):**
```
Grupo 1 — Keyword Match (3-4 headlines):
  "Headline com [Keyword]" — match direto
  "[Keyword] [Ano]" — currentness
  "Melhor [Keyword] [Qualificador]"

Grupo 2 — Benefit (3-4 headlines):
  "[Resultado] em [Tempo]"
  "[Beneficio] Sem [Objecao]"
  "Aumente [Metrica] em [X]%"

Grupo 3 — Social Proof (2-3 headlines):
  "[N]+ Clientes Satisfeitos"
  "Avaliado com [X] Estrelas"
  "Confianca de [Marca/Industria]"

Grupo 4 — CTA (2-3 headlines):
  "Teste Gratis por [X] Dias"
  "Solicite Demonstracao"
  "Comece Hoje — Sem Compromisso"

Grupo 5 — Urgency/Offer (2-3 headlines):
  "[X]% de Desconto Limitado"
  "Oferta Valida Ate [Data]"
  "Ultimas [N] Vagas"
```

**Framework de Descriptions (4 variantes):**
```
Description 1 — Feature/Benefit:
  "[Feature] que [beneficio]. [Resultado concreto]. [CTA]."

Description 2 — Social Proof:
  "Escolhido por [N] empresas. [Resultado]. Comece gratis."

Description 3 — Objection Handler:
  "Sem [objecao]. Sem [objecao]. [Resultado] garantido."

Description 4 — Urgency/Offer:
  "Oferta especial: [oferta]. [Beneficio extra]. [Deadline]."
```

**Pinning Strategy:**
- Pin keyword headline em Position 1
- Pin CTA headline em Position 3
- Deixar resto para otimizacao automatica

### 2. Google Display Ads
**Responsive Display Ads:**
- Short headline: 25 caracteres — Impacto maximo
- Long headline: 90 caracteres — Mais contexto
- Description: 90 caracteres — Beneficio + CTA
- Business name: Nome da marca

**Copy por objetivo:**
| Objetivo | Short Headline | Long Headline |
|----------|---------------|---------------|
| Awareness | "[Marca]: [Promessa]" | "[Problema]? [Marca] resolve com [mecanismo]" |
| Consideration | "[Resultado] Garantido" | "Como [N] empresas alcancaram [resultado]" |
| Conversion | "[Oferta] — Hoje" | "Ultimas horas: [oferta] com [bonus]" |

### 3. YouTube Ads (TrueView/Bumper)
**TrueView In-Stream (skippable):**
- Primeiros 5 segundos: Hook irresistivel (antes do skip)
- CTA overlay: Copy curta e action-oriented
- End card: Oferta + CTA claro

**Bumper Ads (6 segundos):**
- 1 mensagem, 1 emocao, 1 CTA
- Copy extremamente concisa
- Visual faz o trabalho pesado

**Copy para companion banner:**
- 300x60: "[Beneficio curto] | [CTA]"
- Consistente com o video

### 4. Extensoes de Anuncio
**Sitelink Extensions:**
- 4-8 sitelinks com copy especifica
- Titulo: 25 caracteres — pagina especifica
- Descricao: 35 caracteres x2 — beneficio

**Callout Extensions:**
- 6-10 callouts de ate 25 caracteres
- "Frete Gratis", "Suporte 24h", "Garantia 30 Dias"

**Structured Snippets:**
- "Tipos:", "Servicos:", "Marcas:"
- Lista relevante para busca

**Price Extensions:**
- Planos com preco visivel
- Nomenclatura clara

### 5. Quality Score Optimization
**Fatores de copy que afetam Quality Score:**
- Keyword relevance: Keyword no headline (match direto)
- Ad relevance: Copy alinhada com intencao de busca
- Landing page experience: Consistencia ad↔LP
- Expected CTR: Headlines compelling

**Copy-LP Consistency:**
- Headline do ad ≈ Headline da LP
- Oferta do ad = Oferta da LP
- CTA do ad → acao na LP
- Keyword do ad presente na LP

## Cross-Squad Handoff
```yaml
handoffs:
  - to: squad-growth
    delivers: Ad copy para campanha
    format: Headlines, descriptions, extensoes, targeting notes
  - to: squad-design
    delivers: LP consistency check
    format: Ad copy mapeada para elementos da LP
```

## Saida
- RSA: 15 headlines + 4 descriptions
- Display: Short + long headlines + descriptions
- YouTube: Scripts de hook + CTAs
- Extensions: Sitelinks, callouts, snippets
- Quality Score optimization notes

## Validacao
- [ ] Character limits respeitados em todos os formatos
- [ ] Keyword no headline (min 3 headlines com keyword)
- [ ] Beneficio claro em toda variante
- [ ] CTA em toda variante
- [ ] Copy-LP consistency verificada
- [ ] Extensions completas
- [ ] Competitor diferenciacao clara
- [ ] A/B test variants definidas

---

*Task operada por: conversion-writer (Spark)*
