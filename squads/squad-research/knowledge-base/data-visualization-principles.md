# Data Visualization Principles

## Principios de Tufte

### Data-Ink Ratio
- **Regra:** Maximizar a proporcao de tinta usada para dados vs tinta total
- **Pratica:** Remover gridlines desnecessarias, borders, backgrounds, 3D effects
- **Teste:** Se remover um elemento e o dado continua claro → remover

### Chartjunk
- **O que evitar:** Sombras, gradientes, 3D, texturas decorativas, clip art
- **Resultado:** Graficos limpos onde o DADO e o protagonista

### Small Multiples
- **Quando usar:** Comparar a mesma metrica em muitas categorias
- **Como:** Repetir o mesmo grafico em grid, variando apenas os dados
- **Vantagem:** Comparacao visual rapida

### Lie Factor
- **Formula:** (Tamanho do efeito visual) / (Tamanho do efeito nos dados)
- **Ideal:** Lie factor = 1.0 (representacao proporcional)
- **Problemas comuns:** Y-axis nao comecando em 0, area vs raio em bubbles

## Chart Selection Matrix

| Objetivo | 1 Variavel | 2 Variaveis | 3+ Variaveis |
|----------|:----------:|:-----------:|:------------:|
| **Comparar** | Bar (horizontal) | Grouped bar | Small multiples |
| **Tendencia** | Sparkline | Line | Multi-line (max 4) |
| **Composicao** | Pie (max 5 fatias) | Stacked bar | Treemap |
| **Relacao** | — | Scatter | Bubble |
| **Distribuicao** | Histogram | Box plot | Violin |
| **Fluxo** | — | Sankey | Network |
| **Geo** | Choropleth | — | Multi-layer map |

## Paletas de Cores

### Sequential (dados ordenados)
- Claro → Escuro (mesma hue, variando luminosidade)
- Uso: valores crescentes, concentracao, intensidade

### Diverging (dados com centro)
- Cor A → Neutro → Cor B (ex: azul → branco → vermelho)
- Uso: desvio da media, positivo/negativo, acima/abaixo target

### Categorical (sem ordem)
- Cores distintas e balanceadas
- Max 7 categorias (alem disso, agrupar em "Outros")
- Uso: segmentos, tipos, grupos

### Accessibility
- Testar com simulador de daltonismo
- Nao depender APENAS de cor — usar forma, pattern, label
- Contraste minimo 4.5:1 para texto

## Erros Comuns

| Erro | Problema | Solucao |
|------|----------|---------|
| Y-axis truncado | Exagera diferenças | Comecar em 0 ou indicar claramente |
| Pie chart com 10+ fatias | Ilegivel | Usar bar chart |
| 3D charts | Distorce proporcoes | Sempre 2D |
| Dual Y-axis | Confunde e pode ser manipulativo | 2 charts separados |
| Rainbow palette | Nao tem ordem logica | Usar sequential/diverging |
| Sem titulo ou fonte | Contexto perdido | Sempre incluir |

## Dashboard Design Principles
1. **Information hierarchy:** Mais importante no topo-esquerda
2. **Consistent layout:** Grid uniforme, alinhamento
3. **Filter first:** Permitir drill-down, nao sobrecarregar
4. **One KPI per card:** Nao misturar metricas em um visual
5. **Context:** Sempre mostrar benchmark, target, ou periodo anterior

---

*Knowledge base da squad-research*
