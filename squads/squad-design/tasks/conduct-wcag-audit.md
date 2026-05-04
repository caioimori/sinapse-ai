---
task: conduct-wcag-audit
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

# Task: Conduct WCAG Audit

## Metadata
- **Squad:** squad-design
- **Agent:** Beacon (dx-accessibility-specialist)
- **Complexity:** Complex

## Objetivo
Conduzir auditoria completa de conformidade WCAG 2.2 Level AA — combinando testes automatizados e manuais para avaliar todos os 87 criterios aplicaveis.

## Entrada
- Produto/paginas para auditar
- Escopo definido (paginas, componentes, fluxos)
- A11y audit report template

## Passos

### 1. Testes Automatizados
| Ferramenta | O que detecta | Coverage |
|-----------|--------------|---------|
| axe-core | ~57% dos issues WCAG | Estrutura, ARIA, contraste |
| Lighthouse a11y | Score agregado + issues | Subset do axe |
| WAVE | Visual indicators | Estrutura, alternatives |
| pa11y | CLI automation | CI integration |

### 2. Testes Manuais (Obrigatorios)
Os testes automatizados nao detectam ~43% dos problemas. Testes manuais obrigatorios:

| Teste | Como | O que verifica |
|-------|------|---------------|
| Keyboard-only | Tab, Enter, Space, Arrows, Escape | Todos os fluxos navegaveis |
| Screen reader | NVDA (Windows), VoiceOver (Mac/iOS) | Anuncios, ordem, labels |
| Zoom 200% | Browser zoom | Layout nao quebra |
| Zoom 400% | Reflow test | Single column, no h-scroll |
| Reduced motion | prefers-reduced-motion | Animacoes respeitam |
| High contrast | Windows High Contrast | UI funcional |
| Text spacing | Bookmarklet WCAG 1.4.12 | Texto nao trunca |

### 3. Avaliar por Principio (POUR)

**Perceivable:**
- 1.1.1 Non-text Content (alt text)
- 1.3.1 Info and Relationships (semantic HTML)
- 1.4.3 Contrast (4.5:1 text, 3:1 UI)
- 1.4.11 Non-text Contrast (3:1 UI elements)
- 1.4.13 Content on Hover/Focus

**Operable:**
- 2.1.1 Keyboard (all functions)
- 2.4.3 Focus Order (logical sequence)
- 2.4.7 Focus Visible (visible indicator)
- 2.4.11 Focus Not Obscured (WCAG 2.2)
- 2.4.13 Focus Appearance (WCAG 2.2)
- 2.5.8 Target Size 24x24px (WCAG 2.2)

**Understandable:**
- 3.1.1 Language of Page (lang attribute)
- 3.2.6 Consistent Help (WCAG 2.2)
- 3.3.7 Redundant Entry (WCAG 2.2)
- 3.3.8 Accessible Authentication (WCAG 2.2)

**Robust:**
- 4.1.2 Name, Role, Value (ARIA)
- 4.1.3 Status Messages (live regions)

### 4. Classificar Findings
| Severity | Impacto | Exemplos |
|----------|---------|---------|
| Critical | Bloqueia uso para grupo de usuarios | Keyboard trap, no alt text on functional image |
| Major | Dificulta significativamente | Poor contrast, missing labels |
| Minor | Incomodo mas contornavel | Missing skip link, suboptimal heading order |

### 5. Determinar Verdict
| Verdict | Criterio |
|---------|----------|
| PASS | 0 critical, 0 major, Lighthouse >= 95 |
| CONDITIONAL | 0 critical, <= 3 major com remediation plan |
| FAIL | Qualquer critical OU > 3 major |

### 6. Documentar no A11y Audit Report Template
Preencher template completo com WCAG compliance matrix.

## Saida
- A11y audit report (usando template)
- WCAG 2.2 compliance matrix
- Finding list com severity
- Remediation plan
- Verdict (PASS/CONDITIONAL/FAIL)

## Validacao
- [ ] Testes automatizados executados
- [ ] Testes manuais executados (keyboard, screen reader, zoom)
- [ ] Todos os criterios WCAG 2.2 AA avaliados
- [ ] Findings classificados por severity
- [ ] Remediation plan com responsaveis
- [ ] Verdict documentado
