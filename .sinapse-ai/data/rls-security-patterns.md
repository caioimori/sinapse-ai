# RLS Security Patterns Reference

> Standalone reference for @data-engineer (Tensor)
> Constitution Article X -- Security and Data Protection

---

## What is RLS

Row Level Security (RLS) is a database feature that restricts which rows a user can access in a table. In Supabase and PostgreSQL, RLS policies are the primary mechanism for data isolation between users, organizations, and roles.

**Rule:** Every table that stores user data MUST have RLS enabled. No exceptions.

---

## Pattern 1: Basic User Isolation

The most common pattern. Each user can only see and modify their own data.

```sql
-- Enable RLS on the table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: users can only read their own rows
CREATE POLICY "users_read_own_data"
ON user_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: users can only insert rows with their own user_id
CREATE POLICY "users_insert_own_data"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: users can only update their own rows
CREATE POLICY "users_update_own_data"
ON user_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: users can only delete their own rows
CREATE POLICY "users_delete_own_data"
ON user_profiles
FOR DELETE
USING (auth.uid() = user_id);
```

**When to use:** Personal data, user settings, individual records.

**Key point:** Always include both `USING` (which rows to read) and `WITH CHECK` (which rows to write) on UPDATE policies.

---

## Pattern 2: Organization-Based Access

Users belong to organizations and can see all data within their organization.

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: users can see projects in their organization
CREATE POLICY "org_members_read_projects"
ON projects
FOR SELECT
USING (
  organization_id IN (
    SELECT org_id FROM organization_members
    WHERE member_user_id = auth.uid()
  )
);

-- Policy: users can create projects in their organization
CREATE POLICY "org_members_create_projects"
ON projects
FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT org_id FROM organization_members
    WHERE member_user_id = auth.uid()
  )
);
```

**Performance tip:** Use a security definer function to avoid repeated subqueries:

```sql
-- Helper function (runs with elevated privileges)
CREATE OR REPLACE FUNCTION auth.user_org_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT org_id FROM organization_members
  WHERE member_user_id = auth.uid()
$$;

-- Simplified policy using the helper
CREATE POLICY "org_members_read_projects"
ON projects
FOR SELECT
USING (organization_id IN (SELECT auth.user_org_ids()));
```

**When to use:** Multi-tenant applications, team workspaces, shared resources.

---

## Pattern 3: Role-Based Access

Different roles within an organization have different access levels.

```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "admins_full_access"
ON documents
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE member_user_id = auth.uid()
    AND org_id = documents.organization_id
    AND role = 'admin'
  )
);

-- Editors can read and update, but not delete
CREATE POLICY "editors_read_update"
ON documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE member_user_id = auth.uid()
    AND org_id = documents.organization_id
    AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "editors_update"
ON documents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE member_user_id = auth.uid()
    AND org_id = documents.organization_id
    AND role IN ('admin', 'editor')
  )
);

-- Viewers can only read
CREATE POLICY "viewers_read"
ON documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE member_user_id = auth.uid()
    AND org_id = documents.organization_id
    AND role IN ('admin', 'editor', 'viewer')
  )
);
```

**When to use:** Applications with distinct permission levels (admin, editor, viewer).

**Key point:** Define policies from most restrictive to least restrictive. Each policy is OR-ed -- if any policy grants access, access is granted.

---

## Pattern 4: Public and Private Data

Some data is public (visible to all), while other data is private.

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts (including anonymous users)
CREATE POLICY "public_posts_readable"
ON posts
FOR SELECT
USING (status = 'published');

-- Authors can read their own drafts
CREATE POLICY "authors_read_own_drafts"
ON posts
FOR SELECT
USING (author_id = auth.uid());

-- Authors can update their own posts
CREATE POLICY "authors_update_own"
ON posts
FOR UPDATE
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());
```

**When to use:** Blogs, content platforms, marketplaces with public listings.

---

## Service Role Usage Guidelines

### What is service_role

The `service_role` key bypasses all RLS policies. It has full, unrestricted access to every row in every table.

### Rules

