// bin/lib/fuzzy.js — fuzzy-match helper for unknown commands.
// Story GA-1.3 — implements Levenshtein distance inline (no external dep)
// so that typos like `npx sinapse-ai isntall` produce a friendly suggestion.
//
// API:
//   levenshtein(a, b)   → number — edit distance between two strings
//   closestMatch(input, candidates, { maxDistance = 2 })
//                       → string | null — closest candidate within threshold

'use strict';

/**
 * Compute Levenshtein distance between two strings.
 * Classic dynamic programming, O(m*n) time, O(min(m,n)) space.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function levenshtein(a, b) {
  const s = String(a || '');
  const t = String(b || '');
  if (s === t) return 0;
  if (s.length === 0) return t.length;
  if (t.length === 0) return s.length;

  // Use the shorter string as columns to bound memory.
  const [shorter, longer] = s.length <= t.length ? [s, t] : [t, s];
  const m = shorter.length;
  const n = longer.length;

  let prev = new Array(m + 1);
  let curr = new Array(m + 1);
  for (let i = 0; i <= m; i += 1) prev[i] = i;

  for (let j = 1; j <= n; j += 1) {
    curr[0] = j;
    for (let i = 1; i <= m; i += 1) {
      const cost = shorter.charCodeAt(i - 1) === longer.charCodeAt(j - 1) ? 0 : 1;
      curr[i] = Math.min(
        curr[i - 1] + 1,        // insertion
        prev[i] + 1,            // deletion
        prev[i - 1] + cost,     // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[m];
}

/**
 * Find the closest candidate to `input` within `maxDistance` edits.
 * Comparison is case-insensitive. Returns null if no candidate qualifies.
 *
 * @param {string} input
 * @param {string[]} candidates
 * @param {{ maxDistance?: number }} [opts]
 * @returns {string | null}
 */
function closestMatch(input, candidates, opts = {}) {
  const maxDistance = typeof opts.maxDistance === 'number' ? opts.maxDistance : 2;
  if (!input || !Array.isArray(candidates) || candidates.length === 0) return null;
  const needle = String(input).toLowerCase();

  let best = null;
  let bestDist = Infinity;
  for (const candidate of candidates) {
    const c = String(candidate).toLowerCase();
    const d = levenshtein(needle, c);
    if (d < bestDist) {
      bestDist = d;
      best = candidate;
    }
  }
  if (best == null) return null;
  return bestDist <= maxDistance ? best : null;
}

module.exports = {
  levenshtein,
  closestMatch,
};
