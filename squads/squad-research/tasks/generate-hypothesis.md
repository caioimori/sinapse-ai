---
task: generate-hypothesis
responsavel: "@deep-researcher"
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

# Task: Generate Hypothesis

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** STANDARD
- **Depends on:** conduct-deep-research ou knowledge landscape
- **Feeds:** design-research-framework, answer-strategic-question

## Objetivo
Gerar hipoteses testaveis a partir de dados, padroes ou gaps identificados na pesquisa, criando base para investigacao mais profunda ou experimentacao.

## Entrada
- Dados/findings de pesquisa anterior
- Gaps ou padroes identificados
- Contexto do problema/oportunidade

## Passos

### 1. Identificar Base da Hipotese
- Que dado, pattern ou gap inspira a hipotese?
- E baseada em observacao, analogia ou intuicao informada?
- Ha precedente em outro mercado/contexto?

### 2. Formular Hipotese
- Formato: "Se [condicao], entao [resultado esperado], porque [mecanismo]"
- Exemplo: "Se reduzirmos o tempo de resposta para <2h, entao a conversao aumentara 15%, porque leads B2B desistem apos 4h sem resposta"
- Deve ser FALSIFICAVEL — se nao pode ser provada errada, nao e hipotese

### 3. Classificar Hipotese
- **Tipo:**
  - Descritiva: "X existe" ou "X tem tamanho Y"
  - Correlacional: "X se relaciona com Y"
  - Causal: "X causa Y"
  - Preditiva: "Se X, entao Y no futuro"
- **Confidence prévio:**
  - HIGH: forte base em dados existentes
  - MEDIUM: base razoavel, gaps menores
  - LOW: exploratorio, pouca base

### 4. Definir Metodo de Teste
- Como validar/invalidar a hipotese?
  - Survey
  - A/B test
  - Analise de dados historicos
  - Entrevistas
  - Experimento de campo
- Tamanho de amostra necessario
- Duracao do teste
- Metricas de sucesso

### 5. Definir Criterios de Decisao
- Que resultado CONFIRMARIA a hipotese?
- Que resultado INVALIDARIA?
- Que resultado seria INCONCLUSIVO?
- O que fazer em cada caso?

## Saida
- Hipotese formulada (Se/Entao/Porque)
- Classificacao (tipo + confidence)
- Metodo de teste proposto
- Criterios de decisao

## Validacao
- [ ] Hipotese falsificavel
- [ ] Base em dados/observacao (nao achismo)
- [ ] Metodo de teste definido
- [ ] Criterios de confirmacao/invalidacao claros

---

*Task operada por: deep-researcher (Sage)*
