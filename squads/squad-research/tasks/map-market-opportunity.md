---
task: map-market-opportunity
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

# Task: Map Market Opportunity

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** STANDARD
- **Depends on:** size-market-tam-sam-som, analyze-industry-trends
- **Feeds:** evaluate-market-entry

## Objetivo
Mapear oportunidades de mercado combinando sizing, trends, gaps e timing para identificar onde investir.

## Entrada
- Market sizing (TAM/SAM/SOM)
- Tendencias de industria
- Landscape competitivo (do Hawk)

## Passos

### 1. Oportunidades por Tipo
- **Expansao de mercado:** mercado crescendo, mais clientes entrando
- **Substituicao:** trocar incumbents com oferta superior
- **Criacao:** mercado novo (Blue Ocean)
- **Adjacencia:** mercado proximo ao atual (novo segmento, nova geografia)
- **Nicho:** long tail, segmento sub-atendido

### 2. Avaliacao de Cada Oportunidade
- **Tamanho:** receita potencial (SAM relevante)
- **Crescimento:** CAGR projetado
- **Acessibilidade:** podemos alcancar este mercado?
- **Timing:** cedo demais? tarde? right time?
- **Fit:** alinha com nosso posicionamento e capabilities?

### 3. Scoring de Oportunidade

| Criterio | Peso | Opp 1 | Opp 2 | Opp 3 |
|----------|:----:|:-----:|:-----:|:-----:|
| Tamanho (1-5) | 25% | | | |
| Crescimento (1-5) | 20% | | | |
| Acessibilidade (1-5) | 20% | | | |
| Timing (1-5) | 20% | | | |
| Fit (1-5) | 15% | | | |
| **Score** | | | | |

### 4. Priorizacao
- Top 3 oportunidades ranqueadas por score
- Para cada: investment required, timeline to capture, risk level
- Quick wins vs strategic bets

### 5. Roadmap de Captura
- Para oportunidade #1: que acoes tomar nos proximos 30/60/90 dias?
- Milestones de validacao (antes de investir heavy)
- Metricas de sucesso

## Saida
- Mapa de oportunidades com scores
- Top 3 priorizadas
- Roadmap de captura para #1

## Validacao
- [ ] Oportunidades baseadas em dados (sizing + trends)
- [ ] Scoring com criterios definidos
- [ ] Top 3 priorizadas com justificativa
- [ ] Roadmap de captura definido

---

*Task operada por: market-analyst (Scope)*
