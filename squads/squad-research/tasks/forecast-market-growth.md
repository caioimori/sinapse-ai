---
task: forecast-market-growth
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

# Task: Forecast Market Growth

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** STANDARD
- **Depends on:** size-market-tam-sam-som, analyze-industry-trends
- **Feeds:** evaluate-market-entry, commercial-systems

## Objetivo
Projetar crescimento do mercado com cenarios (otimista, base, pessimista) e drivers/riscos que afetam cada cenario.

## Entrada
- Market sizing atual
- Dados historicos de crescimento
- Tendencias de industria

## Passos

### 1. Dados Historicos
- CAGR dos ultimos 3-5 anos
- Padrao: linear? acelerado? volatil?
- Eventos que afetaram crescimento (COVID, regulacao, tech)

### 2. Drivers de Crescimento
- O que EMPURRA o mercado para cima?
  - Adocao tecnologica
  - Mudanca regulatoria
  - Mudanca demografica
  - Crescimento economico
  - Novos use cases
- Peso de cada driver (1-5)

### 3. Riscos de Contracao
- O que pode FREAR ou ENCOLHER o mercado?
  - Regulacao restritiva
  - Substitutos tecnologicos
  - Recessao economica
  - Saturacao
  - Commoditizacao
- Probabilidade de cada risco (1-5)

### 4. Projecao em 3 Cenarios

| Cenario | CAGR | Mercado em 3 anos | Premissas |
|---------|:----:|:-----------------:|-----------|
| Otimista | X% | $X | Drivers maximizados, riscos minimizados |
| Base | X% | $X | Tendencia historica + ajustes |
| Pessimista | X% | $X | Riscos materializados |

### 5. Confidence Level
- Dados historicos robustos? → mais confianca
- Mercado previsivel (maduro) vs volatil (nascente)?
- Concordancia entre fontes?
- Declarar: HIGH / MEDIUM / LOW

## Saida
- Projecao de crescimento em 3 cenarios
- Drivers e riscos documentados
- Timeline de projecao (1, 3, 5 anos)
- Confidence level

## Validacao
- [ ] 3 cenarios com premissas declaradas
- [ ] Drivers e riscos mapeados
- [ ] CAGR calculado para cada cenario
- [ ] Confidence level atribuido

---

*Task operada por: market-analyst (Scope)*
