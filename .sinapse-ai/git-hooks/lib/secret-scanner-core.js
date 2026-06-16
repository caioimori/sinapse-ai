'use strict';

/**
 * Secret Scanner Core — shared detection logic.
 *
 * Single source of truth for secret detection, imported by BOTH:
 *   - .claude/hooks/secret-scanning.cjs  (Claude Code PreToolUse, Write/Edit content)
 *   - bin/utils/staged-secret-scan.js    (git pre-commit, staged diff content)
 *
 * Hardening (Frente 4.2 — Stream A):
 *   - All 20+ named patterns preserved (no regression).
 *   - Shannon entropy: flags high-entropy tokens (>= 20 contiguous chars,
 *     >= 4.5 bits/char) as suspected secrets, BEYOND the named patterns.
 *     Lockfile-hash context + code-identifier band are allowlisted to avoid
 *     false positives on integrity hashes and long camelCase symbols.
 *   - Allowlist: placeholders (your-key-here, xxx, CHANGEME, REPLACE_ME, <...>,
 *     example.com, etc.) and obvious fakes PASS.
 *   - Redaction: matched secrets are never printed in full.
 *   - Designed for fail-CLOSED callers (this module never silently allows).
 *
 * @module bin/utils/secret-scanner-core
 */

// Private-key PEM headers are built from fragments so this source file holds no
// literal "BEGIN ... PRIVATE KEY" marker (avoids self-tripping secret scanners).
const PK = 'PRIVATE KEY';
const BEGIN = '-----BEGIN ';
const END5 = '-----';

