---
template: animation-brief-template
squad: squad-animations
description: "Template para Animation Brief gerado pelo animation-interpreter"
used_by:
  - build-animation-brief
  - interpret-animation-prompt
---

# Animation Brief: {{project_name}}

## 1. Contexto do Projeto
- **Projeto:** {{project_name}}
- **Pagina/Secao:** {{page_section}}
- **Brand:** {{brand_name}} (se disponivel)
- **Stack:** {{tech_stack}}

## 2. Request Original
> {{user_raw_input}}

## 3. Intent Interpretado
```yaml
intent:
  type: {{animation_type}}
  element: {{target_element}}
  feeling: [{{feelings}}]
  reference: "{{reference}}"
  constraints: [{{constraints}}]
  complexity: {{complexity}}
  industry: {{industry}}
```

## 4. Spec Tecnica
```yaml
spec:
  duration: {{duration}}ms
  easing: {{easing_function}}
  delay: {{delay}}ms
  properties:
    - {{property_1}}
    - {{property_2}}
  stagger:
    delay: {{stagger_delay}}ms
    pattern: {{stagger_pattern}}
  trigger: {{trigger_type}}
  direction: {{direction}}
```

## 5. Tecnologia Recomendada
- **Primaria:** {{primary_tech}}
- **Secundaria:** {{secondary_tech}}
- **Justificativa:** {{tech_rationale}}

## 6. Agente Executor
- **Lead:** @{{lead_agent}}
- **Suporte:** @{{support_agents}}

## 7. Complexidade e Dependencias
- **Complexidade:** {{complexity_level}}
- **Estimativa:** {{time_estimate}}
- **Dependencias:**
  - {{dependency_1}}
  - {{dependency_2}}

## 8. Acessibilidade
- **prefers-reduced-motion:** {{reduced_motion_strategy}}
- **Fallback:** {{fallback_description}}
- **Pause control:** {{pause_required}}
