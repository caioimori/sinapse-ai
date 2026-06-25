/**
 * Tests for doc-first-resolver — deterministic doc-first contract.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  classifyProjectType,
  resolveDocFirstState,
} = require('../../../.sinapse-ai/core/orchestration/doc-first-resolver');

function mkTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'docfirst-'));
}

describe('classifyProjectType', () => {
  it('classifies a site brief', () => {
    expect(classifyProjectType('criar um site institucional')).toBe('site');
  });

  it('classifies an API brief WITHOUT being fooled by "Asaas" containing "saas"', () => {
    // Regression: substring matching used to classify this as `saas`.
    expect(classifyProjectType('API de cobrança Asaas')).toBe('api');
  });

  it('classifies a real SaaS brief', () => {
    expect(classifyProjectType('monta uma plataforma SaaS de gestão')).toBe('saas');
  });

  it('classifies a bug fix as a light type', () => {
    expect(classifyProjectType('corrige o bug do botão verde')).toBe('fix');
  });

  it('returns null when nothing matches', () => {
    expect(classifyProjectType('xyz nonsense words')).toBeNull();
    expect(classifyProjectType('')).toBeNull();
    expect(classifyProjectType(undefined)).toBeNull();
  });
});

describe('resolveDocFirstState', () => {
  it('maps project types to the right greenfield workflow', () => {
    expect(resolveDocFirstState({ projectRoot: mkTmp(), brief: 'criar um site' }).workflow).toBe(
      'greenfield-ui',
    );
    expect(
      resolveDocFirstState({ projectRoot: mkTmp(), brief: 'plataforma SaaS' }).workflow,
    ).toBe('greenfield-fullstack');
    expect(resolveDocFirstState({ projectRoot: mkTmp(), brief: 'API REST' }).workflow).toBe(
      'greenfield-service',
    );
  });

  it('blocks the gate on an empty project (no PRD, epic, or story)', () => {
    const root = mkTmp();
    const state = resolveDocFirstState({ projectRoot: root, brief: 'criar um site' });
    expect(state.gate.satisfied).toBe(false);
    expect(state.gate.prd).toBe(false);
    expect(state.gate.epic).toBe(false);
    expect(state.gate.readyStory).toBe(false);
    expect(state.gate.missing).toEqual(
      expect.arrayContaining(['PRD (docs/prd.md)', 'epic (docs/epics/)']),
    );
  });

  it('treats a light type (fix) as needing only a Ready story', () => {
    const state = resolveDocFirstState({ projectRoot: mkTmp(), brief: 'corrige o bug' });
    expect(state.isLightType).toBe(true);
    expect(state.workflow).toBeNull();
    // No PRD/epic required for a light task, only the story.
    expect(state.gate.missing).toEqual(['story (status >= Ready)']);
  });

  it('satisfies the gate when PRD + epic + a Ready story all exist', () => {
    const root = mkTmp();
    fs.mkdirSync(path.join(root, 'docs', 'epics'), { recursive: true });
    fs.mkdirSync(path.join(root, 'docs', 'stories'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'prd.md'), '# PRD\nreal content');
    fs.writeFileSync(path.join(root, 'docs', 'epics', 'epic-1.md'), '# Epic 1');
    fs.writeFileSync(
      path.join(root, 'docs', 'stories', '1.1.story.md'),
      '---\nstatus: "Ready"\ntype: feature\n---\n# Story',
    );
    const state = resolveDocFirstState({ projectRoot: root, brief: 'criar um site' });
    expect(state.gate.satisfied).toBe(true);
    expect(state.gate.missing).toEqual([]);
  });

  it('does NOT count a Draft story as Ready', () => {
    const root = mkTmp();
    fs.mkdirSync(path.join(root, 'docs', 'stories'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'docs', 'stories', '1.1.story.md'),
      '---\nstatus: "Draft"\n---\n# Story',
    );
    const state = resolveDocFirstState({ projectRoot: root, brief: 'corrige o bug' });
    expect(state.gate.readyStory).toBe(false);
  });

  it('detects existing required upstream artifacts', () => {
    const root = mkTmp();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'prd.md'), '# PRD\nx');
    const state = resolveDocFirstState({ projectRoot: root, brief: 'criar um site' });
    const prd = state.artifacts.find((a) => a.id === 'prd');
    const brief = state.artifacts.find((a) => a.id === 'brief');
    expect(prd.exists).toBe(true);
    expect(brief.exists).toBe(false);
  });
});
