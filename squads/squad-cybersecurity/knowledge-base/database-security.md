# Database Security Reference

## Purpose

Comprehensive reference for database security — RLS, parameterized queries, encryption, audit logging, and Supabase-specific patterns. Used across all squad agents, particularly when reviewing or implementing data access controls.

---

## Row Level Security (RLS)

### Why RLS Is Non-Negotiable

RLS is the most critical security control for any Supabase-based application. In January 2025, 170+ applications built with Lovable were found with exposed databases (CVE-2025-48757) because developers did not enable RLS. **RLS is the difference between a secure app and a data breach.**

### RLS Fundamentals

```sql
-- Enable RLS on a table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Without policies, NOBODY can access data (deny-all by default)
-- You must create explicit policies for access

-- Check which tables have RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Find tables WITHOUT RLS (pre-deploy gate -- any result = blocker)
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' AND NOT rowsecurity;
```

### Core RLS Patterns

```sql
-- Pattern 1: Users see only their own data
CREATE POLICY "users_own_data" ON profiles
FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Pattern 2: Users manage only their own data (all operations)
CREATE POLICY "users_manage_own" ON profiles
FOR ALL TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- Pattern 3: Publicly visible data (e.g., published posts)
CREATE POLICY "public_published_posts" ON posts
FOR SELECT
USING (published = true);

-- Pattern 4: Multi-tenant isolation (org-level)
CREATE POLICY "tenant_isolation" ON orders
FOR ALL TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM org_members
    WHERE user_id = (SELECT auth.uid())
  )
);

-- Pattern 5: Role-based access (admin can see all)
CREATE POLICY "admin_full_access" ON profiles
FOR ALL TO authenticated
USING (
  (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Pattern 6: Read for anyone, write only for owner
CREATE POLICY "anyone_can_read" ON articles
FOR SELECT
USING (true);

CREATE POLICY "owner_can_write" ON articles
FOR INSERT OR UPDATE OR DELETE TO authenticated
USING (author_id = (SELECT auth.uid()))
WITH CHECK (author_id = (SELECT auth.uid()));
```

### RLS Performance Optimization

| Technique | Performance Gain | Implementation |
|-----------|-----------------|----------------|
| Index policy columns | 99.94% | `CREATE INDEX idx_user ON table(user_id)` |
| Wrap functions in SELECT | 94.97% | `(SELECT auth.uid()) = user_id` not `auth.uid() = user_id` |
| Explicit role in FOR clause | 99.78% | `FOR SELECT TO authenticated` |
| Subquery vs JOIN in policies | 99.78% | Use `IN (SELECT ...)` not JOIN |
| Security definer functions | 99.993% | Cached auth lookups |

```sql
-- SLOW: Function evaluated per row
USING (auth.uid() = user_id)

-- FAST: Function evaluated once, cached for all rows (up to 95% faster)
USING ((SELECT auth.uid()) = user_id)
```

### RLS Testing Patterns

**Critical:** The Supabase SQL Editor bypasses RLS. Always test via the SDK as a regular user.

```typescript
// Test RLS via SDK -- this respects policies
const supabase = createClient(url, anonKey)

// Login as test user
const { data: { session } } = await supabase.auth.signInWithPassword({
  email: 'testuser@example.com',
  // Use environment variable -- never hardcode credentials
  password: process.env.TEST_USER_PASSWORD
})

// This will be filtered by RLS -- should only return this user's rows
const { data, error } = await supabase.from('profiles').select('*')
console.log('User sees:', data) // Should only see own data

// Try accessing another user's data directly
const { data: otherData } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', 'other-user-uuid')
console.log('Should be empty:', otherData) // RLS should block this
```

### Views and RLS

Views bypass RLS by default in PostgreSQL 14 and below. In PostgreSQL 15+:

