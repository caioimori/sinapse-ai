---
task: map-objection-landscape
responsavel: "@copy-strategist"
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

# Task: Map Objection Landscape

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-strategist (Quill)
- **Complexity:** STANDARD
- **Depends on:** audience research, competitive intel
- **Feeds:** todos os writers, persuasion-psychologist (Nudge)

## Objetivo
Mapear TODAS as objecoes que a audiencia pode ter — antes, durante e depois de ler o copy — e preparar respostas persuasivas para cada uma.

## Entrada
- Personas e pain points (research-intelligence)
- Competitive analysis (research-intelligence)
- Sales team feedback (se disponivel)
- Customer reviews e FAQ

## Passos

### 1. Identificar Objecoes por Categoria
**Price:** "E muito caro", "Nao tenho budget", "O competidor X e mais barato"
**Trust:** "Nunca ouvi falar", "E confiavel?", "E seguro?"
**Need:** "Nao preciso disso", "Ja tenho uma solucao", "Nao e prioridade"
**Timing:** "Nao e o momento", "Vou pensar", "Talvez no proximo quarter"
**Complexity:** "Parece complicado", "Nao tenho tempo para aprender", "Vai dar trabalho migrar"
**Risk:** "E se nao funcionar?", "E se eu nao gostar?", "Qual a garantia?"

### 2. Priorizar por Frequencia e Impacto

| Objecao | Frequencia (1-5) | Impacto (1-5) | Priority Score |
|---------|:-----------------:|:-------------:|:--------------:|
| [Objecao 1] | | | Freq × Impact |

### 3. Criar Respostas Persuasivas
Para cada objecao prioritaria:
- **Acknowledge:** Validar a preocupacao (nao ignorar)
- **Reframe:** Mudar a perspectiva
- **Evidence:** Prova que endereca a objecao
- **Bridge:** Conectar com beneficio
- **Formato:**
  - "Entendemos que [objecao]. Na verdade, [reframe]. [Nome do cliente] tinha a mesma preocupacao e [resultado]. O que [beneficio] significa para voce e [outcome]."

### 4. Mapear Onde Usar no Copy
- **Landing page:** FAQ section + objection handling no body
- **Email:** Dedicated objection-handling email na sequence
- **Ads:** Ad variations endereçando top objecoes
- **Sales:** Battle card com objecoes + respostas
- **Checkout:** Microcopy que antecipa objecoes de ultimo momento

### 5. Pre-emptive Objection Handling
- Responder objecoes ANTES que o leitor as pense
- Tecnica: "You might be thinking..." → resposta imediata
- Tecnica: Social proof que endereça objecao implicita
- Tecnica: Guarantee/risk reversal proeminente

## Saida
- Mapa completo de objecoes categorizado
- Respostas persuasivas para top 10 objecoes
- Mapeamento de onde usar cada resposta
- Pre-emptive objection handling strategies

## Validacao
- [ ] Objecoes categorizadas (price, trust, need, timing, complexity, risk)
- [ ] Top 10 priorizadas por frequencia × impacto
- [ ] Respostas com acknowledge + reframe + evidence + bridge
- [ ] Mapeamento por canal/formato
- [ ] Pre-emptive strategies definidas

---

*Task operada por: copy-strategist (Quill)*
