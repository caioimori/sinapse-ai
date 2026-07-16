# Primeiros Passos

Instale o SINAPSE AI em um projeto novo ou existente e faca o primeiro
roteamento em cerca de dois minutos.

> [English](../getting-started.md)

## Requisitos

- Node.js 18 ou superior (Node.js 22 LTS recomendado)
- npm 9 ou superior
- Claude Code, Codex ou ambos
- Git para o fluxo de repositorio

## Instale

No diretorio do projeto:

```bash
npx sinapse-ai@latest install
```

Em um projeto novo, o comando sem flags instala integracao nativa para
**Claude Code e Codex**. Ao executar novamente, a selecao salva e o conteudo
que pertence ao projeto sao preservados.

Restrinja a um provider somente quando isso for intencional:

```bash
npx sinapse-ai@latest install --llm=claude-code
npx sinapse-ai@latest install --llm=codex
```

Use `--reconfigure` para trocar uma selecao salva.

## Valide

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Para aplicar correcoes seguras encontradas pelo diagnostico:

```bash
npx sinapse-ai@latest doctor --fix
```

## Faca o primeiro roteamento

Claude Code:

```text
@sinapse-orqx
Planeje e implemente uma pequena alteracao em uma API autenticada.
```

Codex:

```text
$snps
Planeje e implemente uma pequena alteracao em uma API autenticada.
```

Ativacao direta:

| Papel | Claude Code | Codex |
|---|---|---|
| Desenvolvimento | `@developer` | `$sinapse-agent developer` |
| Arquitetura | `@architect` | `$sinapse-agent architect` |
| QA | `@quality-gate` | `$sinapse-agent quality-gate` |

O orquestrador classifica a solicitacao e delega o trabalho. Alteracoes de
codigo normalmente exigem uma story pronta antes da implementacao.

## Atualize com seguranca

```bash
npx sinapse-ai@latest update
```

O updater renova arquivos gerenciados e preserva o conteudo do projeto. Revise
o diff antes de criar o commit. Use `install --force` apenas para renovar
deliberadamente a instalacao gerenciada.

## Proximos passos

- [Escolher o workflow de engenharia](../framework/software-engineering-applicability.md)
- [Entender ownership da instalacao](../installation/README.md)
- [Explorar agentes](../agent-reference-guide.md)
- [Integrar providers](../guides/ide-integration.md)
- [Resolver problemas](../troubleshooting.md)
- [Pedir suporte](../../SUPPORT.md)
