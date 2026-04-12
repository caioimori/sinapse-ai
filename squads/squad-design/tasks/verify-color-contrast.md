---
task: verify-color-contrast
responsavel: "@dx-accessibility-specialist"
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

# Task: Verify Color Contrast

## Metadata
- **Squad:** squad-design
- **Agent:** Beacon (dx-accessibility-specialist)
- **Complexity:** Standard

## Objetivo
Verificar conformidade de contraste de cores em todo o produto — WCAG 2.2 AA minimum ratios para texto, UI components e focus indicators.

## Entrada
- Color system (de Stratum)
- Semantic token mappings (light + dark)
- Component visual states
- Data visualization palettes

## Passos

### 1. Contrast Requirements (WCAG 2.2 AA)
| Elemento | Min Ratio | Criterio |
|----------|-----------|---------|
| Body text (< 18px regular) | 4.5:1 | 1.4.3 |
| Large text (>= 18px bold or >= 24px) | 3:1 | 1.4.3 |
| UI components (borders, icons) | 3:1 | 1.4.11 |
| Focus indicators | 3:1 | 2.4.13 |
| Graphical objects | 3:1 | 1.4.11 |
| Disabled elements | N/A | Nao requer |
| Decorative elements | N/A | Nao requer |
| Logos/brand text | N/A | Nao requer |

### 2. Testar Todas as Combinacoes
```yaml
contrast_matrix:
  light_mode:
    - fg: "foreground.default"
      bg: "background.default"
      ratio: ""
      pass: ""

    - fg: "foreground.muted"
      bg: "background.default"
      ratio: ""
      pass: ""

    - fg: "foreground.subtle"
      bg: "background.default"
      ratio: ""
      pass: ""

    # ... all combinations

  dark_mode:
    # Same matrix for dark mode
```

### 3. Verificar por Componente
| Componente | Estado | FG/BG Combo | Ratio | Pass? |
|-----------|--------|-------------|-------|-------|
| Button primary | default | white / blue-500 | | |
| Button primary | hover | white / blue-600 | | |
| Input | default | neutral-900 / white | | |
| Input | error | error-700 / error-50 | | |
| Link | default | blue-600 / white | | |
| Badge | info | blue-800 / blue-100 | | |

### 4. Testar Focus Indicators
WCAG 2.4.13 — Focus Appearance:
- Focus indicator area >= 2px solid perimeter
- Contrast of focus indicator vs adjacent background >= 3:1
- Contrast of focused vs unfocused state >= 3:1

### 5. Data Visualization
Cores em graficos e charts devem:
- Distinguiveis por pessoas com daltonismo
- Nao depender APENAS de cor (usar patterns, labels)
- Testar com simuladores de daltonismo

### 6. Ferramentas de Verificacao
| Ferramenta | Uso |
|-----------|-----|
| Chrome DevTools contrast checker | Inline checking |
| Colour Contrast Analyser (CCA) | Desktop app, eyedropper |
| axe DevTools | Automated scanning |
| APCA calculator | Advanced perceptual contrast |
| Stark (Figma plugin) | Design-time checking |
| Sim Daltonism | Color blindness simulation |

### 7. Remediation
Se um par nao passa:
1. Ajustar fg/bg token values
2. Considerar APCA para textos grandes (mais preciso)
3. Adicionar indicadores nao-cor (icones, patterns)
4. Documentar excecoes justificadas (decorativos)

## Saida
- Contrast verification matrix (light + dark)
- Component contrast report
- Focus indicator contrast report
- Data viz color review
- Remediation recommendations

## Validacao
- [ ] Todas as combinacoes texto/bg verificadas
- [ ] Todos os componentes por estado verificados
- [ ] Focus indicators passam 3:1
- [ ] Dark mode verificado separadamente
- [ ] Data viz colors distinguiveis (daltonismo)
- [ ] Ferramentas automatizadas confirmam 0 violations
