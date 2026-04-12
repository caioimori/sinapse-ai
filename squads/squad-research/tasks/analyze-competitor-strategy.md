---
task: analyze-competitor-strategy
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

# Task: Analyze Competitor Strategy

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** COMPLEX
- **Depends on:** map-competitive-landscape, analyze-competitor-positioning
- **Feeds:** evaluate-competitive-threats, create-battle-card

## Objetivo
Desconstruir a estrategia de um competidor especifico — entender nao so O QUE fazem mas POR QUE e PARA ONDE vao.

## Entrada
- Competidor a analisar em profundidade
- Dados coletados (landscape, positioning, digital benchmark)

## Passos

### 1. Modelo de Negocio
- Como ganha dinheiro? (revenue model)
- Freemium? Subscription? One-time? Marketplace?
- Pricing strategy: premium? value? penetration?
- Unit economics estimados (se disponivel)

### 2. Estrategia de Go-to-Market
- Canais de aquisicao dominantes (inbound, outbound, product-led, partnership)
- Sales motion: self-serve? inside sales? field sales? channel?
- Speed of sales cycle
- Customer success model

### 3. Estrategia de Produto
- Roadmap visivel (changelogs, press releases, job postings)
- Build vs buy vs partner decisions
- Plataforma vs point solution
- Integrações chave
- Onde estao investindo (baseado em hiring)

### 4. Estrategia de Conteudo & Marca
- Thought leadership: que territorio reivindicam?
- Comunidade: constroem comunidade? Como?
- Events: participam? Organizam?
- Partnerships estrategicos: com quem se aliam?

### 5. Strengths & Vulnerabilities
- **Strengths reais:** O que fazem melhor que o mercado?
- **Vulnerabilities:** Onde sao fracos? (reviews, churn, gaps)
- **Momentum:** Estao acelerando ou desacelerando?
- **Moat:** Tem barreira defensavel? Qual?

### 6. Projecao Estrategica
- Para onde estao indo? (baseado em hiring, product, messaging)
- Que mercados adjacentes podem entrar?
- Que ameaca representam em 12-24 meses?
- Cenarios: se eles fizerem X, nos deveriamos Y

## Saida
- Analise estrategica completa do competidor
- Modelo de negocio desconstruido
- Strengths vs vulnerabilities
- Projecao de movimentos futuros
- Recomendacoes de resposta estrategica

## Validacao
- [ ] Modelo de negocio compreendido
- [ ] GTM strategy desconstruida
- [ ] Strengths e vulnerabilities baseados em dados
- [ ] Projecao futura com cenarios
- [ ] Recomendacoes de resposta

---

*Task operada por: competitive-intelligence (Hawk)*
