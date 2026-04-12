---
task: create-pattern
responsavel: "@brand-creative-engineer"
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

# Task: create-pattern

## Metadata
- **Agent:** brand-creative-engineer (Forge)
- **Squad:** squad-brand
- **Trigger:** `*create-pattern`
- **Inputs:** Graphic vocabulary, paleta, visual guidelines
- **Outputs:** Pattern SVGs seamless em 3 densidades

## Description
Cria patterns/texturas SVG seamless derivados do vocabulario grafico da marca.

## Steps
1. Definir modulo base (tile) derivado do graphic vocabulary
2. Aplicar cores da paleta (primaria, secundaria, neutras)
3. Calcular repeat seamless (tile deve encaixar perfeitamente)
4. Testar em fundo claro e escuro
5. Gerar 3 densidades: sutil (background), medio (decorativo), denso (pattern forte)
6. Criar versoes para diferentes usos: CSS background, print, social
7. Otimizar SVGs para performance web
8. Documentar uso recomendado por contexto

## Validation Criteria
- Repeat e seamless (sem emendas visiveis)
- Funciona em fundo claro E escuro
- 3 densidades criadas
- Cores da paleta

## Output Format
Pasta /patterns/ com SVGs em 3 densidades + CSS para uso web.
