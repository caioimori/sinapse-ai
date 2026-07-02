/**
 * L0 Constitution Layer Processor
 *
 * Injects the Constitutional articles as NON-NEGOTIABLE rules.
 * ALWAYS_ON — processes regardless of session state.
 * Rules are loaded from the .synapse/constitution domain file.
 *
 * Context diet (Story onda1-s2 — audit AF-20260702 item 1.1 CRITICAL):
 * - FIRST prompt of a session (prompt_count === 0 at injection time — the
 *   session-manager increments prompt_count AFTER the engine runs, see
 *   hook-runtime.js → updateSession): emits the FULL constitution block,
 *   exactly as before.
 * - Prompts 2+ (prompt_count >= 1): emits a short reminder (formatted
 *   [CONSTITUTION] section <= REMINDER_MAX_CHARS) containing the article
 *   titles table + a MANDATORY pointer to the granular source
 *   `.synapse/constitution` (the CLAUDE.md 11-article table is NOT a
 *   substitute for the granular rules — adversarial-review ressalva).
 * - New session (prompt_count resets to 0) → full block again.
 * - FAIL-SAFE: if prompt_count is unreadable (missing session, corrupted
 *   value, non-integer, negative) OR the reminder cannot be built (no
 *   article titles detected), the FULL block is emitted. A read error must
 *   never degrade to LESS enforcement.
 *
 * Measured with the real formatter against the real .synapse/constitution
 * (2026-07-02): full section = 7,226 chars ≈ 1,807 tokens (96 rules);
 * reminder section ≈ 700 chars ≈ ~175 tokens (~90% reduction per turn 2+).
 *
 * @module core/synapse/layers/l0-constitution
 * @version 1.1.0
 * @created Story SYN-4 - Layer Processors L0-L3
 * @updated Story onda1-s2 - Context diet (full block only on 1st prompt)
 */

const path = require('path');
const { loadDomainFile } = require('../domain/domain-loader');
const LayerProcessor = require('./layer-processor');

/**
 * Max size (chars) of the FORMATTED [CONSTITUTION] reminder section
 * (header + indented rules), per AC2 of Story onda1-s2.
 * @type {number}
 */
const REMINDER_MAX_CHARS = 1000;

/**
 * Mirror of the section header rendered by output/formatter.js
 * formatConstitution(). Used only to size-guard the reminder against
 * REMINDER_MAX_CHARS with the exact final layout.
 * @type {string}
 */
const SECTION_HEADER = '[CONSTITUTION] (NON-NEGOTIABLE)';

/**
 * Article title lines in the constitution domain file end with their
 * severity marker, e.g. "CLI First (NON-NEGOTIABLE)". Granular rules
 * instead START with "MUST:", "MUST NOT:", "SHOULD:", "EXCEPTION:".
 */
const ARTICLE_TITLE_RE = /\((NON-NEGOTIABLE|MUST|SHOULD)\)$/;
const GRANULAR_PREFIX_RE = /^(MUST|SHOULD|EXCEPTION)\b/;

/** Canonical pointer to the granular source (MANDATORY in the reminder). */
const GRANULAR_SOURCE = '.synapse/constitution';

/**
 * Convert a positive integer to a roman numeral (article numbering).
 *
 * @param {number} num - Positive integer (1-3999)
 * @returns {string} Roman numeral
 */
function toRoman(num) {
  const table = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let n = num;
  let out = '';
  for (const [value, symbol] of table) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}

/**
 * L0 Constitution Processor
 *
 * Loads constitution domain file and validates nonNegotiable flag in manifest.
 * Returns all constitutional rules (1st prompt) or a compact reminder with a
 * pointer to the granular source (prompts 2+) as an array of strings.
 *
 * @extends LayerProcessor
 */
class L0ConstitutionProcessor extends LayerProcessor {
  constructor() {
    super({ name: 'constitution', layer: 0, timeout: 5 });
  }

