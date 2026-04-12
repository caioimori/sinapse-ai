---
task: analyze-audience-psychographics
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

# Task: Analyze Audience Psychographics

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** STANDARD
- **Depends on:** dados de audiencia
- **Feeds:** build-audience-persona, copywriting-persuasion

## Objetivo
Analisar o perfil psicografico da audiencia — valores, crencas, motivacoes, medos, aspiracoes — para entender POR QUE tomam decisoes (nao apenas QUEM sao).

## Entrada
- Dados comportamentais (analytics, social, reviews)
- Entrevistas/surveys (se disponiveis)
- Persona existente (para enriquecer)

## Passos

### 1. Framework de Analise
- **Valores (Schwartz):** Quais dos 10 valores basicos predominam?
  - Autodireção, Estimulação, Hedonismo, Realização, Poder,
    Segurança, Conformidade, Tradição, Benevolência, Universalismo
- **Motivacoes (Maslow adaptado):** Que nivel de necessidade domina?
  - Sobrevivencia, Seguranca, Pertencimento, Estima, Autorrealizacao
- **Medos:** O que evitam? O que os paralisa?
- **Aspiracoes:** Onde querem chegar? Como se veem no futuro?

### 2. Fontes de Evidencia
- Linguagem usada em reviews/comentarios (o que dizem espontaneamente)
- Conteudo que mais engaja (o que compartilham/salvam)
- Objecoes de vendas (o que impede a decisao)
- Perguntas frequentes (o que precisam saber)
- Influenciadores que seguem (quem admiram)

### 3. Pattern Matching
- Que padroes emergem entre diferentes fontes?
- Ha sub-grupos psicograficos distintos?
- Contradicoes entre o que dizem e o que fazem?

### 4. Implicacoes Praticas
- Para CONTEUDO: que tom/angulo/temas ressoam?
- Para COPY: que gatilhos emocionais usar?
- Para PRODUTO: que features priorizar?
- Para VENDAS: que argumentos convencem?

## Saida
- Perfil psicografico documentado (valores, motivacoes, medos, aspiracoes)
- Evidencias que suportam cada conclusao
- Implicacoes praticas por area (content, copy, produto, vendas)

## Validacao
- [ ] Valores predominantes identificados
- [ ] Motivacoes e medos mapeados
- [ ] Evidencias citadas para cada conclusao
- [ ] Implicacoes praticas por area definidas

---

*Task operada por: audience-intelligence (Pulse)*
