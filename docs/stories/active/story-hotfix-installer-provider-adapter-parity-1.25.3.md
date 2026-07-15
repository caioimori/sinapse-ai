---
status: InReview
owner: sprint-lead
executor: developer
quality_gate: quality-gate
quality_gate_tools:
  - npm
  - node
  - isolated-registry-install
created: 2026-07-15
severity: blocker
target_release: 1.25.3
---

# Story: Hotfix de paridade dos adapters no installer 1.25.3

## User story

Como mantenedor do SINAPSE, quero que o installer diferencie agentes canonicos
de aliases intencionais durante a validacao de paridade, para que instalacoes
limpas e atualizacoes pelo registry concluam sem inflar o catalogo e preservem
as superficies nativas de Claude Code e Codex.

## Evidencia do bloqueador

Em ambiente isolado e sem instalacao anterior, o pacote publico falha com:

```text
npx --yes sinapse-ai@1.25.2 install --yes
Provider adapter parity failed (Claude Code: 172/175)
```

Antes do abort, o staging contem 175 command files. O diagnostico confirmou que
172 representam agentes canonicos e os tres extras sao aliases intencionais:
`sinapse`, `sinapse-orqx` e `snps`. O entrypoint canonico correspondente e
`snps-orqx`; os aliases sao preservados pelas skills. A funcao
`deliverGlobalProviderAdapters()` ja exclui corretamente os tres aliases da
entrega de adapters de agentes.

O defeito esta no gate do installer, que compara superficies semanticamente
distintas como se todos os command files fossem agentes. O contrato correto e
172 agentes canonicos em cada provider, mais os tres aliases resolviveis via
skills, sem criar adapters artificiais e sem alterar as metricas do Article VII.
O ID publico de adapter e ativacao e `sinapse-orqx`; sua definicao e tarefas sao
sempre carregadas do ID de fonte canonico `snps-orqx`. O runtime deve expressar
essa relacao por `SUPREME_PUBLIC_ID` e `SUPREME_ORCHESTRATOR_ID`, respectivamente,
sem listas ou targets literais divergentes.

## Dependencias e contexto tecnico

- Esta e uma hotfix autonoma, motivada pelo artefato publico `sinapse-ai@1.25.2`;
  nao depende de outra story, mas depende de acesso ao tarball e ao registry para
  reproduzir o defeito e comprovar a correcao fora do checkout.
- `bin/lib/provider-parity.js` contem o gate que deve comparar as superficies
  semanticas e permanecer fail-closed.
- `bin/lib/global-provider-adapters.js` ja separa os tres aliases antes de
  entregar adapters canonicos; essa classificacao e a fonte de comportamento a
  preservar, nao uma autorizacao para duplicar uma lista divergente.
- `bin/commands/install.js` e `bin/commands/update.js` sao os pontos de chamada
  do gate para instalacao limpa e atualizacao.
- `tests/unit/provider-adapter-parity.test.js` e
  `tests/unit/global-provider-adapters.test.js` sao as suites focadas existentes;
  os smokes de tarball e registry complementam os testes unitarios.
- Nao ha nova API publica, modelo de dados ou variavel de ambiente. A estrutura
  relevante e a classificacao do inventario em `canonicalAgents` (172) e
  `intentionalAliases` (`sinapse`, `sinapse-orqx`, `snps`), cujas skills devem
  resolver para o entrypoint canonico `snps-orqx`.

## Escopo

- Reproduzir a falha usando exatamente o pacote `sinapse-ai@1.25.2` em ambiente
  temporario isolado.
- Registrar os tres command files extras como aliases intencionais e comprovar
  sua resolucao via skills para o entrypoint canonico `snps-orqx`.
- Corrigir o gate do installer para comparar somente os 172 agentes canonicos
  por provider e validar os aliases em sua superficie propria.
- Preservar os catalogos e as sintaxes nativas de Claude Code e Codex.
- Validar clean install e upgrade pelo registry e publicar o patch `1.25.3`
  somente depois do Quality Gate.

## Acceptance criteria

