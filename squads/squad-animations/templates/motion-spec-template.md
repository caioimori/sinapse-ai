---
template: motion-spec-template
squad: squad-animations
description: "Template para especificacao detalhada de motion design"
used_by:
  - design-animation-timing
  - create-animation-system
  - build-motion-guidelines
---

# Motion Spec: {{animation_name}}

## Overview
- **Tipo:** {{type}}
- **Feeling:** {{feeling}}
- **Complexidade:** {{complexity}}

## Timeline
```
[0ms]     Estado inicial
[{{t1}}]  {{phase_1_description}}
[{{t2}}]  {{phase_2_description}}
[{{t3}}]  {{phase_3_description}}
[{{end}}] Estado final
```

## Elementos
| Elemento | Propriedade | From | To | Duration | Delay | Easing |
|----------|-------------|------|----|----------|-------|--------|
| {{elem}} | {{prop}} | {{from}} | {{to}} | {{dur}} | {{del}} | {{ease}} |

## Easing Curves
```yaml
primary: cubic-bezier({{x1}}, {{y1}}, {{x2}}, {{y2}})
secondary: cubic-bezier({{x1}}, {{y1}}, {{x2}}, {{y2}})
```

## Stagger
```yaml
stagger:
  delay: {{delay}}ms
  pattern: {{pattern}}
  direction: {{direction}}
  overlap: {{overlap}}
```

## States
- **Initial:** {{initial_state}}
- **Active:** {{active_state}}
- **Complete:** {{complete_state}}
- **Reduced Motion:** {{reduced_state}}

## Notes
{{additional_notes}}
