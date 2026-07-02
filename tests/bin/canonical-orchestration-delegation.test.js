/**
 * canonical-orchestration-delegation.test.js
 *
 * Story: onda2-p3 — audit AF-20260702 item 2.4.
 * The orchestration engine (the one capability validated by the HYBRID verdict)
 * must be reachable from the CANONICAL binary (`npx sinapse-ai ...`), not only
 * from the legacy `sinapse` binary. bin/cli.js delegates orchestrate/spec/plan
 * to bin/sinapse.js via spawnSync — same single-source-of-truth pattern as
 * `init` (cli→sinapse) and the S1/#321 `agents`/`ideate` cases (sinapse→cli).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CLI_BIN = path.resolve(__dirname, '../../bin/cli.js');
const SINAPSE_BIN = path.resolve(__dirname, '../../bin/sinapse.js');

const ORCHESTRATION_COMMANDS = ['orchestrate', 'spec', 'plan'];

describe('Canonical binary reaches the orchestration engine (Story onda2-p3)', () => {
  describe('router wiring (source contract)', () => {
    let cliSource;

    beforeAll(() => {
      cliSource = fs.readFileSync(CLI_BIN, 'utf8');
    });

    it.each(ORCHESTRATION_COMMANDS)('KNOWN_COMMANDS lists %s', (cmd) => {
      const knownBlock = cliSource.match(/const KNOWN_COMMANDS = \[([\s\S]*?)\];/);
      expect(knownBlock).not.toBeNull();
      expect(knownBlock[1]).toContain(`'${cmd}'`);
    });

    it.each(ORCHESTRATION_COMMANDS)('dispatches a case for %s', (cmd) => {
      expect(cliSource).toMatch(new RegExp(`case '${cmd}':`));
    });

    it('delegates to bin/sinapse.js (single source of truth for arg parsing)', () => {
      const caseBlock = cliSource.slice(cliSource.indexOf("case 'orchestrate':"));
      expect(caseBlock).toContain("'sinapse.js'");
      expect(caseBlock).toContain('spawnSync');
    });
  });

  describe('end-to-end --help through the canonical binary (AC2)', () => {
    it(
      'node bin/cli.js orchestrate --help responds with usage (not "unknown command")',
      () => {
        const out = execFileSync('node', [CLI_BIN, 'orchestrate', '--help'], {
          encoding: 'utf8',
        });
        expect(out).toContain('Usage: sinapse orchestrate');
        expect(out).toContain('--dry-run');
        expect(out).not.toContain('Comando desconhecido');
      },
      30000,
    );

    it(
      'node bin/cli.js spec --help responds with usage',
      () => {
        const out = execFileSync('node', [CLI_BIN, 'spec', '--help'], {
          encoding: 'utf8',
        });
        expect(out).toContain('Usage: sinapse spec');
        expect(out).toContain('stops there');
      },
      30000,
    );

    it(
      'node bin/cli.js plan --help responds with usage',
      () => {
        const out = execFileSync('node', [CLI_BIN, 'plan', '--help'], {
          encoding: 'utf8',
        });
        expect(out).toContain('Usage: sinapse plan');
        expect(out).toContain('no build, no QA');
      },
      30000,
    );
  });

  describe('legacy binary surface (help-discoverability companions)', () => {
    it(
      'sinapse --help documents spec, plan and orchestrate --dry-run',
      () => {
        const out = execFileSync('node', [SINAPSE_BIN, '--help'], { encoding: 'utf8' });
        expect(out).toMatch(/sinapse spec <story-id>/);
        expect(out).toMatch(/sinapse plan <story-id>/);
        expect(out).toMatch(/sinapse orchestrate <story-id> --dry-run/);
      },
      30000,
    );
  });
});
