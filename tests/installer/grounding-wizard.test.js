/**
 * Grounding wizard question helpers tests.
 *
 * @story 10.47 — verifies the 3 inquirer question helpers + the combined
 * sequence behave correctly (defaults, filter, naming).
 */

'use strict';

const path = require('path');

const questions = require(
  path.join(__dirname, '..', '..', 'packages', 'installer', 'src', 'wizard', 'questions'),
);

const {
  getVaultGroundingQuestion,
  getDesignSystemGroundingQuestion,
  getBrandGroundingQuestion,
  getGroundingQuestions,
} = questions;

describe('Grounding question helpers (Story 10.47)', () => {
  test('getVaultGroundingQuestion shape', () => {
    const q = getVaultGroundingQuestion();
    expect(q.type).toBe('input');
    expect(q.name).toBe('vaultPath');
    expect(q.default).toBe('');
    expect(typeof q.filter).toBe('function');
  });

  test('getDesignSystemGroundingQuestion shape', () => {
    const q = getDesignSystemGroundingQuestion();
    expect(q.type).toBe('input');
    expect(q.name).toBe('designSystemPath');
    expect(q.default).toBe('');
  });

  test('getBrandGroundingQuestion shape', () => {
    const q = getBrandGroundingQuestion();
    expect(q.type).toBe('input');
    expect(q.name).toBe('brandbookPath');
    expect(q.default).toBe('');
  });

  test('filter trims whitespace', () => {
    const q = getVaultGroundingQuestion();
    expect(q.filter('  /some/path  ')).toBe('/some/path');
    expect(q.filter('')).toBe('');
    expect(q.filter('   ')).toBe('');
  });

  test('filter handles non-string defensively', () => {
    const q = getDesignSystemGroundingQuestion();
    expect(q.filter(undefined)).toBe('');
    expect(q.filter(null)).toBe('');
    expect(q.filter(123)).toBe('');
  });

  test('getGroundingQuestions returns the 3 helpers in the expected order', () => {
    const all = getGroundingQuestions();
    expect(all).toHaveLength(3);
    expect(all[0].name).toBe('vaultPath');
    expect(all[1].name).toBe('designSystemPath');
    expect(all[2].name).toBe('brandbookPath');
  });

  test('messages include the skip hint', () => {
    expect(getVaultGroundingQuestion().message).toMatch(/pular/i);
    expect(getDesignSystemGroundingQuestion().message).toMatch(/pular/i);
    expect(getBrandGroundingQuestion().message).toMatch(/pular/i);
  });
});
