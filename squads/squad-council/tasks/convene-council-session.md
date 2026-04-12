---
task: convene-council-session
responsavel: "@council-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: strategic_question
    tipo: string
    origem: User Input
    obrigatorio: true
  - campo: context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: council_session
    tipo: document
    destino: Console

Checklist:
  - "[ ] Questao enquadrada com precisao"
  - "[ ] 3-5 conselheiros consultados com frameworks"
  - "[ ] Sintese identifica concordancias e tensoes"
  - "[ ] Recomendacao unificada com visoes dissidentes"
  - "[ ] Proximos passos definidos"
---

# Task: Full Council Session

## Metadata
- **Squad:** squad-council
- **Agent:** Zenith (council-orqx)
- **Complexity:** High

## Objetivo
Convocar uma sessao completa do conselho estrategico. Multiplos conselheiros sao consultados, perspectivas sao sintetizadas, e uma recomendacao unificada e entregue.

## Entrada
- Strategic question (questao estrategica clara)
- Context (situacao do negocio, dados, restricoes)
- Advisors requested (opcional — default: 3-5 mais relevantes)
- Decision urgency (opcional)

## Passos

### Phase 1: Frame the Question (Zenith)
1. Reformular a questao em termos precisos
2. Identificar tipo de decisao: investimento, scaling, cultura, hiring, produto, pivot
3. Mapear dimensoes: financeira, operacional, cultural, estrategica, etica
4. Selecionar 3-5 conselheiros mais relevantes
5. Definir restricoes e agenda

### Phase 2: Collect Perspectives (3-5 advisors)
Cada conselheiro fornece:
- Analise atraves de seu framework especifico
- Riscos principais que identifica
- Recomendacao
- Nivel de confianca (HIGH/MEDIUM/LOW)

### Phase 3: Synthesize (Zenith)
1. Identificar areas de concordancia
2. Identificar areas de discordancia
3. Mapear tensoes — tradeoffs genuinos vs premissas diferentes
4. Pesar perspectivas por relevancia
5. Identificar blind spots

### Phase 4: Unified Recommendation (Zenith)
1. Recomendacao sintetizada com raciocinio
2. Visoes dissidentes explicitadas
3. Perfil de risco e mitigacao
4. Contrarian check — argumento mais forte contra a recomendacao
5. Proximos passos concretos

## Veto Conditions
- NUNCA apresentar recomendacao sem visoes dissidentes
- NUNCA consultar menos de 3 conselheiros
- NUNCA pular o contrarian check
