// bin/commands/doctor.js — `sinapse-ai doctor` command.
// Story GA-1.2 — extracted from bin/cli.js (Story 10.21 wiring preserved).

const path = require('path');
const { getLogger } = require('../../.sinapse-ai/core/logger');

// cmdDoctor — Story 10.21
// Wires the existing modular doctor (.sinapse-ai/core/doctor) into the
// canonical sinapse-ai CLI. Mirrors bin/sinapse.js runDoctor() but uses
// process.exitCode (rather than process.exit) to let stdout flush cleanly.
async function cmdDoctor(opts = {}) {
  const logger = getLogger();
  if (opts.help) {
    logger.always(`Usage: npx sinapse-ai doctor [options]

Run health checks against the SINAPSE environment.

Options:
  --fix            Auto-correct fixable issues
  --dry-run        Show what --fix would do without applying
  --json           Output as JSON (machine-readable)
  --quiet          Minimal output
  --deep           Run deep checks too (slower)
  --help, -h       Show this help

Exit codes (Story A.3):
  0   PASS — all checks passed, no warnings
  1   WARN only — non-blocking issues detected
  2   FAIL — at least one blocking check failed
  3   Internal error — doctor runner crashed
`);
    return { ok: true, formatted: '', data: null };
  }

  const doctorModulePath = path.join(__dirname, '..', '..', '.sinapse-ai', 'core', 'doctor');
  // eslint-disable-next-line global-require
  const { runDoctorChecks, resolveExitCode } = require(doctorModulePath);
  const result = await runDoctorChecks({
    fix: Boolean(opts.fix),
    json: Boolean(opts.json),
    dryRun: Boolean(opts.dryRun),
    quiet: Boolean(opts.quiet),
    deep: Boolean(opts.deep),
    projectRoot: process.cwd(),
  });

  if (result && result.formatted) {
    logger.always(result.formatted);
  }

  // Story A.3 — precise exit code mapping:
  //   0 PASS | 1 WARN only | 2 FAIL | 3 internal runner error
  // Fall back to resolveExitCode when available (module may be mocked in tests
  // that pre-date A.3; in that case, keep the legacy 0/1 behavior).
  if (typeof resolveExitCode === 'function') {
    const code = resolveExitCode(result);
    if (code !== 0) {
      process.exitCode = code;
    }
  } else if (result && result.data && result.data.summary && result.data.summary.fail > 0) {
    process.exitCode = 1;
  }

  return result;
}

module.exports = { cmdDoctor };
