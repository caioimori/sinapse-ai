# Trabalhando em Paralelo — Guia para a Equipe

## TL;DR

Voces focam no codigo. O Claude Code cuida do git.

## Glossario

| Termo | Significado |
|-------|-------------|
| **main** | Versao oficial do projeto. Ninguem mexe direto. |
| **branch** | Copia temporaria onde voce trabalha com seguranca. |
| **PR** | Pedido para o outro revisar suas mudancas. |
| **merge** | Juntar mudancas no main apos aprovacao. |
| **conflito** | Dois mexeram no mesmo trecho. O agente resolve. |

## Fluxo

```
Voce pede → Agente cria area segura → Trabalha → Agente salva
→ Envia para revisao → Outro aprova → Vai pro main
```

## O que voce FAZ

1. Abrir o Claude Code
2. Pedir o que quer fazer
3. Revisar o que mudou
4. Aprovar mudancas do outro no GitHub

## Regras

1. **Dividam areas** — combinem quem mexe onde
2. **Mudancas pequenas** — enviem todo dia, nao acumulem
3. **Atualizem no inicio** — diga "sincroniza e cria branch para [tarefa]"
4. **Nunca trabalhem no main** — sempre em branch
5. **Avisem antes de mexer na area do outro**

## Se algo der errado

| Problema | Solucao |
|----------|---------|
| Codigo sumiu | Nada some. Peca ao agente recuperar. |
| Conflito | Agente resolve. Mostra as versoes. |
| Push rejeitado | Agente atualiza e tenta de novo. |
| PR com problema | Agente corrige e reenvia. |

## Aprovando PRs

1. GitHub > Pull requests
2. Clique na PR
3. Review changes > Approve > Submit
4. Squash and merge

Branch e apagada automaticamente.
