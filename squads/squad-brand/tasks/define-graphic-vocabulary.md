---
task: define-graphic-vocabulary
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

# Task: define-graphic-vocabulary

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*define-graphic-vocabulary`
- **Inputs:** Logo, paleta, tipografia, estilo visual
- **Outputs:** Graphic vocabulary document

## Description
Define vocabulario de elementos graficos — formas, patterns, linhas, backgrounds e elementos decorativos que criam a linguagem visual unica da marca.

## Steps
1. Derivar formas recorrentes (do logo, da personalidade, do setor)
2. Definir patterns (geometricos, organicos, abstratos) com regras de repeat
3. Definir linhas e divisores (espessura, estilo, cor)
4. Definir backgrounds e texturas (gradients, solidos, patterns sutis)
5. Definir elementos decorativos (shapes, ornamentos, frames)
6. Definir regras de composicao (proporcao, hierarquia, white space)
7. Criar exemplos de aplicacao (header, card, hero, social)
8. Documentar DON'Ts (excesso de elementos, combinacoes proibidas)

## Validation Criteria
- Elementos derivam logicamente da identidade (nao sao arbitrarios)
- Regras de uso claras
- Exemplos de aplicacao em contextos reais

## Output Format
Documento com formas, patterns, linhas, backgrounds, decorativos — cada com regras e exemplos.
