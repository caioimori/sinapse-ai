---
task: profile-ideal-customer
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

# Task: Profile Ideal Customer

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** STANDARD
- **Depends on:** build-audience-persona, segment-audience, dados de vendas
- **Feeds:** commercial-systems, copywriting-persuasion

## Objetivo
Definir ICP (Ideal Customer Profile) — o perfil de cliente que mais se beneficia da solucao E mais gera valor para o negocio. B2B e B2C.

## Entrada
- Dados de clientes atuais (CRM, vendas, NPS, churn)
- Personas e segmentos existentes
- Metricas de negocio (LTV, CAC, churn rate, NPS)

## Passos

### 1. Analise da Base Atual
- Top 20% clientes por receita → que tem em comum?
- Clientes com maior NPS → que tem em comum?
- Clientes com menor churn → que tem em comum?
- Cruzar: quem aparece nos 3 tops?

### 2. Criterios de ICP

**Para B2B:**
- Industria/setor
- Tamanho (receita, funcionarios)
- Maturidade (startup, growth, enterprise)
- Geografia
- Tecnologia usada (stack)
- Budget disponivel
- Decision-maker profile

**Para B2C:**
- Demografia (idade, renda, localizacao)
- Comportamento de compra (frequencia, ticket)
- Canal de aquisicao (de onde veio)
- Engajamento (frequencia de uso)
- Disposicao a pagar
- Potencial de advocacy

### 3. Scoring de Fit
- Para cada criterio: peso (importancia) × match (0-5)
- Score total = soma ponderada
- Threshold: ≥80% = ICP, 60-79% = potential, <60% = poor fit

### 4. Anti-ICP
- Quem NAO e ICP (igualmente importante)
- Clientes que churnam rapido → que tem em comum?
- Clientes com CAC alto e LTV baixo → que tem em comum?
- Clientes que consomem suporte desproporcionalmente → perfil

### 5. Documentacao
- ICP Profile documentado (1 pagina)
- Criterios com pesos
- Scoring template reutilizavel
- Anti-ICP profile
- Exemplos de clientes reais que se encaixam

## Saida
- ICP documentado com criterios e pesos
- Anti-ICP documentado
- Scoring template para qualificacao
- Exemplos de clientes-modelo

## Validacao
- [ ] ICP baseado em dados de clientes reais
- [ ] Criterios com pesos definidos
- [ ] Anti-ICP identificado
- [ ] Scoring template criado

## Handoffs
```yaml
handoff:
  cross_squad:
    - to: "commercial-systems/orchestrator"
      artifact: "ICP doc, scoring template"
      context: "Para qualificacao de leads e priorizacao de pipeline"
    - to: "growth-analytics/orchestrator"
      artifact: "ICP criterios, anti-ICP"
      context: "Para targeting de campanhas e lookalike audiences"
  cross_squad:
    - to: "commercial-systems/commercial-orqx"
      when: "Scoring precisa ser implementado em CRM/sistema"
      context: "Template de scoring para automacao"
```

---

*Task operada por: audience-intelligence (Pulse)*
