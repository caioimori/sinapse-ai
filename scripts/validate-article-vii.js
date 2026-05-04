#!/usr/bin/env node
/**
 * validate-article-vii.js — Constitution Article VII (Metrics Accuracy) gate
 *
 * @story GA-1.5 (Article gates VII/VIII/XI automated)
 *
 * Verifica que TODOS os documentos publicos referem aos MESMOS numeros de
 * squads/agentes/orqx/tasks que `.sinapse-ai/constitution.md` (canonico,
 * gerado por `npm run sync:counts`).
 *
 * Documentos verificados:
 *   - README.md
 *   - README.en.md
 *   - AGENTS.md
 *   - package.json (campo "description")
 *   - packages/installer/src/wizard/feedback.js
 *
 * CLI:
 *   node scripts/validate-article-vii.js          # exit 0 / exit 1 + relatorio
 *   node scripts/validate-article-vii.js --fix    # imprime sugestao de remediacao
 *
 * Reusa `scripts/sync-counts.js#collectCounts()` como fonte canonica
 * (NAO duplica logica de contagem).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const { collectCounts } = require('./sync-counts.js');

const ROOT = path.resolve(__dirname, '..');

const TARGETS = [
  { file: 'README.md', label: 'README PT' },
  { file: 'README.en.md', label: 'README EN' },
  { file: 'AGENTS.md', label: 'AGENTS guide' },
  { file: 'package.json', label: 'package.json description', jsonField: 'description' },
  { file: 'packages/installer/src/wizard/feedback.js', label: 'wizard feedback' },
];

/**
 * Build the set of expected numeric tokens that MUST appear consistently.
 * Returns an object describing canonical counts and a regex helper.
 */
function buildExpectations(counts) {
  return {
    squads: counts.squads,
    agents: counts.totalAgents,
    orqx: counts.totalOrqx,
    tasks: counts.tasks,
  };
}

/**
 * Extract numeric counts that look like squads/agents/orqx/tasks claims.
 * Returns drift findings (what the doc claims vs what is canonical).
 */
function findDrift(content, expected) {
  const findings = [];

  // Squads: "<N> squads" or "<N> squad"
  const squadsRe = /\b(\d{1,4})\s+squads?\b/gi;
  for (const m of content.matchAll(squadsRe)) {
    const n = parseInt(m[1], 10);
    if (n !== expected.squads && n >= 5) {
      // Skip very small numbers (likely not a global count)
      findings.push({ kind: 'squads', found: n, expected: expected.squads, snippet: m[0] });
    }
  }

  // Agents/agentes: "<N> agentes" or "<N> agents"
  const agentsRe = /\b(\d{1,4})\s+(agentes|agents)\b/gi;
  for (const m of content.matchAll(agentsRe)) {
    const n = parseInt(m[1], 10);
    if (n !== expected.agents && n >= 50) {
      findings.push({ kind: 'agents', found: n, expected: expected.agents, snippet: m[0] });
    }
  }

  // Tasks (com ou sem separador de milhar): "1.237 tasks", "1,237 tasks", "1237 tasks"
  const tasksRe = /\b(\d{1,3}(?:[.,]\d{3})?|\d{4,5})\s+tasks\b/gi;
  for (const m of content.matchAll(tasksRe)) {
    const raw = m[1].replace(/[.,]/g, '');
    const n = parseInt(raw, 10);
    if (n !== expected.tasks && n >= 100) {
      findings.push({ kind: 'tasks', found: n, expected: expected.tasks, snippet: m[0] });
    }
  }

  return findings;
}

function readTarget(target) {
  const fullPath = path.join(ROOT, target.file);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, 'utf8');
  if (target.jsonField) {
    try {
      const parsed = JSON.parse(raw);
      return parsed[target.jsonField] || '';
    } catch {
      return raw;
    }
  }
  return raw;
}

function main() {
  const args = process.argv.slice(2);
  const fixMode = args.includes('--fix');

  const counts = collectCounts();
  const expected = buildExpectations(counts);

  console.log('Article VII (Metrics Accuracy) — validacao de drift');
  console.log('Numeros canonicos (de .sinapse-ai/constitution.md):');
  console.log(`  squads  ${expected.squads}`);
  console.log(`  agentes ${expected.agents}`);
  console.log(`  orqx    ${expected.orqx}`);
  console.log(`  tasks   ${expected.tasks}`);
  console.log('');

  const allDrifts = [];

  for (const target of TARGETS) {
    const content = readTarget(target);
    if (content === null) {
      console.log(`  [skip] ${target.file} nao encontrado`);
      continue;
    }
    const drift = findDrift(content, expected);
    if (drift.length === 0) {
      console.log(`  [ok]   ${target.file}`);
    } else {
      console.log(`  [DRIFT] ${target.file} (${target.label})`);
      for (const d of drift) {
        console.log(`         ${d.kind}: encontrado "${d.snippet}" — esperado ${d.expected}`);
      }
      allDrifts.push({ target, drift });
    }
  }

  console.log('');

  if (allDrifts.length === 0) {
    console.log('OK — todos os documentos consistentes com os numeros canonicos.');
    process.exit(0);
  }

  console.log(`FALHA — ${allDrifts.length} arquivo(s) com drift de metricas.`);
  console.log('');
  console.log('Acao corretiva (Article VII NON-NEGOTIABLE):');
  console.log('  1. Atualize cada arquivo listado acima com os numeros canonicos.');
  console.log('  2. Rode `npm run sync:counts` para regenerar a constitution.');
  console.log('  3. Rode `npm run validate:article-vii` novamente para confirmar.');

  if (fixMode) {
    console.log('');
    console.log('Sugestao automatica (--fix):');
    for (const { target, drift } of allDrifts) {
      for (const d of drift) {
        console.log(`  sed -i 's/${d.snippet}/${d.expected} ${d.kind}/' ${target.file}`);
      }
    }
  }

  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { findDrift, buildExpectations, TARGETS };
