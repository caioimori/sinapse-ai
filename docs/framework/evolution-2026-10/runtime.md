# Runtime e inventário — evidência local

O adapter aditivo integra conhecimento por tarefa nos 172 adapters nativos Codex e
na skill genérica, sem mudar fonte canônica, gates, instalação global ou executar
modelos. A segunda geração produziu zero alterações. Todos os 172 agentes
receberam um pacote testado com fontes, lacunas e limites; isso não mede ganho
comportamental nem comprova que uma sessão já instalada utilizará o pacote.

## Reprodução

```powershell
node scripts/framework-evolution/inventory.cjs --summary
node scripts/framework-evolution/inventory.cjs --output docs/framework/evolution-2026-10/inventory.json
node scripts/framework-evolution/runtime.cjs developer --task dev-develop-story --json
node scripts/framework-evolution/runtime.cjs sinapse-orqx --task route --json
node .codex/scripts/sync-codex-native.js
.\node_modules\.bin\jest.cmd tests/unit/framework-evolution-runtime.test.js tests/unit/sync-codex-native.test.js --runInBand --silent
```

`--full` imprime o inventário integral. Por padrão o CLI imprime somente resumo.
O arquivo integral é derivado e reproduzível, não uma nova fonte de autoridade.

## Estado medido

| Superfície | Resultado | Limite |
|---|---:|---|
| Squads / agentes canônicos e resolvíveis | 17 / 172 | Existência não prova execução |
| Tasks diretas | 1.412 | Cinco arquivos de suporte em blocks separados |
| Tasks pelo resolver legado | 1.348 | Registry público tem alcance complementar |
| Tasks pela união legado + registry | 1.354 | 58 sem comando de agente, potencialmente acessíveis por loader genérico |
| Comandos públicos curados | 66 | Todos targets existem; execução não medida |
| Arquivos KB / arquivos workflow | 332 / 99 | Inclui documentação; não significa 99 workflows executáveis |
| Skills nas duas superfícies | 74 | 37 por provider; não 74 competências distintas |
| Especialistas com squad-pool fallback | 77 | Vínculo individual não comprovado |
| KB sem referência textual direta no agente | 312 | Tasks/workflows podem consumi-las; não são classificadas como órfãs |

Há 30 referências de task sem arquivo em `cost-optimizer`, `fiscal-compliance-br`
e `forecast-strategist`, dez em cada. Cada agente ainda expõe 45 tasks via pool.
Auditoria das tasks existentes não estabeleceu equivalência fiel; os comandos e
as capacidades foram preservados e o gap está no JSON.

11 arquivos workflow contêm referências que exigem revisão semântica: seis usam
nomes de personas em courses, um usa `system`, um README usa placeholder e três
de branding usam ações que não têm task homônima. Ausência no índice não prova
erro de execução. O inventário retém arquivo, referência e possíveis matches.

O extractor legado também coleta labels de tabelas fora de Tasks e comandos
abstratos. O inventário separa 632 candidatos não declarados em seções de task,
reduzindo os 115 grupos candidatos a três grupos com declarações reais ausentes.

## Correções e contrato

- O runtime usa o resolver público de comandos, que incorpora registry e fallback
  paramétrico. `snps-orqx` tem zero tasks no índice legado, mas sete comandos
  públicos; o alias `sinapse-orqx` mantém o mesmo agente canônico.
- Cada pacote retorna capsule, conhecimento completo selecionado, fontes,
  cobertura/gaps e contagem de caracteres do JSON compacto integral. Default:
  12.000 caracteres totais e 6.000 para conhecimento; estouro falha fechado.
- Retrieval recebe comando resolvido, heading e até 4.000 caracteres da task
  canônica confinada. O ranking é lexical determinístico PT/EN, por termos e
  competências; não é busca semântica por modelo. Tasks sem correspondência
  retornam gap explícito. Duas tasks reais de ad-copywriter selecionaram conjuntos
  diferentes, preservando cobertura especializada incompleta.
