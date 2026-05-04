---
task: conduct-jobs-to-be-done
responsavel: "@audience-intelligence"
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

# Task: Conduct Jobs To Be Done

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** COMPLEX
- **Depends on:** dados de audiencia, entrevistas (ideal)
- **Feeds:** build-audience-persona, copywriting-persuasion, commercial-systems

## Objetivo
Conduzir analise Jobs To Be Done (Christensen) para entender o 'trabalho' que a audiencia contrata a solucao para realizar — funcional, emocional e social.

## Entrada
- Dados de clientes (entrevistas, reviews, support tickets, sales calls)
- Produto/servico a analisar
- Contexto de mercado

## Passos

### 1. Timeline de Compra (Forces of Progress)
- **Situacao atual (push):** O que esta insatisfatorio? O que gera frustacao?
- **Atracao da nova solucao (pull):** O que a solucao prometeu?
- **Habitos (inertia):** O que mantinha na solucao anterior?
- **Ansiedade (anxiety):** O que preocupa sobre mudar?
- Mapear: push + pull > inertia + anxiety = MUDANCA

### 2. Identificar Jobs (3 Dimensoes)
- **Job Funcional:** Que tarefa precisa ser realizada?
  - Ex: "Preciso gerar relatorios de marketing em menos de 30 min"
- **Job Emocional:** Como quer se sentir?
  - Ex: "Quero me sentir no controle dos meus dados"
- **Job Social:** Como quer ser percebido?
  - Ex: "Quero ser visto como o profissional data-driven da equipe"
- Formato: "[Quando/situacao], eu quero [job], para que [outcome]"

### 3. Mapear Hiring & Firing Criteria
- **Hiring:** Por que 'contrataram' esta solucao?
  - Que promessa os atraiu?
  - Que evidencia os convenceu?
  - Que momento disparou a decisao?
- **Firing:** Por que 'demissionariam'?
  - Que expectativa nao foi atendida?
  - Que alternativa tentaria?
  - Que seria o deal-breaker?

### 4. Compensating Behaviors
- Que 'gambiarras' usam hoje para realizar o job?
- Que ferramentas combinam? Que workarounds inventam?
- INSIGHT: compensating behaviors revelam jobs nao-atendidos

### 5. Outcome Expectations (Ulwick)
- Para cada job, listar desired outcomes
- Ranquear por importancia × satisfacao atual
- **Overserved:** importancia baixa + satisfacao alta → over-engineering
- **Underserved:** importancia alta + satisfacao baixa → OPORTUNIDADE
- **Table stakes:** importancia alta + satisfacao alta → nao diferenciam

### 6. Sintese
- Top 3 jobs priorizados por impacto
- Mapa visual: Jobs × Outcomes × Satisfacao
- Oportunidades de inovacao/melhoria
- Conexao com proposta de valor

## Saida
- Mapa de JTBD (3 dimensoes por persona/segmento)
- Forces of Progress mapeadas
- Hiring/Firing criteria
- Compensating behaviors
- Outcome expectations ranqueados
- Oportunidades identificadas

## Validacao
- [ ] 3 dimensoes do job cobertas (funcional, emocional, social)
- [ ] Forces of Progress mapeadas
- [ ] Hiring/Firing criteria identificados
- [ ] Compensating behaviors documentados
- [ ] Oportunidades underserved identificadas

## Handoffs
```yaml
handoff:
  cross_squad:
    - to: "copywriting-persuasion/orchestrator"
      artifact: "JTBD, pain points, linguagem do cliente"
      context: "Para copy que fala a lingua do job real"
    - to: "commercial-systems/orchestrator"
      artifact: "hiring/firing criteria, objecoes, forces of progress"
      context: "Para processo de vendas alinhado ao JTBD"
    - to: "product-systems/orchestrator"
      artifact: "underserved outcomes, compensating behaviors"
      context: "Para roadmap de produto baseado em jobs reais"
  cross_squad:
    - to: "product-systems/product-orqx"
      when: "JTBD revela necessidade de novo feature/produto"
      context: "Outcomes underserved que justificam desenvolvimento"
```

---

*Task operada por: audience-intelligence (Pulse)*
