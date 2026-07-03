/**
 * Manifest Signature Verification
 * Implements minisign-compatible signature verification for install manifests
 *
 * @module src/installer/manifest-signature
 * @story 6.19 - Post-Installation Validation & Integrity Verification
 * @security CRITICAL - This module establishes the root of trust
 *
 * Signing workflow (offline, by maintainers):
 *   minisign -Sm install-manifest.yaml -s /path/to/secret.key
 *
 * This creates install-manifest.yaml.minisig
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');

/**
 * Security limits for signature verification
 * @constant
 */
const SignatureLimits = {
  // Maximum manifest file size (10MB) - prevents DoS via large file loading
  MAX_MANIFEST_SIZE: 10 * 1024 * 1024,
  // Maximum signature file size (10KB) - .minisig files are typically ~200 bytes
  MAX_SIGNATURE_SIZE: 10 * 1024,
};

/**
 * Signature verification feature flag.
 * Set to true AND provide SINAPSE_MANIFEST_PUBLIC_KEY env var (or replace
 * the pinned key below) to enable manifest signature verification.
 */
const SIGNATURE_VERIFICATION_ENABLED = false;

/**
 * PINNED PUBLIC KEY - Root of trust for manifest verification.
 * Generated with: minisign -G -p sinapse-ai.pub -s sinapse-ai.key
 *
 * When SIGNATURE_VERIFICATION_ENABLED is true, the public key MUST be set.
 * It can be provided via:
 *   1. SINAPSE_MANIFEST_PUBLIC_KEY environment variable (base64-encoded Ed25519)
 *   2. Hardcoded below (replace null with the actual key)
 *
 * Format: base64-encoded Ed25519 public key (32 bytes)
 */
const PINNED_PUBLIC_KEY = {
  // Key ID (8 bytes, base64 encoded) - opaque identifier, not UTF-8 text
  // This is compared as raw bytes against the signature's key ID
  keyId: Buffer.from('SINAPSE0001').toString('base64'), // 'QUlPUzAwMDE='
  // Ed25519 public key (32 bytes, base64 encoded)
  // Set via env var SINAPSE_MANIFEST_PUBLIC_KEY or hardcode here when production key is generated
  publicKey: process.env.SINAPSE_MANIFEST_PUBLIC_KEY || null,
  // Algorithm identifier
  algorithm: 'Ed25519',
};

/**
 * Check if signature verification is properly configured
 * @returns {boolean} True if verification is enabled and a key is set
 */
function isVerificationConfigured() {
  return SIGNATURE_VERIFICATION_ENABLED && PINNED_PUBLIC_KEY.publicKey != null;
}

/**
 * Check if the pinned public key is still the placeholder (legacy compat)
 * @returns {boolean} True if key is not configured
 */
function isPlaceholderKey() {
  return !PINNED_PUBLIC_KEY.publicKey;
}

/**
 * Signature verification result
 * @typedef {Object} VerificationResult
 * @property {boolean} valid - True if signature is valid
 * @property {string|null} error - Error message if invalid
 * @property {string|null} keyId - Key ID used for signing
 */

/**
 * Parse a minisign signature file
 * Minisign signature format:
 *   Line 1: untrusted comment
 *   Line 2: base64-encoded signature
 *   Line 3 (optional): trusted comment
 *   Line 4 (optional): base64-encoded global signature
 *
 * @param {string} signatureContent - Content of .minisig file
 * @returns {Object} Parsed signature components
 */
function parseMinisignSignature(signatureContent) {
  const lines = signatureContent.trim().split('\n');

  if (lines.length < 2) {
    throw new Error('Invalid signature format: insufficient lines');
  }

  // Line 1: untrusted comment (starts with "untrusted comment: ")
  if (!lines[0].startsWith('untrusted comment:')) {
    throw new Error('Invalid signature format: missing untrusted comment');
  }

  // Line 2: base64 signature blob
  const signatureBlob = Buffer.from(lines[1].trim(), 'base64');

  if (signatureBlob.length < 74) {
    throw new Error('Invalid signature format: signature too short');
  }

  // Parse signature blob structure:
  // bytes 0-1: algorithm (Ed = 0x45 0x64)
  // bytes 2-9: key ID (8 bytes)
  // bytes 10-73: signature (64 bytes)
  const algorithm = signatureBlob.slice(0, 2).toString('ascii');
  const keyId = signatureBlob.slice(2, 10);
  const signature = signatureBlob.slice(10, 74);

  // Optional: trusted comment and global signature
  let trustedComment = null;
  let globalSignature = null;

  if (lines.length >= 4) {
    if (lines[2].startsWith('trusted comment:')) {
      trustedComment = lines[2].substring('trusted comment:'.length).trim();
      globalSignature = Buffer.from(lines[3].trim(), 'base64');
    }
  }

  return {
    algorithm,
    keyId,
    signature,
    trustedComment,
    globalSignature,
  };
}

