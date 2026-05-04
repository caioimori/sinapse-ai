---
task: predict-market-shifts
responsavel: "@trend-forecaster"
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

# Task: Predict Market Shifts

## Metadata
- **Squad:** squad-research
- **Agent:** trend-forecaster (Horizon)
- **Complexity:** STANDARD
- **Depends on:** tendencias + dados de mercado
- **Feeds:** commercial-systems, brand-system, @pm

## Objetivo
Prever mudancas de mercado usando leading indicators — o que vai mudar, quando, quao rapido, e quem ganha/perde.

## Entrada
- Tendencias de industria (Horizon)
- Market data (Scope)
- Competitive landscape (Hawk)
- Sinais fracos (Horizon)

## Passos

### 1. Identificar Leading Indicators
- **Indicadores de demanda:** Search trends, social mentions, event attendance
- **Indicadores de investimento:** VC funding, M&A, R&D spend
- **Indicadores de talento:** Job postings, skill demand, salary trends
- **Indicadores regulatorios:** Propostas de lei, sandboxes, enforcement
- **Indicadores de tecnologia:** Patent filings, open source activity, API launches

### 2. Mapear Shifts Esperados
Para cada shift identificado:
- **O que muda:** Descricao concisa da mudanca
- **De → Para:** Estado atual → estado futuro
- **Timeline:** Quando comeca a impactar (Q1 2026, H2 2026, 2027+)
- **Velocidade:** Gradual (anos), Rapida (meses), Abrupta (semanas)
- **Magnitude:** Ajuste fino / Mudanca significativa / Transformacao / Disrupcao
- **Confidence:** HIGH / MEDIUM / LOW com justificativa

### 3. Analise de Winners e Losers
Para cada shift:
- **Winners:** Quem se beneficia e por que
  - Players atuais bem posicionados
  - Novos entrantes com vantagem
  - Segmentos de audiencia beneficiados
- **Losers:** Quem e prejudicado e por que
  - Players que perdem relevancia
  - Modelos de negocio ameacados
  - Segmentos que encolhem
- **Nossa posicao:** Estamos do lado certo?

### 4. Impact on Business Model
- Impacto em revenue streams
- Impacto em cost structure
- Impacto em customer segments
- Impacto em value proposition
- Impacto em channels
- Adaptacoes necessarias (pivotar, expandir, contrair)

### 5. Preparacao e Resposta
- **Shifts com HIGH confidence:** Planejar resposta proativa
- **Shifts com MEDIUM confidence:** Criar opcionalidade (hedging)
- **Shifts com LOW confidence:** Monitorar indicadores
- Para cada: 1 acao proativa + 1 plano contingencia

## Saida
- Lista de market shifts previstos com timeline
- Leading indicators por shift
- Analise winners/losers
- Impact on business model
- Planos de preparacao e resposta

## Validacao
- [ ] Shifts identificados com leading indicators
- [ ] Timeline e velocidade estimados
- [ ] Winners e losers mapeados
- [ ] Impacto no business model avaliado
- [ ] Planos de resposta para HIGH confidence shifts

---

*Task operada por: trend-forecaster (Horizon)*
