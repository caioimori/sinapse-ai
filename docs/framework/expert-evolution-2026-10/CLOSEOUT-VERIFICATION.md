# Fechamento operacional para Codex e Claude Code

Estado: implementação e instalação local/pessoal verificadas. Fonte de verdade desta onda: [story](../../stories/cross-provider-closeout-20261002.story.md), [spec](CLOSEOUT-SPEC.md), [workflow](closeout-workflow.json) e [ADR](closeout-adr.md). Sem publicação remota; os limites de pesquisa, inferência e percepção audiovisual permanecem explícitos.

## Resultado operacional

| Item | Evidência observada | Limite |
|---|---|---|
| Agentes e squads | 172 agentes, 17 squads, 2.640 contratos de tarefas; nenhuma lista vazia | Autoridade operacional não comprova expertise |
| Tarefas ausentes | 30 Finance, 11 Claude Code mastery e uma Cloning | Fontes e regras fiscais atuais são pré-condições de execução |
| Autoridade | Tarefas de colegas exigem delegação; aliases e chief seguem identidade canônica | Descoberta do pool não autoriza executar a tarefa |
| Expertise | 35 perfis/51 bindings revisados; 2 referências READ e 88 CANDIDATE preservadas | Nenhuma promoção mundial nem leitura integral adicional |
| Conhecimento privado | 12 entradas curadas, com fonte, locator, direitos, revisão e hash | Permanecem no projeto, fora de Git, npm e HOME |
| Contexto | Total <=12.000, conhecimento <=6.000, perfil <=3.000; contexto sem escolher modelo | Montagem não é inferência nativa de Codex ou Claude |

Corrigidos títulos/tipos de quatro referências candidatas, tarefas próprias de roadmap/SOP/copy, identidade de aliases, papéis Holdfast/Purpose e cenários financeiros apresentados como percentis sem distribuição. Os hashes canônicos foram atualizados somente para os cinco perfis alterados. O [registro de correções](closeout-source-corrections.json) conserva os valores anteriores; receipts históricos não foram reescritos.

## Distribuição compartilhada

`sinapse-project-expert` é uma entrada adicional para os dois ambientes. Templates públicos são idênticos. A skill pessoal instalada contém o comando e o pin do gateway; o projeto atual precisa pertencer às raízes explicitamente vinculadas do mesmo repositório.

O gateway verifica o vínculo, a fonte real, hashes, rosters, módulos locais, autoridade e referências privadas antes de importar o runtime. Raiz de outro cliente, symlink/junction, vínculo adulterado, código ou membership alterados e instalação parcial falham com erro. `model:null`, `contextOnly:true`, `executionObserved:false` conservam a escolha de modelo no provedor nativo.

Instalação exclusivamente aditiva: nove destinos novos, journal, lock exclusivo, CAS, rollback e readback. As duas preparações anteriores foram revertidas por CAS; a terceira foi instalada depois do PASS estrutural independente. As correções ampliaram o congelamento para Claude Code mastery, grafo privado e targets não Markdown, incluindo workflows YAML.

Cobertura estrutural final observada: 2.095 entradas, 172 canônicos e pointers, 2.640 memberships, 51 bindings e 89 referências privadas transitivas. `sourceHead` registra proveniência; um novo commit com os mesmos bytes não invalida o vínculo. Alterar bytes ou rosters exige revisão e novo congelamento.

Readback definitivo: 20/20 contextos de design e 12/12 de autoridade nas duas raízes, com bytes equivalentes entre Codex e Claude Code; 18 pedidos inválidos foram rejeitados sem saída de contexto. Máximo observado: 11.836 caracteres totais, 5.973 de conhecimento e 2.834 de perfil. Transação `4a7c01b2-ca7a-476b-ab15-2fbd29eef317`; registry SHA-256 `9e77ae3b428d471c55462ed0490abd9a2e4b1c8dd18fd0007f01bd3d1cd7edb3`. Nenhuma inferência nativa foi observada.

Uso nos dois ambientes: **“Use sinapse-project-expert com dx-ui-designer, tarefa compose-screen-layouts, para [objetivo]”**. A extensão lê as entradas aprovadas da worktree-fonte e produz no projeto ativo autorizado. Manter essa worktree e o acervo privado; sua remoção ou alteração de entradas exige migração/refresh verificado, sem fallback para outro cliente.

As definições globais anteriores são preservadas. Cinco canônicas atualizadas desta onda são oferecidas pelo vínculo do projeto, sem sobrescrever as versões antigas em HOME. Isso conserva o trabalho concorrente e delimita onde o conhecimento privado é recuperado.

## Revisão independente e testes

- Operacional: PASS para 172/17/2.640; 42 contextos novos e dez casos positivos. Oito adulterações e duas instalações parciais foram bloqueadas. Os 19 YAML com owner TBD continuam workflows declarados, com gap explícito e sem falsa autoria.
- Coorte principal: cinco suites, 111/111 testes. O primeiro e o segundo ciclos vermelhos foram preservados; autoridade, contagens e critérios foram corrigidos sem relaxar as proteções.
- Regressão por paths exatos: 14 suites, 174 testes, 172 passaram e dois falharam por expectativas antigas. Reparação limitada das duas suites: 13/13 passaram. O controle CSS agora exige delegação ao proprietário real; as 38 skills são 37 centrais mais uma opt-in, com bytes equivalentes.
- Instalação: revisão independente final PASS, cinco probes/22 casos; suite final de instalação 27/27. A correção de whitespace em 12 tarefas foi provada como não semântica e suas duas suites passaram 72/72.
- A tentativa de seleção por múltiplos padrões abriu acidentalmente a suite inteira do repositório e foi interrompida, exit 1. Ela não é prova de regressão geral verde. A coorte posterior usa `--runTestsByPath` com arquivos explícitos; nenhum release foi observado nos mocks.

