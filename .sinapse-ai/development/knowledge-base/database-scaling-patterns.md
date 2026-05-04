# Database Scaling Patterns

> **Agente(s):** @data-engineer (Tensor)
> **Fonte:** supabase-at-scale.md, database-selection-architecture.md
> **Uso:** Consultar ao projetar schemas, otimizar queries, escolher banco de dados ou escalar Supabase

---

## 1. Regra "Start with PostgreSQL"

PostgreSQL cobre ~90% dos casos de uso. E a recomendacao default para QUALQUER projeto novo.

**Por que PostgreSQL primeiro:**
- #1 banco mais desejado (Stack Overflow 2026)
- 45.55% market share entre devs (superou MySQL em 2025)
- JSONB para dados semi-estruturados (evita precisar de MongoDB)
- pgvector para AI/ML (evita precisar de Pinecone)
- Full-text search nativo (evita Elasticsearch para casos simples)
- PostGIS para geoespacial
- pg_cron para agendamento

**Quando adicionar outro banco:**
```
PostgreSQL resolve seu problema?
|-- SIM --> Use PostgreSQL
+-- NAO --> Qual e o problema especifico?
    |-- Latencia < 1ms para cache --> Redis / Upstash
    |-- Busca full-text com typo tolerance --> Meilisearch / Typesense
    |-- Time-series em volume extremo --> TimescaleDB (extension) ou InfluxDB
    |-- Key-value com escala ilimitada --> DynamoDB
    |-- Embeddings/vector search em escala --> Pinecone (se pgvector nao basta)
    |-- Write throughput extremo (IoT) --> ScyllaDB / Cassandra
    |-- Multi-region active-active com SQL --> CockroachDB / Aurora DSQL
    +-- Schema variavel com nested docs --> MongoDB Atlas
```

---

## 2. Database Selection Matrix

| Caso de Uso | Banco Primario | Alternativa | Evitar |
|------------|---------------|-------------|--------|
| CRUD web app | PostgreSQL (Supabase) | MySQL | MongoDB (overengineering) |
| Cache / Sessions | Redis (Upstash) | Memcached | PostgreSQL (lento para cache) |
| Busca textual < 10M docs | PostgreSQL FTS | Meilisearch | Elasticsearch (overhead) |
| Busca textual > 10M docs | Meilisearch / Typesense | Elasticsearch | PostgreSQL FTS (lento) |
| AI embeddings (< 5M vectors) | pgvector (PostgreSQL) | -- | Pinecone (custo) |
| AI embeddings (> 5M vectors) | Pinecone / pgvectorscale | Qdrant | pgvector puro (performance) |
| Real-time sync | Supabase Realtime | Firestore | WebSocket custom |
| Event logging | PostgreSQL + partitioning | TimescaleDB | DynamoDB (overengineering) |
| IoT / metrics volume extremo | TimescaleDB / InfluxDB | ScyllaDB | PostgreSQL (nao escala) |
| E-commerce catalogo variavel | PostgreSQL JSONB | MongoDB | DynamoDB (queries limitadas) |
| Mobile offline-first | Firestore | -- | Supabase (offline imaturo) |
| Multi-region global SQL | CockroachDB / Aurora DSQL | -- | PostgreSQL simples |

---

## 3. Supabase Scaling Playbook

### 3.1 Connection Pooling (Supavisor)

| Modo | Porta | Prepared Statements | Ideal Para |
|------|-------|---------------------|------------|
| Transaction | 6543 | Nao | Serverless, APIs, Edge Functions |
| Session | 5432 | Sim | ORMs (Prisma, Drizzle) |
| Direct | conexao direta | Sim | Migrations, DDL |

**Regras:**
- Next.js API Routes / Edge Functions --> Transaction mode (6543)
- ORM com prepared statements --> Session mode (5432)
- Migrations / DDL --> Direct connection (sem pooler)
- Pool size default: 15. Para producao intensa, ajustar via dashboard.

### 3.2 Read Replicas

**Quando usar:**

| Cenario | Solucao | Motivo |
|---------|---------|--------|
| Alto volume de leitura | Read Replicas | Distribui carga de SELECT |
| Queries complexas pesadas | Compute maior | CPU/RAM por query |
| Usuarios globais | Replicas multi-regiao | Reduz latencia (geo-routing) |
| Writes pesados | Compute maior | Replicas nao aceitam writes |
| Analytics/reporting | Replica dedicada | Isola carga analitica |

**Mudanca abril 2025:** Geo-routing automatico (vs round-robin anterior).

