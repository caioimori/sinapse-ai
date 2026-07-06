# Épico: Rodada 2 — Mesa de otimizações atacáveis (AF-20260704)

**Status:** In Progress
**Origem:** Mesa de decisões da 2ª rodada de verificação da auditoria Fable 5
(`audits/AF-20260704-rodada2-verificacao.md`, §Mesa) + item de backlog G8.
**Autorização:** Caio, 2026-07-05 (YOLO doc-first; publicação segue gate próprio).
**Método:** doc-first (épico → story Ready → implementação → QA → PR) + verificação
adversarial por workflow em cada story.

## Contexto

A rodada 2 confirmou 20 achados com evidência file:line e depositou 10 itens na Mesa.
Deste conjunto, 6 são **atacáveis agora**: código/docs, reversíveis via PR, sem depender
de decisão de produto/processo ou constitucional. Este épico os executa. Os 4 itens
restantes da Mesa (frota como produto, calibração do juiz LLM, ACs em GWT, escopo por path
das rules NON-NEGOTIABLE) permanecem aguardando decisão do dono e **não** entram aqui.

## Stories (6)

| ID | Story | Tipo | Evidência (rodada 2) |
|----|-------|------|----------------------|
| M1 | Sweep de links quebrados + `docs/architecture` fantasma | docs | G8: ~109 links + 86 refs a dir inexistente em 23 arquivos |
| M2 | Verificação de substância do spec no gate de qualidade | feature | Mesa #4: gate checa status, não substância |
| M3 | Lint de descrição de ferramentas/comandos | feature | Mesa #9a: sem guard de descrição |
| M4 | Cerimônia COMPLEX≥16 aplicada em código | feature | Mesa #9b: gatilho é prosa, não enforcement |
| M5 | Fonte única CLAUDE.md ⇄ AGENTS.md | refactor | Mesa #7: gêmeos que divergem |
| M6 | Dedup da integração CodeRabbit (single-source) | refactor | Mesa #5: config duplicada em 5 agentes + espelhos |

Cada story vive em `docs/stories/rodada2-m{N}-*.md` (local, gitignored) com status `Ready`.

## Critério de pronto do épico

- 6 stories em `Done`, cada uma com PR mergeado e CI verde (suíte + lint + typecheck +
  cross-platform).
- Zero regressão: nada que já funcionava quebrou.
- Relatório `AF-20260704` atualizado com os PRs de cada story.

## Fora de escopo

- Os 4 itens de decisão da Mesa (produto/processo/constitucional).
- Publicação npm (gate explícito "publica" do dono).
- Instalação global / dedup de máquina (é o épico irmão `epic-global-install`).
