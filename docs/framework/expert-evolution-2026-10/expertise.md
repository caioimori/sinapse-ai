# Expertise e curadoria executáveis

Entrega local: 172 perfis canônicos, 17 squads e núcleo separado. São 172 missões
operacionalmente distintas e 512 entregáveis, extraídos de missão, função,
responsabilidades, saídas e tarefas das definições locais. O fingerprint de cada
fonte detecta deriva; declaração canônica não prova capacidade comportamental.

## Perfis e programa de fontes

`expert-profiles.json` contém missão, competências, entregáveis e critérios por
entregável, tarefas exemplares, prioridade, referências, lacunas e estágio atual.
Design/frontend/motion/vídeo/reels/carrosséis têm prioridade P1 e critérios próprios
para estados, acessibilidade, desktop/390px, performance, timing, continuidade,
áudio, marca/produto exatos, sequência e direitos. Só avaliar formato dentro do
escopo do agente: o perfil não transfere autoridade para outra função.

`source-program.json` contém 90 referências: duas READ de seções oficiais React/W3C
com data, locator, trecho capturado e hash; 88 CANDIDATE de autores, livros e docs.
Cada agente possui programa de aquisição com consultas por competência,
entregáveis alvo e próximo passo. Autores são referências de métodos, nunca
identidades adquiridas ou clones comprovados. Candidato não conta como fonte lida.

28 funções prioritárias têm documentos candidatos específicos e critérios observáveis
por entregável: dialog/foco, fronteira client/server, bundle, traces, reduced-motion,
áudio/loudness, ritmo, legendas, safe areas, claims e marca/produto reais.
Os critérios genéricos restantes são ponto de partida e exigem refinamento por domínio.

Todos os perfis continuam `planned`, com lacunas de evidência e avaliação.
Mil horas é horizonte opcional, não meta de ingestão nem volume medido. Não há
alegação de mil horas absorvidas, corpus integral ou melhoria comportamental.

