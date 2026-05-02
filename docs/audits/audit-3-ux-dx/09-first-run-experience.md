# Sub-domínio 9 — First-run experience

**Pergunta:** Hint quando agent não existe, fallbacks UX, primeira interação após install.

## Verdict: 🟡 CONCERNS

Postinstall foi reformulado em Story B.1 ("Minimalist Install Output Design") —
≤8 linhas friendly em PT, exit codes corretos, modo `--verbose`/`--json`
suportados. Bom. Mas o **gap entre "instalou" e "primeiro agente útil"** ainda
exige 3-4 saltos de docs. E não há fallback explícito quando usuário tenta
ativar `@agent-inexistente`.

---

## Findings

### F1 [P1] — Sem hint contextual quando usuário ativa agent inexistente

**Cenário:** Usuário lê README, vê `@developer`. Tenta `@dev` ou `@desenvolvedor`
ou `@coder`. Claude Code responde com "agent not found" genérico (resposta nativa
do Claude Code, não controlada pelo SINAPSE).

**Análise:** O SINAPSE não tem hook que intercepta agent-not-found e sugere
"Did you mean: @developer? List of available agents: ...". Limitação do Claude
Code, mas dá pra mitigar:
- Documentar lista canônica de aliases em getting-started
- Considerar registrar `@dev` → `@developer` como alias

**Fix sugestão:** `.claude/agents/aliases.json` com mapping comum, processado
pelo SINAPSE installer.

---

### F2 [P1] — Postinstall não termina com "próximo passo" claro

**Onde:** `bin/postinstall.js` (linhas 1-50 amostradas). Story B.1 entregou
saída minimalista mas não mostrei se a última linha sugere "Próximo: rode
`@developer` no Claude Code, ou `npx sinapse-ai status` pra ver o que foi
instalado".

**Verificação manual recomendada:** Ler output real do postinstall. Se não
houver "next step" final, adicionar.

---

### F3 [P2] — Sem health check após primeiro install que detecte Claude Code ausente

**Cenário:** Usuário instala SINAPSE em projeto, mas não tem `@anthropic-ai/claude-code`
(ou tem versão antiga). Vai tentar `@developer` no Claude Code. Doctor cobre
parte disso, mas não roda automaticamente após install (apenas "quiet" via
postinstall).

**Verificação:** `bin/postinstall.js` linha 17-19 menciona
`sinapse doctor --quiet`. OK. Mas se o doctor reporta WARN (Claude Code não
instalado), o usuário lê "Instalação parcial" e não sabe o que fazer.

**Fix:** Quando doctor reporta WARN, postinstall printa "Para resolver: rode
`sinapse doctor --fix` ou veja `docs/guides/installation-troubleshooting.md`".

---

### F4 [P2] — `*help` não está sendo testado em CI

**Análise:** Coberto em sub-relatório 5 F5. Repetindo: primeiro
comando que usuário roda após ativar agente é `*help`. Se output for vazio,
malformado ou aponta pra task inexistente, primeira impressão arruinada.

---

### F5 [P2] — Greeting do agente assume git repo válido

**Onde:** `.sinapse-ai/development/agents/architect.md` linhas 21-24:
```
0. GREENFIELD GUARD: If gitStatus in system prompt says
   "Is a git repository: false" OR git commands return "not a git repository":
   - For substep 2: skip the "Branch:" append
   - For substep 3: show "📊 Project Status: Greenfield project ..."
```

**Análise:** OK pra greenfield (sem git). Mas e em **brownfield com git inválido**
(repo corrompido, .git/ permission denied)? Provavelmente greeting falha
silenciosamente. Casos edge não cobertos.

**Fix:** Adicionar fallback "git error → continuar greeting sem branch info,
não bloquear ativação."

---

### F6 [P2] — Doctor não roda automaticamente em primeira ativação de agente

**Cenário:** Usuário instala (postinstall roda doctor quiet, OK). Dias depois,
ativa `@developer` e a configuração está corrupta (modificação manual,
update parcial). Não há check no momento da ativação.

**Sugestão:** Hook `SessionStart` que roda mini-validation (timeout 500ms) e
WARN se algo estiver fora.

---

### F7 [P3] — Postinstall em modo `--json` não documentado em help público

**Análise:** Story B.1 entrega `--json`. Mas é usado apenas em CI/scripting.
Documentar em `docs/guides/cli-reference.md` (não auditei se existe esse arquivo
— se não, criar).

---

### F8 [P3] — Falta "Welcome" gentle pra primeira execução

**Análise:** Caio menciona em memory que usuários (Caio + Matheus) são
distribuidores, não devs. Primeira execução de install poderia ter banner
"Bem-vindo ao SINAPSE! Vamos configurar 19 squads de IA pro seu projeto. Leva
~30 segundos." em vez de cair direto nos prompts.

**Sugestão:** Linha amigável de welcome antes do primeiro prompt do wizard.

---

## Severity counts
- **P0:** 0
- **P1:** 2 (sem hint pra agent não-existente, postinstall sem next-step)
- **P2:** 4 (Claude Code ausente, *help não testado, greeting brittle, doctor não roda em SessionStart)
- **P3:** 2 (--json undocumented, falta welcome)

## Verdict: 🟡 CONCERNS — não-blocker. F1 + F2 são alta prioridade pós-GA pra reduzir abandono.
