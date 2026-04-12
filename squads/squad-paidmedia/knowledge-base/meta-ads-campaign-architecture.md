# Meta Ads Campaign Architecture

## Three-Tier Audience Architecture

### Tier 1: Cold (Prospeccao) — 60-70% do Budget
Objetivo: trazer novos usuarios que nunca interagiram com a marca.

**Audiences recomendadas (em ordem de prioridade):**
1. **Broad (sem interesses)** — confiar no algoritmo. Melhor opcao quando pixel tem 50+ conversoes/semana
2. **Lookalike 1% de purchasers** — melhor seed possivel. Min 1000 na seed, ideal 5000+
3. **Lookalike 1% de leads qualificados** — segundo melhor seed
4. **Lookalike 1-3% de website visitors** — mais escala, menos qualidade
5. **Interest stacking** — agrupar 3-5 interesses relacionados. Usar apenas quando broad nao funciona

**Quando usar Broad vs LAL vs Interest:**
- Pixel maduro (50+ conv/semana): Broad first
- Pixel intermediario (15-50 conv/semana): LAL 1% first
- Pixel novo (<15 conv/semana): Interest stacking como warmup

### Tier 2: Warm (Nurturing) — 20-30% do Budget
Objetivo: re-engajar usuarios que mostraram interesse.

**Audiences recomendadas:**
1. Website visitors all pages (30d, 60d, 90d)
2. Instagram/Facebook engagers (30d, 90d, 180d)
3. Video viewers 25%+ (ultimos 90d)
4. Page followers
5. Lead form openers sem submit

### Tier 3: Hot (Conversao) — 10-15% do Budget
Objetivo: converter usuarios com alta intencao.

**Audiences recomendadas:**
1. Add to Cart sem Purchase (7d, 14d)
2. Checkout initiation sem Purchase (7d)
3. Website visitors pagina de pricing (7d, 14d)
4. Video viewers 75%+ (ultimos 30d)
5. Engaged with ads (form openers, lead submits parciais)

### Exclusion Architecture
```
Cold → exclui Warm + Hot audiences
Warm → exclui Hot audiences
Hot → exclui purchasers recentes (se objetivo = new customers)
Global → exclui employees, existing customers (optional)
```

## CBO vs ABO Decision Matrix

| Cenario | Usar | Razao |
|---------|------|-------|
| Conta madura, 3-5 ad sets balanceados | CBO | Meta otimiza alocacao entre ad sets |
| Teste de audiences (quer gastar igual em cada) | ABO | Controlar spend por audience |
| Budget muito baixo (<$50/day total) | ABO | CBO pode concentrar em 1 ad set |
| Scaling agressivo | CBO | Meta encontra eficiencia |
| Audiences com tamanhos muito diferentes | CBO com min spend | Evitar concentracao |

**Default: CBO.** Usar ABO apenas para testes controlados.

## Campaign Consolidation Principles

### Regra dos 3-5
- Max 3-5 campanhas ativas por objetivo de conversao
- Mais campanhas = menos dados por campanha = pior otimizacao
- Consolidar campanhas com mesmo objetivo e audience tier

### Estrutura Ideal (Conversion objective)
```
Campaign 1: CONV_Cold_Purchase_[YYYY-MM]     (CBO, 60-70% budget)
  ├── Ad Set: Broad_AllGeo
  ├── Ad Set: LAL1_Purchasers
  └── Ad Set: LAL1_Leads

Campaign 2: CONV_Warm_Purchase_[YYYY-MM]     (CBO, 20-30% budget)
  ├── Ad Set: WV_AllPages_30d
  └── Ad Set: Engagers_90d

Campaign 3: CONV_Hot_Purchase_[YYYY-MM]      (CBO, 10-15% budget)
  ├── Ad Set: ATC_14d
  └── Ad Set: Checkout_7d

Campaign 4: TEST_Creative_[YYYY-MM]          (ABO, 10-15% de test budget)
  ├── Ad Set: Test_HookA_vs_HookB
  └── Ad Set: Test_Format_Video_vs_Image

Campaign 5 (opt): ASC_Shopping_[YYYY-MM]     (Advantage+ Shopping, full funnel)
```

### Anti-Patterns a Evitar
- 1 campanha por criativo (fragmentacao extrema)
- 10+ ad sets por campanha CBO (diluicao)
- Campanhas duplicadas para mesma audience
- Campanhas de Traffic para objetivo de conversao

## Naming Conventions

