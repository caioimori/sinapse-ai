#!/usr/bin/env node
/**
 * validate-article-vii.js — Constitution Article VII (Metrics Accuracy) gate
 *
 * @story GA-1.5 (Article gates VII/VIII/XI automated)
 *
 * Verifica que TODOS os documentos publicos referem aos MESMOS numeros de
 * squads/agentes/orqx/tasks medidos pelas fontes canonicas em disco. Contagens
 * gerais reutilizam `sync-counts`; o detalhamento resolvivel usa o ativador
 * parametrico do Codex.
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
const { execFileSync } = require('child_process');

const { collectCounts } = require('./sync-counts.js');
const { validateProviderAdapters } = require('./validate-provider-adapters.js');

const ROOT = path.resolve(__dirname, '..');
const CONSTITUTION = path.join(ROOT, '.sinapse-ai', 'constitution.md');
const CODEX_RESOLVER = path.join(ROOT, '.codex', 'scripts', 'resolve-codex-agent.js');

/**
 * Count Constitution articles + NON-NEGOTIABLE ones from the canonical source.
 * Articles are `### <Roman>. <Title>` headings; NON-NEGOTIABLE ones carry the
 * `(NON-NEGOTIABLE)` marker in the heading. This is what was drifting in the
 * README ("10 articles" while the constitution had 11) with no guard — now there
 * is one.
 * @returns {{articles:number, nonNegotiable:number}}
 */
function collectConstitutionCounts() {
  let articles = 0;
  let nonNegotiable = 0;
  try {
    const md = fs.readFileSync(CONSTITUTION, 'utf8');
    const headings = md.match(/^###\s+[IVXLC]+\.\s.*$/gm) || [];
    articles = headings.length;
    nonNegotiable = headings.filter((h) => /\(NON-NEGOTIABLE\)/.test(h)).length;
  } catch {
    // Missing/unreadable constitution → leave zeros; the guards below are no-ops.
  }
  return { articles, nonNegotiable };
}

const TARGETS = [
  { file: 'README.md', label: 'README PT', requireTaskBreakdown: true },
  { file: 'README.en.md', label: 'README EN', requireTaskBreakdown: true },
  { file: 'AGENTS.md', label: 'AGENTS guide' },
  { file: 'docs/getting-started.md', label: 'Getting started' },
  { file: 'docs/troubleshooting.md', label: 'Troubleshooting' },
  { file: 'docs/agent-reference-guide.md', label: 'Agent reference EN', requireAgentTotal: true, requireTaskBreakdown: true },
  { file: 'docs/pt/agent-reference-guide.md', label: 'Agent reference PT', requireAgentTotal: true, requireTaskBreakdown: true },
  { file: 'docs/guides/user-guide.md', label: 'User guide EN', requireAgentTotal: true },
  { file: 'docs/guides/squads-overview.md', label: 'Squads overview' },
  { file: 'docs/pt/guides/user-guide.md', label: 'User guide PT', requireAgentTotal: true },
  { file: 'docs/guides/codex-config.md', label: 'Codex configuration guide' },
  { file: 'docs/guides/ide-integration.md', label: 'IDE integration guide', requireProviderBreakdown: true },
  { file: 'docs/guides/project-status-feature.md', label: 'Project status guide EN', requireAgentTotal: true },
  { file: 'docs/pt/guides/project-status-feature.md', label: 'Project status guide PT', requireAgentTotal: true },
  { file: 'docs/installation/README.md', label: 'Installation index' },
  { file: 'docs/installation/faq.md', label: 'Installation FAQ' },
  { file: 'docs/installation/troubleshooting.md', label: 'Installation troubleshooting' },
  { file: 'docs/installation/v4-quick-start.md', label: 'Installation quick start' },
  { file: 'docs/pt/installation/README.md', label: 'Installation index PT' },
  { file: 'docs/pt/installation/faq.md', label: 'Installation FAQ PT' },
  { file: 'docs/pt/installation/troubleshooting.md', label: 'Installation troubleshooting PT' },
  { file: 'docs/pt/installation/v4-quick-start.md', label: 'Installation quick start PT' },
  { file: 'package.json', label: 'package.json description', jsonField: 'description' },
  { file: 'packages/installer/src/wizard/feedback.js', label: 'wizard feedback' },
];

function collectRuntimeTaskCounts(options = {}) {
  const execute = options.execFileSync || execFileSync;
  const resolverPath = options.resolverPath || CODEX_RESOLVER;
  const timeout = options.timeoutMs ?? 10_000;
  if (!Number.isInteger(timeout) || timeout <= 0) {
    throw new Error('parametric resolver timeout must be a positive integer');
  }
  let raw;
  try {
    raw = execute(process.execPath, [resolverPath, '--stats'], {
      cwd: ROOT,
      encoding: 'utf8',
      timeout,
    });
  } catch (error) {
    throw new Error(`cannot execute the parametric resolver: ${error.message}`);
  }

  let stats;
  try {
    stats = JSON.parse(raw);
  } catch (error) {
    throw new Error(`parametric resolver returned malformed JSON: ${error.message}`);
  }

  const fields = {
    squadTasks: stats.squadTaskFiles,
    developmentTasks: stats.devTaskFiles,
    totalTasks: stats.totalTaskFiles,
    resolvableTasks: stats.resolvableTaskPointers,
  };
  for (const [name, value] of Object.entries(fields)) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`parametric resolver field ${name} must be a positive integer`);
    }
  }
  if (fields.totalTasks !== fields.squadTasks + fields.developmentTasks) {
    throw new Error('parametric resolver totalTaskFiles does not equal squadTaskFiles + devTaskFiles');
  }
  if (fields.resolvableTasks > fields.totalTasks) {
    throw new Error('parametric resolver resolvableTaskPointers exceeds totalTaskFiles');
  }
  if (
    options.expectedSquadTasks !== undefined &&
    fields.squadTasks !== options.expectedSquadTasks
  ) {
    throw new Error(
      `parametric resolver squadTaskFiles ${fields.squadTasks} does not match ` +
      `sync-counts tasks ${options.expectedSquadTasks}`,
    );
  }
  return fields;
}

