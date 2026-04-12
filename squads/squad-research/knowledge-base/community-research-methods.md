# Community Research Methods

> Extraído e sintetizado de MS-010 Forum & Community Platform Engineering (2026) — análise de Reddit, Discord, Stack Overflow, Discourse e outras plataformas com dados de 2025-2026.

## Fundamentos Teóricos

### Barabási-Albert Model (Redes Scale-Free)
Redes sociais reais não são aleatórias — seguem power-law degree distributions onde poucos nós (hubs) têm vastamente mais conexões que a maioria.

**Dois mecanismos:**
1. **Growth:** Redes adicionam continuamente novos nós
2. **Preferential attachment:** Novos nós preferem conectar a nós já bem conectados ("rich-get-richer")

**Distribuição:** P(k) ~ k^(-gamma), tipicamente gamma entre 2 e 3.

**Aplicação em research:** Identifique os hubs de uma comunidade/mercado — eles movem informação e opinião de forma desproporcional. Em análise competitiva, os "subreddits hub" são pontes entre clusters de usuários.

### Granovetter: Força dos Laços Fracos (1973)
Paradoxo fundamental: **laços fracos (conhecidos) são mais valiosos que laços fortes (amigos íntimos)** para difusão de informação.

**Por quê:** Laços fortes clusters dentro de grupos densos onde todos compartilham a mesma informação. Laços fracos fazem ponte entre clusters, permitindo que informação nova flua.

**Duas hipóteses centrais:**
1. Laços fortes se concentram em grupos densamente conectados
2. Grupos são conectados por laços fracos esparsos — vitais para difusão

**Aplicação em research:** Para entender como uma ideia/tendência se propaga, mapeie os laços fracos (bridges entre comunidades), não apenas os laços fortes (influenciadores dentro de uma comunidade).

## Network Effects: Taxonomia para Pesquisa

| Tipo | Definição | Exemplo para Pesquisa |
|------|-----------|----------------------|
| **Direct** | Mais usuários = mais valor para todos | Mais usuários de uma plataforma = mais dados para análise |
| **Indirect** | Mais usuários atraem bens complementares | Mais usuários = mais criadores de conteúdo a monitorar |
| **Cross-side** | Grupo A beneficia Grupo B | Mais compradores = mais vendedores a estudar |
| **Same-side** | Grupo beneficia a si mesmo | Mais respondentes = pesquisa mais representativa |
| **Data** | Mais uso = algoritmos melhores | Mais buscas = melhores insights de intenção |
| **Local** | Network effects dentro de sub-clusters | Comunidade de nicho tem mais relevância que plataforma geral |

## Leis Matemáticas de Redes

### Metcalfe's Law
**V = n²** (onde V = valor da rede, n = usuários)

- Facebook: revenue ao longo de uma década seguiu curva n-squared
- Implicação para research: uma plataforma com 2x os usuários tem potencialmente 4x o valor como fonte de dados/insights
- **Limitação:** Assume todas as conexões igualmente valiosas — raramente verdade

### Reed's Law
**V = 2^n** (redes que formam grupos)

- Plataformas que suportam grupos (Discord servers, Facebook Groups, Slack) capturam mais valor
- Função como limite teórico superior — nunca observado completamente na prática
- **Implicação para research:** Plataformas com sub-comunidades têm mais pontos de pesquisa que plataformas com conexões apenas diáticas

### Andrew Chen's Death Spiral
Network effects funcionam em ambas as direções. Se usuários saem, a rede perde valor → mais usuários saem → aceleração do declínio.

**Implicação para research:** Monitorar saúde de comunidades é crítico. Métricas de saída antecipam declínio antes que seja evidente nos dados de crescimento.

## Social Graph Analysis em Prática

### Modelos de Grafo por Plataforma

| Plataforma | Modelo de Grafo | Característica-Chave |
|------------|----------------|---------------------|
| Reddit | Bipartite (usuários ↔ subreddits) | Routing de conteúdo por assinatura |
| Discord | Hierárquico (servers → categories → channels) | Controle de acesso por role |
| Stack Overflow | Tripartite (usuários ↔ perguntas ↔ tags) | Clustering de expertise por tag |
| LinkedIn | Degrees of connection (1st, 2nd, 3rd) | Alcance profissional por grau |
| Twitter/X | Directed (follow) + Undirected (mentions) | Influência assimétrica |

### Algoritmos de Detecção de Comunidade
- **Louvain Method:** Detecta clusters por maximização de modularidade — bom para comunidades grandes
- **Label Propagation:** Rápido e escalável — cada nó adota label mais comum de seus vizinhos
- **Girvan-Newman:** Remove arestas de maior betweenness progressivamente — revela hierarquia de comunidades

### Métricas de Grafo para Research

| Métrica | O Que Indica | Uso em Research |
|---------|-------------|-----------------|
| **Degree Centrality** | Quantas conexões diretas um nó tem | Identificar influenciadores/hubs |
| **Betweenness Centrality** | Quantas vezes um nó está no caminho entre outros | Identificar brokers de informação |
| **Closeness Centrality** | Distância média para todos os outros nós | Identificar nós com acesso rápido à rede |
| **PageRank** | Importância considerando quem aponta para o nó | Ranquear influência em redes direcionadas |
| **Clustering Coefficient** | Quão conectados estão os vizinhos de um nó | Detectar echo chambers |

## Algoritmos de Ranking de Conteúdo em Comunidades

