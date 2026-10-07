# Navegação e organização do framework

Escopo: raiz Git `sinapse-ai`, base `45e979f25931730ef1428d65e3dcb0a3b544a51f`.
Inventário: 5.082 arquivos rastreados, classificados uma única vez; 172 agentes,
17 squads e nove entradas no registro público, com 66 comandos resolvidos.

O [mapa completo](../../../research/expert-evolution/repository-map.json) é a
referência desta navegação. Ele registra caminhos, responsabilidade, owner por
função, SHA-256 de cada arquivo e cluster, fontes canônicas, consumidores
observados, aliases, duplicações exatas e lacunas. Owners são responsabilidades
propostas, não concessões de autoridade sobre caminhos protegidos.

## Comece pela entrega

| Necessidade | Entrada | Complemento |
|---|---|---|
| UX, UI, frontend, acessibilidade | [Design](../../../squads/squad-design/squad.yaml) | [React Bits](../react-bits/index.md) e [playbook](../react-bits/implementation-playbook.md) |
| Motion web, Three.js, shaders e scroll | [Animations](../../../squads/squad-animations/squad.yaml) | Gate separado de performance e movimento reduzido |
| Vídeo, reels, carrosséis e editorial | [Content](../../../squads/squad-content/squad.yaml) | Brand, Copy e Storytelling conservam responsabilidades distintas |
| Identidade, direção visual e coerência de marca | [Brand](../../../squads/squad-brand/squad.yaml) | Design responde pela experiência digital |
| Cursos e apresentações didáticas | [Courses](../../../squads/squad-courses/squad.yaml) | Content e Storytelling participam conforme a entrega |
| Roteamento entre squads | [Orquestrador supremo](../../../.sinapse-ai/development/agents/snps-orqx.md) | [Atlas existente](../atlas/README.md) |
| Comandos executáveis | [Resolver de agentes](../../../.codex/scripts/resolve-codex-agent.js) | [Registro público](../../../.codex/command-registry.json) é outra superfície |
| Instalação e paridade de providers | [Contrato de provider](../../../bin/lib/provider-contract.js) | [Runtime Codex vigente](../codex-parity/codex-native-runtime-v2.md) |

Este índice não cria um squad de vídeo nem IDs novos. Vídeo e motion cruzam
Content, Animations, Brand e Courses conforme a entrega. Competência validada,
direitos de mídia e ganho de qualidade dependem dos critérios da especialização.

## Navegação dos 17 squads

Contagens vêm dos caminhos rastreados desta base; tarefas incluem arquivos de
suporte dentro da pasta `tasks`, não representam comandos automaticamente
executáveis. Conhecimento indica arquivos na pasta `knowledge-base`.