function countHookRegistrations(settings, label) {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    throw new Error(`${label} hook settings must be an object`);
  }
  const hooks = settings.hooks;
  if (!hooks || typeof hooks !== 'object' || Array.isArray(hooks)) {
    throw new Error(`${label} hook settings are missing hooks`);
  }
  let count = 0;
  for (const groups of Object.values(hooks)) {
    if (!Array.isArray(groups)) throw new Error(`${label} hook groups must be arrays`);
    for (const group of groups) {
      if (!group || !Array.isArray(group.hooks)) {
        throw new Error(`${label} hook registration is malformed`);
      }
      count += group.hooks.length;
    }
  }
  if (count === 0) throw new Error(`${label} hook settings contain no registrations`);
  return count;
}

function collectProviderSurfaceCounts(options = {}) {
  const validateProviders = options.validateProviderAdapters || validateProviderAdapters;
  const readJson = options.readJson || ((filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8')));
  const result = validateProviders(ROOT);
  if (!result || result.ok !== true || !result.metrics) {
    const detail = result && Array.isArray(result.errors) ? result.errors.join('; ') : 'invalid result';
    throw new Error(`provider adapter validation failed: ${detail}`);
  }
  const claudeSkills = result.metrics.claudeSkills;
  const codexSkills = result.metrics.codexSkills;
  for (const [name, value] of Object.entries({ claudeSkills, codexSkills })) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`provider metric ${name} must be a positive integer`);
    }
  }
  const claudeHooks = countHookRegistrations(
    readJson(path.join(ROOT, '.claude', 'settings.json')),
    'Claude',
  );
  const codexSettings = readJson(path.join(ROOT, '.codex', 'hooks.json'));
  if (
    !codexSettings ||
    typeof codexSettings !== 'object' ||
    !codexSettings.hooks ||
    typeof codexSettings.hooks !== 'object' ||
    Array.isArray(codexSettings.hooks) ||
    Object.values(codexSettings.hooks).some((groups) => !Array.isArray(groups))
  ) {
    throw new Error('Codex hook settings are malformed');
  }
  const codexHookEvents = Object.keys(codexSettings.hooks).length;
  if (codexHookEvents === 0) {
    throw new Error('Codex hook settings contain no lifecycle events');
  }
  return { claudeSkills, codexSkills, claudeHooks, codexHookEvents };
}

/**
 * Build the set of expected numeric tokens that MUST appear consistently.
 * Returns an object describing canonical counts and a regex helper.
 */
