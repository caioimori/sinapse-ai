# Sub-domínio 1 — README primeira impressão

**Pergunta:** <30s, usuário entende o quê + por quê. Hook, value prop, CTA.

## Verdict: 🟡 CONCERNS

README é forte estruturalmente (badges, hook em PT, Quick Start em 3 passos, FAQ
de instalação, CLI Reference). Falha em 3 pontos críticos: drift de números
constitucionais, persona names divergentes, e badge de testes desatualizado.
São defeitos de **honestidade pública**, não de retórica.

---

## Findings

### F1 [P0] — Drift de contagens vs. realidade do repo

**Onde:** `README.md:24, 26, 36, 68, 86, 305, 329, 487`
**Reality:**
- README afirma: "186 agentes em 18 squads especializados" + "1.425 tasks"
- `package.json:3` description: "19 squads, 200 agentes especializados"
- `CHANGELOG.md:42-43` (rc.11): "Real numbers: 19 squads, 200 agents, 22 orqx commands, 1237 tasks"
- `.sinapse-ai/constitution.md` reconciliada via `npm run sync:counts` (Block 1, rc.11)

**Impacto:** Usuário lê o README, dá `npx sinapse-ai status`, vê 19/200/1237 →
percebe inconsistência → perde confiança ANTES da primeira interação.
Constitutional Article VII (Ecosystem Metrics Accuracy) é NON-NEGOTIABLE
e está sendo violado pelo README na vitrine pública.

**Fix proposto:** Substituir todas as 8 ocorrências por 19/200/1237. Se os
contadores são auto-gerados, gerar README a partir do mesmo source.

---

### F2 [P0] — Badge de testes desatualizado

**Onde:** `README.md:5`
**Atual:** `tests-10729%20passed-success`
**Reality:** Spawn prompt informa 11003 tests pass; `npx jest --listTests` lista
362 arquivos de teste no repo.
**Impacto:** Badge é a primeira coisa visualmente proeminente. Drift de 274 testes
sinaliza descuido público. Trocar pra badge dinâmico do CI ou atualizar a cada release.

---

### F3 [P1] — Persona names no README divergem do getting-started

**Onde:** `README.md:241-252` lista 12 personas (Pixel/Litmus/Stratum/Beacon/Axis/
Sync/Scope/Tensor/Mosaic/Pipeline/Imperator/Loom).
`docs/guides/getting-started.md:117-126` lista personas legacy-upstream legacy
(Pixel/Quinn/Aria/Morgan/Pax/Sync/Alex/Dara/Uma/Gage).

**Reality canonical:** `.sinapse-ai/development/agents/architect.md:[name: Stratum]`,
ou seja, README está correto, getting-started está com 8/10 nomes errados.

**Impacto:** Primeira ação do usuário pós-README é abrir getting-started. Vê
nomes diferentes → assume bug ou abandono. Resolver no sub-relatório 3 (Docs
consistency) — aqui só sinalizo a consequência sobre a impressão inicial.

---

### F4 [P1] — Bloco "Tests Passed" + "Constitution: 10 articles" não baterão se contagem mudar

**Onde:** `README.md:5-6`
**Risco:** Badges hardcoded em string. Sem CI hook que falha quando o número
real diverge. Sugestão: badge dinâmico via shields.io endpoint contra
`.sinapse-ai/constitution.md` ou contra um endpoint do CI.

---

### F5 [P2] — Hook de atenção não diferencia SINAPSE de outros frameworks de squad

**Onde:** `README.md:16` — "Squads de IA que constroem com voce, nao para voce."
Forte, mas não contém o diferencial competitivo (Constitution/19 hooks/CLI First)
até parágrafos depois.

**Sugestão:** Manter o tagline + adicionar uma única linha explícita sobre o
diferencial (ex.: "Governado por uma Constitution com enforcement em runtime —
não promessa, hook.").

---

### F6 [P2] — Mermaid diagrams não renderizam fora do GitHub

**Onde:** `README.md:172-203` (4 camadas), `258-274` (workflow)
**Risco:** README é exibido em npmjs.com (que NÃO renderiza Mermaid). Usuário que
chega via npm vê código bruto. Solução: gerar PNG fallback via CI ou usar
ASCII art simples.

---

### F7 [P3] — Repetição de claim "186 agentes" em 6 lugares

**Onde:** linhas 24, 26, 36, 86, 305, 329, 487. Mesmo número repetido inflate o
risco de drift. **Fix:** Single source of truth (variável injetada). Já existe
`npm run sync:counts` — estender pra README.

---

### F8 [P3] — Nota técnica `npm install` no meio do Quick Start quebra o flow

**Onde:** `README.md:88` — bloco denso sobre `SINAPSE_SKIP_POSTINSTALL`,
`--ignore-scripts` etc. Em sub-30s o leitor é punido. **Fix:** mover pra seção
"Para CI / pipelines avançadas" no fim do README.

---

## Severity counts
- **P0:** 2 (drift de contagens, badge stale)
- **P1:** 2 (persona drift consequência, badges não-dinâmicos)
- **P2:** 2 (hook genérico, mermaid no npm)
- **P3:** 2 (DRY de números, nota CI no Quick Start)

## Verdict: 🟡 CONCERNS — bloqueia GA enquanto P0 não fechar (vergonha pública).
