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
  // user/password are restricted to non-whitespace so the negated classes can't
  // span newlines and match a bogus region across a whole file (the host part of
  // a URL followed by an unrelated colon and at-sign on later lines). Real
  // credentials never contain whitespace, so true detection is unaffected.
  { name: 'DB Connection String', pattern: /(?:postgres|mysql|mongodb|redis):\/\/[^:\s]+:[^@\s]+@[^/\s]+/i, credentialPlaceholderGated: true },
  { name: 'Supabase DB URL', pattern: /postgresql:\/\/postgres\.[A-Za-z0-9]+:[^@\s]+@/i, credentialPlaceholderGated: true },

  // Generic Patterns (broader, lower confidence — placeholder-allowlisted)
  // Value class excludes whitespace (same rationale as the connection strings
  // above): real password values are space-free tokens. The old `[^'"]{8,}`
  // matched human UI labels whose i18n key ends in "Password" followed by a
  // sentence value, false-positiving on EVERY edit to a locale file. The
  // whitespace-excluding class still catches space-free hardcoded passwords,
  // including camelCase-keyed ones.
  { name: 'Hardcoded Password', pattern: /(?:password|passwd|pwd)\s*[=:]\s*['"][^'"\s]{8,}['"]/i, lowConfidence: true },
  { name: 'Bearer Token', pattern: /[Bb]earer\s+[A-Za-z0-9_\-.]{20,}/, entropyGated: true, lowConfidence: true },
  { name: 'Basic Auth', pattern: /[Bb]asic\s+[A-Za-z0-9+/=]{20,}/, lowConfidence: true },

  // Long pure-hex runs (32–64 chars). The 16-symbol hex alphabet caps Shannon
  // entropy at ~4.0, BELOW ENTROPY_THRESHOLD (4.5), so the generic entropy
  // backstop never sees them — Twilio auth tokens (32-hex), webhook signing
  // secrets and SHA-style 64-hex digests slip through. This explicit rule closes
  // that gap. It is `hashContextGated`: a hex run sitting in an integrity /
  // checksum / lockfile / git-sha context (covered by HASH_CONTEXT_PATTERN) is a
  // legitimate hash, NOT a secret, and is allowlisted. `lowConfidence` keeps it
  // OUT of the release publish gate (entropy:false there would otherwise match
  // every documented digest); the diff-scoped commit hook still enforces it.
  { name: 'Long Hex Token', pattern: /\b[a-f0-9]{32,64}\b/i, hashContextGated: true, lowConfidence: true },
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
  // Descriptive credential placeholder: a value built ONLY from lowercase words
  // joined by - or _, where one of the words is the credential noun itself
  // (secure-password, your-password-here, db_password, my-secret-token).
  // Documentation writes credentials this way; real secrets do not.
  //
  // A token catalogue cannot keep up here: `your-key`, `your-secret`,
  // `your-token` and `your-api` were listed, but every password spelling was
  // missing — so the framework's own Supabase auth example blocked its own
  // commit, and the only practical escape was `--no-verify`, which disables
  // the whole guard rather than the one false finding.
  //
  // Deliberately narrow: any digit, uppercase letter or symbol disqualifies the
  // value, so MyPassword123, P@ssw0rd-secret and Kq7mZ9xL2vRt8pWn stay flagged.
  // Accepted blind spot: an all-lowercase dictionary passphrase that happens to
  // contain the credential noun (open-secret-door) is allowlisted — by shape
  // alone it is indistinguishable from documentation.
  /^(?:[a-z]+[-_])*(?:password|passwd|senha|secret|credential|apikey)(?:[-_][a-z]+)*$/,
];

const EXAMPLE_HOST_PATTERN = /(?:example\.(?:com|org|net)|localhost|127\.0\.0\.1|host\b|your-host|placeholder)/i;

// A keyword placeholder only allowlists when it DOMINATES the value: once every
// placeholder occurrence is removed, the TOTAL alphanumeric length that remains
// is too short to be a secret on its own (< ENTROPY_MIN_LEN). A bare
// `lower.includes(token)` was a trivial bypass — ANY real secret that happened to
// contain "abcdef" / "123456" / "example" anywhere in its body got silently
// allowlisted (e.g. Xq9Zk2…abcdef…Fg5 passed). Measuring the *total* remainder
// (not just the longest contiguous run) closes that hole even when the buried
// placeholder splits the secret into two sub-threshold runs: the legitimate
// cases (your-key-here, placeholder123456, test-key-example, CHANGEME) strip down
// to nothing, while a 35-char random token minus a 6-char placeholder still has
// ~29 alphanumeric chars left and is NOT allowlisted.
function placeholderDominates(lower) {
  let stripped = lower;
  let matchedAny = false;
  for (const token of PLACEHOLDER_TOKENS) {
    if (stripped.includes(token)) {
      matchedAny = true;
      // Replace with a separator so adjacent runs aren't fused into a longer one.
      stripped = stripped.split(token).join(' ');
    }
  }
  if (!matchedAny) return false;
  // Total alphanumeric chars left after removing every placeholder occurrence.
  const remaining = (stripped.match(/[a-z0-9]/g) || []).length;
  return remaining < ENTROPY_MIN_LEN;
}

