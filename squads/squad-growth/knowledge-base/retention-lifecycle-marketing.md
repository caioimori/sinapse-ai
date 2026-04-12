# Knowledge Base: Retention & Lifecycle Marketing

> Fonte: Nir Eyal "Hooked" (2014), Casey Winters (Pinterest, Grubhub), Elena Verna, Reforge

## Retencao como Fundamento do Growth

Casey Winters: "Se voce nao consegue reter usuarios, voce nao tem um negocio — voce tem um vazamento."

**A curva de retencao e o grafico mais importante em growth:**
- Curva que estabiliza (flattens) = product-market fit
- Curva que vai a zero = problema estrutural no produto

**Tipos de retencao:**
| Tipo | O que mede | Metrica |
|------|-----------|---------|
| **User retention** | O usuario retorna ao produto | DAU/MAU, D1/D7/D30 |
| **Revenue retention** | A receita se mantem/expande | MRR retention, NRR |
| **Engagement retention** | O nivel de uso se mantem | Sessions/user, features used |

**Benchmarks de retencao (Lenny Rachitsky, 2025):**
| Tipo de produto | D1 | D7 | D30 |
|----------------|----|----|-----|
| Consumer social/mobile | 25-45% | 10-25% | 5-15% |
| SaaS B2B | 40-60% | 20-35% | 10-25% |
| E-commerce | 30-50% | 15-30% | 8-20% |

---

## Hook Model (Nir Eyal — "Hooked", 2014)

Como produtos criam habitos em 4 fases:

```
Trigger → Action → Variable Reward → Investment
   ↑                                        |
   └────────────────────────────────────────┘
```

### 1. Trigger (Gatilho)
| Tipo | Descricao | Objetivo |
|------|-----------|----------|
| **Externo** | Push notification, email, ad, mencao social | Initiar o loop nos primeiros usos |
| **Interno** | Tedio, solidao, incerteza, FOMO | Objetivo final — usuario se auto-aciona |

Evolucao: Produto deve graduar o usuario de triggers externos para internos. Quando o usuario abre Instagram ao se sentir entediado (sem notificacao), o trigger interno foi criado.

### 2. Action (Acao)
- O comportamento mais simples em antecipacao de recompensa
- BJ Fogg: B = MAT (Motivation × Ability × Trigger)
- Deve ser extremamente facil
- Exemplos: abrir app, scrollar feed, digitar busca

### 3. Variable Reward (Recompensa Variavel)
A variabilidade e crucial — recompensas previsiveis perdem efeito (Skinner, psicologia comportamental).

| Tipo | Descricao | Exemplo |
|------|-----------|---------|
| **Tribe** | Reconhecimento social | Likes, comentarios, resposta de amigo |
| **Hunt** | Busca por recursos/informacao | Scroll infinito, search results |
| **Self** | Dominio pessoal, competencia | Gamificacao, progresso, conquistas |

### 4. Investment (Investimento)
O usuario investe algo que aumenta switching costs e probabilidade de retorno.
- **Tempo:** Completar perfil, configurar workspace
- **Dados:** Adicionar itens, customizar preferencias
- **Conteudo:** Criar posts, uploads
- **Reputacao:** Seguidores, reviews, credibilidade
- **Social:** Adicionar amigos, conexoes

---

## Lifecycle Marketing

### Fases do ciclo de vida e estrategias

| Fase | Periodo | Objetivo | Canais | Exemplos de Acoes |
|------|---------|----------|--------|------------------|
| **Onboarding** | D0-D7 | Ativacao, primeiro valor | Email, in-app, push | Tutorial interativo, checklist |
| **Activation** | D7-D30 | Habito, uso recorrente | Email, in-app | Tips de features, case studies |
| **Growth** | D30-D90 | Expansao, upgrade | Email, in-app, sales | PQL triggers, trial de features premium |
| **Maturity** | D90+ | Retencao, advocacy | Email, community | NPS, referral, conteudo avancado |
| **Decline** | Queda em uso | Re-engagement | Email, push, retargeting | "Sentimos sua falta", novidades |
| **Churn** | Inativo | Resurrection | Email, ads | Win-back offer, novo feature |

### Drip Campaign Framework (Onboarding)

```
Dia 0:  Welcome + Quick Win (valor imediato)
Dia 2:  Feature highlight #1 (core value)
Dia 5:  Case study (social proof)
Dia 8:  Feature highlight #2 (secondary value)
Dia 12: Educational content (thought leadership)
Dia 15: Upgrade offer / CTA principal
Dia 20: Final follow-up (urgencia)
```