Agregação por arquivo de suite, usando o resultado mais recente: **276/276 testes em 18 suites**, zero pendências. Não somar reexecuções nem tratar essa coorte como aprovação de todo o repositório. Receipt `latest-scoped-tests.json`; logs vermelhos e correções permanecem privados em `examples/framework-quality/output/closeout-20261002/`.

Lint aplicável passou com exclusão apenas de `output/navigation-20261002/**`, artefatos privados antigos que causaram o vermelho anterior; a exclusão não altera a configuração de lint do produto. Typecheck, paridade 38/38 (37 centrais + uma opt-in), manifest, workflow/story e guards de segurança tiveram passagem observada. O pacote é inspecionado somente por dry-run, sem publicação; receipts finais de staging, pacote e commit ficam no mesmo diretório privado.

## Interfaces, motion e mídia

| Verificação atual | Resultado | Alcance |
|---|---|---|
| 12 interfaces pareadas | 459/459 checks, 36 combinações de artefato/largura | 1440/390/320, teclado, estados e movimento reduzido; HTMLs reservados preservados |
| Lume | 84/84 checks, 72 capturas, 60 ciclos de lifecycle | Interface, motion, shell de mídia e cinco páginas de carrossel |
| Feedback e foco | 411/411 checks, alvo Desfazer >=44px, folga mínima 8,9375px | Três projetos, teclado e redimensionamento com feedback aberto; zero overflow/interseção |
| Painel informativo | Ciclo final 416/416, 12 capturas, zero overflow/erros, fontes estáveis | 1440/390/320; instalação local/pessoal e limites offline conferidos |
| Reel de 18s | FFmpeg decodificou 540 quadros, H264 1080x1920/30fps, AAC estéreo 48kHz, exit 0 | Verificação técnica integral do arquivo, sem revisão audiovisual percebida |

A sessão não recebe áudio: a ferramenta retornou `audio content omitted because you do not support audio input`. O player foi observado em reprodução até 12,769s, sem erro; a aba temporária foi encerrada com a nova mensagem do usuário antes da leitura final. Não alegar audição nem revisão contínua. Loudness integrada -31,8 LUFS e true peak -18dBFS são medições, não aprovação musical.

As três baterias vermelhas do autor e as duas do revisor de foco permanecem preservadas. O desvio histórico de 11,038s além do orçamento de geração do baseline continua exposto; replay atual não prova igualdade retroativa de tempo nem ganho causal. Lume é uma marca fictícia de teste, explicitamente identificada no painel.

## Upstream, crédito e preservação

A atualização oficial da base open source continua v5.4.1, observada em 2026-10-02 nos dois pacotes npm e no release; identificação, atribuição e URL oficial permanecem na [auditoria técnica de upstream](../evolution-2026-10/upstream.json). Main: `4ef6530ff03b83aea953e4a426f95e012b8b70c5`. Não há release novo a incorporar nesta onda; protected paths foram preservados.

Nenhuma nova chamada paga Jev nesta onda. Duas execuções acumuladas: 19 julgamentos, custo calculado US$0,00018375 e reserva US$0,005376 de US$0,05. Saldo anterior US$3,92 é leitura arredondada do console, sem conciliação de fatura. Sem recarga ou API Anthropic; Opus permanece aprendizado de mercado.

O projeto principal conserva os 191 itens anteriores; agora tem 193 entradas sujas, somente as duas novas skills adicionais. Os 262 payloads pessoais anteriores foram conferidos sem alteração. De 12.697 entradas pessoais comparadas, 12.693 permaneceram iguais e quatro mudaram fora do write set desta instalação; esses deltas foram preservados, sem atribuir autor não observado. Nenhum arquivo preexistente foi sobrescrito pela entrega.

Organização das pastas: 14 clusters e 34 arquivos possuem consumidores distintos e foram catalogados, conservando suas fronteiras. Navegação, nomes e fonte de verdade foram esclarecidos; nenhuma pasta funcional foi apagada ou consolidada pela mera igualdade de bytes.

## Limites e continuação

Este fechamento entrega contratos, recuperação, distribuição e QA operacional; não transforma as 88 candidatas em livros lidos nem todos os agentes em especialistas mundiais. Expansão exige material autorizado, caso reservado e revisão por competência. Credencial de API Jev é opcional para automação futura; não é necessária para a extração feita pelo console ou a recuperação offline.

Ativação/inferência nativa, avaliação audiovisual humana e publicação remota conservam provas próprias. Não há deploy, push, PR, API Anthropic, remoção funcional, Docker ou WSL nesta onda. O [handoff](HANDOFF.md) reúne o estado final e as lacunas honestas.
