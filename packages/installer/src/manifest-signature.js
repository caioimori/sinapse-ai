'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Maximum limits to prevent DoS
const MAX_MANIFEST_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_COUNT = 50000;
const MAX_DIR_DEPTH = 50;

/**
 * Validates manifest content for security before YAML parsing.
 * @param {string} rawContent - Raw file content
 * @returns {{ valid: boolean, reason?: string }}
 */
function validateManifestSecurity(rawContent) {
  // Size check
  if (Buffer.byteLength(rawContent, 'utf8') > MAX_MANIFEST_SIZE) {
    return { valid: false, reason: `Manifest exceeds ${MAX_MANIFEST_SIZE} bytes` };
  }

  // Null byte check
  if (rawContent.includes('\x00')) {
    return { valid: false, reason: 'Manifest contains null bytes' };
  }

  return { valid: true };
}

/**
 * Validates paths in parsed manifest for traversal attacks.
 * @param {object} manifest - Parsed YAML manifest
 * @returns {{ valid: boolean, issues: string[] }}
 */
function validateManifestPaths(manifest) {
  const issues = [];
  let fileCount = 0;

  function checkPath(filePath, context) {
    fileCount++;
    if (fileCount > MAX_FILE_COUNT) {
      issues.push(`File count exceeds ${MAX_FILE_COUNT}`);
      return;
    }

    // Path traversal
    if (filePath.includes('..')) {
      issues.push(`Path traversal detected in ${context}: ${filePath}`);
    }

    // Absolute paths
    if (path.isAbsolute(filePath)) {
      issues.push(`Absolute path in ${context}: ${filePath}`);
    }

    // Windows ADS
    if (filePath.includes(':') && !filePath.match(/^[a-zA-Z]:/)) {
      issues.push(`Possible ADS in ${context}: ${filePath}`);
    }

    // Depth check
    const depth = filePath.split(/[/\\]/).length;
    if (depth > MAX_DIR_DEPTH) {
      issues.push(`Path depth ${depth} exceeds ${MAX_DIR_DEPTH} in ${context}`);
    }
  }

  // Walk manifest structure looking for file paths
  function walk(obj, prefix) {
    if (!obj || typeof obj !== 'object') return;
    for (const [key, value] of Object.entries(obj)) {
      const ctx = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string' && (value.includes('/') || value.includes('\\'))) {
        checkPath(value, ctx);
      } else if (typeof value === 'object') {
        walk(value, ctx);
      }
    }
  }

  walk(manifest, '');
  return { valid: issues.length === 0, issues };
}

/**
 * Generates Ed25519 keypair for signing.
 * @returns {{ publicKey: string, privateKey: string }} Base64-encoded keys
 */
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' },
  });
  return {
    publicKey: publicKey.toString('base64'),
    privateKey: privateKey.toString('base64'),
  };
}

/**
 * Signs manifest content with Ed25519 private key.
 * @param {string} content - Raw manifest content
 * @param {string} privateKeyBase64 - Base64-encoded private key (DER PKCS8)
 * @returns {string} Base64-encoded signature
 */
function signManifest(content, privateKeyBase64) {
  const privateKey = crypto.createPrivateKey({
    key: Buffer.from(privateKeyBase64, 'base64'),
    format: 'der',
    type: 'pkcs8',
  });
  const signature = crypto.sign(null, Buffer.from(content, 'utf8'), privateKey);
  return signature.toString('base64');
}

/**
 * Verifies manifest signature with Ed25519 public key.
 * @param {string} content - Raw manifest content
 * @param {string} signatureBase64 - Base64-encoded signature
 * @param {string} publicKeyBase64 - Base64-encoded public key (DER SPKI)
 * @returns {boolean}
 */
function verifyManifest(content, signatureBase64, publicKeyBase64) {
  try {
    const publicKey = crypto.createPublicKey({
      key: Buffer.from(publicKeyBase64, 'base64'),
      format: 'der',
      type: 'spki',
    });
    return crypto.verify(
      null,
      Buffer.from(content, 'utf8'),
      publicKey,
      Buffer.from(signatureBase64, 'base64'),
    );
  } catch {
    return false;
  }
}

/**
 * Loads and validates a manifest file securely.
 * @param {string} manifestPath - Path to manifest YAML
 * @param {string} [signatureBase64] - Optional signature to verify
 * @param {string} [publicKeyBase64] - Optional public key for verification
 * @returns {{ manifest: object, security: object }}
 */
function loadManifestSecure(manifestPath, signatureBase64, publicKeyBase64) {
  const rawContent = fs.readFileSync(manifestPath, 'utf8');

  // Step 1: Pre-parse security validation
  const preCheck = validateManifestSecurity(rawContent);
  if (!preCheck.valid) {
    throw new Error(`Manifest security check failed: ${preCheck.reason}`);
  }

  // Step 2: Verify signature BEFORE parsing YAML (if provided)
  let signatureValid = null;
  if (signatureBase64 && publicKeyBase64) {
    signatureValid = verifyManifest(rawContent, signatureBase64, publicKeyBase64);
    if (!signatureValid) {
      throw new Error('Manifest signature verification FAILED — possible tampering');
    }
  }

  // Step 3: Parse YAML with FAILSAFE schema (no code execution)
  const manifest = yaml.load(rawContent, { schema: yaml.FAILSAFE_SCHEMA });

  // Step 4: Validate paths in parsed manifest
  const pathCheck = validateManifestPaths(manifest);

  return {
    manifest,
    security: {
      sizeBytes: Buffer.byteLength(rawContent, 'utf8'),
      signatureVerified: signatureValid,
      pathValidation: pathCheck,
    },
  };
}

module.exports = {
  generateKeyPair,
  signManifest,
  verifyManifest,
  validateManifestSecurity,
  validateManifestPaths,
  loadManifestSecure,
  MAX_MANIFEST_SIZE,
  MAX_FILE_COUNT,
  MAX_DIR_DEPTH,
};
