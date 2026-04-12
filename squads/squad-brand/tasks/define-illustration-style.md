---
task: define-illustration-style
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

# Task: define-illustration-style

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*define-illustration-style`
- **Inputs:** Personalidade, paleta, moodboard
- **Outputs:** Illustration style guide

## Description
Define estilo de ilustracao da marca — quando usar, como criar e regras de consistencia.

## Steps
1. Definir estilo: line art, flat, isometric, hand-drawn, 3D, collage
2. Definir complexidade: minimalista (poucos tracos) vs detalhado
3. Definir paleta para ilustracoes (subset da marca ou paleta expandida)
4. Definir stroke weight padrao e corner radius
5. Definir quando usar ilustracao vs fotografia
6. Criar exemplos de aplicacao por contexto (icons, hero, spot, full-page)
7. Definir DON'Ts de ilustracao (o que nao fazer)
8. Documentar processo de criacao para outros ilustradores/IA

## Validation Criteria
- Estilo e coerente com personalidade da marca
- Regras sao claras o suficiente para reproducao
- Paleta de ilustracao e consistente com sistema de cores
- Quando usar ilustracao vs foto esta definido

## Output Format
Illustration style guide com estilo, paleta, stroke, corner radius, exemplos e regras.
