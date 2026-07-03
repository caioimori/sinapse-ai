/**
 * Story onda2-p9 — SYNAPSE runtime on the canonical install path (DEC-01 option A)
 *
 * Covers:
 *   - installSynapseRuntime() creates .synapse/constitution + sessions/ + metrics/
 *   - the generated constitution is readable by the REAL engine pipeline
 *     (domain-loader + SynapseEngine/formatter produce a non-empty block)
 *   - FAIL-OPEN: generation failures return { success: false } and never throw
 *     (an install with a dormant engine is the pre-P9 status quo, not an error)
 *   - process.exitCode is preserved (the underlying generator sets exitCode=1
 *     on a miss — that must not leak into installer exit semantics)
 *   - updateGitignore() ignores the whole .synapse/ in installed projects
 *     (replicating the framework repo, which ignores .synapse/ entirely)
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

const {
  installSynapseRuntime,
  resolveGeneratorPath,
} = require('../../packages/installer/src/installer/synapse-runtime-installer');
const { updateGitignore } = require('../../packages/installer/src/config/configure-environment');

const REAL_CONSTITUTION_MD = path.join(PROJECT_ROOT, '.sinapse-ai', 'constitution.md');

function makeTempTarget({ withConstitution = true } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-p9-'));
  if (withConstitution) {
    const dest = path.join(dir, '.sinapse-ai', 'constitution.md');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(REAL_CONSTITUTION_MD, dest);
  }
  return dir;
}

describe('Story onda2-p9 — installSynapseRuntime()', () => {
  test('creates .synapse/constitution + sessions/ + metrics/ in the target', () => {
    const target = makeTempTarget();
    const result = installSynapseRuntime({ targetDir: target });

    expect(result.success).toBe(true);
    expect(result.articles).toBeGreaterThanOrEqual(11); // constitution has Articles I–XI
    expect(result.rules).toBeGreaterThan(0);

    const constitutionPath = path.join(target, '.synapse', 'constitution');
    expect(fs.existsSync(constitutionPath)).toBe(true);
    expect(fs.existsSync(path.join(target, '.synapse', 'sessions'))).toBe(true);
    expect(fs.existsSync(path.join(target, '.synapse', 'metrics'))).toBe(true);

    const content = fs.readFileSync(constitutionPath, 'utf8');
    expect(content).toContain('# SYNAPSE Constitution Domain (L0)');
    expect(content).toMatch(/CONSTITUTION_RULE_ART1_0=/);
  });

  test('generated constitution is readable by the real domain-loader (formatter input path)', () => {
    const target = makeTempTarget();
    const result = installSynapseRuntime({ targetDir: target });
    expect(result.success).toBe(true);

    const { loadDomainFile } = require(
      path.join(PROJECT_ROOT, '.sinapse-ai', 'core', 'synapse', 'domain', 'domain-loader.js'),
    );
    const rules = loadDomainFile(path.join(target, '.synapse', 'constitution'));
    expect(Array.isArray(rules)).toBe(true);
    expect(rules.length).toBeGreaterThan(0);
    expect(result.rules).toBe(rules.length); // generator count === what the loader reads
  });

  test('real SynapseEngine produces a first-prompt block from the generated runtime', async () => {
    const target = makeTempTarget();
    expect(installSynapseRuntime({ targetDir: target }).success).toBe(true);

    // Same construction the shipped hook uses (hook-runtime.js: new SynapseEngine(synapsePath)).
    const { SynapseEngine } = require(
      path.join(PROJECT_ROOT, '.sinapse-ai', 'core', 'synapse', 'engine.js'),
    );
    const engine = new SynapseEngine(path.join(target, '.synapse'));
    const { xml } = await engine.process('hello, first prompt', { prompt_count: 0 });

    expect(typeof xml).toBe('string');
    expect(xml.length).toBeGreaterThan(0);
    expect(xml).toContain('<synapse-rules');
    // First prompt of a session emits the FULL constitution (context diet, onda1-s2)
    expect(xml).toContain('CONSTITUTION');
  });

  test('FAIL-OPEN: missing constitution.md in target → success:false, no throw', () => {
    const target = makeTempTarget({ withConstitution: false });

    let result;
    expect(() => {
      result = installSynapseRuntime({ targetDir: target });
    }).not.toThrow();

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    // Without .synapse/ the shipped hook returns null silently (hook-runtime.js
    // early-return) — the install is still fully functional.
    expect(fs.existsSync(path.join(target, '.synapse', 'constitution'))).toBe(false);
  });

  test('FAIL-OPEN: generator that throws → success:false, no throw', () => {
    const target = makeTempTarget();
    const badGenerator = path.join(target, 'boom-generator.js');
    fs.writeFileSync(badGenerator, 'module.exports = { main() { throw new Error("boom"); } };');

    let result;
    expect(() => {
      result = installSynapseRuntime({ targetDir: target, generatorPath: badGenerator });
    }).not.toThrow();

    expect(result.success).toBe(false);
    expect(result.error).toContain('boom');
  });

  test('preserves process.exitCode across a failed generation', () => {
    const target = makeTempTarget({ withConstitution: false });
    const saved = process.exitCode;
    process.exitCode = 0;

    const result = installSynapseRuntime({ targetDir: target });

    expect(result.success).toBe(false);
    // The generator sets process.exitCode = 1 on a miss — must be restored.
    expect(process.exitCode).toBe(0);
    process.exitCode = saved;
  });

  test('resolveGeneratorPath prefers the target copy, falls back to package copy', () => {
    // Fallback: bare target → package copy
    const bare = makeTempTarget({ withConstitution: false });
    const fallback = resolveGeneratorPath(bare);
    expect(fallback).toBeTruthy();
    expect(fallback.replace(/\\/g, '/')).toContain('core/synapse/scripts/generate-constitution.js');

    // Preference: target ships its own copy → use it
    const target = makeTempTarget({ withConstitution: false });
    const targetCopy = path.join(
      target, '.sinapse-ai', 'core', 'synapse', 'scripts', 'generate-constitution.js',
    );
    fs.mkdirSync(path.dirname(targetCopy), { recursive: true });
    fs.writeFileSync(targetCopy, 'module.exports = { main() { return { success: false, error: "stub" }; } };');
    expect(resolveGeneratorPath(target)).toBe(targetCopy);
  });
});

describe('Story onda2-p9 — updateGitignore() ignores .synapse/', () => {
  test('adds .synapse/ to a fresh .gitignore', async () => {
    const target = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-p9-git-'));
    await updateGitignore(target);
    const content = fs.readFileSync(path.join(target, '.gitignore'), 'utf8');
    expect(content).toContain('.synapse/');
    expect(content).toContain('# SINAPSE Context Engine (SINAPSE)');
  });

  test('is idempotent (second run adds nothing)', async () => {
    const target = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-p9-git-'));
    await updateGitignore(target);
    const first = fs.readFileSync(path.join(target, '.gitignore'), 'utf8');
    await updateGitignore(target);
    const second = fs.readFileSync(path.join(target, '.gitignore'), 'utf8');
    expect(second).toBe(first);
    expect(second.match(/\.synapse\//g)).toHaveLength(1);
  });
});
