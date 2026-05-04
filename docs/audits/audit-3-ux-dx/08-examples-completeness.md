# Sub-domínio 8 — Examples completeness

**Pergunta:** Cada feature ship tem exemplo runnable? Snippets atualizados?

## Verdict: 🟡 CONCERNS

`docs/examples/squads/` tem 3 examples runnable estruturados (basic-squad,
multi-agent-squad, squad-with-tools) — bom **pra autoria de squads**. Mas
features de primeira linha (instalação em projeto existente, ativação de
agente, workflow SDC, grounding, MCP) não têm exemplos isolados. Quem chega
e quer "ver funcionando" sem instalar não tem nada visual ou copy-pasteável
fora do README.

---

## Findings

### F1 [P1] — Zero exemplo runnable de features core (install, status, doctor, agent activation)

**Onde:** Não existe `docs/examples/cli/` ou `docs/examples/workflows/`.
**Cobertura atual:** Apenas `docs/examples/squads/` (autoria de squads custom).

**Gap:**
- Não há recording (asciinema/gif) de `npx sinapse-ai install` rodando
- Não há output sample de `*help` do `@developer`
- Não há fluxo end-to-end "criar story → implementar → QA gate → push" como
  example navegável

**Impacto:** Usuário que avalia o framework antes de instalar precisa ler 495
linhas de README + 195 de getting-started. Não há "demo em 30s".

**Fix:**
1. Criar `docs/examples/quickstart-recording.md` com asciinema embed
2. Criar `docs/examples/sdc-walkthrough/` com story example + outputs reais
3. Linkar do README seção "Quick Start"

---

### F2 [P1] — `docs/examples/squads/basic-squad/` não diz como ativar o squad

**Onde:** `docs/examples/squads/basic-squad/README.md` tem 47 linhas mas
sample da Usage section (linha 20-21) corta em "Load this squad" — não vi
o restante. Recomendo verificar que README do example mostra:
1. Como copiar pra `squads/`
2. Como o installer pega
3. Como ativar `@greeter-agent`
4. Output esperado

Sem isso, é só uma estrutura — não um example runnable.

---

### F3 [P2] — Examples não testados no CI

**Análise:** Se `docs/examples/squads/basic-squad/squad.yaml` tem schema
inválido ou referência quebrada, ninguém pega antes da release. O ideal:
um teste no CI que carrega cada example e valida que parseia + agentes carregam.

**Fix:** `tests/examples/squads-load.spec.js` que itera examples/ e valida.

---

### F4 [P2] — Grounding setup (Story 10.47) sem example de configuração real

**Onde:** README:43-56 introduz grounding, linka `docs/guides/grounding-setup.md`.
Não inspecionei o guide a fundo, mas falta:
- Example real de `~/.claude/sinapse-ai-config.yaml` populado
- Diff antes/depois mostrando como uma resposta de agente muda com vault grounding ativo
- Example de injection point pra vault markdown (path Windows + macOS + Linux)

**Fix:** Seção "Examples" no `grounding-setup.md` com 3 cenários concretos.

---

### F5 [P2] — MCP servers anunciados mas sem example de output

**Onde:** README menciona MCP no quadro de paridade (linha 343). Mas não há
example mostrando:
- Output de `npx sinapse-ai chrome-brain install`
- Como agente usa Chrome Brain (sample prompt + result)
- Troubleshooting visual

**Fix:** `docs/examples/mcp/chrome-brain-walkthrough.md`.

---

### F6 [P3] — `docs/examples/squads/squad-with-tools/` nome ambíguo

**Análise:** "with-tools" cobre que tipo de tools? Custom? MCP? Templates?
Renomear pra mais específico (ex.: `squad-with-custom-tools` ou
`squad-with-mcp-integration`).

---

### F7 [P3] — Sample em `tool-overrides-example.yaml` solto fora de subdir

**Onde:** `docs/examples/squads/tool-overrides-example.yaml`. Outros examples
têm pastas próprias com README + manifest. Esse arquivo é solto — quebra padrão.

**Fix:** Mover pra `docs/examples/squads/tool-overrides-example/` com README
explicativo.

---

## Severity counts
- **P0:** 0
- **P1:** 2 (zero example de features core, basic-squad usage incompleto)
- **P2:** 3 (examples não testados em CI, grounding sem exemplo, MCP sem exemplo)
- **P3:** 2 (squad-with-tools naming, arquivo solto)

## Verdict: 🟡 CONCERNS — não-blocker mas aumenta TTV (time to value) significativamente.