### Reddit Hot Algorithm
```
hot_score = log10(max(|score|, 1)) * sign(score) + (timestamp / 45000)
```
- Score = upvotes - downvotes
- **Propriedades:** Scaling logarítmico de votos; tempo nunca decresce; half-life de 12.5 horas
- **Para research:** Os primeiros votos têm impacto desproporcional — posts virais não são necessariamente os melhores

### Hacker News Gravity Algorithm
```
score = (P - 1) / (T + 2)^G
```
- P = pontos, T = horas desde submissão, G = gravity (default 1.8)
- **Propriedades:** Decaimento ativo ao longo do tempo; tunable gravity
- **Para research:** Conteúdo técnico/nicho tem vida mais longa que HN do que em Reddit

### Wilson Score Interval (Stack Overflow Best Sort)
Ranqueia pelo limite inferior do intervalo de confiança para aprovação real:
- Corrige para amostras pequenas: 5 upvotes/0 downvotes pode superar 100 upvotes/40 downvotes
- **Para research:** Melhor proxy de "qualidade real" que simples contagem de votos

## Métodos de Pesquisa de Comunidade

### Digital Ethnography
Observação sistemática de comunidades online:
1. **Lurking phase:** 2-4 semanas observando sem intervir — entender normas, gírias, hierarquias
2. **Mapping phase:** Identificar key contributors, hubs, tipos de conteúdo, horários de pico
3. **Analysis phase:** Classificar interações, tensões, padrões emergentes
4. **Validation phase:** Confirmar interpretações com membros da comunidade (se aplicável)

### Netnografia (Kozinets 2002, atualizado 2020)
Adaptação da etnografia para ambientes digitais:
- Imersão cultural (participar genuinamente)
- Coleta de dados naturais (não interferir no comportamento)
- Interpretação cultural (entender significado, não apenas frequência)
- **Diferencial:** Captura como comunidades criam significado, não apenas o que dizem

### Community Health Monitoring
Métricas para monitorar saúde de uma comunidade ao longo do tempo:

| Métrica | Sinal Saudável | Sinal de Alerta |
|---------|---------------|-----------------|
| DAU/MAU ratio | >15% | <5% |
| D1 retention | >40% | <20% |
| D7 retention | >25% | <10% |
| Post/member ratio | Crescendo | Declinando 3+ semanas |
| Response rate | >60% de posts respondidos | <30% |
| Moderator actions | Estável | Crescente aceleradamente |

## Trust e Reputação em Comunidades

### Discourse Trust Levels (Gold Standard)

| Level | Nome | Como Ganho | Privilégios-Chave |
|-------|------|-----------|-------------------|
| TL0 | New | Default | Ações básicas |
| TL1 | Basic | Ler tópicos, tempo no site | PMs, flags |
| TL2 | Member | Participação ativa (semanas) | Convites, wiki posts |
| TL3 | Regular | Participação sustentada (meses) | Recategorizar, mover tópicos; auto-revogado se cair |
| TL4 | Leader | Concedido por admins | Poderes totais de moderação |

**Insight para research:** Trust levels são o melhor proxy para qualidade de contributor. Análise de TL3+ revela comunidade "real" de especialistas.

### Stack Overflow Reputation-Privilege Model
- +10 por upvote em resposta; +15 por accepted answer
- Cap de 200 rep/dia (previne grinding)
- Privilégios progressivos: 15 rep → upvote; 125 rep → downvote; 2,000 → editar qualquer post

**Insight para research:** Reputação de 1,000+ indica expertise genuína. Padrões de upvote revelam consenso técnico da comunidade.

## Fontes de Dados para Community Research

### APIs Oficiais
- **Reddit API:** Free tier limitado (100 req/min); dados históricos via Pushshift (parcialmente disponível)
- **Stack Exchange API:** API pública, 10,000 req/dia sem auth
- **Discord:** Apenas próprios servers via bot
- **GitHub API:** Issues, discussions, contribution graphs

### Ferramentas de Análise
| Ferramenta | Foco | Gratuito? |
|-----------|------|-----------|
| Brandwatch | Social listening enterprise | Não |
| Pulsar | Audience intelligence | Não |
| SparkToro | Audience research (onde passam tempo) | Parcialmente |
| Followerwonk | Twitter/X análise | Parcialmente |
| Social Blade | YouTube/Twitch stats | Sim |

### Dados Estruturados Públicos
- **Reddit:** Subreddit stats via third-party (Subreddit Stats, Redditmetis)
- **Stack Overflow:** Data Explorer (SEDE) — queries SQL completas em dados públicos
- **GitHub:** Trending repositories, dependency graphs públicos

## Armadilhas em Community Research

| Armadilha | Descrição | Mitigação |
|-----------|-----------|-----------|
| Vocal minority | 1% cria conteúdo, 9% reage, 90% lurka | Complementar com surveys representativos |
| Platform sample bias | Comunidade Reddit ≠ mercado geral | Triangular com dados offline/outros canais |
| Survivorship | Só vê comunidades ativas, não as que morreram | Incluir análise de comunidades fracassadas |
| Gaming detection | Bots, coordenação artificial, astroturfing | Verificar padrões de criação de conta, timing de posts |
| Temporal drift | Normas de comunidades mudam rapidamente | Análise longitudinal, não snapshots únicos |

---

*Knowledge base da squad-research | Fonte: MS-010 Forum & Community Platform Engineering*
