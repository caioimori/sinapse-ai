---
task: synthesize-research-report
responsavel: "@data-synthesizer"
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

# Task: Synthesize Research Report

## Metadata
- **Squad:** squad-research
- **Agent:** data-synthesizer (Loom)
- **Complexity:** COMPLEX
- **Depends on:** Todas as research tasks relevantes completadas
- **Feeds:** Todos os squads, @project-lead, @architect

## Objetivo
Sintetizar todas as descobertas de pesquisa em um relatorio estrategico abrangente usando o Pyramid Principle (Minto) — da conclusao para os dados de suporte.

## Entrada
- Outputs de pesquisa de Sage, Pulse, Hawk, Scope, Horizon
- Research brief original com perguntas-chave
- Contexto estrategico do projeto

## Passos

### 1. Inventario de Inputs
- Catalogar todos os outputs de pesquisa recebidos
- Classificar por dominio: audiencia, competitivo, mercado, tendencias, deep research
- Verificar completude: todos os dominos cobertos?
- Identificar gaps — solicitar pesquisa adicional se necessario

### 2. Estrutura Pyramid Principle (Minto)
- **Situacao:** Contexto atual do mercado/negocio
- **Complicacao:** Desafio ou oportunidade central descoberta
- **Resolucao:** Resposta estrategica recomendada
- Cada secao suportada por 3-5 argumentos
- Cada argumento suportado por dados/evidencias

### 3. Cristalizacao de Insights
- Aplicar Insight Crystallization Engine em CADA descoberta:
  - **FINDING:** O que descobrimos (dado, padrao, observacao)
  - **IMPLICATION:** E dai? (impacto no negocio)
  - **RECOMMENDATION:** O que fazer (acao especifica com owner)
- Priorizar insights por impacto estrategico (1-5)
- Agrupar insights por tema (3-7 temas)

### 4. Narrativa Integrada
- Conectar insights entre dominios (audiencia + mercado + competitivo)
- Identificar padroes cross-domain (convergencias e divergencias)
- Construir narrativa coerente: "A historia que os dados contam"
- Eliminar redundancias entre fontes

### 5. Executive Summary
- 1 pagina maxima
- Thesis statement (1 frase)
- 3-5 key findings com confidence levels
- Recomendacoes top 3 priorizadas
- Metricas-chave de suporte
- Risk factors

### 6. Montagem do Relatorio Final
- Executive Summary
- Key Findings (3-7, cada com FINDING/IMPLICATION/RECOMMENDATION)
- Analise Detalhada por Dominio
- Implicacoes Estrategicas Cruzadas
- Recomendacoes Priorizadas (impact x feasibility matrix)
- Metodologia e Fontes
- Apendices de Dados

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: brand-system
    delivers: insights de audiencia e posicionamento competitivo
    format: secao dedicada com recomendacoes de marca
  - to: content-intelligence
    delivers: topicos prioritarios e dados de audiencia
    format: lista de topicos com volume e relevancia
  - to: commercial-systems
    delivers: market sizing, pricing, competitive landscape
    format: secoes com dados quantitativos
  - to: product-systems
    delivers: gaps de mercado e oportunidades
    format: feature recommendations com evidencias
```

## Cross-Squad Handoff
```yaml
handoff:
  to_agent: "@project-lead"
  command: "*task strategic-planning"
  context: "Relatorio de pesquisa sintetizado com recomendacoes priorizadas"
  artifacts:
    - research-report.md
    - executive-summary.md
```

## Saida
- Relatorio estrategico completo (Pyramid Principle)
- Executive summary (1 pagina)
- Key findings com cristalizacao completa
- Recomendacoes priorizadas com owners

## Validacao
- [ ] Todos os inputs de pesquisa integrados
- [ ] Pyramid Principle aplicado (situacao/complicacao/resolucao)
- [ ] Cada insight tem FINDING + IMPLICATION + RECOMMENDATION
- [ ] Executive summary em 1 pagina
- [ ] Recomendacoes priorizadas com owners
- [ ] Cross-squad handoffs formatados
- [ ] Confidence levels atribuidos

---

*Task operada por: data-synthesizer (Loom)*
