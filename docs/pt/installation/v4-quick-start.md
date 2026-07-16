# Início rápido

> Este nome de arquivo foi mantido para preservar links existentes. O guia
> documenta a CLI pública atual, não um instalador v4 separado.
>
> [English](../../installation/v4-quick-start.md)

## Requisitos

- Node.js 18 ou superior; Node.js 22 LTS é recomendado.
- npm 9 ou superior.
- Claude Code, Codex ou ambos.
- Git para projetos versionados.

## Instale no projeto

Em um repositório existente:

```bash
npx sinapse-ai@latest install
```

Para um projeto novo, crie o diretório e execute o mesmo instalador:

```bash
mkdir meu-projeto
cd meu-projeto
git init
npx sinapse-ai@latest install
```

Sem flags, uma instalação nova configura Claude Code e Codex. Ao executar o
comando novamente, o instalador atualiza arquivos gerenciados pelo framework e
preserva o conteúdo do projeto e a seleção de providers.

## Valide

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Revise `git status` antes de criar o commit com os arquivos de integração gerados.

## Ative o SINAPSE

| Provider | Ativação |
|---|---|
| Claude Code | `@sinapse-orqx` |
| Codex | `$snps` |

O orquestrador encaminha a solicitação ao especialista adequado. No Codex,
também é possível ativar diretamente `$sinapse-agent <agent-id>`.

## Entregue software

O workflow principal é:

```text
@sprint-lead draft -> @product-lead validate -> @developer implement -> @quality-gate gate -> @devops PR/release
```

Selecione o workflow exato com o
[guia de aplicabilidade de engenharia](../../framework/software-engineering-applicability.md).

## Próximos passos

- [Contrato de instalação](README.md)
- [Referência de agentes](../../agent-reference-guide.md)
- [Integração Claude e Codex](../../guides/ide-integration.md)
- [Solução de problemas](troubleshooting.md)
- [Suporte](../../../SUPPORT.md)