```sql
-- PostgreSQL 15+ -- force view to respect RLS
CREATE VIEW active_profiles WITH (security_invoker = true)
AS SELECT * FROM profiles WHERE deleted_at IS NULL;

-- Or use security_barrier for older PG versions
CREATE VIEW user_profiles WITH (security_barrier = true)
AS SELECT id, name, email FROM profiles;
```

---

## SQL Injection Prevention

### Parameterized Queries — Always

```javascript
// FORBIDDEN: String interpolation -- enables SQL injection
const dangerous = `SELECT * FROM users WHERE name = '${userInput}'`

// REQUIRED: Parameterized queries -- injection impossible
const safe = 'SELECT * FROM users WHERE name = $1'
const result = await db.query(safe, [userInput])

// Supabase: always safe -- PostgREST is parameterized
const { data } = await supabase.from('users').select('*').eq('name', userInput)

// pg (node-postgres): safe
const { rows } = await pool.query(
  'SELECT * FROM users WHERE email = $1 AND active = $2',
  [email, true]
)

// Prisma: safe
const user = await prisma.user.findFirst({
  where: { email: email }
})
```

### Dynamic Queries — Safe Pattern

When query structure must be dynamic, use identifier escaping:

```javascript
// For dynamic table/column names (rare -- prefer static)
const { Client } = require('pg')
const client = new Client()

// NEVER: `SELECT * FROM ${tableName}` -- SQL injection
// SAFE: Use pg's identifier escaping
const safeQuery = `SELECT * FROM ${client.escapeIdentifier(tableName)}`
```

### Stored Procedures — Secure Pattern

```sql
-- SAFE: Function uses parameterized query internally
CREATE OR REPLACE FUNCTION get_user_data(p_user_id UUID)
RETURNS TABLE(id UUID, name TEXT) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.name FROM users u WHERE u.id = p_user_id;
END;
$$;
```

---

## Encryption

### Encryption at Rest

**PostgreSQL column-level encryption (pgcrypto):**
```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encryption key comes from app setting (set via environment, not hardcoded)
-- In app startup: SET app.encryption_key = '<value from secrets manager>'

-- Encrypt sensitive data before storing
INSERT INTO sensitive_data (user_id, ssn_encrypted)
VALUES (
  $1,
  pgp_sym_encrypt($2, current_setting('app.encryption_key'))
);

-- Decrypt when reading
SELECT 
  user_id,
  pgp_sym_decrypt(ssn_encrypted::bytea, current_setting('app.encryption_key')) AS ssn
FROM sensitive_data
WHERE user_id = $1;
```

**Supabase Vault — preferred for secrets:**
```sql
-- Store secret in Vault (key_name must be descriptive, value from env/secrets manager)
SELECT vault.create_secret(
  '<secret-value-from-env>',  -- Use env var -- never hardcode
  'api_key_name',
  'Description of what this key is for'
);

-- Read secret (decrypted on the fly)
SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'api_key_name';

-- CRITICAL: Disable statement logging before inserting secrets
-- Otherwise plaintext appears in Supabase logs
ALTER SYSTEM SET log_statement = 'none';
SELECT pg_reload_conf();
-- Insert secret here
-- Re-enable
ALTER SYSTEM SET log_statement = 'all';
SELECT pg_reload_conf();
```

### Encryption in Transit

```sql
-- Force SSL for all direct connections
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_min_protocol_version = 'TLSv1.2';

-- Check current SSL status
SHOW ssl;
SELECT * FROM pg_stat_ssl;

-- Verify client is using SSL
SELECT pid, usename, ssl, version, cipher 
FROM pg_stat_ssl 
JOIN pg_stat_activity ON pg_stat_ssl.pid = pg_stat_activity.pid;
```

---

## Database Access Control

### Least Privilege Roles

