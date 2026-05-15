# Onda 3 — Auditoria de Gaps por Squad (Discovery-only)

**Data:** 2026-05-15
**Escopo:** Auditoria de cobertura de agentes em todas as 18 squads do repo, comparando descrição declarada em `squad.yaml` contra os agentes efetivamente presentes em `agents/`.
**Modo:** Discovery-only — este relatório identifica gaps. NENHUM agente foi criado.
**Onda 3 — Opção 2 (Frente B):** mitigada para discovery, sem proposta executiva imediata.

---

## Metodologia

1. Leitura da `description` e `keywords` de cada `squad.yaml` para extrair as **frentes prometidas**
2. Listagem dos agentes efetivamente em `agents/` (disco)
3. Match: cada frente prometida tem agente especialista? Há gaps de cobertura?
4. Comparação contra squads de referência madura: **squad-brand (15 agents, v3.3)** e **squad-design (11 agents, v2.0)**
5. Severidade:
   - **CRÍTICO:** frente central da descrição sem agente
   - **MÉDIO:** frente secundária sem agente, ou agente único cobrindo 3+ frentes distintas
   - **BAIXO:** redundância suspeita ou nomenclatura inconsistente

---

## Visão Geral — Distribuição de Agentes

| Squad | Agents | Versão | Maturidade |
|---|---:|---|---|
| squad-brand | 15 | 3.3.0 | Referência |
| squad-artdir | 14 | 2.0.0 | Maduro |
| squad-copy | 14 | 2.0.0 | Maduro |
| squad-design | 11 | 2.0.0 | Referência |
| squad-storytelling | 11 | 1.0.0 | Estável |
| squad-commercial | 11 | 1.0.0 | Estável |
| squad-council | 11 | 1.0.0 | Por design |
| squad-paidmedia | 10 | 1.0.0 | Estável |
| squad-animations | 9 | 1.0.0 | Estável |
| squad-cloning | 9 | 1.0.0 | Estável |
| squad-cybersecurity | 9 | 1.0.0 | Estável |
| claude-code-mastery | 8 | 1.0.0 | Estável (pós-cleanup A) |
| squad-courses | 8 | 1.0.0 | Estável |
| squad-research | 8 | 1.0.0 | Estável |
| squad-content | 7 | 2.0.0 | Limítrofe |
| squad-growth | 7 | 1.0.0 | Limítrofe |
| squad-product | 7 | 1.0.0 | Limítrofe |
| **squad-finance** | **5** | **1.0.0** | **Subdimensionada** |

Mediana: 9 agentes. Média: 9,7. Squads abaixo de 7 são candidatas a expansão se a descrição prometer cobertura ampla.

---

## Gaps Identificados por Squad

### squad-finance — 5 agentes — SUBDIMENSIONADA

**Descrição declara:** "rentabilidade, precificação, forecasting, unit economics, controle orçamentário, otimização de custos, dashboards financeiros, pricing models, reports executivos"

**Agentes atuais:** finance-orqx, profitability-analyst, pricing-strategist, revenue-analyst, budget-controller

| Frente prometida | Coberta por | Gap |
|---|---|---|
| Rentabilidade / P&L | profitability-analyst | OK |
| Precificação / pricing tiers | pricing-strategist | OK |
| Forecasting / cenários futuros | revenue-analyst (parcial) | **MÉDIO** — sem `forecast-strategist` dedicado |
| Unit economics | profitability-analyst (sobrecargado) | **MÉDIO** — diluído |
| Controle orçamentário | budget-controller | OK |
| Otimização de custos | Nenhum | **CRÍTICO** — sem `cost-optimizer` |
| Dashboards / reports executivos | finance-orqx (sobrecargado) | **MÉDIO** — sem `financial-storyteller` ou `dashboard-engineer` |
| Auditoria fiscal / compliance fiscal BR | Nenhum | **MÉDIO** — Brasil tem regime fiscal próprio (Simples/Lucro Real/Presumido) |

**Proposta de agentes (não criados):**
- `cost-optimizer` (Trim) — análise de custos, identificação de waste, otimização de spending
- `forecast-strategist` (Horizon) — modelagem de cenários futuros, sazonalidade, what-if
- `fiscal-compliance` (Ledger-BR) — Simples/Presumido/Real, regime tributário, NFe, parcelamentos

**Severidade total:** CRÍTICO (1) + MÉDIO (3)

---

### squad-product — 7 agentes — LIMÍTROFE

**Descrição declara:** "discovery, delivery, analytics, product operations, validação de feature, instrumentação de lançamento, handoff completo"

