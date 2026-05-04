---
task: create-visual-guidelines
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

# Task: create-visual-guidelines

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*create-visual-guidelines` ou todos os elementos visuais definidos
- **Inputs:** Paleta, tipografia, logo, moodboard, photography, illustration, graphic vocab, treatments, data viz
- **Outputs:** Visual guidelines document completo

## Description
Compila TODOS os elementos visuais em documento unico e estruturado. E o guia definitivo para qualquer designer/IA reproduzir a identidade.

## Steps
1. Compilar todas as definicoes visuais em estrutura coesa:
   - Paleta de cores (completa com escalas e formatos)
   - Sistema tipografico (fontes, scale, hierarquia)
   - Logo system (variacoes, regras, proibicoes)
   - Moodboard (referencias e keywords)
   - Photography direction (estilo, iluminacao, composition)
   - Illustration style (estilo, paleta, regras)
   - Graphic vocabulary (formas, patterns, elementos)
   - Image treatments (filtros, overlays, crops)
   - Data visualization (cores, charts, infographics)
2. Garantir consistencia interna (sem contradicoes entre secoes)
3. Adicionar indice navegavel
4. Adicionar exemplos visuais em cada secao
5. Adicionar quick-reference dos elementos mais usados
6. Validar que documento e auto-suficiente (qualquer designer entende)

## Validation Criteria
- Todas as 9 areas cobertas com profundidade
- Zero contradicoes internas
- Exemplos visuais em cada secao
- Auto-suficiente (nao precisa de explicacao verbal adicional)

## Output Format
Visual guidelines document completo (30-50 paginas) com todas as definicoes visuais.
