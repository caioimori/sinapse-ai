---
task: apply-loss-aversion-framing
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

# Task: Apply Loss Aversion Framing

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** STANDARD
- **Depends on:** copy draft, dados de impacto
- **Feeds:** writer original, copy-editor (Chisel)

## Objetivo
Aplicar loss aversion framing na copy — usando o principio de que pessoas sentem a dor da perda 2x mais que o prazer do ganho (Kahneman/Tversky) para intensificar motivacao de acao.

## Entrada
- Copy para enriquecer com loss framing
- Dados de impacto (o que perde se nao agir)
- Audiencia e contexto emocional
- Canal e formato

## Passos

### 1. Entender Loss Aversion
**Principio (Prospect Theory):**
Perder R$100 dói ~2x mais que ganhar R$100 agrada.
Logo: framear como "o que voce perde" e mais motivador que "o que voce ganha".

**Quando usar:**
- Decision stage (proximo do CTA)
- Urgencia/deadline situations
- Cost of inaction messaging
- Re-engagement de leads frios

**Quando NAO usar:**
- Awareness stage (assusta)
- Onboarding (cria ansiedade)
- Celebracoes (mata o mood)
- Excessivamente (fadiga emocional)

### 2. Tecnicas de Loss Framing
**Tecnica 1: Gain vs. Loss Reframe**
```
GAIN FRAME: "Ganhe 30% mais produtividade"
LOSS FRAME: "Voce esta perdendo 30% da sua produtividade"

GAIN FRAME: "Economize R$500/mes"
LOSS FRAME: "Voce esta desperdicando R$500/mes"
```

**Tecnica 2: Cost of Inaction**
```
"Cada dia sem [solucao], voce perde:
  → R$[X] em [metrica]
  → [Y] horas em [atividade]
  → [Z] oportunidades de [resultado]"
```

**Tecnica 3: Sunk Cost Awareness**
```
"Voce ja investiu [tempo/dinheiro] em [esforco].
 Sem [solucao], todo esse investimento pode ser perdido."
```

**Tecnica 4: Opportunity Window**
```
"Esta oportunidade existe AGORA porque [razao].
 Daqui a [tempo], as condicoes mudam e [consequencia]."
```

**Tecnica 5: Competitive Loss**
```
"Enquanto voce avalia, seus concorrentes ja estao usando.
 [X]% das empresas do seu segmento ja adotaram [solucao]."
```

### 3. Dosagem por Contexto
| Contexto | Intensidade | Exemplo |
|----------|:-----------:|---------|
| Landing Page (hero) | Media | "Pare de perder [metrica]" |
| Landing Page (pre-CTA) | Alta | "Cada dia sem [solucao] custa R$[X]" |
| Email (urgencia) | Alta | "Sua oferta expira em [X]h — nao perca" |
| Email (nurture) | Baixa | "O que [audiencia] perde sem [insight]" |
| Ad (retargeting) | Media | "[Produto] ainda esperando. Nao perca [beneficio]" |
| Social | Baixa | "O erro que custa [X] para [audiencia]" |

### 4. Ethical Loss Framing Guidelines
**PERMITIDO (etico):**
- Quantificar custo real de inacao (com dados)
- Mostrar deadline real de oferta
- Compartilhar consequencias verificaveis
- Usar "opportunity window" genuina

**PROIBIDO (manipulativo):**
- Criar medo excessivo sem base real
- Fabricar urgencia falsa
- Exagerar consequencias de nao comprar
- Usar loss framing para produtos triviais
- Pressionar em situacoes vulneraveis (saude, financas)

**Teste etico:**
"Se o prospect descobrisse que usei loss framing, ele se sentiria manipulado ou informado?"
- Informado → Etico ✅
- Manipulado → Revise ❌

### 5. Aplicar na Copy
**Passo a passo:**
1. Identificar claims de GANHO na copy
2. Reframear top 3 como PERDA
3. Posicionar loss frames perto do CTA
4. Equilibrar com gain frames (nao ser 100% negativo)
5. Verificar ethical guidelines

**Proporcao recomendada:**
- Copy geral: 70% gain / 30% loss
- Pre-CTA: 50% gain / 50% loss
- Urgencia/deadline: 40% gain / 60% loss

## Saida
- Copy reframeada com loss aversion
- Before/after de gain→loss frames
- Dosagem calibrada por secao
- Ethical check documentado

## Validacao
- [ ] Loss frames baseados em dados reais
- [ ] Dosagem apropriada (nao excessivo)
- [ ] Equilibrio gain/loss respeitado
- [ ] Posicionamento estrategico (proximo ao CTA)
- [ ] Ethical test passado
- [ ] Nao cria medo excessivo
- [ ] Nao usa em contextos vulneraveis

---

*Task operada por: persuasion-psychologist (Nudge)*