**Agentes atuais:** product-orqx, ps-client-product-manager, ps-delivery-manager, ps-discovery-lead, ps-product-analyst, ps-product-ops-specialist, ps-product-strategist

| Frente prometida | Coberta por | Gap |
|---|---|---|
| Discovery | ps-discovery-lead | OK |
| Delivery | ps-delivery-manager | OK |
| Analytics | ps-product-analyst | OK |
| Operations | ps-product-ops-specialist | OK |
| Client product mgmt | ps-client-product-manager | OK |
| Strategy | ps-product-strategist | OK |
| User research / qualitative | Nenhum | **MÉDIO** — sem `user-researcher` (entrevistas, JTBD, persona) |
| Product Marketing (positioning, GTM) | Nenhum | **MÉDIO** — sem `product-marketer` |
| Roadmap orchestration | product-orqx (sobrecargado) | **BAIXO** |

**Proposta:** `user-researcher` (Probe), `product-marketer` (Anchor)

**Severidade:** MÉDIO (2)

---

### squad-growth — 7 agentes — LIMÍTROFE

**Descrição declara:** "analytics engineering, CRO, experimentação, SEO, data analysis, growth engineering, data-driven, rastreável, atribuível"

**Agentes atuais:** growth-orqx, ga-analytics-engineer, ga-campaign-analyst, ga-cro-specialist, ga-data-analyst, ga-growth-hacker, ga-seo-strategist

| Frente prometida | Coberta por | Gap |
|---|---|---|
| Analytics engineering | ga-analytics-engineer | OK |
| CRO | ga-cro-specialist | OK |
| SEO | ga-seo-strategist | OK |
| Data analysis | ga-data-analyst | OK |
| Growth hacking | ga-growth-hacker | OK |
| Campaign analysis | ga-campaign-analyst | OK |
| Experimentação (A/B testing rigor) | ga-cro-specialist (sobrecargado) | **MÉDIO** — sem `experimentation-lead` dedicado (statistical significance, MDE, sequential testing) |
| Attribution / mixed media modeling | Nenhum | **MÉDIO** — sem `attribution-analyst` (frente "atribuível" prometida) |
| Lifecycle / retention | Nenhum | **MÉDIO** — sem `lifecycle-strategist` (onboarding, retention, churn) |

**Proposta:** `experimentation-lead` (Rigor), `attribution-analyst` (Trace), `lifecycle-strategist` (Loop)

**Severidade:** MÉDIO (3)

---

### squad-content — 7 agentes — LIMÍTROFE

**Descrição declara:** "detecção de sinais em tempo real, planejamento editorial, produção com Espinha Dorsal, adaptação por plataforma, auditoria de qualidade, medição de performance, retroalimentação sistêmica"

**Agentes atuais:** content-orqx, content-analyst, content-engineer, content-governor, editorial-strategist, platform-specialist, signal-intelligence

| Frente prometida | Coberta por | Gap |
|---|---|---|
| Detecção de sinais | signal-intelligence | OK |
| Planejamento editorial | editorial-strategist | OK |
| Produção (Espinha Dorsal) | content-engineer | OK |
| Adaptação por plataforma | platform-specialist | OK |
| Auditoria de qualidade | content-governor | OK |
| Medição de performance | content-analyst | OK |
| Visual content / carrosséis / thumbnails | Nenhum | **MÉDIO** — sem `visual-content-designer` (sobrepõe parcialmente com squad-artdir, mas no fluxo content é gap) |
| Distribuição multi-canal | platform-specialist (sobrecargado) | **BAIXO** |

**Squad razoavelmente coberta.** Único gap real é visual, e pode ser endereçado por handoff cross-squad em vez de agente novo.

**Severidade:** MÉDIO (1)

---

### squad-courses — 8 agentes — ESTÁVEL

**Descrição declara:** "cursos gravados, escritos, apresentações, material de apoio, assessments, curriculum design, launch strategy"

**Agentes atuais:** courses-orqx, assessment-creator, content-writer, curriculum-designer, launch-strategist, lesson-architect, production-director, slide-designer

| Frente prometida | Coberta por | Gap |
|---|---|---|
| Curriculum / learning paths | curriculum-designer | OK |
| Lesson architecture | lesson-architect | OK |
| Content writing | content-writer | OK |
| Slides | slide-designer | OK |
| Production (video) | production-director | OK |
| Assessment | assessment-creator | OK |
| Launch strategy | launch-strategist | OK |
| Workbooks / ebooks (texto longo educacional) | content-writer (sobrecargado) | **BAIXO** |
| Engagement / retention de alunos | Nenhum | **MÉDIO** — sem `engagement-strategist` (cohort engagement, completion rate) |
| Pedagogia / instructional design | curriculum-designer (sobrecargado) | **BAIXO** |

