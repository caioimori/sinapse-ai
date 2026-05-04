// tests/unit/fuzzy.test.js — unit tests for bin/lib/fuzzy.js (Story GA-1.3).

'use strict';

const { levenshtein, closestMatch } = require('../../bin/lib/fuzzy');

describe('fuzzy.levenshtein', () => {
  test('returns 0 for identical strings', () => {
    expect(levenshtein('install', 'install')).toBe(0);
  });

  test('returns length when one string is empty', () => {
    expect(levenshtein('', 'install')).toBe(7);
    expect(levenshtein('install', '')).toBe(7);
  });

  test('handles single-character substitution', () => {
    expect(levenshtein('install', 'instalk')).toBe(1);
  });

  test('handles single-character insertion/deletion', () => {
    expect(levenshtein('install', 'instal')).toBe(1);
    expect(levenshtein('install', 'installs')).toBe(1);
  });

  test('handles transposition as 2 edits (no Damerau)', () => {
    // "isntall" vs "install" — one swap = 2 substitutions in classic Levenshtein
    expect(levenshtein('isntall', 'install')).toBe(2);
  });

  test('coerces non-string inputs safely', () => {
    expect(levenshtein(null, undefined)).toBe(0);
    expect(levenshtein('a', null)).toBe(1);
  });
});

describe('fuzzy.closestMatch', () => {
  const COMMANDS = ['install', 'update', 'uninstall', 'init', 'doctor', 'help'];

  test('returns exact match', () => {
    expect(closestMatch('install', COMMANDS)).toBe('install');
  });

  test('returns close match within default distance (≤ 2)', () => {
    expect(closestMatch('insta', COMMANDS)).toBe('install');
    expect(closestMatch('isntall', COMMANDS)).toBe('install');
    expect(closestMatch('docter', COMMANDS)).toBe('doctor');
    expect(closestMatch('helo', COMMANDS)).toBe('help');
  });

  test('returns null when no candidate within threshold', () => {
    expect(closestMatch('xyz', COMMANDS)).toBeNull();
    expect(closestMatch('completely-unrelated', COMMANDS)).toBeNull();
  });

  test('respects custom maxDistance', () => {
    // 'helo' vs 'help' = distance 1 -> matches with maxDistance=0 NO, =1 YES
    expect(closestMatch('helo', COMMANDS, { maxDistance: 0 })).toBeNull();
    expect(closestMatch('helo', COMMANDS, { maxDistance: 1 })).toBe('help');
  });

  test('is case-insensitive', () => {
    expect(closestMatch('INSTALL', COMMANDS)).toBe('install');
    expect(closestMatch('Install', COMMANDS)).toBe('install');
  });

  test('returns null for empty input or empty candidate list', () => {
    expect(closestMatch('', COMMANDS)).toBeNull();
    expect(closestMatch('install', [])).toBeNull();
    expect(closestMatch('install', null)).toBeNull();
  });
});
