# Quickstart (recording) — primeira execução em 60 segundos

Este exemplo mostra o fluxo end-to-end de instalar o SINAPSE AI, abrir o
Claude Code com os agents disponíveis e ativar o primeiro agente. O objetivo
é dar ao novo usuário uma demo navegável **antes** de ter que instalar
qualquer coisa.

## TL;DR

```bash
npm i -g sinapse-ai     # instala o framework globalmente
sinapse-ai install      # instala agents + squads
claude                  # abre o Claude Code com SINAPSE ativo
# dentro do Claude Code:
@developer *help        # ativa Pixel (developer) e mostra comandos
```

## Recording

> **Status:** placeholder — gravação asciinema será adicionada na próxima
> milestone. Por ora, o roteiro abaixo serve como guia textual fiel.

```
[asciinema recording aqui]
```

Quando a gravação estiver disponível, ela será embedada com:

```html
<a href="https://asciinema.org/a/REPLACE_ME" target="_blank">
  <img src="https://asciinema.org/a/REPLACE_ME.svg" alt="SINAPSE AI quickstart" />
</a>
```

## Roteiro detalhado

### 1. Instalação global (uma vez por máquina)

```bash
$ npm i -g sinapse-ai
added 1 package in 4s

$ npx sinapse-ai --version
10.0.0
```

Output esperado: o número da versão sai limpo, sem warnings de permissão.
Se você vir `EACCES`, consulte
[`docs/guides/cli-errors.md`](../guides/cli-errors.md#erro-ao-instalar-detalhe).

### 2. Instalação dos agents

```bash
$ npx sinapse-ai install
SINAPSE AI v10.0.0

✓ Agents copiados para ~/.sinapse
✓ Squads sincronizados (17 squads · 210 agents)
✓ Settings do Claude Code atualizados

Pronto. Rode `claude` pra começar.
```

Após esse comando, `~/.sinapse/` contém o framework e
`~/.claude/commands/SINAPSE/` aponta para os agents.

### 3. Abrir o Claude Code

```bash
$ claude
```

O Claude Code inicia. No primeiro prompt, digite:

```
@developer *help
```

### 4. Output esperado do primeiro agente

```
Pixel (Developer) carregado.

Comandos disponíveis:
  *develop-story     — implementa uma story (modo YOLO ou interativo)
  *create-service    — gera serviço novo seguindo padrões do projeto
  *improve-code-quality
  *optimize-performance
  ...

Como posso ajudar?
```

A partir desse ponto, o usuário pode pedir qualquer task de implementação.

## Script reproduzível (para gravar a recording)

```bash
#!/usr/bin/env bash
# scripts/record-quickstart.sh — roda o roteiro acima de forma determinística.
# Use com `asciinema rec quickstart.cast -c ./scripts/record-quickstart.sh`.

set -e

echo "$ npm i -g sinapse-ai"
sleep 1
npm i -g sinapse-ai

echo
echo "$ npx sinapse-ai install"
sleep 1
npx sinapse-ai install

echo
echo "$ claude"
sleep 1
echo "(Claude Code abriria aqui — em uma gravação real, continue digitando)"
echo "@developer *help"
```

> Nota: a chamada real ao `claude` depende do binário do Claude Code estar
> autenticado. Em uma máquina limpa, essa é a única etapa que requer login
> humano (uma vez por máquina).

## O que fazer em seguida

- Para entender o ciclo de desenvolvimento (story → implement → QA → push),
  veja [`docs/examples/squads/basic-squad/`](squads/basic-squad/).
- Para customizar o framework para um projeto específico, rode
  `npx sinapse-ai init <nome>` e escolha um template.
- Para diagnosticar problemas, rode `npx sinapse-ai doctor`.

## Veja também

- [Erros do CLI](../guides/cli-errors.md) — exit codes + remediação.
- [README](../../README.md) — overview do framework.
