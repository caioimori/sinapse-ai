---
task: design-survey
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

# Task: Design Survey

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** STANDARD
- **Depends on:** pergunta de pesquisa definida
- **Feeds:** validate-persona-with-data, analyze-audience-psychographics

## Objetivo
Desenhar survey de pesquisa com metodologia robusta — perguntas claras, escala adequada, sem vieses, e analise planejada antes de coletar.

## Entrada
- Objetivo da survey (que perguntas responder)
- Audiencia-alvo
- Canal de distribuicao (email, social, in-app, presencial)

## Passos

### 1. Definir Objetivo
- 1-3 perguntas de pesquisa que a survey deve responder
- Que decisao depende das respostas?
- Que dado MUDARIA a decisao?

### 2. Design de Perguntas
- **Regra de ouro:** max 15 perguntas (ideal: 8-12)
- **Tipos:**
  - Escala Likert (1-5 ou 1-7): para atitudes/satisfacao
  - Multipla escolha: para categorias definidas
  - NPS (0-10): para lealdade
  - Aberta: max 2-3, para insights qualitativos
  - Ranking: para priorizacao
- **Anti-padroes:**
  - Pergunta dupla ("voce gosta de X e Y?") → separar
  - Leading question ("nao concorda que...?") → neutro
  - Jargao tecnico → linguagem do respondente
  - Escala ambigua ("bom" vs "muito bom") → ancorar

### 3. Estrutura do Questionario
- **Abertura:** Contexto + tempo estimado + privacidade
- **Aquecimento:** 1-2 perguntas faceis (demograficas ou filtro)
- **Core:** Perguntas principais (da mais facil pra mais reflexiva)
- **Deep dive:** Perguntas qualitativas (abertas)
- **Fechamento:** Agradecimento + opcional "quer ser contatado?"
- **Logica condicional:** pular perguntas irrelevantes baseado em respostas

### 4. Amostra & Distribuicao
- **Tamanho minimo:** depende da populacao e margem de erro
  - Populacao < 100: censar (todos)
  - Populacao 100-1000: min 30% ou 100 respostas
  - Populacao 1000+: min 384 para 95% confianca, 5% margem
- **Canal:** email (melhor taxa), in-app (contextual), social (alcance)
- **Incentivo:** necessario? Que tipo? (cuidado com vies de incentivo)

### 5. Plano de Analise (ANTES de coletar)
- Para cada pergunta: que analise fara?
- Cruzamentos planejados (ex: resposta × segmento)
- Threshold de significancia (se quantitativo)
- O que fara se resultado for X vs Y?

### 6. Teste Piloto
- Testar com 5-10 pessoas antes de lancar
- Verificar: tempo real, perguntas confusas, logica quebrada
- Ajustar baseado no piloto

## Saida
- Questionario completo pronto para aplicacao
- Plano de amostragem
- Plano de analise
- Instrucoes de distribuicao

## Validacao
- [ ] Max 15 perguntas
- [ ] Zero leading questions ou perguntas duplas
- [ ] Plano de analise definido ANTES de coletar
- [ ] Teste piloto realizado
- [ ] Tamanho de amostra adequado

---

*Task operada por: audience-intelligence (Pulse)*
