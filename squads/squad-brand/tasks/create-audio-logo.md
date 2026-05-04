---
task: create-audio-logo
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

# Task: create-audio-logo

## Metadata
- **Agent:** brand-sonic-designer (Echo)
- **Squad:** squad-brand
- **Trigger:** `*create-audio-logo`
- **Inputs:** Sonic DNA, personalidade, instrumentacao
- **Outputs:** Audio logo em 3 versoes + 4 formatos

## Description
Cria audio logo — a assinatura sonora da marca em 3 duracoes.

## Steps
1. Partir do Sonic DNA (3-5 notas core)
2. Criar versao curta (1-2s): para apps, notificacoes, quick branding
3. Criar versao padrao (3-5s): para videos, apresentacoes, eventos
4. Criar versao extendida (8-15s): para intros, brand moments, experiencias imersivas
5. Definir instrumentacao (instrumentos/synths que representam a marca)
6. Testar em diferentes dispositivos: speaker bluetooth, headphone, phone speaker, TV, notebook
7. Ajustar mixagem para cada dispositivo (low-end em phones, full range em speakers)
8. Exportar em 4 formatos:
   - WAV 48kHz/24bit (master)
   - MP3 320kbps (web)
   - AAC 256kbps (mobile/Apple)
   - OGG quality 8 (apps/games)

## Validation Criteria
- 3 versoes de duracao criadas
- Memoravel em primeira escuta
- Funciona em 5 tipos de dispositivo
- 4 formatos exportados
- Derivado do Sonic DNA

## Output Format
Audio files em /audio/logo/ com 3 versoes x 4 formatos + mixagem doc.
