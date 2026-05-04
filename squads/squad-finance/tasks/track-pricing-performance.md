---
task: track-pricing-performance
responsavel: "@pricing-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: period
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: pricing_performance_report
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Calcular metricas de pricing do periodo"
  - "[ ] Comparar com periodo anterior"
  - "[ ] Identificar tendencias"
  - "[ ] Recomendar ajustes"
---

# Task: Track Pricing Performance

## Metadata
- **Agent:** pricing-strategist (Mint)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Acompanhar performance de pricing ao longo do tempo para identificar tendencias e necessidade de ajustes.

## Steps

1. **Calcular metricas:**
   - Average deal size
   - Rate realization
   - Win rate por faixa de preco
   - Desconto medio concedido
   - Mix de receita por tier
2. **Comparar com periodo anterior:**
   - Deal size trending up/down?
   - Win rate estavel?
   - Descontos aumentando?
3. **Identificar sinais de problema:**
   - Win rate caindo + deal size subindo = preco alto demais
   - Win rate subindo + deal size caindo = preco baixo demais
   - Descontos subindo = rate card desalinhado com mercado

## Output
- Dashboard de pricing performance
- Tendencias com interpretacao
- Recomendacoes de ajuste (se necessario)

## Quality Gates
- [ ] Dados de pelo menos 3 periodos para tendencia
- [ ] Win rate e desconto cruzados
- [ ] Recomendacoes fundamentadas em dados

## Quando Usar
- Review mensal de pricing
- Planejamento de reajuste anual
