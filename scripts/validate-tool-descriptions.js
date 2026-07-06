#!/usr/bin/env node
/**
 * Lint guard: tool/command descriptions (Story M2-mesa M3, AF-20260704 #9a).
 *
 * A command an agent exposes IS a tool, and its `description:` is the contract
 * that drives selection (KIT-ai-engineering, Tool Use). A vague, empty, or
 * placeholder description silently degrades routing. This guard enforces a
 * minimal clarity contract on every `description:` field in the agent
 * definitions, and is wired into `validate:all`.
 *
 * Exit 0 = all descriptions valid · Exit 1 = one or more violate the contract.
 *
 * The core is a pure function (`lintDescriptions`) so tests can drive it with
 * fixtures; the CLI wrapper globs the default targets.
 *
 * @module scripts/validate-tool-descriptions
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

/** Default lint targets: the framework agent definitions (source of truth). */
const DEFAULT_TARGET_DIRS = ['.sinapse-ai/development/agents'];

/** Minimum characters for a meaningful description (smallest real one is 12). */
const MIN_LEN = 8;

/** Values that are placeholders, not real descriptions. */
const PLACEHOLDER = /^(todo|tbd|fixme|x{2,}|placeholder|custom|n\/?a|desc|description|\.\.\.|-+|\?+)$/i;

/**
 * The WHOLE value is nothing but a template token — e.g. `{description}` or
 * `<desc>`. Inline braces documenting command args (e.g. "Build story
 * (*build {story-id})") are legitimate and must NOT be flagged.
 */
const TEMPLATE_ONLY = /^[{<][^}>]*[}>]$/;

/** A YAML block-scalar indicator — the real text follows on indented lines. */
const BLOCK_SCALAR = /^[|>][+-]?\d*$/;

/** Recursively collect `.md` files under a directory. */
function walkMarkdown(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkMarkdown(p, out);
    else if (e.name.toLowerCase().endsWith('.md')) out.push(p);
  }
  return out;
}

/** Strip a single layer of matching quotes from a YAML scalar. */
function unquote(s) {
  const t = s.trim();
  if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

/**
 * Lint `description:` fields in the given files.
 * @param {string[]} files
 * @returns {Array<{file:string, line:number, value:string, reason:string}>}
 */
function lintDescriptions(files) {
  const violations = [];
  for (const file of files) {
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split(/\r?\n/);
    lines.forEach((raw, i) => {
      const m = raw.match(/^\s*description:\s*(.*)$/);
      if (!m) return;
      const rawValue = m[1].trim();
      // Block scalars (`description: |`) carry the text on the following indented
      // lines — treat as valid rather than flag the indicator itself.
      if (BLOCK_SCALAR.test(rawValue)) return;
      const value = unquote(rawValue);
      let reason = null;
      if (value === '') reason = 'descrição vazia';
      else if (PLACEHOLDER.test(value)) reason = `placeholder ("${value}")`;
      else if (TEMPLATE_ONLY.test(value)) reason = `template não preenchido ("${value}")`;
      else if (value.length < MIN_LEN) reason = `curta demais (<${MIN_LEN} chars): "${value}"`;
      if (reason) {
        violations.push({ file: path.relative(ROOT, file), line: i + 1, value, reason });
      }
    });
  }
  return violations;
}

/** Resolve the files to lint: explicit args, or the default target dirs. */
function collectFiles(args) {
  if (args.length) return args;
  return DEFAULT_TARGET_DIRS.flatMap((d) => walkMarkdown(path.join(ROOT, d)));
}

function main() {
  const files = collectFiles(process.argv.slice(2));
  const violations = lintDescriptions(files);
  if (violations.length === 0) {
    console.log(`OK — tool/command descriptions valid (${files.length} files scanned).`);
    process.exit(0);
  }
  console.error(`FAIL — ${violations.length} description(s) violate the clarity contract:`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} — ${v.reason}`);
  }
  process.exit(1);
}

if (require.main === module) main();

module.exports = { lintDescriptions, unquote, walkMarkdown, MIN_LEN };
