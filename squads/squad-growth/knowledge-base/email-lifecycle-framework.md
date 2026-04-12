# Knowledge Base: Email & Lifecycle Marketing Framework

> Fonte: DMA (ROI $38 por $1 investido — 2026), Customer.io, HubSpot, ESP benchmarks

## Email como Canal de Growth

Email continua sendo um dos canais com maior ROI em marketing digital.

**Vantagens do email:**
- **Owned channel** — Voce controla a lista, nao depende de algoritmos
- **Alto ROI** — DMA UK reporta $38 para cada $1 investido (2026)
- **Personalizavel** — Segmentacao e conteudo dinamico
- **Mensuravel** — Open rate, CTR, conversoes facilmente rastreados
- **Lifecycle** — Acompanha todo o ciclo de vida do usuario

**Benchmarks gerais por setor (Mailchimp/Klaviyo — 2025):**
| Setor | Open Rate | CTR | Unsub Rate |
|-------|----------|-----|------------|
| SaaS | 20-28% | 2.5-4% | 0.1-0.3% |
| E-commerce | 15-20% | 2-3% | 0.2-0.5% |
| Educacao | 22-30% | 3-5% | 0.1-0.2% |
| Financeiro | 18-25% | 2-3.5% | 0.2-0.4% |
| Marketing | 17-22% | 1.5-2.5% | 0.3-0.5% |

---

## Segmentacao

Dividir a base de emails em grupos com caracteristicas similares para enviar mensagens mais relevantes.

### Tipos de segmentacao

| Tipo | Criterio | Exemplo de uso |
|------|----------|---------------|
| **Demografico** | Cargo, empresa, setor | "CTOs de startups" |
| **Comportamental** | Acoes no produto | "Usou feature X mas nao Y" |
| **Lifecycle stage** | Fase do usuario | "Trial expira em 3 dias" |
| **Engagement** | Interacao com emails | "Abriu ultimos 5 emails" |
| **RFM** | Recency, Frequency, Monetary | "Alto valor, baixa frequencia" |
| **Predictive** | Probabilidade de acao | "Alta probabilidade de churn" |
| **Source** | Canal de origem | "Veio de webinar vs SEO" |

### Segmentacao por Engajamento (limpeza de lista)
```
Hot (ultimos 30 dias): Abriu ou clicou → Enviar tudo
Warm (31-90 dias): Alguma interacao → Enviar principal
Cold (91-180 dias): Sem interacao → Re-engagement series
Inactive (181+ dias): Sem interacao → Sunset ou remover
```

---

## Automacoes e Drip Campaigns

### Tipos de automacao

| Tipo | Trigger | Exemplo de sequencia |
|------|---------|---------------------|
| **Welcome series** | Sign-up | 5 emails em 14 dias educando |
| **Onboarding** | Acao ou inacao no produto | "Voce ainda nao completou X" |
| **Nurturing** | Lead score muda | Serie de conteudo pre-venda |
| **Re-engagement** | Inatividade | "Sentimos sua falta" series |
| **Upsell** | Comportamento no produto | "Voce atingiu 80% do limite" |
| **Win-back** | Cancelamento | "Desconto especial para retornar" |
| **Transacional** | Acao especifica | Confirmacao, recibo, reset de senha |
| **Milestone** | Data/evento | Aniversario de conta, renovacao |

### Drip Campaign de Onboarding (template)

```
Dia 0:  Welcome + Quick Win (valor imediato — o que voce consegue AGORA)
Dia 2:  Feature highlight #1 (core value — por que isso resolve seu problema)
Dia 5:  Case study (prova social — como [empresa similar] usou para [resultado])
Dia 8:  Feature highlight #2 (secondary value — o que mais voce pode fazer)
Dia 12: Educational content (thought leadership — expertise do produto)
Dia 15: Upgrade offer / CTA principal (urgencia com desconto limitado)
Dia 20: Final follow-up ("Posso ajudar com alguma coisa?")
```

---

## Deliverability — Chegar na Caixa de Entrada

### Fatores que afetam deliverability

| Fator | Impacto | Acao |
|-------|---------|------|
| **SPF, DKIM, DMARC** | Autenticacao do dominio | Configurar todos os tres (obrigatorio desde 2024 para Gmail/Yahoo) |
| **Sender reputation** | Score do IP/dominio | Monitorar com Google Postmaster |
| **Bounce rate** | Emails invalidos | Limpar lista regularmente (<2% hard bounce) |
| **Spam complaints** | Usuarios marcando como spam | < 0.08% (threshold Gmail 2024) |
| **Engagement** | Opens, clicks | Segmentar por engagement, remover inativos |
| **List hygiene** | Qualidade da lista | Remover inativos apos 6 meses |
| **Content** | Palavras-chave de spam | Evitar "GRATIS", caps excessivo, muitas imagens |

