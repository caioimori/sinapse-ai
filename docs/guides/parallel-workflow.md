# Trabalhando em Paralelo — Guia para Caio e Matheus

## TL;DR

Voces focam no codigo. O Claude Code cuida do git.

## Glossario rapido

| Termo | O que significa |
|-------|----------------|
| **main** | A versao "oficial" do projeto. Ninguem mexe direto nela. |
| **branch** | Uma copia temporaria onde voce trabalha sem afetar o main. |
| **PR (Pull Request)** | Um pedido para o outro revisar e aprovar suas mudancas. |
| **merge** | Juntar suas mudancas de volta no main apos aprovacao. |
| **conflito** | Quando dois mexeram no mesmo trecho. O agente resolve. |

## Como funciona

```
Voce pede algo → Agente cria area segura → Voce trabalha → Agente salva
→ Agente envia para revisao → Outro aprova → Mudancas vao pro main
```

## O que voce FAZ

1. **Abrir o Claude Code** no projeto
2. **Pedir o que quer fazer** ("otimiza tal agent", "melhora o installer", etc)
3. **Revisar o que o agente fez** (ele mostra o que mudou)
4. **Aprovar mudancas do outro** no GitHub quando pedir

## O que voce NAO precisa fazer

- Criar branches (o agente cria)
- Resolver conflitos (o agente resolve)
- Lembrar de atualizar o projeto (o agente faz no inicio)
- Escrever mensagens de commit (o agente escreve)
- Saber comandos git (o agente sabe)

## Regra #1: Dividam as areas

Para evitar que os dois mexam no mesmo arquivo ao mesmo tempo:

| Area | Responsavel |
|------|-------------|
| Installer, CLI, hooks | Caio |
| Squads, agents, tasks | Matheus |
| Docs, stories | Quem estiver trabalhando naquela feature |
| Tests | Quem escreveu o codigo |

Se precisar mexer na area do outro: **avisem antes no WhatsApp/Discord**.

## Regra #2: Mudancas pequenas e frequentes

- Uma PR por feature ou correcao
- Nao acumule 3 dias de trabalho — envie todo dia
- Mudanca pequena = revisao rapida = menos chance de conflito

## Regra #3: Atualizar no inicio do dia

Ao abrir o Claude Code, diga:

> "sincroniza e cria branch para [o que vou fazer]"

O agente atualiza tudo e cria uma area segura para trabalhar.

## NUNCA faca isso

- **Nunca trabalhe direto no main** — o GitHub bloqueia, mas se por algum motivo conseguir, PARE e avise
- **Nunca delete branches do outro** — so delete as suas
- **Nunca faca push sem antes pedir ao agente** — ele verifica conflitos antes

## Se algo der errado

| Problema | O que fazer |
|----------|-------------|
| "Meu codigo sumiu!" | Calma. Nada some no git. Peca ao agente: "recupera minhas mudancas" |
| "Deu conflito" | Peca ao agente: "resolve o conflito". Ele mostra as duas versoes e pergunta qual manter. |
| "Nao consigo enviar" | O main mudou. Peca ao agente: "atualiza minha branch e tenta de novo" |
| "A PR ta com problema" | Peca ao agente: "corrige a PR". Ele atualiza e reenvia. |
| "Fiz algo errado no main" | Peca ao agente: "desfaz a ultima mudanca no main". Ele sabe como reverter com seguranca. |

## Aprovando mudancas do outro (unica coisa manual)

1. Abra o GitHub do projeto na aba **Pull requests**
2. Clique na PR do outro
3. Leia o resumo do que mudou
4. Clique **Review changes**
5. Selecione **Approve**
6. Clique **Submit review**
7. Clique **Squash and merge** (junta tudo em uma mudanca limpa)

Pronto. A branch temporaria e apagada automaticamente.

## Dica: como pedir coisas ao agente

Em vez de comandos tecnicos, fale normalmente:

| Voce diz | O agente entende |
|----------|------------------|
| "salva meu trabalho" | git add + commit |
| "envia pro Soier revisar" | push + criar PR |
| "atualiza meu projeto" | git fetch + pull + merge |
| "o que o Caio mudou?" | git log + diff |
| "desfaz isso" | git revert (seguro) |
