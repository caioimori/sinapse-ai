---
task: size-market-tam-sam-som
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

# Task: Size Market TAM SAM SOM

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** COMPLEX
- **Depends on:** mercado definido
- **Feeds:** evaluate-market-entry, commercial-systems, growth-analytics

## Objetivo
Dimensionar mercado usando TAM/SAM/SOM com metodologia top-down E bottom-up, entregando sizing com premissas declaradas e confidence level.

## Entrada
- Produto/servico a dimensionar
- Mercado (definicao, geografia, segmento)
- Dados disponiveis

## Passos

### 1. Definicao Precisa do Mercado
- O que EXATAMENTE estamos dimensionando?
- Produto/servico: definicao estreita
- Geografia: global? nacional? regional?
- Segmento: todo o mercado ou nicho?
- Periodo: sizing atual? Projecao para que ano?
- REGRA: definicao ambigua = sizing inutil

### 2. Top-Down Sizing
- Partir de dados macro (Statista, Euromonitor, Gartner, reports)
- Mercado total da categoria → afunilar por geografia → segmento → target
- Exemplo: Mercado global de SaaS ($300B) → Brasil ($5B) → Segment ($500M) → Target ($100M)
- Registrar cada afunilamento com fonte e premissa

### 3. Bottom-Up Sizing
- Partir de unidade minima:
  - Numero de clientes potenciais × ticket medio × frequencia
  - OU: unidades vendaveis × preco medio
- Exemplo: 50.000 empresas target × R$5.000/ano × 30% penetracao = R$75M
- Cada numero com fonte ou premissa declarada

### 4. Calcular TAM/SAM/SOM
- **TAM (Total Addressable Market):** Mercado total se tivesse 100% de share
- **SAM (Serviceable Available Market):** Parcela que podemos servir (geografia, segmento, canal)
- **SOM (Serviceable Obtainable Market):** Parcela realista de captura em 3-5 anos

### 5. Comparar Top-Down vs Bottom-Up
- Divergencia <30%: confidence ALTA → usar media
- Divergencia 30-50%: confidence MEDIA → investigar causa
- Divergencia >50%: confidence BAIXA → refinar definicoes

### 6. Growth Rate
- CAGR historico (se dados disponiveis)
- Projecao de crescimento (fontes de industria)
- Drivers de crescimento: o que faz o mercado crescer?
- Riscos de contracao: o que pode encolher o mercado?

### 7. Documentacao
- Sizing final com range (pessimista / base / otimista)
- Premissas declaradas e numeradas
- Fontes citadas com data
- Confidence level: HIGH / MEDIUM / LOW
- Limitacoes: o que NAO esta incluido

## Saida
- TAM/SAM/SOM documentados
- Comparacao top-down vs bottom-up
- Growth rate e drivers
- Premissas e fontes
- Confidence level

## Validacao
- [ ] Mercado definido com precisao
- [ ] Top-down E bottom-up calculados
- [ ] TAM/SAM/SOM distintos
- [ ] Premissas declaradas
- [ ] Confidence level atribuido

## Handoffs
```yaml
handoff:
  cross_squad:
    - to: "commercial-systems/orchestrator"
      artifact: "TAM/SAM/SOM, growth rate"
      context: "Para metas de vendas e planejamento"
    - to: "growth-analytics/orchestrator"
      artifact: "market size, segmentos, penetracao"
      context: "Para strategy de growth e targeting"
  cross_squad:
    - to: "product-systems/product-orqx"
      when: "Sizing justifica novo produto/feature"
      context: "Dados de mercado para PRD"
```

---

*Task operada por: market-analyst (Scope)*
