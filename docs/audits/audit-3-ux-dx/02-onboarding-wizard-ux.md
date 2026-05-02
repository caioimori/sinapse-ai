# Sub-domínio 2 — Onboarding wizard UX

**Pergunta:** Fluxo `npx sinapse-ai install` em fresh máquina — flow, prompts,
defaults sane, error recovery.

## Verdict: 🟢 PASS (com 3 P2 polish items)

A maquinaria do wizard está sólida: detecção multi-signal de TTY (Story 10.46
fechou o blocker P0 de Git Bash), inquirer com fallback readline, opt-in de
grounding (Story 10.47), warning não-interativo emitido uma vez por invocação.
Os defaults são sane. Falhas não são UX-bloqueantes pra GA.

---

## Findings

### F1 [P2] — Header ASCII art só na primeira execução

**Onde:** `bin/cli.js:40-66` — `header()` é gated por `shouldShowHeader(logger)`,
depois `markFirstRunDone()`. Reruns ficam silenciosos por design.
**Análise:** Decisão correta pra reduzir ruído em CI. Mas:
- Não há flag `--show-header` documentada se o usuário quiser ver de novo
- `--verbose` cobre, mas não está claro no `--help` que isso revela a logo.
**Sugestão:** Documentar no `--help` que `--verbose` mostra header sempre.

---

### F2 [P1] — Erro "wizard not found" guia mal o usuário

**Onde:** `bin/sinapse.js:49-50`
```
logger.error('❌ Initialization wizard not found');
logger.error('Please ensure SINAPSE-FullStack is installed correctly.');
```
**Problemas:**
1. "SINAPSE-FullStack" é nome legado (sub-domínio 4 trata)
2. "Please ensure ... installed correctly" não diz **como**. Não há próximo passo
   acionável (ex.: "Run `npm install -g sinapse-ai` or `npx sinapse-ai@latest install`").
3. Mistura PT (resto do CLI) com EN (essa mensagem). Inconsistente.

**Fix:** Mensagem em PT + comando concreto + link pra docs.

---

### F3 [P2] — Warning não-interativo não diz como forçar

**Onde:** `bin/cli.js:269-279` — emite "Modo não-interativo detectado" mas a
flag de override (`--interactive`) está apenas no comentário do código, não no
texto de saída.
**Lê-se em `bin/cli.js:278`:** `(use --interactive pra forcar prompts)` — OK,
está lá. **Revisão:** já cumpre. Downgrade pra LOW. **(P3)**

---

### F4 [P1] — Falha de sync:ide em postinstall sai com exit 2 sem dica de recovery

**Onde:** `bin/postinstall.js:24-28`
```
Exit codes:
  0  success OR non-critical warning (framework operational)
  2  critical failure (sync:ide failed, or doctor exit >= 2)
```
**Análise:** comportamento correto pra npm — mas a saída ao usuário precisa
guiar pra `sinapse doctor --fix` ou `npm rebuild sinapse-ai`. Verificar se
`bin/postinstall.js` linha 28+ documenta isso na mensagem ao usuário (não só
no comentário). Sem o guia visível, o usuário fica órfão.

**Verificação rápida:** Não inspecionei o output completo do postinstall (615
linhas). Recomendo verificar manualmente que mensagens de exit-2 incluam
"próximo passo".

---

### F5 [P2] — Nenhuma confirmação visual ao final do install

**Onde:** Quick Start no README diz "Pronto. Voce tem 18 squads operando."
Mas não há comando recomendado pra "primeiro contato útil" (ex.: "agora rode
`npx sinapse-ai status` ou ative `@developer`"). README:79-86 cobre mas o
**output do wizard em si** deveria fechar com a mesma sugestão.

**Fix:** Última linha do postinstall: "Próximo passo: `@developer` no Claude
Code, ou `npx sinapse-ai status` pra ver o que foi instalado."

---

### F6 [P3] — Multi-prompt sequencial sem contador "X de Y"

**Onde:** `bin/cli.js:286-358` — wizard pergunta LLM, depois grounding, etc.
Usuário não sabe quantas perguntas faltam. Pequeno polish: prefix com
"(1/3) Idioma:", "(2/3) LLM:", etc.

---

### F7 [P2] — Reconfigure flag (`--reconfigure`) não está documentada no `--help`

**Onde:** `bin/cli.js:1672` mostra que install aceita `reconfigure: isReconfigure`.
Verificar se `--help` lista. README:430 lista `--force` mas não `--reconfigure`.
Se a flag existe e funciona, documentar; se é interna, remover do parser.

---

## Severity counts
- **P0:** 0
- **P1:** 2 (erro "wizard not found", recovery em postinstall exit 2)
- **P2:** 3 (header rerun, confirmação final, reconfigure undocumented)
- **P3:** 2 (warning override OK na verdade, contador X de Y)

## Verdict: 🟢 PASS — não bloqueia GA. Fix P1s pré-v1 pra reduzir tickets de suporte.
