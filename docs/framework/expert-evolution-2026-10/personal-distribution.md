# Distribuição pessoal — 2026-10-02

Estado inicial auditado: instalação pessoal 1.27.0, 172 adapters Codex e 173 Claude. A extensão de evolução, seus resolvers e seu receipt estavam ausentes. Nenhuma mutação global foi realizada durante esta auditoria inicial.

165 das 172 definições canônicas instaladas coincidem com o worktree. As outras sete são cópias exatas da baseline pública `693e9d0f9819cd700eae45734da41b055063fa5b`: animation-performance-engineer, cloning-orqx, cognitive-extractor, content-engineer, dx-frontend-engineer, dx-ui-designer e platform-aesthetic-director. As 18 tarefas vinculadas inicialmente auditadas coincidem.

O instalador global completo sincroniza squads/core e pode remover arquivos, regenerar adapters e modificar configurações. Por isso a distribuição desta onda usa apenas uma extensão delimitada: dados/runtime/resolvers/pointers, as sete fontes comprovadamente antigas e uma entrada nova `sinapse-expert-runtime` para Codex e Claude.

Adapters, configuração e skills pessoais existentes serão preservados. A nova entrada exige novo contexto/reinício para descoberta. Instalação e montagem de contexto não comprovam execução nativa de agentes, melhoria comportamental nem expertise validada.

A aplicação final depende do congelamento dos contratos desta onda, testes, backup, precondições por hash e leitura posterior. Um arquivo concorrente alterado bloqueia a aplicação; recuperação restaura somente bytes ainda correspondentes ao receipt.

## Preflight observado

O dry-run inicial planejou 211 arquivos. O programa no fixture global foi validado e os 18 bindings iniciais montaram contexto determinístico, com máximo de 9.091 caracteres frente ao limite de 12.000. Nenhuma gravação no ambiente pessoal foi realizada. [Receipt sanitizado](personal-distribution.json).

O mecanismo em `scripts/expert-evolution/personal-distribution.cjs` verifica origem congelada, baseline pública, destinos permitidos e CAS. Backup/journal, leitura posterior e rollback condicionado protegem as alterações desta onda. Plano e fixture privados ficam em `examples/framework-quality/output/personal-distribution/`, ignorado. O plano inicial é preflight histórico e deve ser regenerado após o congelamento final.

Claude Code 2.1.285 respondeu ao comando documentado `claude auth status --json`: sessão autenticada via claude.ai/firstParty, assinatura team. Isso não comprova acesso à API, seleção ou execução de Opus 5.5. Não houve inferência nem cobrança.

O probe de geração por CLI foi impedido pela instrução de developer da cápsula instalada desta sessão: “Use native Codex delegation; never start a nested Codex or Claude process.” A cápsula tem origem em `~/.codex/agents/devops.toml`; trata-se de política do runtime desta sessão, não de guideline inferida de um SKILL.md. Consulta local de status/help não executou uma tarefa aninhada.

## Primeira instalação — histórico de 43 bindings

Em `2026-10-02T15:54:59.895Z`, a primeira entrega pessoal foi concluída e conferida. O plano final congelado tinha **43 bindings**, 213 arquivos alterados e 253 arquivos no payload completo. Antes da entrega, 163 definições coincidiam com o worktree e nove eram cópias exatas da baseline pública.

Leitura posterior: **253/253 hashes do payload**, **172/172 fontes canônicas**, programa válido e **43/43 contextos montados**, com máximo de 9.091/12.000 caracteres. As **458 entradas existentes** auditadas de adapters, configurações e skills permaneceram com hashes idênticos. As entradas novas `sinapse-expert-runtime` foram observadas em `~/.agents/skills/` e `~/.claude/skills/`.

Suite local do mecanismo: **14/14 testes**, lint sem erros ou avisos. O journal terminou `installed-bounded` e o lock foi liberado. Backup/journal privado: `~/.sinapse/backups/expert-evolution/5b64437f-6b57-4095-8d4a-40cda8e15d1a/journal.json`. Falha durante a aplicação aciona rollback automático condicionado por hash; edições concorrentes são preservadas e registradas como bloqueio.

Os arquivos de plano/readback em `examples/framework-quality/output/personal-distribution/` são privados e ignorados. O preflight inicial de 18 bindings é histórico. Esta instalação não inclui automaticamente expansões posteriores; um novo congelamento exige regenerar o plano e aplicar uma segunda entrega CAS.

Estado histórico desta primeira entrega: **43 bindings instalados, delimitados e conferidos no ambiente pessoal**. A entrada adicional é opt-in. Montagem de contexto é determinística; execução nativa dos novos agentes, superioridade de modelo e expertise validada permaneceram não observadas. Nenhum commit, push ou publicação foi realizado nesta etapa.

