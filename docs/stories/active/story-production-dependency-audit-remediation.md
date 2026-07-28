---
status: Ready
owner: sprint-lead
executor: developer
quality_gate: architect
quality_gate_tools:
  - npm
  - node
  - jest
  - eslint
  - typescript
  - coderabbit
created: 2026-07-28
source: "Security Audit do PR #402"
---

# Story: Remediar vulnerabilidades em dependências de produção

## User story

Como mantenedor do SINAPSE, quero atualizar as dependências de produção
vulneráveis apontadas no Security Audit do PR #402, para que o pacote não
permaneça exposto a vulnerabilidades high/critical sem introduzir mudança de API
major ou regressão funcional.

## Escopo

- Atualizar o override de `fast-uri` de `^3.1.2` para `^3.1.4`, com resolução
  exata 3.1.4 no lockfile.
- Atualizar a dependência direta e o override de `js-yaml` de `^4.2.0` para
  `^4.3.0`, com resolução exata 4.3.0 no lockfile.
- Atualizar a dependência direta de `tar` de `^7.5.13` para `^7.5.22`, com
  resolução exata 7.5.22 no lockfile.
- Regenerar somente as entradas necessárias de `package.json` e
  `package-lock.json`, preservando as APIs major atuais.
- Validar o grafo instalado, o audit de produção e a suíte proporcional completa.

## Fora de escopo

- Atualizações de outras dependências, mudanças de API major ou refatorações.
- Uso de `npm audit fix --force`, supressão de advisories ou aceitação silenciosa
  de risco high/critical.
- Alterações de código-fonte, workflows, documentação não relacionada ou paths
  protegidos L1/L2.
- Commit, push, PR, publicação, release ou deploy.

## Acceptance criteria

- [ ] **AC1 - Versões seguras.** Given uma instalação limpa a partir do lockfile,
  when o grafo de produção é inspecionado, then `fast-uri` resolve exatamente
  para 3.1.4, `js-yaml` para 4.3.0 e `tar` para 7.5.22, preservando
  respectivamente as majors 3, 4 e 7.
- [ ] **AC2 - Manifesto e lockfile mínimos.** Given o diff final, when
  `package.json` e `package-lock.json` são revisados, then `package.json` altera
  somente a dependência `js-yaml`, a dependência `tar` e os overrides de
  `fast-uri` e `js-yaml`, enquanto `package-lock.json` altera somente o
  metadado raiz e as resoluções/arestas necessárias desses três pacotes, sem
  churn não relacionado.
- [ ] **AC3 - Audit de produção.** Given as dependências instaladas pelo lockfile
  atualizado, when `npm audit --omit=dev` é executado, then o comando conclui
  com zero vulnerabilidades high e zero critical, sem supressões ou `--force`.
- [ ] **AC4 - Compatibilidade.** Given a atualização dentro das majors atuais,
  when lint, typecheck, testes e build/packaging aplicáveis são executados, then
  todos passam e os contratos públicos existentes permanecem preservados.
- [ ] **AC5 - Evidência reproduzível.** Given a revisão da entrega, when as
  evidências são consultadas, then elas registram versões antes/depois, diff dos
  dois arquivos, árvore resolvida, saída do audit e resultados dos gates.
- [ ] **AC6 - Rollback.** Given uma regressão atribuível à atualização, when o
  rollback documentado é aplicado, then `package.json` e `package-lock.json`
  retornam juntos ao baseline anterior e uma instalação limpa reproduz esse
  baseline sem edição manual parcial do lockfile.

## Tasks / subtasks

- [ ] **T1 (AC: 1, 2, 5) - Capturar baseline:** registrar as versões resolvidas,
  os caminhos no grafo e o resultado inicial de `npm audit --omit=dev`.
- [ ] **T2 (AC: 1, 2) - Atualizar manifestos:** em `package.json`, ajustar
  `dependencies["js-yaml"]` para `^4.3.0`, `dependencies.tar` para `^7.5.22`,
  `overrides["fast-uri"]` para `^3.1.4` e `overrides["js-yaml"]` para `^4.3.0`;
  regenerar `package-lock.json` com npm, sem editar o lockfile manualmente.
- [ ] **T3 (AC: 1, 3, 5) - Verificar segurança:** executar instalação limpa,
  inspecionar a árvore resolvida e comprovar zero high/critical em
  `npm audit --omit=dev`.
