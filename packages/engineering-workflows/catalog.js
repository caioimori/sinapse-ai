'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = __dirname;
const SCHEMA_VERSION = '1.0.0';
const STOP_WORDS = new Set(['a', 'as', 'o', 'os', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas', 'um', 'uma', 'e', 'ou', 'para', 'por', 'com', 'the', 'and', 'of', 'to', 'for']);
const SYNONYMS = {
  teste: ['test', 'testing', 'tdd'], testes: ['test', 'testing', 'tdd'],
  seguranca: ['security', 'threat'], acessibilidade: ['accessibility', 'wcag'],
  desempenho: ['performance', 'profiling'], custo: ['finops', 'cost'],
  contexto: ['context'], observabilidade: ['observability', 'otel'],
};

function normalizeText(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function assertRecord(value, description) {
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error(`Invalid ${description}`);
}

function validateCatalog(catalog) {
  assertRecord(catalog, 'catalog');
  if (catalog.schemaVersion !== SCHEMA_VERSION) throw new Error('Unsupported engineering catalog schema');
  assertRecord(catalog.source, 'catalog source');
  if (!/^[a-f0-9]{40}$/.test(catalog.source.revision || '') || catalog.source.license !== 'CC-BY-SA-4.0') {
    throw new Error('Invalid catalog source revision/license');
  }
  if (!Array.isArray(catalog.domains) || catalog.domains.length !== 60 || !Array.isArray(catalog.workflows)) {
    throw new Error('Invalid catalog domains/workflows');
  }
  const domains = new Set();
  for (const domain of catalog.domains) {
    if (!/^\d{2}$/.test(domain.id || '') || typeof domain.title !== 'string' || !domain.title.trim() || domains.has(domain.id)) {
      throw new Error('Invalid or duplicate catalog domain');
    }
    domains.add(domain.id);
  }
  const ids = new Set();
  for (const workflow of catalog.workflows) {
    assertRecord(workflow, 'workflow');
    const validId = workflow.kind === 'applied' ? /^applied-w\d{2}$/ : /^wave-\d{2}-w\d{2}$/;
    if (!['canonical', 'applied'].includes(workflow.kind) || !validId.test(workflow.id || '') || ids.has(workflow.id)) {
      throw new Error('Invalid or duplicate workflow ID');
    }
    if (typeof workflow.title !== 'string' || !workflow.title.trim() || typeof workflow.summary !== 'string' || workflow.executionMode !== 'guided') {
      throw new Error(`Invalid workflow contract: ${workflow.id}`);
    }
    if (!Number.isInteger(workflow.wave) || workflow.wave < 0 || workflow.wave > 14 || !Number.isInteger(workflow.number) || workflow.number < 1) {
      throw new Error(`Invalid workflow position: ${workflow.id}`);
    }
    const expectedId = workflow.kind === 'applied' ? `applied-w${String(workflow.number).padStart(2, '0')}` : `wave-${String(workflow.wave).padStart(2, '0')}-w${String(workflow.number).padStart(2, '0')}`;
    if (workflow.id !== expectedId || (workflow.kind === 'applied') !== (workflow.wave === 0)) throw new Error('Workflow ID/position mismatch');
    if (!Array.isArray(workflow.domains) || !workflow.domains.length || workflow.domains.some((id) => !domains.has(id)) || !Array.isArray(workflow.tags) || workflow.tags.some((tag) => typeof tag !== 'string')) {
      throw new Error(`Invalid workflow routing metadata: ${workflow.id}`);
    }
    assertRecord(workflow.source, 'workflow source');
    if (!/^[a-f0-9]{64}$/.test(workflow.source.sha256 || '') || typeof workflow.source.heading !== 'string' || !/^#{1,2} /.test(workflow.source.heading) || typeof workflow.source.path !== 'string' || !workflow.source.path.startsWith(`sources/${catalog.source.revision}/`) || workflow.source.path.includes('\\') || workflow.source.path.split('/').some((part) => ['.', '..', ''].includes(part))) {
      throw new Error(`Invalid workflow source: ${workflow.id}`);
    }
    ids.add(workflow.id);
  }
  const observed = {
    canonical: catalog.workflows.filter((workflow) => workflow.kind === 'canonical').length,
    applied: catalog.workflows.filter((workflow) => workflow.kind === 'applied').length,
    domains: domains.size,
  };
  if (observed.canonical !== 275 || observed.applied !== 10 || Object.keys(observed).some((key) => catalog.stats?.[key] !== observed[key])) {
    throw new Error('Catalog coverage/statistics mismatch');
  }
  return catalog;
}

function loadCatalog(catalogPath = path.join(ROOT, 'catalog.json')) {
  return validateCatalog(JSON.parse(fs.readFileSync(catalogPath, 'utf8')));
}

function getWorkflow(id, catalog = loadCatalog()) {
  if (typeof id !== 'string') throw new Error('Workflow ID must be a string');
  const workflow = catalog.workflows.find((candidate) => candidate.id === id);
  if (!workflow) throw new Error(`Unknown engineering workflow: ${id}`);
  return workflow;
}

function readWorkflow(id, options = {}) {
  const root = options.root || ROOT;
  const catalog = options.catalog || loadCatalog(path.join(root, 'catalog.json'));
  const workflow = getWorkflow(id, catalog);
  const realRoot = fs.realpathSync(root);
  const absolute = fs.realpathSync(path.resolve(realRoot, workflow.source.path));
  if (!absolute.startsWith(`${realRoot}${path.sep}`)) throw new Error('Workflow source escapes catalog root');
  const raw = fs.readFileSync(absolute, 'utf8');
  if (sha256(raw) !== workflow.source.sha256) throw new Error(`Workflow source integrity mismatch: ${id}`);
  const headings = [...raw.matchAll(/^(#{1,2})\s+([^\r\n]+)\r?$/gm)];
  const matches = headings.filter((heading) => heading[0].trimEnd() === workflow.source.heading);
  if (matches.length !== 1) throw new Error(`Workflow heading missing or ambiguous: ${id}`);
  const start = matches[0].index;
  const next = headings.find((heading) => heading.index > start)?.index ?? raw.length;
  return { workflow, markdown: raw.slice(start, next).trim() };
}

function searchWorkflows(query, options = {}) {
  if (typeof query !== 'string' || query.length > 2000) throw new Error('Search query must be a string up to 2000 characters');
  const catalog = options.catalog || loadCatalog();
  const limit = options.limit ?? 5;
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new Error('Search limit must be an integer between 1 and 50');
  if (options.kind !== undefined && !['canonical', 'applied'].includes(options.kind)) throw new Error('Unknown workflow kind');
  const domain = options.domain === undefined ? null : String(options.domain).padStart(2, '0');
  if (domain && !catalog.domains.some((candidate) => candidate.id === domain)) throw new Error('Unknown workflow domain');
  const terms = [...new Set(normalizeText(query).split(/[^a-z0-9]+/).filter((term) => term.length > 1 && !STOP_WORDS.has(term)))];
  const tokens = [...new Set(terms.flatMap((term) => [term, ...(SYNONYMS[term] || [])]))];
  if (!tokens.length && !domain && !options.kind) return [];
  const results = [];
  for (const workflow of catalog.workflows) {
    if ((domain && !workflow.domains.includes(domain)) || (options.kind && options.kind !== workflow.kind)) continue;
    const title = normalizeText(workflow.title);
    const summary = normalizeText(workflow.summary);
    const domainText = normalizeText(catalog.domains.filter((candidate) => workflow.domains.includes(candidate.id)).map((candidate) => candidate.title).join(' '));
    let score = domain ? 1 : 0;
    const reasons = domain ? [`domain:${domain}`] : [];
    for (const token of tokens) {
      if (title.includes(token)) { score += 8; reasons.push(`title:${token}`); }
      else if (summary.includes(token)) { score += 3; reasons.push(`summary:${token}`); }
      else if (domainText.includes(token)) { score += 1; reasons.push(`domain-title:${token}`); }
    }
    if (normalizeText(query).trim() === workflow.id) { score += 100; reasons.push('exact-id'); }
    if (score > 0 || (!tokens.length && options.kind)) results.push({ ...workflow, score, reasons });
  }
  return results.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, limit);
}

module.exports = { SCHEMA_VERSION, loadCatalog, validateCatalog, getWorkflow, readWorkflow, searchWorkflows };