- IDs desconhecidos, comandos inexistentes, traversal/symlink externo,
  orçamento inválido e corpus inválido impedem montagem. Os hashes apontam à
  definição canônica atual; a capsule não resume nem substitui sua autoridade.
- O gerador orienta recuperação somente depois de resolver task. Cinco artefatos
  ausentes mantêm fluxo legado; instalação parcial ou erro de retrieval bloqueia
  aquela tarefa com erro explícito. Greeting/cold activation não carrega corpus.
- Modelo `gpt-6.1-sol` é metadata validada; nenhum processo, API, configuração
  global ou consumo pago é iniciado. O corpus continua com cobertura `gap`.
- A distribuição inclui somente os três JSONs públicos necessários, por whitelist
  em package.json; scripts já pertencem à whitelist. Nenhum diretório amplo de
  pesquisa foi incluído.

## Instalação comprovada em destinos isolados

Whitelist de npm não prova cópia ao destino. O instalador de projeto agora entrega
os dois CLIs e três JSONs após os adapters Codex. Em fixture isolada, a chamada
pública `installSinapseCore({includeCodex:true})` copiou 3.559 arquivos e executou
o runtime entregue. A instalação de dependências foi simulada para impedir rede;
isso comprova cópia/consulta de arquivos, não bootstrap de todas as dependências.

O instalador global existente copia canonical sources para `~/.sinapse/core` e
`~/.sinapse/<squad>`, layout diferente do repositório. O helper aditivo entrega
CLIs/corpus, dois resolvers, registry, tasks Codex e pointers transformados para
esses sources já instalados. Não duplica o corpus canônico de core/squads.
O resolver detecta ambos layouts, preservando os IDs e os comandos públicos.

`deliverGlobalProviderAdapters` integra a entrega somente no staging real
`~/.sinapse/.generated/agents`. O hook global usa caminho absoluto com quoting
do shell. Em HOME temporário com espaços, o comando extraído do TOML foi executado
por PowerShell, retornando JSON válido. Queries reais de core, copy e alias do
orchestrator também passaram nesse layout. Nenhuma conta/home real foi instalada.

A entrega gera `.framework-evolution-delivery.json`, com SHA-256 de cada arquivo;
readback conferiu esses hashes. Repetição muda zero payload files. Arquivos dirty
ou sem receipt correspondente são preservados com erro antes de escrever payload;
upgrades managed fazem backup por hash antes de overwrite. Pacote parcial,
receipt inválido e destino symlink/reparse falham fechado. Os writes utilizam a
primitiva atômica já existente, com binding da identidade do diretório pai.
O hash/ausência capturado no preflight é conferido na entrada da primitiva e
novamente antes do rename; testes reproduziram edição concorrente antes da entrada
e após criação do temporário, preservando conteúdo e receipt anterior. Node não
oferece compare-and-swap de arquivo contra writers não cooperativos: uma edição
após a última conferência ainda exige coordenação externa. Não se afirma CAS total.

## Verificação

47 testes passaram em três suites: runtime, adapters globais e geração nativa.
Incluem os 172 agentes, tasks distintas, limites, fontes, traversal, alias e
idempotência. Os oito casos de delivery passaram na suite completa (114,751 s),
incluindo instalador público de projeto, hook global por shell, backup de upgrade
e dois cenários de edição concorrente.
ESLint dos arquivos alterados passou. Parity passou para 172 agentes e 37 skills
por provider; registry passou para nove agentes/66 comandos; native passou para
172 agentes/37 skills/11 comandos críticos. O root integra os demais gates.

## Priorização restante

1. Definir contratos fiéis para as 30 tasks financeiras e os 77 bindings fallback;
   mapping por similaridade de nome reduziria rigor e não foi aplicado.
2. Mapear consumo real de KB em tasks/workflows e testar recuperação por competência;
   o corpus inicial não incorpora automaticamente os 332 arquivos legados.
3. Executar workflows de forma delimitada e medir casos reservados antes/depois.
   Contagem de adapters e testes estruturais não sustentam ganho comportamental.

O estado é local. Nenhuma instalação global, publicação ou deploy foi realizada.
