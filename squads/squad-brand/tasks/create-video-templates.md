---
task: create-video-templates
responsavel: "@brand-motion-vfx"
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

# Task: create-video-templates

## Metadata
- **Agent:** brand-motion-vfx (Flux)
- **Squad:** squad-brand
- **Trigger:** `*create-video-templates`
- **Inputs:** Motion language, visual identity, sonic identity de Echo
- **Outputs:** Video template set (intro, outro, lower thirds, transitions)

## Description
Cria templates de video brandados sincronizados com audio de Echo.

## Steps
1. **Intro bumper (3-5s):** logo animation (reveal + settle) synced com sonic logo de Echo
2. **Outro card (5s):** CTA text + subscribe button + social icons + logo + website
3. **Lower thirds:** nome + cargo com entrada suave (slide-in + fade), permanece 4-6s, saida suave
4. **Transition wipes:** branded transitions entre secoes (cor primaria wipe, pattern reveal, logo flash)
5. **Background motion graphics:** loops sutis para uso atras de conteudo (particles, shapes, gradients)
6. Sincronizar timing com sonic logo de Echo (audio precede visual em 50ms)
7. Exportar em 3 formatos:
   - After Effects template (.mogrt)
   - CSS animation (para web video players)
   - Lottie JSON (para apps)
8. Documentar timing points para sync com audio

## Validation Criteria
- 5 tipos de template criados
- Sync com audio de Echo documentado
- 3 formatos de export
- Loops seamless para backgrounds
- Timing preciso

## Output Format
Video templates em AE + CSS + Lottie + sync timing doc.