### 3.3 Table Partitioning

| Tipo | Quando Usar | Exemplo |
|------|-------------|---------|
| Range | Dados temporais | `PARTITION BY RANGE (created_at)` |
| List | Categorias discretas | `PARTITION BY LIST (region)` |
| Hash | Distribuicao uniforme | `PARTITION BY HASH (user_id)` |

```sql
-- Exemplo: particoes mensais para eventos
CREATE TABLE events (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    tenant_id UUID NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2025_01 PARTITION OF events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

**Regra:** Particionar quando tabela > 10M rows ou > 10GB.

### 3.4 Vacuum Tuning

| Parametro | Default | Producao | Motivo |
|----------|---------|----------|--------|
| `autovacuum_max_workers` | 3 | 5 | Mais workers paralelos |
| `autovacuum_naptime` | 1min | 45s | Checa mais frequente |
| `vacuum_cost_limit` | 200 | 2000 | Vacuum mais agressivo |
| `autovacuum_vacuum_scale_factor` | 0.2 | 0.05 | Dispara com 5% dead tuples |

```sql
-- Tuning por tabela (alto volume de writes)
ALTER TABLE events SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_vacuum_threshold = 1000,
    autovacuum_analyze_scale_factor = 0.02
);
```

---

## 4. RLS Optimization Patterns

### Impacto Real

| Cenario | Sem otimizacao | Com otimizacao | Melhoria |
|---------|---------------|----------------|----------|
| SELECT com RLS em 1M rows | > 3 min (timeout) | 2ms | 90.000x |
| auth.uid() sem indice | Seq Scan | Index Scan | 100x+ |
| Funcao sem SELECT wrapper | Chamada por row | Cached (initPlan) | 1000x+ |

### Regra #1: SEMPRE indexe colunas em RLS policies

```sql
CREATE INDEX idx_orders_user_id ON orders USING btree (user_id);
CREATE INDEX idx_orders_tenant_id ON orders USING btree (tenant_id);
```

### Regra #2: SELECT wrapper para cache de funcoes

```sql
-- ANTI-PATTERN (executado para CADA row)
CREATE POLICY "user_access" ON orders
    FOR ALL USING (auth.uid() = user_id);

-- CORRETO (cached, executado UMA vez)
CREATE POLICY "user_access" ON orders
    FOR ALL USING ((SELECT auth.uid()) = user_id);
```

### Regra #3: Security definer para subqueries complexas

```sql
-- ANTI-PATTERN (subquery por row)
CREATE POLICY "team_access" ON documents
    FOR ALL USING (
        team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    );

-- CORRETO (funcao cacheada)
CREATE OR REPLACE FUNCTION get_user_team_ids()
RETURNS UUID[]
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = ''
AS $$
    SELECT ARRAY(
        SELECT team_id FROM public.team_members
        WHERE user_id = (SELECT auth.uid())
    );
$$;

CREATE POLICY "team_access" ON documents
    FOR ALL USING (team_id = ANY((SELECT get_user_team_ids())));
```

---

## 5. Multi-Tenant Decision Tree

```
Quantos tenants esperados?
|
+-- < 10 --> Schema por tenant (maximo isolamento)
|   Cada tenant = schema PostgreSQL separado
|   Pro: isolamento total, RLS por schema
|   Con: migrations em N schemas, complexidade operacional
|
+-- 10-1000 --> Coluna tenant_id (shared database)
|   Todas as tabelas tem coluna tenant_id
|   RLS filtra por tenant via JWT custom claims
|   Pro: simples, escala bem, uma migration
|   Con: risco de data leak se RLS falhar
|
+-- > 1000 --> Database por tenant (se budget permitir)
|   Ou: shared database com partitioning por tenant
|   Pro: isolamento completo, escala independente
|   Con: custo alto, gestao complexa
```

### Pattern Recomendado: Tenant via JWT Claims

```sql
-- RLS policy com tenant isolation
CREATE POLICY "tenant_isolation" ON orders
    FOR ALL USING (
        tenant_id = (
            SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
        )
    );

