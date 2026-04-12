---
task: write-email-subject-lines
responsavel: "@headline-specialist"
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

# Task: Write Email Subject Lines

## Metadata
- **Squad:** squad-copy
- **Agent:** headline-specialist (Hook)
- **Complexity:** STANDARD
- **Depends on:** copy brief, email campaign objective
- **Feeds:** conversion-writer (Spark)

## Objetivo
Criar subject lines de email que maximizam open rate — combinando curiosidade, relevancia e urgencia dentro de 50 caracteres.

## Entrada
- Objetivo do email (nurture, launch, promo, re-engagement)
- Audiencia e segmento
- Market awareness level
- Conteudo do email (para alignment)

## Passos

### 1. Definir Subject Line Strategy por Tipo

| Tipo de Email | Strategy | Exemplo |
|--------------|----------|---------|
| Welcome | Warmth + expectation | "Bem-vindo — o que esperar" |
| Nurture | Value + curiosity | "O erro que 73% cometem" |
| Launch | News + excitement | "[NOVO] Apresentamos..." |
| Promo | Benefit + urgency | "Ultimas 24h: 40% off" |
| Cart abandon | Loss aversion | "Voce esqueceu algo..." |
| Re-engagement | Curiosity + FOMO | "Mudamos. Voce vai querer ver" |

### 2. Gerar 15+ Variações
Patterns para subject lines:
- **Curiosity gap:** "O que [X] nao te conta sobre [Y]"
- **Number:** "[X] formas de [beneficio]"
- **Question:** "Voce esta [fazendo erro]?"
- **Personal:** "[Nome], isso e para voce"
- **Urgency:** "Expira hoje: [oferta]"
- **Social proof:** "[N] pessoas ja [acao]"
- **Contrarian:** "Por que [consenso] esta errado"
- **Story tease:** "Como [pessoa] [resultado incrivel]"

### 3. Otimizar para Inbox
- **Max 50 caracteres** (mobile truncation)
- **Preview text:** Complementar, nao repetir subject
- **Emoji:** Max 1, se alinhado com brand voice (testar)
- **Personalizacao:** [Nome] ou [Empresa] aumenta opens
- **Evitar spam triggers:** "GRATIS", "$$", ALL CAPS, !!! excessivo

### 4. Score e Selecionar
- Aplicar headline scoring (adaptado para email)
- Selecionar top 3 para A/B test
- Definir: Test A vs B (1 variavel por teste)
- Min sample: 1000 emails por variante

### 5. Preview Text Pairings
Para cada subject line top:
- Preview text que COMPLEMENTA (nao repete)
- Formato: Subject = hook, Preview = contexto ou benefit
- Max 90 caracteres no preview

## Saida
- 15+ subject line variations
- Top 3 com preview text pairings
- A/B test recommendations
- Spam trigger check passed

## Validacao
- [ ] 15+ variações geradas
- [ ] Max 50 caracteres por subject
- [ ] Preview text complementar definido
- [ ] Spam trigger check
- [ ] A/B test pairs definidos

---

*Task operada por: headline-specialist (Hook)*
