# Social Algorithms Playbook — Paid Media Lens

> Fonte: MS-016 Social Algorithms Research (2026-04-07)
> Foco: como os algoritmos impactam distribuição de anúncios e organic synergy para paid media

---

## Instagram Algorithm — Para Paid Media

### Arquitetura Multi-Superficie

O Instagram opera com algoritmos diferentes por superficie:

| Superficie | Função | Relevância para Ads |
|-----------|--------|-------------------|
| **Feed** | Conteúdo de seguidos + recomendados | 15-20% é recomendado; ads competem neste espaço |
| **Reels** | Video curto algorítmico | Superficie de maior crescimento; Reels ads têm CPMs 30-40% mais baixos |
| **Stories** | Conteúdo efêmero ranqueado por relacionamento | Ads entre Stories; alta taxa de conclusão |
| **Explore** | Descoberta de contas não seguidas | Ads no Explore; audiência em modo descoberta |

### Sinais de Ranking Reels (2025-2026)

Hierarquia confirmada por Adam Mosseri (jan/2025):

1. **Watch Time (Completion Rate)** — Sinal #1. Reel assistido até o final = boost massivo
2. **Shares via DM** — "Sends are the most important signal for Reels ranking"
3. **Saves** — Indicam valor duradouro vs entretenimento momentâneo
4. **Engagement Velocity (primeira hora)** — Batch testing: algoritmo mostra para grupo pequeno, mede, decide se escala
5. **Audio Trending** — Reels com áudios em tendência recebem boost
6. **Originalidade** — Conteúdo com marca d'água do TikTok tem distribuição reduzida

**Para Spark Ads (boosting de posts orgânicos):**
- Post orgânico com bom hook rate indica que o conteúdo já passou no batch test
- Boostear posts que já têm engagement organico alto = CPM mais eficiente
- Completion rate orgânico é proxy de qualidade para o algoritmo de ads

### Penalidades Conhecidas (Instagram 2025-2026)

| Comportamento | Impacto |
|--------------|---------|
| Marca d'água do TikTok | Redução significativa de distribuição |
| Resolução < 720p | Penalizado |
| Texto cobrindo >20% da tela | Pode reduzir alcance |
| Conteúdo reciclado sem valor | Penalizado |
| Agregadores (10+ reposts/30d) | Excluídos do sistema de recomendação |

**Penalidade de agregadores (2025-2026):** Contas que repostam conteúdo alheio perderam 60-80% do alcance. Criadores originais ganharam 40-60% de alcance adicional. Relevância para ads: conteúdo original (UGC) performa melhor que reaproveitamento.

### Carrosseis como Formato Dominante (2025-2026)

Dados consolidados:
- Carrosseis entregam ER médio de **10%** vs imagens únicas (7%) vs Reels (6%)
- Alcançam **1.4x mais alcance** e **3.1x mais engajamento** que fotos únicas
- O Instagram adicionou reordenação de slides após publicação

**Implicação para ads:** Carrosseis são o formato orgânico de maior performance. Em Sponsored Content, testá-los como formato primário para objetivos de engajamento e consideração.

### "Your Algorithm" (dez/2025)

Feature que permite usuários ver e controlar tópicos que moldam recomendações em Reels.
- **Impacto para targeting:** Usuários que usam a ferramenta têm perfis de interesse mais definidos
- **Sinal de qualidade:** Algoritmo categoriza conteúdo por AI visual/textual, não apenas hashtags
- Implicação: hashtags perderam relevância como fator de descoberta; conteúdo visual deve "parecer" com o nicho

---

## TikTok Algorithm — Para Paid Media

### For You Page: Interest Graph

O TikTok usa **interest graph** (o que você assiste), não social graph (quem você segue). Para ads:
- Qualquer ad de qualquer conta pode ser servido a qualquer usuário
- A qualidade do criativo determina quem vê o ad
- Targeting broad + criativo forte = eficiência máxima

### Sinais Algorítmicos (Tier System)

**Tier 1 — Sinais de Conteúdo (peso mais alto):**
- **Completion Rate** — O sinal mais poderoso. 100% completion = maior boost possível
- **Watch Time Total** — 60s assistido por 55s pode superar 15s assistido 100%
- **Shares** — DM shares são sinais extremamente fortes
- **Comments** — Comentários longos e detalhados pesam mais que emojis
- **Profile Visits After Watching** — Sinal forte de interesse

