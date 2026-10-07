# Runtime e autoridade dos agentes

O resolver `.codex/scripts/resolve-codex-agent.js` identifica 172 agentes em 17 squads. O inventário atual tem 1.460 arquivos de tarefa e 1.396 alcançáveis pelo ativador paramétrico; os 64 restantes conservam lacunas históricas. São contagens de descoberta, não de expertise ou permissão de execução.

O `--stats` legado observa 171 agentes com tarefas descobertas. Os 172 contratos operacionais usam também os bindings explícitos do registry core; essa cobertura tem escopo próprio e não altera retroativamente a contagem legada.

## Resolução e execução

1. Resolver o ID canônico e o comando exato; aliases de compatibilidade conservam a identidade original.
2. Ler a fonte canônica e a tarefa selecionada. Um pool compartilhado facilita descoberta; ele não transfere a autoria da tarefa para outro especialista.
3. Consultar o contrato operacional. Um especialista com tarefa de colega deve delegar ao proprietário indicado; orquestradores roteiam, sem alegar execução especializada própria.
4. Respeitar story, protected paths, permissões nativas, autorização de escrita e gates do projeto em que o trabalho será produzido.

O manifest `research/expert-evolution/operational-contracts.json` contém 2.640 memberships operacionais. O validador deriva papéis, missão, squad, canonical/task hashes e autoridade das fontes atuais; adulteração ou instalação parcial falha com erro. Workflows sem proprietário exato conservam um gap explícito.

## Contexto do projeto para os dois provedores

A extensão opt-in `sinapse-project-expert` usa o mesmo gateway offline no Codex e no Claude Code. Peça **“Use sinapse-project-expert com dx-ui-designer, tarefa compose-screen-layouts, para [objetivo]”**. A skill pessoal fornece o comando e o pin de confiança; não exige chave ou chamada paga.

O vínculo distingue a raiz verificada de leitura da raiz ativa de trabalho. Ler canônico/tarefa pela fonte vinculada; produzir arquivos somente no projeto ativo, preservando edições concorrentes e protected paths. Contexto não autoriza trocar de projeto nem sobrescrever canônicas globais antigas.

O gateway verifica fontes, módulos, rosters e referências privadas antes de importar o runtime. Outro repositório, vínculo/hash adulterado, symlink/junction ou fonte modificada é bloqueado. Um commit com bytes iguais conserva confiança; alteração da fonte ou do acervo exige novo congelamento revisado.

Limites: contexto total <=12.000 caracteres, conhecimento <=6.000, perfil <=3.000. Critérios completos cabem ou são explicitamente adiados. `model:null`, `contextOnly:true`, `executionObserved:false` representam recuperação determinística; a escolha e a execução do modelo pertencem ao provedor nativo.

35 perfis e 51 bindings possuem revisão semântica delimitada; 12 mecanismos privados curados entram somente quando pertinentes. As 88 referências candidatas permanecem candidatas. O [fechamento](expert-evolution-2026-10/CLOSEOUT-VERIFICATION.md) separa cobertura operacional, instalação, inferência e expertise comprovada.
