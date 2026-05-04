---
task: analyze-industry-trends
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

# Task: Analyze Industry Trends

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** STANDARD
- **Depends on:** industria definida
- **Feeds:** forecast-industry-trends (Horizon), content-intelligence/North

## Objetivo
Analisar tendencias da industria para informar estrategia de negocio, identificando o que esta mudando, por que e que oportunidades/ameacas isso cria.

## Entrada
- Industria/setor a analisar
- Horizonte temporal (1, 3, 5 anos)

## Passos

### 1. Mapeamento de Tendencias
- Coletar tendencias de fontes Tier 2-3:
  - Reports de industria (Gartner, Forrester, McKinsey, CB Insights)
  - Conferencias do setor
  - Papers e publicacoes especializadas
- Categorizar: tecnologica, comportamental, regulatoria, economica, social

### 2. Para Cada Tendencia
- **Descricao:** O que esta acontecendo?
- **Drivers:** Por que esta acontecendo? (causas raiz)
- **Evidencia:** Dados que comprovam (nao hype)
- **Maturidade:** Emergente → Crescendo → Established → Declining
- **Velocidade:** Acelerando / Estavel / Desacelerando

### 3. Classificacao por Impacto
- **Game Changer (5):** Vai transformar a industria fundamentalmente
- **Significativa (4):** Vai mudar regras para muitos players
- **Relevante (3):** Afeta segmentos especificos
- **Marginal (2):** Impacto limitado
- **Ruido (1):** Mais hype que substancia

### 4. Intersecoes
- Que tendencias se reforcam mutuamente?
- Que tendencias se contradizem?
- Que intersecoes criam oportunidades unicas?

### 5. Implicacoes
- Para nosso negocio: oportunidades e ameacas
- Para competidores: quem se beneficia, quem sofre
- Para clientes: como muda o comportamento/expectativa
- Timeline: quando sentiremos o impacto?

## Saida
- Mapa de tendencias classificadas por impacto × maturidade
- Top 5 tendencias com implicacoes
- Intersecoes identificadas
- Recomendacoes de posicionamento

## Validacao
- [ ] Tendencias baseadas em dados (nao opiniao)
- [ ] Classificadas por impacto e maturidade
- [ ] Intersecoes analisadas
- [ ] Implicacoes conectadas a acoes

---

*Task operada por: market-analyst (Scope)*