**Tier 2 — Sinais do Usuário:**
- Histórico de interações, conteúdo criado, "Not Interested" (sinal negativo forte)

**Tier 3 — Dispositivo/Conta:**
- Idioma, localização, tipo de dispositivo (proxy de poder aquisitivo)

### Sistema de Batch Testing (Pool Testing)

Mecanismo de distribuição em "ondas":

```
Pool 1 (~200-500 views): Grupo pequeno e diverso
  ↓ completion rate > ~50% e engagement > baseline
Pool 2 (~1.000-5.000 views): Audiência maior com interesses similares
  ↓ métricas se mantêm ou melhoram
Pool 3 (~10.000-100.000 views): Distribuição ampla, diversidade geográfica
  ↓ viral potencial
Pool 4+ (~100K-milhões): Distribuição massiva cross-geográfica
```

**Para In-Feed Ads:** O mesmo mecanismo se aplica. Um ad que não performar no Pool 1 é suprimido — o criativo determina se o ad é escalado pelo algoritmo organicamente.

**Insight crítico:** Um ad pode "ressuscitar" dias depois. O TikTok periodicamente retesta conteúdo. Não pausar ads prematuramente sem dados suficientes.

### Monolith Paper (ByteDance, 2022)

Arquitetura técnica do sistema de recomendação TikTok:
- **Real-time training:** Modelo treinado continuamente (não em batches diários). Adapta-se quase instantaneamente a tendências
- **Collisionless embedding:** Inovação em representação de features que evita colisões de hash
- **Feature eviction:** Features antigas descartadas automaticamente
- **Escala:** Processa bilhões de interações por dia em tempo real

**Implicação prática:** Tendências no TikTok têm ciclo de vida de horas/dias, não semanas. Creative refresh semanal é o mínimo recomendável.

### Otimização de Criativos TikTok

