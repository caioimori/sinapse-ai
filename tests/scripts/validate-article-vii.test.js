/**
 * validate-article-vii.test.js
 *
 * Guards the Constitution article-count drift detection added after the README
 * was found claiming "10 articles" while the constitution had 11 (with no gate).
 */

'use strict';

const {
  findDrift,
  buildExpectations,
  collectConstitutionCounts,
} = require('../../scripts/validate-article-vii.js');

describe('validate-article-vii — Constitution counts', () => {
  describe('collectConstitutionCounts', () => {
    it('reads real article + NON-NEGOTIABLE counts from the canonical constitution', () => {
      const c = collectConstitutionCounts();
      // The constitution has 11 articles (I–XI); 7 are NON-NEGOTIABLE.
      expect(c.articles).toBe(11);
      expect(c.nonNegotiable).toBe(7);
    });
  });

  describe('findDrift — article counts', () => {
    const expected = buildExpectations(
      { squads: 17, totalAgents: 172, totalOrqx: 18, tasks: 1200 },
      { articles: 11, nonNegotiable: 7 },
    );

    it('flags a stale total-article count (prose + badge)', () => {
      const bad = 'Constitution-10%20articles — uma Constitution com 10 artigos rege o framework.';
      const kinds = findDrift(bad, expected).map((f) => f.kind);
      expect(kinds).toContain('articles');
      expect(kinds).toContain('articles (badge)');
    });

    it('flags a stale NON-NEGOTIABLE count (PT and EN phrasings)', () => {
      const pt = '6 desses artigos sao NON-NEGOTIABLE. 6 artigos sao NON-NEGOTIABLE.';
      const en = '6 of those articles are NON-NEGOTIABLE.';
      expect(findDrift(pt, expected).some((f) => f.kind === 'NON-NEGOTIABLE articles' && f.found === 6)).toBe(true);
      expect(findDrift(en, expected).some((f) => f.kind === 'NON-NEGOTIABLE articles' && f.found === 6)).toBe(true);
    });

    it('passes when counts are correct (11 articles, 7 NON-NEGOTIABLE)', () => {
      const good = 'Constitution-11%20articles — Constitution com 11 artigos, e 7 desses artigos sao NON-NEGOTIABLE. 7 artigos sao NON-NEGOTIABLE.';
      expect(findDrift(good, expected)).toHaveLength(0);
    });

    it('does NOT misread the NON-NEGOTIABLE count as a wrong total-article count', () => {
      // "7 artigos sao NON-NEGOTIABLE" must not be flagged as total=7.
      const good = 'Constitution com 11 artigos. 7 artigos sao NON-NEGOTIABLE.';
      const totalArticleFindings = findDrift(good, expected).filter((f) => f.kind === 'articles');
      expect(totalArticleFindings).toHaveLength(0);
    });
  });
});
