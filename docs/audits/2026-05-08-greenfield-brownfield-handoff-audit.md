# Greenfield ↔ Brownfield Handoff Audit — 2026-05-08

> **Trigger:** maintainer feedback ("os modos de projeto precisam mudar sem nenhum gargalo")
> **Goal:** mapear o handoff entre projeto greenfield (novo) e brownfield (existente) — onde quebra
> **Scope:** read-only
> **Baseline:** PRs #180-#184 desta sessão atualizaram a doc, mas o código ainda não.

## TL;DR

Doc → Código tem gap **crítico**. As regras (`project-intelligence.md`, `sinapse-orqx.md`) descrevem 5 maturity levels (`EMPTY` / `BOOTSTRAPPED` / `PARTIAL` / `MATURE` / `SINAPSE_MANAGED`) e 8 dimensions de audit. O código (`bob-orchestrator.js`) implementa só **3 signals** e **4 estados** — nenhum cobre a graduação de greenfield → brownfield.

**Resultado prático:** um projeto greenfield que termina Phase 3 (Dev Cycle) e ganha código + testes + docs **nunca é reconhecido como brownfield** na próxima invocação. Continua sendo tratado como greenfield pra sempre. Os 3 workflows brownfield-{ui,service,fullstack}.yaml estão **órfãos** — ninguém invoca.

## Mapa atual (código real, não doc)

### Greenfield (existe, funciona até Phase 3)

`.sinapse-ai/core/orchestration/greenfield-handler.js` (890 linhas):

```
isGreenfield() ← checa 5 indicators (package.json, .git, docs/, src/, .sinapse-ai/)
  ↓
handle()
  ├─ Phase 0 Bootstrap   (linha 287)  → spawn @devops env-bootstrap
  ├─ Phase 1 Discovery   (linha 333)  → spawn 5-agent: analyst → pm → ux → architect → po
  ├─ Phase 2 Sharding    (linha 405)  → spawn @po shard-documents
  └─ Phase 3 Dev Cycle   (linha 452)  → transição pra WorkflowExecutor
                           linha 478  → return action: 'greenfield_dev_cycle' (FIM)
                           [GAP] não emite graduation signal
```

### Brownfield (existe parcialmente, 3 workflows órfãos)

`.sinapse-ai/core/orchestration/brownfield-handler.js` (740 linhas):

```
handle()  (linha 185)
  └─ só dispara quando state == EXISTING_NO_DOCS
  ↓
_executeDiscovery()  (linha 279)  → invoca brownfield-discovery.yaml (10-fases)
_handlePostDiscoveryChoice()  (linha 594)  → debt resolution OU feature dev
```

Workflows que **existem mas ninguém invoca**:
- `.sinapse-ai/development/workflows/brownfield-fullstack.yaml` (150 linhas)
- `.sinapse-ai/development/workflows/brownfield-ui.yaml` (150 linhas)
- `.sinapse-ai/development/workflows/brownfield-service.yaml` (150 linhas)

### Bob orchestrator (rota o que faz)

`.sinapse-ai/core/orchestration/bob-orchestrator.js`:

```js
// Linha 56-61: ProjectState enum (4 estados, faltam MATURE + PARTIAL)
const ProjectState = {
  NO_CONFIG: 'no_config',
  EXISTING_NO_DOCS: 'existing_no_docs',
  EXISTING_WITH_DOCS: 'existing_with_docs',
  GREENFIELD: 'greenfield',
};

// Linha 697-729: detectProjectState() — checa SÓ 3 signals
const hasPackageJson = fs.existsSync(...);
const hasGit         = fs.existsSync(...);
const hasDocs        = fs.existsSync(...);

// Linha 741-761: _routeByState() — 4 cases, sem MATURE/PARTIAL
```

## Pontos de transição (ausentes)

| Onde deveria existir transição | Estado real | Gap |
|---|---|---|
| Após Phase 3 do greenfield | Retorna message ambígua "Entering development cycle" | **Sem graduation signal** (greenfield-handler.js:478) |
| Próxima invocação do Bob | Detecta GREENFIELD de novo (3 signals) | **Sem checagem MATURE** (bob-orchestrator.js:697) |
| _routeByState() | 4 cases | **Sem case MATURE/PARTIAL** (bob-orchestrator.js:741) |
| Doc fala em PARTIAL (Continuation Behavior) | Sem implementação | **Pure doc** (PR #184 só atualizou regra, não código) |

## Gargalos críticos

| # | Arquivo:Linha | Gargalo | Impacto |
|---|---|---|---|
| 1 | `bob-orchestrator.js:700-706` | Detecta só 3 signals (faltam tests, brand, DS, components, infra, git history) | Greenfield nunca gradua |
| 2 | `greenfield-handler.js:478` | Sem graduation signal após Phase 3 | Bob não sabe que projeto completou |
| 3 | `bob-orchestrator.js:741-761` | `_routeByState()` sem MATURE/PARTIAL | Sem rota pra projeto graduado |
| 4 | `brownfield-handler.js:796-800` | Só dispara em `EXISTING_NO_DOCS`, nunca em MATURE | Brownfield Discovery nunca roda em projeto que era greenfield |
| 5 | `.sinapse-ai/development/workflows/brownfield-{ui,service,fullstack}.yaml` | 3 workflows existem, nenhum é invocado | Trabalho desperdiçado |
| 6 | `bob-orchestrator.js:852` | `EXISTING_WITH_DOCS` vai pra "ask_objective" sem PARTIAL handling | Projeto parcialmente feito sem comportamento de continuação |
| 7 | `greenfield-handler.js:472-476` | Mensagem final ambígua | Usuário não sabe que graduou |
| 8 | `session-state.js` | Tracks fases mas não maturity | Sem persistência da graduação |

## Doc vs código — drift quantitativo

| Item | Doc (`project-intelligence.md` PR #184) | Código (`bob-orchestrator.js`) |
|---|:-:|:-:|
| Maturity levels | 5 | 4 (sem MATURE, sem PARTIAL) |
| Audit dimensions | 8 | 3 |
| Continuation Behavior | YES (PARTIAL) | NÃO IMPLEMENTADO |
| Brownfield Discovery automático | YES (em MATURE) | NÃO IMPLEMENTADO |
| Graduation signal | implícito | INEXISTENTE |

## Recomendações (sem implementar)

1. **Expandir `detectProjectState()` pra 8 dimensions** (`bob-orchestrator.js:700`) — cobre o "Initial State Audit" que a doc PR #184 promete.
2. **Adicionar MATURE + PARTIAL ao enum** (`bob-orchestrator.js:56`) e seus cases no `_routeByState()`.
3. **Greenfield Phase 3 emite graduation signal** (`greenfield-handler.js:478`) — `this.emit('graduation', ...)` + grava marker em SessionState.
4. **Brownfield handler também aceita state == MATURE** — não só EXISTING_NO_DOCS.
5. **Continuation Behavior (PARTIAL)** vira código real — Phase 3b ou handler dedicado.
6. **Brownfield workflows órfãos** ganham invocação real via brownfield-handler.

## Verdict

**FAIL** — bloqueador pra release oficial. A promessa central ("greenfield gradua sem fricção") está só na doc, não no código. Usuário que termina projeto novo continua sendo tratado como recém-chegado pra sempre.

## Próximo passo

Plano de fix consolidado com Audit de Install UX (mesma sessão). Apresentado no chat antes de YOLO — mudança de comportamento de runtime, fora do escopo doc-only.