/**
 * Verify Ed25519 signature using Node.js crypto
 *
 * @param {Buffer} message - Message that was signed
 * @param {Buffer} signature - 64-byte Ed25519 signature
 * @param {Buffer} publicKey - 32-byte Ed25519 public key
 * @returns {boolean} True if signature is valid
 */
function verifyEd25519(message, signature, publicKey) {
  try {
    // Node.js 16+ supports Ed25519 natively
    const keyObject = crypto.createPublicKey({
      key: Buffer.concat([
        // Ed25519 public key DER prefix
        Buffer.from('302a300506032b6570032100', 'hex'),
        publicKey,
      ]),
      format: 'der',
      type: 'spki',
    });

    return crypto.verify(null, message, keyObject, signature);
  } catch (_error) {
    // Fallback error - verification failed
    return false;
  }
}

/**
 * Compute Blake2b-512 hash for prehashed signatures
 * @param {Buffer} data - Data to hash
 * @returns {Buffer} 64-byte Blake2b-512 hash
 */
function blake2b512(data) {
  // Node.js 16+ supports blake2b512 natively
  return crypto.createHash('blake2b512').update(data).digest();
}

/**
 * Verify manifest signature against pinned public key
 *
 * SECURITY: This function MUST be called BEFORE parsing the manifest YAML.
 * The manifest content should be treated as untrusted bytes until this returns valid.
 *
 * @param {Buffer} manifestContent - Raw manifest file content (NOT parsed)
 * @param {string} signatureContent - Content of .minisig signature file
 * @param {Object} [options] - Verification options
 * @param {Object} [options.publicKey] - Override public key (for testing only)
 * @returns {VerificationResult} Verification result
 */
function verifyManifestSignature(manifestContent, signatureContent, options = {}) {
  const result = {
    valid: false,
    error: null,
    keyId: null,
  };

  try {
    // SECURITY: Check if verification is properly configured
    const pubKey = options.publicKey || PINNED_PUBLIC_KEY;
    if (!options.publicKey && !isVerificationConfigured()) {
      result.error = 'Signature verification not configured: ' +
        (SIGNATURE_VERIFICATION_ENABLED
          ? 'Set SINAPSE_MANIFEST_PUBLIC_KEY env var or hardcode the Ed25519 public key.'
          : 'SIGNATURE_VERIFICATION_ENABLED is false. Enable when production key is ready.');
      return result;
    }

    // Parse signature file
    const sig = parseMinisignSignature(signatureContent);

    // Verify algorithm - minisign uses "Ed" for pure Ed25519, "ED" for prehashed
    const isPrehashed = sig.algorithm === 'ED';
    if (sig.algorithm !== 'Ed' && sig.algorithm !== 'ED') {
      result.error = `Unsupported signature algorithm '${sig.algorithm}' (expected 'Ed' or 'ED')`;
      return result;
    }

    // Verify key ID matches (compare as raw bytes, not UTF-8)
    const expectedKeyId = Buffer.from(pubKey.keyId, 'base64');
    result.keyId = sig.keyId.toString('hex'); // Display as hex for debugging

    if (!sig.keyId.equals(expectedKeyId)) {
      result.error = `Key ID mismatch: expected ${expectedKeyId.toString('hex')}, got ${result.keyId}`;
      return result;
    }

    // Decode public key
    const publicKeyBytes = Buffer.from(pubKey.publicKey, 'base64');
    if (publicKeyBytes.length !== 32) {
      result.error = 'Invalid public key length';
      return result;
    }

    // Verify signature
    // Minisign uses Blake2b-512(message) for prehashed mode ("ED"), or message directly ("Ed")
    const messageToVerify = isPrehashed ? blake2b512(manifestContent) : manifestContent;
    const isValid = verifyEd25519(messageToVerify, sig.signature, publicKeyBytes);

    if (!isValid) {
      result.error = 'Signature verification failed';
      return result;
    }

    // If trusted comment exists, verify global signature
    if (sig.trustedComment && sig.globalSignature) {
      // SECURITY: Validate global signature length (must be 64 bytes for Ed25519)
      if (sig.globalSignature.length !== 64) {
        result.error = `Invalid global signature length: expected 64 bytes, got ${sig.globalSignature.length}`;
        return result;
      }
      const globalMessage = Buffer.concat([sig.signature, Buffer.from(sig.trustedComment)]);
      const globalValid = verifyEd25519(globalMessage, sig.globalSignature, publicKeyBytes);
      if (!globalValid) {
        result.error = 'Trusted comment signature verification failed';
        return result;
      }
    }

    result.valid = true;
    return result;
  } catch (error) {
    result.error = `Signature parsing error: ${error.message}`;
    return result;
  }
}

