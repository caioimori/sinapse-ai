---
task: validate-research-sources
responsavel: "@deep-researcher"
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

# Task: Validate Research Sources

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** SIMPLE
- **Depends on:** —
- **Feeds:** conduct-deep-research, synthesize-multi-source

## Objetivo
Validar credibilidade de fontes usando o Source Credibility Matrix, garantindo que pesquisas sao baseadas em dados confiaveis.

## Entrada
- Lista de fontes a validar
- Contexto: para que serao usadas

## Passos

### 1. Identificacao da Fonte
- Quem publicou? (instituicao, autor, plataforma)
- Credenciais do autor (expertise no tema)
- Historico da publicacao (reputacao, track record)

### 2. Avaliacao de Qualidade
- **Metodologia:** Declarada? Rigida? Replicavel?
- **Recencia:** Quando publicado? Dados de que periodo?
- **Amostra:** Se pesquisa — tamanho e representatividade
- **Peer review:** Revisado por pares? Citado por outros?
- **Conflito de interesse:** Quem financiou? Agenda oculta?

### 3. Classificacao no Matrix

| Tier | Criterio | Exemplos |
|------|----------|----------|
| 1 — Primaria | Dados de primeira mao | Surveys proprios, entrevistas, dados internos |
| 2 — Academica | Revisao por pares, metodologia rigida | Journals, meta-analises |
| 3 — Industria | Expertise setorial, dados proprietarios | McKinsey, Gartner, Forrester |
| 4 — Mercado | Curadoria variavel | Trade pubs, blogs de autoridade |
| 5 — Social | Util para sentimento, nao para fatos | Reddit, reviews, comentarios |

### 4. Flag de Risco
- Fonte unica para claim importante → FLAG
- Fonte com conflito de interesse → FLAG
- Dados com mais de 3 anos → FLAG (depende do setor)
- Fonte sem metodologia declarada → FLAG

### 5. Recomendacao
- USAR: fonte confiavel para nivel de pesquisa
- USAR COM CAUTELA: fonte util mas com limitacoes
- DESCARTAR: fonte nao confiavel ou irrelevante
- BUSCAR ALTERNATIVA: topico importante mas fonte fraca

## Saida
- Fontes classificadas com tier + justificativa
- Flags de risco documentados
- Recomendacao de uso por fonte

## Validacao
- [ ] Todas as fontes classificadas no Matrix
- [ ] Conflitos de interesse verificados
- [ ] Flags de risco documentados
- [ ] Recomendacao de uso atribuida

---

*Task operada por: deep-researcher (Sage)*
