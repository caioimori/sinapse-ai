---
task: create-notification-sounds
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

# Task: create-notification-sounds

## Metadata
- **Agent:** brand-sonic-designer (Echo)
- **Squad:** squad-brand
- **Trigger:** `*create-notification-sounds`
- **Inputs:** Sonic DNA, audio logo, timbre definido
- **Outputs:** Set de 6 notification sounds + formatos

## Description
Cria sons de interface derivados do DNA sonoro — experiencia premium em apps e produtos.

## Steps
1. **Success:** confirmacao positiva, major chord resolve, 0.3-0.5s
2. **Error:** alerta, dissonancia sutil que resolve, 0.3s
3. **Warning:** atencao, tom neutro ascendente, 0.3s
4. **Message received:** notificacao, melodico (2-3 notas do DNA), 0.5s
5. **Loading complete:** transicao, resolucao harmonica suave, 0.3s
6. **Button click:** micro feedback percussivo, 0.1s
7. Todos derivados do MESMO timbre e escala do audio logo
8. Testar volume relativo entre si (nao devem assustar)
9. Exportar WAV + MP3 + OGG por som

## Validation Criteria
- 6 sons de interface criados
- Todos do mesmo timbre/escala (familia sonora)
- Duracoes curtas (0.1-0.5s)
- Volume confortavel (nao assusta)
- 3 formatos por som

## Output Format
/audio/notifications/ com 6 sons x 3 formatos.
