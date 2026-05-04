---
task: validate-visual-accessibility
responsavel: "@brand-identity-designer"
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

# Task: validate-visual-accessibility

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*validate-accessibility` ou visual guidelines completas
- **Inputs:** Paleta, tipografia, componentes, visual guidelines
- **Outputs:** Accessibility validation report

## Description
Valida que toda a identidade visual atende WCAG 2.1 AA. Testa contrast ratios, daltonismo e dependencia de cor.

## Steps
1. Testar contrast ratios WCAG AA para todas as combinacoes texto/fundo:
   - Normal text (4.5:1 minimo)
   - Large text (3:1 minimo)
   - UI components (3:1 minimo)
2. Simular color blindness em toda a paleta:
   - Protanopia (vermelho-deficiente)
   - Deuteranopia (verde-deficiente)
   - Tritanopia (azul-deficiente)
3. Verificar que informacao nao depende APENAS de cor (usar icones, labels, patterns)
4. Testar em dark mode (contrast ratios validos em ambos os temas)
5. Verificar tamanho minimo de texto (12px body, 10px caption)
6. Verificar touch targets (min 44x44px para mobile)
7. Documentar resultados e correcoes necessarias
8. Gerar accessibility validation report

## Validation Criteria
- Todas as combinacoes texto/fundo passam WCAG AA
- Paleta e distinguivel em 3 tipos de daltonismo
- Informacao nao depende so de cor
- Dark mode tambem passa nos testes

## Output Format
Accessibility report com resultados por combinacao, simulacoes de daltonismo e recomendacoes.
