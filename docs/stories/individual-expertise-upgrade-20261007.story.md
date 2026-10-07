---
id: individual-expertise-upgrade-20261007
type: enhancement
status: Done
owner: caio
executor: developer
quality_gate: quality-gate
quality_gate_tools: [node, jest, eslint]
created: 2026-10-07
epic: docs/framework/expert-evolution-2026-10/PLAN.md
---

# Aprimorar todos os agentes por competência e evidência

## Status

Done

## Story

Como mantenedor, quero aprofundar cada agente e testar suas decisões com casos específicos para usar conhecimento aprovado nos dois provedores.

## Scope

Perfis individuais, fontes primárias observadas, mecanismos/contextos, tarefas próprias, casos com outputs e revisão independente, recuperação seletiva, distribuição compartilhada e prévia/PR. Preservar fonte instalada e trabalho concorrente. Sem produção, remoção funcional, compra, API Anthropic ou extrapolação de créditos Jev.

## Acceptance Criteria

- [x] AC1 — Given os 172 IDs canônicos, When os perfis forem revisados individualmente, Then todos terão mecanismos, critérios e exceções específicos ou lacuna material identificada sem promoção automática.
- [x] AC2 — Given as fontes, When forem incorporadas, Then direitos, locator, trecho observado, inferências e candidatas serão distinguíveis e verificáveis.
- [x] AC3 — Given casos diagnósticos novos, When as coortes produzirem respostas, Then outputs, revisão independente, negativos e limites de inferência nativa estarão registrados por agente; casos da mesma coorte não serão chamados de avaliação cega ou execução isolada.
- [x] AC4 — Given a integração compartilhada, When contexto for recuperado nos dois provedores, Then fontes autorizadas, autoridade, paridade e limites 12.000/6.000/3.000 passarão sem perda crítica.
- [x] AC5 — Given orçamento e concorrência, When entrega/upgrade forem feitos, Then custos, CAS/rollback, original/fonte anterior, secrets/protected e checks proporcionais terão evidência; PR/prévia não significarão produção.

## Tasks

- [x] Pesquisar e aprofundar cada função em três coortes.
- [x] Integrar perfis/fontes e construir avaliação verificável.
- [x] Executar casos e revisão independente.
- [x] Validar recuperação/distribuição e preservação.
- [x] Salvar, enviar branch, abrir PR e conferir prévia.

## File List

- package.json
- .codex/catalog.json
- README.md
- README.en.md
- docs/agent-reference-guide.md
- docs/pt/agent-reference-guide.md
- docs/guides/ide-integration.md
- docs/stories/individual-expertise-upgrade-20261007.story.md
- docs/framework/expert-evolution-2026-10/EXPERTISE-UPGRADE-SPEC.md
- docs/framework/expert-evolution-2026-10/expertise-upgrade-workflow.json
- docs/framework/expert-evolution-2026-10/EXPERTISE-UPGRADE-HANDOFF.md
- docs/framework/expert-evolution-2026-10/EXPERTISE-RUNTIME-INTEGRATION-QA.md
- docs/framework/expert-evolution-2026-10/expertise-upgrade-adr.md
- docs/framework/expert-evolution-2026-10/CLOSEOUT-VERIFICATION.md
- docs/framework/expert-evolution-2026-10/HANDOFF.md
- docs/framework/expert-evolution-2026-10/PLAN.md
- research/expert-evolution/competence-packs/creative.json
- research/expert-evolution/competence-packs/business.json
- research/expert-evolution/competence-packs/knowledge.json
- research/expert-evolution/competence-review.json
- research/expert-evolution/competence-runtime.json
- research/expert-evolution/expert-profiles.json
- research/expert-evolution/source-program.json
- research/expert-evolution/task-bindings.json
- scripts/expert-evolution/competence.cjs
- scripts/expert-evolution/expertise.cjs
- scripts/framework-evolution/project-expert-upgrade.cjs
- scripts/framework-evolution/project-expert-install.cjs
- scripts/framework-evolution/project-expert.cjs
- scripts/framework-evolution/runtime.cjs
- tests/unit/expert-evolution-competence.test.js
- tests/unit/expert-evolution-expertise.test.js
- tests/unit/operational-contracts.test.js
- tests/unit/project-expert-context.test.js
- examples/framework-quality/hub-data.json
- examples/framework-quality/hub.js
- examples/framework-quality/index.html
- examples/framework-quality/verify-hub.cjs
- examples/framework-quality/contract-builder/UI-CONTRACT.md
- examples/framework-quality/contract-builder/index.html
- examples/framework-quality/contract-builder/styles.css
- examples/framework-quality/contract-builder/model.js
- examples/framework-quality/contract-builder/app.js
- examples/framework-quality/contract-builder/model.test.cjs
- examples/framework-quality/contract-builder/verify.cjs
- examples/framework-quality/contract-builder/README.md

## Dev Agent Record

Retomada YOLO autorizada. Esforço high, três frentes independentes, checkpoints privados e nenhuma promoção por quantidade.

## QA Results

