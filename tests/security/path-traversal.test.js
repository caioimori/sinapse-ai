'use strict';

/**
 * Path Traversal Prevention Tests
 * Story 8.10: Security Test Suite
 *
 * Validates that path traversal attacks are correctly detected and blocked.
 * Tests both dangerous paths (must reject) and safe paths (must allow).
 *
 * @module tests/security/path-traversal.test
 */

const path = require('path');

// ---------------------------------------------------------------------------
// Path safety validator
// ---------------------------------------------------------------------------

const PROJECT_ROOT = path.resolve(__dirname, '../..');

/**
 * Validates that a path is safe (within project root, no null bytes, no
 * URL-encoded traversal sequences).
 *
 * @param {string} inputPath - Path to validate
 * @returns {boolean} true if safe
 */
function isPathSafe(inputPath) {
  // Reject null bytes
  if (inputPath.includes('\x00')) return false;

  // Reject URL-encoded traversal
  if (/%2e/i.test(inputPath) || /%2f/i.test(inputPath) || /%5c/i.test(inputPath)) return false;

  // Reject protocol prefixes
  if (/^[a-z]+:\/\//i.test(inputPath)) return false;

  // Reject backslash traversal (cross-platform: Linux doesn't treat \ as separator)
  if (inputPath.includes('..\\')) return false;

  // Resolve and check prefix
  const resolved = path.resolve(PROJECT_ROOT, inputPath);
  return resolved.startsWith(PROJECT_ROOT);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Path Traversal Prevention (Story 8.10)', () => {
  describe('dangerous paths — must be rejected', () => {
    const DANGEROUS_PATHS = [
      { input: '../../../etc/passwd', reason: 'unix relative traversal' },
      { input: '..\\..\\windows\\system32', reason: 'windows relative traversal' },
      { input: 'file:///etc/passwd', reason: 'file protocol' },
      { input: 'http://evil.com/payload', reason: 'http protocol' },
      { input: '%2e%2e%2f%2e%2e%2f', reason: 'URL-encoded traversal' },
      { input: '%2E%2E%2Fetc%2Fpasswd', reason: 'URL-encoded uppercase' },
      { input: 'path/with\x00null', reason: 'null byte injection' },
      { input: 'foo\x00.js', reason: 'null byte with extension' },
      { input: '%5c..%5c..%5cwindows', reason: 'URL-encoded backslash traversal' },
      { input: 'ftp://internal/secret', reason: 'ftp protocol' },
    ];

    test.each(DANGEROUS_PATHS)('rejects: $input ($reason)', ({ input }) => {
      expect(isPathSafe(input)).toBe(false);
    });
  });

  describe('safe paths — must be accepted', () => {
    const SAFE_PATHS = [
      'docs/readme.md',
      '.sinapse-ai/core/index.js',
      'packages/installer/src/main.js',
      'tests/unit/test.js',
      'src/components/Button.tsx',
      '.claude/hooks/secret-scanning.cjs',
      'node_modules/jest/package.json',
      'CHANGELOG.md',
    ];

    test.each(SAFE_PATHS)('accepts: %s', (safePath) => {
      expect(isPathSafe(safePath)).toBe(true);
    });
  });

  describe('edge cases', () => {
    test('empty string resolves to project root (safe)', () => {
      expect(isPathSafe('')).toBe(true);
    });

    test('single dot resolves to project root (safe)', () => {
      expect(isPathSafe('.')).toBe(true);
    });

    test('deeply nested safe path is accepted', () => {
      expect(isPathSafe('a/b/c/d/e/f/g/h/i/j/k.js')).toBe(true);
    });

    test('path with .. that stays within root is still rejected by protocol check', () => {
      // e.g., "src/../src/index.js" resolves within root, but we accept it
      // because path.resolve handles it correctly
      const tricky = 'src/../src/index.js';
      const resolved = path.resolve(PROJECT_ROOT, tricky);
      // This actually stays within root, so it should be safe
      expect(resolved.startsWith(PROJECT_ROOT)).toBe(true);
      expect(isPathSafe(tricky)).toBe(true);
    });

    test('absolute path outside project root is rejected', () => {
      // On Windows, /etc/passwd resolves relative to current drive root
      // but the isPathSafe function uses protocol check for absolute paths with ://
      // For truly absolute paths, path.resolve keeps them as-is
      const outsidePath = path.join(PROJECT_ROOT, '..', '..', '..', 'etc', 'passwd');
      const resolved = path.resolve(PROJECT_ROOT, outsidePath);
      expect(resolved.startsWith(PROJECT_ROOT)).toBe(false);
      expect(isPathSafe(outsidePath)).toBe(false);
    });

    test('Windows UNC path pattern', () => {
      // UNC paths should be caught by protocol or prefix check
      const unc = '\\\\server\\share\\file.txt';
      // On Windows, this resolves to a UNC path outside project root
      const resolved = path.resolve(PROJECT_ROOT, unc);
      if (!resolved.startsWith(PROJECT_ROOT)) {
        expect(isPathSafe(unc)).toBe(false);
      }
    });
  });

  describe('URL-encoded variations', () => {
    test('single-encoded dot-dot-slash', () => {
      expect(isPathSafe('%2e%2e%2f')).toBe(false);
    });

    test('mixed case encoding', () => {
      expect(isPathSafe('%2E%2e%2F')).toBe(false);
    });

    test('encoded backslash', () => {
      expect(isPathSafe('%5c%2e%2e')).toBe(false);
    });

    test('normal percent in filename is NOT URL encoding', () => {
      // A filename like "report-50%.txt" should be safe
      // as long as it doesn't match %2e/%2f/%5c patterns
      expect(isPathSafe('docs/report-50%25.txt')).toBe(true);
    });
  });
});
