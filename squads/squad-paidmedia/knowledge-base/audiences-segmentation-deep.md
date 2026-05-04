# Audiences & Segmentation Deep — Paid Media

> Fonte: MS-005 Paid Traffic Research (2026-04-07)

---

## Hierarquia de Audiências Meta (2025-2026)

### A Evolução pós-iOS 14.5

| Época | Abordagem | Status |
|-------|-----------|--------|
| Pré-iOS 14.5 | Interest stacking granular, Lookalikes precisos | Obsoleto |
| Pós-iOS 14.5 | Broad targeting + ML, LALs como semente | Vigente |
| Advantage+ Era (2024+) | Broad + CAPI + Advantage+ Audiences | Recomendado |

**iOS 14.5 ATT (abril 2021):** ~25% dos usuários iOS optaram por permitir tracking. Impacto:
- Janela de atribuição reduzida: 28 dias → 7 dias (click), 1 dia (view)
- Custom audiences menores
- LALs menos precisas
- Menos sinais de conversão para ML otimizar

**Contramedidas ativas:**
1. CAPI para recuperar sinais perdidos
2. Aggregated Event Measurement (AEM) — máximo 8 eventos por domínio
3. Conversions API Gateway (Stape.io como alternativa econômica)
4. Advantage+ para compensar com ML mais agressivo
5. Value Rules (2025): atribuir mais valor a segmentos high-LTV sem desabilitar Advantage+

---

## Advantage+ Audiences (Meta 2024-2025)

A Meta substituiu targeting manual por sugestões algorítmicas:

**Como funciona:**
- Você pode dar "suggestions" de interesses/demografias
- A Meta expande livremente além dessas sugestões
- Na prática: broad targeting com sinais iniciais

**Value Rules (2025):**
Permitem influenciar a entrega sem desabilitar Advantage+:
- Exemplo: atribuir mais valor a compras de ticket alto
- Exemplo: priorizar faixa etária 25-44 como sugestão
- Funciona como "hints" para o algoritmo, não como restrições rígidas

**Andromeda (infraestrutura 2025):**
Novo motor de ad retrieval da Meta que processa maior variedade de criativos simultaneamente. Pode causar volatilidade temporária de CPMs durante fase de adaptação.

---

## Estrutura de Audiências por Temperatura

### Cold Audiences (Prospecting) — 60-70% do Budget

| Audiência | Qualidade | Volume | Quando Usar |
|----------|---------|--------|------------|
| **Broad (sem interesses)** | Depende do algoritmo | Máximo | Pixel com 50+ conv/semana |
| **LAL 1% de purchasers** | Alta | Médio | Melhor seed possível |
| **LAL 1% de leads qualificados** | Alta | Médio | Segundo melhor seed |
| **LAL 1-3% de website visitors** | Média | Alto | Mais escala, menos qualidade |
| **Interest stacking (3-5 temas)** | Variável | Médio | Quando broad não funciona |

**Decisão Broad vs LAL vs Interest:**
- Pixel maduro (50+ conv/semana): **Broad first**
- Pixel intermediário (15-50 conv/semana): **LAL 1% first**
- Pixel novo (<15 conv/semana): **Interest stacking** como warmup

### Warm Audiences (Nurturing) — 20-30% do Budget

| Audiência | Janela | Uso |
|----------|--------|-----|
| Website visitors all pages | 30d, 60d, 90d | Retargeting amplo |
| Instagram/Facebook engagers | 30d, 90d, 180d | Re-engajamento social |
| Video viewers 25%+ | 90d | Warm de video |
| Page followers | — | Orgânicos não convertidos |
| Lead form openers (sem submit) | 90d | Alta intenção, não converteu |

### Hot Audiences (Conversão) — 10-15% do Budget

| Audiência | Janela | Uso |
|----------|--------|-----|
| Add to Cart sem Purchase | 7d, 14d | Urgência máxima |
| Checkout initiation sem Purchase | 7d | Quase converteu |
| Website visitors página de pricing | 7d, 14d | Alta intenção |
| Video viewers 75%+ | 30d | Engajamento profundo |
| Engaged with ads (form openers parciais) | 30d | Semi-qualificados |

