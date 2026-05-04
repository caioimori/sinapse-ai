---
task: map-user-journeys
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

# Task: Map User Journeys

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Complex

## Objetivo
Mapear jornadas de usuario end-to-end — documentar touchpoints, emocoes, pain points e oportunidades de melhoria ao longo de cada fluxo critico.

## Entrada
- Personas definidas (de create-user-personas)
- User research data
- Business process flows
- Analytics de comportamento (funnels, drop-offs)

## Passos

### 1. Identificar Jornadas Criticas
Selecionar as jornadas de maior impacto:
| Criterio | Peso |
|----------|------|
| Volume de usuarios | Alto |
| Revenue impact | Alto |
| User pain severity | Alto |
| Business strategic value | Medio |

### 2. Mapear Fases da Jornada
Para cada jornada:

```yaml
journey:
  name: ""
  persona: ""
  goal: ""
  trigger: ""  # O que inicia a jornada

  phases:
    - name: ""
      touchpoints:
        - channel: ""
          action: ""
          device: ""
      user_thoughts: ""
      user_emotions: "[delighted/satisfied/neutral/frustrated/angry]"
      pain_points: []
      opportunities: []
      metrics:
        - name: ""
          current: ""
          target: ""
```

### 3. Identificar Momentos-Chave
| Tipo | Descricao | Impacto |
|------|-----------|---------|
| Moment of Truth | Decisao critica do usuario | Conversao ou abandono |
| Peak Moment | Maior satisfacao | Retencao e advocacy |
| Pain Moment | Maior frustracao | Drop-off risk |
| Recovery Moment | Recuperacao apos erro | Trust building |

### 4. Mapear Emocoes (Emotion Curve)
Plotar curva emocional por fase:
- Positivo: Delight, confianca, progresso
- Neutro: Indiferenca, espera
- Negativo: Confusao, frustracao, raiva

### 5. Identificar Oportunidades
Para cada pain point, propor:
- Quick wins (implementacao imediata)
- Melhorias de medio prazo
- Transformacoes estrategicas

### 6. Cross-Channel Consistency
Verificar consistencia da experiencia entre:
- Desktop vs Mobile
- Web vs App
- Self-service vs Atendimento
- Pre-purchase vs Post-purchase

## Saida
- Journey maps visuais (1 por jornada x persona)
- Emotion curves
- Opportunity map priorizado
- Service blueprint (se aplicavel)
- Handoff para Canvas (design) e Scaffold (implementacao)

## Validacao
- [ ] Jornadas criticas mapeadas
- [ ] Touchpoints documentados com canais
- [ ] Emocoes mapeadas por fase
- [ ] Pain points identificados com severidade
- [ ] Oportunidades priorizadas
- [ ] Cross-channel consistency verificada
