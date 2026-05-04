# Article Gates — Constitution VII/VIII/XI Automatizados

> **Story:** GA-1.5
> **Status:** Production
> **Constitution articles:** VII (Metrics Accuracy), VIII (Mandatory Delegation), XI (Conservative Default)

Este documento descreve os tres gates automatizados que protegem os artigos
NON-NEGOTIABLE da Constitution em CI e no pipeline de publicacao NPM.

## Por que existem

A Constitution define principios. Sem enforcement automatizado, principios
viram prosa que dev's bem-intencionados infringem por descuido. Os tres
artigos cobertos por esta story ja estavam definidos textualmente, mas ate
GA-1.5 nao tinham gate automatizado em CI:

- **Article VII (Metrics Accuracy):** counts de squads/agentes/orqx/tasks
  divergiam entre `constitution.md` (canonico) e docs publicos (README, AGENTS).
- **Article VIII (Mandatory Delegation):** o hook runtime
  `enforce-delegation.cjs` ja existia, mas nao havia gate CI verificando que
  ele continuava registrado e que orqx files estavam limpos de instrucoes
  de execucao direta.
- **Article XI (Conservative Default):** nao havia bloqueio mecanico contra
  deletions amadoras em paths protegidos (agents, tasks, hooks).

## Como cada gate funciona

### Article VII — Metrics Accuracy

**Script:** `scripts/validate-article-vii.js`
**Comando:** `npm run validate:article-vii`
**Roda em:** CI (`article-gates.yml`) + pre-publish (`npm-publish.yml`)

#### O que faz

1. Reusa `scripts/sync-counts.js#collectCounts()` para obter os numeros
   canonicos (squads, agentes totais, orqx totais, tasks).
2. Verifica que cada um destes documentos refere aos MESMOS numeros:
   - `README.md`
   - `README.en.md`
   - `AGENTS.md`
   - `package.json` (campo `description`)
   - `packages/installer/src/wizard/feedback.js`
3. Saida:
   - **Exit 0** se consistente.
   - **Exit 1** + relatorio detalhado (file:linha + drift) se houver divergencia.
4. Flag `--fix` imprime sugestoes de remediacao (`sed` commands).

#### Heuristicas

- "X squads" / "X squad" — qualquer numero >= 5
- "X agentes" / "X agents" — qualquer numero >= 50
- "X tasks" (com ou sem separador `,` ou `.`) — qualquer numero >= 100

Numeros menores que esses thresholds sao ignorados (evita falso-positivo
em fragments tipo "5 commands" ou "8 hooks").

#### Como remediar drift

```bash
# 1. Atualize os numeros canonicos (a constitution e regerada por este script):
npm run sync:counts

# 2. Atualize manualmente os documentos com os numeros novos.
# 3. Confirme:
npm run validate:article-vii
```

### Article VIII — Mandatory Delegation

**Script:** `scripts/validate-article-viii.js`
**Comando:** `npm run validate:article-viii`
**Roda em:** CI (`article-gates.yml`)

#### O que faz

1. Verifica que `.claude/settings.json` tem `enforce-delegation.cjs`
   registrado nos hooks `PreToolUse` para Bash E Write/Edit.
2. Verifica que `.claude/hooks/enforce-delegation.cjs` existe e tem
   sintaxe valida (`node --check`).
3. Varre todos os arquivos `*-orqx.md` em `squads/` e
   `.sinapse-ai/development/agents/`. Procura padroes de execucao direta
   que orquestradores nao deveriam ter:
   - "use Edit tool"
   - "use Write tool"
   - "execute Bash"
   - "run npm install/run/test/publish"
   - "rode npm install/run/test/publish"
4. Tem allowlist de contextos legitimos (delegacao explicita, mencao a
   `@developer` ou `@devops`, etc.) — nao alarma quando a frase descreve
   o trabalho do AGENTE DESTINO da delegacao.

#### Como remediar

Se o gate falhar com "L<N>: instrucao direta `use Edit tool`":

- ❌ ERRADO no orqx: "Use the Edit tool to modify story files."
- ✅ CERTO: "Delegate to @developer who will use Edit to modify story files."

