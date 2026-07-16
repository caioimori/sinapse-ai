# Primeiros Passos

Instale o SINAPSE AI em um projeto novo ou existente e faça o primeiro
roteamento em poucos passos.

> [English](../getting-started.md)

## Requisitos

- Node.js 18 ou superior (Node.js 22 LTS recomendado)
- npm 9 ou superior
- Claude Code, Codex ou ambos
- Git para o fluxo de repositório

## Instale

No diretório do projeto:

```bash
npx sinapse-ai@latest install
```

Em um projeto novo, o comando sem flags instala integração nativa para
**Claude Code e Codex**. Ao executar novamente, a seleção salva e o conteúdo
que pertence ao projeto são preservados.

Restrinja a um provider somente quando isso for intencional:

```bash
npx sinapse-ai@latest install --llm=claude-code
npx sinapse-ai@latest install --llm=codex
```

Use `--reconfigure` para trocar uma seleção salva.

## Valide

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Para aplicar correções seguras encontradas pelo diagnóstico:

```bash
npx sinapse-ai@latest doctor --fix
```

## Faça o primeiro roteamento

Claude Code:

```text
@sinapse-orqx
Planeje e implemente uma pequena alteração em uma API autenticada.
```

Codex:

```text
$snps
Planeje e implemente uma pequena alteração em uma API autenticada.
```

Ativação direta:

| Papel | Claude Code | Codex |
|---|---|---|
| Desenvolvimento | `@developer` | `$sinapse-agent developer` |
| Arquitetura | `@architect` | `$sinapse-agent architect` |
| QA | `@quality-gate` | `$sinapse-agent quality-gate` |

O orquestrador classifica a solicitação e delega o trabalho. Alterações de
código normalmente exigem uma story pronta antes da implementação.

## Atualize com segurança

```bash
npx sinapse-ai@latest install
```

O instalador idempotente detecta a instalação existente, renova arquivos
gerenciados e preserva o conteúdo do projeto. Revise o diff antes de criar o
commit. Use `install --force` apenas para renovar deliberadamente a instalação
gerenciada.

## Próximos passos

- [Escolher o workflow de engenharia](../framework/software-engineering-applicability.md)
- [Entender ownership da instalação](../installation/README.md)
- [Explorar agentes](../agent-reference-guide.md)
- [Integrar providers](../guides/ide-integration.md)
- [Resolver problemas](../troubleshooting.md)
- [Pedir suporte](../../SUPPORT.md)
