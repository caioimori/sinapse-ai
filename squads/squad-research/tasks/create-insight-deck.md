---
task: create-insight-deck
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

# Task: Create Insight Deck

## Metadata
- **Squad:** squad-research
- **Agent:** data-synthesizer (Loom)
- **Complexity:** STANDARD
- **Depends on:** synthesize-research-report
- **Feeds:** @project-lead, commercial-systems

## Objetivo
Criar deck de apresentacao com insights de pesquisa — visual-first, um insight por slide, otimizado para comunicacao executiva.

## Entrada
- Relatorio de pesquisa sintetizado
- Audiencia da apresentacao
- Tempo disponivel (5min / 15min / 30min)

## Passos

### 1. Definir Estrutura por Tempo
- **5 min (5-7 slides):** Thesis + 3 insights + recomendacao + next steps
- **15 min (12-15 slides):** + contexto + dados de suporte + appendix
- **30 min (20-25 slides):** + analise detalhada + cenarios + discussao
- Cada slide = 1 ideia, 1 visual, 1 takeaway

### 2. Design de Slides (Principios Tufte)
- **Data-ink ratio:** Maximizar informacao, minimizar decoracao
- **Chartjunk:** Zero elementos puramente decorativos
- **Headline:** Cada slide com headline que e o INSIGHT (nao descritivo)
  - Ruim: "Market Size Analysis"
  - Bom: "Market growing 23% YoY with gap in mid-market"
- **Visual:** 1 grafico/visual por slide que PROVA o headline

### 3. Selecao de Visualizacoes
- Comparacao → Bar chart (horizontal para muitas categorias)
- Tendencia → Line chart (maximo 4 linhas)
- Composicao → Stacked bar ou pie (max 5 segmentos)
- Relacao → Scatter plot ou bubble chart
- Distribuicao → Histogram ou box plot
- Processo → Flow diagram ou timeline
- Evitar: 3D charts, dual axes, pie charts com muitos segmentos

### 4. Narrative Arc do Deck
- Slide 1: Titulo + thesis statement
- Slides 2-3: Contexto e escopo
- Slides 4-N: Insights (um por slide, ordenados por impacto)
- Slide N+1: Sintese cruzada ("connecting the dots")
- Slide N+2: Recomendacoes priorizadas
- Slide N+3: Next steps com owners e timeline
- Appendix: Dados de suporte, metodologia, fontes

### 5. Review de Qualidade
- Teste do "glance": insight claro em 3 segundos?
- Teste da "autonomia": slides fazem sentido sem apresentador?
- Teste do "so what": cada slide responde "e dai?"
- Consistencia visual (cores, fonts, layout)

## Saida
- Deck structure com outline de cada slide
- Headlines de insight por slide
- Recomendacoes de visualizacao por dado
- Narrative arc do deck completo

## Validacao
- [ ] 1 insight por slide
- [ ] Headlines sao insights (nao descritivos)
- [ ] Visualizacoes apropriadas selecionadas
- [ ] Narrative arc coerente
- [ ] Tufte principles aplicados
- [ ] Adaptado ao tempo disponivel

---

*Task operada por: data-synthesizer (Loom)*