```sql
-- Application read-only role
CREATE ROLE app_readonly;
GRANT CONNECT ON DATABASE myapp TO app_readonly;
GRANT USAGE ON SCHEMA public TO app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_readonly;

-- Application read-write role (no DDL)
CREATE ROLE app_readwrite;
GRANT CONNECT ON DATABASE myapp TO app_readwrite;
GRANT USAGE ON SCHEMA public TO app_readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_readwrite;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_readwrite;

-- Migration role (DDL allowed -- rotate credentials after migrations)
CREATE ROLE app_migrations;
GRANT ALL ON DATABASE myapp TO app_migrations;
```

### Supabase Key Management

| Key | Where to Use | Security Level |
|-----|-------------|---------------|
| `anon` (publishable) | Frontend/client code | Respects RLS -- safe to expose |
| `service_role` | Backend server only | Bypasses ALL RLS -- never expose to client |
| Direct DB connection string | Migrations only | Highest privilege -- use secrets manager |

```typescript
// WRONG: service_role in frontend (bypasses RLS entirely)
// NEVER: createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY) in browser code

// RIGHT: anon key in frontend, service_role only on server
// Frontend -- uses anon key via environment variable
const clientSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server/API routes only -- service role from non-public env
const adminSupabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // NOT prefixed with NEXT_PUBLIC_
)
```

---

## Audit Logging

### Automatic Audit Log with Triggers

```sql
-- Audit log table
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Generic trigger function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_by)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD)::jsonb END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::jsonb END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to sensitive tables
CREATE TRIGGER audit_profiles
AFTER INSERT OR UPDATE OR DELETE ON profiles
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_transactions
AFTER INSERT OR UPDATE OR DELETE ON financial_transactions
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

### RLS on Audit Log

```sql
-- Only admins can see the full audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_see_all_audit"
ON audit_log
FOR SELECT TO authenticated
USING (
  (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Users can only see their own audit entries
CREATE POLICY "users_see_own_audit"
ON audit_log
FOR SELECT TO authenticated
USING (changed_by = (SELECT auth.uid()));
```

---

## Common Database Security Misconfigurations

| Misconfiguration | Risk | Fix |
|----------------|------|-----|
| Table with no RLS enabled | Anyone can read all data via API | `ALTER TABLE t ENABLE ROW LEVEL SECURITY` |
| service_role key in frontend | Full database bypass | Move to server-side only |
| SQL string concatenation | SQL injection | Use parameterized queries |
| No SSL enforcement | Data in transit interceptable | Set `ssl_min_protocol_version = 'TLSv1.2'` |
| Superuser app credentials | Privilege escalation trivial | Create least-privilege role |
| No connection limits | Connection exhaustion DoS | Set `connection_limit` on roles |
| Unencrypted sensitive columns | Data breach exposes plaintext | pgcrypto or Vault |
| Public schema grants to public | PostgreSQL 14 default allows all public | `REVOKE ALL ON SCHEMA public FROM public` |
| Statement logging enabled with secrets | Secrets in logs | Disable before inserting secrets |

---

## Pre-Deploy Database Security Gate

```sql
-- Run this before every production deployment
-- Any row returned = BLOCKER

-- 1. Tables without RLS
SELECT 'TABLE_NO_RLS' as issue, tablename 
FROM pg_tables 
WHERE schemaname = 'public' AND NOT rowsecurity;

-- 2. Overprivileged connections check
SELECT 'SUPERUSER_APP' as issue, usename 
FROM pg_user 
WHERE usesuper = true AND usename != 'postgres';

-- 3. Tables with no policies (RLS on but no policies = deny all)
SELECT 'TABLE_NO_POLICIES' as issue, t.tablename
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = t.schemaname
WHERE t.schemaname = 'public' AND t.rowsecurity = true AND p.policyname IS NULL;
```

---

## Sources

- Supabase RLS Documentation: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Security Best Practices: https://supabase.com/docs/guides/security
- CVE-2025-48757 (Lovable/RLS): https://nvd.nist.gov/vuln/detail/CVE-2025-48757
- OWASP SQL Injection Prevention: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- PostgreSQL Security Documentation: https://www.postgresql.org/docs/current/security.html
