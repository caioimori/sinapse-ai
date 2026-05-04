---
task: map-industry-ecosystem
responsavel: "@market-analyst"
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

# Task: Map Industry Ecosystem

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** STANDARD
- **Depends on:** analyze-value-chain
- **Feeds:** map-competitive-landscape (Hawk), evaluate-market-entry

## Objetivo
Mapear ecossistema completo da industria — todos os players, relacoes, fluxos de valor e poder — para entender a dinamica do todo.

## Entrada
- Industria a mapear
- Value chain analisada (se disponivel)

## Passos

### 1. Identificar Categorias de Players
- Produtores/criadores de valor
- Distribuidores/intermediarios
- Plataformas/marketplaces
- Reguladores/governanca
- Complementares (produtos que ampliam valor)
- Influenciadores/gatekeepers
- Consumidores finais

### 2. Mapear Relacoes
- Quem depende de quem?
- Fluxos de dinheiro (quem paga quem)
- Fluxos de dados/informacao
- Fluxos de influencia
- Parcerias e alianças

### 3. Identificar Posicoes de Poder
- Quem tem posicao de gatekeeper?
- Quem tem network effects?
- Quem tem mais opcoes (menos dependencia)?
- Quem esta sendo espremido (pouco poder)?

### 4. Dinamicas de Mudanca
- Novos players entrando? Em qual categoria?
- Verticalizacao? (players expandindo para mais categorias)
- Desintermediacao? (elos sendo eliminados)
- Platformizacao? (alguem virando plataforma)

### 5. Visualizacao
- Mapa visual com categorias, players, relacoes
- Indicar: tamanho relativo, direcao de crescimento
- Marcar nossa posicao (ou pretendida)

## Saida
- Mapa do ecossistema visual
- Posicoes de poder identificadas
- Dinamicas de mudanca
- Oportunidades de posicionamento

## Validacao
- [ ] Todas as categorias de players mapeadas
- [ ] Relacoes e fluxos identificados
- [ ] Posicoes de poder analisadas
- [ ] Dinamicas de mudanca documentadas

---

*Task operada por: market-analyst (Scope)*
