#!/usr/bin/env node
/**
 * validate-article-viii.js — Constitution Article VIII (Mandatory Delegation) gate
 *
 * @story GA-1.5 (Article gates VII/VIII/XI automated)
 *
 * Verifica:
 *   1. `.claude/settings.json` registra `enforce-delegation.cjs` no PreToolUse
 *      (Bash + Write/Edit) — runtime hook esta vivo.
 *   2. `.claude/hooks/enforce-delegation.cjs` existe + sintaxe valida (node --check).
 *   3. Agentes orquestradores (*-orqx.md) NAO contem instrucoes diretas de
 *      execucao. Patterns proibidos:
 *        - "use Edit"  / "use the Edit tool"
 *        - "use Write" / "use the Write tool"
 *        - "execute Bash"  / "execute via Bash"
 *        - "run npm"  / "run `npm"
 *        - "rode `npm" (PT-BR equivalente)
 *
 * Exceptions:
 *   - snps-orqx.md (master orqx): pode descrever exceptions de governance
 *     (fail-open via runtime hook), mas nao deve ter instrucoes de execucao
 *     direta para code/schema/copy.
 *
 * CLI:
 *   node scripts/validate-article-viii.js   # exit 0 / exit 1 + relatorio
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

const HOOK_PATH = path.join(ROOT, '.claude', 'hooks', 'enforce-delegation.cjs');
const SETTINGS_PATH = path.join(ROOT, '.claude', 'settings.json');

// Patterns proibidos em arquivos *-orqx.md (case-insensitive).
// Cada pattern eh um regex que se NAO deve casar.
const FORBIDDEN_PATTERNS = [
  { re: /\buse\s+(the\s+)?Edit\s+tool\b/i, label: 'instrucao direta "use Edit tool"' },
  { re: /\buse\s+(the\s+)?Write\s+tool\b/i, label: 'instrucao direta "use Write tool"' },
  { re: /\bexecute\s+(via\s+)?Bash\b/i, label: 'instrucao direta "execute Bash"' },
  { re: /\brun\s+`?npm\s+(install|run|test|publish)/i, label: 'instrucao direta "run npm ..."' },
  { re: /\brode\s+`?npm\s+(install|run|test|publish)/i, label: 'instrucao direta "rode npm ..."' },
];

// Allowlist: padroes que mencionam OUTROS agentes executando (delegacao OK).
const ALLOWLIST_CONTEXTS = [
  /delegate\s+to/i,
  /delegando\s+(para|pra)/i,
  /@developer/i,
  /@devops/i,
  /MUST\s+delegate/i,
  /never\s+execute/i,
  /nao\s+executa/i,
];

function findOrqxFiles() {
  const out = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && /-orqx\.md$/i.test(entry.name)) out.push(full);
    }
  }
  walk(path.join(ROOT, 'squads'));
  walk(path.join(ROOT, '.sinapse-ai', 'development', 'agents'));
  return out;
}

function lineContext(content, index) {
  const before = content.slice(0, index);
  const lineNum = before.split('\n').length;
  const lineStart = before.lastIndexOf('\n') + 1;
  const lineEnd = content.indexOf('\n', index);
  const line = content.slice(lineStart, lineEnd === -1 ? content.length : lineEnd);
  return { lineNum, line: line.trim() };
}

function checkOrqxFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const findings = [];
  for (const { re, label } of FORBIDDEN_PATTERNS) {
    const globalRe = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    for (const m of content.matchAll(globalRe)) {
      const ctx = lineContext(content, m.index);
      // Skip if line is in a delegation/instruction-to-others context.
      if (ALLOWLIST_CONTEXTS.some((al) => al.test(ctx.line))) continue;
      findings.push({ label, line: ctx.lineNum, snippet: ctx.line });
    }
  }
  return findings;
}

function checkHookRegistered() {
  if (!fs.existsSync(SETTINGS_PATH)) {
    return { ok: false, reason: '.claude/settings.json nao encontrado' };
  }
  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
  } catch (err) {
    return { ok: false, reason: `falha parse settings.json: ${err.message}` };
  }
  const preToolUse = (settings.hooks && settings.hooks.PreToolUse) || [];
  let foundBash = false;
  let foundWriteEdit = false;
  for (const entry of preToolUse) {
    const matcher = (entry.matcher || '').toString();
    const cmds = (entry.hooks || []).map((h) => h.command || '');
    const hasDelegationHook = cmds.some((c) => c.includes('enforce-delegation.cjs'));
    if (!hasDelegationHook) continue;
    if (/Bash/.test(matcher)) foundBash = true;
    if (/Write|Edit/.test(matcher)) foundWriteEdit = true;
  }
  if (!foundBash || !foundWriteEdit) {
    return {
      ok: false,
      reason: `enforce-delegation.cjs nao registrado em todos os matchers necessarios (Bash=${foundBash}, Write/Edit=${foundWriteEdit})`,
    };
  }
  return { ok: true };
}

function checkHookSyntax() {
  if (!fs.existsSync(HOOK_PATH)) {
    return { ok: false, reason: 'enforce-delegation.cjs nao existe' };
  }
  try {
    execSync(`node --check "${HOOK_PATH}"`, { stdio: 'pipe' });
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: `sintaxe invalida: ${err.message}` };
  }
}

function main() {
  console.log('Article VIII (Mandatory Delegation) — validacao runtime + estatica');
  console.log('');

  let failed = false;

  // 1. Hook registered
  const reg = checkHookRegistered();
  if (reg.ok) {
    console.log('  [ok]   enforce-delegation.cjs registrado em .claude/settings.json');
  } else {
    console.log(`  [FAIL] hook nao registrado: ${reg.reason}`);
    failed = true;
  }

  // 2. Hook syntax
  const syn = checkHookSyntax();
  if (syn.ok) {
    console.log('  [ok]   enforce-delegation.cjs sintaxe valida (node --check)');
  } else {
    console.log(`  [FAIL] hook sintaxe: ${syn.reason}`);
    failed = true;
  }

  // 3. Orqx files
  const orqxFiles = findOrqxFiles();
  console.log(`  Verificando ${orqxFiles.length} arquivo(s) *-orqx.md...`);
  let orqxFailed = 0;
  for (const file of orqxFiles) {
    const findings = checkOrqxFile(file);
    if (findings.length === 0) continue;
    orqxFailed += 1;
    failed = true;
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    console.log(`  [FAIL] ${rel}`);
    for (const f of findings) {
      console.log(`         L${f.line}: ${f.label}`);
      console.log(`         > ${f.snippet}`);
    }
  }
  if (orqxFailed === 0) {
    console.log('  [ok]   nenhum orqx contem instrucoes de execucao direta');
  }

  console.log('');

  if (failed) {
    console.log('FALHA — Article VIII NON-NEGOTIABLE violado.');
    console.log('Acao corretiva:');
    console.log('  - Hook nao registrado: reaplicar .claude/settings.json template.');
    console.log('  - Orqx com instrucao direta: substituir por delegacao explicita.');
    console.log('    Ex: "use Edit tool" -> "delegate to @developer who will use Edit".');
    process.exit(1);
  }

  console.log('OK — Article VIII enforcement ativo e orchestrators limpos.');
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { findOrqxFiles, checkOrqxFile, checkHookRegistered, checkHookSyntax };
