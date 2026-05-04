# Programmatic & DSPs + Attribution Deep Dive

> Fonte: MS-005 Paid Traffic Research (2026-04-07)

---

## Programmatic & DSPs

### Como Funciona o RTB (Real-Time Bidding)

Todo o processo acontece em menos de 100ms — enquanto a página carrega:

```
1. Usuário visita uma página web
2. Publisher envia bid request ao ad exchange/SSP
3. Ad exchange distribui para DSPs conectados
4. Cada DSP avalia o usuário e decide se/quanto lançar (<50ms)
5. DSPs enviam bid responses com lance e criativo
6. Ad exchange seleciona vencedor (maior lance)
7. Anúncio do vencedor é servido ao usuário
8. Tracking de impressão, clique e conversão
```

**Latência total: 50-100ms**

### O Ecossistema Programático

| Componente | Função | Exemplos |
|-----------|--------|----------|
| **DSP** (Demand-Side Platform) | Compra automatizada para anunciantes | DV360, The Trade Desk, Amazon DSP, Xandr |
| **SSP** (Supply-Side Platform) | Venda automatizada para publishers | Google Ad Manager, Magnite, PubMatic, Index Exchange |
| **Ad Exchange** | Marketplace de transação | Google AdX, OpenX, Xandr |
| **DMP** (Data Management Platform) | Agregação de third-party data | Oracle BlueKai, Lotame (em declínio) |
| **CDP** (Customer Data Platform) | First-party data unificada | Segment, RudderStack, mParticle |
| **Ad Server** | Servir, rastrear, otimizar criativos | Google Campaign Manager 360 |
| **Verification** | Viewability, brand safety, fraude | IAS, DoubleVerify, MOAT |

### DV360 (Display & Video 360)

DSP do Google, parte da Google Marketing Platform:

**Vantagens:**
- Acesso ao inventário Google (YouTube, GDN) + open web
- Integração nativa com GA4, Campaign Manager 360, Search Ads 360
- Audience Manager robusto (1st, 2nd, 3rd party data)
- Programmatic Guaranteed e Preferred Deals com publishers premium

**Tipos de transação:**

| Tipo | Preço | Inventário | Uso |
|------|-------|-----------|-----|
| **Open Auction** | Variável (leilão) | Remanescente | Escala e performance |
| **Private Auction** | Floor price | Seleto | Premium com competição |
| **Preferred Deal** | Fixo negociado | Reservado | Relação com publisher |
| **Programmatic Guaranteed** | Fixo negociado | Garantido | Premium garantido |

### The Trade Desk

Principal DSP independente (sem conflito de interesse Google/Meta):

**Diferenciais:**
- **Unified ID 2.0:** Solução de identidade pós-cookie baseada em email hashed
- **Koa AI:** Motor de ML proprietário para otimização de bids
- **Planner:** Ferramenta de planejamento e forecasting
- **CTV (Connected TV):** Forte presença em streaming/OTT (Netflix, Disney+, Peacock)
- **Independência:** Não é publisher — sem conflito de interesse

### Amazon DSP

Para e-commerce e marcas que vendem na Amazon:
- Targeting por comportamento de compra (dados de compra Amazon)
- Alcance em Amazon.com, IMDb, Twitch e parceiros
- Retargeting de visitantes de página de produto (ASIN targeting)
- Exclusivo: dados de intenção de compra mais ricos do ecossistema digital

### Header Bidding

Técnica onde o publisher oferece inventário a múltiplos ad exchanges simultaneamente:

**Waterfall (modelo antigo):**
```
Publisher → Ad Server → Exchange A (não compra) → Exchange B (compra por $2)
// Exchange A nunca teve chance de oferecer $3
```

**Com Header Bidding:**
```
Publisher → [Exchange A: $3, Exchange B: $2, Exchange C: $1] → Ad Server (seleciona $3)
// Competição justa, publisher ganha mais
```

**Implementações:**
- **Client-side (Prebid.js):** JavaScript no browser. Mais comum, adiciona latência (~100-200ms)
- **Server-side (Prebid Server):** Processamento no servidor. Menos latência, menor cookie match rate
- **Hybrid:** Combinação para otimizar performance e receita

### Viewability e Brand Safety

**Padrões de Viewability (MRC):**
- Display: 50% dos pixels visíveis por 1 segundo
- Video: 50% dos pixels visíveis por 2 segundos contínuos
- Benchmark: >70% viewability é considerado bom