- [ ] **T4 (AC: 4, 5) - Verificar regressões:** executar `npm run lint`,
  `npm run typecheck`, `npm test -- --runInBand`, `npm run validate:schemas`,
  `npm run validate:parity` e `npm pack --dry-run`; complementar com smoke tests
  de parse/dump de YAML e de criação/listagem/extração TAR em diretório
  temporário. Registrar qualquer gate não aplicável com justificativa.
- [ ] **T5 (AC: 2, 4, 5) - Revisar diff:** confirmar ausência de mudança major,
  churn de lockfile, dependências estranhas, secrets ou arquivos fora do escopo.
- [ ] **T6 (AC: 6) - Validar rollback:** gerar um patch restrito aos dois
  manifestos, validar sua aplicação reversa com `git apply --reverse --check` e,
  em worktree ou cópia descartável, aplicar a reversão dos dois arquivos como
  uma unidade e comprovar com `npm ci --ignore-scripts` que o baseline é
  reinstalável; não usar reset destrutivo nem sobrescrever mudanças de terceiros.

## Riscos e mitigação

| Risco | Nível | Mitigação |
|---|---|---|
| Mudança comportamental de parser em `js-yaml` 4.3.0 | Médio | Manter major 4 e executar testes que cobrem leitura/escrita YAML |
| Override não alcançar todas as ocorrências transitivas | Alto | Inspecionar a árvore efetiva após `npm ci`, não apenas o manifesto |
| Churn não relacionado no lockfile | Médio | Revisar diff e regenerar com a versão de npm suportada pelo projeto |
| Audit verde ocultar regressão funcional | Alto | Exigir gates funcionais completos além do audit |
| Rollback parcial deixar manifesto e lock divergentes | Médio | Reverter os dois arquivos juntos e validar com instalação limpa |

## Evidência e rastreabilidade

- Security Audit do PR #402 e `npm audit --omit=dev` verificado em 2026-07-28:
  `fast-uri` 3.1.2 vulnerável, correção 3.1.4; `js-yaml` 4.2.0 vulnerável,
  correção 4.3.0; `tar` 7.5.16 vulnerável, correção escolhida 7.5.22. As três
  versões existem no registro npm e preservam as majors 3, 4 e 7.
- O baseline local resolve `fast-uri` 3.1.2, `js-yaml` 4.2.0 e `tar` 7.5.16 em
  `package-lock.json`; `package.json` contém `js-yaml` e `tar` como dependências
  diretas e overrides para `fast-uri` e `js-yaml`.
- `package.json` e `package-lock.json` são as fontes autoritativas de versão; o
  lockfile é canônico e a remediação deve preservar sua evidência.
  [Source: `docs/framework/tech-stack.md` — Runtime contract]
- A validação recomendada inclui lint, typecheck, testes, packaging e
  `npm audit --omit=dev`; reescritas automáticas de dependências não são o padrão.
  [Source: `docs/framework/tech-stack.md` — Verification]

## Rollback

Gerar e guardar temporariamente o diff exclusivo de `package.json` e
`package-lock.json`; validar `git apply --reverse --check` e testar a aplicação
reversa em worktree ou cópia descartável. Após a reversão conjunta, executar
`npm ci --ignore-scripts`, reinspecionar as três versões do baseline e repetir
os gates relevantes. Para recuperar a remediação, reaplicar o mesmo patch no
sentido normal. Não restaurar arquivos de terceiros, não editar o lockfile à mão
e não executar reset destrutivo do worktree.

## Quality plan

- Tipo primário: Security; secundário: dependency maintenance.
- Complexidade: baixa a média, com impacto potencial no runtime de produção.
- Implementação: `@developer`.
- Validação: `@quality-gate`, com foco no grafo resolvido, compatibilidade,
  audit de produção, diff mínimo e rollback.
- Revisão automatizada: CodeRabbit pre-commit conforme a configuração canônica
  do repositório; operação remota permanece exclusiva de `@devops`.

## Definition of done

- AC1-AC6 possuem evidência reproduzível.
- `npm audit --omit=dev` reporta zero high/critical.
- Gates proporcionais passam sem regressão e sem alteração major.
- Diff limitado a `package.json` e `package-lock.json`.
- Quality Gate concluído antes de qualquer operação remota.
