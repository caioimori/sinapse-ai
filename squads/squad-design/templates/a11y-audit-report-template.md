# Accessibility Audit Report Template

## Instrucoes
Template para relatorio de auditoria de acessibilidade. Preencher apos conduzir audit automatizado E manual.

---

## 1. Sumario Executivo

| Campo | Valor |
|-------|-------|
| Projeto | |
| Auditor | Beacon (dx-accessibility-specialist) |
| Data do audit | |
| Escopo | [Paginas / Componentes / Produto completo] |
| Standard | WCAG 2.2 Level AA |
| **Verdict** | **[PASS / CONDITIONAL / FAIL]** |

### Score Geral
| Categoria | Score |
|-----------|-------|
| Lighthouse a11y | /100 |
| axe-core issues | Critical: / Major: / Minor: |
| Manual testing | [Aprovado / Issues encontrados] |

### Resumo
<!-- 2-3 paragrafos resumindo o estado de acessibilidade -->

## 2. Metodologia

### Ferramentas automatizadas
- [ ] axe DevTools v___
- [ ] Lighthouse v___
- [ ] WAVE
- [ ] Color contrast analyzer

### Testes manuais
- [ ] Keyboard navigation (todos os fluxos)
- [ ] Screen reader: NVDA v___
- [ ] Screen reader: VoiceOver (Safari)
- [ ] Zoom 200%
- [ ] Reduced motion
- [ ] High contrast mode

### Paginas/componentes auditados
| # | Pagina/Componente | URL/Location |
|---|-------------------|-------------|
| 1 | | |
| 2 | | |
| 3 | | |

## 3. Findings

### Critical Issues (Bloqueantes)

#### Issue C1: [Titulo]
| Campo | Detalhe |
|-------|---------|
| WCAG Criterion | X.X.X — [Nome] |
| Severidade | Critical |
| Pagina(s) | |
| Elemento | |
| Descricao | |
| Impacto | [Quem e afetado e como] |
| Remediacao | [Como corrigir] |
| Esforco | [Baixo / Medio / Alto] |

<!-- Repetir para cada issue critico -->

### Major Issues

#### Issue M1: [Titulo]
| Campo | Detalhe |
|-------|---------|
| WCAG Criterion | |
| Severidade | Major |
| Pagina(s) | |
| Descricao | |
| Remediacao | |
| Esforco | |

<!-- Repetir para cada issue major -->

### Minor Issues

#### Issue m1: [Titulo]
| Campo | Detalhe |
|-------|---------|
| WCAG Criterion | |
| Severidade | Minor |
| Descricao | |
| Remediacao | |

<!-- Repetir -->

### Best Practices (nao-bloqueantes)

- BP1:
- BP2:
- BP3:

## 4. WCAG 2.2 Compliance Matrix

### Perceivable
| Criterion | Level | Status | Notes |
|-----------|-------|--------|-------|
| 1.1.1 Non-text Content | A | [Pass/Fail/N/A] | |
| 1.2.1 Audio-only and Video-only | A | | |
| 1.3.1 Info and Relationships | A | | |
| 1.3.2 Meaningful Sequence | A | | |
| 1.3.3 Sensory Characteristics | A | | |
| 1.4.1 Use of Color | A | | |
| 1.4.3 Contrast (Minimum) | AA | | |
| 1.4.4 Resize Text | AA | | |
| 1.4.5 Images of Text | AA | | |
| 1.4.10 Reflow | AA | | |
| 1.4.11 Non-text Contrast | AA | | |
| 1.4.12 Text Spacing | AA | | |
| 1.4.13 Content on Hover/Focus | AA | | |

### Operable
| Criterion | Level | Status | Notes |
|-----------|-------|--------|-------|
| 2.1.1 Keyboard | A | | |
| 2.1.2 No Keyboard Trap | A | | |
| 2.4.1 Bypass Blocks | A | | |
| 2.4.2 Page Titled | A | | |
| 2.4.3 Focus Order | A | | |
| 2.4.4 Link Purpose | A | | |
| 2.4.5 Multiple Ways | AA | | |
| 2.4.6 Headings and Labels | AA | | |
| 2.4.7 Focus Visible | AA | | |
| 2.4.11 Focus Not Obscured (Min) | AA | | |
| 2.4.13 Focus Appearance | AA | | |
| 2.5.7 Dragging Movements | AA | | |
| 2.5.8 Target Size (Minimum) | AA | | |

### Understandable
| Criterion | Level | Status | Notes |
|-----------|-------|--------|-------|
| 3.1.1 Language of Page | A | | |
| 3.1.2 Language of Parts | AA | | |
| 3.2.1 On Focus | A | | |
| 3.2.2 On Input | A | | |
| 3.2.3 Consistent Navigation | AA | | |
| 3.2.4 Consistent Identification | AA | | |
| 3.2.6 Consistent Help | A | | |
| 3.3.1 Error Identification | A | | |
| 3.3.2 Labels or Instructions | A | | |
| 3.3.3 Error Suggestion | AA | | |
| 3.3.4 Error Prevention | AA | | |
| 3.3.7 Redundant Entry | A | | |
| 3.3.8 Accessible Authentication | AA | | |

### Robust
| Criterion | Level | Status | Notes |
|-----------|-------|--------|-------|
| 4.1.2 Name, Role, Value | A | | |
| 4.1.3 Status Messages | AA | | |

## 5. Remediation Plan

| Priority | Issue | Fix | Owner | Sprint | Status |
|----------|-------|-----|-------|--------|--------|
| P0 | | | | | [ ] |
| P0 | | | | | [ ] |
| P1 | | | | | [ ] |
| P1 | | | | | [ ] |
| P2 | | | | | [ ] |

## 6. Compliance Statement

### WCAG 2.2 Level AA Conformance
<!-- Redigir declaracao formal de conformidade -->

### Residual Issues
<!-- Issues conhecidos que permanecem, com justificativa e timeline -->

### Ongoing Monitoring
<!-- Recomendacoes para monitoramento continuo -->

## 7. Anexos

- [ ] axe-core full report (JSON/HTML)
- [ ] Lighthouse report (HTML)
- [ ] Screen reader test recordings
- [ ] Keyboard navigation recordings
