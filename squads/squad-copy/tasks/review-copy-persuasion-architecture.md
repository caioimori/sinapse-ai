---
task: review-copy-persuasion-architecture
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

# Task: Review Copy Persuasion Architecture

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** COMPLEX
- **Depends on:** copy completa de qualquer writer
- **Feeds:** copy-editor (Chisel), writer original

## Objetivo
Revisar a arquitetura de persuasao de qualquer peca de copy — avaliando se os triggers psicologicos estao corretamente sequenciados, dosados e alinhados com a audiencia para maximizar conversao etica.

## Entrada
- Copy completa para review
- Copy brief (objetivo, audiencia, awareness level)
- Intencao do writer por secao
- Metricas-alvo

## Passos

### 1. Avaliar a Persuasion Architecture (5 Camadas)
**Verificar presenca e sequencia das 5 camadas:**

```
CAMADA 1: ATTENTION (Capturar)
  → Headline, hook, opening
  Pergunta: O leitor PARA para ler?

CAMADA 2: INTEREST (Engajar)
  → Relevancia, identificacao, empatia
  Pergunta: O leitor se IDENTIFICA?

CAMADA 3: DESIRE (Criar Desejo)
  → Beneficios, future pacing, transformacao
  Pergunta: O leitor QUER o resultado?

CAMADA 4: CONVICTION (Convencer)
  → Provas, testimonials, garantia
  Pergunta: O leitor ACREDITA que funciona?

CAMADA 5: ACTION (Converter)
  → CTA, urgencia, risk reversal
  Pergunta: O leitor AGE agora?
```

**Scoring por camada (1-5):**
| Score | Significado |
|:-----:|-------------|
| 1 | Camada ausente ou falha |
| 2 | Presente mas fraca |
| 3 | Funcional |
| 4 | Forte |
| 5 | Excepcional |

### 2. Verificar Triggers Psicologicos
**Checklist de 7 triggers (Cialdini + extras):**

| Trigger | Presente? | Bem Aplicado? | Notas |
|---------|:---------:|:-------------:|-------|
| Reciprocidade | ☐ | ☐ | Deu valor antes de pedir? |
| Compromisso/Consistencia | ☐ | ☐ | Micro-commitments antes do grande? |
| Prova Social | ☐ | ☐ | Especifica e relevante? |
| Autoridade | ☐ | ☐ | Credenciais demonstradas? |
| Afinidade/Liking | ☐ | ☐ | Rapport construido? |
| Escassez | ☐ | ☐ | Real e verificavel? |
| Unidade | ☐ | ☐ | Senso de pertencimento? |

**Scoring:** Min 4 de 7 triggers presentes para copy de conversao.

### 3. Avaliar Emotional-Rational Bridge
**Sistema 1 (Emocao) → Sistema 2 (Logica):**

| Verificacao | Pergunta | Score |
|-------------|----------|:-----:|
| Emotional hook | A copy comeca com emocao? | /5 |
| Rational support | Dados suportam o emocional? | /5 |
| Sequencia | Emocao ANTES de logica? | /5 |
| Balance | Nenhum domina excessivamente? | /5 |
| Landing | O CTA satisfaz AMBOS? | /5 |

### 4. Diagnosticar Persuasion Gaps
**Gaps comuns e solucoes:**

| Gap | Sintoma | Solucao |
|-----|---------|---------|
| Attention gap | Bounce alto, scroll curto | Reescrever headline/hook |
| Interest gap | Le mas nao engaja | Melhorar relevancia/empatia |
| Desire gap | Entende mas nao quer | Intensificar benefits/future pacing |
| Conviction gap | Quer mas nao acredita | Adicionar prova/garantia |
| Action gap | Acredita mas nao age | Melhorar CTA/urgencia/friction |

### 5. Emitir Parecer de Persuasao
**Formato do parecer:**
```
PERSUASION REVIEW REPORT

Copy: [Nome da peca]
Writer: [Agente]
Data: [Data]
Reviewer: Nudge (Persuasion Psychologist)

SCORE GERAL: [X]/5

PERSUASION ARCHITECTURE:
  Attention: [X]/5 — [nota]
  Interest: [X]/5 — [nota]
  Desire: [X]/5 — [nota]
  Conviction: [X]/5 — [nota]
  Action: [X]/5 — [nota]

TRIGGERS PRESENTES: [N]/7
  [Lista com status]

EMOTIONAL-RATIONAL BRIDGE: [X]/5
  [Nota]

GAPS IDENTIFICADOS:
  1. [Gap] — [Solucao recomendada]
  2. [Gap] — [Solucao recomendada]

ETHICAL CHECK: ✅ PASS / ⚠️ CONCERN / ❌ FAIL
  [Nota se concern/fail]

VEREDICTO:
  ✅ APPROVED — Pronta para publicacao
  🔄 REVISE — Ajustes necessarios antes de publicar
  ❌ REWRITE — Problemas fundamentais, reescrever

RECOMENDACOES TOP 3:
  1. [Mais impactante]
  2. [Segunda]
  3. [Terceira]
```

## Cross-Squad Handoff
```yaml
handoffs:
  - to: writer original
    delivers: Persuasion review report
    format: Parecer completo com recomendacoes acionaveis
  - to: copy-editor (Chisel)
    delivers: Insights para edicao final
    format: Gaps e recomendacoes por secao
```

## Saida
- Persuasion review report completo
- Score por camada (5 camadas)
- Trigger checklist preenchido
- Gaps identificados com solucoes
- Veredicto (APPROVED / REVISE / REWRITE)

## Validacao
- [ ] 5 camadas avaliadas com score
- [ ] 7 triggers verificados
- [ ] Emotional-Rational Bridge avaliado
- [ ] Gaps diagnosticados com solucoes
- [ ] Ethical check realizado
- [ ] Veredicto claro e acionavel
- [ ] Top 3 recomendacoes priorizadas
- [ ] Report documentado e entregue

---

*Task operada por: persuasion-psychologist (Nudge)*
