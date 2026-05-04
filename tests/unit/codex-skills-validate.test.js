'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const { syncSkills } = require('../../.sinapse-ai/infrastructure/scripts/codex-skills-sync/index');
const { validateCodexSkills } = require('../../.sinapse-ai/infrastructure/scripts/codex-skills-sync/validate');

describe('Codex Skills Validator', () => {
  let tmpRoot;
  let sourceDir;
  let skillsDir;
  let expectedAgentCount;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-codex-validate-'));
    sourceDir = path.join(process.cwd(), '.sinapse-ai', 'development', 'agents');
    skillsDir = path.join(tmpRoot, '.codex', 'skills');
    expectedAgentCount = fs.readdirSync(sourceDir).filter(name => name.endsWith('.md')).length;
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('passes when all generated skills are present and valid', () => {
    syncSkills({
      sourceDir,
      localSkillsDir: skillsDir,
      dryRun: false,
      config: { generatedSkillMap: {} },
    });

    const result = validateCodexSkills({
      projectRoot: tmpRoot,
      sourceDir,
      skillsDir,
      strict: true,
    });

    expect(result.ok).toBe(true);
    expect(result.checked).toBe(expectedAgentCount);
    expect(result.errors).toEqual([]);
  });

  it('fails when a generated skill is missing', () => {
    syncSkills({
      sourceDir,
      localSkillsDir: skillsDir,
      dryRun: false,
      config: { generatedSkillMap: {} },
    });
    fs.rmSync(path.join(skillsDir, 'sinapse-architect', 'SKILL.md'), { force: true });

    const result = validateCodexSkills({
      projectRoot: tmpRoot,
      sourceDir,
      skillsDir,
      strict: true,
    });

    expect(result.ok).toBe(false);
    expect(result.errors.some(error => error.includes('Missing skill file'))).toBe(true);
  });

  it('fails when greeting command is removed from a skill', () => {
    syncSkills({
      sourceDir,
      localSkillsDir: skillsDir,
      dryRun: false,
      config: { generatedSkillMap: {} },
    });
    const target = path.join(skillsDir, 'sinapse-developer', 'SKILL.md');
    const original = fs.readFileSync(target, 'utf8');
    fs.writeFileSync(target, original.replace('generate-greeting.js developer', 'generate-greeting.js'), 'utf8');

    const result = validateCodexSkills({
      projectRoot: tmpRoot,
      sourceDir,
      skillsDir,
      strict: true,
    });

    expect(result.ok).toBe(false);
    expect(result.errors.some(error => error.includes('missing canonical greeting command'))).toBe(true);
  });

  it('fails in strict mode when orphaned sinapse-* skill dir exists', () => {
    syncSkills({
      sourceDir,
      localSkillsDir: skillsDir,
      dryRun: false,
      config: { generatedSkillMap: {} },
    });
    const orphanPath = path.join(skillsDir, 'sinapse-legacy');
    fs.mkdirSync(orphanPath, { recursive: true });
    fs.writeFileSync(path.join(orphanPath, 'SKILL.md'), '# legacy', 'utf8');

    const result = validateCodexSkills({
      projectRoot: tmpRoot,
      sourceDir,
      skillsDir,
      strict: true,
    });

    expect(result.ok).toBe(false);
    expect(result.orphaned).toContain('sinapse-legacy');
  });

  it('passes with expanded Codex catalog expectations from .codex/catalog.json', () => {
    fs.mkdirSync(path.join(tmpRoot, '.codex'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpRoot, '.codex', 'catalog.json'),
      JSON.stringify({
        version: 1,
        catalogMode: 'expanded',
        expectedSkillIds: ['sinapse-brand', 'sinapse-dev'],
        canonicalSkillMap: {
          'sinapse-dev': {
            agentId: 'developer',
            filename: 'developer.md',
          },
        },
        pathConventions: {
          allowedSourcePrefixes: ['.sinapse-ai/development/agents/', 'squads/', '.codex/agents/'],
          allowedGreetingScriptPrefixes: ['.sinapse-ai/development/scripts/generate-greeting.js'],
          greetingOptionalSourcePrefixes: ['squads/'],
          requiredFallbackBySourcePrefix: {
            'squads/': '.codex/agents/',
          },
        },
      }),
      'utf8',
    );
    fs.mkdirSync(path.join(skillsDir, 'sinapse-brand'), { recursive: true });
    fs.writeFileSync(
      path.join(skillsDir, 'sinapse-brand', 'SKILL.md'),
      [
        '---',
        'name: sinapse-brand',
        '---',
        'Load squads/squad-brand/agents/brand-orqx.md as source of truth.',
        'fallback: .codex/agents/brand-orqx.md',
      ].join('\n'),
      'utf8',
    );
    fs.mkdirSync(path.join(skillsDir, 'sinapse-dev'), { recursive: true });
    fs.writeFileSync(
      path.join(skillsDir, 'sinapse-dev', 'SKILL.md'),
      [
        '---',
        'name: sinapse-dev',
        '---',
        'Load .sinapse-ai/development/agents/developer.md as source of truth.',
        'Run node .sinapse-ai/development/scripts/generate-greeting.js developer',
      ].join('\n'),
      'utf8',
    );

    const result = validateCodexSkills({
      projectRoot: tmpRoot,
      sourceDir,
      skillsDir,
      strict: true,
    });

    expect(result.ok).toBe(true);
    expect(result.checked).toBe(2);
  });
});
