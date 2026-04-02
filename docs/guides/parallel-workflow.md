# Trabalhando em Paralelo — Guia para Caio e Matheus

## TL;DR

Voces focam no codigo. O Claude Code cuida do git.

## Como funciona

```
Voce pede algo → Agente cria branch segura → Voce trabalha → Agente commita
→ Agente faz push → Agente abre PR → Outro aprova → Merge automatico
```

## O que voce FAZ

1. **Abrir o Claude Code** no projeto
2. **Pedir o que quer fazer** ("otimiza tal agent", "melhora o installer", etc)
3. **Revisar o que o agente fez** (ele mostra o diff)
4. **Aprovar PRs do outro** no GitHub quando pedir

## O que voce NAO precisa fazer

- Criar branches
- Resolver conflitos de merge
- Lembrar de fazer pull
- Escrever mensagens de commit
- Saber comandos git

## Regra #1: Dividam as areas

Para evitar conflitos, combinem quem mexe onde:

| Area | Responsavel |
|------|-------------|
| Installer, CLI, hooks | Caio |
| Squads, agents, tasks | Matheus |
| Docs, stories | Quem estiver trabalhando naquela feature |
| Tests | Quem escreveu o codigo |

Se precisar mexer na area do outro: **avisem antes**.

## Regra #2: PRs pequenos

- Um PR por feature/fix
- Nao acumule 3 dias de trabalho num PR gigante
- PR pequeno = review rapido = merge rapido = menos conflito

## Regra #3: Sync no inicio do dia

Ao abrir o Claude Code, diga: "sincroniza com main e cria branch para [o que vou fazer]"

O agente faz o resto.

## Se algo der errado

| Problema | Solucao |
|----------|---------|
| "Meu codigo sumiu" | Nao sumiu. `git log` mostra tudo. Peca ao agente recuperar. |
| "Conflito de merge" | Peca ao agente resolver. Ele mostra as duas versoes. |
| "Push rejeitado" | Main mudou. Agente atualiza sua branch e tenta de novo. |
| "PR com conflito" | Agente atualiza a branch com main e resolve. |

## Aprovando PRs (unica coisa manual no GitHub)

1. Abra github.com/caioimori/sinapse-ai/pulls
2. Clique no PR do outro
3. Review changes → Approve
4. Squash and merge

Pronto. O branch e deletado automaticamente.
