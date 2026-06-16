# E7 — Monitor Web Órfão: o que vale reciclar pro painel CLI

> Extração feita antes de arquivar `.sinapse-ai/monitor/` (Cluster F da Etapa 7, decisão D6).
> O monitor web era um conjunto de hooks Python que faziam POST pra um servidor
> `localhost:4001` (`apps/monitor-server`) que **não existe no repo**. Código morto.
> Este doc guarda só os pedaços que podem ser reciclados no painel CLI da E7 — não é
> documentação do monitor, é uma lista de "peças aproveitáveis" pra reuso futuro.

## Veredito geral

A maior parte é específica do transporte HTTP pro servidor inexistente (descartável).
**3 peças têm valor de reciclagem** pro painel CLI / session-cache da E7:

1. Vocabulário de eventos (catálogo de tipos)
2. Heurística de detecção de agente a partir do prompt (`@agent` regex)
3. Heurística de detecção de projeto a partir do `cwd` (markers)

O resto (POST, timeout, fallback file, instalador `.sh`) já é coberto melhor pelo
contrato do session-cache v2 e pelos hooks `.cjs` da E7.

---

## 1. Catálogo de tipos de evento (RECICLÁVEL — referência)

Origem: `.sinapse-ai/core/events/types.js` (esse arquivo **fica**, é live; só anoto aqui
como referência do vocabulário que o painel pode exibir). Os hooks Python emitiam
eventos low-level (`PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`,
`SubagentStop`, `Notification`, `PreCompact`); o emitter JS emite high-level:

```
AgentActivated · AgentDeactivated
CommandStart · CommandComplete · CommandError
StoryStatusChange
SessionStart · SessionEnd
BobPhaseChange · BobAgentSpawned · BobAgentCompleted · BobSurfaceDecision · BobError
```

**Reuso:** o painel CLI (`observability-panel.js`) pode mapear esses nomes pra labels
amigáveis (ex: `AgentActivated` → "🧭 especialista entrou"). O mapeamento high-level↔baixo
nível já estava implícito; vale formalizar uma tabela única no painel.

## 2. Detecção de agente pelo prompt (RECICLÁVEL — heurística)

Origem: `.sinapse-ai/monitor/hooks/lib/enrich.py` → `detect_agent_from_prompt()`.

```python
match = re.search(r'@(dev|architect|qa|pm|po|sm|analyst|devops|sinapse-orqx)', prompt.lower())
```

**Por que reciclar:** é exatamente o que o detector `track-agent.cjs` da E7 faz (escrever
no session-cache quando vê `@agente`). A lista de IDs aqui está **desatualizada** (só os
9 antigos), mas a ideia é a mesma. O `track-agent.cjs` da E7 já cobre `@sinapse|@snps|
@x-orqx|@id` com dedup — então isto serve só como confirmação de que a abordagem regex
no UserPromptSubmit é a correta. **Nada a portar**, só validação de design.

## 3. Detecção de projeto pelo cwd (RECICLÁVEL — heurística leve)

Origem: `enrich.py` → `detect_project()`.

```python
markers = [".git", "package.json", "Cargo.toml", "go.mod", "pyproject.toml"]
# primeiro marker que existir no cwd → usa path.name como nome do projeto
```

**Reuso:** se o painel CLI algum dia quiser rotular qual projeto está ativo (hoje o
session-cache já isola por `hash(cwd)` — D1), essa heurística de "nome do projeto =
basename do cwd que tem um marker" é um util barato. Baixa prioridade: o session-cache
por-cwd já resolve o isolamento; o nome bonito é cosmético.

## 4. Truncamento de payload (DESCARTÁVEL — já coberto)

`post_tool_use.py` truncava `tool_result` > 1000 chars e `tool_input` > 500 chars antes
de enviar. Boa prática, mas é específica do transporte HTTP. O painel CLI lê do
session-cache (campos pequenos), não precisa truncar payloads de tool. **Não reciclar.**

## 5. Transporte / instalador (DESCARTÁVEL)

- `send_event.py` (POST pra `:4001/events`, timeout 500ms, silent fail) → servidor não existe.
- `install-monitor-hooks.sh` (copia hooks pra `~/.claude/hooks`, manda subir `apps/monitor-server`) → app não existe; é `.sh` (inerte no Windows, mesmo bug que a E7 mata em D3).
- Padrão "non-blocking + silent fail + fallback file" do `dashboard-emitter.js` → bom princípio, mas já preservado no próprio emitter (que continua vivo, agora como no-op seguro).

**Conclusão:** nada do transporte/instalador vale reciclar. As 3 heurísticas acima são as
únicas peças de valor, e 2 delas (agente/projeto) a E7 já reimplementou melhor em `.cjs`.

---

## Anexo — quem importa o quê (mapa pra não quebrar build)

Importante: **o monitor web (`.sinapse-ai/monitor/`, Python) NÃO é importado por nenhum
JS do core.** Só o `install-monitor-hooks.sh` aponta pra ele, e esse script é órfão.

Já o **`dashboard-emitter.js` (JS) É importado e fica vivo** — só virou no-op seguro:

| Importador | Caminho |
|---|---|
| `core/events/index.js` | re-export `DashboardEmitter`, `getDashboardEmitter` |
| `core/orchestration/dashboard-integration.js` | `getDashboardEmitter()` (via `../events`) |
| `core/orchestration/bob-orchestrator.js` | `getDashboardEmitter()` |
| `tests/core/events/dashboard-emitter-bob.test.js` | testa singleton + eventos Bob |
| `tests/core/orchestration/bob-orchestrator.test.js` | mocka `getDashboardEmitter` |

Assinatura preservada 1:1 no no-op → nenhum import quebra.
