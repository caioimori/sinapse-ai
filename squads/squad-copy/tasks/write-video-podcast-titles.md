---
task: write-video-podcast-titles
responsavel: "@headline-specialist"
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

# Task: Write Video & Podcast Titles

## Metadata
- **Squad:** squad-copy
- **Agent:** headline-specialist (Hook)
- **Complexity:** STANDARD
- **Depends on:** content brief
- **Feeds:** content-intelligence

## Objetivo
Criar titulos para videos (YouTube, Reels, TikTok) e podcasts que maximizam clicks/plays — combinando SEO, curiosidade e relevancia.

## Entrada
- Conteudo do video/episodio (resumo)
- Plataforma destino
- Audiencia
- Keywords relevantes (se YouTube/SEO)

## Passos

### 1. YouTube Title Patterns (CTR-Optimized)
- "How I [resultado] in [tempo] (Step-by-Step)"
- "I Tried [coisa] for [tempo]. Here's What Happened."
- "[Numero] [Topico] Mistakes You're Making Right Now"
- "Why [Autoridade] Says [Afirmacao Contraria]"
- "[Topico] for Beginners: Complete Guide ([ano])"
- Max 60 caracteres (antes de truncation)
- Keyword na primeira metade do titulo

### 2. Podcast Episode Title Patterns
- "EP [N]: [Guest] on [Topico Compelling]"
- "[Topico]: [Subtitulo que gera curiosidade]"
- "How to [Resultado] with [Guest/Method]"
- "The Truth About [Topico Controverso]"
- "[Numero] Lessons from [Experiencia]"

### 3. Short-Form Video (Reels/TikTok/Shorts)
- Titulos curtos + text overlay como hook
- "POV: [situacao]"
- "[Topico] in [tempo] ⚡"
- "Part [N] of [serie]"

### 4. Thumbnail Title Pairing (YouTube)
- Titulo e thumbnail devem complementar (nao repetir)
- Titulo: informacao/curiosidade
- Thumbnail: emocao/reacao visual
- Combinar para criar "click package"

### 5. Score e Selecionar
- Gerar 15+ variações por peca
- Score por: curiosity, specificity, searchability, emotional charge
- Top 3 para decision

## Saida
- 15+ titulo variations
- Top 3 recomendados
- Thumbnail text suggestions (YouTube)
- SEO keyword integration notes

## Validacao
- [ ] Titulos platform-appropriate
- [ ] Max character limits respeitados
- [ ] Keywords integrados naturalmente (se SEO)
- [ ] Curiosidade + clareza balanceados
- [ ] Thumbnail pairing considerado (YouTube)

---

*Task operada por: headline-specialist (Hook)*
