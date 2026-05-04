#!/usr/bin/env node
'use strict';

/**
 * Hook: Enforce NSN Mode (Never Say Never) Guard
 *
 * RULE (.claude/rules/nsn-mode.md): Agents must NOT tell the user to
 * manually perform a step that the agent itself could automate via
 * Chrome Brain, MCP, or a direct CLI call. Writing such instructions
 * into docs, stories, or code comments propagates the anti-pattern.
 *
 * Scope: matches `Write` and `Edit` PreToolUse on `.md`, `.mdx`, `.txt`
 * files. Scans the content being written for known NSN violation
 * phrases. Emits a WARN on stderr (exit 0) so the agent can see the
 * feedback but is not hard-blocked — false positives would be more
 * damaging than the leak.
 *
 * Protocol (Claude Code PreToolUse):
 *   exit 0            → allow (with optional stderr warning)
 *   exit 2            → block (reserved for a future strict mode)
 *
 * Fail-open: any parsing error → exit 0 (allow). Reason: a broken
 * guard should never block legitimate writes.
 *
 * @module enforce-nsn-guard
 * @story 10.44 (Fix 3 from pre-GA blockers)
 */

const readStdin = () => new Promise((resolve) => {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (c) => { data += c; });
  process.stdin.on('end', () => resolve(data));
  // Fail-open on timeout — don't hang Claude Code
  setTimeout(() => resolve(data), 4500);
});

const TARGET_TOOLS = new Set(['Write', 'Edit']);
const TARGET_EXTENSIONS = ['.md', '.mdx', '.txt'];

// NSN violation phrases — ordered from high-confidence to lower.
// Written as regexes (case-insensitive) so common morphological
// variants are caught without adding dozens of entries.
const NSN_PATTERNS = [
  {
    id: 'open-dashboard-manually',
    regex: /(abra|abre|you should open|please open)\s+(o\s+)?dashboard.*manual/i,
    hint: 'Agents should offer Chrome Brain before telling users to open a dashboard by hand.',
  },
  {
    id: 'follow-steps-manually',
    regex: /(siga|follow)\s+esses\s+passos\s+manualmente/i,
    hint: 'Replace manual step-lists with an automated Chrome Brain / MCP call.',
  },
  {
    id: 'cannot-access-interface',
    regex: /(infelizmente\s+)?n[ãa]o\s+consigo\s+acessar\s+a\s+interface/i,
    hint: 'NSN Mode: try Chrome Brain, dev-browser, or claude-in-chrome before claiming you cannot access UI.',
  },
  {
    id: 'you-need-to-click',
    regex: /(voc[êe]\s+precisa\s+(abrir|clicar))|(you\s+need\s+to\s+click)/i,
    hint: 'Agents should drive UI clicks via Chrome Brain, not instruct the user.',
  },
  {
    id: 'i-cant-do-this',
    regex: /\b(i\s+can'?t\s+do\s+this|n[ãa]o\s+consigo\s+fazer\s+isso)\b/i,
    hint: 'NSN Mode forbids "I can\'t" without having tried 3+ alternatives first.',
  },
];

async function main() {
  try {
    const raw = await readStdin();
    if (!raw) { process.exit(0); }

    let payload;
    try { payload = JSON.parse(raw); } catch { process.exit(0); }

    const toolName = payload.tool_name || payload.toolName;
    if (!TARGET_TOOLS.has(toolName)) { process.exit(0); }

    const input = payload.tool_input || payload.toolInput || {};
    const filePath = input.file_path || input.filePath || '';
    if (!filePath) { process.exit(0); }

    const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
    if (!TARGET_EXTENSIONS.includes(ext)) { process.exit(0); }

    // Extract the text about to land in the file
    const content = input.content
      || input.new_string
      || input.newString
      || '';
    if (!content || typeof content !== 'string') { process.exit(0); }

    const hits = [];
    for (const pattern of NSN_PATTERNS) {
      if (pattern.regex.test(content)) {
        hits.push(pattern);
      }
    }

    if (hits.length === 0) { process.exit(0); }

    // WARN mode — print hints to stderr so the agent sees them, exit 0.
    const lines = [
      '',
      '[NSN-Guard] Detected NSN Mode anti-patterns in content being written to',
      `  ${filePath}`,
      '',
    ];
    for (const h of hits) {
      lines.push(`  - ${h.id}: ${h.hint}`);
    }
    lines.push('');
    lines.push('Reference: .claude/rules/nsn-mode.md');
    lines.push('');
    process.stderr.write(lines.join('\n'));
    process.exit(0);
  } catch {
    // Fail-open
    process.exit(0);
  }
}

main();
