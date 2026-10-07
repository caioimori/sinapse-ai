---
id: framework-pending-20261007
status: Ready
---
# Corrigir pendências do framework com evidência real

## Status: Ready

## Story
Como operador, quero que as falhas remotas sejam corrigidas na causa e que as pendências de execução, avaliação e mídia tenham provas próprias, sem confundir uma instalação offline com qualidade global demonstrada.

## Authorization
Pedido direto de Caio nesta conversa em 07.10.2026: "arrume um jeito de passar e resolver essas paradas pendentes". Este lote abre a frente de reparos de testes e segurança. Produção, merge, NPM publish, cobranças novas e remoção de conteúdo continuam fora da autorização.

## Scope
Conteúdo-base `0415eac59835bdf450305d37fa3ddd564bb65761`, reaplicado sobre `origin/main` `842eeabc4e9fe39d42f1119c9dc85a8a1e70cbc5`; branch `codex/fix/framework-pending-clean-20261007`. O checkpoint `codex/fix/framework-pending-20261007` permanece preservado. A nova linha evita reincorporar os hashes derivados dos commits anteriores na faixa histórica de segredos, sem reescrever nenhum histórico. Trabalho somente na worktree `framework-pending`; fontes instaladas e históricas permanecem intactas. Testes e fixtures acompanham contratos reais, mantendo negativos de autoridade, orçamento, tamanho e segurança. Código de scripts e exemplos pode receber correções demonstráveis; dependências exigem pesquisa oficial, proveniência, licença e compatibilidade.

Não editar caminhos protegidos, ferramentas compartilhadas, hooks ou configuração de CI. Não remover, pular ou enfraquecer testes nem fazer bypass de alertas. Falsos positivos exigem prova da origem e controles negativos que continuem detectando segredos; nenhuma exceção ampla. Não iniciar build ou suíte local com C: abaixo de 10 GB. Checks remotos existentes são a alternativa pesada; infraestrutura tem freio de 20 minutos.

## Acceptance Criteria
- [ ] Falhas Node24/Windows/Coverage e macOS classificadas individualmente; reparos mantêm assertions de comportamento e segurança; resultados remotos observados por SHA.
- [ ] Alertas de segurança tratados por causa com revisão independente; nenhum alerta ou pacote anunciado resolvido por mera contagem, suppress ou mudança sem prova.
- [ ] Instalação real atual permanece íntegra durante os reparos; nova fonte é aplicada somente por plano CAS, snapshots e readback de ambos os provedores.
- [ ] Execução nativa dos provedores é observada quando acesso e orçamento permitirem; ausência de login ou autoridade é registrada exatamente, sem inventar inferência.
- [ ] Benchmark novo tem protocolo e casos congelados antes das respostas, condições separadas, revisão cega e limites explícitos; resultados não são extrapolados para expertise global.
- [ ] Mídia recebe reprodução e conferência técnica contínuas possíveis; audição/aprovação humana só é marcada com observação humana. Painel final é conferido em 1440/390 sem overflow.
- [ ] Lote termina com validação proporcional, commit/push/PR, prévia e relato de bloqueios restantes; nenhuma publicação em produção.

## File List
- `docs/stories/framework-pending-20261007.story.md`
- `docs/framework/expert-evolution-2026-10/PENDING-CLOSEOUT-SPEC.md`
- `docs/framework/expert-evolution-2026-10/pending-closeout.workflow.json`
- `docs/framework/expert-evolution-2026-10/PENDING-CLOSEOUT-HANDOFF.md`
- `docs/framework/expert-evolution-2026-10/DEPENDENCY-BUNDLE-ADR.md`
- `docs/framework/expert-evolution-2026-10/PENDING-DEPENDENCY-QA.md`
- `docs/framework/expert-evolution-2026-10/PENDING-NATIVE-BENCHMARK.md`
- `docs/framework/expert-evolution-2026-10/PENDING-NATIVE-BENCHMARK.json`
- `scripts/expert-evolution/file-io.cjs`
- `scripts/expert-evolution/expertise.cjs`
- `scripts/expert-evolution/extraction.cjs`
- `scripts/expert-evolution/model-policy.cjs`
- `scripts/expert-evolution/personal-distribution.cjs`
- `scripts/framework-evolution/jev.cjs`
- `scripts/framework-evolution/upstream-audit.cjs`
- `scripts/validate-provider-adapters.js`: paridade entre provedores selecionados, mantendo validação da instalação de um único CLI.
- `bin/lib/framework-evolution-delivery.js`
- `examples/framework-quality/transfer-navigation/index.html`
- `examples/framework-quality/index.html`
- `examples/framework-quality/hub-data.json`
- `docs/framework/expert-evolution-2026-10/typesafe-mobbin-verification.json`
- `docs/framework/expert-evolution-2026-10/navigation-learning.json`
- `research/expert-evolution/jev-pilot.json`
- `research/framework-evolution/plan-batch.json`
- `package.json` e `package-lock.json`
- `vendor/braces-depth-guard/`: fork local, walkers, parser, guard, licença e proveniência sob ownership Devops.
- `vendor/npm-security-refresh/`: fork empacotado de desenvolvimento, identidade própria, origem/deltas e licenças; nenhum npm global modificado.
- `tests/helpers/stream-response.js`
- `tests/unit/expert-evolution-file-io.test.js`
- `tests/installer/codex-native-clean-install.test.js`
- `tests/installer/dual-cli-clean-install.test.js`
- `tests/scripts/validate-article-vii.test.js`
- `tests/unit/cross-provider-operational.test.js`
- `tests/unit/expert-evolution-catalog.test.js`
- `tests/unit/expert-evolution-integration.test.js`
- `tests/unit/expert-evolution-persistent-learning.test.js`
- `tests/unit/framework-evolution-delivery.test.js`
- `tests/unit/framework-evolution-knowledge.test.js`
- `tests/unit/framework-evolution-reliability.test.js`
- `tests/unit/project-expert-context.test.js`
- `tests/unit/framework-evolution-upstream.test.js`
- `tests/unit/personal-distribution.test.js`
- `tests/unit/expert-evolution-expertise.test.js`
- `tests/unit/expert-evolution-model-policy.test.js`
- `tests/unit/expertise-security-hardening.test.js`: provas de troca de pais interceptam a aquisição atual por descritor.
- `tests/unit/npm-security-refresh.test.js`: identidade, bytes e APIs do bundle efetivamente instalado, CLI com configuração própria e rede desabilitada.
- `.sinapse-ai/data/entity-registry.yaml` e `.sinapse-ai/install-manifest.yaml`: metadados derivados pelos hooks normais, conferidos pelo Devops.

Os 650 paths herdados do conteúdo `0415` são registrados na transição de branch e nas stories de evolução anteriores; nenhum deles foi removido. Receipts, logs, rótulos cegos, respostas e acervo privado permanecem em `examples/framework-quality/output/pending-20261007/`, ignorados e fora do Git.

## Rollback
Reverter apenas o lote novo pela branch/PR; manter fontes históricas e instalação `104c516d` íntegra até nova CAS. Qualquer instalação nova deve conservar journal e snapshots e ser recuperável sem modificar uma fonte já instalada.
