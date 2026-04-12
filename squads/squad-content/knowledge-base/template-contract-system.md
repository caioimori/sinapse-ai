# Template Contract System

> Sistema de contratos formais que definem especificacoes tecnicas exatas por plataforma x formato x template. Contratos sao INVIOLAVEIS.

---

## Conceito

Um Template Contract (TC) e a especificacao tecnica que define EXATAMENTE como uma peca de conteudo deve ser formatada. Ele e o contrato entre quem produz (Arc/Morph) e quem valida (Index). Se o conteudo nao cumpre o TC, e rejeitado.

---

## Anatomia de um Template Contract

```yaml
template_contract:
  id: "instagram-carousel-educativo"
  platform: "instagram"
  format: "carousel"
  variant: "educativo"
  version: "1.2"

  structure:
    min_slides: 7
    max_slides: 10
    first_slide: "hook"
    last_slide: "cta"

  fields:
    hook_text:
      type: "text"
      min_chars: 5
      max_chars: 80
      required: true
      rules: "Sem emoji no inicio. Sem hashtags."

    slide_text:
      type: "text"
      min_chars: 20
      max_chars: 150
      required: true
      rules: "1 ideia por slide. Fonte legivel em mobile."

    cta_text:
      type: "text"
      min_chars: 10
      max_chars: 60
      required: true
      rules: "Verbo de acao. Claro e especifico."

    caption:
      type: "text"
      min_chars: 100
      max_chars: 2200
      required: true
      rules: "Hook nas 2 primeiras linhas. Paragrafos curtos."

    hashtags:
      type: "list"
      min_count: 5
      max_count: 20
      required: true
      rules: "Mix: 30% alta (>1M), 40% media (100K-1M), 30% nicho (<100K)"

  visual_specs:
    aspect_ratio: "1:1"
    resolution: "1080x1080"
    text_max_percentage: 20
    font_min_size: "24px"

  validation:
    hard_fail: ["max_chars exceeded", "required field missing", "min_slides not met"]
    soft_warn: ["approaching max_chars (>90%)", "hashtag count at minimum"]
```

---

## Ciclo de Vida do Template Contract

1. **Criacao**: Morph cria TC quando nova plataforma/formato e adicionado
2. **Validacao**: Index registra TC no pipeline de enforcement
3. **Uso**: Arc/Morph consultam TC durante producao
4. **Auditoria**: Index verifica compliance pre-publicacao
5. **Atualizacao**: Morph atualiza quando plataforma muda specs
6. **Changelog**: Toda mudanca registrada com data, motivo e impacto

---

## Principios do TC System

1. **Inviolabilidade**: TC nao e sugestao — e lei. Hard fail = rejeicao.
2. **Versionamento**: Cada mudanca gera nova versao. Conteudo em producao usa a versao vigente.
3. **Especificidade**: Cada combinacao plataforma x formato x variante tem seu TC.
4. **Automacao**: Validacao e automatica — nao depende de julgamento humano.
5. **Evolucao**: TCs evoluem com as plataformas. Specs mudam, TCs acompanham.

---

## Templates Comuns

| ID | Plataforma | Formato | Slides/Campos |
|----|-----------|---------|---------------|
| ig-carousel-edu | Instagram | Carrossel Educativo | 7-10 slides |
| ig-carousel-story | Instagram | Carrossel Storytelling | 5-8 slides |
| ig-feed-single | Instagram | Post Single Image | 1 imagem + caption |
| ig-reel-tip | Instagram | Reel Dica Rapida | 15-30s |
| ig-reel-tutorial | Instagram | Reel Tutorial | 30-60s |
| li-text-thought | LinkedIn | Post Texto Thought Leadership | 800-1300 chars |
| li-carousel-edu | LinkedIn | Carrossel PDF | 7-12 slides |
| blog-standard | Blog | Artigo Standard | 1000-2000 palavras |
| blog-pillar | Blog | Pillar Page | 2000-5000 palavras |
| nl-editorial | Newsletter | Editorial | 300-800 palavras |
| tw-thread | Twitter/X | Thread | 7-15 tweets |
| tk-short | TikTok | Video Curto | 15-60s |

---

## Referências

- Design Systems — token specs e contracts (analogia tecnica)
- Content Style Guides — Mailchimp, Apple (padronizacao de conteudo)
- Platform-specific guidelines — Instagram, LinkedIn, TikTok (specs oficiais)
