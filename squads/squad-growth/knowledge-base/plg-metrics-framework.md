# Knowledge Base: Product-Led Growth (PLG) Metrics Framework

> Fonte principal: Wes Bush "Product-Led Growth" (2019), OpenView Partners, Elena Verna, Kyle Poyar

## O Que e PLG

Product-Led Growth e uma estrategia go-to-market onde o proprio produto e o principal veiculo de aquisicao, conversao e expansao. O termo foi popularizado pela OpenView Partners em 2016 e sistematizado por Wes Bush.

**Principios fundamentais:**
1. O produto e o canal — usuario experimenta valor antes de falar com vendas
2. Self-serve first — onboarding sem fricao, sem demo obrigatoria
3. Time-to-value minimo — usuario atinge o "aha moment" o mais rapido possivel
4. Bottom-up adoption — usuarios individuais adotam, depois a organizacao compra
5. Data-driven expansion — upsell baseado em comportamento, nao em pitch

**Exemplos canonicos:**
| Empresa | Modelo PLG | Mecanismo |
|---------|-----------|-----------|
| Slack | Freemium + viral | Teams adotam, depois compram |
| Zoom | Freemium + viral | Anfitriao usa, convidados experimentam |
| Figma | Freemium + colaboracao | Designers compartilham, times adotam |
| Notion | Freemium + templates | Templates atraem, workflows retêm |
| Calendly | Freemium + viral | Cada agendamento expoe a marca |
| Canva | Freemium + content | Designs compartilhados atraem |
| Loom | Freemium + viral | Cada video enviado e marketing |

---

## Modelos de Monetizacao PLG

### Freemium
- Plano gratuito permanente com limitacoes
- Conversao tipica: 2-5% para planos pagos (faixa "great": 5%+)
- Ideal para: produtos com alto volume e low touch
- Risco: usuarios "free forever" que consomem recursos sem converter

### Free Trial (time-limited)
- Acesso completo por periodo limitado (7, 14, 30 dias)
- Conversao tipica: 8-12% (faixa "good"), 15-25% (faixa "great")
- Ideal para: produtos complexos que precisam de tempo para demonstrar valor
- Risco: pressao temporal pode frustrar usuarios

### Reverse Trial (modelo emergente)
- Usuario comeca com funcionalidades premium, apos periodo faz downgrade para free
- Conversao tipica: 10-15%
- Ideal para: produtos onde o valor premium e claro mas nao imediato
- Usado por: Ahrefs (acesso limitado gratuito com trial premium)

### Hybrid PLG + Sales (PLG + SLG)
- Self-serve para SMBs, sales-assisted para Enterprise
- Usado por: Slack, Notion, Figma, Datadog
- PQLs (Product Qualified Leads) alimentam o time de vendas

---

## Product Qualified Leads (PQLs)

Usuarios que demonstraram intencao de compra atraves de comportamento no produto. Conceito sistematizado pela OpenView Partners.

**Sinais tipicos de PQL:**
- Atingiu limites do plano free
- Convidou X colegas para o workspace
- Usou feature premium durante trial
- Excedeu volume de uso
- Visitou pagina de pricing multiplas vezes
- Exportou dados (sinal de que o dado e valioso)

**PQL Scoring Model:**
| Sinal | Peso | Threshold |
|-------|------|-----------|
| Usuarios no workspace | 5 | >= 5 |
| Features premium usadas | 4 | >= 3 |
| Visitas a pricing page | 3 | >= 2 em 7 dias |
| Tempo ativo semanal | 3 | >= 3 horas |
| Integracoes ativas | 2 | >= 2 |

**PQL vs MQL:**
| Aspecto | MQL (Marketing Qualified Lead) | PQL (Product Qualified Lead) |
|---------|-------------------------------|------------------------------|
| Origem do sinal | Comportamento em marketing (content, form) | Comportamento no produto |
| Intencao | Interesse declarado | Intencao demonstrada por uso |
| Predicao de conversao | Baixa | Alta |
| Ciclo de venda | Mais longo | Mais curto |

---

## Onboarding como Alavanca de Growth

Samuel Hulick (UserOnboard.com) demonstrou que a maioria dos produtos perde 40-60% dos usuarios no primeiro uso.

