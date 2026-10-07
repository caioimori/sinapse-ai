# Verificação da execução auditada

Estado: **implementação local e coorte integrada aprovadas; revisão audiovisual integral limitada**. O [plano corrigido](PLAN.md), [contrato](AUDITED-SPEC.md), [auditorias](audit-strategy.md) e [parecer independente](audited-quality-review.md) distinguem resultado observado, candidato e lacuna.

## Resultado por fronteira

| Fronteira | Resultado observado | Limite |
|---|---|---|
| Contratos | 172 perfis preservados; sete funções e 18 comandos com bindings semânticos revisados | Demais declarações/candidatos preservados; zero expertise promovida |
| Contexto | Comando exato e briefing delimitado; critérios necessários completos ou gap; negativos genéricos rejeitados | Perfil ≤3.000, knowledge ≤6.000 e JSON ≤12.000 caracteres; montagem offline |
| Extração | Ledger/cache duráveis; single-flight por payload e admissão semântica antes do transporte | Falha/crash/cobrança incerta bloqueiam retry; zero API real ou custo |
| Bundle | Journal, readback, CAS/recovery e preservação de edição concorrente | Fixtures de projeto/global; nenhuma instalação no perfil pessoal |
| Instalação global | 18 bindings resolvem com seus 17 arquivos reais; idempotência zero | HOME temporário com espaços, pacote hermético e dependências interceptadas |
| Modelos | Receipt tipado com validade/hash, relógio/escopo e gate de observações reais | Disponibilidade de Sol não significa superioridade; Opus/Jev não executados |
| Navegação | Cinco entradas por entregável: frontend, motion, Reel, carrossel e anúncio | Trilha canônica; não comprova expertise ou cria aquisição |
| Aprendizagem | Captura → candidato → review independente → overlay privado CAS → recuperação offline | Transferência e promoção continuam separadas da fixture técnica |
| Organização | Fontes e caminhos preservados; índices e adapters atualizados | Nenhuma remoção, migração física ou substituição do core |

O corpus público permanece com 67 fontes e 112 heurísticas, sem cobertura integral promovida para qualquer agente. A biblioteca local é separada: material próprio, direitos/origem, revisão tipada e hash são exigidos antes da recuperação.

Consolidação local observada após a coorte: uma entrada adicionada; repetição adicionou zero. Overlay SHA-256 `114ebab8d7c3176e448484deba880eb5b8580f354ecf63a5f9cb15ba3e64e531`; review independente e três observações foram relidos. Evidência limitada à decisão técnica pura de origem retida, sem comprovar DOM ou expertise.

Runtime `dx-frontend-engineer:implement-responsive-layouts` recuperou `curated-owned-retained-origin-technical`, contexto 8.534/12.000 e knowledge 4.294/6.000. Outro comando não recebeu o mecanismo; comando sem binding retornou zero itens. Três hashes públicos permanecem iguais, 172 perfis planned/gap e zero chamada de rede/Jev.

## Produto observado

Marca fictícia Lume, assets geométricos e trilha de osciladores próprios. Fontes editáveis em [examples/framework-quality](../../../examples/framework-quality/README.md); preview em `http://127.0.0.1:4179/` enquanto o servidor local estiver ativo.

| Artefato | Prova | Julgamento independente de IA |
|---|---|---|
| UI | 23 checks compartilhados com motion; 1440/390/320, busca, vazio/erro, diálogo/foco/Escape, mudança/undo e zero overflow | 91/100 nos pixels/estados inspecionados |
| Motion web | Normal/reduced, pausa/interrupção/reset, mudança de preferência em runtime e dez ciclos de lifecycle por modo | 91/100 somente em amostras/estados; reprodução contínua não observada |
| Carrossel | Cinco PNGs 1080×1350, SVGs editáveis, prévia 390 e equivalente textual | Tentativa 001: 89; tentativa 002: 91, preservando o histórico |
| Reel | MP4 1080×1920, 18 s, 30 fps/540 frames, áudio próprio, VTT e 18 frames decodificados | Nota total null; apenas amostras visuais avaliadas |

QA técnico de mídia: quatro checks do navegador em 1440/390 e sete probes do servidor. Traces locais de motion não observaram tarefa >50 ms na sequência; encoding de WebM não mede FPS de display, GPU mobile ou métricas de campo.

O canal de áudio informou literalmente `audio content omitted because you do not support audio input`. RMS/pico/codec/decode não provam escuta. Áudio e ritmo audiovisual integral permanecem **CONCERNS**, sem aprovação humana ou de cliente.

Receipts de render foram preservados. As correções acessíveis e posteriores comentários/vírgulas possuem emenda separada; QA recalculou quatro ASTs equivalentes, fontes atuais, outputs e cinco receipts históricos sem mismatch. Somente outputs gerados estão excluídos do lint; fontes editáveis continuam verificadas.

## Gates e reprodução

Coorte integrada final: **18/18 suites, 229/229 testes, zero falha, 127,289 s**. Receipt ignorado: `examples/framework-quality/output/verification/integrated-tests.json`, SHA-256 `766fe031d0a455f3603d437dd8796fc79a2ac639d219385fe68053502c15ad4d`.