Se o hook nao estiver registrado: reaplicar `.claude/settings.json` template.

### Article XI — Conservative Default

**Script:** `scripts/validate-article-xi.js`
**Comando:** `npm run validate:article-xi`
**Roda em:** CI (`article-gates.yml`, apenas em PRs)

#### O que faz

1. Computa `git diff --name-status -M origin/<base>...HEAD`.
2. Filtra deletions PURAS (status `D`) — renames (`R`, detectados via `-M`)
   sao ignorados explicitamente.
3. Verifica se a deletion atinge paths protegidos:
   - `.sinapse-ai/development/agents/`
   - `squads/<squad>/agents/`
   - `squads/<squad>/tasks/`
   - `squads/<squad>/knowledge-base/`
   - `bin/`
   - `.claude/hooks/`
4. Se ha deletions protegidas, exige justificativa explicita em UM dos
   commit messages OU no PR body, no formato:

   ```
   Article XI override: <razao concreta>
   ```

5. Saida:
   - **Exit 0** se zero deletions OR todas justificadas.
   - **Exit 1** + relatorio listando files se nao justificado.

#### Como justificar uma deletion legitima

Quando precisar deletar arquivos em paths protegidos (deprecation, refactor
de squads, etc.), inclua um commit OU edite o PR body com:

```
Article XI override: agentes movidos para legacy/ apos deprecation v1.0
```

O matcher e case-insensitive e aceita ":" com espacos variaveis.

#### Por que essa rigidez?

Auditorias 2-3 (pre-GA) identificaram que deletions amadoras de agents
foram a causa raiz de regressoes em rcs. O Article XI estabelece a
"conservative default" — preferir manter sobre deletar, e exigir
justificativa explicita quando a deletion for intencional.

## Workflow CI

`.github/workflows/article-gates.yml` executa tres jobs paralelos:

```
Trigger: PR opened/synchronize/reopened OR push to main

  ┌── article-vii  (sempre)
  ├── article-viii (sempre)
  └── article-xi   (so PRs — push para main bypassa, pois ja foi via PR)
```

Branch protection rules em `main` exigem que TODOS os tres status checks
passem antes do merge.

## Workflow npm-publish

`.github/workflows/npm-publish.yml` adiciona um pre-publish step que roda
`validate:article-vii` antes de `bin/utils/validate-publish.js` e do
`npm publish`. Article VIII e XI nao sao re-checados aqui pois ja foram
validados no merge da PR (e drift de delegacao/deletion nao acontece
entre merge e publish).

## Como bypassar (uso raro, autorizado)

### Article VII bypass

Nao ha bypass — drift de metricas e sempre erro. Atualize os documentos.

### Article VIII bypass

Nao ha bypass — orquestradores nunca executam diretamente. Adicione
delegacao explicita (`@developer`, `@devops`, etc.) na linha em conflito.

### Article XI bypass

Adicionar `Article XI override: <reason>` em commit OU PR body.
Recomenda-se documentar a razao com clareza pois o override fica gravado
no historico git para auditoria.

## Manutencao

- **Adicionar novo doc ao Article VII:** edite a constante `TARGETS`
  em `scripts/validate-article-vii.js`.
- **Adicionar novo path protegido (Article XI):** edite `PROTECTED_PREFIXES`
  ou `PROTECTED_PATTERNS` em `scripts/validate-article-xi.js`.
- **Adicionar novo pattern proibido (Article VIII):** edite `FORBIDDEN_PATTERNS`
  em `scripts/validate-article-viii.js`.

Nenhuma manutencao deveria mexer em `enforce-delegation.cjs` (runtime) nem
`sync-counts.js` (regenera constitution) — esses sao reusados, nao
modificados.

## Referencias

- Constitution: `.sinapse-ai/constitution.md` (Articles VII, VIII, XI)
- Hook runtime: `.claude/hooks/enforce-delegation.cjs`
- Counts canonicos: `scripts/sync-counts.js`
- Story: `docs/stories/ga-1.5-article-gates.story.md`
