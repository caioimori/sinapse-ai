# Verificação operacional — 2026-10-02

## Resultado e camadas

Atualização local em `codex/feat/framework-evolution-20261002`, preservando a worktree original e os caminhos protegidos. A extensão pessoal adicional está instalada e conferida por hashes. O preview abriu na aba HTTP do aplicativo. Integração ao projeto principal, push, PR, CI remoto e publicação não ocorreram.

| Frente | Evidência observada | Limite |
|---|---|---|
| Contratos | 35 funções/51 comandos; seis tarefas novas; 172 agentes resolvem | 137 funções sem contrato revisado; zero expertise promovida |
| Inventário | 1.418 task files; 1.354 alcançáveis pelo ativador | Arquivo/rota não comprova competência |
| Regressão final | 324/324 testes, 22/22 suites, zero skips, 211,484s | Coorte local; nenhuma execução de CI remoto |
| Paridade | 172 adapters por provider; 37 skills; 17/17 YAML; lint/typecheck | Não comprova ativação de todos os agentes instalados |
| Autoria e privacidade | Guard de autoria 27/27; scans em 5.206 arquivos rastreados | Exceções legais e registros de auditoria conservados |
| Pacote | Dry-run: 4.432 arquivos, sete targets novos exigidos; 4.427 fontes sem segredo de alta confiança | Sem tar, instalação de pacote ou publicação; scan de entropia desativado conforme guard existente |
| Instalação pessoal | 51/51 contextos ≤9.091/12.000 chars; 262/262 payload hashes; 172/172 canônicas | Skill opt-in exige contexto novo; execução nativa não observada |
| Preservação pessoal | 460/460 entradas; journal concluído com 25 written; lock liberado | Recovery delimitado por CAS; não é garantia contra toda falha de sistema |
| Preview | 27 checks; desktop/390/320 sem overflow; snapshots finais e leitura na aba HTTP | Página informativa; selecionar trilha não executa agente |
| Interfaces pareadas | 12 HTMLs; 225 verificações; 4 preferências aprimorado/2 empates | Uma geração/caso; mobile inicial; sem inferência causal |
| Pastas | 14 clusters/34 arquivos com consumidores rastreados, todos preservados | Nenhuma consolidação física ou remoção funcional |

Fontes e receipts: [contratos](priority-contracts-review.md), [seis tarefas](design-task-completion.md), [distribuição](personal-distribution.json), [pares](paired-interface-results.md), [pastas](operational-folder-audit.md) e [serviços](operational-services.md).

## Falhas encontradas e correções verificadas

1. Análise de conteúdo resolvia SQL/EXPLAIN; calendário editorial caía em tarefa genérica. Campo canônico explícito passou a validar tarefa e owner da própria squad. Um primeiro sync rejeitou o syntax legado do núcleo; a validação foi delimitada às 17 squads, preservando o núcleo. A resolução final dos 172 agentes passou.
2. A revisão independente da instalação encontrou CAS de journal adotando bytes concorrentes e rollback interrompido por destino convertido em diretório. Foram corrigidos o encadeamento do último hash próprio e a recuperação isolada por entrada. 29 testes e três reproduções independentes reais passaram antes da segunda aplicação. Erro original, arquivos concorrentes e evidência separada são preservados.
3. A primeira coorte após T08 passou 323/324: expectativa de inventário ainda indicava 1.412/1.348. A contagem foi corrigida para 1.418/1.354, com as seis tarefas explicitamente exigidas entre os targets alcançáveis. A repetição completa passou 324/324.
4. A primeira leitura independente de HOME usou um caminho local para as definições do core e falhou com ENOENT. O probe foi corrigido para o layout global `core/`; passou com 172 canônicas, 262 hashes e 51 bindings, sem alterar HOME.
5. Uma tentativa de atualizar os textos do snapshot em PowerShell não escreveu todos os campos. A escrita por IDs no JSON corrigiu o estado. Os 27 checks funcionais do ciclo 3 pertencem a esse ciclo; um readback final separado conferiu métricas, três estados de distribuição, oito itens e seis evidências em 1440/390/320. HTML/CSS/JS/verificador são idênticos aos hashes do ciclo 3; somente o dataset foi finalizado depois.
6. O guard de autoria bloqueou duas menções do upstream no novo snapshot público. Os títulos do painel passaram a descrever a atualização pública; versão, SHA, fontes e atribuição legal foram conservados nos registros próprios. O guard voltou a passar; a alteração textual recebeu readback final separado.

As falhas e os receipts anteriores permanecem preservados. Não foram convertidos em aprovação ou removidos para produzir um resultado verde.

## Integridade e distribuição

A worktree original conserva branch, SHA e as **191 entradas**, com zero diferença de hash/status frente ao snapshot inicial. Nenhum caminho protegido foi modificado desde a base inicial. Biblioteca privada, outputs de mídia, contextos e planos pessoais permanecem ignorados e fora do pacote.

O empacotamento foi conferido somente em dry-run, sem gerar tar, instalar dependências ou publicar. Inclui o helper e as seis tarefas novas, com zero alvo obrigatório ausente e zero biblioteca/output privado. Scans de proveniência/dados pessoais e segredos staged, guards de branch/proteção/SQL, manifest e story/workflow são verificados no checkpoint.

Receipts privados reproduzíveis sob `examples/framework-quality/output/verification/`: `operational-tests.json` (296/296 anterior), `operational-final-tests.json` (323/324), `operational-final-tests-green.json` (324/324), `operational-installed-root-readback.json`, `operational-preservation.json` e os probes de pack/links. O [receipt público da instalação](personal-distribution.json) conserva a primeira entrega de 43 como histórica e a de 51 como vigente.

Capturas finais do painel em `examples/framework-quality/output/hub-final-readback-2/`, com hashes e overflow zero. Desktop e mobile de 390px foram inspecionados visualmente; o segundo readback finaliza os dois títulos do snapshot. Os exemplos Lume e suas fontes permanecem disponíveis; áudio/reprodução contínua e o Reel conservam as ressalvas da auditoria anterior.

## Pendências reais

- Serviço ditado como GM não identificado nas abas conectadas; endereço solicitado ainda ausente. Não foi presumido que login autoriza outra conta ou destino.
- Jev sem credencial identificada no ambiente consultado; piloto autorizado USD0.05 continua não executado, zero chamadas/custo de Jev.
- Claude autenticado por consulta de status; Opus 5.5 sem geração/benchmark observado no ambiente compatível.
- Mobbin sem nova sessão observada nesta retomada. Receipts anteriores conservados, sem redistribuir assets ou inferir licença.
- 137 funções e 88 referências candidatas; fontes, prática, casos reservados e revisão independentes ainda precisam demonstrar transferência. Nenhum livro/mil horas ou especialização mundial foi declarado concluído.
- Replay de todos os estados das 12 interfaces no mobile, revisão audiovisual contínua e verificação de ativação nativa instalada permanecem distintos do que passou nesta onda.

O próximo trabalho usa falha observada e competência delimitada. O framework não altera automaticamente provider/modelo, permissões, configurações existentes ou corpus a partir de uma nota ou contagem.