| Squad | Agentes | Arquivos de tarefas | Conhecimento | Navegação |
|---|---:|---:|---:|---|
| squad-design | 14 | 101 | 19 | [agentes](../../../squads/squad-design/agents/) · [tarefas](../../../squads/squad-design/tasks/) · [conhecimento](../../../squads/squad-design/knowledge-base/) |
| squad-animations | 9 | 76 | 16 | [agentes](../../../squads/squad-animations/agents/) · [tarefas](../../../squads/squad-animations/tasks/) · [conhecimento](../../../squads/squad-animations/knowledge-base/) |
| squad-content | 7 | 90 | 32 | [agentes](../../../squads/squad-content/agents/) · [tarefas](../../../squads/squad-content/tasks/) · [conhecimento](../../../squads/squad-content/knowledge-base/) |
| squad-brand | 15 | 97 | 30 | [agentes](../../../squads/squad-brand/agents/) · [tarefas](../../../squads/squad-brand/tasks/) · [conhecimento](../../../squads/squad-brand/knowledge-base/) |
| squad-copy | 13 | 81 | 24 | [agentes](../../../squads/squad-copy/agents/) · [tarefas](../../../squads/squad-copy/tasks/) · [conhecimento](../../../squads/squad-copy/knowledge-base/) |
| squad-storytelling | 10 | 47 | 16 | [agentes](../../../squads/squad-storytelling/agents/) · [tarefas](../../../squads/squad-storytelling/tasks/) · [conhecimento](../../../squads/squad-storytelling/knowledge-base/) |
| squad-courses | 8 | 59 | 13 | [agentes](../../../squads/squad-courses/agents/) · [tarefas](../../../squads/squad-courses/tasks/) · [conhecimento](../../../squads/squad-courses/knowledge-base/) |
| squad-product | 7 | 75 | 15 | [agentes](../../../squads/squad-product/agents/) · [tarefas](../../../squads/squad-product/tasks/) · [conhecimento](../../../squads/squad-product/knowledge-base/) |
| squad-research | 7 | 72 | 26 | [agentes](../../../squads/squad-research/agents/) · [tarefas](../../../squads/squad-research/tasks/) · [conhecimento](../../../squads/squad-research/knowledge-base/) |
| squad-cloning | 9 | 54 | 16 | [agentes](../../../squads/squad-cloning/agents/) · [tarefas](../../../squads/squad-cloning/tasks/) · [conhecimento](../../../squads/squad-cloning/knowledge-base/) |
| squad-commercial | 10 | 85 | 22 | [agentes](../../../squads/squad-commercial/agents/) · [tarefas](../../../squads/squad-commercial/tasks/) · [conhecimento](../../../squads/squad-commercial/knowledge-base/) |
| squad-finance | 8 | 45 | 21 | [agentes](../../../squads/squad-finance/agents/) · [tarefas](../../../squads/squad-finance/tasks/) · [conhecimento](../../../squads/squad-finance/knowledge-base/) |
| squad-growth | 7 | 77 | 22 | [agentes](../../../squads/squad-growth/agents/) · [tarefas](../../../squads/squad-growth/tasks/) · [conhecimento](../../../squads/squad-growth/knowledge-base/) |
| squad-paidmedia | 9 | 82 | 21 | [agentes](../../../squads/squad-paidmedia/agents/) · [tarefas](../../../squads/squad-paidmedia/tasks/) · [conhecimento](../../../squads/squad-paidmedia/knowledge-base/) |
| squad-council | 11 | 56 | 11 | [agentes](../../../squads/squad-council/agents/) · [tarefas](../../../squads/squad-council/tasks/) · [conhecimento](../../../squads/squad-council/knowledge-base/) |
| squad-cybersecurity | 8 | 53 | 14 | [agentes](../../../squads/squad-cybersecurity/agents/) · [tarefas](../../../squads/squad-cybersecurity/tasks/) · [conhecimento](../../../squads/squad-cybersecurity/knowledge-base/) |
| claude-code-mastery | 8 | 51 | 14 | [agentes](../../../squads/claude-code-mastery/agents/) · [tarefas](../../../squads/claude-code-mastery/tasks/) · [conhecimento](../../../squads/claude-code-mastery/knowledge-base/) |

Os 160 agentes dos squads se somam aos 12 agentes canônicos de engenharia e
roteamento em [development/agents](../../../.sinapse-ai/development/agents/):
`analyst`, `architect`, `data-engineer`, `developer`, `devops`, `product-lead`,
`project-lead`, `quality-gate`, `snps-orqx`, `sprint-lead`, `squad-creator`,
`ux-design-expert`. O agrupamento `core` do resolver não é um décimo oitavo squad.

## Responsabilidades atuais

| Classe | Arquivos | Caminhos principais | Regra de edição |
|---|---:|---|---|
| canonicalAgents | 172 | `squads/*/agents`, `.sinapse-ai/development/agents` | Autoridade e identidade na fonte, nunca no adapter |
| canonicalDomain | 519 | `squads`, `sinapse/knowledge-base` | Conhecimento, contratos e templates do domínio |
| canonicalRuntime | 953 | `.sinapse-ai` fora das classes específicas | Preservar gates de proteção e extensão |
| workflows | 1.533 | `tasks` e `workflows` de squads, core, Codex e sinapse | Não confundir quantidade de arquivos com comandos resolvíveis |
| providerAdapters | 592 | `.codex/agents`, `.claude/agents`, `.agents/skills`, `.claude/skills` | Regenerar pelos contratos, não copiar conhecimento |
| compatibility | 10 | Aliases públicos, `sinapse/agents`, migrations do installer | Manter aliases e hashes de migração |
| tests | 545 | `tests`, `__tests__`, fixtures e arquivos de teste | Provar consumidor e paridade antes de consolidar |
| delivery | 174 | `bin`, `scripts`, `packages` | CLI, instalação e distribuição |
| documentation | 371 | `docs` e documentação pública da raiz | Navegar ao original; traduções não são duplicação presumida |
| research | 5 | `research` rastreado na base | Evidência derivada, com origem e validade |
| governance | 19 | `governance`, `audits`, políticas da raiz | Dono de proposta/auditoria separado de implementação |
| history | 36 | `_archive`, `_deprecated`, `archived`, `docs/stories` | Preservar registros e fixtures; confirmar owner |
| operations | 153 | Configurações, rules, hooks, CI e arquivos restantes | Classificação operacional; owner proposto precisa de revisão |

A precedência de classificação preserva históricos e fixtures antes de agrupar
por pasta. Um arquivo aparece em somente uma classe. As saídas novas desta
evolução não entram na contagem da base enquanto estiverem fora do índice Git.

## Fontes e consumidores

