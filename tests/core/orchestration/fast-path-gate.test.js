'use strict';

const path = require('path');

const {
  DEFAULT_FAST_PATH_CONFIG,
  evaluateFastPath,
  getAutomationPatterns,
  getRiskPatterns,
  getStructuredFileExtensions,
  normalizeConfig,
  normalizeTask,
} = require(path.resolve(__dirname, '../../../.sinapse-ai/core/orchestration/fast-path-gate.js'));

describe('fast-path-gate (pure functions)', () => {
  describe('DEFAULT_FAST_PATH_CONFIG', () => {
    it('is a frozen, well-formed default', () => {
      expect(Object.isFrozen(DEFAULT_FAST_PATH_CONFIG)).toBe(true);
      expect(DEFAULT_FAST_PATH_CONFIG.enabled).toBe(true);
      expect(DEFAULT_FAST_PATH_CONFIG.minConfidence).toBeGreaterThan(0);
      expect(DEFAULT_FAST_PATH_CONFIG.minBatchItems).toBeGreaterThanOrEqual(1);
    });
  });

  describe('normalizeConfig', () => {
    it('falls back to defaults for empty input', () => {
      expect(normalizeConfig()).toEqual({
        enabled: DEFAULT_FAST_PATH_CONFIG.enabled,
        externalExecutorsEnabled: DEFAULT_FAST_PATH_CONFIG.externalExecutorsEnabled,
        minConfidence: DEFAULT_FAST_PATH_CONFIG.minConfidence,
        minBatchItems: DEFAULT_FAST_PATH_CONFIG.minBatchItems,
        externalExecutorThreshold: DEFAULT_FAST_PATH_CONFIG.externalExecutorThreshold,
      });
    });

    it('clamps minConfidence into [0,1]', () => {
      expect(normalizeConfig({ minConfidence: 5 }).minConfidence).toBe(1);
      expect(normalizeConfig({ minConfidence: -2 }).minConfidence).toBe(0);
    });

    it('accepts snake_case aliases and string booleans', () => {
      const cfg = normalizeConfig({ external_executors_enabled: 'true', min_batch_items: 4 });
      expect(cfg.externalExecutorsEnabled).toBe(true);
      expect(cfg.minBatchItems).toBe(4);
    });

    it('coerces minBatchItems to a positive integer', () => {
      expect(normalizeConfig({ minBatchItems: 0 }).minBatchItems).toBe(1);
      expect(normalizeConfig({ minBatchItems: 3.9 }).minBatchItems).toBe(3);
    });
  });

  describe('normalizeTask', () => {
    it('reads description/files/acceptanceCriteria with snake_case fallback', () => {
      const task = normalizeTask({
        title: 'Bulk rename',
        files: ['a.yaml', 'b.yaml'],
        acceptance_criteria: ['done'],
        item_count: 7,
      });
      expect(task.description).toBe('Bulk rename');
      expect(task.files).toHaveLength(2);
      expect(task.acceptanceCriteria).toEqual(['done']);
      expect(task.itemCount).toBe(7);
    });

    it('unwraps a nested task object', () => {
      const task = normalizeTask({ task: { description: 'x' } });
      expect(task.description).toBe('x');
    });
  });

  describe('immutability helpers', () => {
    it('returns fresh pattern clones each call (no shared mutation)', () => {
      const a = getAutomationPatterns();
      const b = getAutomationPatterns();
      expect(a).not.toBe(b);
      expect(a[0]).not.toBe(b[0]);
      expect(getRiskPatterns().length).toBeGreaterThan(0);
      expect(getStructuredFileExtensions().has('.yaml')).toBe(true);
    });
  });

  describe('evaluateFastPath', () => {
    it('short-circuits to standard when disabled', () => {
      const r = evaluateFastPath({ config: { enabled: false }, description: 'bulk yaml edit' });
      expect(r.enabled).toBe(false);
      expect(r.passed).toBe(false);
      expect(r.mode).toBe('standard');
    });

    it('passes a high-automation structured batch task', () => {
      const r = evaluateFastPath({
        description: 'bulk replace frontmatter field across all files in one shot',
        files: ['a.yaml', 'b.yaml', 'c.yaml', 'd.json'],
        itemCount: 4,
      });
      expect(r.passed).toBe(true);
      expect(['parallel_batch', 'deterministic_batch']).toContain(r.mode);
      expect(r.riskLevel).toBe('low');
      expect(r.actions.length).toBeGreaterThan(0);
    });

    it('never passes when a risk signal is present', () => {
      const r = evaluateFastPath({
        description: 'bulk migrate production database schema and delete old rows',
        files: ['a.yaml', 'b.yaml', 'c.yaml'],
      });
      expect(r.passed).toBe(false);
      expect(r.mode).toBe('standard');
      expect(r.riskLevel).not.toBe('low');
      expect(r.evidence.riskSignals.length).toBeGreaterThan(0);
    });

    it('returns a bounded confidence in [0,1]', () => {
      const r = evaluateFastPath({ description: 'rename variables', files: ['x.yaml'] });
      expect(r.confidence).toBeGreaterThanOrEqual(0);
      expect(r.confidence).toBeLessThanOrEqual(1);
    });
  });
});
