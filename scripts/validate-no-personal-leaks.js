#!/usr/bin/env node

/**
 * validate-no-personal-leaks.js
 *
 * Story master-audit-2026-05-06 / Wave 2 / PR-8.
 *
 * Scans the repository for personal references that leak the framework
 * maintainer's private context into the public/multi-tenant codebase.
 * Fails (exit 1) if any operational personal reference is found outside
 * an explicit allow-list.
 *
 * Why this exists:
 * SINAPSE-AI is a multi-tenant framework distributed via npm. Any reference
 * to the maintainer's personal context (vault path, decision-maker name in
 * operational text, hardcoded machine paths) breaks the multi-tenant promise
 * and confuses external users.
 *
 * Source of truth: `git ls-files` (matches what actually ships).
 *
 * What's allowed (legitimate authorship/history):
 *   - README/CONTRIBUTING/LICENSE — author credit, copyright
 *   - CHANGELOG.md — historical record (immutable)
 *   - docs/audits/* — audit reports document historical decisions
 *   - docs/epics/* — archived plans
 *   - docs/research/* — research synthesis
 *   - package.json — author field
 *   - .github/CODEOWNERS — username refs
 *
 * What's blocked (operational personal context):
 *   - "Caio approval", "awaiting Caio", "Caio decision" — operational
 *   - "Caio's Second Brain", "Caio's vault" — vault path references
 *   - "C:\\Users\\Caio Imori" — absolute paths
 *   - "OneDrive\\...\\Second-Brain" — vault path references
 *
 * SECOND CHECK — Conceptual leak guard (Wave 2):
 * The literal "Caio" check above misses CONCEPTUAL internal leaks: the
 * maintainer's private grounding mechanisms (vault-grounding, second-brain,
 * brandbook) and the maintainer's BUSINESS CLIENT names (Módulo, Mindloop,
 * Sayuri, Vascularte, itsoffbrand, sinapse.club). These are internal/business
 * context and must NOT appear on the surfaces an external user actually sees:
 * the installer, the CLI, and the public docs the npm package ships.
 *
 * This second check is SCOPED ONLY to user-facing surfaces (CONCEPT_SCOPES):
 *   packages/installer/**, bin/**, README.md, docs/getting-started.md,
 *   docs/pt/**, docs/en/**.
 * It deliberately does NOT scan .sinapse-ai/development/**, squad agent files,
 * or internal docs — those legitimately discuss framework concepts.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// Files/dirs allowed to contain personal references (autoria/histórico)
const ALLOWLIST_PATHS = [
  'README.md',
  'README.en.md',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'CHANGELOG.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'package.json',
  'package-lock.json',
  '.github/CODEOWNERS',
  '.github/FUNDING.yml',
];

const ALLOWLIST_PREFIXES = [
  'docs/audits/',
  'docs/epics/',
  'docs/research/',
  'docs/plans/archived/',
  'docs/qa/',
  'docs/community/',
  'docs/legal/',
  'docs/stories/',
  'scripts/validate-no-personal-leaks.js', // self-allow (this file)
  'tests/scripts/validate-no-personal-leaks', // tests for this
];

// Regex patterns for operational personal context (BLOCKED)
// Each pattern is paired with a friendly description for the error report
const BLOCKED_PATTERNS = [
  {
    pattern: /Caio('s)? (approval|decision|override|briefing|directive)\b/i,
    description: 'Operational reference to Caio as decision-maker',
    suggestion: 'Use "maintainer" or "project owner" instead',
  },
  {
    pattern: /awaiting Caio\b/i,
    description: 'Operational reference awaiting Caio',
    suggestion: 'Use "awaiting maintainer" instead',
  },
  {
    pattern: /Caio('s)? (Second[- ]Brain|vault|second brain)/i,
    description: 'Reference to maintainer\'s personal vault',
    suggestion: 'Generalize to "external memory source (e.g. Obsidian vault)"',
  },
  {
    pattern: /C:\\Users\\Caio[ ]?Imori/i,
    description: 'Absolute Windows path containing maintainer name',
    suggestion: 'Use {REPO_ROOT} placeholder or relative paths',
  },
  {
    pattern: /OneDrive[\\/].*Caio[ ]?Imori/i,
    description: 'OneDrive path containing maintainer name',
    suggestion: 'Remove or use {VAULT_ROOT} placeholder',
  },
  {
    pattern: /Caio can (reactivate|activate|approve|reject|merge|deploy)/i,
    description: 'Caio described as actor in operational text',
    suggestion: 'Use "maintainer" or "user" instead',
  },
];

function isAllowed(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (ALLOWLIST_PATHS.includes(normalized)) return true;
  return ALLOWLIST_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

// ---------------------------------------------------------------------------
// SECOND CHECK — Conceptual leak guard (user-facing surfaces only).
// ---------------------------------------------------------------------------

// The ONLY surfaces an external user sees: the installer, the CLI, and the
// public docs that ship in the npm package. A concept/business leak here is a
// real leak. Everything else (framework internals, squad agents, internal
// docs) is intentionally OUT of scope.
const CONCEPT_FILE_SCOPES = new Set(['README.md', 'docs/getting-started.md']);
// The atlas SOURCE (hand-authored "how SINAPSE works" flows/renderers) is a
// public surface and must describe the framework generically — never naming the
// maintainer's private grounding (Second Brain vault, personal/client DS). Only
// the source is scoped here, NOT the generated output (docs/framework/atlas/*),
// which aggregates squad/workflow descriptions that legitimately use generic
// deliverable terms like "brandbook".
const CONCEPT_PREFIX_SCOPES = [
  'packages/installer/', 'bin/', 'docs/pt/', 'docs/en/', '.sinapse-ai/core/atlas/',
];

function isConceptScoped(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (CONCEPT_FILE_SCOPES.has(normalized)) return true;
  return CONCEPT_PREFIX_SCOPES.some((prefix) => normalized.startsWith(prefix));
}

// Conceptual / business denylist. Each entry is paired with a friendly
// description. Patterns are written to catch the INTERNAL token while avoiding
// generic-word false positives:
//   - "Módulo" alone is the generic Portuguese word for "module" (capitalized
//     and accented in prose/headings: "Módulo Core", "Estrutura de Módulo"),
//     so it CANNOT be used to identify the client. The maintainer's client
//     "Colégio Módulo" is matched ONLY by its full, unambiguous name —
//     "Colégio Módulo" / "Colegio Modulo".
//   - The other client names (Mindloop, Sayuri, Vascularte, itsoffbrand) and
//     the grounding concepts (vault-grounding, second-brain, brandbook) are
//     distinctive enough to match as whole words.
const CONCEPT_PATTERNS = [
  {
    pattern: /\bvault-grounding\b/i,
    description: 'Internal grounding mechanism (vault-grounding) leaked to user-facing surface',
    suggestion: 'Describe generically (e.g. "a session-start grounding hook") — do not name the private mechanism',
  },
  {
    pattern: /\bsecond[ -]brain\b/i,
    description: "Maintainer's private knowledge base (Second Brain) leaked to user-facing surface",
    suggestion: 'Generalize to "knowledge base" / "external memory source" — do not name the private vault',
  },
  {
    pattern: /\bbrandbook\b/i,
    description: "Maintainer's internal design-system concept (brandbook) leaked to user-facing surface",
    suggestion: 'Use a generic term like "design system" or "brand guidelines"',
  },
  {
    pattern: /Col[ée]gio\s+M[óÓoO]dulo/,
    description: "Maintainer's business client name (Colégio Módulo) leaked to user-facing surface",
    suggestion: 'Remove the client name; use a neutral placeholder (e.g. "your client")',
  },
  {
    pattern: /\bMindloop\b/i,
    description: "Maintainer's business client name (Mindloop) leaked to user-facing surface",
    suggestion: 'Remove the client name; use a neutral placeholder',
  },
  {
    pattern: /\bSayuri\b/i,
    description: "Maintainer's business client name (Sayuri) leaked to user-facing surface",
    suggestion: 'Remove the client name; use a neutral placeholder',
  },
  {
    pattern: /\bVascularte\b/i,
    description: "Maintainer's business client name (Vascularte) leaked to user-facing surface",
    suggestion: 'Remove the client name; use a neutral placeholder',
  },
  {
    pattern: /\bitsoffbrand\b/i,
    description: "Maintainer's business client name (itsoffbrand) leaked to user-facing surface",
    suggestion: 'Remove the client name; use a neutral placeholder',
  },
  {
    pattern: /\bsinapse\.club\b/i,
    description: "Maintainer's internal/business property (sinapse.club) leaked to user-facing surface",
    suggestion: 'Remove the internal domain reference',
  },
];

function scanFileForConcepts(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return [];
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const violations = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of CONCEPT_PATTERNS) {
      const match = line.match(rule.pattern);
      if (match) {
        violations.push({
          file: filePath,
          line: i + 1,
          match: match[0],
          description: rule.description,
          suggestion: rule.suggestion,
          context: line.trim().slice(0, 120),
        });
      }
    }
  }
  return violations;
}

function isTextFile(filePath) {
  const binaryExts = new Set([
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    '.zip', '.tar', '.gz', '.7z',
    '.pdf', '.exe', '.dll', '.so', '.dylib',
    '.mp4', '.webm', '.mp3', '.wav',
  ]);
  const ext = path.extname(filePath).toLowerCase();
  return !binaryExts.has(ext);
}

function getTrackedFiles() {
  const out = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' });
  return out.split('\n').filter(Boolean);
}

function scanFile(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return [];
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const violations = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of BLOCKED_PATTERNS) {
      const match = line.match(rule.pattern);
      if (match) {
        violations.push({
          file: filePath,
          line: i + 1,
          match: match[0],
          description: rule.description,
          suggestion: rule.suggestion,
          context: line.trim().slice(0, 120),
        });
      }
    }
  }
  return violations;
}

function run() {
  const files = getTrackedFiles();
  const allViolations = [];
  const conceptViolations = [];

  for (const file of files) {
    if (!isTextFile(file)) continue;

    // CHECK 1 — operational personal references ("Caio" literals, paths).
    // Scanned across the whole tree except the autorship/history allow-list.
    if (!isAllowed(file)) {
      allViolations.push(...scanFile(file));
    }

    // CHECK 2 — conceptual / business leaks, scoped ONLY to user-facing
    // surfaces (installer, CLI, public docs the package ships).
    if (isConceptScoped(file)) {
      conceptViolations.push(...scanFileForConcepts(file));
    }
  }

  if (allViolations.length === 0 && conceptViolations.length === 0) {
    console.log('✅ no-personal-leaks: no operational personal or conceptual references found.');
    console.log(`   Scanned ${files.length} tracked files (concept guard scoped to user-facing surfaces).`);
    return 0;
  }

  if (allViolations.length > 0) {
    console.error('');
    console.error('❌ no-personal-leaks: found operational personal references in framework code.');
    console.error('');
    console.error(`   ${allViolations.length} violation(s) across ${new Set(allViolations.map((v) => v.file)).size} file(s).`);
    console.error('');
    for (const v of allViolations) {
      console.error(`  ${v.file}:${v.line}`);
      console.error(`    Match:       "${v.match}"`);
      console.error(`    Issue:       ${v.description}`);
      console.error(`    Suggestion:  ${v.suggestion}`);
      console.error(`    Context:     ${v.context}`);
      console.error('');
    }
    console.error('Why this matters:');
    console.error('  SINAPSE-AI is a multi-tenant framework distributed via npm.');
    console.error('  Personal/operational context belongs in ~/.claude/ (private),');
    console.error('  not in the public framework code.');
    console.error('');
    console.error('Exempt locations (allowed):');
    console.error('  README/CONTRIBUTING/LICENSE — author credit');
    console.error('  CHANGELOG.md — historical record');
    console.error('  docs/audits/, docs/epics/, docs/research/ — historical/archive');
    console.error('');
  }

  if (conceptViolations.length > 0) {
    console.error('');
    console.error('❌ no-personal-leaks (concept guard): found internal/business references on user-facing surfaces.');
    console.error('');
    console.error(`   ${conceptViolations.length} violation(s) across ${new Set(conceptViolations.map((v) => v.file)).size} file(s).`);
    console.error('');
    for (const v of conceptViolations) {
      console.error(`  ${v.file}:${v.line}`);
      console.error(`    Match:       "${v.match}"`);
      console.error(`    Issue:       ${v.description}`);
      console.error(`    Suggestion:  ${v.suggestion}`);
      console.error(`    Context:     ${v.context}`);
      console.error('');
    }
    console.error('Why this matters:');
    console.error('  These surfaces (installer, CLI, public docs) are what an external');
    console.error('  user actually sees. Internal grounding concepts and the maintainer\'s');
    console.error('  business client names must never leak into them.');
    console.error('');
  }

  return 1;
}

if (require.main === module) {
  process.exit(run());
}

module.exports = {
  run,
  BLOCKED_PATTERNS,
  isAllowed,
  CONCEPT_PATTERNS,
  isConceptScoped,
  scanFileForConcepts,
};
