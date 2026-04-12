---
task: analyze-audience-behavior
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

# Task: Analyze Audience Behavior

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** STANDARD
- **Depends on:** dados de analytics/CRM
- **Feeds:** segment-audience, build-audience-persona

## Objetivo
Analisar padroes comportamentais da audiencia — como navegam, consomem, compram e interagem — para informar estrategia de conteudo, produto e vendas.

## Entrada
- Dados de analytics (web, app, social)
- Dados de CRM (interacoes, historico)
- Dados de plataformas (engagement, retention)

## Passos

### 1. Comportamento de Consumo de Conteudo
- Que formatos consomem mais? (video, texto, audio, visual)
- Que temas geram mais engajamento?
- Quando consomem? (dia da semana, horario)
- Quao profundo consomem? (scroll depth, watch time, bounce rate)
- Que CTA gera mais acao?

### 2. Comportamento de Compra
- Ciclo medio de decisao (primeiro contato → compra)
- Touchpoints tipicos na jornada
- Trigger de compra (o que dispara a decisao)
- Barreiras de compra (o que impede)
- Upsell/cross-sell patterns

### 3. Comportamento Social
- Compartilham? O que? Em que canal?
- Comentam? Que tipo de conteudo provoca comentario?
- Salvam? Que tipo de conteudo salva?
- Recomendam? Para quem? Como?
- Reclamam? Sobre o que? Onde?

### 4. Pattern Detection
- Segmentos comportamentais distintos?
- Sazonalidade (padroes por periodo)?
- Correlacoes (ex: quem consome X compra Y)
- Anomalias (comportamentos inesperados)

### 5. Insights Acionaveis
- Para CONTEUDO: otimizar formato, timing, tema
- Para PRODUTO: priorizar features por uso real
- Para VENDAS: adaptar approach ao comportamento
- Para RETENCAO: prevenir churn por sinais de comportamento

## Saida
- Analise comportamental com patterns identificados
- Segmentos comportamentais (se aplicavel)
- Insights acionaveis por area

## Validacao
- [ ] 3 dimensoes analisadas (consumo, compra, social)
- [ ] Patterns identificados com dados
- [ ] Insights conectados a acoes concretas

---

*Task operada por: audience-intelligence (Pulse)*
