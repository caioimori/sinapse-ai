---
task: orchestrate-copy-pipeline
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

# Task: Orchestrate Copy Pipeline

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-strategist (Quill)
- **Complexity:** COMPLEX
- **Depends on:** copy brief aprovado
- **Feeds:** todos os agents do squad

## Objetivo
Orquestrar o pipeline completo de copy — do brief ao copy final revisado — coordenando todos os agents na sequencia correta.

## Entrada
- Copy brief aprovado
- Inputs de cross-squad (research, brand, content)
- Timeline e prioridades

## Passos

### 1. Pipeline Sequencing
```
Brief (Quill) → Headlines (Hook) → Draft (Saga/Spark/Tone) → Persuasion Review (Nudge) → Edit (Chisel) → Final Approval (Quill)
```

### 2. Assignment Matrix

| Tipo de Copy | Lead Writer | Support | Reviewer |
|-------------|:----------:|:-------:|:--------:|
| Sales letter | Saga | Spark, Nudge | Chisel |
| Landing page | Spark | Hook, Nudge | Chisel |
| Email sequence | Spark | Hook, Nudge | Chisel |
| Brand manifesto | Saga | Tone | Chisel |
| Social ads | Spark | Hook | Chisel |
| Blog/content | Saga | Tone | Chisel |
| UI/UX copy | Tone | Spark | Chisel |
| Campaign set | Multi-writer | Hook, Nudge | Chisel |

### 3. Quality Gates
- **Gate 1 (Post-Brief):** Brief complete? Audience clear? Awareness level set?
- **Gate 2 (Post-Headline):** Headlines scored >= 3.5/5? Min 3 variations?
- **Gate 3 (Post-Draft):** On-brief? On-voice? Message hierarchy followed?
- **Gate 4 (Post-Persuasion Review):** Persuasion architecture complete? Ethics passed?
- **Gate 5 (Post-Edit):** 5-pass review complete? Word count target met?

### 4. Iteration Protocol
- Max 3 rounds de revision
- Round 1: Major structural changes
- Round 2: Refinement e polish
- Round 3: Final tweaks only
- Se precisar Round 4+: voltar ao brief (problema de estrategia, nao execucao)

### 5. Delivery
- Copy final em formato definido no brief
- Versoes por canal (se multi-channel)
- A/B test variations (se solicitado)
- Handoff para squad destino com contexto

## Saida
- Copy final revisado e aprovado
- Variacoes por canal (se applicable)
- A/B test suggestions
- Cross-squad handoff artifacts

## Validacao
- [ ] Pipeline completo executado (brief → edit → approval)
- [ ] Todos os quality gates passaram
- [ ] Max 3 rounds de revision
- [ ] Copy final on-brief e on-voice
- [ ] Handoff formatado para destino

---

*Task operada por: copy-strategist (Quill)*