O resolver lê os pointers Markdown e resolve a definição em `squads` ou
`.sinapse-ai/development/agents`. Os 172 IDs têm fonte rastreada e três adapters
rastreáveis: pointer Codex, TOML Codex e adapter Claude. Isso não comprova o estado
instalado em perfis globais nem execução dos providers.

`agents[].consumers` registra referências literais exatas às fontes canônicas.
`sourceConsumerManifest` acrescenta imports/requires relativos resolvidos a
arquivos rastreados para os dez contratos de geração, instalação e paridade.
Expressões dinâmicas, globs e consumidores externos continuam como lacuna.

O [catálogo Codex](../../../.codex/catalog.json) governa skills e convenções.
O [contrato de provider](../../../bin/lib/provider-contract.js) governa aliases
públicos e as 172 identidades. O [gerador](../../../scripts/sync-provider-adapters.js)
e o [gerador nativo](../../../.codex/scripts/sync-codex-native.js) derivam adapters.

O [delivery de especialização](../../../bin/lib/framework-evolution-delivery.js)
converte caminhos de instalação. O [package.json](../../../package.json) define
o que entra no pacote; migrations e validadores de paridade são consumidores
reais. Uma busca textual sem resultado não autoriza mudança de caminho.

## Ruídos confirmados e tratamento

| Ruído observado | Evidência | Tratamento atual |
|---|---|---|
| Vários nomes públicos para a mesma entrada suprema | Skills `sinapse`, `snps`, `sinapse-orqx`, `snps-orqx`; contrato de provider | Mostrar um destino canônico, conservar todos os aliases |
| Duas superfícies da mesma skill React Bits | SHA-256 idêntico em `.agents/skills` e `.claude/skills` | Identificar como distribuição por provider; preservar ambos |
| Dois nomes do mesmo agente em `sinapse/agents` | `sinapse-orqx.md` e `snps-orqx.md` têm bytes idênticos | Compatibilidade explícita; não criar mais uma identidade |
| Matrizes com nomes diferentes e bytes iguais | `.codex/delegation-matrix.json` e `.codex/delegation-parity.json` | Comparar consumidores de delegação/paridade antes de unificar |
| Duas cópias do mesmo trace de documentação | `00-shared-activation-pipeline.md` e `.v1-act8.md` | Confirmar função de snapshot/versionamento; apontar navegação vigente |
| Duplicação em elicitation e guards de hooks | Classes `canonicalRuntime` e `delivery` no manifesto de hashes | Caminhos protegidos e distribuição exigem fixtures e owner |
| Referências sem arquivo no baseline | `docs/ARCHITECTURE-FIRST-WORKFLOW.md`, `docs/framework/codex-runtime-reference.md` | Lacuna de instrução/snapshot; usar os documentos vigentes vinculados acima |
| README histórico aponta IDs que não existem | `_deprecated/README.md` cita `.codex/agents/db-sage.md` e `tools-orqx.md` ausentes | Marcar referência histórica stale; não inventar aliases |
| Owners operacionais/históricos sem confirmação | `.docker/llm-routing`, `_archive`, `archived`, registros depreciados | Preservar, registrar revisão; não executar serviços nem limpezas |

Foram encontrados 14 clusters com bytes idênticos, abrangendo 34 arquivos.
Parte deles são `.gitkeep`, fixtures ou cópias distribuídas de guards. Igualdade
de bytes serve para revisão, não prova inutilidade ou autorização de remoção.

## Hierarquia futura proposta

Esta é uma organização lógica. Não existe autorização para mover o framework
inteiro nem para alterar caminhos protegidos nesta entrega.

| Bloco lógico | Fontes atuais | Compatibilidade necessária |
|---|---|---|
| `domains/{squad}` | `squads/{squad}` | Preservar manifests, IDs e resolução de tasks |
| `framework/{runtime,engineering}` | `.sinapse-ai/core`, `development/agents` | Resolver, imports e gates protegidos |
| `providers/{codex,claude}` | `.codex`, `.claude`, `.agents/skills` | Adapters regeneráveis e instalação local/global |
| `delivery/{cli,installer}` | `bin`, `packages/installer`, scripts | Entrypoints do pacote, exports e paths instalados |
| `verification` | `tests` e fixtures embutidas | Descoberta Jest, mocks de instalação e paridade |
| `evidence` | `research`, inventories e avaliações | Proveniência, corpus e consumidores de contexto |
| `documentation` | `docs` | Links, idiomas e Atlas existente |
| `records` | `docs/stories`, `_archive`, deprecations | Histórico e recovery, sem descarte automático |

Recomenda-se manter os paths físicos e usar este índice agora. Consolidação
posterior deve escolher um único alvo por vez e comparar ganho de navegação,
custo de compatibilidade, risco de instalação e evidência de consumidores.

## Gates e rollback de uma migração física

