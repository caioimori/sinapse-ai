/**
 * research-card.test.js
 *
 * Covers the PT-BR SINAPSE research card render target (Story atlas-research-card):
 *   - every framework flow has a PT-BR translation (drift guard)
 *   - renderResearchCard emits a card + LOOPS with exact counts and all flows
 */

'use strict';

const path = require('path');

const ATLAS = path.resolve(__dirname, '../../../.sinapse-ai/core/atlas');
const { buildAtlasData } = require(path.join(ATLAS, 'atlas-data'));
const { FRAMEWORK_FLOWS } = require(path.join(ATLAS, 'flows'));
const { FRAMEWORK_FLOWS_PT } = require(path.join(ATLAS, 'flows-pt'));
const { renderResearchCard } = require(path.join(ATLAS, 'render-research-card'));

const ROOT = path.resolve(__dirname, '../../..');

describe('flows-pt translations', () => {
  it('translates every framework flow (drift guard)', () => {
    const missing = FRAMEWORK_FLOWS.map((f) => f.id).filter((id) => !FRAMEWORK_FLOWS_PT[id]);
    expect(missing).toEqual([]);
  });

  it('each PT entry has titulo, proposito and a mermaid diagram', () => {
    for (const id of Object.keys(FRAMEWORK_FLOWS_PT)) {
      const t = FRAMEWORK_FLOWS_PT[id];
      expect(t.titulo).toBeTruthy();
      expect(t.proposito).toBeTruthy();
      expect(t.mermaid).toMatch(/flowchart|sequenceDiagram|graph/);
    }
  });
});

describe('renderResearchCard', () => {
  let data;
  let out;
  beforeAll(() => {
    data = buildAtlasData({ root: ROOT, generatedAt: '2026-06-26T00:00:00.000Z' });
    out = renderResearchCard(data);
  });

  it('returns a card and a loops markdown string', () => {
    expect(typeof out.card).toBe('string');
    expect(typeof out.loops).toBe('string');
  });

  it('card carries the research frontmatter and exact counts (Article VII)', () => {
    expect(out.card).toMatch(/tipo: estudo-de-caso/);
    expect(out.card).toMatch(/dominio: sinapse-framework/);
    // exact agent count appears in prose (no rounding)
    expect(out.card).toContain(String(data.counts.agentsTotal));
    expect(out.card).toContain(String(data.counts.squads));
  });

  it('loops file contains one Mermaid block per flow, in PT-BR', () => {
    const fences = out.loops.match(/```mermaid/g) || [];
    expect(fences.length).toBe(data.flows.length);
    // a PT-BR label from a translated diagram is present
    expect(out.loops).toMatch(/Briefing do usuário|Usuário envia um prompt/);
  });
});
