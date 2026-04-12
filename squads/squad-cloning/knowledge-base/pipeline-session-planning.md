# Pipeline Session Planning — Planejamento de Sessoes com 1M de Contexto

> Como planejar e distribuir o trabalho de clonagem em sessoes de Claude Code
> aproveitando o contexto de 1M tokens.

---

## Modelo de Sessao (1M tokens ≈ 750K palavras)

Com 1M de contexto, o pipeline muda fundamentalmente:

| Antes (200K contexto) | Depois (1M contexto) |
|----------------------|---------------------|
| Chunkar em 600 pedacos | Carregar tudo de uma vez |
| Muitas sessoes por clone | 1-3 sessoes por clone |
| Precisava API Batch | Tudo no plano Max |
| Dias para 1 clone | 1-3 sessoes para 1 clone |

---

## Distribuicao por Tier

### Tier 1 — 1 Sessao
```
Sessao 1:
  - Carregar source-catalog.yaml
  - Carregar todas as transcricoes (5-20K palavras)
  - Extrair 5 camadas DNA
  - Sintetizar perfil cognitivo
  - Gerar 3-8 KBs
  - Validar
```

### Tier 2 — 1-2 Sessoes
```
Sessao 1:
  - Carregar source-catalog.yaml
  - Carregar todas as transcricoes (30-100K palavras)
  - Extrair 5 camadas DNA
  - Sintetizar perfil cognitivo
  - Calcular confidence score

Sessao 2:
  - Carregar perfil cognitivo
  - Gerar agent.md
  - Gerar 5+ KBs
  - Validar tudo
```

### Tier 3 — 2-3 Sessoes
```
Sessao 1:
  - Carregar source-catalog.yaml
  - Carregar todas as transcricoes (80-200K+ palavras)
  - Extrair 5 camadas DNA
  - Sintetizar perfil cognitivo

Sessao 2:
  - Carregar perfil cognitivo + extracoes
  - Gerar agent.md completo
  - Gerar 8+ KBs

Sessao 3 (se necessario):
  - Carregar agent.md + KBs + perfil
  - Gerar tasks (6+)
  - Gerar workflows
  - Montar squad.yaml
  - Rodar pre-publish checklist
  - Deploy cross-squad
```

---

## Ferramentas por Fase

| Fase | Ferramenta | Ambiente |
|------|-----------|---------|
| Source Discovery | Brave Search + Claude Code | Desktop |
| Content Capture | Whisper API (Whisper) + Playwright | VPS 24/7 |
| Load & Extract | Claude Code (1M) | Desktop/VPS |
| Synthesize | Claude Code (1M) | Desktop/VPS |
| Generate Agent | Claude Code | Desktop |
| Generate KBs | Claude Code | Desktop |
| Generate Tasks | Claude Code | Desktop |
| Assemble & Deploy | Claude Code | Desktop |

---

## Estimativa de Tempo

| Classe | Volume | Capture | Processing | Total |
|--------|--------|---------|-----------|-------|
| A (Rico) | 200K+ palavras | 2-4h (Whisper) | 2-3 sessoes | ~1 dia |
| B (Moderado) | 50-200K | 1-2h | 1-2 sessoes | ~meio dia |
| C (Escasso) | 10-50K | 30min-1h | 1 sessao | ~2-3h |
| D (Historico) | 5-50K | 1h (OCR) | 1 sessao | ~2-3h |

**Nota:** Tempos assumem plano Max com acesso direto a Claude Code.

---

## Custo Extra

**Zero.** Todo o pipeline roda com:
- Claude Code (plano Max) — processamento principal
- Whisper API (gratuito) — Whisper transcricao, Playwright capture
- Brave Search (gratuito) — source discovery
- Syncthing (gratuito) — sync cross-machine