- [x] **AC1 - Reproducao comprovada.** Given um HOME temporario sem SINAPSE,
  when `npx --yes sinapse-ai@1.25.2 install --yes` roda, then a evidencia registra
  os 175 command files, os 172 adapters Claude Code e a falha de paridade, sem
  depender do checkout local.
- [x] **AC2 - Classificacao semantica comprovada.** Given o inventario canonico
  e o tarball `1.25.2`, when os 175 command files de staging sao classificados,
  then 172 correspondem a agentes canonicos e os tres extras sao exatamente
  `sinapse`, `sinapse-orqx` e `snps`, todos aliases intencionais resolviveis via
  skills para o entrypoint canonico `snps-orqx`.
- [x] **AC3 - Paridade corrigida sem inflar o catalogo.** Given o pacote
  candidato, when o gate do installer roda, then valida exatamente 172 agentes
  canonicos no Claude Code e 172 no Codex, valida separadamente os tres aliases
  via skills, nao exige adapters de agente para aliases e continua fail-closed
  para agente canonico ausente, orfao ou duplicado, alias ausente ou apontando
  para entrypoint incorreto, e adapter extra criado a partir de alias.
- [x] **AC4 - Claude Code preservado.** Given uma instalacao limpa e uma
  atualizacao, when agents, commands, skills e hooks Claude Code sao resolvidos,
  then os 172 adapters canonicos e os tres aliases via skills funcionam a partir
  das fontes canonicas, sem adapters artificiais, artefatos ausentes ou
  sobrescrita de customizacoes.
- [x] **AC5 - Codex preservado.** Given os mesmos cenarios, when agents TOML,
  skills `$`, aliases e lifecycle events Codex sao resolvidos, then o catalogo
  permanece completo, sem regressao, duplicidade ou dependencia dos adapters
  Claude Code.
- [ ] **AC6 - Clean install e upgrade reais.** Given diretorios temporarios fora
  do repositorio, when o candidato e instalado do tarball e depois `1.25.3` e
  instalado/atualizado diretamente do npm registry, then clean install e upgrade
  concluem com exit code zero, passam a paridade e sao idempotentes na segunda
  execucao.
- [x] **AC7 - Verdade do pacote.** Given `npm pack`, when o tarball e
  inspecionado e executado isoladamente, then contem 172 adapters canonicos por
  provider e as skills que preservam os tres aliases, sem adapters de agente
  extras, targets ausentes, dependencia de arquivos excluidos ou estado global.
- [x] **AC8 - Boundary e qualidade.** Given o diff e a suite final, when lint,
  typecheck, testes focados, paridade, package inspection e smokes isolados
  rodam, then todos passam, as metricas do Article VII permanecem 172 agentes
  canonicos por provider e nenhum path protegido L1/L2, constituicao,
  infraestrutura protegida ou `bin/sinapse*.js` foi alterado.
- [ ] **AC9 - Release 1.25.3 verificavel.** Given AC1-AC8 e Quality Gate em PASS,
  when `@devops` publica o patch autorizado, then `npm view sinapse-ai version`
  retorna `1.25.3`, a integridade publica e registrada e smokes de clean install
  e upgrade executados do registry passam para Claude Code e Codex.

## Tasks

- [x] Reproduzir e classificar o defeito publico `172/175`.
- [x] Separar catálogo canonico, aliases publicos e proveniencia sem colapso.
- [x] Validar conteúdo canônico das skills Claude Code e Codex.
- [x] Endurecer writes e deletes globais contra symlink/junction/TOCTOU.
- [x] Cobrir install, update, providers isolados, pacote e boundary.
- [x] Executar lint, typecheck, testes focados e validadores de paridade.
- [ ] Publicar `1.25.3` via semantic-release depois do merge e fechar AC9 com
  smokes do registry.

## Fora de escopo

