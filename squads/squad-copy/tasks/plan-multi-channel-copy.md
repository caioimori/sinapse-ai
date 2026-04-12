---
task: plan-multi-channel-copy
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

# Task: Plan Multi-Channel Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-strategist (Quill)
- **Complexity:** STANDARD
- **Depends on:** message hierarchy, brand voice
- **Feeds:** todos os writers, content-intelligence

## Objetivo
Planejar copy para multiplos canais mantendo consistencia de mensagem enquanto adapta formato, tom e profundidade para cada canal.

## Entrada
- Message hierarchy definida
- Brand voice guidelines
- Canais ativos da marca
- Audience por canal

## Passos

### 1. Mapear Canais e Audiencia

| Canal | Audiencia | Awareness Level | Tone | Formato |
|-------|----------|:--------------:|------|---------|
| Website | Mista | Solution-Product | Professional | Long/medium |
| Email | Product+ | Product-Most | Personal | Medium |
| LinkedIn | B2B | Problem-Solution | Authoritative | Short-medium |
| Instagram | B2C | Unaware-Problem | Casual | Short + visual |
| Google Ads | Problem+ | Problem-Product | Direct | Ultra-short |
| Blog | Problem-Solution | Problem-Solution | Educational | Long |

### 2. Adaptar Message por Canal
- **Core message e UNICA** (One Big Idea nao muda)
- **Key messages se adaptam** ao awareness level do canal
- **Proof points variam** por relevancia no canal
- **Tone se ajusta** conforme guidelines do Tone agent
- **CTA muda** conforme proximity to conversion

### 3. Content Cascade Model
```
ONE BIG IDEA
├── Long-form (blog, whitepaper, sales page)
│   ├── All key messages + proof points
│   └── Adaptacao: Medium-form (email, social long)
│       ├── 1-2 key messages + key proof
│       └── Adaptacao: Short-form (ad, tweet, CTA)
│           └── Headline + 1 benefit + CTA
```

### 4. Cross-Channel Copy Calendar
- Sequenciar publicacoes para construir awareness progressivamente
- Canal de topo (social, ads) → Canal de meio (email, blog) → Canal de fundo (LP, sales page)
- Cada peca referencia ou complementa as outras
- Retargeting copy adapta baseado em interacao anterior

### 5. Distribuir para Writers
- Hook: Headlines e hooks por canal
- Saga: Long-form pieces
- Spark: Conversion pieces (LP, emails, ads)
- Tone: Voice calibration por canal
- Chisel: Review cross-channel consistency

## Saida
- Multi-channel copy plan com canais mapeados
- Message adaptation matrix
- Content cascade model
- Copy calendar com sequenciamento
- Assignments por writer

## Validacao
- [ ] Core message consistente em todos os canais
- [ ] Awareness level correto por canal
- [ ] Tone adaptado por canal (mas voice consistente)
- [ ] CTA appropriate por canal
- [ ] Writers designados com deadlines

---

*Task operada por: copy-strategist (Quill)*
