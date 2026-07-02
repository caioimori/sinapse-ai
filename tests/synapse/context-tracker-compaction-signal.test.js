/**
 * Tests for SYNAPSE Context Bracket Tracker — dual-trigger compaction signal
 *
 * Proves (Story onda2-p4 / audit AF-20260702 item 2.12):
 *  (a) With the real registry active model (claude-fable-5, 1M window),
 *      shouldCompact() fires via the ABSOLUTE ceiling (~165K tokens) long
 *      before 60% of the 1M window (600K tokens) would ever be reached.
 *  (b) At the 200K window shape (today's real fallback — install templates
 *      ship no `models` section, per DEFAULTS comment in context-tracker.js),
 *      shouldCompact() is mathematically IDENTICAL to the pre-existing plain
 *      60%-of-window rule — zero regression, proven against
 *      estimateContextPercent() as the independent oracle.
 *  (c) The "MENOR entre" (smaller-of) contract holds across window sizes:
 *      percent trigger wins below the crossover (~275K), absolute ceiling
 *      wins above it.
 *  (d) Graceful handling on invalid input mirrors estimateContextPercent().
 *
 * @module tests/synapse/context-tracker-compaction-signal
 * @story onda2-p4 — dual-trigger de compactação (audit AF-20260702 item 2.12)
 */

const {
  shouldCompact,
  estimateContextPercent,
  getModelConfig,
  resetModelConfigCache,
  COMPACTION_ABSOLUTE_CEILING,
  COMPACTION_PERCENT_TRIGGER,
  XML_SAFETY_MULTIPLIER,
} = require('../../.sinapse-ai/core/synapse/context/context-tracker');

afterEach(() => {
  resetModelConfigCache();
});

// =============================================================================
// Constants — the interim values the audit recommended
// =============================================================================

describe('compaction constants', () => {
  test('COMPACTION_ABSOLUTE_CEILING is 165000 (midpoint of the 150-180K range, item 2.12)', () => {
    expect(COMPACTION_ABSOLUTE_CEILING).toBe(165000);
  });

  test('COMPACTION_PERCENT_TRIGGER is 0.6 (mirrors token-economy.md §1 "60%")', () => {
    expect(COMPACTION_PERCENT_TRIGGER).toBe(0.6);
  });
});

// =============================================================================
// (a) 1M window (real registry, active = claude-fable-5) — absolute wins
// =============================================================================

describe('shouldCompact: 1M window (real registry, active=claude-fable-5)', () => {
  beforeEach(() => resetModelConfigCache());

  test('sanity: real registry active model has a 1M window / 2000 avgTokensPerPrompt', () => {
    const cfg = getModelConfig();
    expect(cfg.maxContext).toBe(1000000);
    expect(cfg.avgTokensPerPrompt).toBe(2000);
  });

  test('does NOT recommend compaction at session start (0 prompts)', () => {
    expect(shouldCompact(0)).toBe(false);
  });

  test('fires exactly at the absolute ceiling crossing (~68.75 prompts), not before', () => {
    // usedTokens(n) = n * 2000 * 1.2 = n * 2400
    // triggerTokens = min(1,000,000 * 0.6, 165,000) = min(600000, 165000) = 165000
    // 165000 / 2400 = 68.75 -> smallest integer prompt count that crosses is 69
    expect(shouldCompact(68)).toBe(false); // 68*2400 = 163,200 < 165,000
    expect(shouldCompact(69)).toBe(true); // 69*2400 = 165,600 >= 165,000
  });

  test('fires via the ABSOLUTE branch, well before 60% of the 1M window is used', () => {
    const promptCount = 100; // comfortably past the 69-prompt absolute trigger
    const usedTokens = promptCount * 2000 * XML_SAFETY_MULTIPLIER; // 240,000
    const sixtyPercentOfWindow = 1000000 * COMPACTION_PERCENT_TRIGGER; // 600,000

    expect(shouldCompact(promptCount)).toBe(true);
    // Proof it's the absolute ceiling doing the work, not the percent rule:
    // usedTokens is nowhere near 60% of the window yet.
    expect(usedTokens).toBeLessThan(sixtyPercentOfWindow);
  });

  test('a pure 60%-of-window rule would wait until ~250 prompts — dual trigger fires far earlier', () => {
    // 600,000 / 2400 = 250 prompts needed under a naive percent-only rule.
    const naivePercentOnlyTrigger = (1000000 * COMPACTION_PERCENT_TRIGGER) / (2000 * XML_SAFETY_MULTIPLIER);
    expect(naivePercentOnlyTrigger).toBe(250);
    expect(shouldCompact(69)).toBe(true); // dual trigger already recommends compaction here
  });
});

