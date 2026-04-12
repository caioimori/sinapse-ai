---
task: analyze-social-listening
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

# Task: Analyze Social Listening

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** STANDARD
- **Depends on:** dados de social listening
- **Feeds:** build-audience-persona, content-intelligence/Radar

## Objetivo
Sintetizar dados de social listening para extrair insights sobre percepcao, sentimento, linguagem e necessidades nao-articuladas da audiencia.

## Entrada
- Dados de social listening (mencoes, hashtags, reviews, forums)
- Topicos/keywords a monitorar
- Contexto: marca, produto, setor

## Passos

### 1. Definir Escopo de Escuta
- **Owned:** mencoes diretas da marca
- **Earned:** conversas sobre o setor/categoria
- **Competitor:** mencoes de concorrentes
- Plataformas: Instagram, Twitter/X, LinkedIn, Reddit, forums, reviews

### 2. Analise de Volume & Sentimento
- Volume de mencoes por periodo
- Sentimento: POSITIVO | NEUTRO | NEGATIVO (proporção)
- Picos: o que causou aumento/queda?
- Tendencia: sentimento melhorando ou piorando?

### 3. Analise de Temas
- Temas mais frequentes (topic clustering)
- Temas com sentimento mais positivo
- Temas com sentimento mais negativo
- Temas emergentes (novos, crescendo)

### 4. Analise de Linguagem
- Palavras e expressoes que a audiencia usa naturalmente
- Como descrevem o problema (vs como a marca descreve)
- Jargao do publico vs jargao da marca → gap de linguagem
- Verbatims mais representativos (para uso em copy e conteudo)

### 5. Necessidades Nao-Articuladas
- O que reclamam sem saber que e uma feature request?
- Que compensating behaviors revelam gaps?
- O que desejam mas nao sabem que existe?

### 6. Insights & Implicacoes
- Para MARCA: percepcao vs posicionamento pretendido
- Para CONTEUDO: temas e linguagem que ressoam
- Para PRODUTO: features demandadas, frustrações
- Para VENDAS: objecoes publicas, recomendacoes

## Saida
- Relatorio de social listening com volume, sentimento, temas
- Verbatims representativos curados
- Gap de linguagem (marca vs audiencia)
- Insights acionaveis por area

## Validacao
- [ ] Volume e sentimento analisados
- [ ] Temas clusterizados
- [ ] Linguagem da audiencia extraida
- [ ] Insights conectados a acoes

---

*Task operada por: audience-intelligence (Pulse)*
