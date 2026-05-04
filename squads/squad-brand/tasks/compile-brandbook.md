---
task: compile-brandbook
responsavel: "@brand-compiler"
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

# Task: compile-brandbook

## Metadata
- **Agent:** brand-compiler (Atlas)
- **Squad:** squad-brand
- **Trigger:** `*compile-brandbook` ou fase 9 do workflow
- **Inputs:** Todos os outputs aprovados por Sentinel
- **Outputs:** Brandbook completo (80-150 paginas) em PDF + web

## Description
Compila o brandbook definitivo — o documento master que documenta toda a marca.

## Steps
1. Coletar outputs aprovados de cada agente:
   - Athena: strategy, positioning, manifesto, tone, personas
   - Iris: paleta, tipografia, logo, photography, illustration, data viz
   - Forge: assets SVG, mockups, templates
   - Vellum: colateral, stationery, presentations
   - Grid: tokens, componentes, grid, dark mode
   - Flux: motion language, micro-interactions, video templates
   - Echo: sonic identity, audio logo, notification sounds
2. Organizar nas 10 secoes master:
   - 1. Capa (brandada, profissional)
   - 2. Indice interativo (links internos)
   - 3. Introducao (proposito do documento, como usar)
   - 4. Estrategia (posicionamento, arquetipo, manifesto, tom, personas)
   - 5. Identidade Visual (cores, tipo, logo, foto, ilustracao, graphic vocab)
   - 6. Design System (tokens, grid, componentes, dark mode)
   - 7. Aplicacoes (business cards, stationery, social, web, packaging, signage)
   - 8. Motion (principles, micro-interactions, transitions, video)
   - 9. Audio (sonic identity, audio logo, notifications, beds)
   - 10. Governanca (regras de uso, aprovacoes, contatos)
3. Aplicar formatacao profissional (tipografia, spacing, layout)
4. Criar indice interativo com hyperlinks
5. Adicionar cross-references entre secoes
6. Incluir exemplos visuais em CADA secao
7. Revisar: zero placeholders, zero secoes vazias
8. Exportar PDF interativo (bookmarks, links) + versao web (HTML5 responsivo)

## Validation Criteria
- 10 secoes completas sem placeholders
- 80-150 paginas
- Indice interativo funcional
- PDF com bookmarks e links
- Profissional e navegavel

## Output Format
Brandbook PDF interativo + versao web + source files.
