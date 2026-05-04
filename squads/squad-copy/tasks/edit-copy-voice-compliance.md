---
task: edit-copy-voice-compliance
responsavel: "@copy-editor"
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

# Task: Edit Copy — Voice Compliance (Pass 3)

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor (Chisel)
- **Complexity:** STANDARD
- **Depends on:** Pass 2 aprovado
- **Feeds:** brand-voice-writer (Tone) se necessario

## Objetivo
Terceira passada: garantir que a copy esta 100% on-brand — verificando voice attributes, vocabulario, tom e consistencia com guidelines da marca.

## Entrada
- Copy aprovada no Pass 2
- Brand voice guidelines
- Tone spectrum
- Writing style guide

## Passos

### 1. Voice Attributes Check
**Para cada atributo de voice, verificar:**
```
ATRIBUTO: [Nome]
Definicao: [O que significa]
Presente na copy? ☐ Sim / ☐ Parcial / ☐ Nao
Exemplos na copy: "[trecho que demonstra]"
Ajuste necessario: [se parcial ou nao]
```

### 2. Vocabulario Check
- [ ] Palavras "always" presentes onde cabem
- [ ] Zero palavras "never" na copy
- [ ] Terminologia do glossario respeitada
- [ ] Expressoes assinatura incluidas naturalmente
- [ ] Jargao corporativo removido

### 3. Tom por Contexto
- [ ] Tom adequado para a situacao (celebration, informing, solving, selling)
- [ ] Tom consistente ao longo da peca
- [ ] Intensidade apropriada para o canal
- [ ] Emocao alinhada com brand personality

### 4. Consistencia Check
- [ ] Capitalizacao consistente (title case/sentence case)
- [ ] Formatacao de numeros padrao
- [ ] Pontuacao consistente
- [ ] Genero/linguagem inclusiva
- [ ] Emojis dentro das guidelines (se aplicavel)

### 5. Feedback Pass 3
```
VOICE COMPLIANCE — PASS 3

VOICE ATTRIBUTES: [N/N atributos presentes]
VOCABULARIO: ✅ LIMPO / ⚠️ [N] ajustes
TOM: ✅ ON-TONE / ⚠️ INCONSISTENTE
CONSISTENCIA: ✅ PADRAO / ⚠️ [N] desvios

EDITS FEITOS: [N]
  - [Edit 1: antes → depois]
  - [Edit 2: antes → depois]

DECISAO:
  ✅ APROVADO para Pass 4
  🔄 AJUSTES [lista]
```

## Saida
- Copy voice-compliant
- Edits documentados (before/after)
- Score de compliance

## Validacao
- [ ] Todos os voice attributes presentes
- [ ] Zero never-words na copy
- [ ] Tom consistente e adequado
- [ ] Formatacao padrao aplicada
- [ ] Soa como a marca (teste: trocaria o nome?)

---

*Task operada por: copy-editor (Chisel)*