-- Indice obrigatorio
CREATE INDEX idx_orders_tenant ON orders (tenant_id);
```

---

## 6. Index Strategy Quick-Reference

### Tipos de Indice

| Tipo | Operadores | Quando Usar |
|------|-----------|-------------|
| B-Tree | `=`, `<`, `>`, `BETWEEN`, `ORDER BY` | Default para a maioria das queries |
| GIN | `@>`, `?`, `@@` | Arrays, JSONB, full-text search |
| GiST | `<<`, `>>`, `&&` | Geometria, ranges |
| BRIN | `<`, `>`, `=` | Dados naturalmente ordenados (time-series) |
| Hash | `=` apenas | Igualdade exata (sessions, tokens) |

### Patterns Avancados

```sql
-- Partial Index (indexa apenas linhas relevantes)
CREATE INDEX idx_active_users ON users (email)
    WHERE status = 'active';

-- Covering Index (evita table lookup)
CREATE INDEX idx_orders_lookup ON orders (user_id, created_at)
    INCLUDE (total, status);

-- Expression Index
CREATE INDEX idx_users_lower_email ON users (LOWER(email));

-- Composite Index (mais seletiva primeiro)
CREATE INDEX idx_products_cat_price ON products (category_id, price DESC);
```

### Regras de Ouro

1. Cada indice desacelera writes (INSERT, UPDATE, DELETE)
2. Monitore com `pg_stat_user_indexes` para indices nao utilizados
3. Use `EXPLAIN ANALYZE` antes e depois de criar indices
4. Indices em colunas boolean raramente ajudam
5. Composite: coluna mais seletiva primeiro

---

## 7. Query Optimization Checklist

### Diagnostico

```sql
-- Habilitar tracking de queries lentas
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 10 queries mais lentas
SELECT calls, mean_exec_time::numeric(10,2) AS avg_ms,
       total_exec_time::numeric(10,2) AS total_ms, query
FROM pg_stat_statements
ORDER BY total_exec_time DESC LIMIT 10;

-- Analisar plano de execucao
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = $1 AND created_at > NOW() - '30 days'::interval;
```

### Checklist de Otimizacao

- [ ] `EXPLAIN ANALYZE` mostra Index Scan (nao Seq Scan)?
- [ ] Indice existe para colunas em WHERE/JOIN/ORDER BY?
- [ ] N+1 queries eliminadas (usar JOINs ou batch)?
- [ ] CTEs nao estao forçando materializacao desnecessaria?
- [ ] Materialized views para dashboards pesados?
- [ ] Connection pool configurado corretamente?
- [ ] Vacuum rodando com frequencia adequada?
- [ ] Dead tuples abaixo de 5% em tabelas criticas?

### Materialized Views para Dashboards

```sql
CREATE MATERIALIZED VIEW mv_daily_revenue AS
SELECT DATE_TRUNC('day', created_at) AS day, tenant_id,
       SUM(total) AS revenue, COUNT(*) AS order_count
FROM orders WHERE status = 'completed'
GROUP BY 1, 2;

-- Indice unico para REFRESH CONCURRENTLY
CREATE UNIQUE INDEX idx_mv_daily ON mv_daily_revenue (day, tenant_id);

-- Refresh sem lock
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_revenue;
```

---

## 8. Redis/Cache Patterns

### Quando Adicionar Cache

| Sinal | Acao |
|-------|------|
| Mesma query repetida > 100x/min | Cache-aside com Redis |
| API response > 200ms para dados estáticos | Stale-while-revalidate |
| Rate limiting necessario | Redis sorted sets ou Upstash Ratelimit |
| Session management em serverless | Upstash Redis (HTTP API) |

### Cache-Aside Pattern

```javascript
async function getUser(userId) {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600);
  return user;
}
```

**Upstash** para serverless (Edge Functions, Vercel): HTTP REST API, sem TCP connection.

---

## 9. Testing RLS com pgTAP

```sql
BEGIN;
SELECT plan(3);

SELECT tests.create_supabase_user('user_a', 'a@test.com');
SELECT tests.create_supabase_user('user_b', 'b@test.com');

-- User A insere dados
SELECT tests.authenticate_as('user_a');
INSERT INTO orders (user_id, total) VALUES ((SELECT auth.uid()), 100);

-- User B insere dados
SELECT tests.authenticate_as('user_b');
INSERT INTO orders (user_id, total) VALUES ((SELECT auth.uid()), 200);

-- User A so ve seus pedidos
SELECT tests.authenticate_as('user_a');
SELECT is((SELECT COUNT(*) FROM orders)::int, 1,
    'User A should only see own orders');

SELECT * FROM finish();
ROLLBACK;
```

---

## 10. Cross-References

- Infrastructure tiers e quando graduar: ver `infrastructure-decision-framework.md`
- Secrets para database credentials: ver `environment-deployment-patterns.md`
- RLS validation no deploy: ver `security-pre-deploy-checklist.md`
