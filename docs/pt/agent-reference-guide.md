# Referência de Agentes

> [English](../agent-reference-guide.md) | **Português**

O SINAPSE inclui **172 agentes especializados**: **12 papéis do framework** e
**160 especialistas na camada de squads**, organizados em **17 squads**. O ecossistema inclui **18
orquestradores**: um orquestrador supremo e um por squad.

O inventário atual contém **1.201 squad tasks**, **211 development tasks**,
**1.412 task files** e **1.348 ponteiros de tasks** resolvíveis pelo runtime do
Codex. Esses números são medidos a partir do código-fonte e validados na CI.

| Superfície do provider | Claude Code | Codex |
|---|:---:|:---:|
| Skills instaladas | 37 | 37 |
| Hooks registrados | 20 registros | 9 eventos |

## Comece pelo orquestrador

| Provider | Ativação |
|---|---|
| Claude Code | `@sinapse-orqx` |
| Codex | `$snps` |

O orquestrador classifica a solicitação e delega a execução. Use ativação
direta somente quando a responsabilidade já estiver clara.

## Agentes do framework

| Papel | Claude Code | Codex | Autoridade |
|---|---|---|---|
| Desenvolvimento | `@developer` | `$sinapse-agent developer` | Implementação e correções |
| Arquitetura | `@architect` | `$sinapse-agent architect` | Arquitetura de sistemas |
| Quality Gate | `@quality-gate` | `$sinapse-agent quality-gate` | Testes e decisão de gates |
| DevOps | `@devops` | `$sinapse-agent devops` | Push, pull requests e releases |
| Sprint Lead | `@sprint-lead` | `$sinapse-agent sprint-lead` | Criação de stories |
| Product Lead | `@product-lead` | `$sinapse-agent product-lead` | Validação de stories e backlog |
| Project Lead | `@project-lead` | `$sinapse-agent project-lead` | Requisitos de produto e epics |
| Analista | `@analyst` | `$sinapse-agent analyst` | Pesquisa e análise |
| Data Engineer | `@data-engineer` | `$sinapse-agent data-engineer` | Arquitetura de dados e migrations |
| UX Design Expert | `@ux-design-expert` | `$sinapse-agent ux-design-expert` | UX, UI e acessibilidade |
| Squad Creator | `@squad-creator` | `$sinapse-agent squad-creator` | Design e validação de squads |
| Orquestrador Supremo | `@sinapse-orqx` | `$snps` | Roteamento entre squads |

As autoridades permanecem exclusivas. Em especial, somente DevOps pode fazer
push, abrir pull requests ou executar releases.

## Descubra todos os agentes e tasks

O catálogo completo é resolvido a partir das fontes em runtime. Este documento
não mantém uma segunda lista estática sujeita a drift.

```bash
# Contagens exatas do ecossistema
node .codex/scripts/resolve-codex-agent.js --stats

# Definição do agente e todas as tasks resolvíveis
node .codex/scripts/resolve-codex-agent.js <agent-id>

# Um comando ou ponteiro específico
node .codex/scripts/resolve-codex-agent.js <agent-id> <command>
```

Exemplos:

```bash
node .codex/scripts/resolve-codex-agent.js brand-orqx
node .codex/scripts/resolve-codex-agent.js meta-ads-specialist
node .codex/scripts/resolve-codex-agent.js developer develop
```

## Contrato operacional

- Orquestradores roteiam e coordenam; especialistas executam.
- A implementação de código normalmente começa por uma story validada.
- Claude Code e Codex resolvem as mesmas fontes canônicas de agentes e tasks.
- As definições vivem em `.sinapse-ai/development/agents/` e `squads/`.
- Os adaptadores de providers são validados com `npm run validate:parity`.

Continue em [Primeiros passos](getting-started.md), no
[catálogo de workflows](../sinapse-workflows/README.md) ou na
[visão geral de squads](guides/squads-overview.md).
