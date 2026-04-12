---
task: write-ad-copy-social
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

# Task: Write Social Ad Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** STANDARD
- **Depends on:** copy brief, audience targeting, creative assets
- **Feeds:** squad-growth, squad-content

## Objetivo
Escrever copy para anuncios em plataformas sociais (Meta, LinkedIn, TikTok) — adaptando mensagem, tom e formato para cada plataforma enquanto mantém objetivo de conversao.

## Entrada
- Plataforma(s) alvo
- Objetivo da campanha (awareness, consideration, conversion)
- Audiencia e targeting
- Creative format (imagem, carrossel, video, stories)
- Oferta/CTA desejado

## Passos

### 1. Meta Ads (Facebook + Instagram)
**Formatos e limites:**
| Formato | Primary Text | Headline | Description | Link Description |
|---------|:----------:|:--------:|:-----------:|:---------------:|
| Feed image | 125 char (ideal) / 2200 max | 40 char | 30 char | 30 char |
| Carousel | 125 char / 2200 max | 40 char/card | 20 char/card | — |
| Stories/Reels | Overlay text 3-5 palavras | — | — | CTA button |
| Video | 125 char / 2200 max | 40 char | 30 char | — |

**Copy Frameworks por objetivo:**

**Awareness (topo do funil):**
```
Hook: [Pergunta ou afirmacao provocativa]
Body: [Estatistica ou insight]
CTA: "Saiba mais →"
```

**Consideration (meio do funil):**
```
Hook: [Problema ou desejo]
Body: [Solucao + prova rapida]
CTA: "Veja como →"
```

**Conversion (fundo do funil):**
```
Hook: [Oferta irresistivel]
Body: [Beneficio + urgencia]
CTA: "Garantir agora →"
```

**Best practices Meta:**
- Primeira linha e o hook (antes do "ver mais")
- Emojis estrategicos (nao excessivos)
- Quebras de linha para readability
- @mencoes e hashtags relevantes
- UGC copy style performa melhor que "polished"

### 2. LinkedIn Ads
**Formatos e limites:**
| Formato | Introductory Text | Headline | Description |
|---------|:-----------------:|:--------:|:-----------:|
| Single Image | 600 char (ideal) / 3000 max | 70 char | 100 char |
| Carousel | 255 char | 45 char/card | — |
| Video | 600 char / 3000 max | 70 char | 100 char |
| Message Ad | 500 char (subject 60 char) | — | — |
| Text Ad | — | 25 char | 75 char |

**Copy approach LinkedIn:**
- Tom profissional mas humano (nao corporativo)
- Data-driven: liderar com estatisticas
- B2B focus: ROI, eficiencia, vantagem competitiva
- Thought leadership: insights originais
- Social proof: logos e resultados de empresas

**Frameworks:**
```
DATA HOOK:
"[X]% das empresas [problema]. [Marca] ajuda a [solucao].
[Resultado concreto] em [tempo]. [CTA]"

CHALLENGE HOOK:
"Sua equipe ainda [pratica antiquada]?
Empresas como [logos] ja migraram para [solucao].
Resultado: [metrica]. [CTA]"

INSIGHT HOOK:
"O que [N] [cargo] descobriram sobre [topico]:
[Insight contraintuitivo]
[Como aplicar] → [CTA]"
```

### 3. TikTok Ads
**Formatos e limites:**
| Formato | Ad Text | CTA |
|---------|:-------:|:---:|
| In-Feed | 100 char (ideal) / 2200 max | Button preset |
| TopView | 100 char | Button preset |
| Spark Ads | 2200 char max | Button + link |

**Copy approach TikTok:**
- NAO pareca anuncio (native content feeling)
- Copy curta — visual faz o trabalho
- Linguagem casual e autentica
- Trends e culturally relevant
- Hook nos primeiros 2 segundos

**Frameworks:**
```
NATIVE:
"POV: Quando voce descobre [produto/beneficio] 🤯"

CHALLENGE:
"Me diz que voce [problema] sem me dizer que voce [problema]"

TUTORIAL:
"Como eu [resultado] usando [produto] #[hashtag]"

TESTIMONY:
"Nunca achei que [resultado], ate testar [produto] 😳"
```

### 4. Copy para Creative Pairing
**Regra: Copy + Creative = 1 mensagem, nao 2**

| Se o creative mostra... | A copy deve... |
|------------------------|----------------|
| Produto em uso | Focar no resultado/beneficio |
| Before/After | Adicionar contexto/numeros |
| Pessoa/face | Dar voz (testimonial/story) |
| Texto/stats | Adicionar emocao/CTA |
| Ambiente/lifestyle | Conectar com aspiracao |

### 5. Variantes para Testing
**Gerar por campanha:**
- 3-5 variantes de primary text
- 3-5 variantes de headline
- 2-3 variantes de CTA
- Mix: emocional vs racional, curto vs longo, pergunta vs afirmacao

**Naming convention:**
- `[Plataforma]-[Objetivo]-[Variante]-[Formato]`
- Ex: `META-CONV-v1-carousel`, `LKDN-LEAD-v3-video`

## Cross-Squad Handoff
```yaml
handoffs:
  - to: squad-growth
    delivers: Ad copy por plataforma com variantes
    format: Spreadsheet com copy, formato, targeting, KPIs
  - to: squad-content
    delivers: Ad copy para alinhamento com organico
    format: Copy + messaging consistency notes
```

## Saida
- Copy por plataforma (Meta, LinkedIn, TikTok)
- Variantes para A/B testing (3-5 por elemento)
- Creative pairing notes
- Naming convention aplicada

## Validacao
- [ ] Character limits respeitados por plataforma
- [ ] Tom nativo para cada plataforma
- [ ] Hook nos primeiros caracteres visiveis
- [ ] CTA claro em toda variante
- [ ] Creative pairing considerado
- [ ] Min 3 variantes para testing
- [ ] Naming convention aplicada
- [ ] Consistencia com messaging global

---

*Task operada por: conversion-writer (Spark)*
