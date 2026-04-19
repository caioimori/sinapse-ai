/**
 * Regression tests for Story 10.43 — Squad Validator Schema Drift
 *
 * Guards the HYBRID fix:
 *   A) schema RELAXED: description maxLength 2000, slashPrefix pattern allows uppercase
 *   B) squads MIGRATED: production workflows wrapped under `workflow:` with derived id
 *
 * Regression guarantees:
 *   - legitimate-bad squads are STILL rejected (no over-relaxation)
 *   - production squads no longer fail on the 3 previously-failing constraints
 *   - migrated workflows still carry the required workflow.id + payload
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const yaml = require('js-yaml');

const { SquadValidator } = require('../../../.sinapse-ai/development/scripts/squad/squad-validator');
const { WorkflowValidator } = require('../../../.sinapse-ai/development/scripts/workflow-validator');
const { needsWrap, wrap, slugFromFilename } = require('../../../.sinapse-ai/development/scripts/squad/migrate-workflows-to-wrapper');

const SQUADS_ROOT = path.resolve(__dirname, '..', '..', '..', 'squads');

const TARGETED_ERROR_PATTERNS = [
  /description must NOT have more than/,
  /slashPrefix must match pattern/,
  /Missing required field: workflow\.id/,
  /Missing workflow payload/,
];

function isTargetedError(err) {
  return TARGETED_ERROR_PATTERNS.some((rx) => rx.test(err.message || ''));
}

function listProductionSquads() {
  if (!fs.existsSync(SQUADS_ROOT)) return [];
  return fs
    .readdirSync(SQUADS_ROOT)
    .filter((d) => fs.statSync(path.join(SQUADS_ROOT, d)).isDirectory());
}

describe('Story 10.43 — squad-validator schema drift', () => {
  describe('AC1 + AC4: all 19 production squads have 0 targeted FAILs', () => {
    const squads = listProductionSquads();

    it.each(squads)('squad %s emits 0 targeted errors', async (squadName) => {
      const validator = new SquadValidator();
      const result = await validator.validate(path.join(SQUADS_ROOT, squadName));
      const targeted = result.errors.filter(isTargetedError);
      expect(targeted).toEqual([]);
    });
  });

  describe('AC3: schema regression — invalid squads still REJECTED', () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'squad-10-43-'));
      fs.mkdirSync(path.join(tmpDir, 'tasks'));
      fs.mkdirSync(path.join(tmpDir, 'agents'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    function writeManifest(manifest) {
      fs.writeFileSync(path.join(tmpDir, 'squad.yaml'), yaml.dump(manifest), 'utf-8');
    }

    it('rejects name with spaces (pattern still enforced)', async () => {
      writeManifest({ name: 'Bad Name With Spaces', version: '1.0.0' });
      const r = await new SquadValidator().validate(tmpDir);
      const nameErr = r.errors.find((e) => (e.path || '').includes('name'));
      expect(nameErr).toBeDefined();
    });

    it('rejects invalid semver version', async () => {
      writeManifest({ name: 'ok-name', version: 'not-semver' });
      const r = await new SquadValidator().validate(tmpDir);
      const verErr = r.errors.find((e) => (e.path || '').includes('version'));
      expect(verErr).toBeDefined();
    });

    it('rejects description longer than 2000 chars (boundary +1 still fails)', async () => {
      writeManifest({
        name: 'ok-name',
        version: '1.0.0',
        description: 'x'.repeat(2001),
      });
      const r = await new SquadValidator().validate(tmpDir);
      const descErr = r.errors.find(
        (e) =>
          (e.path || '').includes('description') ||
          (e.message || '').includes('2000 characters'),
      );
      expect(descErr).toBeDefined();
    });

    it('accepts description up to 2000 chars (post-relax)', async () => {
      writeManifest({
        name: 'ok-name',
        version: '1.0.0',
        description: 'x'.repeat(2000),
      });
      const r = await new SquadValidator().validate(tmpDir);
      const descErr = r.errors.find((e) => (e.message || '').includes('description must NOT have'));
      expect(descErr).toBeUndefined();
    });

    it('accepts slashPrefix with uppercase (post-relax, covers squad-brand SINAPSE)', async () => {
      writeManifest({
        name: 'ok-name',
        version: '1.0.0',
        slashPrefix: 'SINAPSE',
      });
      const r = await new SquadValidator().validate(tmpDir);
      const prefixErr = r.errors.find(
        (e) => (e.path || '').includes('slashPrefix') || (e.message || '').includes('slashPrefix'),
      );
      expect(prefixErr).toBeUndefined();
    });

    it('still rejects slashPrefix with spaces/special chars', async () => {
      writeManifest({
        name: 'ok-name',
        version: '1.0.0',
        slashPrefix: 'has spaces!',
      });
      const r = await new SquadValidator().validate(tmpDir);
      const prefixErr = r.errors.find(
        (e) => (e.path || '').includes('slashPrefix') || (e.message || '').includes('slashPrefix'),
      );
      expect(prefixErr).toBeDefined();
    });

    it('still rejects slashPrefix starting with digit', async () => {
      writeManifest({
        name: 'ok-name',
        version: '1.0.0',
        slashPrefix: '1abc',
      });
      const r = await new SquadValidator().validate(tmpDir);
      const prefixErr = r.errors.find(
        (e) => (e.path || '').includes('slashPrefix') || (e.message || '').includes('slashPrefix'),
      );
      expect(prefixErr).toBeDefined();
    });
  });

  describe('workflow-validator regression: flat-shape contract enforcement preserved', () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-10-43-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('wraps flat workflow correctly and preserves required fields', () => {
      const flat = {
        name: 'foo-cycle',
        description: 'd',
        phases: [{ id: 'p1', agent: 'a1', action: 'do' }],
      };
      const wrapped = wrap(flat, slugFromFilename('foo-cycle.yaml'));
      expect(wrapped.workflow).toBeDefined();
      expect(wrapped.workflow.id).toBe('foo-cycle');
      expect(wrapped.workflow.name).toBe('foo-cycle');
      // sequence alias added
      expect(Array.isArray(wrapped.workflow.sequence)).toBe(true);
      expect(wrapped.workflow.sequence).toEqual(flat.phases);
    });

    it('is idempotent: already-wrapped doc needs no wrap', () => {
      const alreadyWrapped = { workflow: { id: 'x', name: 'x', sequence: [] } };
      expect(needsWrap(alreadyWrapped)).toBe(false);
    });

    it('rejects a workflow with NO workflow payload at all (empty doc)', async () => {
      const wfPath = path.join(tmpDir, 'empty.yaml');
      fs.writeFileSync(wfPath, '# only comment\n', 'utf-8');
      const r = await new WorkflowValidator().validate(wfPath);
      expect(r.valid).toBe(false);
    });

    it('rejects wrapped workflow without workflow.id (contract preserved)', async () => {
      const wfPath = path.join(tmpDir, 'no-id.yaml');
      fs.writeFileSync(
        wfPath,
        yaml.dump({ workflow: { name: 'x', phases: [{ agent: 'a' }] } }),
        'utf-8',
      );
      const r = await new WorkflowValidator().validate(wfPath);
      const idErr = r.errors.find((e) => /workflow\.id/.test(e.message || ''));
      expect(idErr).toBeDefined();
    });
  });
});