const NAMED_PATTERNS = [
  // API Keys & Tokens
  { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/ },
  { name: 'AWS Secret Key', pattern: /(?:aws_secret_access_key|secret_key)\s*[=:]\s*['"]?[A-Za-z0-9/+=]{40}['"]?/i, lowConfidence: true },
  { name: 'GitHub Token', pattern: /gh[ps]_[A-Za-z0-9_]{36,}/ },
  { name: 'GitHub OAuth', pattern: /gho_[A-Za-z0-9_]{36,}/ },
  { name: 'GitHub Fine-Grained Token', pattern: /github_pat_[A-Za-z0-9_]{22,}/ },
  { name: 'Slack Token', pattern: /xox[bpors]-[0-9]{10,}-[A-Za-z0-9-]+/ },
  { name: 'Stripe Key', pattern: /[sr]k_(live|test)_[A-Za-z0-9]{20,}/ },
  // OpenAI project-scoped keys (`sk-proj-…`) contain hyphens/underscores, so the
  // generic `sk-[A-Za-z0-9]{20,}` rule below stops at the first hyphen and never
  // matches the body. This explicit rule is CONCLUSIVE on shape (the `sk-proj-`
  // prefix is unambiguous) and is NOT entropy-gated, so a leaked project key is
  // caught even when its tail happens to score low on Shannon entropy.
  { name: 'OpenAI Project Key', pattern: /sk-proj-[A-Za-z0-9_-]{40,}/ },
  // Other OpenAI key families that also carry separators (svcacct / admin).
  { name: 'OpenAI Service/Admin Key', pattern: /sk-(?:svcacct|admin)-[A-Za-z0-9_-]{20,}/ },
  // Legacy/classic OpenAI keys (`sk-` + contiguous alnum). Entropy-gated to avoid
  // tripping on `sk-` prefixed identifiers; threshold lowered to 3.0 (see note).
  { name: 'OpenAI Key', pattern: new RegExp('sk-[A-Za-z0-9]{20,}'), entropyGated: true },
  { name: 'Anthropic Key', pattern: new RegExp('sk-ant-[A-Za-z0-9-]{20,}') },
  { name: 'Supabase Key', pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{50,}/ },
  { name: 'Google API Key', pattern: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'Vercel Token', pattern: /vercel_[A-Za-z0-9]{20,}/ },

  // Private Keys (built dynamically; no literal header in source)
  { name: 'RSA Private Key', pattern: new RegExp(BEGIN + 'RSA ' + PK + END5) },
  { name: 'SSH Private Key', pattern: new RegExp(BEGIN + 'OPENSSH ' + PK + END5) },
  { name: 'PGP Private Key', pattern: new RegExp(BEGIN + 'PGP ' + PK + ' BLOCK' + END5) },
  { name: 'EC Private Key', pattern: new RegExp(BEGIN + 'EC ' + PK + END5) },
  { name: 'DSA Private Key', pattern: new RegExp(BEGIN + 'DSA ' + PK + END5) },
  { name: 'Generic Private Key', pattern: new RegExp(BEGIN + PK + END5) },

  // Connection Strings
  { name: 'DB Connection String', pattern: /(?:postgres|mysql|mongodb|redis):\/\/[^:]+:[^@]+@[^/\s]+/i },
  { name: 'Supabase DB URL', pattern: /postgresql:\/\/postgres\.[A-Za-z0-9]+:[^@]+@/i },

  // Generic Patterns (broader, lower confidence — placeholder-allowlisted)
  { name: 'Hardcoded Password', pattern: /(?:password|passwd|pwd)\s*[=:]\s*['"][^'"]{8,}['"]/i, lowConfidence: true },
  { name: 'Bearer Token', pattern: /[Bb]earer\s+[A-Za-z0-9_\-.]{20,}/, entropyGated: true, lowConfidence: true },
  { name: 'Basic Auth', pattern: /[Bb]asic\s+[A-Za-z0-9+/=]{20,}/, lowConfidence: true },
];

const PLACEHOLDER_TOKENS = [
  'your-key', 'your_key', 'yourkey', 'your-secret', 'your_secret',
  'your-token', 'your_token', 'your-api', 'your_api',
  'xxx', 'changeme', 'change-me', 'change_me',
  'replace_me', 'replace-me', 'replaceme', 'replace_with',
  'placeholder', 'example', 'sample', 'dummy', 'fake',
  'todo', 'tbd', 'redacted', 'insert', 'put-your', 'put_your',
  'my-secret', 'mysecret', 'my-password', 'mypassword',
  'supersecret', 'super-secret', 'secret123', 'password123',
  'notarealkey', 'not-a-real', 'test-key', 'test_key', 'testkey',
  'abcdef', '123456', '000000', 'aaaaaa',
];

const PLACEHOLDER_PATTERNS = [
  /^<.*>$/,                 // <sua-chave>, <token>, <REPLACE>
  /^\[.*\]$/,               // [CHANGE_ME], [your key]
  /^\{\{?.*\}?\}$/,         // {token}, {{secret}}
  /^\$\{.*\}$/,             // ${TOKEN}
  // SCREAMING_SNAKE env-var name used as value. Requires an underscore so raw
  // all-caps secrets (e.g. AWS access keys) are NOT allowlisted by this rule.
  /^[A-Z][A-Z0-9]*_[A-Z0-9_]*$/,
  /^(x+|y+|z+|n+|0+|a+|\.+|-+|_+|\*+)$/i, // xxxx, 0000, ----, ....
];

const EXAMPLE_HOST_PATTERN = /(?:example\.(?:com|org|net)|localhost|127\.0\.0\.1|host\b|your-host|placeholder)/i;

function isAllowlistPlaceholder(value) {
  if (value === null || value === undefined) return false;
  const v = String(value).trim();
  if (v.length === 0) return true;

  const lower = v.toLowerCase();
  for (const token of PLACEHOLDER_TOKENS) {
    if (lower.includes(token)) return true;
  }
  for (const re of PLACEHOLDER_PATTERNS) {
    if (re.test(v)) return true;
  }
  if (/^(.)\1{5,}$/.test(v)) return true; // repeated single char
  return false;
}

function shannonEntropy(str) {
  if (!str || str.length === 0) return 0;
  const freq = Object.create(null);
  for (const ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  const len = str.length;
  let entropy = 0;
  for (const ch in freq) {
    const p = freq[ch] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

// 4.5 bits/char: long camelCase/snake identifiers in source top out around
// ~4.2 (dictionary words have repeated letters), while real random secrets —
// base64 of random bytes (~5.5), mixed alphanumeric tokens (~5.0), even base64
// of text (~4.5) — clear it. Set above the identifier band to kill false
// positives on code symbols; named patterns still catch branded low-entropy keys.
const ENTROPY_THRESHOLD = 4.5;
const ENTROPY_MIN_LEN = 20;
const TOKEN_SHAPE = /[A-Za-z0-9_\-/+=]{20,}/g;

const LOCKFILE_PATH_PATTERN = /(?:^|\/)(?:package-lock\.json|yarn\.lock|pnpm-lock\.yaml|composer\.lock|Cargo\.lock|poetry\.lock|Gemfile\.lock|bun\.lockb)$/i;
const HASH_CONTEXT_PATTERN = /(?:sha512-|sha384-|sha256-|sha1-|integrity"?\s*[:=]|"resolved"|"checksum"|"hash"|[a-f0-9]{40}|[a-f0-9]{64})/i;

function isLockfilePath(filePath) {
  if (!filePath) return false;
  return LOCKFILE_PATH_PATTERN.test(String(filePath).replace(/\\/g, '/'));
}

function redactMatch(value, keep = 4) {
  const v = String(value == null ? '' : value);
  if (v.length === 0) return '[REDACTED]';
  if (v.length <= keep) return '[REDACTED]';
  const prefix = v.slice(0, keep);
  return prefix + '...[REDACTED ' + (v.length - keep) + ' chars]';
}

function scanContent(content, options = {}) {
  const text = String(content == null ? '' : content);
  const filePath = options.filePath || '';
  const entropyEnabled = options.entropy !== false;
  const findings = [];

  if (text.length === 0) return findings;

  // 1) Named patterns
  //    Structural patterns (AWS access key, Stripe, Google, PEM headers,
  //    connection strings, JWT) are CONCLUSIVE on shape — they are NOT
  //    placeholder-allowlisted (a real AKIA… key that happens to contain
  //    "123456" is still a leak). Only `lowConfidence` value-bearing patterns
  //    (password/secret assignments, Bearer/Basic headers) get the placeholder
  //    allowlist, applied to the captured *value* portion.
  for (const descriptor of NAMED_PATTERNS) {
    const m = text.match(descriptor.pattern);
    if (!m) continue;
    const matched = m[0];

    if (descriptor.lowConfidence) {
      // Isolate the value side of `key = "<value>"` / `Bearer <value>`.
      const valuePart = (matched.match(/(?:[=:]\s*['"]?|\s+)([^'"]+)['"]?\s*$/) || [null, matched])[1] || matched;
      if (isAllowlistPlaceholder(valuePart)) continue;
    }

    if (descriptor.entropyGated) {
      const tail = (matched.match(/[A-Za-z0-9_\-/+=]{16,}$/) || [matched])[0];
      if (isAllowlistPlaceholder(tail)) continue;
      // Threshold lowered 2.5 -> 2.0: a short real token (e.g. a 20-char legacy
      // key with a narrow alphabet) can dip just under 2.5 and would have been a
      // false-NEGATIVE (leaked secret allowed through). 2.0 still rejects obvious
      // non-random fixtures (a single repeated char ~ 0.0, repeated words ~1.5)
      // while no longer dropping legitimately-shaped keys.
      if (shannonEntropy(tail) < 2.0) continue; // clearly non-random
    }

    findings.push({ name: descriptor.name, redacted: redactMatch(matched), kind: 'pattern' });
  }

  // 2) Generic high-entropy detector (beyond named patterns)
  if (entropyEnabled && !isLockfilePath(filePath)) {
    const seen = new Set();
    let match;
    TOKEN_SHAPE.lastIndex = 0;
    while ((match = TOKEN_SHAPE.exec(text)) !== null) {
      const token = match[0];
      if (token.length < ENTROPY_MIN_LEN) continue;
      if (seen.has(token)) continue;
      seen.add(token);
      if (isAllowlistPlaceholder(token)) continue;

      // Real high-entropy secrets are a long *contiguous* alphanumeric body.
      // File paths (a/b/c), kebab/snake IDs (PROP-20260507-slug) and dotted
      // slugs split into short segments at separators — they only look
      // "high-entropy" as a whole. Require a contiguous run >= ENTROPY_MIN_LEN
      // so example identifiers and paths in prose/docs stop tripping the net,
      // while branded tokens (caught by NAMED_PATTERNS) and raw base64/hex
      // bodies still qualify.
      const longestRun = (token.match(/[A-Za-z0-9]+/g) || [])
        .reduce((max, seg) => Math.max(max, seg.length), 0);
      if (longestRun < ENTROPY_MIN_LEN) continue;

      // For KEY=value tokens (e.g. DATABASE_URL=your-db-url) also check whether
      // the value-side alone is a placeholder. The token shape regex includes '='
      // so a whole assignment can be captured as one long token; if the value part
      // looks like a placeholder the whole thing is safe.
      const eqIdx = token.indexOf('=');
      if (eqIdx > 0) {
        const valueSide = token.slice(eqIdx + 1);
        if (isAllowlistPlaceholder(valueSide)) continue;
        // Generic "your-*" / "my-*" prefix heuristic covers cases not in the list.
        const vsLower = valueSide.toLowerCase();
        if (vsLower.startsWith('your-') || vsLower.startsWith('your_') ||
            vsLower.startsWith('my-') || vsLower.startsWith('my_') ||
            vsLower.startsWith('insert-') || vsLower.startsWith('put-')) continue;
      }

      const ent = shannonEntropy(token);
      if (ent < ENTROPY_THRESHOLD) continue;

      const ctxStart = Math.max(0, match.index - 24);
      const context = text.slice(ctxStart, match.index + token.length + 4);
      if (HASH_CONTEXT_PATTERN.test(context)) continue;

      findings.push({
        name: 'High-entropy string (suspected secret)',
        redacted: redactMatch(token),
        entropy: Number(ent.toFixed(2)),
        kind: 'entropy',
      });
    }
  }

  return findings;
}

function hasSecret(content, options = {}) {
  return scanContent(content, options).length > 0;
}

module.exports = {
  NAMED_PATTERNS,
  PLACEHOLDER_TOKENS,
  EXAMPLE_HOST_PATTERN,
  ENTROPY_THRESHOLD,
  ENTROPY_MIN_LEN,
  shannonEntropy,
  isAllowlistPlaceholder,
  isLockfilePath,
  redactMatch,
  scanContent,
  hasSecret,
};