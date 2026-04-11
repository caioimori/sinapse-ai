# Checklist: Code Review

> Purpose: Systematic review of code changes for quality, security, and architecture
> Used by: @quality-gate (Litmus), @developer (Pixel, self-review)
> When: During PR review or pre-commit QA gate

---

## Design & Architecture

- [ ] Change is well-designed and belongs in this codebase
- [ ] Follows project architecture pattern (Clean Architecture / Modular Monolith)
- [ ] Dependency direction correct (outer depends on inner, never reverse)
- [ ] No circular dependencies introduced
- [ ] Absolute imports used (no relative `../..` paths)
- [ ] REUSE > ADAPT > CREATE principle followed (IDS check)
- [ ] New abstractions are justified and documented

## SOLID Principles

- [ ] Single Responsibility: each class/function does one thing
- [ ] Open/Closed: extended via composition, not modification of existing code
- [ ] Liskov Substitution: subtypes are substitutable for base types
- [ ] Interface Segregation: no fat interfaces forcing unused implementations
- [ ] Dependency Inversion: high-level modules depend on abstractions

## Functionality & Correctness

- [ ] Code does what the author intended (matches story AC)
- [ ] Edge cases handled (empty inputs, max values, null/undefined)
- [ ] Error handling follows project pattern (try/catch with logger)
- [ ] No race conditions in async code
- [ ] State management is consistent (no stale state bugs)

## Security (OWASP Top 10)

- [ ] No hardcoded secrets, API keys, or credentials
- [ ] User input validated and sanitized (Zod schema preferred)
- [ ] No SQL injection vectors (parameterized queries only)
- [ ] No XSS vulnerabilities (outputs properly escaped, CSP headers)
- [ ] No path traversal (validate file paths)
- [ ] RLS policies reviewed if database changes included
- [ ] CORS restricted to known origins (no wildcard `*` in production)
- [ ] Rate limiting on new public endpoints
- [ ] Sensitive data not logged or exposed in error messages

## Test Coverage

- [ ] Unit tests added for new functions/methods
- [ ] Edge cases have corresponding test cases
- [ ] Error scenarios tested (failure paths, not just happy path)
- [ ] Tests are deterministic (no flaky tests)
- [ ] Integration tests added for cross-module interactions
- [ ] Test coverage not decreased by this change
- [ ] Mocks are appropriate (integration tests use real DB when needed)

## Performance

- [ ] No N+1 query patterns introduced
- [ ] Database queries use indexes on filtered columns
- [ ] Large lists are paginated
- [ ] No unnecessary re-renders in React components (memo/useMemo)
- [ ] Bundle size impact considered (no large new dependencies)
- [ ] Animations use GPU-accelerated properties (transform, opacity)
- [ ] Heavy operations are async/non-blocking

## Accessibility

- [ ] Semantic HTML used (proper heading hierarchy, landmarks)
- [ ] Interactive elements have keyboard support
- [ ] ARIA labels on non-text interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Focus management correct for dynamic content

## Code Quality

- [ ] Names are clear, descriptive, and follow conventions
- [ ] No `any` types in TypeScript (use `unknown` + type guards)
- [ ] Comments explain WHY, not WHAT
- [ ] No commented-out code or dead code
- [ ] No console.log or debugger statements
- [ ] No magic numbers (use named constants)
- [ ] Imports follow project order (React > external > internal > styles)

## AI-Specific (for AI-generated code)

- [ ] Logic is correct (AI may hallucinate edge cases)
- [ ] Approach aligns with architecture decisions (not just "works")
- [ ] No phantom packages imported (verify all imports exist)
- [ ] Business logic matches story acceptance criteria
- [ ] Co-Authored-By trailer present in commits

## Review Comment Protocol

| Prefix | Meaning | Blocking? |
|--------|---------|-----------|
| `nit:` | Style preference | No |
| `suggestion:` | Alternative approach | No |
| `question:` | Needs clarification | No |
| `issue:` | Must fix before merge | Yes |
| `blocker:` | Critical problem | Yes |
| `praise:` | Excellent work | No |

---

*Code Review Checklist v1.0 — Sources: Google eng-practices, OWASP Top 10, SOLID, WCAG*