/**
 * Check if signature file exists for a manifest
 *
 * @param {string} manifestPath - Path to manifest file
 * @returns {boolean} True if signature file exists
 */
function signatureExists(manifestPath) {
  return fs.existsSync(manifestPath + '.minisig');
}

/**
 * Load and verify manifest with signature
 *
 * @param {string} manifestPath - Path to manifest file
 * @param {Object} [options] - Options
 * @param {boolean} [options.requireSignature=true] - Fail if signature missing
 * @param {Object} [options.publicKey] - Override public key (testing only)
 * @returns {Object} { content: Buffer, verified: boolean, error: string|null }
 */
/**
 * Open + fstat + read on a SINGLE file descriptor.
 *
 * SECURITY [TOCTOU]: size check (DoS guard) and read happen on the same open
 * fd, so a concurrent writer cannot swap the file between the check and the
 * use — the buffer verified downstream is exactly the bytes that were sized.
 *
 * @param {string} filePath - File to read
 * @param {number} maxSize - Maximum allowed size in bytes
 * @param {string} label - Human label used in error messages (e.g. "Manifest file")
 * @returns {{content: Buffer|null, error: string|null, missing: boolean}}
 */
function readFileCapped(filePath, maxSize, label) {
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
  } catch (error) {
    return {
      content: null,
      error: `Cannot read ${label.toLowerCase()}: ${error.message}`,
      missing: error.code === 'ENOENT',
    };
  }
  try {
    const stat = fs.fstatSync(fd);
    if (stat.size > maxSize) {
      return {
        content: null,
        error: `${label} exceeds maximum size (${maxSize} bytes)`,
        missing: false,
      };
    }
    const content = Buffer.alloc(stat.size);
    fs.readSync(fd, content, 0, stat.size, 0);
    return { content, error: null, missing: false };
  } catch (error) {
    return {
      content: null,
      error: `Cannot read ${label.toLowerCase()}: ${error.message}`,
      missing: false,
    };
  } finally {
    fs.closeSync(fd);
  }
}

function loadAndVerifyManifest(manifestPath, options = {}) {
  const requireSignature = options.requireSignature !== false;
  const signaturePath = manifestPath + '.minisig';

  // SECURITY [DOS-1] + [TOCTOU]: size is validated on the same fd that is
  // read, so the verified buffer cannot be swapped after the check.
  const manifest = readFileCapped(manifestPath, SignatureLimits.MAX_MANIFEST_SIZE, 'Manifest file');
  if (manifest.content === null) {
    return {
      content: null,
      verified: false,
      error: manifest.missing ? 'Manifest file not found' : manifest.error,
    };
  }

  // SECURITY [DOS-2] + [TOCTOU]: same single-fd pattern for the signature
  const signature = readFileCapped(signaturePath, SignatureLimits.MAX_SIGNATURE_SIZE, 'Signature file');
  if (signature.content === null) {
    if (signature.missing) {
      if (requireSignature) {
        return {
          content: null,
          verified: false,
          error: 'Manifest signature file not found (.minisig)',
        };
      }
      // Allow unsigned in dev mode (requireSignature=false)
      return {
        content: manifest.content,
        verified: false,
        error: null,
      };
    }
    return {
      content: null,
      verified: false,
      error: signature.error,
    };
  }

  const manifestContent = manifest.content;
  const signatureContent = signature.content.toString('utf8');

  // Verify signature BEFORE any parsing
  const verifyResult = verifyManifestSignature(manifestContent, signatureContent, options);

  if (!verifyResult.valid) {
    return {
      content: null,
      verified: false,
      error: verifyResult.error,
    };
  }

  return {
    content: manifestContent,
    verified: true,
    error: null,
  };
}

module.exports = {
  verifyManifestSignature,
  signatureExists,
  loadAndVerifyManifest,
  isPlaceholderKey,
  isVerificationConfigured,
  parseMinisignSignature,
  PINNED_PUBLIC_KEY,
  SIGNATURE_VERIFICATION_ENABLED,
  SignatureLimits,
};

