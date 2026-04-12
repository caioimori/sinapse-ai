---
task: conduct-dx-quality-gate
responsavel: "@design-orqx"
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

# Task: Conduct DX Quality Gate

## Metadata
- **Squad:** squad-design
- **Agent:** Nexus (design-orqx)
- **Complexity:** Complex

## Objetivo
Executar o gate de qualidade integrado do squad — consolidando resultados de accessibility (Beacon), performance (Apex) e quality checks dos demais agentes em um verdict unificado.

## Entrada
- Deliverables da fase atual do pipeline
- Resultados parciais de cada agente especialista
- Quality criteria definidos no DX Brief
- Previous gate results (se iteracao)

## Passos

### 1. Coletar Resultados por Disciplina
| Agente | Gate | Criterio | Bloqueante? |
|--------|------|----------|-------------|
| Beacon | Accessibility | WCAG 2.2 AA | SIM |
| Apex | Performance | CWV targets | SIM |
| Compass | UX Quality | Heuristic score >= 7/10 | NAO |
| Canvas | Visual Quality | Design fidelity >= 95% | NAO |
| Stratum | System Health | Token coverage, API consistency | NAO |
| Scaffold | Code Quality | Lint pass, test coverage >= 80% | NAO |
| Kinetic | Motion Quality | 60fps, reduced-motion support | NAO |

### 2. Avaliar Gates Bloqueantes
Os dois gates INEGOCIAVEIS:

**Accessibility Gate (Beacon):**
| Verdict | Criterio | Acao |
|---------|----------|------|
| PASS | 0 critical, 0 major, Lighthouse a11y >= 95 | Prosseguir |
| CONDITIONAL | 0 critical, <= 3 major com remediation plan | Prosseguir com timeline |
| FAIL | Qualquer critical OU > 3 major | BLOQUEAR entrega |

**Performance Gate (Apex):**
| Verdict | Criterio | Acao |
|---------|----------|------|
| CERTIFIED | LCP < 2.5s, INP < 200ms, CLS < 0.1 | Prosseguir |
| EXCEEDS_BUDGET | Qualquer CWV amarelo (p75) | Remediation required |
| FAIL | Qualquer CWV vermelho (p75) | BLOQUEAR entrega |

### 3. Consolidar Verdict
```yaml
quality_gate:
  phase: ""
  date: ""

  blocking_gates:
    accessibility:
      verdict: "[PASS/CONDITIONAL/FAIL]"
      details: ""
    performance:
      verdict: "[CERTIFIED/EXCEEDS_BUDGET/FAIL]"
      details: ""

  non_blocking_gates:
    ux_quality: "[score/10]"
    visual_quality: "[percentage]"
    system_health: "[score]"
    code_quality: "[pass/fail + coverage]"
    motion_quality: "[pass/fail]"

  overall_verdict: "[GO/CONDITIONAL_GO/NO_GO]"
  conditions: []
  blockers: []
```

### 4. Determinar Verdict Final
| Accessibility | Performance | Overall | Acao |
|--------------|-------------|---------|------|
| PASS | CERTIFIED | GO | Prosseguir para proxima fase |
| PASS | EXCEEDS_BUDGET | CONDITIONAL_GO | Remediation antes de deploy |
| CONDITIONAL | CERTIFIED | CONDITIONAL_GO | Fix a11y issues com timeline |
| FAIL | ANY | NO_GO | Retornar para remediacao |
| ANY | FAIL | NO_GO | Retornar para otimizacao |

### 5. Comunicar Resultado
- Notificar todos os agentes envolvidos
- Se NO_GO: detalhar blockers e responsaveis
- Se CONDITIONAL_GO: documentar conditions e timeline
- Atualizar pipeline status

## Saida
- Quality gate report consolidado
- Verdict (GO / CONDITIONAL_GO / NO_GO)
- Action items por agente (se aplicavel)
- Pipeline status atualizado

## Validacao
- [ ] Todos os gates bloqueantes avaliados
- [ ] Non-blocking gates reportados
- [ ] Verdict consolidado e documentado
- [ ] Stakeholders notificados
- [ ] Action items atribuidos (se NO_GO)
