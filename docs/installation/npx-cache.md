# Npx Cache Behavior — Why a New Publish May Not Be Live Yet

> **Story 10.40** — documented behavior for users hitting "I just published rc.5 and `npx sinapse-ai@rc` still shows rc.4".

When you run `npx sinapse-ai@rc install` (or `update`, `uninstall`, etc.), npm:

1. Resolves the dist-tag (`@rc`, `@latest`, or an explicit `@10.0.0-rc.5`) against the registry,
2. Downloads the matching tarball into `~/.npm/_npx/<hash>/`,
3. Reuses that cached tarball on subsequent invocations until the cache entry expires or the resolved version changes.

This means: **immediately after `npm publish --tag rc`, your local `npx sinapse-ai@rc` may still serve the previous rc** until npm decides the cache entry is stale (typically minutes, sometimes longer for CDN edges).

## Sintomas Comuns

| Sintoma | Causa Provavel |
|---|---|
| `npx sinapse-ai@rc --version` mostra versao antiga apos publish | Cache npx local quente |
| `update` reporta "ja na ultima versao" mesmo com publish novo | Mesmo motivo |
| `uninstall` deixa arquivos novos pra tras | Tarball cacheada nao tem o `cmdUninstall` atualizado |
| `WARN: Versao instalada (X) mais nova que a executada (Y)` | Voce instalou uma versao nova manualmente; npx esta servindo a antiga |

## Como Resolver

### 1. Limpar o cache do npx (mais comum)

```bash
npx clear-npx-cache
# ou, manualmente:
rm -rf ~/.npm/_npx
```

### 2. Pedir uma versao explicita

```bash
npx sinapse-ai@10.0.0-rc.5 install
```

Versao exata bypassa o lookup de dist-tag.

### 3. Usar `@latest` em producao

```bash
npx sinapse-ai@latest install
```

`@latest` so aponta pra builds promovidos a GA (releases finais), evitando a corrida de cache do canal `rc`.

### 4. Forcar o offline-fail

```bash
npx --prefer-online sinapse-ai@rc install
```

Faz o npm validar contra o registry mesmo com cache disponivel.

## Quando Usar Qual Tag

| Tag | Quem | Quando |
|---|---|---|
| `@latest` | Usuarios finais, producao | Default, builds estaveis |
| `@rc` | Beta testers, equipe SINAPSE | Validacao pre-GA |
| `@10.0.0-rc.5` (exato) | Reproducoes de bug, testes deterministicos | Sempre que precisar de uma versao especifica |

## Comportamento vs. Instalacao Global

Se voce instalar globalmente (`npm install -g sinapse-ai`), o npm escreve o pacote em `<prefix>/lib/node_modules/sinapse-ai/` e o `sinapse-ai` no PATH usa esse codigo direto — sem cache npx envolvido. `npm update -g sinapse-ai` baixa a nova versao imediatamente.

Para builds RC instaveis, `npx sinapse-ai@rc` continua sendo o caminho recomendado pra evitar poluir o ambiente global; apenas tenha em mente o cache.

## Detecao Automatica

A partir de **10.0.0-rc.5**, o comando `update` detecta staleness e avisa:

```
WARN: Versao instalada (10.0.0-rc.3) mais antiga que a executada (10.0.0-rc.5). Atualizando agora...
```

ou, se o cache npx esta atras do instalado:

```
WARN: Versao instalada (10.0.0-rc.5) mais nova que a executada (10.0.0-rc.3). Seu cache npx pode estar velho — rode: npx clear-npx-cache ou use @latest.
```

## Veja Tambem

- [`uninstallation.md`](./uninstallation.md) — uninstall completo e idempotente
- [`troubleshooting.md`](./troubleshooting.md) — outros problemas de instalacao
