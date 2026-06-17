/**
 * Codex runtime delivery — Story story-codex-runtime-delivery
 *
 * The Codex parity built in the repo only matters if it actually reaches the
 * user's project on install. These tests lock the two delivery gaps that left
 * it inert: AGENTS.md (Codex's default context file) and the 3 .codex JSON
 * artifacts that were missing from the published package manifest.
 */

const path = require('path');
const fs = require('fs-extra');
const os = require('os');

const {
  deliverCodexRootFiles,
  CODEX_ROOT_FILES,
} = require('../../packages/installer/src/installer/sinapse-ai-installer');

const REPO_ROOT = path.join(__dirname, '..', '..');

describe('Codex runtime delivery', () => {
  describe('AC1 — package manifest publishes the Codex context files', () => {
    const pkg = require('../../package.json');

    it('files[] includes AGENTS.md', () => {
      expect(pkg.files).toContain('AGENTS.md');
    });

    it('files[] includes the previously-missing .codex artifacts', () => {
      expect(pkg.files).toEqual(
        expect.arrayContaining([
          '.codex/delegation-parity.json',
          '.codex/handoff-packet.parity.schema.json',
          '.codex/handoff-packet.template.json',
        ]),
      );
    });

    it('the declared artifacts actually exist on disk (manifest is honest)', () => {
      for (const rel of [
        'AGENTS.md',
        '.codex/delegation-parity.json',
        '.codex/handoff-packet.parity.schema.json',
        '.codex/handoff-packet.template.json',
      ]) {
        expect(fs.existsSync(path.join(REPO_ROOT, rel))).toBe(true);
      }
    });
  });

  describe('AC2/AC3 — deliverCodexRootFiles copies AGENTS.md into the project', () => {
    let pkgRoot;
    let targetDir;

    beforeEach(async () => {
      pkgRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-pkg-'));
      targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-proj-'));
      await fs.writeFile(path.join(pkgRoot, 'AGENTS.md'), '# AGENTS.md\nroster v1\n');
    });

    afterEach(async () => {
      await fs.remove(pkgRoot);
      await fs.remove(targetDir);
    });

    it('delivers AGENTS.md to the target root', async () => {
      const delivered = await deliverCodexRootFiles(pkgRoot, targetDir);
      expect(delivered).toContain('AGENTS.md');
      expect(fs.existsSync(path.join(targetDir, 'AGENTS.md'))).toBe(true);
      expect(await fs.readFile(path.join(targetDir, 'AGENTS.md'), 'utf8')).toContain('roster v1');
    });

    it('is idempotent and overwrites to stay aligned with the package', async () => {
      await deliverCodexRootFiles(pkgRoot, targetDir);
      // Simulate a stale roster in the project, then re-run.
      await fs.writeFile(path.join(targetDir, 'AGENTS.md'), 'stale\n');
      await fs.writeFile(path.join(pkgRoot, 'AGENTS.md'), '# AGENTS.md\nroster v2\n');
      const delivered = await deliverCodexRootFiles(pkgRoot, targetDir);
      expect(delivered).toContain('AGENTS.md');
      expect(await fs.readFile(path.join(targetDir, 'AGENTS.md'), 'utf8')).toContain('roster v2');
    });

    it('skips silently when the source file is absent (never throws)', async () => {
      await fs.remove(path.join(pkgRoot, 'AGENTS.md'));
      const delivered = await deliverCodexRootFiles(pkgRoot, targetDir);
      expect(delivered).toEqual([]);
      expect(fs.existsSync(path.join(targetDir, 'AGENTS.md'))).toBe(false);
    });

    it('CODEX_ROOT_FILES is the single source of which root files ship to Codex', () => {
      expect(CODEX_ROOT_FILES).toContain('AGENTS.md');
    });
  });
});
