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
  collectRuntimeTaskCounts,
  collectProviderSurfaceCounts,
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

  describe('task scope metrics', () => {
    const expected = buildExpectations(
      { squads: 17, totalAgents: 172, totalOrqx: 18, tasks: 1201 },
      { articles: 11, nonNegotiable: 7 },
      {
        squadTasks: 1201,
        developmentTasks: 211,
        totalTasks: 1412,
        resolvableTasks: 1348,
      },
      {
        claudeSkills: 36,
        codexSkills: 37,
        claudeHooks: 20,
        codexHookEvents: 9,
      },
    );

    it('reads the task breakdown from the parametric runtime', () => {
      expect(collectRuntimeTaskCounts()).toEqual({
        squadTasks: 1201,
        developmentTasks: 211,
        totalTasks: 1412,
        resolvableTasks: 1348,
      });
    });

    it('bounds the resolver execution and exposes a testable timeout option', () => {
      const calls = [];
      const stats = JSON.stringify({
        squadTaskFiles: 1201,
        devTaskFiles: 211,
        totalTaskFiles: 1412,
        resolvableTaskPointers: 1348,
      });
      const execute = (...args) => {
        calls.push(args);
        return stats;
      };

      collectRuntimeTaskCounts({ execFileSync: execute });
      collectRuntimeTaskCounts({ execFileSync: execute, timeoutMs: 250 });

      expect(calls[0][2]).toEqual(expect.objectContaining({ timeout: 10_000 }));
      expect(calls[1][2]).toEqual(expect.objectContaining({ timeout: 250 }));
      expect(() => collectRuntimeTaskCounts({ timeoutMs: 0 })).toThrow(
        'timeout must be a positive integer',
      );
    });

    it('fails closed when the parametric resolver cannot execute', () => {
      expect(() => collectRuntimeTaskCounts({
        execFileSync: () => { throw new Error('offline'); },
      })).toThrow('cannot execute the parametric resolver');
    });

    it('fails closed on malformed or inconsistent runtime metrics', () => {
      expect(() => collectRuntimeTaskCounts({
        execFileSync: () => '{not-json',
      })).toThrow('malformed JSON');
      expect(() => collectRuntimeTaskCounts({
        execFileSync: () => JSON.stringify({
          squadTaskFiles: 1201,
          devTaskFiles: 211,
          totalTaskFiles: 999,
          resolvableTaskPointers: 900,
        }),
      })).toThrow('does not equal');
      expect(() => collectRuntimeTaskCounts({
        execFileSync: () => JSON.stringify({
          squadTaskFiles: 0,
          devTaskFiles: 0,
          totalTaskFiles: 0,
          resolvableTaskPointers: 0,
        }),
      })).toThrow('positive integer');
      expect(() => collectRuntimeTaskCounts({
        expectedSquadTasks: 1201,
        execFileSync: () => JSON.stringify({
          squadTaskFiles: 1200,
          devTaskFiles: 211,
          totalTaskFiles: 1411,
          resolvableTaskPointers: 1348,
        }),
      })).toThrow('does not match sync-counts');
    });

    it('accepts the complete measured task breakdown', () => {
      const good = '1.412 task files: 1.201 squad tasks + 211 development tasks; 1.348 ponteiros resolviveis.';
      expect(findDrift(good, expected, { requireTaskBreakdown: true })).toHaveLength(0);
    });

    it.each([
      ['squad tasks', '1.200 squad tasks'],
      ['development tasks', '210 development tasks'],
      ['total task files', '1.411 task files'],
      ['resolvable task pointers', '1.347 ponteiros resolviveis'],
    ])('flags drift in %s', (kind, claim) => {
      expect(findDrift(claim, expected).some((finding) => finding.kind === kind)).toBe(true);
    });

    it('rejects an incomplete README-style task claim', () => {
      const incomplete = 'Total: 17 squads, 172 agentes especializados, 1.201 tasks.';
      const findings = findDrift(incomplete, expected, { requireTaskBreakdown: true });
      expect(findings.filter((finding) => finding.kind.endsWith('(missing)'))).toHaveLength(4);
    });

    it('measures provider skills and hook surfaces through injected adapters', () => {
      const surfaces = collectProviderSurfaceCounts({
        validateProviderAdapters: () => ({
          ok: true,
          metrics: { claudeSkills: 2, codexSkills: 3 },
        }),
        readJson: (filePath) => filePath.includes('.claude')
          ? { hooks: { PreToolUse: [{ hooks: [{}, {}] }] } }
          : { hooks: { PreToolUse: [], Stop: [] } },
      });
      expect(surfaces).toEqual({
        claudeSkills: 2,
        codexSkills: 3,
        claudeHooks: 2,
        codexHookEvents: 2,
      });
    });

    it('fails closed when provider metrics are unavailable', () => {
      expect(() => collectProviderSurfaceCounts({
        validateProviderAdapters: () => ({ ok: false, errors: ['drift'] }),
      })).toThrow('provider adapter validation failed');
      expect(() => collectProviderSurfaceCounts({
        validateProviderAdapters: () => ({
          ok: true,
          metrics: { claudeSkills: 36, codexSkills: 37 },
        }),
        readJson: (filePath) => filePath.includes('.claude')
          ? { hooks: { PreToolUse: [{ hooks: [{}] }] } }
          : { hooks: 'malformed' },
      })).toThrow('Codex hook settings are malformed');
    });

    it('flags provider skill and hook drift in the README table', () => {
      const bad = [
        '| Skills instaladas | 35 | 38 |',
        '| Hooks registrados | 19 registros nativos | 8 eventos de lifecycle via bridge |',
      ].join('\n');
      const kinds = findDrift(bad, expected).map((finding) => finding.kind);
      expect(kinds).toEqual(expect.arrayContaining([
        'Claude skills',
        'Codex skills',
        'Claude hook registrations',
        'Codex hook events',
      ]));
      expect(findDrift('17 active hooks', expected)).toEqual(expect.arrayContaining([
        expect.objectContaining({ kind: 'Claude hook registrations', found: 17, expected: 20 }),
      ]));
    });

    it.each([
      ['19 Claude Code hook registrations', 'Claude hook registrations', 19, 20],
      ['19 registered Claude Code hooks', 'Claude hook registrations', 19, 20],
      ['19 hooks registrados', 'Claude hook registrations', 19, 20],
      ['8 Codex lifecycle events', 'Codex hook events', 8, 9],
      ['8 eventos de lifecycle', 'Codex hook events', 8, 9],
    ])('flags provider drift in prose: %s', (claim, kind, found, wanted) => {
      expect(findDrift(claim, expected)).toEqual(expect.arrayContaining([
        expect.objectContaining({ kind, found, expected: wanted }),
      ]));
    });

    it.each([
      '20 Claude Code hook registrations',
      '20 registered Claude Code hooks',
      '20 hooks registrados',
      '9 Codex lifecycle events',
      '9 eventos de lifecycle',
    ])('accepts current provider prose: %s', (claim) => {
      expect(findDrift(claim, expected)).toHaveLength(0);
    });

    it('ignores unrelated registered git hook counts', () => {
      expect(findDrift('5 registered git hooks', expected)).toHaveLength(0);
    });

    it('accepts the English provider table labels', () => {
      const good = [
        '| Installed skills | 36 | 37 |',
        '| Registered hooks | 20 native registrations | 9 lifecycle events through the bridge |',
      ].join('\n');
      expect(findDrift(good, expected)).toHaveLength(0);
    });

    it('rejects an obsolete global-agent claim in a current guide', () => {
      const stale = 'SINAPSE includes 11 specialized agents, each with a role.';
      expect(findDrift(stale, expected, { requireAgentTotal: true })).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ kind: 'global agent total (missing)', expected: 172 }),
        ]),
      );
    });
  });
});