**Brand Safety:**
- Garantir que anúncios não aparecem ao lado de conteúdo inadequado
- **Pre-bid filtering:** Bloquear antes de lançar (mais seguro, menos inventário)
- **Post-bid monitoring:** Detectar após servir (mais barato, mais escala)
- **Inclusion lists:** Sites aprovados (mais safe, menos escala)
- **Exclusion lists:** Sites bloqueados (mais escala, menos controle)

---

## Attribution & Measurement Deep Dive

### O Problema Fundamental

O cliente médio interage com 7-13 touchpoints antes de converter. Problemas:
1. **Multi-touch:** Qual canal recebe crédito?
2. **Cross-device:** Celular → desktop → conversão
3. **Walled gardens:** Google, Meta, TikTok cada um se atribui
4. **Privacy restrictions:** iOS 14.5, cookies limitados
5. **Offline-to-online:** Visita física influenciada por ad online

### Modelos de Atribuição

| Modelo | Crédito | Viés | Melhor Para |
|--------|---------|------|------------|
| **Last Click** | 100% último clique | Favorece fundo de funil | Baseline simples |
| **First Click** | 100% primeiro toque | Favorece topo de funil | Análise de discovery |
| **Linear** | Igual entre todos | Democrático mas impreciso | Visão geral |
| **Time Decay** | Mais peso para toques recentes | Subestima awareness | Ciclos de venda curtos |
| **Position-Based (U)** | 40% first, 40% last, 20% middle | Valoriza discovery + conversão | B2B balanceado |
| **Data-Driven (DDA)** | ML determina impacto real | Mais preciso, opaco | Default quando há volume |

### Media Mix Modeling (MMM)

Abordagem econométrica (top-down) que usa regressão estatística:

**Como funciona:**
1. Coletar dados históricos de spend e resultados por canal (12-36 meses)
2. Incluir variáveis de controle: sazonalidade, preço, competição, macroeconomia
3. Regressão estatística para isolar efeito de cada canal
4. Output: curvas de resposta por canal (spend → resultado)

**Vantagens:**
- Não depende de cookies ou tracking individual
- Captura efeitos offline e cross-channel
- Privacy-safe por natureza
- Inclui fatores externos (sazonalidade, competição)

**Desvantagens:**
- Requer 2-3 anos de dados históricos
- Granularidade limitada (semanal/mensal, não diária)
- Não captura efeitos de criativo ou targeting
- Custo alto (USD 50-200K para consultoria tradicional)

### Open-Source MMM (Democratização)

| Framework | Linguagem | Por Quem | Destaque |
|-----------|-----------|---------|----------|
| **Meta Robyn** | R | Meta | Primeiro open-source MMM, comunidade grande |
| **Google Meridian** | Python | Google | Lançado em 2024, Bayesian approach |
| **Lightweight MMM (LMMM)** | Python/JAX | Google | Predecessor do Meridian, mais simples |

**github.com/facebookexperimental/Robyn** | **github.com/google/meridian**

Esses frameworks democratizaram MMM — antes restrito a consultorias caras (USD 50-200K). Agora acessível com equipe técnica interna.

**Quando usar MMM:**
- Budget mensal > BRL 100K (volume suficiente para regressão)
- Mix de canais variado (online + offline ou multi-plataforma)
- Decisões estratégicas de alocação trimestral/anual
- Quando atribuição por clique está claramente errada

### Incrementality Testing

Mede o efeito causal real — "essas conversões teriam acontecido mesmo sem o anúncio?"

**Conversion Lift Studies:**
- Dividir audiência em grupo de teste (vê anúncios) e controle (não vê)
- Comparar conversões entre grupos
- Diferença = efeito incremental da campanha
- **Disponível nativamente:** Meta Conversion Lift, Google Brand Lift, TikTok Split Test

**Geo-Tests:**
- Regiões similares como teste e controle
- Campanha apenas nas regiões de teste
- Comparar resultados entre regiões
- Mais robusto (sem data leakage de audiência)

**Switchback Tests:**
- Alternar entre períodos on/off em diferentes regiões
- Controla para sazonalidade e tendências temporais
- Mais dados com menos regiões

**Meta Incremental Attribution (abril 2025):**
- Nova feature no Ads Manager que separa conversões realmente causadas pelo anúncio daquelas orgânicas
- Disponível no painel de Attribution — recomendado para decisões de budget

### Privacy Sandbox (Status 2025-2026)

