# Getting Started — SINAPSE-AI

> Guia mínimo pra colocar o SINAPSE rodando em qualquer projeto. Tempo: 2 minutos.

## Pré-requisitos

- **Node.js** ≥ 20 (LTS recomendado)
- **Claude Code** ou **Codex CLI** instalado
- **Git** (pra colaboração)

## Instalação em 1 comando

```bash
npx sinapse-ai install
```

O wizard detecta seu ambiente, escolhe IDE (Claude Code ou Codex), instala 17 squads e configura 13 hooks ativos automaticamente.

## Validar setup

```bash
npx sinapse-ai status   # squads + agentes instalados
npx sinapse-ai doctor   # 12 health checks
```

Se algo falhar: `npx sinapse-ai doctor --fix` corrige automaticamente.

## Ativar primeiro agente

No prompt do Claude Code ou Codex:

```
@developer
*help
```

`@developer` ativa o agente de implementação. `*help` lista comandos disponíveis.

## Próximos passos

| Quero... | Onde |
|---|---|
| Entender filosofia do framework | [`README.md`](../README.md) |
| Ver lista completa de agentes | [Agent Reference Guide](agent-reference-guide.md) |
| Resolver problema na instalação | [Troubleshooting](troubleshooting.md) |
| Ver workflow de desenvolvimento | [`docs/sinapse-workflows/`](sinapse-workflows/) |
| Contribuir | [`CONTRIBUTING.md`](../CONTRIBUTING.md) |

## Reinstalar / atualizar

```bash
npx sinapse-ai install --reconfigure   # reconfigura tudo
npx sinapse-ai update                  # atualiza versão sem perder customizações
npx sinapse-ai uninstall               # remove tudo
```

## Conceitos chave (em 30 segundos)

- **Squad**: equipe de agentes especializados (ex: squad-design tem 15 agentes de design/UX)
- **Agente**: persona de IA com expertise e comandos específicos (`@developer`, `@architect`, etc.)
- **Hook**: enforcement runtime que bloqueia violações da Constitution (ex: PR sem story)
- **Constitution**: 10 artigos que governam o framework (ver `.sinapse-ai/constitution.md`)
- **Story**: arquivo `.md` que documenta requisitos antes do código (Documentation-First)

---

*Próxima leitura sugerida: [Agent Reference Guide](agent-reference-guide.md) pra ver todos os 172 agentes disponíveis.*