### Framework de Onboarding
1. **Sign-up Flow** — Minimo de campos. Social login. Sem cartao de credito (para freemium).
2. **Welcome Survey** — 2-3 perguntas para personalizar experiencia (JTBD, role, objetivo).
3. **Setup Checklist** — Passos claros com progresso visual.
4. **Quick Win** — Levar ao primeiro valor em <5 minutos.
5. **Celebrate** — Reforco positivo ao atingir marcos.
6. **Ongoing Education** — Tooltips contextuais, emails educacionais.

### Metricas de Onboarding
| Metrica | Descricao | Benchmark |
|---------|-----------|-----------|
| **Time-to-First-Value (TTFV)** | Tempo ate o usuario atingir o primeiro valor | <5 min (ideal para PLG) |
| **Activation Rate** | % que completa setup critico | >50% e considerado bom |
| **D1 Retention** | % que volta no dia 1 | >40% indica boa ativacao |
| **D7 Retention** | % que volta na semana 1 | >20% para apps, >50% SaaS |
| **D30 Retention** | % que volta no mes 1 | >10% apps, >30% SaaS |
| **Setup Completion Rate** | % que completa todo o onboarding | Meta: >70% |
| **Onboarding drop-off step** | Onde mais usuarios abandonam | Identificar e otimizar |

---

## Metricas Fundamentais PLG

### Activation
```
Activation Rate = Usuarios que atingiram "aha moment" / Total de novos usuarios × 100

"Aha Moment" = primeiro momento em que o usuario experimenta o valor core do produto
```

**Definindo o aha moment:**
- Analise de cohort: quais usuarios D30 ativos completaram qual acao no D1?
- Correlacionar acoes D1 com retencao futura
- Ex: Facebook "7 amigos em 10 dias" (Chamath Palihapitiya)

### Retention (Curva de Retencao)
```
D1 Retention = Usuarios que voltaram no dia 1 / Usuarios que fizeram signup
D7 Retention = Usuarios que voltaram na semana 1 / Usuarios que fizeram signup
D30 Retention = Usuarios que voltaram no mes 1 / Usuarios que fizeram signup

Cohort Retention Rate = Usuarios do cohort ativos no periodo N / Tamanho original do cohort × 100
```

**A curva de retencao e o grafico mais importante em growth:**
- Curva que estabiliza = product-market fit
- Curva que vai a zero = problema estrutural no produto

### Expansion (NRR/NDR)
```
Net Revenue Retention (NRR) = (MRR inicio - churned MRR + expansion MRR) / MRR inicio × 100

NRR > 100% = crescimento sem aquisicao nova (expansion supera churn)
NRR benchmark: >100% saudavel, >120% excelente, >130% world-class
```

---

## Network Effects em PLG (Andrew Chen, "The Cold Start Problem")

**Lei de Metcalfe:** Valor da rede proporcional a n². Cada novo usuario adiciona valor para todos.

**Lei de Reed:** Para redes com grupos, valor cresce exponencialmente (2^n). Cada usuario multiplica possibilidades de subgrupos (WhatsApp groups, Slack channels).

**Tipos de efeitos de rede:**
| Tipo | Descricao | Exemplo |
|------|-----------|---------|
| **Direto** | Mais usuarios = mais valor para cada usuario | WhatsApp, telefone |
| **Indireto (cross-side)** | Mais usuarios de um lado = mais valor para outro | Uber (riders/drivers) |
| **Data network effects** | Mais uso = melhor produto (via dados) | Waze, Google Search |
| **Marketplace** | Liquidity atrai ambos os lados | Airbnb, Amazon |

**Cold Start Problem:** Como comecar uma rede sem usuarios? Estrategias:
1. **Small networks first** — Dominar um nicho pequeno antes de escalar (Uber: cidade por cidade)
2. **Single-player mode** — Produto util mesmo sem outros usuarios (Notion, Dropbox)
3. **Marquee users** — Trazer usuarios de alto valor que atraem outros
4. **Manual outreach** — Crescimento manual ate atingir massa critica

---

## PLG Benchmarks (OpenView Partners, Lenny Rachitsky — 2025)

| Metrica | SaaS B2B | SaaS B2C |
|---------|----------|----------|
| Freemium conversion (free → paid) | 2-5% | 1-3% |
| Trial conversion (trial → paid) | 8-25% | 10-30% |
| D1 Retention | 40-60% | 25-45% |
| D7 Retention | 20-35% | 10-25% |
| D30 Retention | 10-25% | 5-15% |
| NRR (saudavel) | >100% | >90% |
| NRR (excelente) | >120% | >110% |
| Activation Rate (bom) | >50% | >40% |
| Time-to-first-value (ideal PLG) | <5 min | <2 min |
