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
  assessProjectMaturity,
  storyHasSubstance,
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

  // A substantive Ready story: sections + an AC + a traceability signal.
  const SUBSTANTIVE_STORY = [
    '---',
    'status: "Ready"',
    'type: feature',
    '---',
    '# Story 1.1',
    '',
    '**Evidência:** audit AF-1',
    '',
    '## Descrição',
    'Faz X porque Y.',
    '',
    '## Acceptance Criteria',
    '- [ ] AC1: Given A, When B, Then C.',
    '',
    '## Escopo',
    '**IN:** X. **OUT:** Y.',
    '',
  ].join('\n');

  it('satisfies the gate when PRD + epic + a substantive Ready story all exist', () => {
    const root = mkTmp();
    fs.mkdirSync(path.join(root, 'docs', 'epics'), { recursive: true });
    fs.mkdirSync(path.join(root, 'docs', 'stories'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs', 'prd.md'), '# PRD\nreal content');
    fs.writeFileSync(path.join(root, 'docs', 'epics', 'epic-1.md'), '# Epic 1');
    fs.writeFileSync(path.join(root, 'docs', 'stories', '1.1.story.md'), SUBSTANTIVE_STORY);
    const state = resolveDocFirstState({ projectRoot: root, brief: 'criar um site' });
    expect(state.gate.satisfied).toBe(true);
    expect(state.gate.substance).toBe(true);
    expect(state.gate.missing).toEqual([]);
    expect(state.gate.concerns).toEqual([]);
  });

  it('M2: blocks a Ready story that lacks substance (empty body)', () => {
    const root = mkTmp();
    fs.mkdirSync(path.join(root, 'docs', 'stories'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'docs', 'stories', '1.1.story.md'),
      '---\nstatus: "Ready"\n---\n# Story',
    );
    const state = resolveDocFirstState({ projectRoot: root, brief: 'corrige o bug' });
    expect(state.gate.readyStory).toBe(true);
    expect(state.gate.substance).toBe(false);
    expect(state.gate.satisfied).toBe(false);
    expect(state.gate.missing.some((m) => m.startsWith('story substance'))).toBe(true);
  });

  it('M2: flags missing traceability as a non-blocking concern', () => {
    const root = mkTmp();
    fs.mkdirSync(path.join(root, 'docs', 'stories'), { recursive: true });
    // Substantive (sections + AC) but no evidence/requirement reference.
    fs.writeFileSync(
      path.join(root, 'docs', 'stories', '1.1.story.md'),
      '---\nstatus: "Ready"\n---\n# T\n\n## Descrição\nfaz\n\n## Acceptance Criteria\n- [ ] faz algo concreto\n\n## Escopo\nin',
    );
    const state = resolveDocFirstState({ projectRoot: root, brief: 'corrige o bug' });
    expect(state.gate.substance).toBe(true);
    expect(state.gate.satisfied).toBe(true); // concern does not block
    expect(state.gate.concerns.length).toBeGreaterThan(0);
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

describe('storyHasSubstance (M2)', () => {
  function tmpStory(content) {
    const dir = mkTmp();
    const f = path.join(dir, 's.md');
    fs.writeFileSync(f, content);
    return f;
  }

  it('reports every missing required section', () => {
    const v = storyHasSubstance(tmpStory('# Only a title'));
    expect(v.ok).toBe(false);
    expect(v.missingSections).toEqual(
      expect.arrayContaining(['Descrição/Description', 'Acceptance Criteria', 'Escopo/Scope']),
    );
  });

  it('accepts a Given/When/Then AC without a checkbox', () => {
    const v = storyHasSubstance(
      tmpStory('# T\n## Description\nx\n## Acceptance Criteria\nGiven a, when b, then c.\n## Scope\nin'),
    );
    expect(v.ok).toBe(true);
    expect(v.hasAcItem).toBe(true);
  });

  it('degrades open (never blocks) on a read error', () => {
    const v = storyHasSubstance(path.join(mkTmp(), 'does-not-exist.md'));
    expect(v.ok).toBe(true);
    expect(v.degraded).toBe(true);
  });
});

describe('assessProjectMaturity', () => {
  it('marks an empty directory as greenfield', () => {
    const m = assessProjectMaturity(mkTmp());
    expect(m.isGreenfield).toBe(true);
    expect(m.isFrameworkRepo).toBe(false);
  });

  it('keeps a lone package.json (no code yet) as greenfield — closes the scaffold bypass', () => {
    const root = mkTmp();
    fs.writeFileSync(path.join(root, 'package.json'), '{"name":"client-app"}');
    // package.json alone must NOT disable the gate (it is an exempt file the
    // scaffolder writes first); only real code dirs flip greenfield off.
    expect(assessProjectMaturity(root).isGreenfield).toBe(true);
  });

  it('marks a project with populated src/ as not greenfield', () => {
    const root = mkTmp();
    fs.mkdirSync(path.join(root, 'src'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'a.js'), 'x');
    expect(assessProjectMaturity(root).isGreenfield).toBe(false);
  });

  it('identifies the framework\'s own repo by package.json name', () => {
    const root = mkTmp();
    fs.writeFileSync(path.join(root, 'package.json'), '{"name":"sinapse-ai"}');
    expect(assessProjectMaturity(root).isFrameworkRepo).toBe(true);
  });
});