function buildExpectations(
  counts,
  constitution = { articles: 0, nonNegotiable: 0 },
  runtimeTasks = {},
  providerSurfaces = {},
) {
  return {
    squads: counts.squads,
    agents: counts.totalAgents,
    orqx: counts.totalOrqx,
    tasks: counts.tasks,
    squadTasks: runtimeTasks.squadTasks ?? counts.tasks,
    developmentTasks: runtimeTasks.developmentTasks ?? 0,
    totalTasks: runtimeTasks.totalTasks ?? counts.tasks,
    resolvableTasks: runtimeTasks.resolvableTasks ?? 0,
    claudeSkills: providerSurfaces.claudeSkills ?? 0,
    codexSkills: providerSurfaces.codexSkills ?? 0,
    claudeHooks: providerSurfaces.claudeHooks ?? 0,
    codexHookEvents: providerSurfaces.codexHookEvents ?? 0,
    articles: constitution.articles,
    nonNegotiable: constitution.nonNegotiable,
  };
}

function parseMetric(raw) {
  return parseInt(String(raw).replace(/[.,]/g, ''), 10);
}

function metricPattern(value) {
  const digits = String(value);
  if (digits.length <= 3) return digits;
  return `${digits}|${digits.slice(0, -3)}[.,]${digits.slice(-3)}`;
}

/**
 * Extract numeric counts that look like squads/agents/orqx/tasks claims.
 * Returns drift findings (what the doc claims vs what is canonical).
 */
