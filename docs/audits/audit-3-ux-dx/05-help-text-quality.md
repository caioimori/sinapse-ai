# Sub-domínio 5 — Help text quality

**Pergunta:** Cada `*help` ou `--help` é útil ou só lista comandos? Exemplos?

## Verdict: 🟡 CONCERNS

`bin/sinapse.js` tem help estruturado e razoavelmente completo (USAGE, UPDATE,
VALIDATION, CAPABILITIES, CONFIGURATION, SERVICE DISCOVERY, EXAMPLES).
`bin/cli.js` (a "canonical CLI") tem help separado por sub-comando — bom.
Falhas: drift entre os dois CLIs, brand SINAPSE-FullStack no header, link
quebrado no fim, e zero exemplos contextuais por comando.

---

## Findings

### F1 [P1] — Drift entre `npx sinapse-ai --help` e `sinapse --help`

**Onde:**
- `bin/cli.js` — handles `npx sinapse-ai`. Sub-comandos: install, update,
  uninstall, init, status, doctor, chrome-brain. ~7 comandos.
- `bin/sinapse.js:65-137` — handles `sinapse`. Lista 20+ comandos: install,
  init, update, brand, validate, info, doctor, telemetry (3 sub), qa (4 sub),
  chrome-brain (3 sub), config (5 sub), workers (1 sub), pro (delegate).

**Audit Dim 8 (CHANGELOG rc.10:** "Dual CLI drift confirmed (`npx sinapse-ai`
narrower than `sinapse`)" — já documentado mas não fechado.

**Impacto:** README:420-440 promove `npx sinapse-ai` como surface canônica
("4 comandos canônicos de lifecycle, 2 diagnósticos, 1 sub-comando avançado").
Mas o binário `sinapse` expõe muito mais. Inconsistência confunde quem alterna.

**Fix:** Deprecar `sinapse` binary OU explicitar status. Se `sinapse` é
"power user" e `sinapse-ai` é "público", documentar essa hierarquia.

---

### F2 [P1] — Header de help mostra `SINAPSE-FullStack v10.0.0-rc.11`

**Onde:** `bin/sinapse.js:67`
```js
SINAPSE-FullStack v${packageJson.version}
AI-Orchestrated System for Full Stack Development
```
**Reality:** Brand é `SINAPSE` (não FullStack). Coberto em sub-relatório 4 F2.
Aqui só registra: o **primeiro contato textual** após `--help` é uma marca legacy.

---

### F3 [P1] — Link no rodapé do help aponta pra org errada

**Onde:** `bin/sinapse.js:135`
```
For more information, visit: https://github.com/SinapseAI/sinapse-ai
```
**Reality:** Coberto em sub-relatório 4 F1. Esse link é mostrado em **todo**
`sinapse --help`. Bandeira vermelha permanente.

---

### F4 [P2] — Help do `init` pede project-name mas não tem exemplo de --template

**Onde:** `bin/sinapse.js:838-847`
```
Usage: npx sinapse-ai init <project-name> [options]
...
  -h, --help           Show this help message
```
**Análise:** Comando aceita `--template default|minimal|enterprise`
(`bin/sinapse.js:882-892`), mas o help do init não lista. Usuário descobre via
erro — UX ruim.

**Fix:** Adicionar `--template <name>` na seção Options + EXAMPLES com
`init my-app --template minimal`.

---

### F5 [P2] — `*help` interno de agentes não inspecionado neste audit

**Análise:** O escopo da pergunta inclui "cada `*help`". Não inspecionei
help-output de cada um dos 12 agentes core (precisaria spawn). Recomendação:
auditoria separada (`squad-validator` task) que ative cada agente em modo
dry-run e capture o output do `*help`.

**Spot check:** `.claude/commands/SINAPSE/agents/architect.md` define commands
no YAML (12 commands listados em `architect.md`). Se `*help` deriva desse YAML,
provavelmente OK. Mas validar.

**Fix:** Adicionar `tests/agents/help-output.spec.js` que valida cada
`*help` retorna >= 5 linhas com pelo menos 1 exemplo.

---

### F6 [P2] — Comandos "EXAMPLES" do `sinapse --help` desatualizados

**Onde:** `bin/sinapse.js:122-134`
```
# Install with minimal mode (only expansion-creator)
npx sinapse-ai-minimal@latest
```

**Análise:** `sinapse-ai-minimal` é um package separado? Existe? Se sim, não
está documentado no README. Se não existe mais, exemplo está mentindo.

**Fix:** Verificar e remover ou documentar.

---

### F7 [P3] — Output do help usa `logger.always` em vez de stdout

**Onde:** `bin/sinapse.js:66, 145` — `logger.always(...)`. OK pra coexistir com
`--quiet`/`--json`, mas verificar que `npx sinapse-ai --help | grep ...` não é
afetado por buffering. Pequeno detalhe.

---

### F8 [P3] — Doctor help (`bin/cli.js:1531`) é razoavelmente bom mas curto

**Onde:** `bin/cli.js:1531-1541`
**Análise:** Lista flags principais. Faltam exemplos contextuais ("Run before
opening an issue", "Run in CI as `--json`").

---

## Severity counts
- **P0:** 0
- **P1:** 3 (drift dual-CLI, header SINAPSE-FullStack, link errado no rodapé)
- **P2:** 3 (init sem --template no help, *help de agentes não auditado, examples stale)
- **P3:** 2 (logger.always, doctor help curto)

## Verdict: 🟡 CONCERNS — não-blocker isolado, mas P1s aqui amplificam P0s de outros sub-domínios.
