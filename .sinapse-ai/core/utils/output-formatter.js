/**
 * Personalized Output Formatter - Layer 2 of Agent Identity System
 *
 * Consolidated re-export. The canonical implementation lives in
 * `infrastructure/scripts/output-formatter.js`, which carries the test suite
 * (tests/unit/output-formatter.test.js + the integration test) and the
 * infrastructure index consumer. This module previously held a byte-identical
 * copy (differing only in comments) — it now re-exports the single source of
 * truth to preserve the `core/utils/output-formatter` import path without
 * duplicating ~300 lines.
 *
 * @module core/utils/output-formatter
 * @migrated Story 2.2 - Core Module Creation
 * Story: 6.1.6 - Output Formatter Implementation
 */

module.exports = require('../../infrastructure/scripts/output-formatter');
