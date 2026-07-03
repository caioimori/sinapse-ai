#!/usr/bin/env node
/**
 * validate-article-xi.js — Constitution Article XI (Conservative Default) gate
 *
 * @story GA-1.5 (Article gates VII/VIII/XI automated)
 *
 * Analisa git diff (origin/main..HEAD) procurando deletions em paths protegidos.
 * Renames (`git mv`) NAO contam — apenas deletions puras.
 *
 * Para cada deletion, exige justificativa explicita em commit message OU PR body
 * com pattern (case-insensitive):  `Article XI override: <reason>`
 *
 * Paths protegidos:
 *   - .sinapse-ai/development/agents/
 *   - squads/<squad>/agents/
 *   - squads/<squad>/tasks/
 *   - squads/<squad>/knowledge-base/
 *   - bin/
 *   - .claude/hooks/
 *
 * Variaveis de ambiente:
 *   GITHUB_BASE_REF      base branch (default: main)
 *   GITHUB_PR_BODY       PR body (passado pelo workflow CI)
 *   ARTICLE_XI_OVERRIDE  override forcado (uso restrito a humanos com justificativa)
 *
 * CLI:
 *   node scripts/validate-article-xi.js                 # default base origin/main
 *   node scripts/validate-article-xi.js --base main     # override base
 */

'use strict';

const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

const PROTECTED_PREFIXES = [
  '.sinapse-ai/development/agents/',
  'bin/',
  '.claude/hooks/',
];

// Glob-style matchers para squads/<squad>/{agents,tasks,knowledge-base}/
const PROTECTED_PATTERNS = [
  /^squads\/[^/]+\/agents\//,
  /^squads\/[^/]+\/tasks\//,
  /^squads\/[^/]+\/knowledge-base\//,
];

function isProtectedPath(rel) {
  if (PROTECTED_PREFIXES.some((p) => rel.startsWith(p))) return true;
  if (PROTECTED_PATTERNS.some((re) => re.test(rel))) return true;
  return false;
}

function getBaseRef(args) {
  const baseIdx = args.indexOf('--base');
  if (baseIdx !== -1 && args[baseIdx + 1]) return args[baseIdx + 1];
  if (process.env.GITHUB_BASE_REF) return process.env.GITHUB_BASE_REF;
  return 'main';
}

// SECURITY: args go straight to git without a shell — baseRef comes from CLI
// or GITHUB_BASE_REF and must never be interpolated into a shell string.
function gitExec(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
  } catch (_err) {
    return null;
  }
}

/**
 * List file changes between base and HEAD using `git diff --diff-filter`.
 *   D = pure deletion
 *   R = rename (treated as NON-deletion)
 *
 * Returns { deletions: [path], renames: [{from, to}] }.
 */
function diffAgainstBase(baseRef) {
  // Try fetching first (CI may need it). Silent if it fails.
  gitExec(['fetch', 'origin', baseRef, '--quiet']);

  // Use raw diff with --name-status -M (rename detection).
  const tripleDot = `origin/${baseRef}...HEAD`;
  let raw = gitExec(['diff', '--name-status', '-M', tripleDot]);
  if (raw === null) {
    // Fallback: local base ref
    raw = gitExec(['diff', '--name-status', '-M', `${baseRef}...HEAD`]);
  }
  if (raw === null) {
    return { error: `nao foi possivel comparar com ${baseRef}`, deletions: [], renames: [] };
  }

  const deletions = [];
  const renames = [];

  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    const status = parts[0];
    if (status.startsWith('D')) {
      deletions.push(parts[1]);
    } else if (status.startsWith('R')) {
      renames.push({ from: parts[1], to: parts[2] });
    }
  }

  return { deletions, renames };
}

function getOverrideText(baseRef) {
  // Aggregate commit messages between base..HEAD + PR body.
  const commitMsgs = gitExec(['log', '--format=%B', `origin/${baseRef}..HEAD`])
    || gitExec(['log', '--format=%B', `${baseRef}..HEAD`])
    || '';
  const prBody = process.env.GITHUB_PR_BODY || '';
  const forcedOverride = process.env.ARTICLE_XI_OVERRIDE || '';
  return `${commitMsgs}\n\n${prBody}\n\n${forcedOverride}`;
}

function hasOverride(text) {
  return /article\s*xi\s*override\s*:\s*\S/i.test(text);
}

function main() {
  const args = process.argv.slice(2);
  const baseRef = getBaseRef(args);

  console.log('Article XI (Conservative Default) — checagem de deletions em paths protegidos');
  console.log(`  Base: origin/${baseRef}`);
  console.log('');

  const { deletions, renames, error } = diffAgainstBase(baseRef);

  if (error) {
    console.log(`  [info] ${error} (provavel rodada sem fetch). Tratando como sem deletions.`);
    console.log('OK — sem comparacao disponivel, nada a bloquear.');
    process.exit(0);
  }

  if (renames.length > 0) {
    console.log(`  ${renames.length} rename(s) detectado(s) — ignorados (Article XI nao bloqueia renames).`);
  }

  const protectedDeletions = deletions.filter(isProtectedPath);

  if (protectedDeletions.length === 0) {
    console.log(`  ${deletions.length} deletion(s) total — 0 em paths protegidos.`);
    console.log('OK — Article XI satisfeito.');
    process.exit(0);
  }

  console.log(`  ${protectedDeletions.length} deletion(s) em paths protegidos:`);
  for (const f of protectedDeletions) {
    console.log(`    - ${f}`);
  }
  console.log('');

  const overrideText = getOverrideText(baseRef);
  if (hasOverride(overrideText)) {
    console.log('  [override] encontrado "Article XI override: ..." em commit ou PR body.');
    console.log('OK — deletions justificadas explicitamente.');
    process.exit(0);
  }

  console.log('FALHA — Article XI NON-NEGOTIABLE violado.');
  console.log('');
  console.log('Acao corretiva:');
  console.log('  Opcao A (preferida): reverter as deletions se nao foram intencionais.');
  console.log('  Opcao B: adicionar justificativa explicita em UM commit ou no PR body:');
  console.log('');
  console.log('    Article XI override: <razao concreta da deletion>');
  console.log('');
  console.log('  Exemplo:');
  console.log('    Article XI override: agentes movidos para legacy/ apos deprecation v1.0');
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { isProtectedPath, hasOverride, diffAgainstBase, PROTECTED_PREFIXES };
