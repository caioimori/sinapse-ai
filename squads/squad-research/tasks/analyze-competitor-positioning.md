---
task: analyze-competitor-positioning
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

# Task: Analyze Competitor Positioning

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** STANDARD
- **Depends on:** map-competitive-landscape
- **Feeds:** create-battle-card, brand-system/Athena

## Objetivo
Analisar posicionamento de competidor especifico em profundidade — messaging, target, proposta de valor, diferenciais reais vs declarados.

## Entrada
- Competidor a analisar
- Contexto: por que analisar este competidor especificamente

## Passos

### 1. Messaging Analysis
- Headline do site: que promessa fazem?
- Tagline/slogan: como se descrevem?
- About page: que historia contam?
- Vocabulario: que palavras usam repetidamente?
- Tom: formal? casual? tecnico? inspiracional?

### 2. Target Analysis
- Para quem falam? (dados do site, social, testimonials)
- Que persona aparece em cases/testimonials?
- Que dor resolvem (pelo discurso deles)?
- Que segmentos ignoram?

### 3. Proposta de Valor
- Valor declarado: o que DIZEM que entregam
- Valor percebido: o que clientes DIZEM que recebem (reviews)
- Gap: diferenca entre declarado e percebido
- Features vs benefits: focam em features ou outcomes?

### 4. Diferenciais
- O que DIZEM que os diferencia?
- E diferencial REAL ou table stakes disfarçado?
- Teste: se tirasse o nome, saberia que e deles? (Neumeier's Onlyness Test)
- Diferenciais que nos nao temos
- Diferenciais que nos temos e eles nao

### 5. Percepcao de Mercado
- Reviews (G2, Capterra, Google, Reclame Aqui) — sentimento geral
- Social: como falam sobre eles?
- Press: como midia cobre eles?
- Employer brand: como funcionarios avaliam (Glassdoor)

### 6. Implicacoes para Nos
- Onde somos SUPERIORES? (explorar)
- Onde somos INFERIORES? (mitigar ou evitar comparacao)
- Onde somos IGUAIS? (nao gastar energia aqui)
- Recomendacao de counter-positioning

## Saida
- Analise de posicionamento do competidor
- Diferenciais reais vs declarados
- Gaps entre discurso e percepcao
- Implicacoes e counter-positioning para nos

## Validacao
- [ ] Messaging analisado com evidencias
- [ ] Target identificado
- [ ] Diferenciais reais vs declarados separados
- [ ] Percepcao de mercado incluida
- [ ] Counter-positioning recomendado

---

*Task operada por: competitive-intelligence (Hawk)*
