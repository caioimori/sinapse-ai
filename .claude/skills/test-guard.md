---
name: test-guard
description: Testing quality guidelines — activates automatically when touching test files
paths: ["*.test.*", "*.spec.*", "tests/**", "__tests__/**", "*.test.ts", "*.test.js", "*.spec.ts", "*.spec.js"]
allowed-tools: [Read, Grep, Glob, Bash]
user-invocable: false
---

# Test Quality Guard

When touching test files, follow these guidelines from @quality-gate (Quinn):

## Test Structure
- Use descriptive test names: `it('should return 401 when token is expired')`
- Group related tests with `describe` blocks
- Follow Arrange-Act-Assert pattern
- One assertion per test when possible (multiple assertions only for related checks)

## Coverage Requirements
- New features: minimum 80% line coverage
- Bug fixes: MUST include regression test reproducing the bug
- Edge cases: test null, undefined, empty string, boundary values
- Error paths: test every catch block and error handler

## Anti-Patterns to Avoid
- Never use `any` in test types — type your mocks properly
- Never test implementation details — test behavior
- Never use `sleep` or fixed timeouts — use async/await properly
- Never skip tests without a tracking issue: `it.skip('TODO: fix #123')`
- Never mock what you don't own — use integration tests for external APIs

## Test Naming Convention
- Unit tests: `{module}.test.ts` next to source file
- Integration tests: `tests/integration/{feature}.test.ts`
- E2E tests: `tests/e2e/{flow}.test.ts`

## Before Committing Tests
- Run full test suite: `npm test`
- Check coverage didn't decrease: `npm run test:coverage`
- Verify no flaky tests (run twice if uncertain)
- Ensure tests pass in isolation (`--runInBand` flag)
