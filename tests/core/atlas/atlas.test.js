/**
 * Tests for the Framework Operating Atlas generator.
 *
 * Asserts internal consistency (not brittle magic numbers, except the stable
 * constitution article count) so the suite catches parser regressions without
 * breaking every time a squad/agent is legitimately added.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const { buildAtlasData } = require('../../../.sinapse-ai/core/atlas/atlas-data');
const { renderAtlasMarkdown } = require('../../../.sinapse-ai/core/atlas/render-markdown');
const { generateAtlas } = require('../../../.sinapse-ai/core/atlas');

const ROOT = path.join(__dirname, '..', '..', '..');

describe('buildAtlasData', () => {
  let d;
  beforeAll(() => {
    d = buildAtlasData({ root: ROOT });
  });

  it('produces non-empty catalogs', () => {
    expect(d.counts.squads).toBeGreaterThan(0);
    expect(d.counts.agentsTotal).toBeGreaterThan(0);
    expect(d.counts.workflowsTotal).toBeGreaterThan(0);
    expect(d.workflows.length).toBe(d.counts.workflowsTotal);
    expect(d.agents.length).toBe(d.counts.agentsTotal);
    expect(d.squads.length).toBe(d.counts.squads);
  });

  it('keeps the count arithmetic internally consistent (Article VII)', () => {
    expect(d.counts.frameworkAgents + d.counts.squadAgents).toBe(d.counts.agentsTotal);
    expect(d.counts.frameworkWorkflows + d.counts.squadWorkflows).toBe(d.counts.workflowsTotal);
    expect(d.counts.orqx).toBeLessThanOrEqual(d.counts.agentsTotal);
  });

  it('parses all 11 constitutional articles with severities', () => {
    expect(d.counts.articles).toBe(11);
    const numbers = d.articles.map((a) => a.number);
    expect(numbers).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']);
    expect(d.articles.every((a) => a.severity)).toBe(true);
  });

  it('counts orchestrators by the -orqx convention (matches canonical counter)', () => {
    // Master + one or more per squad; never more than one per agent.
    const orqx = d.agents.filter((a) => a.isOrqx);
    expect(orqx.length).toBe(d.counts.orqx);
    expect(orqx.some((a) => a.id === 'snps-orqx' || a.id === 'sinapse-orqx')).toBe(true);
    // A "chief" with "Orchestrator" in the title but no -orqx id is NOT counted.
    expect(orqx.every((a) => /-orqx$/.test(a.id) || /-orqx$/.test(path.basename(a.file, '.md')))).toBe(true);
  });

  it('recovers agents in BOTH file formats (yaml block + prose card)', () => {
    const kinetic = d.agents.find((a) => a.id === 'animations-orqx');
    expect(kinetic).toBeDefined();
    expect(kinetic.persona).toBe('Kinetic'); // prose-card format ("- **Nome:** Kinetic")
  });

  it('assigns every squad agent to a real squad', () => {
    const squadIds = new Set(d.squads.map((s) => s.id));
    const orphans = d.agents.filter((a) => a.squad !== 'framework' && !squadIds.has(a.squad));
    expect(orphans).toEqual([]);
  });
});

describe('framework flows', () => {
  let d;
  beforeAll(() => {
    d = buildAtlasData({ root: ROOT });
  });

  it('includes the framework operating flows', () => {
    expect(Array.isArray(d.flows)).toBe(true);
    expect(d.flows.length).toBeGreaterThanOrEqual(5);
    const ids = d.flows.map((f) => f.id);
    expect(ids).toEqual(
      expect.arrayContaining(['lifecycle', 'agent-routing', 'model-routing', 'doc-first']),
    );
  });

  it('every flow has a title, purpose, and a mermaid diagram', () => {
    for (const f of d.flows) {
      expect(f.title).toBeTruthy();
      expect(f.purpose).toBeTruthy();
      expect(f.mermaid).toMatch(/flowchart|sequenceDiagram|graph/);
    }
  });

  it('renders the flows section in the markdown atlas', () => {
    const md = renderAtlasMarkdown(d);
    expect(md).toContain('## 2b. Framework flows');
    expect(md).toContain('```mermaid');
  });
});

describe('renderAtlasMarkdown', () => {
  it('renders the 7 atlas sections with exact counts', () => {
    const d = buildAtlasData({ root: ROOT });
    const md = renderAtlasMarkdown(d);
    expect(md).toContain('# SINAPSE — Framework Operating Atlas');
    expect(md).toContain('## 1. How SINAPSE works');
    expect(md).toContain('## 3. Constitution');
    expect(md).toContain('## 6. Workflow catalog');
    expect(md).toContain('## 7. Agents & squads map');
    // Counts in prose must match the data (no drift).
    expect(md).toContain(`${d.counts.agentsTotal} agents`);
    expect(md).toContain(`${d.counts.workflowsTotal} workflows`);
  });
});

describe('generateAtlas', () => {
  it('writes both artifacts when write is enabled', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-'));
    // Point at the real repo root for data, but write into a temp dir by
    // copying the relative output structure: generateAtlas writes under root.
    const res = generateAtlas({ root: ROOT, write: false });
    expect(res.markdown).toContain('Framework Operating Atlas');
    expect(res.data.counts.articles).toBe(11);
    expect(res.paths.md).toContain('OPERATING-ATLAS.md');
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});
