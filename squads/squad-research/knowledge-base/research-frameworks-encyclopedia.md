# Research Frameworks Encyclopedia

## Frameworks de Analise Competitiva

### Porter's Five Forces
- **Quando usar:** Avaliar atratividade e dinamica competitiva de uma industria
- **Como aplicar:** Analisar cada forca (1-5): poder de fornecedores, compradores, ameaca de substitutos, ameaca de novos entrantes, rivalidade
- **Output:** Score por forca + implicacoes estrategicas
- **Erros comuns:** Ignorar substitutos indiretos, confundir competidores com fornecedores
- **Referencia:** Michael Porter, "Competitive Strategy" (1980)

### Blue Ocean Strategy / ERRC Canvas
- **Quando usar:** Buscar mercados nao contestados, diferenciacao radical
- **Como aplicar:** ERRC — Eliminate (o que eliminar), Reduce (reduzir), Raise (elevar), Create (criar)
- **Output:** Strategy canvas comparativo + ERRC canvas
- **Erros comuns:** Ignorar execution risk, assumir que blue ocean = sem competicao
- **Referencia:** Kim & Mauborgne, "Blue Ocean Strategy" (2005)

### SWOT / TOWS
- **Quando usar:** Assessment estrategico cruzando interno × externo
- **Como aplicar:** S/W (interno) × O/T (externo) → cruzar S×O, W×T, S×T, W×O
- **Output:** Matriz SWOT + estrategias TOWS
- **Erros comuns:** Confundir interno/externo, listar sem priorizar, sem evidencia

## Frameworks de Mercado

### TAM/SAM/SOM
- **Quando usar:** Dimensionar mercado para investidores, planejamento
- **Como aplicar:** TAM (total) → SAM (serviceable) → SOM (obtainable). Dual: top-down + bottom-up
- **Output:** 3 valores com metodologia e confidence
- **Erros comuns:** TAM inflado, SOM otimista demais, ignorar substitutos
- **Referencia:** Usado universalmente em VC/PE

### PESTEL Analysis
- **Quando usar:** Mapear macro forces que afetam mercado/industria
- **Como aplicar:** P(olitical), E(conomic), S(ocial), T(echnological), E(nvironmental), L(egal)
- **Output:** Scoring por forca (impacto × velocidade)
- **Erros comuns:** Listar sem priorizar, ignorar interacoes entre forcas

## Frameworks de Audiencia

### Jobs to Be Done (JTBD)
- **Quando usar:** Entender necessidades reais dos clientes (alem de features)
- **Como aplicar:** "When [situation], I want to [job], so I can [outcome]"
- **Output:** Job statements com outcomes mensuráveis
- **Erros comuns:** Confundir job com solution, ignorar jobs emocionais/sociais
- **Referencia:** Christensen, "Competing Against Luck" (2016)

### Value Proposition Canvas
- **Quando usar:** Alinhar produto com necessidades do cliente
- **Como aplicar:** Customer Profile (jobs, pains, gains) × Value Map (products, pain relievers, gain creators)
- **Output:** Canvas visual com fit analysis
- **Erros comuns:** Focar em gains sem resolver pains, assumir jobs sem validar
- **Referencia:** Osterwalder, "Value Proposition Design" (2014)

## Frameworks de Tendencias

### Scenario Planning (Schwartz)
- **Quando usar:** Planejar para futuros incertos
- **Como aplicar:** 2 incertezas criticas → 2x2 → 4 cenarios nomeados com narrativas
- **Output:** Matriz de cenarios + early indicators + wind tunneling
- **Erros comuns:** Cenarios sem narrativa, sem early indicators, sem test de estrategia
- **Referencia:** Schwartz, "The Art of the Long View" (1991)

### Technology Adoption Lifecycle
- **Quando usar:** Avaliar maturidade de adocao tecnologica
- **Como aplicar:** Rogers (5 segments) + Moore (Chasm) + Gartner (Hype Cycle)
- **Output:** Positioning da tecnologia + crossing strategy
- **Erros comuns:** Assumir adocao linear, ignorar o chasm
- **Referencia:** Rogers (1962), Moore (1991), Gartner (ongoing)