function isAllowlistPlaceholder(value) {
  if (value === null || value === undefined) return false;
  const v = String(value).trim();
  if (v.length === 0) return true;

  // Structural placeholders are always safe: <...>, [...], {token}, ${VAR},
  // SCREAMING_SNAKE env-var names, and repeated single-symbol fillers.
  for (const re of PLACEHOLDER_PATTERNS) {
    if (re.test(v)) return true;
  }
  if (/^(.)\1{5,}$/.test(v)) return true; // repeated single char

  // Keyword placeholders: word-boundary anchored + dominance, NOT raw includes().
  if (placeholderDominates(v.toLowerCase())) return true;

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

/** Same pattern, guaranteed global — so `exec` can walk every occurrence. */
function withGlobalFlag(flags) {
  return flags.includes('g') ? flags : flags + 'g';
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
    // Descriptors are authored without /g so a plain `.match()` can expose
    // capture groups; scan with a global clone so EVERY occurrence is examined.
    //
    // With only the first match, the `continue` in the gates below skipped the
    // whole descriptor: when the first hit was a legitimate placeholder, a real
    // secret further down the same file was never examined at all. That is a
    // false negative, not merely an incomplete report.
    const scanner = new RegExp(descriptor.pattern.source, withGlobalFlag(descriptor.pattern.flags));
    const seenValues = new Set();
    let m;

    while ((m = scanner.exec(text)) !== null) {
      const matched = m[0];
      // A zero-length match never advances lastIndex — guard against a spin.
      if (matched.length === 0) {
        scanner.lastIndex += 1;
        continue;
      }
      // The same literal repeated is one finding; distinct values are separate.
      if (seenValues.has(matched)) continue;
      seenValues.add(matched);

      if (descriptor.lowConfidence) {
        // Isolate the value side of `key = "<value>"` / `Bearer <value>`.
        const valuePart = (matched.match(/(?:[=:]\s*['"]?|\s+)([^'"]+)['"]?\s*$/) || [null, matched])[1] || matched;
        if (isAllowlistPlaceholder(valuePart)) continue;
      }

      if (descriptor.credentialPlaceholderGated) {
        // A connection string carries a structured user:password@host. When the
        // password slot is a placeholder/interpolation (${VAR}, <pass>, a
        // SCREAMING_SNAKE env-var name, your-password…) it is a template/example,
        // NOT a leaked credential — and is the idiomatic, safe way to document
        // one. A real leaked password (random/literal) is not allowlisted and is
        // still flagged.
        const cred = (matched.match(/:\/\/[^:/\s]+:([^@\s]+)@/) || [null, ''])[1];
        if (cred && isAllowlistPlaceholder(cred)) continue;
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

      if (descriptor.hashContextGated) {
        // Long hex runs are flagged as suspected secrets (Twilio token, webhook
        // signing secret, SHA-style digest) EXCEPT when they sit in an integrity /
        // checksum / lockfile / git-sha context — those are legitimate hashes, not
        // leaked credentials. Reuse HASH_CONTEXT_PATTERN over a window around the
        // match so package-lock integrity:, "resolved" tarball #sha, "checksum",
        // and 40/64-hex git shas are NOT false-positived. A fully repeated/obvious
        // placeholder hex (deadbeef…, 000…) is also allowlisted.
        if (isAllowlistPlaceholder(matched)) continue;
        if (isLockfilePath(filePath)) continue;
        // Canonical digest lengths — git SHA-1 (40) and SHA-256 (64) — are
        // overwhelmingly legitimate hashes (commit refs, file checksums, content
        // digests) and appear bare in changelogs/docs/lockfiles. Treating every
        // isolated 40/64-hex run as a leak would false-positive on the entire git
        // ecosystem, so these exact lengths are hash-shaped by default. The
        // headline real-secret case (Twilio auth token = 32-hex) and other
        // non-digest lengths (33–39, 41–63) are NOT standard digests and stay
        // flagged. A leaked literal hash secret of EXACTLY 40/64 hex is the
        // accepted blind spot of this length-based heuristic (documented tradeoff
        // favouring zero false-positives on git/checksum hashes).
        const hexLen = matched.length;
        if (hexLen === 40 || hexLen === 64) continue;
        // For non-canonical lengths, allowlist only when the SURROUNDING context
        // carries a hash marker (integrity:, sha256-, "resolved", "checksum"). The
        // window is widened on the left so a marker earlier on the line
        // (e.g. `"resolved": "https://…/x.tgz#<hex>"`) is still seen.
        // Position of THIS match. `text.indexOf(matched)` returned the first
        // occurrence of the string, which stops being the current match as soon
        // as the loop above examines more than one.
        const mIdx = m.index;
        const before = text.slice(Math.max(0, mIdx - 64), mIdx);
        const after = text.slice(mIdx + matched.length, mIdx + matched.length + 4);
        if (HASH_CONTEXT_PATTERN.test(before + ' ' + after)) continue;
      }

      findings.push({ name: descriptor.name, redacted: redactMatch(matched), kind: 'pattern' });
    }
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