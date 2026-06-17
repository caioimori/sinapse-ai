# AGENTS.md - SINAPSE (Codex CLI)

Este arquivo define as instrucoes do projeto para o Codex CLI.

<!-- SINAPSE-MANAGED-START: core -->
## Core Rules

1. Siga a Constitution em `.sinapse-ai/constitution.md`
2. Priorize `CLI First -> Observability Second -> UI Third`
3. Trabalhe por stories em `docs/stories/`
4. Nao invente requisitos fora dos artefatos existentes
<!-- SINAPSE-MANAGED-END: core -->

<!-- SINAPSE-MANAGED-START: quality -->
## Quality Gates

- Rode `npm run lint`
- Rode `npm run typecheck`
- Rode `npm test`
- Atualize checklist e file list da story antes de concluir
<!-- SINAPSE-MANAGED-END: quality -->

<!-- SINAPSE-MANAGED-START: security -->
## Security (NON-NEGOTIABLE)

A seguranca do SINAPSE e em camadas. Nenhuma camada sozinha basta, e nenhuma garante
paridade 1:1 entre IDEs — cada uma cobre o que as outras nao cobrem:

1. **Git hook (pre-commit / pre-push)** — backstop IDE-agnostico. Roda no commit,
   independente de qual IDE gerou o codigo (Codex ou Claude). Bloqueia segredos staged
   e checagens deterministicas. So protege no momento do commit — nao impede o agente
   de fazer algo destrutivo em runtime antes disso.
2. **Instrucao forte (este arquivo + `AGENTS.md`)** — cobre o que o hook nao pega:
   decisoes em runtime do agente, antes de qualquer commit.
3. **CI / branch protection (server-side)** — `main` so recebe via branch + PR. O gate
   roda no servidor; nao depende de hook local (que pode estar ausente ou ser pulado).

Regras de runtime que VOCE deve seguir (o hook nao consegue garantir estas):

- **NUNCA** rode DDL/DML destrutivo (`DROP`/`TRUNCATE`/`DELETE` ou `UPDATE` sem `WHERE`)
  sem aprovacao humana explicita daquela instrucao.
- **SEMPRE** rode `npm view <pkg>` antes de instalar uma dependencia (anti-slopsquatting).
  Nunca invente nome de pacote.
- **NUNCA** edite paths L1/L2 (`.sinapse-ai/core/**`, `bin/sinapse*.js`, arvores de template).
- **NUNCA** escreva segredos em arquivo versionado — valores reais no `.env` (git-ignored),
  placeholders no `.env.example`. O git hook bloqueia segredos staged no commit; a instrucao
  forte impede voce de escreve-los antes.

> Push para `main` e protegido server-side (branch protection), nao por hook local.
> Green local nao autoriza push direto — sempre via branch + PR.
<!-- SINAPSE-MANAGED-END: security -->

<!-- SINAPSE-MANAGED-START: codebase -->
## Project Map

- Core framework: `.sinapse-ai/`
- CLI entrypoints: `bin/`
- Shared packages: `packages/`
- Tests: `tests/`
- Docs: `docs/`
<!-- SINAPSE-MANAGED-END: codebase -->

<!-- SINAPSE-MANAGED-START: commands -->
## Common Commands

- `npm run sync:ide`
- `npm run sync:ide:check`
- `npm run sync:skills:codex`
- `npm run sync:skills:codex:global` (opcional; neste repo o padrao e local-first)
- `npm run validate:manifest:parity`
- `npm run validate:agents`
<!-- SINAPSE-MANAGED-END: commands -->

<!-- SINAPSE-MANAGED-START: shortcuts -->
## Agent Shortcuts

Preferencia de ativacao no Codex CLI:
1. Use `/skills` e selecione `sinapse-<agent-id>` vindo de `.codex/skills` (ex.: `sinapse-architect`)
2. Se preferir, use os atalhos abaixo (`@architect`, `/architect`, etc.)

Interprete os atalhos abaixo carregando o arquivo correspondente em `.sinapse-ai/development/agents/` (fallback: `.codex/agents/`), renderize o greeting via `generate-greeting.js` e assuma a persona ate `*exit`:

- `@architect`, `/architect`, `/architect.md` -> `.sinapse-ai/development/agents/architect.md`
- `@developer`, `/dev`, `/dev.md` -> `.sinapse-ai/development/agents/developer.md`
- `@quality-gate`, `/qa`, `/qa.md` -> `.sinapse-ai/development/agents/quality-gate.md`
- `@project-lead`, `/pm`, `/pm.md` -> `.sinapse-ai/development/agents/project-lead.md`
- `@product-lead`, `/po`, `/po.md` -> `.sinapse-ai/development/agents/product-lead.md`
- `@sprint-lead`, `/sm`, `/sm.md` -> `.sinapse-ai/development/agents/sprint-lead.md`
- `@analyst`, `/analyst`, `/analyst.md` -> `.sinapse-ai/development/agents/analyst.md`
- `@devops`, `/devops`, `/devops.md` -> `.sinapse-ai/development/agents/devops.md`
- `@data-engineer`, `/data-engineer`, `/data-engineer.md` -> `.sinapse-ai/development/agents/data-engineer.md`
- `@ux-design-expert`, `/ux-design-expert`, `/ux-design-expert.md` -> `.sinapse-ai/development/agents/ux-design-expert.md`
- `@squad-creator`, `/squad-creator`, `/squad-creator.md` -> `.sinapse-ai/development/agents/squad-creator.md`
- `@sinapse-orqx`, `/sinapse-orqx`, `/sinapse-orqx.md` -> `.sinapse-ai/development/agents/sinapse-orqx.md`
<!-- SINAPSE-MANAGED-END: shortcuts -->