- Tratar os 175 command files de staging como 175 agentes canonicos.
- Criar adapters de agente para `sinapse`, `sinapse-orqx` ou `snps`.
- Remover aliases intencionais ou alterar o entrypoint canonico `snps-orqx`.
- Inflar ou redefinir as contagens do Article VII para acomodar aliases.
- Desabilitar, relaxar ou converter o gate de paridade em warning.
- Reescrever agents, personas, tasks, workflows ou authorities canonicos.
- Alterar `.sinapse-ai/core/**`, `.sinapse-ai/constitution.md`,
  `.sinapse-ai/development/{tasks,templates,checklists,workflows}/`,
  `.sinapse-ai/infrastructure/**` ou `bin/sinapse*.js`.
- Incluir melhorias nao relacionadas ao bloqueador no patch `1.25.3`.

## Evidencias obrigatorias

1. reproducao isolada do erro publico em `1.25.2`;
2. tabela classificando os 172 agentes e os tres aliases, com skill e entrypoint;
3. comparativo antes/depois dos catalogos Claude Code e Codex, ambos em 172;
4. conteudo do tarball candidato e smokes isolados de clean install e upgrade;
5. comprovacao de zero diff nos paths protegidos;
6. versao e integridade de `sinapse-ai@1.25.3` verificadas no registry.

## CodeRabbit Integration

- **Story type:** Integration (primario), Deployment/Release (secundario),
  complexidade STANDARD por alterar um gate compartilhado por install e update.
- **Specialized agents:** `@developer` implementa e executa o pre-commit;
  `@quality-gate` revisa contrato, testes e evidencias; `@devops` detem autoridade
  exclusiva de pre-PR, merge, publicacao e smoke do registry.
- **Pre-commit gate:** testes unitarios focados, validadores de paridade,
  inspecao do tarball e verificacao de zero diff nos paths protegidos.
- **Pre-PR gate:** lint, typecheck, suite aplicavel, build/package inspection,
  CodeRabbit sem issue CRITICAL aberta e smokes isolados do candidato.
- **Pre-deployment gate:** AC1-AC8 e Quality Gate em PASS antes de publicar;
  versao, integridade, clean install e upgrade do registry depois da publicacao.
- **Self-healing:** `@developer` em modo light, no maximo 2 iteracoes ou 15
  minutos, somente para issues CRITICAL; issues fora desse limite retornam ao
  `@quality-gate` e nao autorizam relaxar a paridade. `@quality-gate` pode usar
  modo full, no maximo 3 iteracoes ou 30 minutos, para CRITICAL e HIGH.
- **Focus areas:** classificacao canonico/alias, invariantes fail-closed,
  independencia entre providers, idempotencia, conteudo real do pacote,
  preservacao de customizacoes e autoridade exclusiva de release.

## Definition of done

- AC1-AC8 cobertos por testes ou evidencias deterministicas.
- Clean install e upgrade isolados concluem sem o erro `172/175`.
- Claude Code e Codex mantem 172 agentes canonicos completos e resolviveis.
- `sinapse`, `sinapse-orqx` e `snps` permanecem resolviveis via skills para
  `snps-orqx`, sem serem contados como agentes adicionais.
- Quality Gate em PASS e zero alteracao nos paths protegidos.
- Publicacao e smoke do registry executados exclusivamente por `@devops`.

## Handoff

Story checklist concluido; pronta para implementacao por `@developer`:

```text
@developer *develop docs/stories/active/story-hotfix-installer-provider-adapter-parity-1.25.3.md
```

## Validation record

- Date: 2026-07-15
- Validator: `@sprint-lead` (story checklist)
- Verdict: **PASS - Ready for implementation**
- Traceability: PASS - o bloqueador publico `172/175` e reproduzivel no registry
  e o diagnostico identifica precisamente a diferenca entre agentes e aliases.
- Scope: PASS - a hotfix corrige somente o gate sem alterar geracao canonica,
  catalogos, aliases, personas, tasks ou Article VII.
- Testability: PASS - os ACs exigem contagens separadas, resolucao dos aliases,
  tarball isolado, clean install, upgrade e regressao fail-closed.
- Provider parity: PASS - o contrato esperado e 172 agentes por provider; os
  tres aliases sao validados via skills e nao como adapters de agentes.
