# Content Measurement Framework

> Framework de medicao de conteudo em 4 camadas para conectar producao a resultados de negocio.

---

## As 4 Camadas de Medicao

### Camada 1: Consumo
**Pergunta**: "As pessoas estao vendo nosso conteudo?"

| Metrica | O Que Mede | Benchmark Medio |
|---------|-----------|-----------------|
| Impressoes | Quantas vezes apareceu | Variavel por plataforma |
| Alcance | Quantas pessoas unicas viram | Variavel |
| Pageviews | Visitas a pagina (blog) | Depende do trafico |
| Video Views | Visualizacoes de video | 3s (Instagram), 1s (TikTok) |
| Open Rate | Abertura de newsletter | 20-25% (B2B), 15-20% (B2C) |

### Camada 2: Engajamento
**Pergunta**: "As pessoas estao interagindo com nosso conteudo?"

| Metrica | O Que Mede | Por Que Importa |
|---------|-----------|-----------------|
| Engagement Rate | (Likes+Comments+Saves+Shares)/Reach | Ressonancia do conteudo |
| Save Rate | Saves/Impressoes | Valor de referencia percebido |
| Share Rate | Shares/Impressoes | Identificacao e utilidade |
| Comment Rate | Comments/Impressoes | Provocacao e debate |
| Click-Through Rate | Cliques/Impressoes | Interesse em aprofundar |
| Completion Rate | % video assistido | Retencao de atencao |

### Camada 3: Lead Generation
**Pergunta**: "O conteudo esta gerando leads qualificados?"

| Metrica | O Que Mede |
|---------|-----------|
| Newsletter Signups | Novos assinantes via conteudo |
| Downloads | Materiais ricos baixados |
| DMs Qualificadas | Mensagens com intencao de compra |
| Form Submissions | Formularios preenchidos |
| Demo Requests | Solicitacoes de demonstracao |

### Camada 4: Revenue
**Pergunta**: "O conteudo esta gerando receita?"

| Metrica | O Que Mede |
|---------|-----------|
| Revenue Atribuida | Vendas rastreadas a conteudo |
| Cost per Lead (CPL) | Custo de producao / leads gerados |
| Cost per Acquisition (CPA) | Custo total / clientes adquiridos |
| Content ROI | (Revenue - Custo) / Custo × 100 |
| Customer Lifetime Value via Content | LTV de clientes originados por conteudo |

---

## Metricas de Vaidade vs Metricas de Valor

| Metrica de Vaidade | Metrica de Valor Correspondente |
|--------------------|--------------------------------|
| Followers | Engagement Rate |
| Likes | Saves + Shares |
| Impressoes | Click-Through Rate |
| Pageviews | Time on Page + Conversion Rate |
| Subscribers | Open Rate + Click Rate |

---

## Scorecard Mensal

```
SCORECARD DE CONTEUDO — {MES} {ANO}

| KPI | Meta | Atual | Status | Tendencia |
|-----|------|-------|--------|-----------|
| Engagement Rate | 3.5% | 4.1% | 🟢 | ↑ |
| Save Rate | 2.0% | 1.8% | 🟡 | → |
| Blog Traffic | 5000 | 6200 | 🟢 | ↑ |
| Newsletter Opens | 25% | 22% | 🟡 | ↓ |
| Leads | 50 | 42 | 🟡 | → |
| Revenue Atribuida | R$10k | R$12k | 🟢 | ↑ |
```

---

---

## KPIs por Objetivo de Negocio

| Objetivo | KPIs Primarios | KPIs Secundarios |
|----------|---------------|-----------------|
| **Awareness** | Trafego organico, Impressoes, Alcance | Novos visitantes, Share of voice |
| **Engagement** | Tempo na pagina, Scroll depth, Comentarios | Pages per session, Return rate |
| **Lead Gen** | Conversoes, MQLs, Download de materiais | Form fill rate, Email signups |
| **Nurturing** | Email open rate, CTR, Sequence completion | Content consumption path |
| **Revenue** | Revenue atribuido a conteudo, Deals influenced | Pipeline value, Win rate |
| **Retention** | Churn impactado por conteudo, NPS | Help content usage, Support tickets |

---

## Content Scoring Model

Atribui pontuacao a cada peca baseada em performance real:

```
Score = (Trafego x 0.2) + (Engajamento x 0.2) + (Conversao x 0.3) + (Revenue x 0.3)

Onde cada fator e normalizado de 0-100:
- Trafego: pageviews vs media do site
- Engajamento: tempo na pagina + scroll depth vs media
- Conversao: conversion rate vs media do site
- Revenue: revenue atribuido vs media

Resultado:
- 80-100: Flagship content (proteger, atualizar, ampliar)
- 60-79: Strong performer (otimizar, distribuir mais)
- 40-59: Average (refresh ou repurpose)
- 20-39: Underperformer (diagnosticar, refresh ou retirar)
- 0-19: Dead weight (avaliar remocao ou consolidacao)
```

---

## Content ROI Calculation

### Modelos de Atribuicao

| Modelo | Logica | Favorece |
|--------|--------|---------|
| **First-Touch** | 100% ao primeiro conteudo tocado | Conteudo TOFU |
| **Last-Touch** | 100% ao ultimo antes da conversao | Conteudo BOFU |
| **Multi-Touch Linear** | Valor igual entre todos os touchpoints | Visao equilibrada |
| **Time-Decay** | Mais peso para touchpoints proximos da conversao | Nurturing e BOFU |

### Formula de ROI

```
ROI = ((Receita atribuida - Custo total) / Custo total) x 100

Custo total inclui:
- Salarios da equipe (proporcional ao conteudo)
- Ferramentas e tecnologia
- Freelancers e agencias
- Distribuicao paga (boost, promotion)
- Producao (video, design, audio)

Receita atribuida inclui:
- Vendas diretamente atribuidas (lead veio de conteudo)
- Pipeline influenciado (lead tocou conteudo antes de fechar)
- Retencao atribuida (cliente usou conteudo de suporte)
- Economia em outros canais (menos paid se organico cresce)
```

---

## GA4 Content Grouping

| Grupo | Criterio | Pergunta |
|-------|----------|---------|
| Por pilar | Pilar de conteudo (parametro custom) | Qual pilar gera mais trafego/conversao? |
| Por tipo | Blog, video, case study, landing page | Qual formato performa melhor? |
| Por funil | TOFU, MOFU, BOFU | Onde esta o gap no funil? |
| Por autor | Quem escreveu | Qual autor gera mais resultados? |
| Por data | Mes/trimestre de publicacao | Qual o tempo de maturacao? |
| Por cluster | Pillar page + clusters | Qual topic cluster tem melhor ROI? |

---

## Heat Maps e Comportamento

Ferramentas: Hotjar, Microsoft Clarity, Lucky Orange.

**Insights acionaveis:**
- **Scroll depth:** Se 70% dos leitores nao passam de 30% do artigo, o inicio nao engaja ou conteudo e longo demais
- **Click maps:** CTAs funcionando? Links internos recebendo cliques?
- **Rage clicks:** Cliques frustrados em elementos nao-clicaveis (UX problem)
- **Session recordings:** Assistir usuarios reais lendo seu conteudo (insights qualitativos)

---

## Referências

- Avinash Kaushik — Web Analytics 2.0
- Robert Rose — Content Marketing Measurement, Killing Marketing (2017)
- Content Marketing Institute — metrics that matter (relatorio anual)
- Google Analytics 4 — attribution modeling
- HubSpot — Content attribution models
