---
task: create-icon-set
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

# Task: create-icon-set

## Metadata
- **Agent:** brand-creative-engineer (Forge)
- **Squad:** squad-brand
- **Trigger:** `*create-icon-set`
- **Inputs:** Visual guidelines, paleta, illustration style
- **Outputs:** Icon set SVG + sprite sheet

## Description
Cria set de icones SVG consistentes para uso em UI, web e materiais da marca.

## Steps
1. Definir grid consistente (24x24 padrao, 32x32 para detalhados)
2. Definir estilo (outlined, filled, duotone) alinhado com visual guidelines
3. Manter stroke-width uniforme em todos os icones (1.5px ou 2px)
4. Definir corner-radius padrao (2px ou 3px)
5. Criar icones por categoria: navigation, actions, social, status, content
6. Testar legibilidade em 16x16 (tamanho minimo)
7. Otimizar SVGs (paths simplificados, metadata removido)
8. Criar sprite sheet (SVG sprite com symbols)
9. Exportar individual + sprite + PNG fallbacks
10. Documentar uso de cada icone

## Validation Criteria
- Grid consistente em todos os icones
- Stroke-width uniforme
- Legiveis em 16x16
- Sprite sheet funcional
- Estilo coerente com identidade visual

## Output Format
Pasta /icons/ com SVGs individuais, sprite sheet e documentacao de uso.
