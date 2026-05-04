---
task: create-audio-beds
responsavel: "@brand-sonic-designer"
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

# Task: create-audio-beds

## Metadata
- **Agent:** brand-sonic-designer (Echo)
- **Squad:** squad-brand
- **Trigger:** `*create-audio-beds`
- **Inputs:** Sonic DNA, personalidade, contextos de uso
- **Outputs:** Audio bed collection (5 moods x 3 duracoes)

## Description
Cria background music loops brandados para video, hold music e conteudo.

## Steps
1. Definir 5 moods baseados no Sonic DNA:
   - **Inspirational:** video corporativo, about us (major key, strings/piano, 90-110 BPM)
   - **Focused:** tutorial, walkthrough (minimal, clean, 80-90 BPM)
   - **Energetic:** social media, launch video (upbeat, percussion, 120-140 BPM)
   - **Calm:** hold music, relaxation (ambient pad, 60-80 BPM)
   - **Premium:** evento, gala, premium content (jazz/classical elements, 70-90 BPM)
2. Para cada mood, usar Sonic DNA como motivo recorrente (sutil, nao dominante)
3. Criar loops seamless em 3 duracoes: 30s, 60s, 120s
4. Garantir que NAO compete com voz/narracao (-12dB abaixo de voz)
5. Exportar 3 versoes de cada: com melodia, so ritmo, so pad/ambiente
6. Exportar WAV (master) + MP3 (web)

## Validation Criteria
- 5 moods distintos
- Loops seamless (sem emenda audivel)
- Nao compete com voz
- 3 duracoes por mood
- Sonic DNA presente como motivo

## Output Format
/audio/beds/ com 5 moods x 3 duracoes x 3 versoes + mood guide.
