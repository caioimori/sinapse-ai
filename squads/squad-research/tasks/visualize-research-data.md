---
task: visualize-research-data
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

# Task: Visualize Research Data

## Metadata
- **Squad:** squad-research
- **Agent:** data-synthesizer (Loom)
- **Complexity:** STANDARD
- **Depends on:** dados coletados
- **Feeds:** content-intelligence, digital-experience

## Objetivo
Criar visualizacoes de dados que comunicam findings de pesquisa com clareza — seguindo principios de Tufte e melhores praticas de data visualization.

## Entrada
- Dados quantitativos e qualitativos de pesquisa
- Contexto de uso (relatorio, deck, dashboard, infografico)
- Audiencia das visualizacoes

## Passos

### 1. Classificar Tipo de Dado
- **Categorico:** segmentos, tipos, grupos → bar, treemap
- **Temporal:** evolucao, tendencia → line, area
- **Proporcional:** partes do todo → pie (max 5), stacked bar
- **Relacional:** correlacao entre variaveis → scatter, bubble
- **Geografico:** distribuicao por regiao → mapa
- **Hierarquico:** niveis de detalhe → treemap, sunburst
- **Fluxo:** processos, jornadas → Sankey, flow

### 2. Selecionar Visualizacao (Chart Selection Matrix)

| Objetivo | 1 Variavel | 2 Variaveis | 3+ Variaveis |
|----------|:----------:|:-----------:|:------------:|
| Comparar | Bar | Grouped bar | Small multiples |
| Tendencia | Sparkline | Line | Multi-line |
| Composicao | Pie/donut | Stacked bar | Treemap |
| Relacao | — | Scatter | Bubble |
| Distribuicao | Histogram | Box plot | Violin |

### 3. Aplicar Principios de Tufte
- **Data-ink ratio:** Remover TUDO que nao e dado
- **Chartjunk:** Zero 3D, sombras, gradientes decorativos
- **Small multiples:** Usar quando comparar muitas categorias
- **Lie factor:** Proporcao visual = proporcao real dos dados
- **Sparklines:** Para dados inline em texto

### 4. Design de Cores
- **Sequential:** Para dados ordenados (claro → escuro)
- **Diverging:** Para dados com ponto central (azul → branco → vermelho)
- **Categorical:** Para categorias sem ordem (paleta distinta)
- **Accessibility:** Testar para daltonismo (usar forma + cor)
- **Highlight:** Usar cor para chamar atencao ao insight principal

### 5. Annotation e Context
- Titulo que e o INSIGHT (nao descricao do grafico)
- Anotacoes em pontos-chave (eventos, inflexoes)
- Fonte dos dados e periodo
- Baseline/benchmark para comparacao
- Call-out box para o numero mais importante

## Saida
- Especificacoes de visualizacao por dataset
- Tipo de chart recomendado com justificativa
- Paleta de cores definida
- Annotations e contexto mapeados

## Validacao
- [ ] Tipo de visualizacao adequado ao dado
- [ ] Principios de Tufte aplicados
- [ ] Cores acessiveis (colorblind-safe)
- [ ] Titulo e insight (nao descricao)
- [ ] Fonte e periodo indicados
- [ ] Lie factor = 1 (proporcao correta)

---

*Task operada por: data-synthesizer (Loom)*
