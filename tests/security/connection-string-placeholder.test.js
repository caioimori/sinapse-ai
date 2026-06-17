/**
 * Secret scanner — connection-string credential allowlist + line-bounding (E9).
 *
 * Locks in two fixes that let the publish-time secret gate (bin/utils/validate-
 * publish.js) scan the whole package without false-positiving on documentation:
 *   1. credentialPlaceholderGated — a connection string whose password slot is a
 *      placeholder/interpolation (${VAR}, <pass>, SCREAMING_SNAKE, your-pass…) is
 *      a template/example, not a leaked credential.
 *   2. line-bounded user/password — the negated classes no longer span newlines,
 *      so a bare `proto://host` followed by an unrelated ':' and '@' on later
 *      lines can't form a bogus cross-file match.
 * A REAL credential (random/literal password) must still be flagged.
 */
'use strict';

const path = require('path');
const core = require(
  path.join(__dirname, '..', '..', '.sinapse-ai', 'git-hooks', 'lib', 'secret-scanner-core.js'),
);

const names = (content) =>
  core.scanContent(content, { filePath: 'doc.md', entropy: false }).map((f) => f.name);

describe('connection-string placeholder allowlist (E9)', () => {
  test('env-var interpolation password is NOT flagged', () => {
    const url = 'mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/db';
    expect(names(url)).not.toContain('DB Connection String');
  });

  test('angle-bracket placeholder password is NOT flagged', () => {
    expect(names('postgres://user:<password>@host:5432/app')).not.toContain('DB Connection String');
  });

  test('SCREAMING_SNAKE placeholder password is NOT flagged', () => {
    expect(names('mysql://USER:DB_PASSWORD@HOST:3306/app')).not.toContain('DB Connection String');
  });

  test('a REAL literal password IS flagged', () => {
    expect(names('postgres://admin:hunter2RealPass@prod-db.internal/app')).toContain('DB Connection String');
  });

  test('a bare protocol URL with placeholder tail does not false-match across lines', () => {
    const doc = [
      'Example: `DATABASE_URL: "postgres://..."`',
      '',
      'Then later, unrelated config:',
      '  timeout: 30',
      '  email: ops@example.com',
    ].join('\n');
    expect(names(doc)).not.toContain('DB Connection String');
  });
});
