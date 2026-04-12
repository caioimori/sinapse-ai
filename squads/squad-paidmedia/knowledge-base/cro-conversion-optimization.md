# CRO Conversion Optimization

## Field Friction Cost Model

### Custo de Friccao por Campo
| Tipo de Campo | Drop-off Estimado | Notas |
|--------------|------------------|-------|
| Nome (first name) | ~3% | Baixa friccao |
| Email | ~3% | Baixa friccao |
| Password | ~5% | Media friccao |
| Telefone | ~12-15% | Alta friccao (privacidade) |
| Empresa | ~8% | Media-alta |
| Cargo | ~6% | Media |
| Endereco completo | ~15-20% | Muito alta |
| CPF/CNPJ | ~20-25% | Muito alta (privacidade) |
| Cartao de credito | ~30-40% | Altissima |
| Textarea (mensagem) | ~8-10% | Media-alta (esforco cognitivo) |

### Formula de Impacto
```
Drop-off estimado = 1 - Produto(1 - custo_campo_i) para todos os campos

Exemplo com 5 campos (nome, email, phone, empresa, cargo):
Drop-off = 1 - (0.97 × 0.97 × 0.85 × 0.92 × 0.94) = ~30%
```

### Decision Framework
- **Cada campo deve justificar seu custo.** Se a informacao pode ser coletada depois → remover do form
- **ROI do campo:** o dado coletado vale mais que os leads perdidos?
- **Phone field:** se nao vai ligar nas primeiras 24h, nao peca

## Progressive Profiling Strategy

### Modelo de 4 Momentos
```
Momento 1 (Signup): MINIMO
├── Nome
├── Email
└── Password (ou social login)

Momento 2 (Onboarding, D0-D1): CONTEXTO
├── Empresa (se B2B)
├── Cargo
└── Tamanho da empresa

Momento 3 (In-App, D3-D7): USO
├── Use case / objetivo
├── Industria
└── Como conheceu

Momento 4 (Follow-up, D7-D30): QUALIFICACAO
├── Budget estimado
├── Timeline de decisao
└── Decisor ou influenciador
```

### Incentivos por Momento
- M1: acesso ao produto/trial
- M2: personalizacao da experiencia ("para customizar seu dashboard")
- M3: desbloqueio de feature ou template
- M4: conteudo exclusivo ou consulta gratis

## Signup Methods Comparison

| Metodo | CVR Relativa | Dados | Friccao | Best For |
|--------|-------------|-------|---------|----------|
| Email + password | Baseline (1x) | Nome, email | Media | Default |
| Google OAuth | +20-30% | Nome, email, foto | Baixa | SaaS, B2C |
| Apple Sign-In | +15-25% | Email (pode ser relay) | Baixa | iOS users |
| SSO (SAML/OIDC) | +40-50% | Org-level | Muito baixa | Enterprise |
| Magic Link | +10-15% | Email | Baixa | Password-averse |
| Phone/SMS | +5-10% | Phone number | Media | Mobile-first |
| Social (FB/LinkedIn) | +10-20% | Profile data | Baixa | B2C/B2B |

**Recomendacao:** oferecer Email + Google OAuth como default. Adicionar Apple para iOS.

## Activation Framework

### Definicao de Activation
```
Activation = usuario completou a acao que demonstra que "pegou valor" do produto
```

### Benchmark por Tipo
| Tipo de Produto | Activation Event | Benchmark |
|----------------|-----------------|-----------|
| SaaS | Completou primeiro workflow | 20-40% |
| E-commerce | Primeira compra | 2-5% (de visitor) |
| Marketplace | Primeiro listing ou contato | 15-30% |
| Content/Media | Consumiu 3+ conteudos | 30-50% |
| Fintech | Completou onboarding financeiro | 10-25% |

### Otimizar Time-to-Value
```
Signup → [barreira 1] → [barreira 2] → ... → VALOR!

Objetivo: remover/minimizar barreiras entre signup e primeiro valor

Tecnicas:
1. Pre-popular dados (templates, exemplos)
2. Guided onboarding (wizard, checklist)
3. Skip opcional para steps nao-essenciais
4. "Quick win" antes de onboarding completo
```

## Three Onboarding Models

### 1. PLG (Product-Led Growth) — Self-Serve
- Sem contato humano
- In-app onboarding (checklists, tooltips, empty states)
- Email sequence automatica
- Melhor para: low-touch, self-service, high-volume
- Custo: baixo
- Activation rate tipica: 15-30%

### 2. Hybrid — Self-Serve + Touchpoints
- Onboarding in-app + email sequence + 1 touchpoint humano (call ou chat)
- Trigger para touchpoint: usuario ativo mas nao ativou em 7 dias
- Melhor para: mid-market, SaaS com setup medio
- Custo: medio
- Activation rate tipica: 25-45%

### 3. High-Touch — White-Glove
- Onboarding call dedicado
- Setup assistido por CS
- Treinamento personalizado
- Melhor para: enterprise, alto ticket, complex product
- Custo: alto
- Activation rate tipica: 40-70%

### Selecao por ACV (Annual Contract Value)
| ACV | Modelo | Razao |
|-----|--------|-------|
| <$1K | PLG | Volume alto, custo de touch inviavel |
| $1K-$10K | Hybrid | Balanco entre scale e touch |
| >$10K | High-Touch | Ticket justifica investimento |

## Email Sequence Templates

### Post-Signup Nurture (PLG/Hybrid)
```
D0 (imediato): Welcome + Quick Start Guide
- Subject: "Bem-vindo! Seu primeiro passo em [produto]"
- CTA: completar primeira acao

D1: Primeiro valor
- Subject: "Complete [acao] em 2 minutos"
- CTA: acao de ativacao

D3: Social proof + feature
- Subject: "[Empresa X] aumentou [metrica] em [%] com [produto]"
- CTA: explorar feature

D7: Reminder (se nao ativou)
- Subject: "Ainda nao experimentou [feature]? Veja como"
- CTA: tutorial ou guia

D14: Re-engagement (se inativo)
- Subject: "Sentimos sua falta — aqui esta o que voce perdeu"
- CTA: voltar ao produto

D21: Urgencia (se trial)
- Subject: "Seu trial termina em 7 dias"
- CTA: upgrade

D28: Last chance
- Subject: "Ultimo dia de trial — nao perca [beneficio]"
- CTA: upgrade ou feedback
```

## A/B Testing Statistical Reference

### Confidence Levels
| Confidence | Z-score | Uso |
|-----------|---------|-----|
| 90% | 1.645 | Testes exploratórios |
| 95% | 1.960 | Standard (default) |
| 99% | 2.576 | High-stakes decisions |

### Power Levels
| Power | Z-score | Uso |
|-------|---------|-----|
| 80% | 0.842 | Standard (default) |
| 90% | 1.282 | Importante |
| 95% | 1.645 | Muito importante |

### Regra de Ouro
- **Nao parar cedo (peeking problem):** cada vez que voce olha, aumenta a chance de falso positivo
- **Min 7 dias:** mesmo que sample size atinja antes (day-of-week effect)
- **Nao mudar trafego split:** manter 50/50 durante todo o teste
