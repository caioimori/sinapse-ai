#!/usr/bin/env node
/**
 * verify-packages.cjs — Slopsquatting Prevention Hook
 *
 * Blocks `npm install`/`npm add` commands that reference packages
 * not found on the npm registry. Prevents installation of hallucinated
 * (fabricated) packages that attackers may register with malicious code.
 *
 * Research: 19.7% of packages recommended by LLMs are fabricated.
 * Source: arXiv study, 576K samples across 16 models.
 *
 * Hook type: PreToolUse (Bash)
 * Exit 0 = allow, Exit 2 = block
 */
'use strict';

const { execSync } = require('child_process');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => { input += d; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = (data.tool_input && data.tool_input.command) || '';

    // Only check direct npm install/add commands (not text in PR bodies, etc.)
    // Skip if command is gh, curl, echo, or other non-npm commands
    const trimmed = command.trim();
    if (trimmed.startsWith('gh ') || trimmed.startsWith('curl ') || trimmed.startsWith('echo ')) process.exit(0);
    const installMatch = trimmed.match(/^npm\s+(install|add|i)\s+(.+)/m);
    if (!installMatch) process.exit(0);

    const argsStr = installMatch[2];

    // Extract package names, skipping flags (--save-dev, -D, etc.)
    const tokens = argsStr.split(/\s+/).filter(t => !t.startsWith('-'));
    if (tokens.length === 0) process.exit(0);

    const failed = [];
    for (const token of tokens) {
      // Strip version specifier: pkg@1.0.0 -> pkg, @org/pkg@^2 -> @org/pkg
      let pkgName;
      if (token.startsWith('@')) {
        // Scoped package: @org/pkg@version
        const slashIdx = token.indexOf('/');
        if (slashIdx === -1) continue; // malformed, skip
        const afterSlash = token.substring(slashIdx + 1);
        const atIdx = afterSlash.indexOf('@');
        pkgName = atIdx > 0
          ? token.substring(0, slashIdx + 1 + atIdx)
          : token;
      } else {
        const atIdx = token.indexOf('@');
        pkgName = atIdx > 0 ? token.substring(0, atIdx) : token;
      }

      // Skip if it looks like a local path or URL
      if (pkgName.startsWith('.') || pkgName.startsWith('/') || pkgName.includes('://')) continue;
      if (pkgName.endsWith('.tgz') || pkgName.endsWith('.tar.gz')) continue;

      try {
        execSync(`npm view "${pkgName}" name`, { timeout: 8000, stdio: 'pipe' });
      } catch {
        failed.push(pkgName);
      }
    }

    if (failed.length > 0) {
      const names = failed.map(n => `'${n}'`).join(', ');
      const msg = failed.length === 1
        ? `BLOCKED: Package ${names} not found on npm. This may be a hallucinated package (slopsquatting).`
        : `BLOCKED: Packages ${names} not found on npm. These may be hallucinated packages (slopsquatting).`;
      process.stderr.write(msg + '\n');
      process.exit(2);
    }

    process.exit(0);
  } catch {
    // Fail-open: if hook crashes, allow the operation
    process.exit(0);
  }
});