  /**
   * Load constitution rules from domain file.
   *
   * ALWAYS_ON: processes regardless of session state (the layer always
   * emits — only the SHAPE changes between full block and reminder).
   * Validates that the constitution domain has nonNegotiable: true in manifest.
   *
   * @param {object} context
   * @param {string} context.prompt - Current prompt text
   * @param {object} context.session - Session state (SYN-2 schema; prompt_count used here)
   * @param {object} context.config - Config with synapsePath and manifest
   * @param {object[]} context.previousLayers - Results from previous layers
   * @returns {{ rules: string[], metadata: object } | null}
   */
  process(context) {
    const { config, session } = context;
    const { synapsePath, manifest } = config;

    // Find constitution domain in manifest
    const domainKey = Object.keys(manifest.domains || {})
      .find(k => k.toUpperCase() === 'CONSTITUTION');

    const domain = domainKey ? manifest.domains[domainKey] : null;

    // Determine domain file path
    const domainFile = domain && domain.file
      ? path.join(synapsePath, domain.file)
      : path.join(synapsePath, 'constitution');

    // Load rules from domain file
    const rules = loadDomainFile(domainFile);

    // Graceful degradation: no rules found
    if (!rules || rules.length === 0) {
      return null;
    }

    // Validate nonNegotiable flag
    const nonNegotiable = domain ? domain.nonNegotiable === true : false;

    // Context diet (Story onda1-s2): full block on the 1st prompt of the
    // session; compact reminder on prompts 2+. FAIL-SAFE: any unreadable
    // prompt_count → full block (never degrade enforcement on read errors).
    const { promptCount, reliable } = this._resolvePromptCount(session);
    let emittedRules = rules;
    let constitutionMode = 'full';

    if (reliable && promptCount >= 1) {
      const reminder = this._buildReminderRules(rules);
      if (reminder) {
        emittedRules = reminder;
        constitutionMode = 'reminder';
      }
      // reminder === null → keep the full block (fail-safe)
    }

    return {
      rules: emittedRules,
      metadata: {
        layer: 0,
        source: 'constitution',
        nonNegotiable,
        constitutionMode,
        totalRules: rules.length,
      },
    };
  }

  /**
   * Resolve prompt_count from the session with strict validation.
   *
   * prompt_count semantics (session-manager.js): the counter is incremented
   * AFTER each processed prompt, so at injection time the FIRST prompt of a
   * session sees prompt_count === 0.
   *
   * FAIL-SAFE contract: any value that is not a non-negative integer is
   * treated as UNRELIABLE and the caller emits the FULL block. This covers
   * missing session file / corrupted JSON (hook-runtime already falls back
   * to { prompt_count: 0 }), missing field, NaN, floats and negatives.
   *
   * @param {object|null|undefined} session - Session state
   * @returns {{ promptCount: number, reliable: boolean }}
   * @private
   */
  _resolvePromptCount(session) {
    if (!session || typeof session !== 'object') {
      return { promptCount: 0, reliable: false };
    }
    const raw = session.prompt_count;
    if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0) {
      return { promptCount: 0, reliable: false };
    }
    return { promptCount: raw, reliable: true };
  }

  /**
   * Build the compact reminder emitted on prompts 2+.
   *
   * Content: lead line + article titles table (derived DYNAMICALLY from the
   * loaded rules — no hardcoded article list, so regenerating the
   * constitution keeps the reminder in sync) + mandatory pointer to the
   * granular source (.synapse/constitution).
   *
   * Size guard: the FORMATTED section (header + 2-space indented lines,
   * mirroring output/formatter.js formatConstitution) must fit in
   * REMINDER_MAX_CHARS. Falls back to progressively more compact layouts;
   * the pointer line is NEVER dropped.
   *
   * @param {string[]} rules - Full granular rule list
   * @returns {string[]|null} Reminder rules, or null when no article titles
   *   could be detected (caller falls back to the full block — fail-safe)
   * @private
   */
  _buildReminderRules(rules) {
    const titles = rules.filter(rule =>
      typeof rule === 'string'
      && ARTICLE_TITLE_RE.test(rule.trim())
      && !GRANULAR_PREFIX_RE.test(rule.trim()),
    ).map(rule => rule.trim());

    // Fail-safe: cannot summarize → caller emits the full block
    if (titles.length === 0) {
      return null;
    }

    const lead = 'Constitution ativa — TODOS os artigos abaixo seguem em vigor neste turno:';
    const pointer = `Fonte completa: as ${rules.length} regras granulares estão em ${GRANULAR_SOURCE} — `
      + 'este lembrete NÃO substitui a fonte granular; consulte-a na dúvida.';

    // Layout 1: one numbered title per line
    let candidate = [lead, ...titles.map((t, i) => `${toRoman(i + 1)}. ${t}`), pointer];
    if (this._formattedSectionLength(candidate) <= REMINDER_MAX_CHARS) {
      return candidate;
    }

    // Layout 2: all titles on a single separated line
    candidate = [lead, titles.join(' · '), pointer];
    if (this._formattedSectionLength(candidate) <= REMINDER_MAX_CHARS) {
      return candidate;
    }

    // Layout 3: hard-truncate the titles line to fit (pointer always kept)
    const fixedLength = this._formattedSectionLength([lead, '', pointer]);
    const room = Math.max(0, REMINDER_MAX_CHARS - fixedLength - 1); // -1 for the ellipsis
    const titlesLine = titles.join(' · ').slice(0, room) + '…';
    return [lead, titlesLine, pointer];
  }

  /**
   * Exact length of the [CONSTITUTION] section as the formatter renders it
   * (header line + each rule prefixed with two spaces, newline separated).
   *
   * @param {string[]} lines - Candidate reminder lines
   * @returns {number} Rendered section length in chars
   * @private
   */
  _formattedSectionLength(lines) {
    return [SECTION_HEADER, ...lines.map(l => `  ${l}`)].join('\n').length;
  }
}

module.exports = L0ConstitutionProcessor;
