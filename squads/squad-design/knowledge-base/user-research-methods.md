# User Research Methods

## Taxonomia de Metodos

### Por Objetivo
| Tipo | Objetivo | Quando Usar |
|------|----------|------------|
| **Generativo** | Descobrir necessidades, gerar ideias | Inicio do projeto, discovery |
| **Avaliativo** | Testar solucoes, validar decisoes | Durante e apos design |
| **Exploratorio** | Entender contexto, mapear comportamentos | Pre-projeto, rebrief |

### Por Natureza
| Tipo | O que Revela | Exemplo |
|------|-------------|---------|
| **Qualitativo** | O PORQUE (motivacoes, emocoes, contexto) | Entrevistas, observacao |
| **Quantitativo** | O QUANTO (frequencia, volume, estatistica) | Surveys, analytics, A/B tests |

## Metodos Detalhados

### 1. Entrevistas em Profundidade
- **Quando:** Discovery, entender motivacoes, explorar comportamentos
- **Participantes:** 5-8 por segmento (saturacao em ~5-6)
- **Duracao:** 30-60 minutos
- **Formato:** Semi-estruturada (roteiro + flexibilidade)
- **Perguntas:**
  - Abertas: "Me conte sobre a ultima vez que..."
  - Follow-up: "O que voce quis dizer com...?"
  - NUNCA: "Voce gostaria de...?" (leading question)
- **Output:** Notas, quotes, themes, insight cards

### 2. Usability Testing
- **Quando:** Validar design, encontrar problemas de usabilidade
- **Participantes:** 5 por rodada (Nielsen: 5 encontram 85% dos problemas)
- **Tipos:**
  - Moderado (facilitador presente) — mais insights, mais caro
  - Nao-moderado (remoto, async) — mais escala, menos contexto
  - Guerrilla (informal, rapido) — validacao rapida, menos rigor
- **Metricas:**
  - Task completion rate (alvo: > 80%)
  - Time on task
  - Error rate
  - System Usability Scale (SUS) — score de 68+ = acima da media
- **Protocolo:**
  1. Boas-vindas e consentimento
  2. Warm-up questions
  3. Tasks (3-5 cenarios realistas)
  4. Post-task questions (dificuldade percebida)
  5. Post-session interview (impressoes gerais)
  6. Debrief

### 3. Card Sorting
- **Quando:** Definir arquitetura de informacao, categorias, navegacao
- **Tipos:**
  - Aberto: Participante cria as categorias
  - Fechado: Categorias pre-definidas, participante organiza
  - Hibrido: Categorias sugeridas + criacao livre
- **Participantes:** 15-30 (quantitativo para analise de clusters)
- **Ferramentas:** Optimal Workshop, UserZoom, post-its fisicos
- **Analise:** Dendrograma, similarity matrix, agreement percentage

### 4. Tree Testing
- **Quando:** Validar IA sem influencia visual
- **O que testa:** Se usuarios encontram conteudo na estrutura proposta
- **Participantes:** 50+ (quantitativo)
- **Metricas:**
  - Success rate: % que encontrou o item correto
  - Directness: % que foi direto (sem backtracking)
  - Time to complete
- **Ferramenta:** Optimal Workshop Treejack

### 5. Surveys / Questionarios
- **Quando:** Quantificar preferencias, medir satisfacao, demograficos
- **Participantes:** 100+ (para significancia estatistica)
- **Boas praticas:**
  - Max 10-15 perguntas (completion rate cai apos 15)
  - Mix de fechadas + 1-2 abertas
  - Escala Likert 5 pontos (consistencia)
  - Sem leading questions
  - Testar com 5 pessoas antes de enviar
- **Tipos padrao:**
  - NPS (Net Promoter Score): "De 0-10, quanto recomendaria?"
  - SUS (System Usability Scale): 10 itens padrao
  - CSAT (Customer Satisfaction): Satisfacao por interacao

### 6. Analytics / Dados Comportamentais
- **Quando:** Entender o que FAZEM (nao o que dizem)
- **Metricas chave:**
  - Page views, bounce rate, session duration
  - Click maps, scroll depth, rage clicks
  - Funnel analysis (drop-off points)
  - User flow paths
- **Ferramentas:** Google Analytics, Hotjar, FullStory, Mixpanel
- **Limitacao:** Mostra O QUE, nao O PORQUE — combinar com qualitativo

### 7. A/B Testing
- **Quando:** Validar variacao de design com dados estatisticos
- **Requisitos:** Trafego suficiente (calculadora de sample size)
- **Regras:**
  - Testar UMA variavel por vez
  - Significancia estatistica antes de conclusao (p < 0.05)
  - Durar pelo menos 1 ciclo de negocio (7+ dias)
- **O que testar:** CTAs, headlines, layouts, cores, copy

### 8. Diary Studies
- **Quando:** Entender comportamentos ao longo do TEMPO
- **Duracao:** 1-4 semanas
- **Participantes:** 5-15
- **Formato:** Diario digital (fotos, textos, audio) em momentos especificos
- **Output:** Padroes temporais, contextos de uso, emocoes ao longo do tempo

## Matriz de Selecao de Metodo

| Pergunta de Pesquisa | Metodo Recomendado | Participantes |
|---------------------|-------------------|---------------|
| "Quais sao as necessidades dos usuarios?" | Entrevistas | 5-8 |
| "Os usuarios conseguem completar a tarefa?" | Usability testing | 5 |
| "Como organizar a navegacao?" | Card sorting + Tree testing | 15-50 |
| "Quantos preferem A vs B?" | Survey + A/B test | 100+ |
| "Onde usuarios desistem?" | Analytics + Funnel | N/A |
| "Como e o uso no dia-a-dia?" | Diary study | 5-15 |
| "O que competitors fazem?" | Competitive analysis | N/A |

## Synthesis Frameworks

### Affinity Diagramming
1. Escrever cada observacao em um post-it (ou card digital)
2. Agrupar por similaridade (bottom-up)
3. Nomear clusters
4. Identificar themes e patterns
5. Priorizar por frequencia e impacto

### Insight Crystallization
```
Observacao → "Notamos que usuarios fazem X"
Insight → "Porque eles precisam de Y"
Opportunity → "Poderiamos oferecer Z"
```

### Jobs-to-be-Done (JTBD)
```
Quando [situacao], eu quero [motivacao], para que [resultado esperado]
```

## Referencias
- Steve Portigal — Interviewing Users
- Jeff Sauro — Quantifying the User Experience
- Erika Hall — Just Enough Research
- David Travis — Think Like a UX Researcher
