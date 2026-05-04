---
task: create-persuasion-map
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

# Task: Create Persuasion Map

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** STANDARD
- **Depends on:** audiencia, jornada do cliente, objecoes
- **Feeds:** todos os writers do squad

## Objetivo
Criar mapa de persuasao visual que mostra ONDE e COMO aplicar cada trigger psicologico ao longo da jornada do cliente — servindo como blueprint para toda copy do funil.

## Entrada
- Jornada do cliente mapeada
- Objecoes por stage
- Emocoes por stage
- Canais por touchpoint

## Passos

### 1. Mapear Emocoes por Stage
```
STAGE         | EMOCAO PRIMARIA  | EMOCAO SECUNDARIA
Awareness     | Curiosidade      | Ceticismo
Interest      | Identificacao    | Esperanca
Desire        | Desejo           | Ansiedade
Evaluation    | Confianca        | Medo de errar
Purchase      | Excitacao        | Dor de pagar
Onboarding    | Empolgacao       | Confusao
Retention     | Satisfacao       | Habito
Advocacy      | Orgulho          | Pertencimento
```

### 2. Mapear Triggers por Stage
| Stage | Triggers Primarios | Triggers Secundarios |
|-------|-------------------|---------------------|
| Awareness | Curiosidade, Pattern Interrupt | Social Proof (numeros) |
| Interest | Afinidade, Empatia | Autoridade |
| Desire | Future Pacing, Loss Aversion | Reciprocidade |
| Evaluation | Social Proof, Autoridade | Consistencia |
| Purchase | Escassez, Urgencia | Garantia, Risk Reversal |
| Onboarding | Reciprocidade, Commitment | Quick Wins |
| Retention | Sunk Cost, Habit Loop | Comunidade |
| Advocacy | Unidade, Status | Reciprocidade |

### 3. Criar Persuasion Map Visual
```
JORNADA DO CLIENTE — PERSUASION MAP

AWARENESS ─────────────────────────────────────────
Touchpoints: Ads, Social, Blog, SEO
Triggers:    🎯 Curiosidade  👥 Social Proof (numeros)
Emocao:      Curiosidade → "Isso e interessante"
Copy Focus:  Headlines, hooks, pattern interrupts
Objecoes:    "Nao me interessa" → RESOLVER COM: relevancia

    ↓

INTEREST ──────────────────────────────────────────
Touchpoints: LP, Email, Conteudo
Triggers:    🤝 Afinidade  🏆 Autoridade
Emocao:      Identificacao → "Isso e pra mim"
Copy Focus:  Storytelling, empatia, educacao
Objecoes:    "Sera que funciona?" → RESOLVER COM: cases

    ↓

DESIRE ────────────────────────────────────────────
Touchpoints: Sales page, Webinar, Demo
Triggers:    🔮 Future Pacing  ⚠️ Loss Aversion
Emocao:      Desejo → "Eu QUERO isso"
Copy Focus:  Benefits, transformacao, antes/depois
Objecoes:    "E caro demais" → RESOLVER COM: value framing

    ↓

EVALUATION ────────────────────────────────────────
Touchpoints: Pricing, Comparison, Reviews
Triggers:    ⭐ Social Proof  📊 Autoridade
Emocao:      Analise → "Sera a melhor opcao?"
Copy Focus:  Provas, comparativos, FAQ
Objecoes:    "Concorrente e melhor" → RESOLVER COM: diferenciacao

    ↓

PURCHASE ──────────────────────────────────────────
Touchpoints: Checkout, Cart, Payment
Triggers:    ⏰ Urgencia  🛡️ Garantia
Emocao:      Decisao → "Vou fazer!"
Copy Focus:  CTA, risk reversal, escassez real
Objecoes:    "E se nao gostar?" → RESOLVER COM: garantia

    ↓

ONBOARDING ────────────────────────────────────────
Touchpoints: Welcome, Tutorial, First Use
Triggers:    🎁 Reciprocidade  ✅ Quick Wins
Emocao:      Empolgacao → "Fiz a escolha certa"
Copy Focus:  Valor imediato, facilitacao
Objecoes:    "Muito complicado" → RESOLVER COM: simplificacao

    ↓

RETENTION ─────────────────────────────────────────
Touchpoints: Email, In-app, Community
Triggers:    🔄 Habito  💰 Sunk Cost (etico)
Emocao:      Satisfacao → "Nao consigo viver sem"
Copy Focus:  Feature discovery, valor continuo
Objecoes:    "Nao uso o suficiente" → RESOLVER COM: re-engajamento

    ↓

ADVOCACY ──────────────────────────────────────────
Touchpoints: Referral, Review, Community
Triggers:    👑 Unidade  🏅 Status
Emocao:      Orgulho → "Quero que outros saibam"
Copy Focus:  Compartilhamento, exclusividade, reconhecimento
Objecoes:    "Por que indicar?" → RESOLVER COM: incentivo
```

### 4. Criar Trigger Dosage Guide
**Quanto de cada trigger por stage:**
| Trigger | Aware | Interest | Desire | Eval | Purchase |
|---------|:-----:|:--------:|:------:|:----:|:--------:|
| Curiosidade | ⚫⚫⚫ | ⚫⚫ | ⚫ | ○ | ○ |
| Social Proof | ⚫ | ⚫⚫ | ⚫⚫ | ⚫⚫⚫ | ⚫⚫ |
| Autoridade | ○ | ⚫ | ⚫⚫ | ⚫⚫⚫ | ⚫ |
| Empatia | ⚫ | ⚫⚫⚫ | ⚫⚫ | ⚫ | ○ |
| Future Pacing | ○ | ⚫ | ⚫⚫⚫ | ⚫⚫ | ⚫ |
| Escassez | ○ | ○ | ⚫ | ⚫⚫ | ⚫⚫⚫ |
| Garantia | ○ | ○ | ⚫ | ⚫⚫ | ⚫⚫⚫ |

⚫ = intensidade | ○ = ausente

## Saida
- Persuasion map visual completo
- Triggers por stage documentados
- Emocoes por stage mapeadas
- Trigger dosage guide
- Copy focus por stage

## Validacao
- [ ] Todos os stages da jornada cobertos
- [ ] Min 2 triggers por stage
- [ ] Emocoes mapeadas por stage
- [ ] Objecoes endereçadas por stage
- [ ] Dosage guide criado
- [ ] Map visual claro e acionavel

---

*Task operada por: persuasion-psychologist (Nudge)*