Leituras próprias nesta etapa:
- [React: Thinking in React](https://react.dev/learn/thinking-in-react): hierarquia
  por responsabilidade/dados e construção estática antes da interatividade.
- [W3C: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html):
  movimento não essencial disparado por interação pode ser desativado; escopo AAA.

## API e comandos

Exports: `loadProgram(root?)`, `validateProgram(program,{root}?)`,
`getProfile({root,agentId,maxChars,compact,task})`,
`ingest({root,source,maxSegmentChars,persist})`,
`planUseCase({root,useCaseId,evidenceIds,caseContext,maxChars})`,
`assessPromotion({profile,evaluation,evidence})`.

`getProfile` rejeita ID desconhecido/traversal, contrato inválido ou hash canônico
alterado. Consulta runtime valida contratos/referências globais e apenas o índice/hash
do agente solicitado; o comando validate exige todos os 172 fontes canônicos. O limite é do JSON completo em unidades UTF-16, sem truncar evidência:
default 12.000 chars, teto 64.000. Um perfil que não cabe gera erro explícito.

```powershell
node scripts/expert-evolution/expertise.cjs validate
node scripts/expert-evolution/expertise.cjs profile --agent dx-frontend-engineer
node scripts/expert-evolution/expertise.cjs profile --agent brand-sonic-designer --json
node scripts/expert-evolution/expertise.cjs ingest --input capture.json
node scripts/expert-evolution/expertise.cjs ingest --input capture.json --persist
node scripts/expert-evolution/expertise.cjs plan --use-case squad-design-support --input case.json --json
```

Para runtime, `compact:true` seleciona duas competências e um entregável por ranking
lexical de `task:{command,title,text}` bounded 128/512/4.000 chars. Preserva gaps,
READ/CANDIDATE, autoridade canônica e `validatedExpertise:false`; omissões são explícitas.
Todos os 172 perfis compactos cabem em 3.000 chars nesta versão.

Saída padrão resume perfil/recibo/plano; `--json` entrega o contrato completo.
Ingestão é dry-run por padrão. Somente `--persist` / `persist:true` grava na nova
`research/expert-evolution/library`; nenhuma fonte existente é alterada.

## Captura autorizada e biblioteca

Capture JSON: `id`, `title`, `kind:'text'|'transcript'`,
`provenance:{uri,capturedAt,capturedBy,locator}`,
`rights:{authorized:true,basis,evidence}`, `units:[{text,locator}]`.
`uri` exige HTTPS ou URN explícito. Bases de direitos permitidas: owned, licensed,
public-domain, permission. A declaração e a evidência de direitos são exigidas;
a validação estrutural não certifica juridicamente sua veracidade. Conteúdo público
não é automaticamente autorizado para redistribuição. Não capturar livros integrais
sem direitos claros; sem licença, manter referência candidata e notas factuais.

Transcrições precisam de `startSeconds` e `endSeconds` finitos por unidade e locator
correspondente. Tempo observado é soma de intervalos não sobrepostos informados;
texto comum tem `observedSeconds:null`. Não inferir duração do tamanho do texto.
Segmentos preservam intervalo da unidade, sem interpolar timestamps falsos.

Até 10.000 unidades, 1 milhão de caracteres/unidade, 10 milhões no texto e
12 milhões no JSON completo. Segmentos: default 2.400 caracteres, intervalo
128–6.000; preservar pares Unicode. Cada segmento tem SHA-256 do texto UTF-8,
origens com locator e offsets. Mesmo texto compartilha bloco, conservando todas
as origens. Mesmo ID de fonte com captura diferente falha; recaptura idêntica é
idempotente. Hash não prova verdade nem similaridade semântica.

Persistência usa lock exclusivo e troca atômica do manifesto, sem retries ocultos.
Um escritor ativo bloqueia outro, em vez de perder origens. Symlinks de redireção
são rejeitados. Se um processo morrer, o lock requer inspeção humana; não remover
lock automaticamente. Blocos novos antes de falha podem ficar órfãos recuperáveis;
não se declara captura concluída sem manifesto. Biblioteca mantém conteúdo autorizado
local; ACL, retenção e verificação substantiva de licença continuam responsabilidade
do operador antes da aquisição real.

## Jev: catálogo e planos atômicos offline

`jev-use-cases.json`: 119 casos, sete em cada uma das 17 squads. Routing/triagem,
aplicabilidade, apoio, contradição, dedup semântico, calibração e revisão usam
Choice/Noul/Score, contextualizados ao domínio. Cada plano contém exatamente uma
pergunta/caso, segmentos persistidos identificados, origens e contexto de até
2.000 chars. Evidence IDs: 1–8 únicos. Hash, direitos e locator são conferidos
antes do plano. Contexto JSON completo: default 24.000 chars; o executor anterior
aplica ainda seus limites conservadores de 32k/64k bytes + overhead.

Entrada de `plan`: `{"evidenceIds":["SHA256"],"caseContext":"Uma afirmação ou critério, condição e exceção específicos"}`.
A atomização do caso exige curadoria: o schema não transforma um parágrafo com
várias afirmações em afirmação única. Em dedup, delimitar dois mecanismos.

Reuso de `scripts/framework-evolution/jev.cjs`, modelo `jev-1.13.0`, sempre offline
neste CLI. `called:false` é preparação, nunca execução ou julgamento. Catálogo de
119 oportunidades não é lote autorizado: 119 requests individuais reservariam
US$ 0,319872; o piloto de US$ 0,05 admite até 18 reservas de US$ 0,002688 por
attempt, sem recarga/retry que exceda o teto. Nenhuma API, credencial ou cobrança
foi usada nesta frente. Permissões, contagens, cálculos, licenças, efeitos e teto
continuam no código, nunca no julgamento Jev.

## Evolução e promoção

`assessPromotion` exige duas fontes READ distintas com hash/locator, recibo com
modelo/corpus, held-out, executor/reviewer distintos, resultado positivo e negativo
e evidência dupla por cada competência do perfil. Resultado só indica
`eligibleForReview:true,promoted:false`; não modifica perfil nem corpus.
Declarações no recibo precisam de auditoria independente: um teste estrutural ou
self-score não comprova o benchmark. O revisor confronta artefato, fontes,
contradições, caso negativo e critério por entregável antes de decisão explícita.

## Verificação

12 testes: cobertura 172/17 e programas, diferenciação frontend/áudio, gaps,
referências, hash canônico, budgets completos, ingestão default offline, direitos,
locators, idempotência, dedup entre origens, Unicode, lock, horas observadas,
119 planos atômicos grounded, tamper e promoção por competência. Suites sem rede;
fixtures de conteúdo pertencem ao próprio teste. Estes resultados comprovam
controles locais, não ganho comportamental nem expertise adquirida.
