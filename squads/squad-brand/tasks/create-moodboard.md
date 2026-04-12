---
task: create-moodboard
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

# Task: create-moodboard

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*create-moodboard`
- **Inputs:** Posicionamento, arquetipo, paleta, referencias do cliente
- **Outputs:** Moodboard de referencia visual

## Description
Cria moodboard que alinha expectativa visual antes de produzir assets. Compila referencias, texturas, direcao fotografica e keywords visuais.

## Steps
1. Selecionar 3-5 referencias visuais de marcas admiradas (mesmo tier aspiracional)
2. Coletar texturas, patterns e materiais relevantes
3. Definir direcao fotografica geral (tom, mood, estetica)
4. Expandir paleta com tons complementares e acentos
5. Listar 3-5 keywords visuais (adjetivos: "ousado", "minimalista", "premium")
6. Organizar em composicao visual coesa (grid de referencias)
7. Adicionar notas explicativas (por que cada referencia foi escolhida)
8. Validar com posicionamento (moodboard reflete a estrategia?)

## Validation Criteria
- 3-5 referencias visuais de alto nivel
- Keywords sao especificos (nao genericos como "bonito")
- Moodboard e coeso (nao uma colagem aleatoria)
- Cada referencia tem justificativa

## Output Format
Documento visual + texto explicativo com referencias, keywords e rationale.
