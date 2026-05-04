---
task: validate-ux-with-testing
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

# Task: Validate UX with Testing

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Complex

## Objetivo
Validar decisoes de UX com testes reais — usability testing, A/B testing, ou validacao com usuarios para confirmar que a experiencia atende aos goals definidos.

## Entrada
- Prototipo ou produto implementado
- Personas e scenarios
- Success metrics definidas
- Test plan (de plan-ux-research-sprint)

## Passos

### 1. Selecionar Tipo de Teste
| Tipo | Quando | Objetivo |
|------|--------|---------|
| Moderated Usability | Prototipo, discovery | Insights qualitativos profundos |
| Unmoderated Usability | Escala, validacao | Dados quantitativos de task completion |
| A/B Testing | Producao | Comparar alternativas com dados |
| First-Click Testing | IA validation | Verificar findability |
| 5-Second Testing | Visual hierarchy | First impressions |
| Preference Testing | Design options | User preference |

### 2. Preparar Teste
```yaml
test_plan:
  type: ""
  objective: ""
  hypothesis: ""
  participants: 0
  duration: ""

  tasks:
    - id: "T1"
      scenario: ""
      task: ""
      success_criteria: ""
      time_limit: ""
      metrics:
        - completion_rate
        - time_on_task
        - error_rate
        - satisfaction_score

  questions:
    pre_test: []
    post_task: []
    post_test: []
```

### 3. Executar Testes
Moderated protocol:
1. Intro e consent (5min)
2. Pre-test questions (3min)
3. Tasks com think-aloud (25min)
4. Post-test questions (5min)
5. Debrief e follow-up (5min)

### 4. Analisar Resultados
| Metrica | Target | Resultado | Status |
|---------|--------|-----------|--------|
| Task completion rate | >= 80% | | |
| Time on task | <= Xmin | | |
| Error rate | <= 15% | | |
| SUS score | >= 68 | | |
| NPS | >= 30 | | |

### 5. Classificar Findings
| Severity | Criterio | Acao |
|----------|----------|------|
| Critical | Impede task completion | Fix before launch |
| Major | Causa frustracao significativa | Fix in current sprint |
| Minor | Incomodo mas contornavel | Backlog |
| Enhancement | Oportunidade de melhoria | Future sprint |

### 6. Iterar
- Priorizar fixes por severity
- Reprojetar com base em findings
- Re-testar areas criticas

## Saida
- Test results report
- Finding cards com severity
- Recommendations priorizadas
- Metricas comparadas com targets
- Iteration plan

## Validacao
- [ ] Testes executados com participantes suficientes
- [ ] Metricas quantitativas coletadas
- [ ] Insights qualitativos documentados
- [ ] Findings classificados por severidade
- [ ] Recommendations acionaveis
- [ ] Iteration plan definido
