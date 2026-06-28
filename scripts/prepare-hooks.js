#!/usr/bin/env node
'use strict';

/*
 * prepare-hooks — runs on `npm install` (the `prepare` lifecycle script).
 *
 * Why this exists: husky's own setup points git `core.hooksPath` at `.husky/_`.
 * E8 ("trava de git real e ativa") makes `.sinapse-ai/git-hooks` the canonical,
 * managed hook entrypoint — its pre-commit runs the SINAPSE guards (secret scan,
 * SQL guard, framework boundary) FIRST and then chains back to `.husky/pre-commit`,
 * so husky's guards still run. Without re-pointing here, every `npm install`
 * silently reverts the managed trava back to husky and the dogfooding parity test
 * (codex-parity-behavioral-smoke) goes red.
 *
 * Fully guarded: a missing husky, missing git, or absent managed dir never breaks
 * `npm install`.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const onWindows = process.platform === 'win32';

// husky is an npm-bin shim, so on Windows it must go through the shell to resolve
// `node_modules/.bin/husky.cmd`. It takes no args, so shell:true carries no
// injection risk here.
function runShell(cmd) {
  try {
    return spawnSync(cmd, [], { stdio: 'inherit', shell: onWindows }).status === 0;
  } catch {
    return false;
  }
}

// git is a real binary spawnable directly — no shell, so args are never
// concatenated into a command string (avoids DEP0190 and any injection surface).
function runDirect(cmd, args) {
  try {
    return spawnSync(cmd, args, { stdio: 'inherit' }).status === 0;
  } catch {
    return false;
  }
}

// 1. Let husky materialize `.husky/_` (this also sets core.hooksPath=.husky/_).
runShell('husky');

// 2. Re-point core.hooksPath at the SINAPSE-managed dir, but only when we are in a
//    real git work tree and the managed hooks are actually present.
const projectRoot = process.cwd();
const managedDir = '.sinapse-ai/git-hooks';
const inGitWorkTree = fs.existsSync(path.join(projectRoot, '.git'));
const managedReady = fs.existsSync(path.join(projectRoot, managedDir, 'pre-commit'));

if (inGitWorkTree && managedReady) {
  runDirect('git', ['config', 'core.hooksPath', managedDir]);
}

// 3. On Unix, ensure the managed hook entrypoints are executable. Git SILENTLY
//    ignores hooks that lack the +x bit, so without this the SINAPSE guards
//    (secret scan, SQL guard, protected-files) would not run on macOS/Linux —
//    they would only fire on Windows (which ignores the bit entirely). The
//    tracked git mode is already 100755, but a Windows-side `npm pack` or a
//    permissive checkout can drop it; this makes the executable bit deterministic.
if (managedReady && !onWindows) {
  for (const hook of ['pre-commit', 'pre-push', 'post-commit']) {
    const hookPath = path.join(projectRoot, managedDir, hook);
    try {
      if (fs.existsSync(hookPath)) {
        fs.chmodSync(hookPath, 0o755);
      }
    } catch {
      // best-effort — never break `npm install` over a chmod
    }
  }
}
