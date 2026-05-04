---
task: edit-copy-clarity-impact
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

# Task: Edit Copy — Clarity & Impact (Pass 4)

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor (Chisel)
- **Complexity:** STANDARD
- **Depends on:** Pass 3 aprovado
- **Feeds:** writer original (final version)

## Objetivo
Quarta passada: polir cada frase para maxima clareza e impacto — cortando fluff, afiando linguagem e garantindo que cada palavra justifica sua existencia.

## Entrada
- Copy aprovada no Pass 3 (voice-compliant)

## Passos

### 1. Cortar Fluff (Kill Your Darlings)
**Remover sem piedade:**
- Palavras vazias: "realmente", "muito", "bastante", "na verdade"
- Qualificadores desnecessarios: "relativamente", "de certa forma"
- Redundancias: "resultado final" (resultado ja e final)
- Preposicoes excessivas: "em relacao a" → "sobre"
- Gerundios vagos: "estamos trabalhando em melhorar" → "vamos melhorar"
- Hedging: "achamos que talvez" → "acreditamos que"

**Regra:** Se remover a palavra e a frase continuar clara, remova.

### 2. Afiar Linguagem
**Transformacoes:**
| De | Para | Por que |
|----|------|---------|
| Voz passiva | Voz ativa | Mais direto e energetico |
| Abstrato | Concreto | Mais memoravel |
| Longo | Curto | Mais impacto |
| Generico | Especifico | Mais credivel |
| Complicado | Simples | Mais fluente |

**Exemplos:**
```
ANTES: "Nossa solucao foi desenvolvida para possibilitar
        que organizacoes otimizem seus processos"
DEPOIS: "Corte processos pela metade. Comece hoje."

ANTES: "Temos um time de profissionais altamente qualificados
        com vasta experiencia na area"
DEPOIS: "Nossa equipe: 50 anos de experiencia combinada.
        320 projetos entregues. Zero fracassos."
```

### 3. Otimizar Ritmo
**Variar comprimento de frases para criar ritmo:**
```
Frases curtas criam impacto.
Frases medias adicionam contexto e desenvolvem ideias.
E frases mais longas permitem que o leitor mergulhe na
narrativa, criando um fluxo natural que guia ate o
proximo ponto.
Entendeu o ritmo?
```

**Tecnicas de ritmo:**
- Anaphora (repeticao de inicio): "Nos acreditamos... Nos lutamos... Nos criamos..."
- Tricolon (grupos de 3): "Rapido, facil, poderoso"
- Asindeto (sem conjuncoes): "Crie. Teste. Lance."
- Polisindeto (muitas conjuncoes): "Simples e direto e eficaz"

### 4. Verificar Impacto por Secao
**Para cada secao, pergunte:**
| Pergunta | ✅ | Acao |
|----------|:--:|------|
| Cada frase justifica sua existencia? | ☐ | Cortar se nao |
| A frase mais impactante esta no lugar certo? | ☐ | Reposicionar |
| O inicio e o fim da secao sao fortes? | ☐ | Reescrever se nao |
| Existe uma "power phrase" memoravel? | ☐ | Criar se nao |
| A transicao para a proxima secao e suave? | ☐ | Ajustar |

### 5. Leitura Final em Voz Alta
**Ler toda a copy em voz alta verificando:**
- Soa natural quando falado?
- Existem tongue twisters ou frases estranhas?
- O ritmo flui ou trava em algum ponto?
- As pausas naturais estao nos lugares certos?
- O tom emocional progride conforme planejado?

### 6. Feedback Pass 4
```
CLARITY & IMPACT — PASS 4

PALAVRAS CORTADAS: [N]
FRASES REESCRITAS: [N]
POWER PHRASES: [lista]
LEITURA EM VOZ ALTA: ✅ NATURAL / ⚠️ AJUSTES

BEFORE/AFTER HIGHLIGHTS:
  1. "[antes]" → "[depois]"
  2. "[antes]" → "[depois]"
  3. "[antes]" → "[depois]"

DECISAO:
  ✅ APROVADO para Pass 5 (tecnico)
  🔄 MAIS POLIMENTO [areas]
```

## Saida
- Copy polida (cada palavra justifica existencia)
- Before/after highlights
- Power phrases identificadas
- Contagem de palavras cortadas

## Validacao
- [ ] Zero fluff words restantes
- [ ] Voz ativa predominante
- [ ] Concreto > abstrato
- [ ] Ritmo variado e natural
- [ ] Leitura em voz alta aprovada
- [ ] Power phrases em cada secao
- [ ] Transicoes suaves entre secoes

---

*Task operada por: copy-editor (Chisel)*
