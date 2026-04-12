# Squad Cloning

> Pipeline de clonagem cognitiva — extrai modelos mentais, heuristicas, padroes de decisao e vocabulario de mentes reais e gera squads de agentes IA que pensam como elas. Suporta 3 tiers de fidelidade (KB-only, Consultant Clone, Full Clone).

## Visao Geral

| Metrica | Quantidade |
|---------|-----------|
| Agentes | 8 |
| Tasks | 54 |
| Workflows | 6 |
| Knowledge Bases | 8 |

## Agentes

| Agente | Papel |
|--------|-------|
| Helix (cloning-orqx) | Orquestrador — gerencia o ciclo completo de clonagem |
| Scout (source-hunter) | Descoberta de fontes — cataloga todo conteudo disponivel |
| Capture (content-capturer) | Captura de conteudo — transcreve e digitaliza conteudo bruto |
| Cortex (cognitive-extractor) | Extracao de DNA — identifica as 5 camadas cognitivas |
| Synth (mind-synthesizer) | Sintese cognitiva — consolida extracoes em perfil unificado |
| Forge (agent-forger) | Geracao de agentes — cria agent.md a partir de perfis cognitivos |
| Archive (kb-architect) | Geracao de knowledge bases — cria KBs da inteligencia extraida |
| Assembly (squad-assembler) | Montagem de squad — empacota tudo em squad deployavel |

## Ativacao

```bash
# Via orquestrador (recomendado)
@cloning-orqx

# Via agente especifico
@cognitive-extractor
@agent-forger
@source-hunter
```

## Tasks Principais

**Descoberta de Fontes**
- discover-youtube-channels, discover-podcasts-appearances, discover-books-publications
- discover-articles-interviews, compile-source-catalog

**Captura de Conteudo**
- transcribe-youtube-videos, transcribe-podcast-episodes, extract-book-content
- normalize-raw-content, validate-transcription-quality

**Extracao Cognitiva**
- extract-mental-models, extract-heuristics, extract-decision-patterns
- extract-vocabulary-tone, identify-contradictions, tag-confidence-levels

**Sintese e Geracao**
- build-cognitive-profile, calculate-confidence-score, determine-clone-tier
- generate-agent-persona, generate-agent-heuristics, generate-squad-yaml

## Workflows

- **full-clone-pipeline** — End-to-end: source discovery a squad delivery
- **tier1-kb-only** — Pipeline leve para clones KB-only (5-20K palavras)
- **tier2-consultant** — Mid-tier com agente + KBs (30-100K palavras)
- **tier3-full-clone** — Pipeline completo com agente + KBs + tasks (80-200K+ palavras)
- **source-discovery-cycle** — Hunting e catalogacao de fontes
- **quality-validation-cycle** — Validacao de qualidade end-to-end

## Knowledge Bases

- cognitive-dna-framework
- clone-tier-standards
- source-classification
- confidence-scoring
- extraction-patterns
- agent-generation-guide
- kb-generation-guide
- cross-squad-deployment

## Integracao com Core Agents

Este squad trabalha com o framework SINAPSE core:
- @architect (Aria) para decisoes tecnicas
- @developer (Dex) para implementacao
- @quality-gate (Quinn) para validacao de qualidade

---

*Parte do ecossistema SINAPSE-AI — 18 squads, 186 agentes*