function findDrift(content, expected, options = {}) {
  const findings = [];

  // Squads: "<N> squads" or "<N> squad"
  const squadsRe = /(?<![\d.,])(\d{1,4})\s+squads?\b/gi;
  for (const m of content.matchAll(squadsRe)) {
    const n = parseInt(m[1], 10);
    if (n !== expected.squads && n >= 5) {
      // Skip very small numbers (likely not a global count)
      findings.push({ kind: 'squads', found: n, expected: expected.squads, snippet: m[0] });
    }
  }

  // Agents/agentes: "<N> agentes" or "<N> agents"
  const agentsRe = /(?<![\d.,])(\d{1,4})\s+(agentes|agents)\b/gi;
  for (const m of content.matchAll(agentsRe)) {
    const n = parseInt(m[1], 10);
    if (n !== expected.agents && n >= 50) {
      findings.push({ kind: 'agents', found: n, expected: expected.agents, snippet: m[0] });
    }
  }

  const scopedTaskPatterns = [
    { kind: 'squad tasks', expected: expected.squadTasks, re: /(?<![\d.,])(\d{1,3}(?:[.,]\d{3})?|\d{4,5})\s+squad\s+tasks\b/gi },
    { kind: 'development tasks', expected: expected.developmentTasks, re: /(?<![\d.,])(\d{1,3}(?:[.,]\d{3})?|\d{4,5})\s+development\s+tasks\b/gi },
    { kind: 'total task files', expected: expected.totalTasks, re: /(?<![\d.,])(\d{1,3}(?:[.,]\d{3})?|\d{4,5})\s+task\s+files\b/gi },
    { kind: 'resolvable task pointers', expected: expected.resolvableTasks, re: /(?<![\d.,])(\d{1,3}(?:[.,]\d{3})?|\d{4,5})\s+(?:ponteiros|pointers)[^.\n]{0,30}resolv/gi },
  ];
  for (const metric of scopedTaskPatterns) {
    if (!metric.expected) continue;
    for (const m of content.matchAll(metric.re)) {
      const n = parseMetric(m[1]);
      if (n !== metric.expected) {
        findings.push({ kind: metric.kind, found: n, expected: metric.expected, snippet: m[0].trim() });
      }
    }
  }

  // Generic task claims may refer to squad, development, total, or resolvable
  // files. Scoped phrases above enforce the meaning of each metric.
  const tasksRe = /(?<![\d.,])(\d{1,3}(?:[.,]\d{3})?|\d{4,5})\s+tasks\b/gi;
  const acceptedTaskCounts = new Set([
    expected.squadTasks,
    expected.developmentTasks,
    expected.totalTasks,
    expected.resolvableTasks,
  ].filter(Boolean));
  for (const m of content.matchAll(tasksRe)) {
    const n = parseMetric(m[1]);
    if (!acceptedTaskCounts.has(n) && n >= 100) {
      findings.push({ kind: 'tasks', found: n, expected: expected.totalTasks, snippet: m[0] });
    }
  }

  if (options.requireTaskBreakdown) {
    const required = [
      ['squad tasks', expected.squadTasks, 'squad\\s+tasks'],
      ['development tasks', expected.developmentTasks, 'development\\s+tasks'],
      ['total task files', expected.totalTasks, 'task\\s+files'],
      ['resolvable task pointers', expected.resolvableTasks, '(?:ponteiros|pointers)[^.\\n]{0,30}resolv'],
    ];
    for (const [kind, value, suffix] of required) {
      if (!value) continue;
      const re = new RegExp(`\\b(?:${metricPattern(value)})\\s+${suffix}`, 'i');
      if (!re.test(content)) {
        findings.push({ kind: `${kind} (missing)`, found: null, expected: value, snippet: 'claim ausente' });
      }
    }
  }

  const skillsClaim = content.match(/(?:Skills\s+instaladas|Installed\s+skills)\s*\|\s*(\d+)\s*\|\s*(\d+)/i);
  if (skillsClaim) {
    for (const [kind, found, wanted] of [
      ['Claude skills', Number(skillsClaim[1]), expected.claudeSkills],
      ['Codex skills', Number(skillsClaim[2]), expected.codexSkills],
    ]) {
      if (wanted && found !== wanted) findings.push({ kind, found, expected: wanted, snippet: skillsClaim[0] });
    }
  }
  const hooksClaim = content.match(/(?:Hooks\s+registrados|Registered\s+hooks)\s*\|\s*(\d+)\s+(?:registros|native\s+registrations)[^|]*\|\s*(\d+)\s+(?:eventos|lifecycle\s+events)/i);
  if (hooksClaim) {
    for (const [kind, found, wanted] of [
      ['Claude hook registrations', Number(hooksClaim[1]), expected.claudeHooks],
      ['Codex hook events', Number(hooksClaim[2]), expected.codexHookEvents],
    ]) {
      if (wanted && found !== wanted) findings.push({ kind, found, expected: wanted, snippet: hooksClaim[0] });
    }
  }
  const hookProseRe = /(?<![\d.,])(\d{1,3})\s+(?:Claude\s+Code\s+hook\s+registrations?|hooks?\s+(?:registrados?|ativos?)|(?:(?:active|registered|enforcement)\s+)(?:(?:Claude(?:\s+Code)?|native(?:\s+Claude(?:\s+Code)?)?)\s+)?hooks|hooks)\b/gi;
  for (const claim of content.matchAll(hookProseRe)) {
    const found = Number(claim[1]);
    if (expected.claudeHooks && found !== expected.claudeHooks) {
      findings.push({
        kind: 'Claude hook registrations',
        found,
        expected: expected.claudeHooks,
        snippet: claim[0],
      });
    }
  }
  const codexLifecycleProseRe = /(?<![\d.,])(\d{1,3})\s+(?:(?:Codex\s+)?lifecycle\s+events?|eventos\s+de\s+lifecycle)\b/gi;
  for (const claim of content.matchAll(codexLifecycleProseRe)) {
    const found = Number(claim[1]);
    if (expected.codexHookEvents && found !== expected.codexHookEvents) {
      findings.push({
        kind: 'Codex hook events',
        found,
        expected: expected.codexHookEvents,
        snippet: claim[0],
      });
    }
  }
  if (options.requireProviderBreakdown) {
    if (!skillsClaim) findings.push({ kind: 'provider skills (missing)', found: null, expected: `${expected.claudeSkills}/${expected.codexSkills}`, snippet: 'claim ausente' });
    if (!hooksClaim) findings.push({ kind: 'provider hooks (missing)', found: null, expected: `${expected.claudeHooks}/${expected.codexHookEvents}`, snippet: 'claim ausente' });
  }

  if (options.requireAgentTotal) {
    const expectedAgentPattern = metricPattern(expected.agents);
    const agentClaim = new RegExp(
      '(?:SINAPSE\\s+(?:includes|inclui)|O\\s+SINAPSE\\s+inclui)[^.\\n]{0,40}' +
      `\\b(?:${expectedAgentPattern})\\s+(?:specialized\\s+agents|agentes\\s+especializados)`,
      'i',
    );
    if (!agentClaim.test(content)) {
      findings.push({
        kind: 'global agent total (missing)',
        found: null,
        expected: expected.agents,
        snippet: 'claim ausente',
      });
    }
  }

  // Constitution total articles: "<N> artigos"/"<N> articles" NOT immediately
  // part of a NON-NEGOTIABLE clause, plus the shields.io badge
  // "Constitution-<N>%20articles". Guards the exact drift that slipped through
  // before (README said "10 articles" while the constitution had 11).
  if (expected.articles) {
    const artRe = /\b(\d{1,2})\s+(?:artigos|articles)\b(?![^.\n]{0,40}NON-NEGOTIABLE)/gi;
    for (const m of content.matchAll(artRe)) {
      const n = parseInt(m[1], 10);
      if (n !== expected.articles && n >= 5) {
        findings.push({ kind: 'articles', found: n, expected: expected.articles, snippet: m[0].trim() });
      }
    }
    const badgeRe = /Constitution-(\d{1,2})%20articles/gi;
    for (const m of content.matchAll(badgeRe)) {
      const n = parseInt(m[1], 10);
      if (n !== expected.articles) {
        findings.push({ kind: 'articles (badge)', found: n, expected: expected.articles, snippet: m[0] });
      }
    }
  }

  // Constitution NON-NEGOTIABLE article count: "<N> (desses|of those) artigos
  // sao/are NON-NEGOTIABLE".
  if (expected.nonNegotiable) {
    const nnRe = /\b(\d{1,2})\s+(?:(?:desses|de|of\s+those)\s+)?(?:artigos|articles)\s+(?:sao|são|are)\s+NON-NEGOTIABLE/gi;
    for (const m of content.matchAll(nnRe)) {
      const n = parseInt(m[1], 10);
      if (n !== expected.nonNegotiable) {
        findings.push({ kind: 'NON-NEGOTIABLE articles', found: n, expected: expected.nonNegotiable, snippet: m[0].trim() });
      }
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
  const constitution = collectConstitutionCounts();
  let runtimeTasks;
  let providerSurfaces;
  try {
    runtimeTasks = collectRuntimeTaskCounts({ expectedSquadTasks: counts.tasks });
    providerSurfaces = collectProviderSurfaceCounts();
  } catch (error) {
    console.error(`FALHA - nao foi possivel medir as metricas canonicas: ${error.message}`);
    process.exit(1);
  }
  const expected = buildExpectations(counts, constitution, runtimeTasks, providerSurfaces);

  console.log('Article VII (Metrics Accuracy) — validacao de drift');
  console.log('Numeros canonicos (medidos das fontes em disco):');
  console.log(`  squads          ${expected.squads}`);
  console.log(`  agentes         ${expected.agents}`);
  console.log(`  orqx            ${expected.orqx}`);
  console.log(`  squad tasks     ${expected.squadTasks}`);
  console.log(`  dev tasks       ${expected.developmentTasks}`);
  console.log(`  task files      ${expected.totalTasks}`);
  console.log(`  resolvable      ${expected.resolvableTasks}`);
  console.log(`  skills C/Codex  ${expected.claudeSkills}/${expected.codexSkills}`);
  console.log(`  hooks C/Codex   ${expected.claudeHooks}/${expected.codexHookEvents}`);
  console.log(`  artigos         ${expected.articles}`);
  console.log(`  NON-NEGOTIABLE  ${expected.nonNegotiable}`);
  console.log('');

  const allDrifts = [];

  for (const target of TARGETS) {
    const content = readTarget(target);
    if (content === null) {
      console.log(`  [skip] ${target.file} nao encontrado`);
      continue;
    }
    const drift = findDrift(content, expected, {
      requireTaskBreakdown: target.requireTaskBreakdown === true,
      requireProviderBreakdown:
        target.requireTaskBreakdown === true || target.requireProviderBreakdown === true,
      requireAgentTotal: target.requireAgentTotal === true,
    });
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
  console.log('  2. Se o inventario mudou, rode `npm run sync:counts`.');
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

module.exports = {
  findDrift,
  buildExpectations,
  collectConstitutionCounts,
  collectRuntimeTaskCounts,
  collectProviderSurfaceCounts,
  countHookRegistrations,
  TARGETS,
};
