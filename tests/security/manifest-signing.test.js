'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  generateKeyPair,
  signManifest,
  verifyManifest,
  validateManifestSecurity,
  validateManifestPaths,
  loadManifestSecure,
  MAX_MANIFEST_SIZE,
  MAX_FILE_COUNT,
  MAX_DIR_DEPTH,
} = require('../../packages/installer/src/manifest-signature');

describe('manifest-signature', () => {
  describe('generateKeyPair', () => {
    it('returns base64-encoded publicKey and privateKey', () => {
      const keys = generateKeyPair();
      expect(keys).toHaveProperty('publicKey');
      expect(keys).toHaveProperty('privateKey');
      expect(typeof keys.publicKey).toBe('string');
      expect(typeof keys.privateKey).toBe('string');

      // Verify they are valid base64
      const pubBuf = Buffer.from(keys.publicKey, 'base64');
      const privBuf = Buffer.from(keys.privateKey, 'base64');
      expect(pubBuf.length).toBeGreaterThan(0);
      expect(privBuf.length).toBeGreaterThan(0);
    });

    it('generates unique keypairs on each call', () => {
      const keys1 = generateKeyPair();
      const keys2 = generateKeyPair();
      expect(keys1.publicKey).not.toBe(keys2.publicKey);
      expect(keys1.privateKey).not.toBe(keys2.privateKey);
    });
  });

  describe('signManifest / verifyManifest', () => {
    let keys;

    beforeAll(() => {
      keys = generateKeyPair();
    });

    it('signs and verifies a manifest string', () => {
      const content = 'version: 1.0.0\nfiles:\n  - name: test.js\n';
      const signature = signManifest(content, keys.privateKey);
      expect(typeof signature).toBe('string');

      const valid = verifyManifest(content, signature, keys.publicKey);
      expect(valid).toBe(true);
    });

    it('rejects tampered content', () => {
      const content = 'version: 1.0.0\n';
      const signature = signManifest(content, keys.privateKey);

      const tampered = 'version: 2.0.0\n';
      const valid = verifyManifest(tampered, signature, keys.publicKey);
      expect(valid).toBe(false);
    });

    it('rejects wrong public key', () => {
      const content = 'test content';
      const signature = signManifest(content, keys.privateKey);

      const otherKeys = generateKeyPair();
      const valid = verifyManifest(content, signature, otherKeys.publicKey);
      expect(valid).toBe(false);
    });

    it('returns false for invalid base64 signature', () => {
      const valid = verifyManifest('test', '!!!invalid!!!', keys.publicKey);
      expect(valid).toBe(false);
    });

    it('returns false for invalid base64 public key', () => {
      const content = 'test';
      const signature = signManifest(content, keys.privateKey);
      const valid = verifyManifest(content, signature, '!!!invalid!!!');
      expect(valid).toBe(false);
    });
  });

  describe('validateManifestSecurity', () => {
    it('accepts valid content', () => {
      const result = validateManifestSecurity('version: 1.0.0\n');
      expect(result.valid).toBe(true);
    });

    it('rejects content exceeding MAX_MANIFEST_SIZE', () => {
      const huge = 'x'.repeat(MAX_MANIFEST_SIZE + 1);
      const result = validateManifestSecurity(huge);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('exceeds');
    });

    it('rejects content with null bytes', () => {
      const result = validateManifestSecurity('version: 1.0\x00.0\n');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('null bytes');
    });

    it('accepts content at exactly MAX_MANIFEST_SIZE', () => {
      // Generate content that is exactly at the limit
      const exact = 'x'.repeat(MAX_MANIFEST_SIZE);
      const result = validateManifestSecurity(exact);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateManifestPaths', () => {
    it('accepts valid manifest with normal paths', () => {
      const manifest = {
        files: {
          'main.js': 'src/main.js',
          'config.yaml': '.sinapse-ai/core-config.yaml',
        },
      };
      const result = validateManifestPaths(manifest);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('detects path traversal (..)', () => {
      const manifest = {
        files: {
          evil: '../../etc/passwd',
        },
      };
      const result = validateManifestPaths(manifest);
      expect(result.valid).toBe(false);
      expect(result.issues[0]).toContain('Path traversal');
    });

    it('detects absolute paths', () => {
      const manifest = {
        files: {
          evil: '/etc/passwd',
        },
      };
      const result = validateManifestPaths(manifest);
      expect(result.valid).toBe(false);
      expect(result.issues[0]).toContain('Absolute path');
    });

    it('detects Windows ADS (alternate data streams)', () => {
      const manifest = {
        files: {
          evil: 'src/file.txt:hidden_stream',
        },
      };
      const result = validateManifestPaths(manifest);
      expect(result.valid).toBe(false);
      expect(result.issues[0]).toContain('ADS');
    });

    it('detects excessive directory depth', () => {
      const deepPath = Array(MAX_DIR_DEPTH + 2).fill('d').join('/');
      const manifest = {
        files: {
          deep: deepPath,
        },
      };
      const result = validateManifestPaths(manifest);
      expect(result.valid).toBe(false);
      expect(result.issues[0]).toContain('depth');
    });

    it('handles nested manifest structures', () => {
      const manifest = {
        categories: {
          core: {
            files: {
              bad: '../outside/file.js',
            },
          },
        },
      };
      const result = validateManifestPaths(manifest);
      expect(result.valid).toBe(false);
    });

    it('skips non-path strings (no slash)', () => {
      const manifest = {
        version: '1.0.0',
        name: 'sinapse-ai',
        count: '42',
      };
      const result = validateManifestPaths(manifest);
      expect(result.valid).toBe(true);
    });

    it('handles null/undefined values gracefully', () => {
      const manifest = {
        files: null,
        meta: { name: null },
      };
      const result = validateManifestPaths(manifest);
      expect(result.valid).toBe(true);
    });
  });

  describe('loadManifestSecure', () => {
    let tmpDir;
    let keys;

    beforeAll(() => {
      keys = generateKeyPair();
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'));
    });

    afterAll(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('loads and parses a valid manifest', () => {
      const content = 'version: "1.0.0"\nfiles:\n  main: "src/main.js"\n';
      const manifestPath = path.join(tmpDir, 'valid.yaml');
      fs.writeFileSync(manifestPath, content, 'utf8');

      const result = loadManifestSecure(manifestPath);
      expect(result.manifest).toBeDefined();
      expect(result.manifest.version).toBe('1.0.0');
      expect(result.security.signatureVerified).toBeNull();
      expect(result.security.sizeBytes).toBeGreaterThan(0);
    });

    it('verifies signature when provided', () => {
      const content = 'version: "2.0.0"\nname: "test"\n';
      const manifestPath = path.join(tmpDir, 'signed.yaml');
      fs.writeFileSync(manifestPath, content, 'utf8');

      const signature = signManifest(content, keys.privateKey);
      const result = loadManifestSecure(manifestPath, signature, keys.publicKey);
      expect(result.security.signatureVerified).toBe(true);
    });

    it('throws on invalid signature', () => {
      const content = 'version: "3.0.0"\n';
      const manifestPath = path.join(tmpDir, 'badsig.yaml');
      fs.writeFileSync(manifestPath, content, 'utf8');

      // Sign different content
      const badSignature = signManifest('different content', keys.privateKey);
      expect(() => {
        loadManifestSecure(manifestPath, badSignature, keys.publicKey);
      }).toThrow('signature verification FAILED');
    });

    it('throws on null bytes in manifest', () => {
      const content = 'version: "1.0\x00.0"\n';
      const manifestPath = path.join(tmpDir, 'nullbyte.yaml');
      fs.writeFileSync(manifestPath, content, 'utf8');

      expect(() => {
        loadManifestSecure(manifestPath);
      }).toThrow('null bytes');
    });

    it('returns path validation issues in security object', () => {
      const content = 'files:\n  evil: "../../etc/passwd"\n';
      const manifestPath = path.join(tmpDir, 'traversal.yaml');
      fs.writeFileSync(manifestPath, content, 'utf8');

      const result = loadManifestSecure(manifestPath);
      expect(result.security.pathValidation.valid).toBe(false);
      expect(result.security.pathValidation.issues.length).toBeGreaterThan(0);
    });

    it('uses FAILSAFE_SCHEMA (no special types)', () => {
      // FAILSAFE_SCHEMA treats everything as strings
      const content = 'count: 42\nflag: true\n';
      const manifestPath = path.join(tmpDir, 'failsafe.yaml');
      fs.writeFileSync(manifestPath, content, 'utf8');

      const result = loadManifestSecure(manifestPath);
      // With FAILSAFE, 42 and true should remain strings
      expect(typeof result.manifest.count).toBe('string');
      expect(typeof result.manifest.flag).toBe('string');
    });
  });

  describe('constants', () => {
    it('MAX_MANIFEST_SIZE is 10MB', () => {
      expect(MAX_MANIFEST_SIZE).toBe(10 * 1024 * 1024);
    });

    it('MAX_FILE_COUNT is 50000', () => {
      expect(MAX_FILE_COUNT).toBe(50000);
    });

    it('MAX_DIR_DEPTH is 50', () => {
      expect(MAX_DIR_DEPTH).toBe(50);
    });
  });
});
