---
task: create-swot-analysis
responsavel: "@data-synthesizer"
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

# Task: Create SWOT Analysis

## Metadata
- **Squad:** squad-research
- **Agent:** data-synthesizer (Loom)
- **Complexity:** STANDARD
- **Depends on:** pesquisa de mercado + competitiva + audiencia completadas
- **Feeds:** brand-system, commercial-systems, @pm

## Objetivo
Criar SWOT abrangente cruzando todos os inputs de pesquisa — com analise TOWS para gerar estrategias cruzadas (S×O, W×T, S×T, W×O).

## Entrada
- Market analysis (Scope)
- Competitive intelligence (Hawk)
- Audience insights (Pulse)
- Trend forecasts (Horizon)
- Deep research findings (Sage)

## Passos

### 1. Levantar Elementos SWOT
**Strengths (Interno, Positivo):**
- Competencias centrais
- Recursos unicos
- Vantagens competitivas
- Expertise/IP
- Base de clientes/relacionamentos

**Weaknesses (Interno, Negativo):**
- Gaps de competencia
- Limitacoes de recurso
- Desvantagens vs competidores
- Debts tecnicos/organizacionais
- Areas de baixa performance

**Opportunities (Externo, Positivo):**
- Tendencias favoraveis
- Gaps de mercado nao explorados
- Mudancas regulatorias favoraveis
- Novos segmentos acessiveis
- Tecnologias emergentes

**Threats (Externo, Negativo):**
- Movimentos competitivos
- Tendencias desfavoraveis
- Riscos regulatorios
- Mudancas de comportamento do consumidor
- Disrupcoes tecnologicas

### 2. Priorizar e Ranquear
- Cada item recebe score 1-5 em IMPORTANCIA e PROBABILIDADE
- Top 5 em cada quadrante sao priorizados
- Suportar cada item com EVIDENCIA da pesquisa (nao opiniao)
- Linkar ao finding original (rastreabilidade)

### 3. Analise TOWS (Cruzamento Estrategico)

| | Opportunities | Threats |
|---|:---:|:---:|
| **Strengths** | S×O: LEVERAGE (usar forca para capturar oportunidade) | S×T: DEFEND (usar forca para mitigar ameaca) |
| **Weaknesses** | W×O: IMPROVE (corrigir fraqueza para capturar oportunidade) | W×T: MITIGATE (corrigir fraqueza E mitigar ameaca) |

- Para cada cruzamento: 2-3 estrategias concretas
- Priorizar por impacto e viabilidade

### 4. Implicacoes Estrategicas
- Onde temos VANTAGEM SUSTENTAVEL? (S forte + O presente)
- Onde estamos VULNERAVEIS? (W forte + T presente)
- Onde esta o MAIOR UPSIDE? (S × O mais impactante)
- Onde esta o MAIOR RISCO? (W × T mais critico)

### 5. Visual SWOT
- Matriz 2x2 visual com top items em cada quadrante
- Color coding por severidade/impacto
- Setas conectando cruzamentos TOWS
- Highlight dos items com maior score

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: brand-system
    delivers: strengths para posicionamento e threats para monitorar
    format: top 5 S e T com evidencias
  - to: commercial-systems
    delivers: SWOT completo para planejamento comercial
    format: matriz + estrategias TOWS
  - to: product-systems
    delivers: oportunidades e gaps para roadmap
    format: S×O e W×O priorizados
```

## Saida
- Matriz SWOT completa com evidencias
- Analise TOWS com estrategias cruzadas
- Implicacoes estrategicas priorizadas
- Visual SWOT 2x2

## Validacao
- [ ] Top 5 items em cada quadrante com evidencia
- [ ] Score de importancia e probabilidade
- [ ] TOWS completo (4 quadrantes cruzados)
- [ ] Estrategias concretas para cada cruzamento
- [ ] Linked aos findings originais
- [ ] Visual SWOT produzido

---

*Task operada por: data-synthesizer (Loom)*
