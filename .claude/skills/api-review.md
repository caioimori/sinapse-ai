---
name: api-review
description: API and edge function review guidelines — activates when touching API routes or server functions
paths: ["**/api/**", "**/routes/**", "supabase/functions/**", "pages/api/**", "app/api/**"]
allowed-tools: [Read, Grep, Glob, Bash]
user-invocable: false
---

# API & Edge Function Review

When touching API routes or server functions, follow these guidelines:

## Security (OWASP Top 10)
- Validate ALL user input at the boundary (Zod preferred)
- Never trust client-side data — re-validate on server
- Sanitize output to prevent XSS
- Use parameterized queries — never string concatenation for SQL
- Implement rate limiting for public endpoints
- Check authentication AND authorization on every protected route

## Error Handling
- Return consistent error shapes: `{ error: string, code: string, details?: unknown }`
- Use appropriate HTTP status codes (400 client error, 500 server error)
- Never expose internal error details to clients (stack traces, DB errors)
- Log detailed errors server-side, return generic messages client-side

## Request/Response
- Validate request body with Zod schema
- Type the response explicitly
- Return early on validation failures (guard clauses)
- Set appropriate CORS headers

## Edge Functions (Supabase)
- Import from `https://deno.land/` or `npm:` specifiers
- Use `Deno.serve()` pattern
- Always return `new Response()` — never throw unhandled
- Set `Access-Control-Allow-Origin` in headers
- Handle OPTIONS preflight requests

## Performance
- Implement caching where appropriate (Cache-Control headers)
- Use database connection pooling
- Paginate list endpoints (default limit: 20, max: 100)
- Avoid N+1 queries — use JOINs or batch fetching

## Documentation
- Document endpoint in architecture docs BEFORE implementation
- Include request/response examples
- Document error codes and their meanings
- Note rate limits and authentication requirements
