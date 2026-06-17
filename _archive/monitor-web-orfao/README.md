# Monitor Web Órfão (arquivado)

Arquivado em 16/06/2026 — Etapa 7 (Cluster F, decisão D6).

## O que era

Hooks Python (`hooks/`) que capturavam eventos do Claude Code (`PreToolUse`,
`PostToolUse`, `UserPromptSubmit`, `Stop`, etc.) e faziam **POST pra um servidor
`http://localhost:4001/events`** que **nunca existiu no repo** (`apps/monitor-server`
não está presente). Eram instalados por `scripts/install-monitor-hooks.sh`.

## Por que foi arquivado

- Servidor `:4001` inexistente → todo POST falhava em silêncio (código morto).
- Instalador `.sh` é inerte no Windows sem Git Bash.
- Caio: "não vou utilizar." Zero impacto no usuário final.

## O que foi reciclado antes de arquivar

Ver `docs/audits/E7-monitor-web-reciclavel.md`. Em resumo: só as heurísticas de
detecção de agente (`@agent` regex) e de projeto (`cwd` markers) tinham valor — e a
E7 já as reimplementou melhor em `.cjs` (`track-agent.cjs` + session-cache v2).

## Importava algo do core?

Não. Nenhum JS do core importava esses hooks Python. O único ponteiro era o
`scripts/install-monitor-hooks.sh` (também órfão).

> Nota: o `dashboard-emitter.js` (JS) é coisa **diferente** — ele continua vivo no
> core, só virou no-op seguro (não tenta mais POST pro 4001).
