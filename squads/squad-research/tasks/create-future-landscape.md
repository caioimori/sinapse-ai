---
task: create-future-landscape
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

# Task: Create Future Landscape

## Metadata
- **Squad:** squad-research
- **Agent:** trend-forecaster (Horizon)
- **Complexity:** STANDARD
- **Depends on:** cenarios, tendencias, dados de mercado
- **Feeds:** brand-system, commercial-systems, @pm

## Objetivo
Criar visao do landscape futuro — como o mercado/industria vai se parecer em 3-5 anos, com mapa visual current→future state.

## Entrada
- Cenarios (scenario planning)
- Tendencias projetadas
- Market data e competitive landscape
- Technology adoption map

## Passos

### 1. Definir Current State Landscape
- Mapa visual do mercado HOJE:
  - Players principais e suas posicoes
  - Segmentos de mercado e tamanhos
  - Tecnologias dominantes
  - Modelos de negocio prevalentes
  - Dinamicas de poder (quem controla o que)

### 2. Projetar Future State (3-5 anos)
Baseado no cenario BASE (mais provavel):
- **Novos players:** Quem entra? De onde vem?
- **Exits:** Quem sai ou e adquirido?
- **Consolidacao:** Fusoes, aquisicoes, parcerias
- **Novos segmentos:** Que segmentos surgem?
- **Segmentos que desaparecem:** Que nichos morrem?
- **Tecnologias dominantes:** O que substitui o que?
- **Modelos de negocio:** Que modelos prevalecem?
- **Dinamicas de poder:** Quem ganha/perde controle?

### 3. Mapa de Transicao (Current → Future)
- Timeline visual com milestones de transicao
- Eventos-chave que marcam mudancas
- Pontos de inflexao esperados
- Fases: Estabilidade → Transicao → Nova normalidade
- Para cada fase: quem lidera, quem segue, quem resiste

### 4. Winners e Losers Analysis
**Winners (beneficiados pela transicao):**
- Que tipo de player prospera?
- Que competencias sao valiosas?
- Que posicoes de mercado sao vantajosas?

**Losers (prejudicados pela transicao):**
- Que tipo de player declina?
- Que competencias se tornam obsoletas?
- Que posicoes de mercado enfraquecem?

**Wildcards (imprevisíveis):**
- Que players podem surpreender (para cima ou para baixo)?
- Que eventos inesperados podem alterar o landscape?

### 5. Strategic Positioning Recommendations
- Onde nos POSICIONAR no future landscape?
- Que competencias DESENVOLVER agora?
- Que parcerias/aquisicoes CONSIDERAR?
- Que areas EVITAR?
- Timeline de acoes: o que fazer em cada fase da transicao

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: brand-system
    delivers: future positioning opportunities
    format: posicionamento recomendado no landscape futuro
  - to: commercial-systems
    delivers: future market dynamics para GTM
    format: mudancas de mercado com timeline
  - to: product-systems
    delivers: future feature/product landscape
    format: oportunidades de produto no futuro
```

## Saida
- Current state landscape map
- Future state landscape (3-5 anos)
- Mapa de transicao com timeline
- Winners/losers analysis
- Strategic positioning recommendations

## Validacao
- [ ] Current state mapeado com completude
- [ ] Future state projetado baseado em evidencia
- [ ] Transicao com timeline e milestones
- [ ] Winners e losers identificados
- [ ] Recomendacoes de posicionamento estrategico

---

*Task operada por: trend-forecaster (Horizon)*