### Gartner Hype Cycle
- **Quando usar:** Posicionar tecnologias na curva de expectativas
- **5 fases:** Trigger → Peak of Inflated Expectations → Trough of Disillusionment → Slope of Enlightenment → Plateau of Productivity
- **Erros comuns:** Tomar como previsao exata, ignorar que velocidade varia

## Frameworks de Comunicacao

### Pyramid Principle (Minto)
- **Quando usar:** Estruturar qualquer comunicacao de pesquisa
- **Como aplicar:** Comece pela conclusao → suporte com argumentos → suporte com dados
- **Output:** Documento estruturado top-down
- **Erros comuns:** Comecar pelos dados (bottom-up), enterrar a conclusao
- **Referencia:** Minto, "The Pyramid Principle" (1987)

### MECE Principle (McKinsey)
- **Quando usar:** Estruturar qualquer framework de analise
- **Como aplicar:** Categorias Mutually Exclusive (sem overlap), Collectively Exhaustive (sem gap)
- **Output:** Framework de categorias limpo e completo
- **Erros comuns:** Overlap entre categorias, gaps nao identificados

## Frameworks de Redes e Comunidades

### Barabasi-Albert Model (Scale-Free Networks)
- **Quando usar:** Analisar como influencia e informacao se distribuem em redes sociais e mercados
- **Como aplicar:** Identificar hubs (nos com muitas conexoes), mapear mecanismo de preferential attachment
- **Output:** Mapa de influencia + identificacao de hubs estrategicos
- **Insight-chave:** Poucos nos concentram a maioria das conexoes — atacar/ativar hubs tem ROI desproporcional
- **Referencia:** Barabasi, "Linked" (2002)

### Granovetter's Weak Ties Theory
- **Quando usar:** Entender como informacao/inovacao se propaga entre grupos
- **Como aplicar:** Mapear bridges entre comunidades (lacos fracos) vs. densidade intra-grupo (lacos fortes)
- **Output:** Mapa de difusao de informacao + identificacao de bridges estrategicos
- **Insight-chave:** Lacos fracos (conhecidos) difundem informacao nova; lacos fortes a mantêm dentro do grupo
- **Referencia:** Granovetter, "The Strength of Weak Ties" (1973)

### Network Effects Framework (Metcalfe/Reed/Chen)
- **Quando usar:** Avaliar moat competitivo de plataformas; dimensionar potencial de crescimento
- **Como aplicar:** Classificar tipo de network effect → estimar intensidade → avaliar posicao no ciclo
- **Metcalfe's Law:** V = n^2 (conexoes diáticas)
- **Reed's Law:** V = 2^n (redes que formam grupos — limite teorico)
- **Chen's Death Spiral:** Saida de usuarios → rede menos valiosa → mais saidas → colapso
- **Referencia:** Ver `network-effects-analysis.md` para tratamento completo

## Frameworks de Knowledge Management

### GraphRAG (Microsoft Research)
- **Quando usar:** Research que requer raciocinio estruturado + cobertura semantica
- **Como aplicar:** Construir knowledge graph sobre corpus → retrieval hibrido (graph + embeddings)
- **Output:** Respostas com evidencia estrutural (grafo) + cobertura semantica (vetorial)
- **Vantagem:** Faithfulness superior ao RAG puro; tracabilidade de evidencias
- **Referencia:** Ver `knowledge-graph-construction.md` e `hybrid-retrieval-patterns.md`

### Zettelkasten (Luhmann)
- **Quando usar:** Gerenciar corpus de pesquisa de longo prazo, conectar ideias ao longo do tempo
- **Como aplicar:** 1 ideia = 1 nota; notas se ligam por relacoes explicitas (nao apenas tags)
- **Output:** Rede de conhecimento onde insights emergem das conexoes
- **Insight-chave:** Com 90,000 fichas interconectadas, Luhmann produziu 70 livros e 400 artigos
- **Referencia:** Ver `knowledge-graph-construction.md`

---

*Knowledge base da squad-research*
