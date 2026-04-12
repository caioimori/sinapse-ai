---
task: run-scenario-planning
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

# Task: Run Scenario Planning

## Metadata
- **Squad:** squad-research
- **Agent:** trend-forecaster (Horizon)
- **Complexity:** COMPLEX
- **Depends on:** analyze-macro-forces, dados de tendencias
- **Feeds:** commercial-systems, product-systems, @project-lead, @architect

## Objetivo
Executar scenario planning completo usando metodo Schwartz — 2 incertezas criticas → matriz 2x2 → 4 cenarios nomeados com narrativas, implicacoes e indicadores.

## Entrada
- Analise PESTEL (macro forces)
- Tendencias mapeadas (Horizon)
- Market data (Scope)
- Competitive landscape (Hawk)

## Passos

### 1. Identificar Incertezas Criticas
- Listar todas as incertezas que afetam o mercado/negocio
- Filtrar por 2 criterios:
  - **Alto impacto:** Se mudar, muda tudo
  - **Alta incerteza:** Nao sabemos para que lado vai
- Selecionar as 2 MAIS criticas e independentes entre si
- Exemplos tipicos: regulacao (rigida vs flexivel), tecnologia (lenta vs rapida), economia (crescimento vs recessao)

### 2. Construir Matriz 2x2

```
              Incerteza A: [Extremo 1]
                    |
    Cenario 1       |       Cenario 2
    "Nome"          |       "Nome"
                    |
----Incerteza B:----+----Incerteza B:----
    [Extremo 1]     |     [Extremo 2]
                    |
    Cenario 3       |       Cenario 4
    "Nome"          |       "Nome"
                    |
              Incerteza A: [Extremo 2]
```

- Cada quadrante = 1 cenario unico
- Nomear cada cenario de forma MEMORAVEL (nao "Cenario 1")
- Nomes devem evocar a essencia do cenario

### 3. Desenvolver Narrativas (por cenario)
Para cada cenario, construir narrativa de 3-5 anos:
- **Como chegamos aqui?** (sequencia de eventos)
- **Como e o mundo neste cenario?** (descricao vivida)
- **Quem sao os winners e losers?** (players beneficiados/prejudicados)
- **Que oportunidades existem?** (para nosso negocio)
- **Que ameacas existem?** (para nosso negocio)
- **Que business model funciona aqui?** (adaptacoes necessarias)

### 4. Definir Early Indicators (por cenario)
Para cada cenario, definir 3-5 indicadores que sinalizam que ESTE cenario esta se materializando:
- **Indicador:** O que observar
- **Fonte:** Onde observar
- **Threshold:** A partir de que ponto o sinal e claro
- **Frequencia:** Com que frequencia monitorar
- Criar "dashboard de cenarios" com todos os indicadores

### 5. Wind Tunneling (Testar Estrategia)
- Pegar estrategia ATUAL do negocio
- "Soprar" em cada cenario: a estrategia funciona?
- Classificar: ROBUSTA (funciona em 3-4), FRAGIL (funciona em 1-2), CONDICIONAL (funciona com ajustes)
- Identificar: que ajustes tornam a estrategia mais ROBUSTA?
- Definir strategic options (opcoes que mantem flexibilidade)

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: commercial-systems
    delivers: cenarios com implicacoes comerciais
    format: 4 cenarios com GTM adaptado por cenario
  - to: product-systems
    delivers: cenarios com implicacoes de produto
    format: roadmap adaptado por cenario
```

## Cross-Squad Handoff
```yaml
handoff:
  to_agent: "@project-lead"
  command: "*task strategic-planning"
  context: "4 cenarios com wind tunneling da estrategia atual"
  artifacts:
    - scenario-matrix.md
    - early-indicators-dashboard.md
```

## Saida
- Matriz 2x2 com 4 cenarios nomeados
- Narrativa detalhada por cenario
- Early indicators por cenario
- Wind tunneling da estrategia atual
- Strategic options para robustez

## Validacao
- [ ] 2 incertezas criticas selecionadas (alto impacto + alta incerteza)
- [ ] 4 cenarios com nomes memoraveis
- [ ] Narrativas com 3-5 anos de projecao
- [ ] Early indicators definidos (3-5 por cenario)
- [ ] Wind tunneling executado
- [ ] Strategic options identificadas

---

*Task operada por: trend-forecaster (Horizon)*