// =============================================================================
// (b) 200K window (today's real fallback shape) — equivalence to the
//     pre-existing plain 60%-of-window rule, proven against
//     estimateContextPercent() as an independent oracle.
// =============================================================================

describe('shouldCompact: 200K window (fallback shape) — equivalence proof', () => {
  const opts200k = { avgTokensPerPrompt: 1500, maxContext: 200000 };

  test('effective trigger token count is unchanged: min(120000, 165000) = 120000', () => {
    // 60% of 200,000 = 120,000, which is < the 165,000 absolute ceiling,
    // so the percent branch always wins at this window size.
    // 120000 / (1500*1.2) = 66.666... -> smallest integer crossing is 67.
    expect(shouldCompact(66, opts200k)).toBe(false); // 66*1800 = 118,800 < 120,000
    expect(shouldCompact(67, opts200k)).toBe(true); // 67*1800 = 120,600 >= 120,000
  });

  test('matches the direct 60%-of-window formula for every prompt count 0-150 (zero regression)', () => {
    for (let n = 0; n <= 150; n++) {
      const usedTokens = n * opts200k.avgTokensPerPrompt * XML_SAFETY_MULTIPLIER;
      const legacyRule = usedTokens >= opts200k.maxContext * 0.6;
      expect(shouldCompact(n, opts200k)).toBe(legacyRule);
    }
  });

  test('matches estimateContextPercent as an independent oracle: compact iff >=60% used', () => {
    for (let n = 0; n <= 150; n++) {
      const percentRemaining = estimateContextPercent(n, opts200k);
      const percentUsed = 100 - percentRemaining;
      // estimateContextPercent clamps at 0/100, so only compare in the
      // unclamped region to keep the two independent formulas comparable.
      if (percentRemaining > 0 && percentRemaining < 100) {
        expect(shouldCompact(n, opts200k)).toBe(percentUsed >= 60);
      }
    }
  });
});

// =============================================================================
// (c) Dual-trigger boundary: "MENOR entre" percent e absoluto holds across
//     window sizes, with an exact crossover at 275K
//     (COMPACTION_ABSOLUTE_CEILING / COMPACTION_PERCENT_TRIGGER).
// =============================================================================

describe('shouldCompact: dual-trigger boundary sweep (MENOR entre percent e absoluto)', () => {
  // avgTokensPerPrompt chosen so avgTokensPerPrompt * XML_SAFETY_MULTIPLIER = 1500,
  // which divides every expected trigger value below with no remainder.
  const avgTokensPerPrompt = 1250;
  const perPromptUsedTokens = avgTokensPerPrompt * XML_SAFETY_MULTIPLIER;

  test.each([
    [100000, 60000, 'percent wins (60% of 100K = 60K < 165K ceiling)'],
    [275000, 165000, 'crossover point — percent and absolute coincide exactly'],
    [500000, 165000, 'absolute ceiling wins (60% of window would be 300K)'],
    [1000000, 165000, 'absolute ceiling wins (60% of window would be 600K)'],
  ])('maxContext=%i -> effective trigger is %i tokens (%s)', (maxContext, effectiveTriggerTokens) => {
    const triggerPrompts = effectiveTriggerTokens / perPromptUsedTokens;
    expect(Number.isInteger(triggerPrompts)).toBe(true); // sanity: exact division

    expect(shouldCompact(triggerPrompts - 1, { avgTokensPerPrompt, maxContext })).toBe(false);
    expect(shouldCompact(triggerPrompts, { avgTokensPerPrompt, maxContext })).toBe(true);
  });
});

// =============================================================================
// (d) Graceful handling on invalid input — parity with estimateContextPercent
// =============================================================================

describe('shouldCompact: graceful degradation on invalid input', () => {
  test('returns false for negative promptCount', () => {
    expect(shouldCompact(-5)).toBe(false);
  });

  test('returns false for NaN promptCount', () => {
    expect(shouldCompact(NaN)).toBe(false);
  });

  test('returns false for non-number promptCount', () => {
    expect(shouldCompact('abc')).toBe(false);
    expect(shouldCompact(undefined)).toBe(false);
    expect(shouldCompact(null)).toBe(false);
  });

  test('returns true when maxContext is 0 or negative (fully depleted -> compact)', () => {
    expect(shouldCompact(5, { maxContext: 0 })).toBe(true);
    expect(shouldCompact(5, { maxContext: -100 })).toBe(true);
  });
});