- Safety: PASS - nenhuma remocao, migracao destrutiva, relaxamento do gate ou
  alteracao de customizacao esta autorizada.
- Boundary: PASS - todos os paths protegidos estao explicitamente fora do
  escopo e devem permanecer sem diff.
- Authority: PASS - implementacao pertence a `@developer`, Quality Gate a
  `@quality-gate` e PR, merge e release exclusivamente a `@devops`.

## Dev Agent Record

### Agent Model Used

- Codex, persona `@developer` (Pixel)

### Debug Log References

- Catalog diff: 175 staging files versus 172 native Codex agents; extras were
  exactly `sinapse`, `sinapse-orqx` and `snps`.
- Focused regression suite: 44/44 tests passed.
- Publish safety pre-release result: expected FAIL after package, dependency and
  secret gates passed, because checkout `1.25.1` is not newer than npm latest
  `1.25.2`; semantic-release owns the post-merge `1.25.3` bump.
- Isolated tarball smoke: clean and upgrade passed for `claude-code`, `codex`
  and `both` with 172 native adapters per selected provider and three aliases.

### Completion Notes List

- Split generated command files into canonical agents and alias entrypoints,
  retaining ID-to-origin provenance and rejecting duplicates before staging is
  cleared or written.
- Hardened parity to fail on count, identity, duplicate, orphan and missing
  adapter drift, while validating alias availability through provider skills.
- Preserved user-owned skills by distinguishing written skills from valid
  available skills; custom collisions are never overwritten, and only exact
  canonical content can satisfy parity.
- Reused one deterministic alias source, derived from the supreme orchestrator
  ID, across generation, rendering, delivery and parity validation.
- Hardened global publication against symlink/junction races with unpredictable
  temporary names, an open parent-directory binding, identity revalidation
  immediately before and after publish, and exclusive publication for fresh
  skills. A deterministic race regression proves zero writes outside HOME.
- Applied the same bound-parent and file-identity checks to stale managed-agent
  removal, residual Codex Markdown removal and temporary cleanup; deterministic
  directory-swap tests prove external files are never deleted.
- `validate:publish` is expected to reject this pre-release checkout because
  local `1.25.1` is behind registry `1.25.2`. No manual version bump is part of
  this diff: semantic-release produces `1.25.3` after merge, and registry smokes
  close AC9.
- Typecheck, lint, Article VII, provider validation, tarball inspection and
  protected-boundary checks passed.

### File List

- `bin/commands/install.js`
- `bin/commands/update.js`
- `bin/lib/command-generator.js`
- `bin/lib/global-provider-adapters.js`
- `bin/lib/provider-contract.js`
- `bin/lib/provider-parity.js`
- `tests/installer/update-upsert.test.js`
- `tests/unit/global-provider-adapters.test.js`
- `tests/unit/provider-adapter-parity.test.js`

### Change Log

- 2026-07-15: Implemented and validated the installer provider-parity hotfix.

### Product Owner validation

- Date: 2026-07-15
- Validator: `@product-lead` (10-point story validation)
- Verdict: **PASS - Ready for implementation**
- Goal and context: PASS - hotfix, valor operacional e dependencia do artefato
  publico `1.25.2` estao explicitos.
- Technical guidance: PASS - gate, classificador, call sites e suites focadas
  foram identificados sem prescrever uma implementacao divergente.
- Self-containment: PASS - o contrato distingue 175 command files em 172 agentes
  canonicos mais tres aliases e fixa `snps-orqx` como entrypoint canonico.
- Testability: PASS - ACs cobrem sucesso, falhas fechadas, tarball, install,
  update, idempotencia e registry com resultados mensuraveis.
- Article VII: PASS - aliases permanecem fora da metrica; cada provider continua
  com exatamente 172 agentes canonicos.
- CodeRabbit: PASS - tipo, agentes, gates, self-healing e focos estao definidos.
- Boundary and authority: PASS - paths protegidos permanecem fora do escopo e
  PR, merge e release continuam exclusivos de `@devops`.
