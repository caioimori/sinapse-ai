---
task: create-copy-brief
responsavel: "@copy-strategist"
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

# Task: Create Copy Brief

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-strategist (Quill)
- **Complexity:** STANDARD
- **Depends on:** inputs de research-intelligence e brand-system
- **Feeds:** todos os writers do squad

## Objetivo
Criar brief de copy estrategico que direciona toda a producao de copy — documento que garante que writers entendem audiencia, objetivo, tom e metricas ANTES de escrever.

## Entrada
- Objetivo de negocio (o que queremos alcançar)
- Dados de audiencia (personas, JTBD, pain points — de research-intelligence)
- Brand positioning e voice (de brand-system)
- Canal/formato da peca
- Metricas de sucesso

## Passos

### 1. Definir Objetivo do Copy
- **Primary goal:** O que esta peca deve FAZER? (converter, educar, engajar, reter)
- **Success metric:** Como medimos sucesso? (CTR, conversion rate, engagement, retention)
- **Benchmark:** O que seria "bom"? (industry average, historical performance)
- **One sentence:** "Esta peca deve fazer [audiencia] [acao] porque [razao]"

### 2. Profile da Audiencia
- **Persona:** Qual persona estamos endereçando?
- **Market awareness level (Schwartz):**
  - UNAWARE → Lead with story/problem education
  - PROBLEM AWARE → Lead with agitation + solution tease
  - SOLUTION AWARE → Lead with differentiation
  - PRODUCT AWARE → Lead with offer + proof
  - MOST AWARE → Lead with deal/CTA
- **Language:** Palavras que a audiencia USA (nao que nos usamos)
- **Emotional state:** Como se sentem ANTES de ler?
- **Desired emotional state:** Como devem se sentir DEPOIS?

### 3. Message Architecture
- **One Big Idea:** A unica coisa que queremos que lembrem
- **Key benefit:** O beneficio #1 (nao feature — BENEFICIO)
- **Supporting points (3-5):** Cada um com proof point
- **Proof elements:** Dados, testimonials, awards, case studies
- **Tone direction:** [Voice attribute] adaptado para [contexto]

### 4. Objection Landscape
- **Top 3 objecoes** que a audiencia tera ao ler:
  1. [Objecao] → [Resposta]
  2. [Objecao] → [Resposta]
  3. [Objecao] → [Resposta]
- **Risk reversal:** Garantia, trial, refund policy disponivel?
- **Competitive context:** Audiencia esta comparando com quem?

### 5. Parametros de Execucao
- **Canal:** Web / email / social / ad / print / video script
- **Formato:** Landing page / email / post / ad / sales letter
- **Word count target:** [range]
- **Visual direction:** (se aplicavel)
- **SEO keywords:** (se aplicavel)
- **CTA:** Acao desejada + copy suggestion
- **Deadline:** [data]
- **Writer designado:** [Hook/Saga/Spark/Tone]

## Saida
- Copy brief completo e acionavel
- Message hierarchy definida
- Objection landscape mapeado
- Writer designado com deadline

## Validacao
- [ ] Objetivo SMART definido
- [ ] Market awareness level classificado
- [ ] One Big Idea articulada
- [ ] Objecoes mapeadas com respostas
- [ ] Tone direction alinhada com brand voice
- [ ] Writer designado e deadline definido

---

*Task operada por: copy-strategist (Quill)*