| Rule | Severity |
|------|----------|
| NEVER use service_role in frontend code | ABSOLUTE BLOCKER |
| NEVER expose service_role in client-side bundles | ABSOLUTE BLOCKER |
| Use service_role ONLY in server-side code | REQUIRED |
| Use service_role ONLY for admin operations | REQUIRED |
| Prefer anon key + RLS for all user-facing queries | REQUIRED |

### Appropriate Uses

```javascript
// SERVER-SIDE ONLY (Edge Functions, API routes, cron jobs)

// Admin dashboard: list all users (requires service_role)
const { data } = await supabaseAdmin
  .from('user_profiles')
  .select('id, email, created_at');

// System operations: clean up expired sessions
const { error } = await supabaseAdmin
  .from('sessions')
  .delete()
  .lt('expires_at', new Date().toISOString());
```

### Inappropriate Uses (BLOCKED)

```javascript
// FRONTEND CODE -- NEVER DO THIS
import { createClient } from '@supabase/supabase-js';

// This exposes service_role to every user
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
```

---

## Common RLS Anti-Patterns

### 1. Forgetting to Enable RLS

```sql
-- Table created without RLS -- ALL data is public by default
CREATE TABLE sensitive_data (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  secret_info text
);
-- Missing: ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;
```

**Fix:** Always enable RLS immediately after CREATE TABLE.

### 2. Overly Permissive Policies

```sql
-- BAD: Allows any authenticated user to read ALL rows
CREATE POLICY "bad_policy"
ON user_data
FOR SELECT
USING (auth.uid() IS NOT NULL);
```

**Fix:** Always filter by user_id, org_id, or role.

### 3. Missing WITH CHECK on Write Policies

```sql
-- BAD: User can read own rows but insert rows for OTHER users
CREATE POLICY "incomplete_insert"
ON user_data
FOR INSERT
WITH CHECK (true);  -- No restriction on who can insert what
```

**Fix:** Always include `WITH CHECK (auth.uid() = user_id)` on INSERT/UPDATE.

### 4. Using FOR ALL Without Thinking

```sql
-- DANGEROUS: Grants read + write + delete to everyone matching
CREATE POLICY "too_broad"
ON orders
FOR ALL
USING (customer_id = auth.uid());
```

**Concern:** Users can delete their own orders, which may not be desired.

**Fix:** Create separate policies for SELECT, INSERT, UPDATE, and DELETE.

### 5. N+1 Subquery Performance

```sql
-- SLOW: Runs a subquery for EVERY row
CREATE POLICY "slow_policy"
ON documents
FOR SELECT
USING (
  organization_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  )
);
```

**Fix:** Use a SECURITY DEFINER helper function (see Pattern 2) or a materialized view for complex access patterns.

---

## Testing RLS Policies

### Manual Testing with Role Switching

```sql
-- Test as a specific user
SET request.jwt.claim.sub = 'user-uuid-here';
SET role = 'authenticated';

-- Run a query -- should only return rows for that user
SELECT * FROM user_profiles;

-- Reset
RESET role;
RESET request.jwt.claim.sub;
```

### Automated Testing Approach

```javascript
// In Jest tests with Supabase client
describe('RLS Policies', () => {
  it('user can only see own profile', async () => {
    // Create client as User A
    const clientA = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${tokenA}` } }
    });

    // Insert profile for User A
    await clientA.from('profiles').insert({ user_id: userAId, name: 'A' });

    // Create client as User B
    const clientB = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${tokenB}` } }
    });

    // User B should NOT see User A's profile
    const { data } = await clientB
      .from('profiles')
      .select('*')
      .eq('user_id', userAId);

    expect(data).toHaveLength(0);
  });
});
```

### Verification Checklist

- [ ] Every table with user data has RLS enabled
- [ ] SELECT policies filter by user_id, org_id, or role
- [ ] INSERT policies use WITH CHECK to validate ownership
- [ ] UPDATE policies use both USING and WITH CHECK
- [ ] DELETE policies are intentionally scoped (not too broad)
- [ ] service_role is NOT referenced in any frontend file
- [ ] Helper functions use SECURITY DEFINER where needed
- [ ] Policies are tested with multiple user contexts

---

*Last updated: 2026-04-03*
