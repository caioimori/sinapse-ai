'use strict';

/**
 * Story mesa2-acs-gwt-guard (AF-20260704 Mesa #3)
 *
 * Advisory guard that flags acceptance criteria not written in executable
 * Given/When/Then form. These tests lock the pure detection logic: GWT items
 * pass, free-form items are flagged, only the "Acceptance Criteria" section is
 * scanned, multi-line items are joined, and a story without ACs yields zero.
 */

const { lintStoryAcs, isGwt } = require('../../scripts/validate-story-acs.js');

describe('isGwt', () => {
  test('true only when given + when + then all present (case-insensitive)', () => {
    expect(isGwt('Given a config, When it runs, Then it passes')).toBe(true);
    expect(isGwt('GIVEN x WHEN y THEN z')).toBe(true);
    expect(isGwt('When it runs, then it passes')).toBe(false); // no given
    expect(isGwt('Just a plain criterion')).toBe(false);
  });
});

describe('lintStoryAcs — classifies ACs in the Acceptance Criteria section', () => {
  test('GWT checkbox items pass', () => {
    const md = [
      '# Story',
      '## Acceptance Criteria',
      '- [ ] AC1: Given a repo, When I lint, Then it reports.',
      '- [ ] AC2: Given input, When parsed, Then output is valid.',
      '',
      '## Scope',
      '- [ ] not an AC',
    ].join('\n');
    const r = lintStoryAcs(md);
    expect(r.total).toBe(2);
    expect(r.gwt).toBe(2);
    expect(r.nonGwt).toHaveLength(0);
  });

  test('free-form (non-GWT) items are flagged', () => {
    const md = [
      '## Acceptance Criteria',
      '- [ ] AC1: The button is green.',
      '- [ ] AC2: Given x, When y, Then z.',
    ].join('\n');
    const r = lintStoryAcs(md);
    expect(r.total).toBe(2);
    expect(r.gwt).toBe(1);
    expect(r.nonGwt).toHaveLength(1);
    expect(r.nonGwt[0].text).toMatch(/button is green/);
  });

  test('only the Acceptance Criteria section is scanned', () => {
    const md = [
      '## Description',
      '- [ ] this list item is outside AC and must be ignored',
      '## Acceptance Criteria',
      '- [ ] AC1: Given a, When b, Then c.',
      '## Notes',
      '- [ ] also ignored',
    ].join('\n');
    const r = lintStoryAcs(md);
    expect(r.total).toBe(1);
    expect(r.gwt).toBe(1);
  });

  test('numbered list items are recognized', () => {
    const md = ['## Acceptance Criteria', '1. The thing works.', '2. Given a, When b, Then c.'].join('\n');
    const r = lintStoryAcs(md);
    expect(r.total).toBe(2);
    expect(r.nonGwt).toHaveLength(1);
  });

  test('multi-line AC item is joined before classifying', () => {
    const md = [
      '## Acceptance Criteria',
      '- [ ] AC1: Given a long context that wraps',
      '      When the action happens',
      '      Then the outcome is observable.',
    ].join('\n');
    const r = lintStoryAcs(md);
    expect(r.total).toBe(1);
    expect(r.gwt).toBe(1);
  });

  test('story without an Acceptance Criteria section yields zero ACs', () => {
    const md = ['# Story', '## Description', 'no ACs here', '## Scope', '- [ ] x'].join('\n');
    const r = lintStoryAcs(md);
    expect(r.total).toBe(0);
    expect(r.nonGwt).toHaveLength(0);
  });
});