1. Nomear source e owner, listar os consumidores explícitos/dinâmicos e aprovar
   uma story com alvo e critério de preservação. Paths protegidos exigem o fluxo
   próprio; remoção requer autorização explícita.
2. Criar fixtures que reproduzam resolução, instalação limpa, atualização de
   instalação antiga, provider generation e imports envolvidos. Medir os hashes
   e guardar os arquivos originais e o manifest de migração.
3. Introduzir aliases/shims onde consumidores antigos precisarem deles; atualizar
   os geradores, não suas cópias isoladas. Validar pacote/manifest e paridade nos
   dois providers antes de promover a alteração.
4. Executar lint, testes afetados, gates de segurança/protected paths/segredos,
   schema/story/paridade e readback de instalação. Não usar ambiente publicado
   para testar nem declarar equivalência somente por um comando verde.
5. Rollback restaura os arquivos e mapeamentos exatos do receipt, regenera adapters
   com a versão anterior e repete fixtures/paridade. Ausência de referência por
   grep não substitui esta prova nem a autorização de remoção.

## Contrato implementado pelo developer

Implementação em `scripts/expert-evolution/catalog.cjs`, com testes em
`tests/unit/expert-evolution-catalog.test.js`. O architect entregou os dados e
esta arquitetura; o developer implementou o CLI e seus testes posteriormente.

Comandos disponíveis na raiz Git:

```text
node scripts/expert-evolution/catalog.cjs summary
node scripts/expert-evolution/catalog.cjs agent design-orqx
node scripts/expert-evolution/catalog.cjs squad squad-design
node scripts/expert-evolution/catalog.cjs paths --responsibility providerAdapters
node scripts/expert-evolution/catalog.cjs validate --refresh
```

`--source research/expert-evolution/repository-map.json` deve permitir consultas
ao manifesto ainda fora do índice Git. `--include <relative-path>` pode incluir
novos arquivos autorizados de forma explícita, sem descoberta recursiva de
arquivos fora do Git e sem inventariar caches ou `node_modules`.

Exports sugeridos: `classifyPath`, `buildCatalog`, `validateCatalog`, `queryAgent`,
`querySquad`, `queryPaths`, `main`. IDs desconhecidos e classe desconhecida devem
falhar com erro; aliases só podem vir dos contratos existentes.

Aceitação do runtime: raiz Git exata; rejeição de traversal, symlink e paths
externos; cobertura única completa; ordem e hashes estáveis; fonte canônica por
172 IDs, 17 squads e nove entradas públicas; todas as 66 targets públicas válidas;
clusters iguais preservados; geração repetível e JSON semanticamente validado.

Fixtures devem provar as precedências da classificação, import relativo,
fonte/adapter correto, Git root aninhada, arquivo omitido/duplicado, symlink,
include explícito e desconhecido, duplicações que continuam consumidas e
reprodutibilidade. Não testar somente que um campo repete a implementação.

## Verificação desta entrega

Leitura Git e arquivos na raiz exata confirmou 5.082 paths únicos, 172 fontes
canônicas rastreadas, três adapters por agente, 17 manifests de squad e nove
entradas/66 comandos públicos com targets rastreadas. SHA-256 foi calculado dos
bytes atuais; o JSON foi salvo e relido.

Nenhum fonte foi movido, removido ou renomeado. Nenhum path protegido foi editado.
O mapa é um snapshot do baseline: `validate` relata hashes alterados; `--refresh`
recalcula o catálogo atual sem sobrescrever esse baseline. Novos arquivos entram
via índice Git ou `--include` explícito, sem varredura de caches e diretórios externos.

O developer verificou classificação, consumidores, ordem/hash reproduzível,
raiz Git nativa Windows, traversal e symlinks. Paridade e fixtures de instalação
passaram; a [verificação final](verification.md) registra a coorte integrada e
a preservação. Nenhuma instalação no perfil pessoal ou publicação é inferida.

## Entrada pelo entregável — T05

`node scripts/expert-evolution/catalog.cjs deliverable <termo>` resolve frontend,
motion, Reel, carrossel e anúncio sem exigir o ID do agente. Aliases incluem
interface, animação, vídeo, carousel e ads. O índice é
`research/expert-evolution/deliverable-index.json`.

Cada consulta confere o resolver canônico e o binding semântico, conserva path e
hash da tarefa e apresenta a lacuna daquele entregável. Anúncio/copy é a quinta
necessidade assumida para esta navegação; ela pode ser renomeada sem alterar as
outras quatro. Roteamento não equivale a expertise ou aprovação do produto.

A biblioteca ignorada e o ciclo de feedback estão descritos em
[persistent-learning.md](persistent-learning.md). Nenhum arquivo foi movido ou
removido, e a aquisição mantém no máximo três famílias ativas.