| Elemento | Recomendação | Por Quê |
|----------|-------------|---------|
| **Primeiros 2-3s** | Hook visual imediato | Skip rate nos primeiros segundos suprime o ad |
| **Duração** | 15-30s (completion rate) ou 60s+ (watch time total) | Ambos válidos com métricas diferentes |
| **Áudio trending** | Usar sons em tendência | Um dos boosts mais consistentes |
| **Texto na tela** | Overlay text e legendas | Indexado para categorização (hashtags implícitas) |
| **Hashtags** | Nicho específico | Para categorização, não descoberta (#fyp é irrelevante) |
| **AIGC disclosure** | Obrigatório | Risco de rejeição sem sinalização |

---

## YouTube Algorithm — Para Paid Media

### Fórmula Fundamental: CTR x AVD

**CTR (Click-Through Rate):** % de pessoas que veem a thumbnail/título e clicam
**AVD (Average View Duration):** Tempo médio que espectadores assistem

```
CTR alto + AVD alto = máxima performance algorítmica
CTR alto + AVD baixo = clickbait (penalizado)
CTR baixo + AVD alto = bom conteúdo com packaging fraco
```

**Para YouTube Ads:**
- Thumbnail/opening frame = equivalente ao CTR de outros canais
- Se o usuário não clica em "pular" após 5s = signal de qualidade
- Hook nos primeiros 5s é crítico para skippable ads

### Superficies de Descoberta e Ads

| Superficie | % do Tráfego | Tipo de Ad Relevante |
|-----------|-------------|---------------------|
| **Browse (Homepage)** | 40-60% | Display/Overlay ads |
| **Suggested (Watch Next)** | 30-40% | In-stream skippable |
| **Search** | Variável | TrueView for Action |
| **Shorts** | Crescendo | YouTube Shorts Ads (6s-60s) |

### YouTube Shorts (2025-2026 Updates)

- **Duração estendida:** Shorts agora suportam até 3 minutos
- **Nova contagem de views:** Loop conta como view adicional (infla contagens passivas)
- **Separação algorítmica:** Motor completamente separado do long-form
- **Browse Feed:** Homepage reduziu de ~12 para ~2 videos long-form, priorizando Shorts
- **Filtro de busca dedicado (jan/2026):** Shorts como resultado de busca de primeira classe

**Para YouTube Shorts Ads:**
- Crescimento explosivo: 200B views/dia (jun/2025 — vs 70B em mar/2024 = +186%)
- Completion rate e swipe-through rate são sinais dominantes
- Criativos nativos (parecer conteúdo, não publicidade) têm melhor performance

### DNN Paper (Google, 2016) — Fundamento da Recomendação

"Deep Neural Networks for YouTube Recommendations" (Covington, Adams & Sargin):

**Two-Stage Architecture:**
1. **Candidate Generation:** Reduz milhões de videos a centenas de candidatos via collaborative filtering
2. **Ranking:** Rankeia candidatos com features detalhadas (watch time, engagement, freshness, upload frequency)

**"Example Age" feature:** A "idade" do vídeo é incluída como feature — o modelo aprende o decaimento natural de relevância.

**Para anunciantes:** Entender que o YouTube otimiza para watch time (não cliques) explica por que ads com maior AVD têm menor CPV ao longo do tempo.

### Satisfaction Surveys — "Responsible Recommendation"

O YouTube usa surveys in-app para calibrar o algoritmo além do watch time:
- Conteúdo "junk food" (clickbait) pode ter alto watch time mas baixa satisfação
- **Satisfaction signals > watch time bruto (2026)** — comportamento pós-visualização é novo sinal primário
- **Para ads:** Criativos que geram satisfação real (não apenas retenção) terão melhor distribuição de longo prazo

---

## LinkedIn Algorithm — Para Paid Media

### Sinais de Ranking (B2B Context)

**1. Dwell Time (Tempo de Permanência) — Sinal #1:**
- Mede quanto tempo o usuário gasta lendo um post, mesmo sem interagir
- "Qualified dwell time" vs "passive dwell time" (aba inativa)
- Post com 30s+ dwell médio = alta qualidade algorítmica

**2. Comentários Significativos:**
- Comentários longos (50+ chars): peso alto
- Comentários curtos (emoji, "ótimo post!"): peso baixo
- O LinkedIn penaliza engagement bait explícito (pedido de "comente SIM")

**3. Compartilhamentos com Comentário:**
- Repost simples: peso baixo
- Share com comentário substancial: peso muito maior

**4. Saves e Sends (final 2025):**
- LinkedIn adicionou Saves e Sends às analíticas de posts
- Sinal que esses comportamentos são valorizados algoritmicamente

### SSI (Social Selling Index)

Métrica LinkedIn de 0-100 em 4 dimensões:
1. Establishing Professional Brand (perfil completo, conteúdo)
2. Finding Right People (uso de search e InMail)
3. Engaging with Insights (interação com conteúdo relevante)
4. Building Relationships (profundidade das conexões)

**Para ads:** Perfis com SSI alto recebem maior alcance orgânico. Executivos com SSI alto são melhores candidatos para Thought Leadership Ads.

### Tipos de Conteúdo por Performance (LinkedIn)

| Formato | Alcance | Engajamento | Melhor Para |
|---------|---------|-------------|------------|
| **Documento/Carrossel** | Alto | Alto | Educacional, frameworks, listas |
| **Texto puro (longo)** | Médio-Alto | Médio | Storytelling, opinião |
| **Imagem + texto** | Médio | Médio | Notícias, celebrações |
| **Video nativo** | Médio | Médio-Baixo | Entrevistas, bastidores |
| **Link externo** | Baixo | Baixo | O LinkedIn penaliza links externos |
| **Newsletter** | Muito Alto (via email) | Alto | Conteúdo recorrente |

**Implicação para Sponsored Content:** Documentos/carrosseis e texto longo são os formatos orgânicos de maior alcance. Boostá-los via ads tem o melhor ratio orgânico:pago.

### Mudanças 2025-2026

- **Filtro anti-automação:** Posts com padrões de automação podem ter visibilidade limitada
- **Expert-led content:** Algoritmo prioriza frameworks, análises de indústria, insights de especialistas
- **Hashtags:** Limitar a 1-3 tags altamente relevantes (excesso = flag de spam)

---

## Twitter/X Algorithm — Para Paid Media

### For You vs Following

| Feed | Conteúdo | % Recomendado |
|------|---------|--------------|
| **For You** | Algorítmico | ~50% de fora da rede |
| **Following** | Cronológico | 100% de contas seguidas |

### Código Open-Source (Pesos Revelados)

O X tornou o algoritmo open-source em março/2023. Pesos relativos:

| Sinal | Peso Aproximado |
|-------|----------------|
| **Reply (resposta)** | 1x (baseline) |
| **Like/Favorito** | 0.5x |
| **Retweet/Repost** | 1x |
| **Quote Tweet** | 1x |
| **Bookmark** | Confirmado como sinal |
| **Tempo de leitura** | Peso crescente |

**Boost factors:**
- Imagens: ~2x boost sobre texto puro
- Video: ~2x boost
- Links externos: penalidade (o X quer manter usuários)
- X Premium subscribers: ~4x boost no ranking (pay-to-play)

**Para anunciantes X:** A plataforma tem distribuição menor (~22M MAU Brasil vs 131M TikTok). Alocação de budget justificada apenas para audiências muito específicas (jornalistas, tech, finanças, política).

---

## Teoria de Sistemas de Recomendação

### Collaborative Filtering

**User-based:** "Usuários similares a você gostaram de X → você provavelmente vai gostar"
**Item-based:** "Itens frequentemente consumidos juntos são similares"
**Matrix Factorization:** Decompõe matriz usuário-item em fatores latentes (Netflix Prize 2009)

### Content-Based Filtering

Analisa propriedades do conteúdo:
- **NLP para texto:** Análise de tópicos, sentimento, entidades nomeadas
- **Computer Vision:** Classificação de objetos, cenas, rostos em imagens/video
- **Audio analysis:** Gênero musical, BPM, sentimento
- **Metadata:** Tags, categorias, hashtags, duração

**Vantagem:** Resolve cold start problem para novos itens. Sem histórico de engagement necessário.

### Two-Tower Models (Arquitetura Dominante)

```
User Tower:                    Content Tower:
[histórico]                    [tipo de conteúdo]
[demographics]      -->        [features visuais]        --> Similarity Score
[interações]        Embedding  [features textuais]       Embedding
[dispositivo]                  [engagement stats]
```

Usado por Instagram Explore, YouTube e TikTok. Embeddings pré-computados + approximate nearest neighbors (ANN) = escala para bilhões de usuários.

### Multi-Armed Bandits — Exploration vs Exploitation

O algoritmo precisa decidir entre:
- **Exploitation:** Mostrar conteúdo que sabidamente o usuário gosta (alta probabilidade imediata)
- **Exploration:** Mostrar conteúdo novo/diferente para descobrir novos interesses

**TikTok:** ~15-20% da FYP é conteúdo exploratório. Isso explica por que anúncios de nichos inesperados aparecem — e funcionam.

**Epsilon-Greedy:** Com probabilidade ε, mostra conteúdo aleatório; caso contrário, mostra o melhor conhecido.

**Thompson Sampling:** Abordagem bayesiana — naturalmente balanceia exploração e explotação sem parâmetro ε.

### Cold Start Problem

**Cold Start de Usuário (novo sem histórico):**
- Onboarding quiz (TikTok pergunta interesses)
- Conteúdo popular como default
- Demograficos como proxy

**Cold Start de Conteúdo (novo post/ad sem engagement):**
- Content-based features (análise do conteúdo)
- Creator features (histórico de performance)
- Batch testing para grupo aleatório (TikTok)
- Topic matching via NLP/CV

**Para ads:** Contas de anunciantes sem histórico de performance pagam CPMs mais altos inicialmente. Com histórico positivo, o algoritmo favorece e o CPM decresce.

---

## Cross-Platform Organic + Paid Synergy

### Formato Nativo por Plataforma

| Plataforma | Formato Orgânico Favorecido | Formato Penalizado |
|-----------|----------------------------|--------------------|
| **Instagram** | Reels, Carrosseis | Links externos, texto puro |
| **TikTok** | Video vertical (9:16), trending audio | Conteúdo com watermark TikTok |
| **YouTube** | Long-form (8-20 min), Shorts (novos) | Videos <4 min em long-form |
| **LinkedIn** | Documentos/Carrosseis, texto longo | Links externos, posts corporativos |
| **X/Twitter** | Threads, imagens, video curto | Links externos (penalizado) |
| **Facebook** | Reels, posts em Groups | Links, posts de Pages |

### Repurposing Framework

1. Criar peça "master" (video longo ou artigo)
2. Extrair clips para Reels/TikTok/Shorts
3. Transformar insights em carrosseis para Instagram/LinkedIn
4. Criar threads para X
5. Adaptar versão para formato/cultura de cada plataforma

**Performance cross-posting direto vs nativo:**
- Cross-posting direto (mesma peça): 30-50% menor performance
- Conteúdo nativo por plataforma: ideal mas exige mais recursos
- Repurposing com adaptação: melhor custo-benefício
