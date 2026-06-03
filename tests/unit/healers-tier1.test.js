'use strict';

/**
 * Stream A — Healers Tier-1 tests (Story #30)
 *
 * Verifies that 4 built-in Tier-1 (Silent) healers are registered in
 * HealerManager and that each healer:
 *   1. Is retrievable via healers.healers.get(checkId)
 *   2. Has a fix() function
 *   3. Executes applyFixes() and returns success:true when the check
 *      result declares healable:true + healingTier:1
 *
 * Caller chain confirmed:
 *   HealthCheck.run({ autoFix: true, autoFixTier: 1 })  [index.js:112]
 *     → this.healers.applyFixes(checkResults, 1)
 *       → this.heal(result, maxTier)
 *         → this.executeTier1(result, healer)
 *           → healer.fix(result)
 */

const path = require('path');

const HEALERS_PATH = path.resolve(
  __dirname,
  '../../.sinapse-ai/core/health-check/healers/index.js',
);

// Minimal stub result that passes the applyFixes() filter:
//   r.healable && r.healingTier > 0 && r.healingTier <= maxTier && r.status !== 'pass'
function makeHealableResult(checkId, overrides = {}) {
  return {
    checkId,
    name: `Check ${checkId}`,
    status: 'warning',
    healable: true,
    healingTier: 1,
    message: 'test issue',
    recommendation: 'run fix',
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1 — HealerManager registers 4 built-in Tier-1 healers on construction
// ─────────────────────────────────────────────────────────────────────────────

describe('HealerManager — built-in Tier-1 healers registered', () => {
  const EXPECTED_IDS = [
    'project.sinapse-directory',
    'project.framework-config',
    'project.package-json',
    'repository.gitignore',
  ];

  let manager;

  beforeEach(() => {
    // Reset require cache for a clean construction each test
    delete require.cache[HEALERS_PATH];
    const HealerManager = require(HEALERS_PATH);
    manager = new HealerManager({ dryRun: true });
  });

  it('registers exactly 4 built-in healers', () => {
    expect(manager.healers.size).toBe(4);
  });

  test.each(EXPECTED_IDS)('healer "%s" is registered', (id) => {
    expect(manager.healers.has(id)).toBe(true);
  });

  test.each(EXPECTED_IDS)('healer "%s" has a fix() function', (id) => {
    const healer = manager.healers.get(id);
    expect(typeof healer.fix).toBe('function');
  });

  test.each(EXPECTED_IDS)('healer "%s" has a name string', (id) => {
    const healer = manager.healers.get(id);
    expect(typeof healer.name).toBe('string');
    expect(healer.name.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2 — applyFixes() routes healable results to the registered healers
// ─────────────────────────────────────────────────────────────────────────────

describe('HealerManager.applyFixes() — routes to Tier-1 healers', () => {
  const EXPECTED_IDS = [
    'project.sinapse-directory',
    'project.framework-config',
    'project.package-json',
    'repository.gitignore',
  ];

  let HealerManager;

  beforeAll(() => {
    delete require.cache[HEALERS_PATH];
    HealerManager = require(HEALERS_PATH);
  });

  test.each(EXPECTED_IDS)(
    'applyFixes resolves healer for check "%s" in dryRun mode',
    async (checkId) => {
      const manager = new HealerManager({ dryRun: true, autoFixTier: 1 });

      const fakeResults = [makeHealableResult(checkId)];
      const healingResults = await manager.applyFixes(fakeResults, 1);

      expect(healingResults).toHaveLength(1);
      const result = healingResults[0];

      // dryRun:true means fix() is never called but the flow completes successfully
      expect(result.checkId).toBe(checkId);
      expect(result.tier).toBe(1);
      // dryRun skips the actual fs ops but still returns success:true
      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
    },
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 3 — Check classes expose getHealer() returning compliant shape
// ─────────────────────────────────────────────────────────────────────────────

describe('Check classes — getHealer() returns compliant healer shape', () => {
  const CHECK_MODULES = [
    {
      id: 'project.sinapse-directory',
      modulePath: path.resolve(
        __dirname,
        '../../.sinapse-ai/core/health-check/checks/project/sinapse-directory.js',
      ),
    },
    {
      id: 'project.framework-config',
      modulePath: path.resolve(
        __dirname,
        '../../.sinapse-ai/core/health-check/checks/project/framework-config.js',
      ),
    },
    {
      id: 'project.package-json',
      modulePath: path.resolve(
        __dirname,
        '../../.sinapse-ai/core/health-check/checks/project/package-json.js',
      ),
    },
    {
      id: 'repository.gitignore',
      modulePath: path.resolve(
        __dirname,
        '../../.sinapse-ai/core/health-check/checks/repository/gitignore.js',
      ),
    },
  ];

  test.each(CHECK_MODULES)('$id — check class instantiates and getHealer() exists', ({ modulePath, id }) => {
    const CheckClass = require(modulePath);
    const instance = new CheckClass();

    expect(instance.id).toBe(id);
    expect(instance.healingTier).toBe(1);
    expect(typeof instance.getHealer).toBe('function');

    const healer = instance.getHealer();
    expect(healer).not.toBeNull();
    expect(typeof healer.fix).toBe('function');
    expect(typeof healer.name).toBe('string');
    expect(typeof healer.successMessage).toBe('string');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 4 — Non-healable results are NOT processed
// ─────────────────────────────────────────────────────────────────────────────

describe('HealerManager.applyFixes() — skips non-healable results', () => {
  let HealerManager;

  beforeAll(() => {
    delete require.cache[HEALERS_PATH];
    HealerManager = require(HEALERS_PATH);
  });

  it('returns empty array when all results are non-healable', async () => {
    const manager = new HealerManager({ dryRun: true });
    const nonHealable = [
      { checkId: 'some.check', status: 'fail', healable: false, healingTier: 0 },
    ];
    const results = await manager.applyFixes(nonHealable, 1);
    expect(results).toHaveLength(0);
  });

  it('returns empty array when healingTier exceeds maxTier', async () => {
    const manager = new HealerManager({ dryRun: true });
    const tier2Result = makeHealableResult('project.sinapse-directory', { healingTier: 2 });
    const results = await manager.applyFixes([tier2Result], 1);
    expect(results).toHaveLength(0);
  });
});
