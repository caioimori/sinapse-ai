# Erros do CLI — guia de remediação

Este guia lista os erros mais comuns que o CLI `sinapse-ai` retorna e como
resolvê-los rapidamente. Se algum erro não estiver coberto aqui, rode
`npx sinapse-ai doctor` — ele costuma diagnosticar o ambiente e sugerir o
próximo passo.

## Exit codes

O CLI usa exit codes consistentes para que CI/scripting possa reagir:

| Código | Significado | Quando aparece |
|-------:|-------------|----------------|
| 0      | OK          | Comando executou com sucesso. |
| 1      | Erro genérico | Falha não-categorizada (mensagem traz contexto). |
| 2      | Uso incorreto | Flag inválida, argumento faltando, comando desconhecido. |
| 3      | Autenticação / permissão | Token expirado, sem permissão de escrita global, npm sem acesso. |
| 4      | Filesystem | Arquivo/diretório não encontrado, leitura/escrita falhou. |
| 5      | Rede        | Falha ao baixar pacote, registry inacessível, DNS. |
| 99     | Erro interno | Bug do framework — abra um issue. |

> Nota: alguns binários legacy (`bin/sinapse.js`, `bin/sinapse-graph.js`)
> podem não respeitar essa tabela ainda. O caminho canônico é `bin/cli.js`
> (rodado por `npx sinapse-ai`).

## Erros comuns

### "Comando desconhecido: <nome>"

```
Comando desconhecido: insta
Você quis dizer install?
Tente: npx sinapse-ai install
```

**O que aconteceu:** typo no nome do comando.
**Remediação:** seguir a sugestão do fuzzy-match. Se a sugestão não bater,
rode `npx sinapse-ai help` para ver a lista canônica.

### "Erro ao instalar: <detalhe>"

```
Erro ao instalar: EACCES — permission denied
Tente: npx sinapse-ai doctor
```

**O que aconteceu:** instalação falhou (em geral por permissão de escrita
em `~/.sinapse` ou em `node_modules` global).
**Remediação:**
1. `npx sinapse-ai doctor` — diagnostica permissões.
2. Se for permissão global do npm, considere usar `nvm` para gerenciar o
   Node sem `sudo`.
3. Em última análise, `npm install --force sinapse-ai`.

### "Erro ao atualizar"

```
Erro ao atualizar: 404 — version not found
Tente: npx sinapse-ai doctor
```

**O que aconteceu:** versão remota indisponível ou registry com cache stale.
**Remediação:**
1. `npm cache clean --force`
2. `npm view sinapse-ai versions --json` para conferir versões publicadas.
3. Tente novamente.

### "Erro ao desinstalar"

```
Erro ao desinstalar: arquivo em uso
```

**O que aconteceu:** algum processo (Claude Code, watcher) está segurando
um arquivo do framework.
**Remediação:** feche todas as instâncias do Claude Code e rode
`npx sinapse-ai uninstall --yes` novamente.

### "Erro ao iniciar projeto"

```
Erro ao iniciar projeto: --template requires a template name
Tente: npx sinapse-ai init --help
```

**O que aconteceu:** flag `--template` foi passada sem valor, ou o template
informado não existe.
**Remediação:** use um dos templates listados em `npx sinapse-ai init --help`
(default, minimal, enterprise).

### "Erro no doctor"

```
Erro no doctor: <detalhe>
```

**O que aconteceu:** o próprio doctor não conseguiu rodar (raríssimo —
geralmente bug interno).
**Remediação:** rode com `--verbose` para ver o stack trace e abra um issue
em https://github.com/caioimori/sinapse-ai/issues.

### "Erro no chrome-brain"

```
Erro no chrome-brain: <detalhe>
Tente: npx sinapse-ai chrome-brain status
```

**O que aconteceu:** subcomando do Chrome Brain falhou (instalar/desinstalar
extensão).
**Remediação:** confira `npx sinapse-ai chrome-brain status` — ele lista os
componentes instalados e quais estão quebrados.

### "Script não encontrado: <caminho>"

```
Script não encontrado: scripts/install-squads.sh
Tente: npx sinapse-ai doctor
```

**O que aconteceu:** comando `--local` foi rodado em um diretório que não
contém os scripts do framework.
**Remediação:** confirme que está dentro de um projeto que tem `.sinapse-ai/`
ou rode `npx sinapse-ai install` global primeiro.

### "Erro: nenhum diretório de squad encontrado no pacote"

```
Erro: nenhum diretório de squad encontrado no pacote.
Tente reinstalar: npm install -g sinapse-ai
Se persistir, abra um issue: https://github.com/caioimori/sinapse-ai/issues
```

**O que aconteceu:** o pacote npm chegou corrompido ou parcial.
**Remediação:** reinstalar com `--force`. Se persistir, é bug do release
— abrir issue.

## Quando nada funciona

```
npx sinapse-ai doctor --json
```

Salve o output e abra um issue com:

- Sistema operacional + versão
- Versão do Node (`node -v`) e do npm (`npm -v`)
- JSON do doctor (sanitizado, sem tokens)
- Comando exato que falhou

URL: https://github.com/caioimori/sinapse-ai/issues/new

## Veja também

- [Quickstart (recording)](../examples/quickstart-recording.md) — fluxo
  completo de instalação até primeiro uso.
- [Troubleshooting do README](../../README.md) — links rápidos para os
  problemas mais frequentes.
