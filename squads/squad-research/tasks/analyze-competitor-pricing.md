---
task: analyze-competitor-pricing
responsavel: "@competitive-intelligence"
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

# Task: Analyze Competitor Pricing

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** STANDARD
- **Depends on:** map-competitive-landscape
- **Feeds:** commercial-systems, Scope (pricing landscape)

## Objetivo
Analisar estrategia de pricing dos competidores para informar precificacao propria e posicionamento de valor.

## Entrada
- Competidores a analisar (3-5)
- Nosso pricing atual (para comparacao)
- Segmento de mercado

## Passos

### 1. Coleta de Pricing
- Para cada competidor:
  - Pricing publico (site, sales pages)
  - Tiers/planos disponiveis
  - Features por tier
  - Modelo: subscription, one-time, usage-based, freemium
  - Descontos anunciados (annual vs monthly, volume)
  - Pricing de enterprise (se estimavel)

### 2. Tabela Comparativa

| Feature | Nos | Comp 1 | Comp 2 | Comp 3 |
|---------|-----|--------|--------|--------|
| Plano basico | R$X/mes | | | |
| Plano pro | R$X/mes | | | |
| Plano enterprise | Sob consulta | | | |
| Modelo | Subscription | | | |
| Free tier | Sim/Nao | | | |
| Desconto anual | X% | | | |

### 3. Analise de Estrategia de Pricing
- **Premium:** Cobra mais, se posiciona como melhor
- **Value:** Cobra menos, compete por custo-beneficio
- **Freemium:** Free para atrair, monetiza upgrade
- **Penetration:** Abaixo do mercado para ganhar share
- **Skimming:** Alto no inicio, reduz depois

### 4. Value-Price Mapping
- Plotar: valor percebido × preco
- Quem cobra mais e entrega mais? (justo)
- Quem cobra mais e entrega menos? (vulneravel)
- Quem cobra menos e entrega mais? (agressivo)
- Quem cobra menos e entrega menos? (economy)

### 5. Implicacoes
- Estamos precificados corretamente vs competidores?
- Ha espaco para premium pricing? Evidencia?
- Ha risco de price war? De quem?
- Oportunidade de modelo diferente (ex: performance-based)?

## Saida
- Tabela comparativa de pricing
- Analise de estrategia por competidor
- Value-price map
- Recomendacao de pricing

## Validacao
- [ ] Pricing de 3+ competidores coletado
- [ ] Tabela comparativa preenchida
- [ ] Estrategia de pricing identificada
- [ ] Recomendacao com justificativa

## Handoffs
```yaml
handoff:
  cross_squad:
    - to: "commercial-systems/orchestrator"
      artifact: "tabela comparativa, value-price map"
      context: "Para estrategia de pricing e negociacao"
```

---

*Task operada por: competitive-intelligence (Hawk)*
