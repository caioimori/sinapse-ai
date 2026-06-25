#!/usr/bin/env node
'use strict';

/**
 * Hook: Doc-First Gate — Constitution Article III (Documentation-First), hard floor
 *
 * Strengthens `enforce-story-gate.cjs`. The story-gate blocks code writes when no
 * Ready story exists — but a single stray Ready story unlocks everything, and it
 * never requires a PRD or an epic. This gate closes that hole for the case that
 * matters most: a BRAND-NEW project being coded with zero planning ("criar um
 * site" → straight to code).
 *
 * Rule (deterministic, reuses doc-first-resolver):
 *   Block a code-path Write/Edit when ALL of:
 *     - it is NOT the SINAPSE framework's own repo (framework dev is above the
 *       story layer — Art. III exception), AND
 *     - the project is GREENFIELD (no package.json, no app code yet), AND
 *     - the doc-first gate is NOT satisfied (missing PRD / epic / Ready story).
 *   Existing projects are deferred to enforce-story-gate (no over-blocking).
 *
 * Escape hatch: set SINAPSE_SKIP_DOCFIRST=1 for a legitimate exception. The gate
 * is never a prison — it makes you conscious, not stuck.
 *
 * Protocol (Claude Code PreToolUse): exit 0 = allow, exit 2 = block.
 * Fail-OPEN: any parse/require/uncertainty error → allow (never blocks on a bug).
 *
 * @module doc-first-gate
 */

const fs = require('fs');
const path = require('path');

/** Paths that require doc-first before code changes (mirror enforce-story-gate). */
const CODE_PATHS = [
  'packages/', 'src/', 'app/', 'lib/', 'bin/',
  'components/', 'pages/', 'api/', 'services/',
];

/** Paths always exempt. */
const EXEMPT_PATHS = [
  '.claude/', '.sinapse-ai/', '.sinapse/', '.sinapse-custom/',
  'docs/', 'tests/', '__tests__/', 'test/',
  'node_modules/', '.git/', 'squads/', 'outputs/',
];

/** Config files always exempt (scaffolding a project is allowed pre-docs). */
const EXEMPT_FILES = [
  'package.json', 'package-lock.json', 'tsconfig.json',
  '.env', '.env.local', '.env.example',
  '.gitignore', '.eslintrc', '.prettierrc',
  'README.md', 'CHANGELOG.md',
  'jest.config.js', 'jest.config.ts',
  'vite.config.ts', 'next.config.js', 'next.config.mjs',
  'tailwind.config.js', 'tailwind.config.ts',
  'postcss.config.js', 'postcss.config.cjs',
];

function projectRoot() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

function relativize(filePath, root) {
  const normalized = filePath.replace(/\\/g, '/');
  const normalizedRoot = root.replace(/\\/g, '/');
  if (normalized.startsWith(normalizedRoot)) {
    return normalized.slice(normalizedRoot.length).replace(/^\/+/, '');
  }
  return normalized;
}

function isExempt(rel) {
  if (EXEMPT_FILES.includes(path.basename(rel))) return true;
  return EXEMPT_PATHS.some((ep) => rel.startsWith(ep));
}

function isCodePath(rel) {
  return CODE_PATHS.some((cp) => rel.startsWith(cp));
}

function main() {
  // Escape hatch — explicit, honest, never a prison.
  if (process.env.SINAPSE_SKIP_DOCFIRST) process.exit(0);

  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    process.exit(0); // fail-open
  }

  const toolName = input.tool_name || '';
  if (toolName !== 'Write' && toolName !== 'Edit' && toolName !== 'MultiEdit') {
    process.exit(0);
  }

  const filePath = (input.tool_input || {}).file_path || '';
  if (!filePath) process.exit(0);

  const root = projectRoot();
  const rel = relativize(filePath, root);

  if (isExempt(rel)) process.exit(0);
  if (!isCodePath(rel)) process.exit(0);

  // Load the shared resolver (single source of truth with `sinapse route`).
  // Try the project's installed copy first; fall back to the copy next to this
  // hook (same path in a real install — `.claude/hooks` and `.sinapse-ai` are
  // siblings — but lets the gate work when the project root is being created).
  let resolveDocFirstState;
  const resolverCandidates = [
    path.join(root, '.sinapse-ai', 'core', 'orchestration', 'doc-first-resolver.js'),
    path.join(__dirname, '..', '..', '.sinapse-ai', 'core', 'orchestration', 'doc-first-resolver.js'),
  ];
  for (const candidate of resolverCandidates) {
    try {
      ({ resolveDocFirstState } = require(candidate));
      break;
    } catch {
      // try next candidate
    }
  }
  if (typeof resolveDocFirstState !== 'function') {
    process.exit(0); // resolver not installed / unreadable → fail-open
  }

  let state;
  try {
    state = resolveDocFirstState({ projectRoot: root });
  } catch {
    process.exit(0); // fail-open
  }

  // Framework's own repo: development is above the story layer (Art. III exception).
  if (state.maturity && state.maturity.isFrameworkRepo) process.exit(0);

  // Gate already satisfied → allow.
  if (state.gate && state.gate.satisfied) process.exit(0);

  // Existing project (has code) → defer to enforce-story-gate; don't over-block.
  if (!state.maturity || !state.maturity.isGreenfield) process.exit(0);

  // Greenfield + unsatisfied gate → BLOCK.
  const missing = (state.gate && state.gate.missing) || ['PRD', 'epic', 'story'];
  process.stderr.write(
    '\nDOCUMENTATION-FIRST BLOCK (Constitution Article III) — new project\n' +
      `File: ${rel}\n` +
      `Missing before any code: ${missing.join(', ')}.\n` +
      'A brand-new project must have its planning documents first:\n' +
      `  • run the ${state.workflow || 'greenfield'} flow → project brief → PRD → epic → stories\n` +
      '  • see exactly what is missing: sinapse route "<what you are building>"\n' +
      'Legitimate exception (rare): set SINAPSE_SKIP_DOCFIRST=1.\n',
  );
  process.exit(2);
}

main();