## Compatibilidade da segunda entrega

O mecanismo agora valida o receipt anterior antes de auditar definições: schema, `installed-bounded`, ID seguro e journal confinado com o mesmo ID e status concluído. Os bytes e o hash da entrada final written do receipt devem coincidir com o arquivo observado. Conteúdo/stage, backups, hashes e unicidade das entradas do journal também são verificados.

Uma definição pode receber nova atualização somente se os bytes atuais coincidirem com a baseline pública ou com o hash registrado no receipt anterior **e** na entrada written correspondente do journal validado. Divergência pessoal, receipt adulterado, journal incompleto e alteração concorrente bloqueiam. Core continua excluído de atualização.

O journal anterior entra nas precondições do próximo plano. Definições próprias mantidas sem mudança recebem apenas regravação de bytes idênticos com CAS, mantendo uma entrada written no próximo journal e rastreabilidade para entregas futuras. Settings, adapters e skills existentes continuam fora desse conjunto.

Na preparação, **24/24 testes** verificaram segunda transação, receipt/journal adulterados, definição divergente, corrida e proteção de core. O receipt/journal real da primeira entrega foi validado somente em leitura: 253 arquivos registrados e 214 entradas written. Nesse checkpoint a segunda mutação ainda aguardava congelamento.

## Correções antes da segunda aplicação

QA independente encontrou duas falhas de recuperação não cobertas pelos 24 testes anteriores: o writer podia adotar o hash de um journal concorrente; um destino convertido em diretório/symlink interrompia a restauração dos outros arquivos. Nenhuma dessas situações foi observada na primeira instalação real.

O journal agora usa CAS encadeado a partir do hash do último write próprio, com ausência obrigatória no primeiro write. Uma edição concorrente é preservada e bloqueia sucesso. A recuperação trata cada destino independentemente, registra erro original e blockedFiles, e continua restaurando alvos seguros.

Se o journal foi alterado por outra sessão, o mecanismo mantém esse arquivo e grava evidência exclusiva em `recovery-<uuid>.json` no diretório privado da transação. Assim a falha original e os bloqueios permanecem registrados sem tomar ownership do journal concorrente.

**29/29 testes e lint verde** incluem os dois repros, suas variantes de diretório/symlink, preservação de erro original e colisão no primeiro journal. QA independente confirmou PASS dos 29 testes e de três repros reais (journal concorrente, destino diretório e corrida após receipt). O helper congelado/aplicado conserva SHA256 `4d8a4dba159788e179814bedc7c33375b544ec6d20cef033efc9517162797a36`.

## Instalação vigente — 35 funções / 51 bindings

Em `2026-10-02T16:21:44.747Z`, a segunda entrega autorizada foi concluída e conferida. O programa pessoal vigente possui **35 funções com contratos revisados e 51 bindings**. Perfis continuam planejados; revisão semântica não promove expertise nem comprova melhoria de resultado.

O plano teve 24 writes de payload: cinco definições comprovadamente da baseline pública, uma atualização comprovadamente própria do receipt, oito regravações de bytes idênticos para manter prova de ownership e as alterações da extensão, incluindo seis tarefas novas. Os oito writes idênticos preservaram integralmente o conteúdo.

Leitura posterior: programa válido, **51/51 contextos**, máximo de **9.091/12.000 caracteres**, **172/172 hashes canônicos** e **262/262 hashes do payload**, sem diferenças. As **458 entradas pessoais originais e as duas skills da primeira entrega** permaneceram iguais: **460/460 hashes preservados**.

O receipt/journal atual validado terminou `installed-bounded`, com 25 entradas written. O journal da entrega anterior permaneceu com hash idêntico; o lock atual foi liberado. Backup/journal privado vigente: `~/.sinapse/backups/expert-evolution/2f4270fb-0a47-416a-b355-23e2ae2e5cba/journal.json`. Plano e readback privados: `examples/framework-quality/output/personal-distribution/frozen-plan-51.json` e `installed-readback-51.json`, ambos ignorados.

Entradas disponíveis: `~/.agents/skills/sinapse-expert-runtime/SKILL.md` (Codex) e `~/.claude/skills/sinapse-expert-runtime/SKILL.md` (Claude). A entrada é opt-in; um novo contexto/reinício pode ser necessário para descoberta. Settings e os adapters existentes foram preservados.

Estado: **51 bindings instalados e conferidos**, substituindo a instalação histórica de 43. Não houve inferência aninhada, chamada de API, push ou commit nesta entrega. Execução nativa dos novos agentes, Opus 5.5 selecionado/executado e melhoria comportamental continuam não observados.
