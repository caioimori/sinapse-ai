---
task: craft-email-nurture-sequence
responsavel: "@long-form-writer"
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

# Task: Craft Email Nurture Sequence

## Metadata
- **Squad:** squad-copy
- **Agent:** long-form-writer (Saga)
- **Complexity:** COMPLEX
- **Depends on:** copy brief, audience persona, message hierarchy
- **Feeds:** conversion-writer (Spark), persuasion-psychologist (Nudge)

## Objetivo
Criar sequencia de emails de nurturing que move leads pelo funil — de awareness ate conversao — usando storytelling, educacao e persuasao progressiva. Cada email e um capitulo de uma narrativa maior.

## Entrada
- Audiencia e awareness level inicial
- Objetivo final (conversao desejada)
- Produto/servico e key benefits
- Objecoes mapeadas
- Trigger de entrada na sequencia

## Passos

### 1. Mapear Jornada de Awareness
**Progressao por email:**
```
Email 1-2: PROBLEM AWARE
  → Reconhecer a dor, criar identificacao
Email 3-4: SOLUTION AWARE
  → Educar sobre abordagem, criar autoridade
Email 5-6: PRODUCT AWARE
  → Apresentar solucao, mostrar diferenciacao
Email 7-8: MOST AWARE
  → Oferta, urgencia, conversao
```

**Cadencia recomendada:**
| Tipo de sequencia | Emails | Cadencia | Duracao |
|-------------------|--------|----------|---------|
| Welcome/Onboarding | 5-7 | Diario → cada 2 dias | 2 semanas |
| Nurture | 8-12 | 2-3x por semana | 3-4 semanas |
| Launch | 5-8 | Diario (com intensificacao) | 5-10 dias |
| Re-engagement | 3-5 | Cada 2-3 dias | 1-2 semanas |

### 2. Definir Arco Narrativo da Sequencia
**A sequencia e uma HISTORIA, nao uma serie de emails isolados:**

**Arco 1 — O Despertar (Emails 1-2):**
- Estabelecer rapport e credibilidade
- Articular a dor que o lead sente
- Plantar semente de curiosidade

**Arco 2 — A Jornada (Emails 3-5):**
- Educar com insights valiosos
- Demonstrar expertise
- Compartilhar stories de transformacao
- Cada email derruba uma objecao

**Arco 3 — A Revelacao (Emails 6-7):**
- Apresentar a solucao
- Mostrar mecanismo unico
- Social proof pesado
- Criar desejo

**Arco 4 — A Decisao (Emails 8+):**
- Oferta clara
- Urgencia real
- Risk reversal (garantia)
- Ultimo push

### 3. Escrever Cada Email
**Estrutura por email:**

```
SUBJECT LINE
  → Gerar abertura (curiosidade, beneficio, urgencia)

PREVIEW TEXT
  → Complementar subject (nao repetir)

OPENING (2-3 linhas)
  → Hook que prende imediatamente
  → Conectar com email anterior (se nao e o primeiro)

BODY (200-500 palavras)
  → 1 ideia principal por email
  → Storytelling OU insight OU proof
  → Transicao natural para CTA

CTA
  → 1 CTA principal (claro, especifico)
  → Link ou botao

PS
  → Segundo elemento mais lido
  → Reforce beneficio OU crie antecipacao para proximo email
```

**Tipos de email no mix:**
| Tipo | Frequencia | Objetivo |
|------|-----------|----------|
| Story email | 30% | Conexao emocional |
| Insight/education | 25% | Autoridade |
| Social proof | 15% | Credibilidade |
| Objection handler | 15% | Eliminar barreiras |
| Offer/CTA | 15% | Conversao |

### 4. Tecnicas de Engagement
**Conectores entre emails:**
- "Amanha vou compartilhar algo que vai mudar como voce pensa sobre [X]..."
- "Lembra do que falei no ultimo email sobre [Y]?"
- "Recebi uma resposta incrivel de [pessoa] sobre o email anterior..."

**Open loops:**
- Criar curiosidade que so sera resolvida no proximo email
- Prometer conteudo futuro especifico
- "Tem uma tecnica que ainda nao compartilhei — e talvez a mais poderosa..."

**Pattern interrupts:**
- Variar comprimento (curto → longo → curto)
- Mudar formato (texto → lista → historia)
- Email inesperado (pessoal, vulneravel, contraintuitivo)

### 5. Otimizacao e Branching
**Metricas por email:**
| Metrica | Benchmark | Acao se abaixo |
|---------|-----------|----------------|
| Open rate | >25% | Testar subject line |
| Click rate | >3% | Melhorar CTA/copy |
| Unsubscribe | <0.5% | Reduzir frequencia |
| Reply rate | >1% | Otimo — manter tom |

**Branching logic:**
- Quem clicou em [X] → sequencia especifica
- Quem nao abriu Email 3 → re-send com novo subject
- Quem clicou mas nao converteu → sequencia de reforco
- Quem respondeu → notificacao para sales

## Cross-Squad Handoff
```yaml
handoffs:
  - to: conversion-writer (Spark)
    delivers: Emails de conversao (ultimos da sequencia)
    format: Brief com contexto dos emails anteriores
  - to: persuasion-psychologist (Nudge)
    delivers: Sequencia para review de progressao persuasiva
    format: Sequencia completa com intencao por email
```

## Saida
- Sequencia completa (5-12 emails)
- Subject lines + preview text por email
- Arco narrativo mapeado
- Branching logic definida
- Metricas-alvo por email

## Validacao
- [ ] Progressao de awareness clara (Problem → Most Aware)
- [ ] Arco narrativo coerente (nao emails isolados)
- [ ] 1 ideia principal por email
- [ ] Mix de tipos equilibrado (story, insight, proof, offer)
- [ ] Open loops entre emails
- [ ] Subject lines testadas (curiosidade + relevancia)
- [ ] CTA claro em cada email
- [ ] PS utilizado estrategicamente
- [ ] Branching logic para engajamento
- [ ] Cadencia apropriada para audiencia

---

*Task operada por: long-form-writer (Saga)*
