# Code Review Checklist

> Purpose: Structured code review for consistency and quality
> Used by: @quality-gate, @developer (self-review)
> When: During QA gate or PR review
> Source: git-workflows research (section 6), software engineering research

## Architecture Alignment

- [ ] Changes align with architectural decisions (Clean/DDD/Hexagonal as applicable)
- [ ] No new circular dependencies introduced
- [ ] Absolute imports used (no relative `../..` paths)
- [ ] File/folder structure follows project conventions

## SOLID Principles

- [ ] Single Responsibility: each function/class has one reason to change
- [ ] Open/Closed: extended without modifying existing code where possible
- [ ] Liskov Substitution: subtypes are substitutable for base types
- [ ] Interface Segregation: no unused interface methods forced on implementers
- [ ] Dependency Inversion: depends on abstractions, not concretions

## Code Quality

- [ ] No `any` types in TypeScript (use `unknown` + type guards)
- [ ] Error handling follows project pattern (try/catch with logger)
- [ ] No hardcoded values (use constants or config)
- [ ] Naming is clear and follows conventions (PascalCase, camelCase, kebab-case)
- [ ] No dead code or commented-out code

## Testing

- [ ] New code has corresponding tests
- [ ] Tests cover happy path + edge cases
- [ ] Tests are deterministic (no flaky tests)
- [ ] Mocks are appropriate (integration tests hit real DB when required)

## Security (OWASP Top 10)

- [ ] No SQL injection (parameterized queries or ORM)
- [ ] No XSS (output encoding, CSP headers)
- [ ] No path traversal (validate file paths)
- [ ] Authentication/authorization on new endpoints
- [ ] Rate limiting on public endpoints

## Performance

- [ ] No N+1 queries
- [ ] Large lists are paginated
- [ ] Heavy operations are async/non-blocking
- [ ] No unnecessary re-renders (React memo/useMemo where needed)

## AI-Specific (for AI-generated code)

- [ ] Logic is correct (AI may hallucinate edge cases)
- [ ] Approach aligns with architecture decisions (not just "works")
- [ ] No phantom packages imported (verify all imports exist)
- [ ] Business logic matches story acceptance criteria

---
*Based on software engineering research (section 4) + git-workflows (section 6)*
