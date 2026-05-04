# Knowledge Base: Viral & Referral Mechanics

> Fonte: Andrew Chen ("The Cold Start Problem"), Reforge, casos Dropbox/PayPal/Airbnb

## Tipos de Viralidade

Viralidade e quando usuarios existentes trazem novos usuarios como parte natural do uso do produto. Diferente de "marketing boca a boca" (passivo), viralidade engenheirada e um mecanismo sistematico embutido no produto.

| Tipo | Mecanismo | Exemplo |
|------|-----------|---------|
| **Inherent viral** | Uso do produto expoe nao-usuarios | Zoom (convidados entram), Calendly |
| **Collaboration viral** | Colaboracao requer convidar outros | Google Docs, Figma, Slack |
| **Word-of-mouth viral** | Produto tao bom que usuarios falam sobre | Tesla, Superhuman |
| **Incentivized viral** | Recompensa por indicacoes | Dropbox (espaco extra), Uber (creditos) |
| **Social viral** | Compartilhamento gera exposicao | Spotify Wrapped, Canva designs |

---

## K-Factor e Viral Coefficient

```
K = i × c

i = convites medios enviados por usuario
c = taxa de conversao dos convites

Tempo de ciclo viral = tempo medio para um novo usuario convidar outros
```

**Interpretacao:**
| K-factor | Significado |
|----------|-------------|
| K > 1 | Crescimento viral sustentavel (raro e poderoso) |
| K = 0.5–0.9 | Viralidade amplifica outros canais significativamente |
| K = 0.1–0.4 | Viralidade contribui mas nao lidera |
| K < 0.1 | Viralidade insignificante |

**O tempo de ciclo importa tanto quanto o K-factor.** Um K de 0.8 com ciclo de 1 dia e mais poderoso que K de 1.2 com ciclo de 30 dias, porque o compound effect do ciclo rapido domina.

**Formula de crescimento com viralidade:**
```
Usuarios(t) = Usuarios(0) × (K^t - 1) / (K - 1)   [se K ≠ 1]
Usuarios(t) = Usuarios(0) × (1 + K)^t               [aproximacao composta]

Para K = 0.5, 100 usuarios seed, 4 ciclos:
Ciclo 0: 100
Ciclo 1: 100 + 50 = 150
Ciclo 2: 150 + 75 = 225
Ciclo 3: 225 + 112 = 337
```

---

## Design de Programas de Referral

### Elementos de um programa de referral eficaz

1. **Incentivo claro** — O que o usuario ganha por indicar
2. **Double-sided rewards** — Beneficio para quem indica E para quem e indicado
3. **Friccao minima** — Compartilhar deve ser 1-2 cliques
4. **Timing certo** — Pedir referral apos "aha moment", nao durante onboarding
5. **Tracking transparente** — O usuario vê seu progresso e recompensas
6. **Social proof** — Mostrar quantos amigos ja usam

### Cases classicos com resultados documentados

| Empresa | Mecanismo | Resultado |
|---------|-----------|-----------|
| **Dropbox** | 500MB gratis por indicacao (ambos os lados) | 3900% crescimento em 15 meses |
| **PayPal** | $10 para quem indica + $10 para indicado | Crescimento de 7-10% ao dia no inicio |
| **Uber** | Credito de corrida para ambos | Motor principal de expansao inicial |
| **Airbnb** | $25 em credito de viagem | 25% dos novos usuarios via referral em mercados maduros |
| **Revolut** | Cartao gratuito + features premium | 55% dos novos clientes via referral |
| **Cash App** | $5 para ambos | 1.5M+ downloads pela campanha referral |

---

## Tipos de Incentivo

| Tipo | Vantagem | Desvantagem | Quando usar |
|------|----------|-------------|-------------|
| **Cash/Credit** | Motivacao universal, facil de entender | Custo alto, atrai "deal seekers" | E-commerce, fintech, marketplace |
| **Product feature** | Alinhado com valor do produto | Pode ser insuficiente | SaaS com features escalaveis |
| **Status/Recognition** | Custo zero, motivacao intrinseca | Funciona apenas em comunidades | Developer tools, comunidades |
| **Donation** | Feel-good, alinhamento de valores | Motivacao limitada | Produtos com valores sociais |
| **Tiered rewards** | Gamificacao, engagement crescente | Complexidade de implementacao | Programas de fidelidade |

### Behavioral Economics aplicado a referral

- **Loss aversion** — "Voce vai perder X" > "Voce pode ganhar X"
- **Social proof** — "32 dos seus contatos ja usam"
- **Reciprocity** — "Seu amigo te deu um presente"
- **Scarcity** — "Oferta limitada de convites" (Superhuman usou isso para criar exclusividade)
- **Commitment** — Usuario que ja indicou e mais leal ao produto

---

## Virality Engineering — Como Embutir no Produto

### Inherent Virality checklist
```
□ O produto requer outras pessoas para funcionar?
□ O uso natural do produto expoe nao-usuarios?
□ Convidados recebem valor IMEDIATO ao entrar?
□ O processo de convite e < 2 cliques?
□ O loop fecha rapidamente (< 7 dias)?
```

### Viral Loop Mapping

```
[Trigger]          → [Acao de share]      → [Landing experience] → [Conversao]
Usuario satisfeito → Compartilha Spotify  → Ouve playlist        → Cria conta
                    Wrapped                 compartilhada          Spotify
```

Para cada produto, mapear:
1. Quando o usuario esta mais satisfeito? (trigger)
2. Qual e a acao de share mais natural? (compartilhar, convidar, mencionar)
3. Qual e a experiencia de quem recebe? (deve ter valor proprio)
4. O que converte o receptor em novo usuario?

---

## Metricas de Referral

```
Referral Rate = Usuarios vindos de referral / Total de novos usuarios × 100

K-factor = Convites enviados por usuario × Taxa de conversao dos convites

Viral Cycle Time = Tempo medio para um novo usuario indicar outros
```

**Benchmarks por tipo de produto (Reforge/Lenny's Newsletter):**
| Tipo de produto | Referral Rate saudavel | K-factor tipico |
|-----------------|----------------------|-----------------|
| Consumer social | >30% | 0.3–0.8 |
| SaaS B2B | >20% | 0.1–0.4 |
| E-commerce | >10% | 0.05–0.2 |
| Fintech | >25% | 0.2–0.6 |

---

## Programas de Referral — Stack Tecnico

| Plataforma | Foco | Quando usar |
|-----------|------|-------------|
| **Referral Rock** | SMB, facilidade | Times sem engineering |
| **Extole** | Enterprise, customizavel | Grandes volumes |
| **Friendbuy** | E-commerce | Lojas online |
| **Ambassador** | B2B, afiliados | Programas de parceiros |
| **ReferralHero** | Self-serve, moderno | Startups |
| **Custom (interno)** | Controle total | Quando referral e core business |

**Para o contexto brasileiro:**
- Integrar com WhatsApp (canal #1 de compartilhamento no BR)
- Permitir compartilhamento via Pix (QR codes, link de pagamento referral)
- Checkout simplificado com CPF (eliminacao de friccao)
