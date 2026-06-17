#!/usr/bin/env node
'use strict';

/**
 * Behavioral pointer/orphan resolver for the Codex catalog (anti-fachada).
 *
 * The legacy integration validator only COUNTED markdown files: a green check
 * meant "file present", never "file resolves". This module OPENS each Codex
 * agent pointer and RESOLVES it against the real source-of-truth set:
 *
 *   - Core/dev agents:  `.sinapse-ai/development/agents/{id}.md`
 *   - Squad agents:     `squads/{squad}/agents/{id}.md`
 *
 * It detects two failure classes the count-based check is blind to:
 *
 *   1. BROKEN POINTER — a `.codex/agents/*.md` whose "Read the agent definition
 *      at: {path}" target does NOT exist on disk (the squad-claude →
 *      claude-code-mastery rename class), OR a core agent with no pointer line
 *      and no `{id}.md` in the dev agents dir.
 *
 *   2. ORPHAN — a `.codex/agents/*.md` whose stem has no corresponding source
 *      agent anywhere (retired chiefs, brad-frost/dan-mall, etc.). An orphan is
 *      a catalog entry that can never resolve to a real agent.
 *
 * It is intentionally dependency-light (fs only) so the validator never needs
 * the heavier activator wiring to answer "is this catalog honest?".
 */

const fs = require('fs');
const path = require('path');

const POINTER_RE = /Read the agent definition at:\s*(\S+)/i;

function listMarkdown(dirAbs) {
  try {
    return fs.readdirSync(dirAbs).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
}

function fileExists(absPath) {
  try {
    return fs.statSync(absPath).isFile();
  } catch {
    return false;
  }
}

/**
 * Build the canonical source set: every agent that actually has a definition
 * on disk, keyed by its file stem.
 *   stem -> { stem, sourcePath, squad|null }
 */
function buildSourceIndex(projectRoot, config = {}) {
  const index = new Map();

  const devAgentsRel = config.canonicalAgentsDir || '.sinapse-ai/development/agents';
  for (const file of listMarkdown(path.join(projectRoot, devAgentsRel))) {
    const stem = file.replace(/\.md$/, '');
    index.set(stem, { stem, sourcePath: `${devAgentsRel}/${file}`, squad: null });
  }

  const squadsRel = config.squadsDir || 'squads';
  const squadsAbs = path.join(projectRoot, squadsRel);
  let squadDirs = [];
  try {
    squadDirs = fs
      .readdirSync(squadsAbs)
      .filter((d) => {
        try {
          return fs.statSync(path.join(squadsAbs, d)).isDirectory();
        } catch {
          return false;
        }
      });
  } catch {
    squadDirs = [];
  }
  for (const squad of squadDirs) {
    const agentsRel = `${squadsRel}/${squad}/agents`;
    for (const file of listMarkdown(path.join(projectRoot, agentsRel))) {
      const stem = file.replace(/\.md$/, '');
      // First squad wins; a later duplicate stem is still a real source.
      if (!index.has(stem)) {
        index.set(stem, { stem, sourcePath: `${agentsRel}/${file}`, squad });
      }
    }
  }

  return index;
}

/**
 * Resolve every Codex agent pointer against the source index.
 * Returns { brokenPointers[], orphans[], resolved[], total }.
 */
function resolveCatalog(projectRoot = process.cwd(), config = {}) {
  const codexAgentsRel = config.codexAgentsDir || '.codex/agents';
  const codexAgentsAbs = path.join(projectRoot, codexAgentsRel);
  const devAgentsRel = config.canonicalAgentsDir || '.sinapse-ai/development/agents';

  const sourceIndex = buildSourceIndex(projectRoot, config);

  const brokenPointers = [];
  const orphans = [];
  const resolved = [];

  const codexFiles = listMarkdown(codexAgentsAbs);

  for (const file of codexFiles) {
    const stem = file.replace(/\.md$/, '');
    const pointerRel = `${codexAgentsRel}/${file}`;
    let raw = '';
    try {
      raw = fs.readFileSync(path.join(codexAgentsAbs, file), 'utf8');
    } catch {
      raw = '';
    }

    const m = raw.match(POINTER_RE);
    let target = m ? m[1].trim().replace(/\r$/, '') : null;

    // Core/dev agents may omit the pointer line and resolve by id convention.
    if (!target && fileExists(path.join(projectRoot, `${devAgentsRel}/${stem}.md`))) {
      target = `${devAgentsRel}/${stem}.md`;
    }

    // ORPHAN: stem has no source agent anywhere in the ecosystem.
    if (!sourceIndex.has(stem)) {
      orphans.push({ id: stem, pointer: pointerRel, target });
      continue;
    }

    // BROKEN: no pointer target at all, or the declared target file is missing.
    if (!target) {
      brokenPointers.push({ id: stem, pointer: pointerRel, target: null, reason: 'no pointer line' });
      continue;
    }
    if (!fileExists(path.join(projectRoot, target))) {
      brokenPointers.push({ id: stem, pointer: pointerRel, target, reason: 'target missing' });
      continue;
    }

    resolved.push({ id: stem, pointer: pointerRel, target });
  }

  return {
    brokenPointers,
    orphans,
    resolved,
    total: codexFiles.length,
    sourceCount: sourceIndex.size,
  };
}

module.exports = {
  buildSourceIndex,
  resolveCatalog,
  POINTER_RE,
};
