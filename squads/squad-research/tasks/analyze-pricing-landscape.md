---
task: analyze-pricing-landscape
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

# Task: Analyze Pricing Landscape

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** STANDARD
- **Depends on:** map-competitive-landscape (Hawk), size-market-tam-sam-som
- **Feeds:** commercial-systems, analyze-competitor-pricing (Hawk)

## Objetivo
Analisar o landscape de pricing do mercado como um todo (nao so competidores) para identificar modelos, faixas e oportunidades de precificacao.

## Entrada
- Mercado/setor
- Dados de pricing de competidores (do Hawk)
- Dados de willingness-to-pay da audiencia (do Pulse, se disponivel)

## Passos

### 1. Modelos de Pricing no Mercado
- Que modelos existem? (subscription, usage, one-time, freemium, marketplace)
- Qual o modelo dominante? Por que?
- Ha modelos inovadores emergindo?

### 2. Faixas de Preco
- Low-end: quanto custa a opcao mais barata?
- Mid-market: faixa media
- Premium: quanto custa a opcao mais cara?
- Ha gaps na faixa? (ex: nada entre $10 e $500)

### 3. Estrategias de Pricing Observadas
- Premium: quem cobra mais e justifica com valor?
- Value: quem compete em custo-beneficio?
- Penetration: quem usa preco baixo para ganhar share?
- Freemium: quem usa free como aquisicao?
- Value-based: quem cobra pelo resultado (nao pelo input)?

### 4. Tendencias de Pricing
- Precos subindo ou caindo no mercado?
- Comoditizacao: precos convergindo?
- Bundling/unbundling: tendencia de pacotes ou a la carte?
- Transparencia: mercado mais ou menos transparente?

### 5. Oportunidade de Pricing
- Ha faixa de preco nao explorada?
- Ha modelo de pricing nao testado neste mercado?
- Ha oportunidade de value-based pricing?
- Pricing pode ser diferencial competitivo?

## Saida
- Overview do pricing landscape
- Modelos, faixas e estrategias mapeados
- Tendencias de pricing
- Oportunidades identificadas

## Validacao
- [ ] Modelos de pricing catalogados
- [ ] Faixas de preco documentadas
- [ ] Tendencias identificadas
- [ ] Oportunidades priorizadas

---

*Task operada por: market-analyst (Scope)*
