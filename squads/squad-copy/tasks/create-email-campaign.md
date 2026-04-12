---
task: create-email-campaign
responsavel: "@conversion-writer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Create Email Campaign

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** STANDARD
- **Depends on:** copy brief, audience segments, oferta
- **Feeds:** persuasion-psychologist (Nudge), copy-editor (Chisel)

## Objetivo
Criar campanha de email focada em conversao — emails promocionais, launch emails e emails de oferta que geram acao imediata. Diferente de nurture (Saga): foco em conversao direta.

## Entrada
- Oferta/promocao especifica
- Segmento de audiencia
- Deadline/urgencia (se aplicavel)
- Message hierarchy
- Benchmarks anteriores

## Passos

### 1. Definir Tipo de Campanha
| Tipo | Emails | Cadencia | Intensidade |
|------|--------|----------|-------------|
| Flash Sale | 2-3 | 24-48h | Alta |
| Product Launch | 5-8 | 7-14 dias | Crescente |
| Seasonal | 3-5 | 5-7 dias | Media |
| Evergreen Promo | 3-4 | 3-5 dias | Moderada |
| Re-engagement | 3-5 | 3-7 dias | Decrescente |

### 2. Mapear Sequencia Persuasiva
**Progressao tipica de campanha:**
```
Email 1: ANNOUNCE (Novidade + Beneficio principal)
  → "Algo grande esta chegando..." ou revelacao direta

Email 2: EDUCATE (Por que importa + Prova)
  → Deep dive no beneficio, case study, demo

Email 3: OVERCOME (Objecoes + Social proof)
  → FAQ, testimonials, garantia

Email 4: URGENCY (Deadline + Escassez)
  → Contagem regressiva, vagas limitadas

Email 5: LAST CALL (Ultima chance + Recapitulacao)
  → Resume tudo, urgencia maxima, CTA final
```

### 3. Escrever Cada Email
**Estrutura por email:**

**Subject Line (max 50 caracteres):**
- Curiosidade: "O que mudou desde ontem"
- Beneficio: "Sua chance de [resultado]"
- Urgencia: "Termina em 6h"
- Pessoal: "Reservei isso pra voce"
- Pergunta: "Voce ja [acao desejada]?"

**Preview Text (40-90 caracteres):**
- COMPLEMENTA subject (nao repete)
- Adiciona contexto ou beneficio extra
- Funciona como "segundo subject line"

**Opening Hook (2-3 linhas):**
- Direto ao ponto (emails promo nao sao para educação)
- Conecta com dor ou desejo
- Personalizado quando possível

**Body (150-400 palavras):**
- 1 ideia, 1 oferta, 1 CTA
- Bullets para beneficios
- Bold para key phrases
- Whitespace generoso

**CTA (1 principal):**
- Botao + link texto (2 formatos)
- Copy action-oriented: "Garantir Minha Vaga"
- Abaixo do CTA: friction reducer

**PS:**
- Segundo elemento mais lido
- Use para: urgencia, bonus, ou testimonial

### 4. Personalizar por Segmento
**Variaveis de personalizacao:**
| Variavel | Exemplo | Impacto |
|----------|---------|---------|
| Nome | "Oi, [Nome]" | +10-15% open rate |
| Comportamento | "Voce viu [produto] mas..." | +20-30% click rate |
| Segmento | Copy especifica por industria | +15-25% conversion |
| Historico | "Como [marca] que voce usa..." | +10-20% relevancia |

**Segmentacao de campanha:**
- Quem ja comprou (upsell copy)
- Quem quase comprou (abandono copy)
- Quem nunca comprou (aquisicao copy)
- Quem esta inativo (reativacao copy)

### 5. Otimizar Deliverability
**Checklist anti-spam:**
- [ ] Ratio texto/imagem > 60/40
- [ ] Sem palavras trigger (GRATIS, URGENTE, $$)
- [ ] Link de unsubscribe visivel
- [ ] From name reconhecivel
- [ ] Sem ALL CAPS excessivo
- [ ] Testado em multiple clients (Gmail, Outlook, Apple)
- [ ] Peso total < 100KB

**A/B Testing por email:**
- Subject line: variante A vs B
- Send time: manha vs tarde
- CTA: copy variante A vs B
- Formato: texto puro vs HTML rico

## Cross-Squad Handoff
```yaml
handoffs:
  - to: persuasion-psychologist (Nudge)
    delivers: Campanha para review de persuasao
    format: Sequencia completa com metricas-alvo
  - to: squad-growth
    delivers: Campanha para tracking e analise
    format: Emails + segmentos + KPIs
```

## Saida
- Campanha completa (3-8 emails)
- Subject lines + preview text
- Segmentacao definida
- A/B test plan
- Timeline de envio

## Validacao
- [ ] Sequencia persuasiva coerente
- [ ] 1 ideia + 1 CTA por email
- [ ] Subject lines < 50 caracteres
- [ ] Preview text complementar
- [ ] Personalizacao por segmento
- [ ] Urgencia real (nao fabricada)
- [ ] Anti-spam checklist completo
- [ ] A/B tests definidos
- [ ] Timeline e cadencia otimizadas

---

*Task operada por: conversion-writer (Spark)*
