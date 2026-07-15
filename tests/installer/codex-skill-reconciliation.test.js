'use strict';

const fs = require('fs-extra');
const crypto = require('crypto');
const os = require('os');
const path = require('path');

const {
  reconcileLegacyCodexSkills,
} = require('../../packages/installer/src/installer/sinapse-ai-installer');

describe('legacy Codex skill reconciliation', () => {
  let root;
  let packageRoot;
  let targetDir;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'sinapse-skill-reconcile-'));
    packageRoot = path.join(root, 'package');
    targetDir = path.join(root, 'project');
    await fs.ensureDir(path.join(packageRoot, '.codex'));
    await fs.writeJson(path.join(packageRoot, '.codex', 'catalog.json'), {
      expectedSkillIds: ['sinapse-dev'],
      publicAliasSkillIds: ['snps'],
      genericAgentSkillId: 'sinapse-agent',
    });
  });

  afterEach(async () => fs.remove(root));

  async function writeSkill(relativeRoot, id, content) {
    const skillPath = path.join(targetDir, relativeRoot, id, 'SKILL.md');
    await fs.ensureDir(path.dirname(skillPath));
    await fs.writeFile(skillPath, content, 'utf8');
    return skillPath;
  }

  test('removes byte-identical managed mirrors and leaves unrelated skills alone', async () => {
    const legacy = await writeSkill('.codex/skills', 'sinapse-dev', 'same\n');
    await writeSkill('.agents/skills', 'sinapse-dev', 'same\n');
    const sibling = path.join(path.dirname(legacy), 'notes.md');
    await fs.writeFile(sibling, 'keep me\n', 'utf8');
    const unrelated = await writeSkill('.codex/skills', 'user-skill', 'user\n');

    await expect(reconcileLegacyCodexSkills(targetDir, packageRoot))
      .resolves.toMatchObject({ removed: 1, migrated: 0, quarantined: 0, ambiguous: [] });
    expect(await fs.pathExists(legacy)).toBe(false);
    expect(await fs.readFile(sibling, 'utf8')).toBe('keep me\n');
    expect(await fs.pathExists(unrelated)).toBe(true);
  });

  test('moves a legacy-only customization into the native root', async () => {
    const legacy = await writeSkill('.codex/skills', 'snps', 'custom\n');
    const sibling = path.join(path.dirname(legacy), 'assets.json');
    await fs.writeJson(sibling, { custom: true });
    const native = path.join(targetDir, '.agents', 'skills', 'snps', 'SKILL.md');

    await expect(reconcileLegacyCodexSkills(targetDir, packageRoot))
      .resolves.toMatchObject({ removed: 0, migrated: 1, quarantined: 0, ambiguous: [] });
    expect(await fs.pathExists(legacy)).toBe(false);
    expect(await fs.readJson(sibling)).toEqual({ custom: true });
    expect(await fs.readFile(native, 'utf8')).toBe('custom\n');
  });

  test('quarantines divergent legacy content outside discovered skill roots', async () => {
    const legacy = await writeSkill('.codex/skills', 'sinapse-agent', 'legacy custom\n');
    const sibling = path.join(path.dirname(legacy), 'README.md');
    await fs.writeFile(sibling, 'user documentation\n', 'utf8');
    await writeSkill('.agents/skills', 'sinapse-agent', 'native custom\n');

    await expect(reconcileLegacyCodexSkills(targetDir, packageRoot))
      .resolves.toMatchObject({ removed: 0, migrated: 0, quarantined: 1, ambiguous: [] });
    expect(await fs.pathExists(legacy)).toBe(false);
    expect(await fs.readFile(sibling, 'utf8')).toBe('user documentation\n');
    const quarantineDir = path.join(targetDir, '.sinapse-ai', 'migrations', 'codex-skills');
    const quarantined = await fs.readdir(quarantineDir);
    expect(quarantined).toHaveLength(1);
    expect(await fs.readFile(path.join(quarantineDir, quarantined[0]), 'utf8'))
      .toBe('legacy custom\n');
  });

  test('accepts an exclusively-created quarantine collision with identical content', async () => {
    const content = 'legacy custom\n';
    const legacy = await writeSkill('.codex/skills', 'sinapse-agent', content);
    await writeSkill('.agents/skills', 'sinapse-agent', 'native custom\n');
    const digest = crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
    const quarantinePath = path.join(
      targetDir,
      '.sinapse-ai',
      'migrations',
      'codex-skills',
      `sinapse-agent.${digest}.legacy.md`,
    );
    await fs.outputFile(quarantinePath, content);

    await expect(reconcileLegacyCodexSkills(targetDir, packageRoot))
      .resolves.toMatchObject({ quarantined: 1, ambiguous: [] });
    expect(await fs.pathExists(legacy)).toBe(false);
    expect(await fs.readFile(quarantinePath, 'utf8')).toBe(content);
  });

  test('preserves the legacy source when an exclusive quarantine collision differs', async () => {
    const content = 'legacy custom\n';
    const legacy = await writeSkill('.codex/skills', 'sinapse-agent', content);
    await writeSkill('.agents/skills', 'sinapse-agent', 'native custom\n');
    const digest = crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
    const quarantinePath = path.join(
      targetDir,
      '.sinapse-ai',
      'migrations',
      'codex-skills',
      `sinapse-agent.${digest}.legacy.md`,
    );
    await fs.outputFile(quarantinePath, 'collision content\n');

    const result = await reconcileLegacyCodexSkills(targetDir, packageRoot);
    expect(result).toMatchObject({ quarantined: 0 });
    expect(result.ambiguous).toContain(path.relative(targetDir, legacy));
    expect(await fs.readFile(legacy, 'utf8')).toBe(content);
    expect(await fs.readFile(quarantinePath, 'utf8')).toBe('collision content\n');
  });
});