### Exclusion Architecture

```
Cold → exclui Warm + Hot audiences
Warm → exclui Hot audiences
Hot → exclui purchasers recentes (se objetivo = new customers)
Global → exclui employees, existing customers (optional)
```

---

## Custom Audiences — Fontes e Janelas

| Fonte | Janela | Match Rate | Uso |
|-------|--------|-----------|-----|
| **Website visitors (Pixel)** | 1-180 dias | Alta | Retargeting por comportamento |
| **Customer list (email/phone)** | N/A | ~60-70% | CRM retargeting e LAL seed |
| **App activity** | 1-180 dias | Alta | Retargeting mobile |
| **Video viewers** | 3s, 25%, 50%, 75%, 95% | Alta | Funnel de vídeo |
| **Instagram/Facebook engagers** | 1-365 dias | Alta | Warm audiences |
| **Lead form openers** | 1-90 dias | Alta | Follow-up de leads |

---

## Lookalike Audiences (LAL)

**Como funcionam:**
- Baseadas em Custom Audiences como "seed"
- Tamanhos: 1% (mais similar) a 10% (mais amplo)
- LAL 1% no Brasil = ~2.1 milhões de pessoas

**Best practices pós-iOS 14.5:**
- LALs perderam eficácia significativa desde abril 2021
- A Meta recomenda migrar para Advantage+ Audiences (broad + ML)
- Se usar LALs: seed de purchasers ou top LTV customers (não apenas visitantes)
- Seed mínimo: 1.000 pessoas (ideal: 5.000+)

**Seeds por qualidade (melhor → pior):**
1. LAL de purchasers (melhor seed)
2. LAL de top LTV customers
3. LAL de leads qualificados
4. LAL de leads (geral)
5. LAL de website visitors
6. LAL de engagers sociais (pior seed)

---

## CDP (Customer Data Platform)

CDPs unificam dados de múltiplas fontes em perfis únicos:

**O que uma CDP faz:**
1. **Coleta** dados de todas as fontes (website, app, CRM, email, POS)
2. **Unifica** identidades (resolve que user123@site = joao@email.com = device_abc)
3. **Segmenta** em audiences baseadas em comportamento e atributos
4. **Ativa** essas audiences em destinos (Meta, Google, email, SMS)

**CDPs por perfil:**

| CDP | Foco | Preço | Destaque |
|-----|------|-------|----------|
| **Segment** (Twilio) | Dados em tempo real | USD 120+/mês | Developer-friendly, integrações amplas |
| **RudderStack** | Open-source first | Free tier + USD 500+/mês | Self-hosted, warehouse-native |
| **mParticle** | Enterprise mobile | Enterprise | Mobile-first, app ecosystem |
| **Klaviyo** | E-commerce + email | USD 20+/mês | Email + SMS + CDP integrado |

**Menor opção para PME:** Segment com tier gratuito (até 1.000 MTUs/mês)

---

## First-Party Data Strategy

Com third-party cookies limitados (Safari, Firefox) e iOS ATT, first-party data é o ativo mais valioso:

| Fonte | Tipo de Dado | Uso em Paid Media |
|-------|-------------|-------------------|
| **Website** | Páginas visitadas, tempo, eventos | Custom Audiences, remarketing |
| **App** | Comportamento in-app, compras | Custom Audiences, app retargeting |
| **CRM** | Email, telefone, histórico de compra | Customer Match, LALs |
| **Email** | Aberturas, cliques, engajamento | Segmentação por engajamento |
| **POS/Checkout** | Transações, produtos, LTV | High-value LALs |
| **Formulários** | Leads, interesse declarado | Nurturing audiences |
| **Chat/Suporte** | Conversas, tickets, satisfação | Segmentação por satisfação |

---

## Retargeting Estratégico por Funil

