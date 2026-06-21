# Data Engineer Agent Memory (Tensor)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Key Patterns
- CommonJS (`require`/`module.exports`), NOT ES Modules
- ES2022, Node.js 18+, 2-space indent, single quotes
- Absolute imports always (never relative `../`)
- kebab-case for files, PascalCase for components

### Project Structure
- `.sinapse-ai/core/` — Core modules
- `packages/db/` — Database packages (if applicable)
- `tests/` — Test suites (mirrors source structure)

### Git Rules
- NEVER push — delegate to @devops
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`

### Database Conventions
- Schema design follows architect decisions
- RLS policies for row-level security
- Migration scripts with rollback procedures

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## Municao: Engenharia de Software (kit Fase 4)

Fonte completa: `engenharia-software/fase-4-agents/KIT-data-engineer.md` (repo github caioimori/engenharia-de-software). Recorte: modelagem + indexacao + ACID/isolamento + RAG vetorial + RLS multi-tenant + memoria de agent como event store.

### Principios nao-negociaveis
- Independencia de dados: manipule relacoes declarativamente; o sistema decide storage/indice/caminho de acesso (Codd 1970).
- ACID e contrato e cada letra custa; "C" (invariantes) e da aplicacao via constraint, nao do banco (Gray & Reuter; Kleppmann DDIA cap.7).
- Isolamento e matriz anomalia x nivel, nao escada: SI e RR sao incomparaveis. Escolha o MENOR nivel que evita as anomalias relevantes (Berenson et al. 1995).
- Os nomes do nivel mentem ("REPEATABLE READ" do Postgres = snapshot isolation) — verifique, nao assuma (Jepsen PostgreSQL).
- Write skew (invariante de conjunto sob SI) exige protecao explicita: SSI, `FOR UPDATE` ou constraint (Ports & Grittner 2012 SSI).
- Durabilidade vem do log (WAL antes do dado); COMMIT = fsync do registro de commit (Mohan et al. 1992, ARIES).
- Modele pelas queries reais: BCNF por padrao, desnormaliza so com medicao; indexa colunas reais de WHERE/JOIN/ORDER BY (Ramakrishnan/Gehrke).
- Cardinalidade domina o plano; `EXPLAIN ANALYZE` (plano real) e o arbitro (Leis et al., Join Order Benchmark).
- Idempotencia via unique constraint + upsert em todo efeito colateral; exactly-once nao existe = at-least-once + idempotencia (Stripe/Brandur).
- Memoria de agent = event store append-only + projecoes (CQRS); historico nunca sobrescrito. Isolamento por tenant via RLS. FSM avanca em transacao + outbox, nunca dual-write (Playbook dados distribuidos). PostgreSQL e default racional — sair dele exige necessidade medida.

### Gates verificaveis (antes de Done)
- [ ] PK/FK declaradas em toda tabela/relacao (`information_schema.table_constraints`, zero faltando).
- [ ] Unique constraint em toda chave de idempotencia/dedup.
- [ ] Sem over-indexing: nenhum indice maduro com `idx_scan = 0` (`pg_stat_user_indexes`).
- [ ] Cada `BEGIN` com nivel de isolamento explicito e justificado (menor que evita as anomalias).
- [ ] Write skew coberto: teste de concorrencia (duas txns paralelas) prova que o invariante nunca quebra.
- [ ] Retry de `serialization_failure` (SQLSTATE 40001) com backoff nas txns serializable.
- [ ] Transacoes curtas: nenhuma chamada de rede (HTTP/LLM) dentro de `BEGIN/COMMIT`.
- [ ] `EXPLAIN ANALYZE` confirma `Index Scan` nas queries quentes (sem `Seq Scan` inesperado).
- [ ] Zero N+1; keyset pagination (seek), nao `OFFSET` grande; sem `SELECT *` / result set sem LIMIT em caminho quente.
- [ ] Migrations versionadas e reversiveis (`up`+`down`); backfill em lotes.
- [ ] Backup + PITR com restore TESTADO (durabilidade nao testada nao existe).
- [ ] RAG: filtro hibrido no banco com teste de vazamento cross-tenant = zero; recall@k real medido acima do limiar.
- [ ] Idempotencia de tool mutante: mesma key 3x = efeito externo 1x (teste de integracao).
- [ ] Event store append-only: replay reconstroi estado identico (teste de replay).
- [ ] RLS ativo: query sem `tenant_id` correto retorna zero linhas (teste tenant A x B).
- [ ] FSM + outbox sem dual-write: crash injetado entre escrita e publicacao nao perde evento.
- [ ] ADR registrado pra toda escolha estrutural (engine, isolamento padrao, indice vetorial).

### Loop operacional
Entender (queries reais + invariantes) -> Modelar (BCNF, PK/FK, unique) -> Isolar (menor nivel; write skew -> SSI/lock + retry 40001) -> Indexar -> Provar (`EXPLAIN ANALYZE`, matar N+1) -> Migrar (versionada/reversivel) -> Especializar (RAG/event store/RLS/outbox) -> Verificar (rodar TODOS os gates ate verde) -> Registrar ADR + handoff (push/PR exclusivo do @devops). Diagrama mermaid completo no kit em `engenharia-software/fase-4-agents/KIT-data-engineer.md`.