**Reversão histórica do Google:**
- **Julho 2024:** Google anuncia que NÃO eliminará third-party cookies. Modelo de "user choice"
- **Abril 2025:** Confirma que não introduzirá prompt separado de consentimento
- **Outubro 2025:** Aposenta maior parte das tecnologias do Privacy Sandbox

**APIs do Privacy Sandbox que SOBREVIVERAM:**
- **CHIPS:** Cookies Having Independent Partitioned State (cookies particionados por site)
- **FedCM:** Federated Credential Management (login federado)
- **Private State Tokens:** Verificação de fraude sem cross-site tracking

**APIs APOSENTADAS:**
- Topics API (substituição de cookies por interesse — adoção <32%)
- Protected Audience API / FLEDGE (remarketing on-device — adoção mínima)
- Attribution Reporting API (atribuição agregada — mercado preferiu métodos tradicionais)

**O que isso significa na prática:**
- Third-party cookies permanecem habilitados no Chrome por padrão
- Mas Safari e Firefox já bloqueiam por padrão — impacto real já existia
- Investimento em first-party data é irreversível independente do Chrome
- Server-side tracking (CAPI) continua essencial
- **"A indústria se preparou para um mundo sem cookies e não volta atrás"**

### CAPI Deep Implementation

**Prioridade de eventos (implementar nesta ordem):**
1. Purchase / Lead (mais importante para otimização)
2. Add to Cart / Initiate Checkout
3. View Content / Page View

**Event Match Quality (EMQ) — Parâmetros que melhoram:**

| Parâmetro | Impacto | Implementação |
|-----------|---------|--------------|
| `em` (email hashed SHA256) | Muito alto | Hash no servidor antes de enviar |
| `ph` (phone hashed) | Alto | Hash no servidor |
| `fn` + `ln` (nome hashed) | Médio | Hash no servidor |
| `external_id` (user ID) | Médio | ID do sistema interno |
| `client_ip_address` | Automático | Pegar do request HTTP |
| `fbc`, `fbp` | Médio | Cookies do browser |

**EMQ Target:** Score > 6.0 para todos os eventos críticos

**Deduplication:**
- Enviar mesmo `event_id` via Pixel (browser) e CAPI (server)
- Meta deduplica automaticamente quando event_id match
- Dedup ratio ideal: 80-95%
- <50%: event_ids não estão matching

**Opções de Implementação:**
1. **Gateway plug-and-play:** Shopify/WooCommerce plugin (mais fácil)
2. **Stape.io:** Servidor intermediário sem código (econômico)
3. **Manual via API:** Controle total, mais complexo
4. **Parceiros certificados:** Advantage+ parceiros Meta

### UTM Strategy

Convenção recomendada:

```
https://site.com/landing?
  utm_source=meta&
  utm_medium=paid-social&
  utm_campaign=prospecting-lal1-2026q1&
  utm_content=video-depoimento-30s&
  utm_term=lookalike-1pct-purchasers
```

| Parâmetro | Uso | Exemplo |
|-----------|-----|---------|
| `utm_source` | Plataforma | meta, google, tiktok, linkedin |
| `utm_medium` | Tipo de canal | paid-social, paid-search, display, cpc |
| `utm_campaign` | Nome da campanha | prospecting-lal1-2026q1 |
| `utm_content` | Variação de criativo | video-depoimento-30s |
| `utm_term` | Keyword ou audiência | lookalike-1pct-purchasers |

**Regras:**
- Sempre lowercase, sem espaços (usar hífens)
- Nomenclatura consistente e documentada em planilha
- Incluir período/quarter no campaign name
- Não usar UTMs em links internos (polui atribuição)

### MER vs ROAS — Qual Usar

**ROAS por plataforma:** Cada plataforma se auto-atribui. Google diz X, Meta diz Y, soma > realidade.

**MER (Marketing Efficiency Ratio):**
```
MER = Receita Total do Negócio / Custo Total de Marketing

Exemplo:
Receita mensal: R$500.000
Custo total de marketing (ads + equipe + ferramentas): R$100.000
MER = 5.0x
```

**Quando usar cada um:**
- ROAS por plataforma: otimização DENTRO do canal
- MER: decisões de alocação ENTRE canais e estratégicas
- Incrementality: validar se o canal é realmente causal

### Estratégia Triangulada (Best Practice)

```
MER (macro) + Incrementality (causalidade) + Platform ROAS (otimização tática)

1. MER mostra tendência geral da eficiência
2. Incrementality confirma quais canais são causais
3. Platform ROAS guia otimização dentro de cada canal
4. MMM informa alocação estratégica trimestral/anual
```