**Proposta:** `engagement-strategist` (Cohort) se cursos com cohort/live forem foco.

**Severidade:** MÉDIO (1)

---

### squad-research — 8 agentes — ESTÁVEL

**Descrição declara:** "deep research multi-fonte, inteligência de audiência, análise competitiva, sizing de mercado, síntese de dados, forecasting de tendências, Research Depth Pyramid"

**Agentes atuais:** research-orqx, audience-intelligence, competitive-intelligence, data-chief, data-synthesizer, deep-researcher, market-analyst, trend-forecaster

Squad bem coberta. Mas note:

| Frente prometida | Coberta por | Gap |
|---|---|---|
| Deep research multi-fonte | deep-researcher | OK |
| Inteligência de audiência | audience-intelligence | OK |
| Análise competitiva | competitive-intelligence | OK |
| Sizing de mercado | market-analyst | OK |
| Síntese de dados | data-synthesizer | OK |
| Forecasting | trend-forecaster | OK |
| Survey design / quant primary research | Nenhum | **MÉDIO** — sem `survey-designer` (sample size, bias, Likert) |
| Ethnography / qualitative field research | Nenhum | **BAIXO** — handoff pra squad-product ok |

**Proposta:** `survey-designer` (Calibre)

**Severidade:** MÉDIO (1)

---

### squad-commercial — 11 agentes — ESTÁVEL

**Descrição declara:** "CRM, pipeline, funnel architecture, offer design, revenue operations, client success, sales enablement, todo deal qualificado"

**Agentes atuais:** commercial-orqx, cs-business-auditor, cs-client-success, cs-crm-specialist, cs-funnel-architect, cs-lead-generation-strategist, cs-offer-designer, cs-revops-analyst, cs-sales-closer, cs-sales-enablement, legal-chief

Boa cobertura. Único gap notado:

| Frente prometida | Coberta por | Gap |
|---|---|---|
| Sales analytics / forecasting comercial | cs-revops-analyst (parcial) | **BAIXO** |
| Partnership / channel sales | Nenhum | **BAIXO** — não está na descrição |
| Account-based marketing / outbound | cs-lead-generation-strategist (sobrecargado) | **BAIXO** |

**Squad bem dimensionada.** legal-chief é peculiar (jurídico dentro de commercial) — funciona porque contratos saem daqui, mas semanticamente caberia em squad própria se houver volume.

**Severidade:** BAIXO

---

### squad-paidmedia — 10 agentes — ESTÁVEL

**Descrição declara:** "Meta Ads, Google Ads (Search/Display/Shopping/Pmax), CRO, creative strategy, analytics, scaling roadmaps"

**Agentes atuais:** paidmedia-orqx, traffic-masters-chief, campaign-analyst, creative-strategist, cro-specialist, google-ads-specialist, meta-ads-specialist, performance-engineer, pm-creative-performance-analyst, pm-youtube-ads-specialist

| Frente prometida | Coberta por | Gap |
|---|---|---|
| Meta / Google / YouTube | meta-ads, google-ads, pm-youtube-ads | OK |
| CRO em ads | cro-specialist | OK |
| Creative strategy | creative-strategist | OK |
| Analytics | campaign-analyst + pm-creative-performance-analyst | OK |
| TikTok Ads / LinkedIn Ads | Nenhum | **MÉDIO** — sem `tiktok-ads-specialist` ou `linkedin-ads-specialist`. TikTok é canal grande para B2C. LinkedIn é primário B2B. |
| Programmatic / DSPs | Nenhum | **BAIXO** — fora do escopo Caio atual |

**Proposta:** `tiktok-ads-specialist`, `linkedin-ads-specialist`

**Severidade:** MÉDIO (1)

---

### squad-cybersecurity — 9 agentes — ESTÁVEL

**Descrição declara:** "threat analysis, pentesting, SOC operations, incident response, cloud security, network security, compliance"

**Agentes atuais:** cyber-orqx, cyber-chief, cloud-security-engineer, compliance-officer, incident-responder, network-security-engineer, penetration-tester, soc-analyst, threat-analyst

Boa cobertura para cybersec corporativa. Gap específico Brasil:

| Frente prometida | Coberta por | Gap |
|---|---|---|
| Threat / pentesting / SOC / IR / cloud / network / compliance | OK em todos | OK |
| LGPD compliance específico | compliance-officer (genérico) | **BAIXO** — pode delegar pra squad-commercial:legal-chief |
| Application security (SAST/DAST) | Nenhum | **MÉDIO** — sem `app-sec-engineer` (vuln em código, dependency scanning) |
| Identity / IAM | network-security-engineer (parcial) | **BAIXO** |