### Formato
```
Campaign:  [Objective]_[Tier]_[Optimization]_[YYYY-MM]
Ad Set:    [Audience-Type]_[Window/Detail]
Ad:        [Format]_[Hook-Type]_[Version]_[MMDD]
```

### Exemplos
```
Campaign:  CONV_Cold_Purchase_2026-03
Ad Set:    Broad_AllGeo
Ad:        VID_Question_v2_0316

Campaign:  CONV_Warm_Purchase_2026-03
Ad Set:    WV_AllPages_30d
Ad:        IMG_Testimonial_v1_0310

Campaign:  TEST_Creative_2026-03
Ad Set:    Test_Hook_Question-vs-Bold
Ad:        VID_Question_v1_0316
```

### Codigos de Audience
| Codigo | Significado |
|--------|-----------|
| Broad | Targeting amplo sem interesses |
| LAL1 | Lookalike 1% |
| LAL3 | Lookalike 1-3% |
| WV | Website Visitors |
| ENG | Engagers (social) |
| VV | Video Viewers |
| ATC | Add to Cart |
| IC | Initiate Checkout |
| PURCH | Purchasers |

---

## Advantage+ Sales Campaigns (ASC) — Atualizado 2025

O Advantage+ Shopping Campaign foi renomeado para **Advantage+ Sales Campaign** em fevereiro de 2025 e expandiu seu escopo:

**O que mudou:**
- Suporta agora: Sales, App Installs e Lead Generation (não apenas e-commerce)
- Múltiplos ad sets permitidos (antes limitado a 1), cada um com até 50 ads
- Controles adicionados: exclusão de custom audiences, preferências de idade/gênero
- Você fornece: catálogo de produtos, criativos, budget, país
- A Meta otimiza tudo automaticamente

**Resultados reportados:** ROAS 15-30% superior vs campanhas manuais em muitos casos.

**Quando NÃO usar ASC:**
- Produtos de nicho muito específico
- B2B com ciclo de venda longo
- Serviços complexos que exigem qualificação granular

### Estrutura ASC no Funil

```
Campaign: ASC_Sales_[YYYY-MM]                    (Advantage+ Sales, full funnel)
  ├── Ad Set: Prospecting (cold audiences)
  └── Ad Set: Remarketing (existing customers, site visitors)
```

A Meta gerencia automaticamente a divisão entre prospecting e remarketing. O anunciante pode definir orçamento mínimo por segmento.

---

## ODAX — Objetivos Unificados

Meta organiza campanhas em 6 categorias ODAX (Outcome-Driven Ad Experiences):

| Objetivo | Otimiza Para | Use Quando |
|----------|-------------|-----------|
| **Awareness** | Impressões, alcance, brand recall | Lançamentos, branding de marca |
| **Traffic** | Link clicks, landing page views | Gerar visitantes qualificados ao site |
| **Engagement** | Curtidas, comentários, mensagens | WhatsApp CTW, prova social, conteúdo |
| **Leads** | Formulários, instant forms, conversas | Lead gen B2B e B2C |
| **App Promotion** | Instalações, eventos in-app | Apps mobile |
| **Sales** | Purchase, ATC, initiate checkout | E-commerce e conversão direta |

**Regra crítica:** O algoritmo otimiza EXATAMENTE para o que você pede. Objetivo de Traffic = clicadores, não compradores. Sempre usar Sales com evento Purchase para campanhas de conversão.

---

## Andromeda — Nova Infraestrutura (2025)

Novo motor de ad retrieval da Meta que substitui o sistema anterior:
- Processa maior variedade de criativos simultaneamente
- Pode causar volatilidade temporária de CPMs durante fase de adaptação
- Criativos mais diversificados (diferentes formatos, durações) são favorecidos

**Implicação prática:** Maior diversidade de formatos de criativo (imagens, vídeos curtos, carrosseis, Reels) no mesmo ad set melhora a entrega via Andromeda.

---

## Incremental Attribution (Meta, abril 2025)

Nova feature no Ads Manager que separa:
- Conversões **causadas pelo anúncio** (incrementais)
- Conversões que teriam ocorrido **organicamente** (sem o anúncio)

**Como usar:**
1. Acessar: Ads Manager → Columns → Customize → Incremental Attribution
2. Comparar Incremental CPA vs CPA total reportado
3. Usar para decisões de alocação de budget entre canais

**Junto com Engaged-View Attribution (2025):**
- Threshold de visualização reduzido de 10s para **5s** (ou 97% de vídeos curtos)
- Meta reporta 46% das conversões de compra em Reels nos primeiros 2s de atenção
- Usar engaged-view para otimização diária; incremental attribution para decisões estratégicas