```powershell
node node_modules/jest/bin/jest.js tests/unit/framework-evolution-upstream.test.js tests/unit/framework-evolution-runtime.test.js tests/unit/framework-evolution-knowledge.test.js tests/unit/framework-evolution-delivery.test.js tests/unit/global-provider-adapters.test.js tests/unit/sync-codex-native.test.js tests/unit/validate-codex-native.test.js tests/unit/codex-native-runtime.test.js tests/unit/sync-provider-adapters.test.js tests/installer/sinapse-ai-installer.test.js tests/unit/expert-evolution-expertise.test.js tests/unit/expert-evolution-catalog.test.js tests/unit/expert-evolution-model-policy.test.js tests/unit/expert-evolution-integration.test.js tests/unit/expert-evolution-bindings.test.js tests/unit/framework-evolution-reliability.test.js tests/unit/expert-evolution-persistent-learning.test.js tests/unit/expert-evolution-observed-review.test.js --runInBand --silent
npm run lint
npm run typecheck
npm run validate:parity
npm run validate:squad-schema:strict
node scripts/expert-evolution/expertise.cjs validate --json
node scripts/framework-evolution/knowledge.cjs validate --json
node scripts/expert-evolution/model-policy.cjs validate
node scripts/expert-evolution/catalog.cjs validate --refresh
node scripts/framework-evolution/upstream-audit.cjs --gate .
```

Jest direto evita o `pretest` que regeneraria fontes protegidas. Lint/typecheck separados passaram. Paridade: 172 agentes, 37 skills por provider, 18 orquestradores; 17/17 manifests YAML válidos. Não existe script de build; build e CI remoto não foram executados.

O guard de proveniência recebeu uma exceção exata para o receipt de versão/SHA/URLs, conservando verificações de persona e caminhos de produto. Sua suite adicional passou **27/27 testes** em 14,728 s; não é somada à coorte principal como medida de qualidade.

Arquitetura, story Ready anterior ao código, dez ACs Given/When/Then, manifest, documentação de instalação, segredos staged, protected guard, proveniência, dados pessoais e diff-check foram verificados. O guard de segredos não expôs credenciais. Links locais e estado final são relidos no checkpoint.

Readback final: 153 links em 22 documentos locais, zero destino ausente; proveniência/dados pessoais cobriram 5.177 arquivos rastreados. Receipts finais de privacidade/preservação possuem arquivos próprios, conservando os snapshots históricos fixados pelo QA.

## Falhas expostas e resolvidas

A primeira coorte teve 223/225 aprovados: target `create-ugc-script` ausente no bundle global e contagem antiga na integração. A correção copiou os targets reais e tornou a fixture hermética, mantendo resolução estrita e idempotência zero. A coorte final passou sem filtros.

QA reproduziu aceitação indevida de documento genérico/autor equivalente na promoção. O gate agora exige identidades normalizadas, dados tipados e observações positivas, negativas e de conflito resolvíveis por hash. O mesmo repro foi rejeitado após a correção.

Payloads diferentes da mesma tupla semântica podiam chegar ao transporte. Write-ahead `transport-admitted` antes do await e CAS posterior corrigiram o defeito; quatro regressões passaram independentemente, incluindo queda real de processo e restart. Nenhuma chamada real foi usada.

Lint inicial encontrou 56 erros e dois avisos em callbacks de browser. Declarações de globais e duas vírgulas resolveram as fontes; snapshots em outputs foram excluídos como dados derivados, preservando o lint das fontes. EOFs das auditorias foram normalizados.

## Preservação e distribuição

Readback do checkout original: mesma branch/SHA, 191 entradas e zero divergência de bytes/status. Diff contra o começo desta auditoria e contra a base da evolução: zero path protegido. Nenhuma fonte funcional foi apagada, movida ou renomeada.

`npm pack --dry-run --json --ignore-scripts` final, após a consolidação privada, observou 4.411 arquivos, nove targets adicionais críticos e zero arquivo privado/output. Nenhum tar foi criado, publicado ou instalado. Fixtures editáveis pertencem ao repositório; mídia/receipts permanecem locais.

A spec recebeu somente uma troca de nomenclatura na decisão de arquitetura para higiene de autoria. ASRs, briefs e rubrica permanecem congelados. A story passou de Ready validado antes do código para InReview com evidências, preservando a pendência audiovisual/humana.

Upstream público foi reconsultado em 2026-10-02: release v5.4.1 e SHA `4ef6530ff03b83aea953e4a426f95e012b8b70c5` continuam os mesmos. [Receipt de leitura](../../../research/expert-evolution/audit-upstream-recheck.json). Snapshot anterior de 3.022 arquivos preservado; integrações proprietárias e core protegido não foram importados integralmente.

## Limites e expansão

Nenhuma fixture sintética demonstra ganho causal, retorno comercial, mil horas absorvidas ou especialização mundial. Os 172 perfis continuam planejados; sete funções revisadas não representam as demais. O benchmark escrito anterior é histórico/regressão, sem comparação visual causal.

Jev continua com piloto autorizado de até US$ 0,05 e uma tentativa por grupo, sem credencial observada e sem gasto. Opus 5.5 permanece candidato sem execução autenticada. Próximos modelos precisam de acesso, artefatos reservados e rollback antes de promoção.

Expandir somente quando uma falha observada justificar nova aquisição, mantendo três famílias ativas, direitos/locator/versão e teste de transferência. Áudio/reprodução contínua exigem observação em capacidade compatível. Estado atual e próximos comandos estão no [handoff](HANDOFF.md).
