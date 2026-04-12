---
task: create-sonic-identity
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

# Task: create-sonic-identity

## Metadata
- **Agent:** brand-sonic-designer (Echo)
- **Squad:** squad-brand
- **Trigger:** `*create-sonic-identity`
- **Inputs:** Personalidade da marca de Athena, arquetipo, atributos emocionais
- **Outputs:** Sonic DNA document + sonic moodboard

## Description
Cria identidade sonora completa — o DNA sonoro que gera todos os outros elementos de audio.

## Steps
1. Mapear personalidade para atributos sonoros:
   - BPM: energetico (120-140), moderado (90-110), calmo (60-80)
   - Tonalidade: major (otimista), minor (sofisticado), modal (misterioso)
   - Timbre: acustico (organico), sintetico (tech), hibrido (moderno)
   - Dinamica: loud (energetico), moderate (balanceado), soft (premium)
2. Definir Sonic DNA: 3-5 notas core que REPRESENTAM a marca
3. Definir escala musical (pentatonica para memorabilidade, cromatica para sofisticacao)
4. Criar sonic moodboard: 3-5 refs sonoras (Intel bong, Netflix tu-dum, McDonald's ba-da-ba-ba-ba)
5. Definir regras de uso (quando completo, quando abreviado, quando variacao)
6. Documentar: BPM, key, notas, instrumentacao, referencias

## Validation Criteria
- Sonic DNA tem 3-5 notas memoraveis
- Mapeamento personalidade→som justificado
- Sonic moodboard com 3-5 refs
- Regras de uso definidas

## Output Format
Sonic DNA document com notacao, BPM, key, instrumentacao, moodboard, regras.
