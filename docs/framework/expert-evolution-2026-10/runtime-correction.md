# Correção de contratos e recuperação — T02

Estado local: 172 identidades canônicas preservadas; sete funções com contratos revisados por significado e 18 bindings de comandos exatos. Todos os perfis continuam `planned`, `validatedExpertise=false`; o corpus conserva 172 `coverage=gap`. Revisão semântica não é avaliação comportamental.

Os contratos anteriores, critérios específicos e sugestões de aquisição continuam em `candidateContracts`/`candidateAcquisition`, com status `unreviewed`. Responsabilidades e saídas declaradas são preservadas quando há seções canônicas estruturadas; os demais continuam acessíveis por caminho e SHA. Nenhuma associação por ordem é usada pelo runtime.

## Contratos ativos

| Função | Comandos exatos | Entregável ligado |
|---|---|---|
| dx-frontend-engineer | implement-component-library, implement-responsive-layouts | Componentes, estados, modal e layout |
| dx-frontend-engineer | setup-storybook-integration | Stories isoladas com tokens/estados |
| dx-frontend-engineer | setup-frontend-architecture | Documentação de fronteiras/decisões |
| dx-frontend-engineer | configure-build-tooling | Configuração e prova de build |
| css-motion-artist | create-css-animation, build-micro-interaction, ensure-animation-accessibility | CSS motion, preferência reduzida e ciclo de vida |
| animation-performance-engineer | audit-animation-performance, ensure-animation-accessibility | Medição e alternativa acessível |
| threejs-architect | setup-threejs-scene, optimize-threejs-scene | Cena e ownership de recursos |
| production-director | write-video-script, create-shot-list | Roteiro/cobertura, áudio, legenda e direitos |
| content-engineer | structure-carousel-progression, write-carousel-content | Progressão e texto do carrossel |
| ad-copywriter | write-ad-copy-variations, create-ugc-script | Variações ou roteiro com prova atribuível |

`task-bindings.json` schemaVersion 1 inclui agentId, command, sourceSha256, taskPath/taskSha256, competencyIds, deliverableIds, requiredCriterionIds e review com locator/rationale/status. Os validadores conferem comandos, hashes, IDs e critérios críticos sem pressupor posição. Os cinco SHA alterados pela frente criativa foram recalculados.

Os casos comprovados de `design-system` (metric), `roadmap-sentinel` (slogans/attribute/status), Hue (manutenção ≠ produto final), arquitetura/Storybook/build e vínculos posicionais de saídas possuem correção ou rejeição explícita. Candidatos não revisados não recebem bindings ativos.

## Limites

Runtime API/CLI aceita `brief`/`--brief` como string de até 4.000 caracteres. Não aceita arquivo de brief. Caminhos canônicos e do bundle permanecem confinados, sem redirecionamento por symlink; comando/ID desconhecido permanece rejeitado. Fonte canônica, story, autoridade, delegação e aprovação continuam superiores ao suplemento.

Conhecimento exige binding exato + competência ligada + consumer. O brief apenas ordena heurísticas já aplicáveis; `estado`, `evidência`, banana e tarefa sem binding não selecionam material genérico. CSS não recebe diagnóstico WebGL pela simples presença dessas palavras. Consulta sem tarefa retorna gap.

Perfil compacto ≤3.000, conhecimento ≤6.000, contexto completo ≤12.000 caracteres de JSON. Critérios obrigatórios permanecem completos; se o conjunto não cabe, a saída contém só ponteiro/gap, `criteriaComplete=false` e todos os IDs em `omittedCriterionIds`. Nunca retém somente os primeiros critérios. Referências emitidas preservam rights, status e locator/hash quando READ.

## Evidência e escopo

Antes da correção: cinco regressões novas falharam, reproduzindo entregável arbitrário, falta de binding/contexto e falsa estrutura de competência. Após correção: coorte focada de expertise/knowledge/runtime/bindings passou 48/48; cinco negativos adicionais verificam orçamento mínimo, hashes, direitos, CSS/especialista e metadata/slogans.

Comandos reproduzíveis: `node scripts/expert-evolution/expertise.cjs validate`; `node node_modules/jest/bin/jest.js tests/unit/expert-evolution-bindings.test.js tests/unit/expert-evolution-expertise.test.js tests/unit/framework-evolution-knowledge.test.js tests/unit/framework-evolution-runtime.test.js --runInBand`. Não usar npm pretest para esta coorte.

Somente execução local/offline, sem credencial, rede paga, instalação pessoal, commit ou publicação. O teste runtime existente sincronizou dois adapters após alterações canônicas da frente criativa; integração e congelamento final pertencem ao root. Fixtures criativas e persistência de mecanismos continuam em frentes próprias.