### Requisitos Gmail/Yahoo (2024+)
Desde fevereiro 2024, Gmail e Yahoo exigem para remetentes de alto volume:
1. **SPF** — Sender Policy Framework configurado
2. **DKIM** — DomainKeys Identified Mail com chave de 1024+ bits
3. **DMARC** — Policy de pelo menos `p=none` (idealmente `p=quarantine` ou `p=reject`)
4. **Unsubscribe em 1 clique** — Header `List-Unsubscribe-Post` obrigatorio
5. **Spam complaint rate** — Abaixo de 0.3% (threshold), idealmente < 0.08%

### Aquecimento de IP (warm-up)
Para novo IP/dominio, escalar envios gradualmente:
```
Semana 1: 50-200 emails/dia (apenas usuarios mais engajados)
Semana 2: 500-1K emails/dia
Semana 3: 2K-5K emails/dia
Semana 4: 10K-20K emails/dia
Semana 5+: Escalar conforme performance
```

---

## ESPs (Email Service Providers)

| ESP | Foco | Quando usar | Contexto Brasil |
|-----|------|-------------|----------------|
| **Resend** | Developer-first, API moderna | Transacionais + marketing para devs | Alternativa moderna, APIs excelentes |
| **SendGrid** | Volume, APIs | Transacionais em escala | Popular em BR para transacionais |
| **Mailchimp** | SMB, ecommerce | Pequenas empresas, lojas | Facil de usar, integracao Shopify |
| **Customer.io** | Behavioral automation | SaaS com lifecycle complexo | Melhor para startups PLG |
| **Brevo (ex-Sendinblue)** | All-in-one, preco competitivo | SMBs, mercado europeu/BR | Bom preco para BR, LGPD-friendly |
| **ActiveCampaign** | Automation + CRM | SMBs com vendas ativas | Popular em BR com marketing digital |
| **HubSpot Email** | Full marketing suite | Enterprise, integrado com CRM | Caro mas completo |
| **Klaviyo** | E-commerce focused | Lojas online (Shopify, etc.) | Excelente para e-commerce BR |
| **RD Station** | Brasil-focused | Empresas brasileiras | Lider em inbound no BR, 50K+ clientes |

---

## Metricas de Email

### Metricas primarias
```
Open Rate = Emails abertos / Emails entregues × 100

Click-Through Rate (CTR) = Cliques / Emails entregues × 100

Click-to-Open Rate (CTOR) = Cliques / Emails abertos × 100
(Melhor indicador de relevancia do conteudo)

Conversion Rate = Conversoes / Emails entregues × 100

Revenue per Email = Receita gerada / Emails enviados
```

### Metricas de saude da lista
```
Bounce Rate = Bounces / Emails enviados × 100
  Hard bounce (email invalido) < 2% = aceitavel
  Soft bounce (caixa cheia, temporario) < 5% = aceitavel

Unsubscribe Rate = Unsubscribes / Emails entregues × 100
  < 0.5% = aceitavel
  > 1% = sinal de alerta — revisar relevancia

Spam Complaint Rate = Complaints / Emails enviados × 100
  < 0.08% = safe zone (Gmail threshold 2024)
```

---

## Subject Line Best Practices

| Tecnica | Exemplo | Por que funciona |
|---------|---------|-----------------|
| **Curiosidade** | "Isso dobrou nossa conversao em 3 dias" | Cliffhanger — precisam abrir para saber |
| **Personalizacao** | "{nome}, seu trial expira amanha" | Relevancia pessoal aumenta open rate |
| **Numero especifico** | "7 erros que destroem seu funil de vendas" | Especificidade gera credibilidade |
| **Urgencia real** | "Ultima chance: desconto expira meia-noite" | Deadline gera acao — mas so se for real |
| **Pergunta** | "Voce ainda nao fez isso?" | Engaja e causa auto-reflexao |
| **Previa** | "[Video] Como a Hotmart escalou de 0 a R$10M" | Formato conhecido reduz incerteza |

**O que evitar:**
- "RE:" ou "FWD:" falsos (manipulacao — danifica confianca e deliverability)
- CAPS LOCK excessivo
- Mais de 1 emoji por subject line
- Subject lines > 50 caracteres (trunca em mobile)
- Palavras de spam: GRATIS, GANHE, URGENTE, $$, clique aqui

---

## Email para o Contexto Brasileiro

**Especificidades do mercado BR:**
1. **WhatsApp** como complemento — Muitas campanhas usam email + WhatsApp Business
2. **Horarios de envio** — Terça a quinta, 10h-11h ou 14h-15h (BRT) tende a ter melhor performance
3. **Formatos de pagamento** — Email de abandono de carrinho com link de PIX converte mais
4. **LGPD compliance** — Double opt-in recomendado para garantir consentimento documentado
5. **Dispositivos** — 70%+ abre email em mobile — sempre testar responsividade
6. **Linguagem** — Tom mais informal e pessoal funciona melhor no Brasil vs. inglês formal
