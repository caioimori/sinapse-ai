---
task: conduct-usability-heuristic-review
responsavel: "@dx-ux-strategist"
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

# Task: Conduct Usability Heuristic Review

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Standard

## Objetivo
Conduzir avaliacao heuristica sistematica do produto usando as 10 Heuristicas de Nielsen e frameworks complementares — identificar problemas de usabilidade sem necessidade de testes com usuarios.

## Entrada
- Produto/prototipo para avaliacao
- Personas definidas
- User flows documentados
- Heuristic checklist

## Passos

### 1. Preparar Avaliacao
- Definir escopo (paginas/fluxos a avaliar)
- Selecionar cenarios representativos por persona
- Preparar template de findings

### 2. Avaliar por Heuristica (Nielsen's 10)

| # | Heuristica | O que verificar |
|---|-----------|----------------|
| H1 | Visibility of System Status | Feedback imediato, loading states, progress indicators |
| H2 | Match Between System & Real World | Linguagem do usuario, metaforas familiares, ordem logica |
| H3 | User Control & Freedom | Undo/redo, cancel, back, escape hatches |
| H4 | Consistency & Standards | Terminologia, layout, interacoes padronizadas |
| H5 | Error Prevention | Confirmacoes, constraints, defaults inteligentes |
| H6 | Recognition Rather Than Recall | Opcoes visiveis, contexto, sugestoes |
| H7 | Flexibility & Efficiency | Shortcuts, customizacao, accelerators |
| H8 | Aesthetic & Minimalist Design | Ruido visual, informacao irrelevante, foco |
| H9 | Help Users Recognize & Recover from Errors | Mensagens claras, diagnostico, solucao |
| H10 | Help & Documentation | Ajuda contextual, onboarding, busca |

### 3. Classificar Severidade
Para cada finding:
| Severity | Score | Descricao |
|----------|-------|-----------|
| Cosmetic | 0 | Nao e realmente um problema |
| Minor | 1 | Problema cosmetico, corrigir se houver tempo |
| Major | 2 | Problema real, prioridade alta |
| Catastrophe | 3 | Problema critico, deve ser corrigido antes do lancamento |
| Usability disaster | 4 | Imperativo corrigir antes de qualquer release |

### 4. Documentar Findings
```yaml
heuristic_finding:
  id: "HF-001"
  heuristic: "H1 — Visibility of System Status"
  severity: 3
  page: ""
  element: ""
  description: ""
  evidence: ""
  recommendation: ""
  effort: "[low/medium/high]"
  screenshot: "[reference]"
```

### 5. Complementar com Laws of UX
Verificar tambem:
- **Fitts's Law:** Alvos de toque adequados?
- **Hick's Law:** Muitas opcoes simultaneas?
- **Miller's Law:** Chunking adequado?
- **Jakob's Law:** Segue convencoes familiares?
- **Von Restorff:** Elementos importantes se destacam?
- **Doherty Threshold:** Resposta < 400ms?

### 6. Gerar Recommendations
Priorizar por Severity x Effort:
| | Low Effort | High Effort |
|--|-----------|------------|
| **High Severity** | Do Now | Plan Next Sprint |
| **Low Severity** | Quick Win | Backlog |

## Saida
- Heuristic evaluation report
- Finding cards com severity e recommendations
- Priority matrix (severity x effort)
- Summary scorecard

## Validacao
- [ ] Todas as 10 heuristicas avaliadas
- [ ] Findings com severidade classificada
- [ ] Screenshots/evidencias incluidas
- [ ] Recomendacoes acionaveis
- [ ] Prioridades definidas