---

## Churn Analysis

### Tipos de churn
| Tipo | Descricao | Como reduzir |
|------|-----------|-------------|
| **Voluntary churn** | Usuario decide sair | Melhorar produto, customer success |
| **Involuntary churn** | Falha de pagamento, cartao expirado | Dunning emails, Smart Retry |
| **Logo churn** | Clientes perdidos (headcount) | Monitorar sinal de alerta |
| **Revenue churn** | Receita perdida | Pode ser diferente de logo churn |

### Involuntary Churn — Dunning
- Representa 20-40% do churn total em SaaS
- **Dunning** = sequencia de emails para recuperar pagamentos falhados
- Smart Retry: testar diferentes horarios/dias para reprocessar cartao
- Alertas proativos antes de expirar

### Metodos de Analise de Churn
1. **Survival analysis** — Kaplan-Meier curves para estimar probabilidade de churn ao longo do tempo
2. **Cohort analysis** — Retencao por cohort para identificar tendencias
3. **Behavioral segmentation** — Quais comportamentos precedem churn?
4. **Exit surveys** — Perguntar diretamente por que o usuario esta saindo
5. **Predictive modeling** — ML para identificar usuarios em risco antes do churn

### Sinais de churn (leading indicators)
- Queda no login frequency (indicador mais forte)
- Reducao no uso de features core
- Tickets de suporte nao resolvidos
- Nao-adocao de novas features
- Reducao no numero de usuarios ativos na conta
- Mudanca de champion interno (compra enterprise)

### Churn Rate Formulas
```
Monthly Logo Churn = Clientes perdidos no mes / Clientes no inicio do mes × 100

Monthly Revenue Churn = MRR perdido no mes / MRR no inicio do mes × 100

Net Revenue Retention (NRR) = (MRR inicio - churn MRR + expansion MRR) / MRR inicio × 100

Benchmarks NRR: >100% saudavel, >120% excelente, >130% world-class (Bessemer)
```

---

## Resurrection Campaigns

Para reconquistar usuarios que churned ou se tornaram inativos.

### Abordagens por situacao
| Abordagem | Quando usar | Mensagem |
|-----------|-------------|---------|
| **What's new** | Produto melhorou muito | "Desde que voce foi, adicionamos X, Y, Z" |
| **Win-back offer** | Usuario estava satisfeito | Desconto temporario para retornar |
| **Personalized value** | Usuario criou dados no produto | "Seus dados ainda estao aqui" |
| **Social proof** | Produto cresceu muito | "150.000 novas empresas entraram" |
| **New use case** | Usuario tinha caso de uso limitado | Apresentar novo caso de uso |

### Timing de campanha de win-back
```
Dia 1 do churn:    Email transacional de confirmacao (se aplicavel)
Dia 7:             "Sentimos sua falta" + novidades
Dia 30:            Offer de desconto para retornar
Dia 60:            Testemunho de customer relevante
Dia 90:            Final email com oferta especial + ask for feedback
Pos 90 dias:       Transferir para ads retargeting
```

---

## Segmentacao para Lifecycle Marketing

| Criterio | Exemplo | Acao |
|----------|---------|------|
| **Lifecycle stage** | "Trial expira em 3 dias" | Email urgente de upgrade |
| **Comportamental** | "Usou feature X mas nao Y" | Tutorial sobre feature Y |
| **Engagement** | "Abriu ultimos 5 emails" | Oferta exclusiva para engajados |
| **RFM** | "Alto valor, baixa frequencia" | Re-engagement com desconto |
| **Predictive** | "Alta probabilidade de churn" | Intervencao de customer success |
| **Feature adoption** | "Nao usou collaboration features" | Educar sobre casos de uso |

---

## DAU/MAU Ratio — Stickiness Metric

```
DAU/MAU = Usuarios ativos diarios / Usuarios ativos mensais × 100

Benchmarks:
  > 50%: Produto com habito diario (Facebook, WhatsApp)
  > 25%: Bom para SaaS B2B
  > 10%: Aceitavel para SaaS de uso semanal
  < 10%: Sinal de alerta de engajamento baixo
```

**Interpretacao:** DAU/MAU de 50% significa que o usuario medio usa o produto 15 dias por mes (50% × 30 dias). Para produtos de uso diario como comunicacao e social, target deve ser >50%.
