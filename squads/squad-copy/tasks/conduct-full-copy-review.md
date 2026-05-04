---
task: conduct-full-copy-review
responsavel: "@copy-editor"
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

# Task: Conduct Full Copy Review (5-Pass)

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor (Chisel)
- **Complexity:** COMPLEX
- **Depends on:** copy completa de qualquer writer
- **Feeds:** writer original, copy-strategist (Quill)

## Objetivo
Conduzir review completo de 5 passadas em qualquer peca de copy — executando todos os 5 passes sequencialmente para entregar copy pronta para publicacao.

## Entrada
- Copy para review completo
- Copy brief original
- Brand voice guidelines
- Plataforma de publicacao

## Passos

### 1. Pass 1 — Strategic Review
**Executa:** `edit-copy-strategic-review.md`
- Alinhamento estrategico (objetivo, audiencia, awareness)
- Estrutura e sequencia
- One Big Idea
- **Gate:** Se ❌ REESCREVER, retornar ao writer

### 2. Pass 2 — Persuasion Review
**Executa:** `edit-copy-persuasion-review.md`
- Headline/hook power
- Body persuasion
- Proof layers
- CTA optimization
- Objection handling
- **Gate:** Se score < 3.5/5, iterar com writer

### 3. Pass 3 — Voice Compliance
**Executa:** `edit-copy-voice-compliance.md`
- Voice attributes present
- Vocabulario check (always/never)
- Tom adequado e consistente
- Formatacao padrao
- **Gate:** Se off-brand, ajustar e re-check

### 4. Pass 4 — Clarity & Impact
**Executa:** `edit-copy-clarity-impact.md`
- Cut fluff (kill darlings)
- Sharpen language
- Optimize rhythm
- Read aloud test
- **Gate:** Se nao natural, mais polimento

### 5. Pass 5 — Technical Check
**Executa:** `edit-copy-technical-check.md`
- Grammar/spelling
- Links/references
- Formatting/limits
- Compliance/legal
- Cross-platform
- **Gate:** Zero erros = APPROVED

### 6. Compilar Full Review Report
```
FULL COPY REVIEW REPORT

Copy: [Nome da peca]
Writer: [Agente]
Editor: Chisel (Copy Editor)
Date: [Data]

═══════════════════════════════════════════

PASS 1 — STRATEGIC REVIEW
  Status: ✅/🔄/❌
  Score: [X/5]
  Notes: [Resumo]

PASS 2 — PERSUASION REVIEW
  Status: ✅/🔄/❌
  Score: [X/5]
  Notes: [Resumo]

PASS 3 — VOICE COMPLIANCE
  Status: ✅/🔄/❌
  Score: [X/5]
  Notes: [Resumo]

PASS 4 — CLARITY & IMPACT
  Status: ✅/🔄/❌
  Score: [X/5]
  Notes: [Resumo]

PASS 5 — TECHNICAL CHECK
  Status: ✅/🔄/❌
  Errors found: [N]
  Notes: [Resumo]

═══════════════════════════════════════════

OVERALL SCORE: [X/5]
TOTAL EDITS: [N]

VEREDICTO FINAL:
  ✅ APPROVED — Ready for publication
  🔄 REVISE — [Passes that need rework]
  ❌ REWRITE — [Fundamental issues]

KEY IMPROVEMENTS MADE:
  1. [Melhoria mais significativa]
  2. [Segunda]
  3. [Terceira]

LEARNINGS FOR WRITER:
  1. [Padrao a melhorar]
  2. [Forca a manter]
```

## Cross-Squad Handoff
```yaml
handoffs:
  - to: copy-strategist (Quill)
    delivers: Copy aprovada ou report de revisao
    format: Full review report + copy final
  - to: squad-design
    delivers: Copy pronta para implementacao
    format: Copy final aprovada + specs tecnicas
```

## Saida
- Full copy review report
- Copy final editada (se approved)
- Before/after highlights
- Learnings para writer

## Validacao
- [ ] 5 passes executados sequencialmente
- [ ] Score por pass documentado
- [ ] Overall score >= 4.0 para aprovacao
- [ ] Zero erros tecnicos (Pass 5)
- [ ] Veredicto final claro
- [ ] Learnings para writer documentados
- [ ] Copy final salva e versionada

---

*Task operada por: copy-editor (Chisel)*
