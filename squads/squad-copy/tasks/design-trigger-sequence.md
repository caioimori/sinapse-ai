---
task: design-trigger-sequence
responsavel: "@persuasion-psychologist"
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

# Task: Design Trigger Sequence

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** STANDARD
- **Depends on:** persuasion map, audiencia, jornada
- **Feeds:** conversion-writer (Spark), long-form-writer (Saga)

## Objetivo
Desenhar a sequencia exata de triggers psicologicos para uma peca ou campanha especifica — definindo QUAL trigger, ONDE aplicar e com QUAL intensidade para maximizar conversao etica.

## Entrada
- Peca/campanha especifica (LP, email sequence, sales letter)
- Persuasion map (referencia)
- Audiencia e awareness level
- Objetivo de conversao

## Passos

### 1. Selecionar Triggers para o Contexto
**Regra: Nao usar todos — selecionar os mais eficazes para o contexto.**

| Contexto | Triggers Prioritarios | Triggers Secundarios |
|----------|----------------------|---------------------|
| Cold traffic | Curiosidade, Social Proof | Pattern Interrupt |
| Warm traffic | Afinidade, Autoridade | Reciprocidade |
| Hot traffic | Escassez, Urgencia | Garantia |
| B2B decision | Autoridade, Social Proof | ROI, Consistencia |
| B2C impulse | Emocao, Escassez | Social Proof |
| High-ticket | Autoridade, Garantia | Exclusividade |
| Low-ticket | Social Proof, Urgencia | Facilidade |

### 2. Sequenciar Triggers na Peca
**Regra de ouro:** Emocao ANTES de logica. Rapport ANTES de venda.

**Sequencia para Landing Page:**
```
HERO: Pattern Interrupt + Curiosidade
  → Parar o scroll, gerar interesse

PROBLEMA: Empatia + Loss Aversion
  → "Eu entendo" + "O que voce perde se nao resolver"

SOLUCAO: Autoridade + Mecanismo Unico
  → "Eis por que funciona" + "Criado por [credencial]"

BENEFICIOS: Future Pacing + Desejo
  → "Imagine quando voce..." + outcomes concretos

PROVA: Social Proof (camadas)
  → Testimonials → Numeros → Logos → Reviews

OFERTA: Anchoring + Value Stack
  → Valor total → Preco → Economia

URGENCIA: Escassez + Deadline
  → "Vagas limitadas" + "Ate [data]"

CTA: Risk Reversal + Facilitacao
  → Garantia + "Sem cartao" + "2 minutos"
```

**Sequencia para Email Sequence:**
```
Email 1: Reciprocidade (dar valor)
Email 2: Afinidade (historia de identificacao)
Email 3: Autoridade (insight expert)
Email 4: Social Proof (case study)
Email 5: Consistencia (micro-commitment)
Email 6: Escassez (oferta limitada)
Email 7: Urgencia (deadline)
```

### 3. Calibrar Intensidade
**Escala de intensidade por trigger:**

| Intensidade | Descricao | Quando |
|:-----------:|-----------|--------|
| 1 - Sutil | Implícito, natural | Awareness, educacao |
| 2 - Moderado | Presente mas nao dominante | Interest, nurture |
| 3 - Direto | Claro e explicito | Desire, evaluation |
| 4 - Forte | Enfatico, impossivel ignorar | Decision, close |
| 5 - Maximo | All-in, urgencia total | Last call, deadline |

**Mapeamento de intensidade na peca:**
```
Secao 1 (Hero):    Curiosidade=4, Social Proof=2
Secao 2 (Problem): Empatia=4, Loss Aversion=3
Secao 3 (Solution):Autoridade=3, Mecanismo=3
Secao 4 (Proof):   Social Proof=5, Autoridade=3
Secao 5 (Offer):   Anchoring=4, Value=4
Secao 6 (CTA):     Escassez=4, Garantia=5
```

### 4. Documentar Trigger Sequence
**Template:**
```yaml
trigger_sequence:
  piece: "Landing Page Principal"
  audience: "SaaS founders, Solution Aware"
  objective: "Free trial signup"

  sequence:
    - section: "Hero"
      trigger: "Curiosidade"
      intensity: 4
      technique: "Headline com resultado especifico"
      copy_direction: "Numero + timeframe + resultado"

    - section: "Problem"
      trigger: "Loss Aversion"
      intensity: 3
      technique: "Custo de nao resolver"
      copy_direction: "Quanto perde por mes sem solucao"

    - section: "Social Proof"
      trigger: "Social Proof"
      intensity: 5
      technique: "Testimonials + numeros"
      copy_direction: "3 testimonials + '10,000+ users'"

  ethical_notes:
    - "Escassez baseada em limite real de onboarding"
    - "Testimonials verificados e com permissao"
```

## Saida
- Trigger sequence documentada por secao
- Intensidade calibrada
- Copy directions por trigger
- Ethical notes

## Validacao
- [ ] Triggers selecionados para contexto
- [ ] Sequencia emocao→logica respeitada
- [ ] Intensidade calibrada por secao
- [ ] Copy directions claras para writers
- [ ] Ethical notes documentadas
- [ ] Min 4 triggers diferentes na sequencia

---

*Task operada por: persuasion-psychologist (Nudge)*
