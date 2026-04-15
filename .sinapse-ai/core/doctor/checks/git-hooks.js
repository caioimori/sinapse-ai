/**
 * Doctor Check: Git Hooks
 *
 * Validates .husky/pre-commit and .husky/pre-push exist.
 *
 * @module sinapse-ai/doctor/checks/git-hooks
 * @story INS-4.1
 */

const path = require('path');
const fs = require('fs');

const name = 'git-hooks';

const EXPECTED_HOOKS = ['pre-commit', 'pre-push'];

async function run(context) {
  const huskyDir = path.join(context.projectRoot, '.husky');

  if (!fs.existsSync(huskyDir)) {
    return {
      check: name,
      status: 'WARN',
      message: '.husky directory not found',
      fixCommand: 'npx husky init',
    };
  }

  const missing = EXPECTED_HOOKS.filter(
    (hook) => !fs.existsSync(path.join(huskyDir, hook)),
  );

  if (missing.length === 0) {
    return {
      check: name,
      status: 'PASS',
      message: `${EXPECTED_HOOKS.join(' + ')} installed`,
      fixCommand: null,
    };
  }

  return {
    check: name,
    status: 'WARN',
    message: `Missing hooks: ${missing.join(', ')}`,
    fixCommand: 'npx husky init',
  };
}

// Story A.3: git hooks rely on a git repo + husky install. Neither is
// guaranteed on a fresh global install, so exceptions are treated as WARN.
const onError = 'warn';

module.exports = { name, run, onError };

