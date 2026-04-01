---
name: db-review
description: Database schema review guidelines — activates automatically when touching schema files (Prisma, migrations, Supabase)
paths: ["*.prisma", "migrations/**", "schema.*", "supabase/migrations/**", "supabase/functions/**"]
allowed-tools: [Read, Grep, Glob, Bash]
user-invocable: false
---

# Database Schema Review

When touching database files, follow these guidelines from @data-engineer (Dara):

## Schema Changes
- Every schema change MUST have a corresponding migration
- Never modify existing migrations — create new ones
- Use descriptive migration names: `YYYYMMDDHHMMSS_description.sql`
- Always include rollback logic (DOWN migration)

## RLS Policies
- Every new table MUST have Row Level Security enabled
- Policies are per-table, not global — verify each table individually
- Test policies with both authenticated and anonymous roles
- Document policy intent in SQL comments

## Query Optimization
- Add indexes for columns used in WHERE, JOIN, ORDER BY
- Use EXPLAIN ANALYZE before and after changes
- Avoid N+1 queries — prefer JOINs or batch operations
- Consider partial indexes for large tables with common filters

## Naming Conventions
- Tables: snake_case, plural (e.g., `user_profiles`)
- Columns: snake_case (e.g., `created_at`)
- Indexes: `idx_{table}_{column}` (e.g., `idx_users_email`)
- Foreign keys: `fk_{table}_{ref_table}` (e.g., `fk_orders_users`)
- Enums: snake_case, singular (e.g., `order_status`)

## Before Committing
- Run `supabase db diff` to verify migration matches schema
- Check for breaking changes to existing RLS policies
- Verify TypeScript types are regenerated if using typed client