| Estágio | Audiência | Mensagem | Formato |
|---------|-----------|----------|---------|
| **Top (Awareness)** | Video viewers (25%+) | Conteúdo educativo, storytelling | Video ads |
| **Middle (Consideration)** | Site visitors (sem conversão) | Benefícios, social proof, cases | Carousel, depoimentos |
| **Bottom (Decision)** | Cart abandoners, form starters | Urgência, desconto, garantia | Dynamic product ads |
| **Post-Purchase** | Compradores recentes | Upsell, cross-sell, review request | Product recommendations |

### Janelas de Retargeting

| Janela | Uso |
|--------|-----|
| 1-3 dias | Cart abandoners (urgência máxima) |
| 7 dias | Site visitors recentes (alta intenção) |
| 14-30 dias | Engagers mais frios (awareness refresh) |
| 60-90 dias | Re-engagement (oferta especial) |
| 180 dias | Winback (retomar inativos) |

---

## Exclusion Lists — Igualmente Importantes

| Lista de Exclusão | Por Quê |
|-------------------|---------|
| Clientes atuais (em prospecting) | Não gastar budget com quem já comprou |
| Compradores recentes (7-14 dias) | Evitar "buyer's remorse"/sensação de perseguição |
| Funcionários e equipe interna | Não inflar métricas falsamente |
| Leads já no pipeline (CRM) | Evitar confusão com vendedores |
| Usuários que clicaram "hide ad" | Respeitar preferência, proteger brand |

---

## Google Ads — Audience Strategy

### Customer Match (Google)

Upload de lista de emails/phones do CRM:
- Match rate: ~40-60% (menor que Meta ~60-70%)
- Usar para: exclusão de customers em prospecting, similar audiences, bid adjustments
- Requisito: conta com histórico de boa qualidade (política de dados)

### In-Market Audiences

Usuários que estão ativamente pesquisando produtos/serviços similares:
- Dados de comportamento de busca do Google
- Melhor targeting para fase de consideração
- Disponível em Display e YouTube; em Search como bid adjustment

### Affinity Audiences

Interesses de longo prazo (vs in-market que é intenção recente):
- Categorias amplas: "Amantes de culinária", "Entusiastas de tecnologia"
- Útil para awareness em Display e YouTube

### Custom Segments (Google)

Combina comportamentos e keywords:
- Usuários que pesquisaram keywords específicas
- Usuários que visitaram URLs específicas
- Combinação de comportamentos online
- Mais poderoso que affinity/in-market para nichos específicos

### Similar Segments

Equivalente ao LAL da Meta:
- Baseado em Customer Match ou Website Visitors
- Google descontinuou Similar Segments para a maioria dos formatos em 2023
- Performance Max tem funcionalidade equivalente integrada

---

## Predictive Audiences (GA4 + Meta)

### Google Predictive Audiences (GA4)

Disponível quando GA4 tem volume suficiente:
- "Likely to purchase in next 7 days"
- "Likely to churn in next 7 days"
- "Predicted revenue" por usuário

**Requisito:** Volume mínimo de eventos (purchase/transaction) nos últimos 28 dias.

### Meta Advantage+ Audiences + Value Rules

ML determina quem é mais propenso a converter:
- Funciona especialmente bem com CAPI e dados de conversão ricos
- Value Rules (2025): influenciar sem restringir — ex. dar mais valor a clientes high-LTV

---

## Segmentação por LTV

**Estratégia de LTV em paid media:**

1. **Identificar segmentos de LTV** no CRM (high, mid, low)
2. **Criar Custom Audiences** por segmento de LTV
3. **Criar LALs** a partir do segmento high-LTV (melhor seed)
4. **Excluir low-LTV** de campanhas de escala
5. **Usar Value Optimization** (Meta) para otimizar por receita, não conversões

**CAPI com parâmetro `value`:**
```javascript
fbq('track', 'Purchase', {
  value: 299.90,        // Valor real da transação
  currency: 'BRL',
  predicted_ltv: 850.00 // LTV estimado (envia para Meta via CAPI)
});
```

Meta usa o `predicted_ltv` para otimizar para clientes de maior valor, não apenas mais cliques.