**Proposta:** `app-sec-engineer` se squad atender produtos com código

**Severidade:** MÉDIO (1)

---

### squad-cloning — 9 agentes — ESTÁVEL

**Descrição declara:** "pipeline cognitivo: extração, modelo mental, vocabulário, 3 tiers de fidelidade (KB-only, Consultant Clone, Full Clone)"

**Agentes atuais:** cloning-orqx, agent-forger, cognitive-extractor, content-capturer, kb-architect, mind-synthesizer, sop-extractor, source-hunter, squad-assembler

Pipeline completo e específico. Sem gaps óbvios.

**Severidade:** OK

---

### squad-storytelling — 11 agentes — ESTÁVEL POR DESIGN

Squad de **mestres reais** (Campbell, Harmon, Snyder, Klaff, Duarte, Hall, Howell, Johnstone, Ganz, Brown — implícito) + orqx + story-chief. Composição é semântica (uma voz por mestre), não funcional. Não cabe avaliar gap de "frente prometida" — a frente é cobrir os 9 mestres listados na descrição.

**Severidade:** OK

---

### squad-council — 11 agentes — ESTÁVEL POR DESIGN

Mesma lógica de storytelling: 11 conselheiros reais (Munger, Naval, Thiel, Dalio, Hoffman, Lencioni, Brown, Sinek, Sivers, Chouinard, council-orqx). Composição semântica.

**Severidade:** OK

---

### squad-brand (15) / squad-design (11) / squad-artdir (14) / squad-copy (14) / squad-animations (9)

**Squads de referência madura.** Cobrem o domínio com agentes especializados em sub-disciplinas. Não há gaps significativos detectados na auditoria deste ciclo.

**Severidade:** OK

---

### claude-code-mastery — 8 agentes — ESTÁVEL (pós-cleanup Frente A)

**Descrição declara:** "hooks, skills, subagents, MCP, plugins, agent teams, customização, integração com projetos, roadmap tracking, SINAPSE awareness"

**Agentes atuais (pós-cleanup):** claude-mastery-chief, config-engineer, hooks-architect, mcp-integrator, project-integrator, roadmap-sentinel, skill-craftsman, swarm-orqx

| Frente prometida | Coberta por | Gap |
|---|---|---|
| Hooks | hooks-architect | OK |
| Skills | skill-craftsman | OK |
| Subagents / agent teams | swarm-orqx | OK |
| MCP | mcp-integrator | OK |
| Customização / config | config-engineer | OK |
| Project integration | project-integrator | OK |
| Roadmap | roadmap-sentinel | OK |
| Plugins (Claude Code plugins, marketplace) | skill-craftsman (sobrecargado) | **BAIXO** |
| Tools authoring (custom Claude tools) | Nenhum | **MÉDIO** — sem `tool-author` (mas baixa demanda atual) |

**Severidade:** MÉDIO (1)

---

## Priorização Recomendada (se houver budget para Onda 4 expansiva)

### CRÍTICO (1)
- **squad-finance:** criar `cost-optimizer` — gap central da descrição

### MÉDIO — Alta prioridade (3-4 agentes)
- **squad-finance:** `forecast-strategist`, `fiscal-compliance-br`
- **squad-growth:** `experimentation-lead` (rigor estatístico é diferencial)
- **squad-paidmedia:** `tiktok-ads-specialist` ou `linkedin-ads-specialist` (escolher pelo perfil do cliente)

### MÉDIO — Prioridade baixa
- squad-product: user-researcher, product-marketer
- squad-growth: attribution-analyst, lifecycle-strategist
- squad-content: visual-content-designer (ou handoff cross-squad)
- squad-courses: engagement-strategist
- squad-research: survey-designer
- squad-cybersecurity: app-sec-engineer

### BAIXO
- claude-code-mastery: tool-author

---

## Conclusão

- **17 squads de 18 estão bem dimensionadas ou bem por design.**
- **squad-finance é a única visivelmente subdimensionada** (5 agentes para 8 frentes prometidas).
- 3 squads no limite inferior (squad-content, squad-growth, squad-product com 7 agents) funcionam mas têm gaps específicos identificados.
- **Squads "semânticas" (council, storytelling)** não devem ser avaliadas por contagem — cada agente é uma voz.

**Próximo passo recomendado (Onda 4 ou posterior):** se Caio quiser expandir, começar por `squad-finance` com 3 agentes (cost-optimizer + forecast-strategist + fiscal-compliance-br) — endereça gap crítico e completa cobertura BR.

**Nenhum agente foi criado neste ciclo. Discovery-only, conforme escopo Opção 2 da Onda 3.**
