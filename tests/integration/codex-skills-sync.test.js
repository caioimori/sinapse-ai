'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  syncSkills,
  buildSkillContent,
} = require('../../.sinapse-ai/infrastructure/scripts/codex-skills-sync/index');

describe('Codex Skills Sync', () => {
  let tmpRoot;
  let expectedAgentCount;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-codex-skills-'));
    expectedAgentCount = fs.readdirSync(path.join(process.cwd(), '.sinapse-ai', 'development', 'agents'))
      .filter(name => name.endsWith('.md')).length;
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('generates one SKILL.md per SINAPSE agent in local .codex/skills', () => {
    const localSkillsDir = path.join(tmpRoot, '.codex', 'skills');
    const result = syncSkills({
      sourceDir: path.join(process.cwd(), '.sinapse-ai', 'development', 'agents'),
      localSkillsDir,
      dryRun: false,
    });

    expect(result.generated).toBe(expectedAgentCount);
    const expected = path.join(localSkillsDir, 'sinapse-architect', 'SKILL.md');
    expect(fs.existsSync(expected)).toBe(true);

    const content = fs.readFileSync(expected, 'utf8');
    expect(content).toContain('name: sinapse-architect');
    expect(content).toContain('Activation Protocol');
    expect(content).toContain('.sinapse-ai/development/agents/architect.md');
    expect(content).toContain('generate-greeting.js architect');
  });

  it('supports global installation path when --global mode is enabled', () => {
    const localSkillsDir = path.join(tmpRoot, '.codex', 'skills');
    const globalSkillsDir = path.join(tmpRoot, '.codex-home', 'skills');

    const result = syncSkills({
      sourceDir: path.join(process.cwd(), '.sinapse-ai', 'development', 'agents'),
      localSkillsDir,
      globalSkillsDir,
      global: true,
      dryRun: false,
    });

    expect(result.generated).toBe(expectedAgentCount);
    expect(result.globalSkillsDir).toBe(globalSkillsDir);
    expect(fs.existsSync(path.join(globalSkillsDir, 'sinapse-developer', 'SKILL.md'))).toBe(true);
  });

  it('treats globalOnly as global output and skips local writes', () => {
    const localSkillsDir = path.join(tmpRoot, '.codex', 'skills');
    const globalSkillsDir = path.join(tmpRoot, '.codex-home', 'skills');

    const result = syncSkills({
      sourceDir: path.join(process.cwd(), '.sinapse-ai', 'development', 'agents'),
      localSkillsDir,
      globalSkillsDir,
      globalOnly: true,
      dryRun: false,
    });

    expect(result.generated).toBe(expectedAgentCount);
    expect(result.globalSkillsDir).toBe(globalSkillsDir);
    expect(fs.existsSync(path.join(localSkillsDir, 'sinapse-developer', 'SKILL.md'))).toBe(false);
    expect(fs.existsSync(path.join(globalSkillsDir, 'sinapse-developer', 'SKILL.md'))).toBe(true);
  });

  it('buildSkillContent emits valid frontmatter and starter commands', () => {
    const sample = {
      id: 'developer',
      filename: 'developer.md',
      agent: { name: 'Dex', title: 'Developer', whenToUse: 'Build features safely.' },
      commands: [{ name: 'help', description: 'Show commands', visibility: ['quick', 'key', 'full'] }],
    };
    const content = buildSkillContent(sample);
    expect(content.startsWith('---')).toBe(true);
    expect(content).toContain('name: sinapse-developer');
    expect(content).toContain('`*help` - Show commands');
  });
});