CI no HEAD `2600dc51` encontrou Article VII vermelho por cinco docs desatualizados. Confirmados fora dos pins, contagens/skills corrigidas e validação focal integral PASS. Compatibility Parity 34/33 foi corrigido adicionando somente `sinapse-project-expert` ao metadado `.codex/catalog.json.expectedSkillIds`, fora dos pins; integração e paridade completa focal PASS, vínculos vivos preservados.

Security Audit permanece registrado (quatro HIGH de braces e dependentes); follow-ups/donos estão no handoff. Nenhum bypass, atualização forçada de dependências ou alteração de CI/runtime congelado. Nova CI e demais checks não foram aprovados integralmente.

Conferência focal final do link/status PR #416 em 1440/390 px: métricas 172/409, 17 squads, cinco exemplos e zero overflow. Receipt privado `hub-final-delivery/receipt.json`, SHA `1a99b02ec0a2df3ba7be30170d503b66d984c675e14888ebdce390118b663485`; não é replay dos 29 checks anteriores. As baterias 124 e 32 de Jest se sobrepõem e não devem ser somadas.

Revisão semântica independente ciclo 3: 172 PASS diagnósticos, zero REVISE/BLOCKED. Três coortes Codex/Sol 6.1/high produziram os casos e respostas; sem avaliação cega, 172 personas isoladas, inferência Claude/Opus ou ganho causal. `validatedExpertise=false` preservado.

Matriz local final: 172 agentes, critérios completos; máximos 11.602/5.990/2.997 caracteres. Testes focais finais: 124 PASS, zero FAIL, um skip declarado, cinco suítes PASS. O skip evita repetir a matriz histórica redundante; a matriz completa atual passou. Paridade de adapters 172 agentes/38 skills, registry 9/66, manifest e workflow passaram. Scan de 611 arquivos: zero achados; nenhum caminho protegido, exclusão funcional ou input privado no diff.

Hook real `validate:all`: primeira execução com sete referências editoriais; correção preservou fatos e atribuição técnica, nova execução 13/13 PASS. Metadados da story passaram. Sem alteração nos validators/hooks nem bypass.

UI local: revisão manual 1440/390 sem overflow e confirmação focal de Desfazer no hash final. Cinco testes do compilador e 13 checks browser anteriores têm hashes/limites no README; não provam replay integral do byte final.

A metadata `projectLink` produziu 12.294 caracteres no caso animation-performance-engineer; gateway reparado e regressão 32/32 PASS. A matriz instalada em HOME scratch passou 172/172 com máximos 11.865/5.990/2.997. Gateway final SHA `bd730caa879cede501c633eb48ec903a5707e35dad002c0abc06db58c388fb39`, owner congelado; a matriz raw anterior não substitui essa prova.

CAS pessoal concluído, transaction `f5c05992-6d24-4c26-928c-9c78d1a61a08`, sourceHead `5f4b7e410fd88d717be0ee84fc0124a24caa7699`. Readback HOME real: 42 contextos selecionados nos dois projetos, critérios/vetos/autoridade completos, máximos 11.745/5.611/2.969; os dois provedores usam entradas byte-iguais. Quatro negativos reais rejeitaram ID/comando desconhecidos, hash antigo e projeto não vinculado. Recuperação offline, sem inferência nativa Claude ou replay real dos 172.

Preservação: 262/262 payloads pessoais iguais; fonte anterior clean no HEAD `8fe3b90b` e seus 2.092 pins preservados; original mantém 193 entradas sujas, com somente as duas skills compiladas autorizadas atualizadas. Nove destinos CAS e rollback por journal/snapshots verificados; o upgrade bem-sucedido não foi revertido. Receipts privados `real-upgrade-plan.json`, `real-upgrade-receipt.json` e `devops-real-readback.json`.

Embalagem corrigida somente na allowlist `package.json.files`, que não integra os pins vivos: `competence-runtime.json` incluído. Inspeção `npm pack --dry-run --ignore-scripts --json` encontrou os seis módulos/dados exigidos e zero packs diagnósticos, review, library, output ou captures privados; 4.508 arquivos. Verificação focal do inventário e vínculo vivo passou. Lifecycle não executado, nenhum pacote publicado.

Prévia final local do hub: 29 checks, zero falhas, 1440/390/320 px sem overflow; receipt SHA `6726f5ead82047cd371e32c9b878668ad529ade64ed2c35adebc9a2ded069104`. Branch enviada e [PR #416](https://github.com/caioimori/sinapse-ai/pull/416) aberto/anexado; leitura posterior confirmou estado OPEN, base main, branch correta e igualdade entre HEAD local/remoto/PR. Hooks reais passaram sem bypass; CI/CodeQL iniciados, sem aprovação geral alegada.

Scan final da evolução total (incluindo 12 commits prévios autorizados): 639 caminhos alterados, 619 arquivos de texto escaneados, zero segredos/caminhos protegidos/inputs privados/exclusões. Vermelhos intermediários permanecem privados; suíte integral e CI completa não condicionaram o nível 1 autorizado. Nenhum merge, npm publish, produção, compra ou remoção funcional. Story Done cobre o lote delimitado; expertise global, inferência nativa e ganho causal continuam sem comprovação.
