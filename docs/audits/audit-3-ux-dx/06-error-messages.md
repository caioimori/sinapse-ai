# Sub-domínio 6 — Error messages

**Pergunta:** Mensagens de erro guiam usuário pra solução? Actionable ou só "Error: foo"?

## Verdict: 🟡 CONCERNS

A maioria dos errors do `bin/cli.js` segue padrão razoável (vermelho + dica de
recovery). `bin/sinapse.js` mistura PT/EN, faz uso amplo de "Please ensure
SINAPSE-FullStack is installed correctly" (não-acionável e brand-legacy), e
exibe stack traces brutos quando `--verbose`. Falhas de UX, não de runtime.

---

## Findings

### F1 [P1] — "Please ensure SINAPSE-FullStack is installed correctly" repete-se sem actionable

**Onde:**
- `bin/sinapse.js:50` (wizard not found)
- `bin/sinapse.js:328` (updater module not found)
- `bin/sinapse.js:522` (patch script not found)

**Problemas:**
1. **Não-acionável:** "ensure ... installed correctly" não diz **o quê** o
   usuário deve fazer. Reinstall? Doctor? Reportar bug?
2. **Brand legacy:** "SINAPSE-FullStack" coberto em sub-relatório 4 F2.
3. **Inglês isolado:** Resto do CLI é PT. Quebra de tom.

**Fix proposto pra cada:**
```
❌ Wizard de instalação não encontrado.
   Tente: npm install --force sinapse-ai
   Se persistir: https://github.com/<org>/sinapse-ai/issues/new?template=1-bug-report.yml
```

---

### F2 [P1] — Mistura PT/EN inconsistente em error messages

**Inventário** (`bin/sinapse.js`):
- L49: `❌ Initialization wizard not found` (EN)
- L50: `Please ensure SINAPSE-FullStack is installed correctly.` (EN)
- L306: `❌ Validation error: ${validatorError.message}` (EN)
- L368: `❌ Update error: ${error.message}` (EN)
- L753: `✗ Failed to remove ${item.path}: ${error.message}` (EN)
- L906: `❌ Project name is required` (EN)

**vs README/CHANGELOG/docs em PT.**

**Política Safe Collaboration (CLAUDE.md):** "Linguagem simples em portugues."
**Reality:** Errors do CLI são em EN. Drift constitucional.

**Fix:** Pass de tradução pra todos os `logger.error()` em `bin/`.

---

### F3 [P1] — Erros de "Unknown command" não sugerem comando próximo

**Onde:** `bin/cli.js:1748-1749`
```
logger.error(`${RED}Unknown command:${NC} ${command}`);
logger.error(`Run ${CYAN}npx sinapse-ai help${NC}`);
```

**Análise:** OK ao linkar pra `help`. Mas se usuário digitou `npx sinapse-ai
isntall` (typo), seria valioso retornar "Did you mean: install?" via
Levenshtein simples (3 linhas de código).

**Fix:** Adicionar fuzzy match.

---

### F4 [P2] — Stack traces expostos em `--verbose`

**Onde:** `bin/sinapse.js:308, 370`
```js
if (logger.level === 'debug') {
  logger.error(validatorError.stack);
}
```

**Análise:** Stack trace completo num error message já é ruim, mas em `--verbose`
(não `--debug`) o usuário típico não está debugando — está tentando entender
**por que falhou**. Stack do Node.js polui.

**Fix:** Stack trace só em `--debug`. Em `--verbose`, mostrar `error.message`
+ "Run with `--debug` for stack trace".

---

### F5 [P2] — `process.exit(1)` sem context cleanup

**Onde:** múltiplos pontos em `bin/cli.js` (1012, 1354, 1439, 1672+).
**Análise:** `process.exit(1)` força flush incompleto. Em CI, log linhas finais
podem ser perdidas. `bin/cli.js:1528` tem comentário: "process.exitCode (rather
than process.exit) to let stdout flush cleanly" — mas só aplicado em alguns
casos.

**Fix:** Padronizar `process.exitCode = 1; return;` em todos os exits.

---

### F6 [P2] — Errors não têm error code estruturado

**Análise:** Em CI/scripting, é útil distinguir erro por código (E_NO_NODE,
E_PERMISSION, E_NETWORK, etc.). Atualmente todos saem com exit 1 e mensagem
livre. `--json` (Story A.2) cobre parcialmente, mas não há código numérico
estável.

**Fix:** Tabela de error codes em `docs/guides/cli-errors.md` + uso consistente.

---

### F7 [P2] — Doctor exit codes 0/1/2 não documentados em help

**Onde:** `bin/postinstall.js:30-37` documenta no comentário do código mas
`bin/cli.js:1531-1541` (help do doctor) não menciona exit codes. CI pipelines
precisam disso.

**Fix:** Help do doctor lista exit codes.

---

### F8 [P3] — Emojis ❌/✗/⚠ misturados sem padrão

**Inventário:** ❌ (sinapse.js), ✗ (sinapse.js:753), ⚠ (sinapse.js:770), 🔴
(internal). Sem padrão de severidade.

**Fix:** Convenção: ❌ = error fatal, ⚠ = warning, ✗ = step failed dentro de
operação composta. Padronizar.

---

## Severity counts
- **P0:** 0
- **P1:** 3 (mensagem genérica não-acionável, mistura PT/EN, sem fuzzy match)
- **P2:** 4 (stack em verbose, process.exit, sem error codes, doctor exit codes)
- **P3:** 1 (emojis sem padrão)

## Verdict: 🟡 CONCERNS — não-bloqueante. Fix de PT/EN é o mais importante (consistência de tom).
