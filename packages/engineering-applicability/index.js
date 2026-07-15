'use strict';

const crypto = require('crypto');

const SCHEMA_VERSION = '1.0.0';
const ENUMS = Object.freeze({
  projectType: ['brownfield', 'greenfield'],
  surfaces: ['api', 'database', 'frontend'],
  changeKind: ['feature', 'fix', 'infrastructure', 'migration', 'release'],
  dataClasses: ['confidential', 'personal', 'public', 'restricted'],
  deploymentTargets: ['cloud', 'edge', 'mobile', 'on-premise', 'web'],
  reversibility: ['conditional', 'irreversible', 'reversible'],
  risk: ['critical', 'high', 'low', 'medium'],
});

const SOURCES = Object.freeze({
  lifecycle: ['constitution:III', 'engineering-audit:project-workflows'],
  appsec: ['domain:29', 'constitution:X'],
  design: ['domain:43', 'engineering-audit:greenfield-ui'],
  legacy: ['domain:08', 'engineering-audit:brownfield'],
  privacy: ['domain:36', 'constitution:X'],
  availability: ['domain:10', 'constitution:V'],
});

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
}

function digest(value) {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex')}`;
}

function uniqueSorted(values) {
  return [...new Set(Array.isArray(values) ? values : [])].sort();
}

function normalizeInput(input = {}) {
  const unknown = [];
  const normalized = {
    schemaVersion: input.schemaVersion,
    projectType: input.projectType,
    surfaces: uniqueSorted(input.surfaces),
    changeKind: input.changeKind,
    dataClasses: uniqueSorted(input.dataClasses),
    deploymentTargets: uniqueSorted(input.deploymentTargets),
    reversibility: input.reversibility,
    risk: {
      availability: input.risk?.availability,
      privacy: input.risk?.privacy,
      security: input.risk?.security,
    },
  };

  if (normalized.schemaVersion !== SCHEMA_VERSION) unknown.push({ field: 'schemaVersion', value: normalized.schemaVersion, reasonCode: 'UNSUPPORTED_SCHEMA' });
  for (const field of ['projectType', 'changeKind', 'reversibility']) {
    if (!ENUMS[field].includes(normalized[field])) unknown.push({ field, value: normalized[field], reasonCode: 'UNKNOWN_SIGNAL' });
  }
  for (const field of ['surfaces', 'dataClasses', 'deploymentTargets']) {
    for (const value of normalized[field]) {
      if (!ENUMS[field].includes(value)) unknown.push({ field, value, reasonCode: 'UNKNOWN_SIGNAL' });
    }
  }
  for (const field of ['availability', 'privacy', 'security']) {
    if (!ENUMS.risk.includes(normalized.risk[field])) unknown.push({ field: `risk.${field}`, value: normalized.risk[field], reasonCode: 'UNKNOWN_SIGNAL' });
  }

  return { normalized: stable(normalized), unknown: unknown.sort((a, b) => `${a.field}:${a.value}`.localeCompare(`${b.field}:${b.value}`)) };
}

function obligation(id, reasonCode, sourceRefs, severity = 'advisory') {
  return { id, reasonCodes: [reasonCode], severity, sourceRefs: [...sourceRefs].sort() };
}

function decideApplicability(input) {
  const { normalized, unknown } = normalizeInput(input);
  const inputDigest = digest(normalized);
  if (unknown.length) {
    const body = {
      schemaVersion: SCHEMA_VERSION,
      mode: 'advisory',
      status: 'unknown-signal',
      inputDigest,
      normalized,
      selected: [],
      excluded: [],
      unknown,
      humanCheckpoints: [{ id: 'classify-unknown-signal', reasonCodes: [...new Set(unknown.map((item) => item.reasonCode))].sort() }],
    };
    const decisionDigest = digest(body);
    return { ...body, decisionId: `ap_${decisionDigest.slice(7, 23)}`, decisionDigest };
  }

  const selected = [
    obligation('story-spec-readiness', 'LIFECYCLE_REQUIRED', SOURCES.lifecycle),
    obligation('quality-assurance', 'QUALITY_REQUIRED', SOURCES.lifecycle),
    obligation('requirements-traceability', 'NO_INVENTION', SOURCES.lifecycle),
  ];
  const excluded = [];
  const surfaces = new Set(normalized.surfaces);
  const riskRank = { low: 0, medium: 1, high: 2, critical: 3 };

  if (surfaces.has('frontend')) selected.push(obligation('design-system-grounding', 'SURFACE_FRONTEND', SOURCES.design));
  else excluded.push(obligation('design-system-grounding', 'SURFACE_ABSENT', SOURCES.design));

  if (surfaces.has('frontend') || surfaces.has('api')) selected.push(obligation('application-security', 'EXPOSED_APPLICATION_SURFACE', SOURCES.appsec));
  else excluded.push(obligation('application-security', 'SURFACE_ABSENT', SOURCES.appsec));

  if (surfaces.has('database')) selected.push(obligation('database-safety', 'SURFACE_DATABASE', SOURCES.appsec));
  else excluded.push(obligation('database-safety', 'SURFACE_ABSENT', SOURCES.appsec));

  if (normalized.projectType === 'brownfield') {
    selected.push(obligation('characterization-baseline', 'PROJECT_BROWNFIELD', SOURCES.legacy));
    selected.push(obligation('incremental-change-strategy', 'PROJECT_BROWNFIELD', SOURCES.legacy));
  } else {
    excluded.push(obligation('characterization-baseline', 'PROJECT_GREENFIELD', SOURCES.legacy));
    excluded.push(obligation('incremental-change-strategy', 'PROJECT_GREENFIELD', SOURCES.legacy));
  }

  if (riskRank[normalized.risk.security] >= 2) selected.push(obligation('threat-model', 'SECURITY_HIGH', SOURCES.appsec));
  if (riskRank[normalized.risk.privacy] >= 2 || normalized.dataClasses.includes('personal')) selected.push(obligation('privacy-impact-assessment', 'PRIVACY_ELEVATED', SOURCES.privacy));
  if (riskRank[normalized.risk.availability] >= 2) selected.push(obligation('availability-plan', 'AVAILABILITY_HIGH', SOURCES.availability));

  const humanCheckpoints = [];
  if (normalized.reversibility === 'irreversible') humanCheckpoints.push({ id: 'irreversible-action-approval', reasonCodes: ['IRREVERSIBLE_CHANGE'] });

  selected.sort((a, b) => a.id.localeCompare(b.id));
  excluded.sort((a, b) => a.id.localeCompare(b.id));
  const body = {
    schemaVersion: SCHEMA_VERSION,
    mode: 'advisory',
    status: humanCheckpoints.length ? 'human-checkpoint' : 'advisory',
    inputDigest,
    normalized,
    selected,
    excluded,
    unknown: [],
    humanCheckpoints,
  };
  const decisionDigest = digest(body);
  return { ...body, decisionId: `ap_${decisionDigest.slice(7, 23)}`, decisionDigest };
}

function renderForProvider(provider, decision) {
  if (!['claude-code', 'codex'].includes(provider)) throw new Error(`Unsupported provider: ${provider}`);
  return { provider, mode: 'advisory', blocking: false, executedWorkflows: [], verifiedEvidence: [], decision };
}

module.exports = { SCHEMA_VERSION, ENUMS, normalizeInput, decideApplicability, renderForProvider, digest };
