const fs = require('fs');
const os = require('os');
const path = require('path');

const { deliverGlobalProviderAdapters, getGlobalCommandStagingDir } = require('../../bin/lib/global-provider-adapters');
const { regenerateAgentCommands } = require('../../bin/lib/command-generator');

function writeCommand(dir, name) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}.md`), [
    '---',
    `name: ${name}`,
    `description: ${name} specialist`,
    '---',
    '',
    `# ${name}`,
    '',
    'Canonical runtime instructions.',
  ].join('\n'));
}

describe('global provider adapters', () => {
  let root;
  let home;
  let commandsDir;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-global-adapters-'));
    home = path.join(root, 'home');
    commandsDir = path.join(root, 'commands');
    writeCommand(commandsDir, 'sinapse-orqx');
    writeCommand(commandsDir, 'developer');
  });

  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  test('claude-code writes Markdown subagents only', () => {
    const result = deliverGlobalProviderAdapters({ llmChoice: 'claude-code', home, commandsDir });

    expect(result.claude).toHaveLength(2);
    expect(result.claudeSkills).toEqual(['snps', 'sinapse', 'snps-orqx', 'sinapse-orqx', 'sinapse-agent']);
    expect(fs.existsSync(path.join(home, '.claude', 'agents', 'developer.md'))).toBe(true);
    expect(fs.readFileSync(path.join(home, '.claude', 'agents', 'developer.md'), 'utf8'))
      .toContain('SINAPSE-MANAGED:global-agent');
    expect(fs.existsSync(path.join(home, '.codex'))).toBe(false);
    expect(fs.existsSync(path.join(home, '.agents'))).toBe(false);
    for (const id of result.claudeSkills) {
      expect(fs.existsSync(path.join(home, '.claude', 'skills', id, 'SKILL.md'))).toBe(true);
    }
  });

  test('codex-only stages generated commands outside Claude directories', () => {
    expect(getGlobalCommandStagingDir({
      llmChoice: 'codex',
      sinapseHome: path.join(home, '.sinapse'),
      claudeCommandsDir: path.join(home, '.claude', 'commands', 'SINAPSE', 'agents'),
    })).toBe(path.join(home, '.sinapse', '.generated', 'agents'));
  });

  test.each(['claude-code', 'both'])('%s also stages outside active Claude commands', (llmChoice) => {
    expect(getGlobalCommandStagingDir({
      llmChoice,
      sinapseHome: path.join(home, '.sinapse'),
      claudeCommandsDir: path.join(home, '.claude', 'commands', 'SINAPSE', 'agents'),
    })).toBe(path.join(home, '.sinapse', '.generated', 'agents'));
  });

  test('codex writes TOML agents and activator skills without Markdown agents', () => {
    const staleDir = path.join(home, '.codex', 'agents');
    fs.mkdirSync(staleDir, { recursive: true });
    fs.writeFileSync(path.join(staleDir, 'developer.md'), 'stale');

    const result = deliverGlobalProviderAdapters({ llmChoice: 'codex', home, commandsDir });
    const toml = fs.readFileSync(path.join(staleDir, 'developer.toml'), 'utf8');

    expect(result.codex).toHaveLength(2);
    expect(result.skills).toEqual(['snps', 'sinapse', 'snps-orqx', 'sinapse-orqx', 'sinapse-agent']);
    expect(toml).toContain('name = "developer"');
    expect(toml).toContain('description = "developer specialist"');
    expect(fs.existsSync(path.join(staleDir, 'developer.md'))).toBe(false);
    expect(fs.existsSync(path.join(home, '.claude'))).toBe(false);
    for (const id of result.skills) {
      expect(fs.existsSync(path.join(home, '.agents', 'skills', id, 'SKILL.md'))).toBe(true);
    }
  });

  test('both writes each provider native format', () => {
    const result = deliverGlobalProviderAdapters({ llmChoice: 'both', home, commandsDir });

    expect(result.claude).toHaveLength(2);
    expect(result.codex).toHaveLength(2);
    expect(fs.existsSync(path.join(home, '.claude', 'agents', 'sinapse-orqx.md'))).toBe(true);
    expect(fs.existsSync(path.join(home, '.codex', 'agents', 'sinapse-orqx.toml'))).toBe(true);
    expect(fs.existsSync(path.join(home, '.codex', 'agents', 'sinapse-orqx.md'))).toBe(false);
  });

  test('keeps supreme aliases as skills instead of duplicate global agents', () => {
    writeCommand(commandsDir, 'snps-orqx');
    writeCommand(commandsDir, 'sinapse');
    writeCommand(commandsDir, 'snps');

    const result = deliverGlobalProviderAdapters({ llmChoice: 'both', home, commandsDir });

    expect(result.claude).toEqual(['developer.md', 'snps-orqx.md']);
    expect(result.codex).toEqual(['developer.toml', 'snps-orqx.toml']);
    expect(result.claudeSkills).toEqual(['snps', 'sinapse', 'snps-orqx', 'sinapse-orqx', 'sinapse-agent']);
    expect(fs.existsSync(path.join(home, '.claude', 'agents', 'sinapse.md'))).toBe(false);
    expect(fs.existsSync(path.join(home, '.claude', 'agents', 'snps.md'))).toBe(false);
    expect(fs.readFileSync(path.join(home, '.claude', 'agents', 'snps-orqx.md'), 'utf8'))
      .toMatch(/^name: sinapse-orqx$/m);
    expect(fs.readFileSync(path.join(home, '.claude', 'skills', 'snps', 'SKILL.md'), 'utf8'))
      .toContain('sinapse-orqx');
  });

  test('removes stale managed adapters and preserves custom global agents', () => {
    const claudeAgents = path.join(home, '.claude', 'agents');
    const codexAgents = path.join(home, '.codex', 'agents');
    fs.mkdirSync(claudeAgents, { recursive: true });
    fs.mkdirSync(codexAgents, { recursive: true });
    fs.writeFileSync(path.join(claudeAgents, 'stale.md'), '<!-- SINAPSE-MANAGED:global-agent -->\n');
    fs.writeFileSync(path.join(claudeAgents, 'legacy-stale.md'), [
      'ACTIVATION-NOTICE: This command activates an agent from sinapse.',
      'Read C:\\Users\\test\\.sinapse\\sinapse\\agents\\legacy-stale.md',
      'Load the squad manifest',
    ].join('\n'));
    fs.writeFileSync(path.join(claudeAgents, 'custom.md'), '# custom\n');
    fs.writeFileSync(path.join(codexAgents, 'stale.toml'), '# SINAPSE-MANAGED:global-agent\n');
    fs.writeFileSync(path.join(codexAgents, 'custom.toml'), 'name = "custom"\n');

    deliverGlobalProviderAdapters({ llmChoice: 'both', home, commandsDir });

    expect(fs.existsSync(path.join(claudeAgents, 'stale.md'))).toBe(false);
    expect(fs.existsSync(path.join(claudeAgents, 'legacy-stale.md'))).toBe(false);
    expect(fs.existsSync(path.join(codexAgents, 'stale.toml'))).toBe(false);
    expect(fs.existsSync(path.join(claudeAgents, 'custom.md'))).toBe(true);
    expect(fs.existsSync(path.join(codexAgents, 'custom.toml'))).toBe(true);
  });

  test('preserves a user-owned global skill with the same ID', () => {
    const skillPath = path.join(home, '.agents', 'skills', 'snps', 'SKILL.md');
    fs.mkdirSync(path.dirname(skillPath), { recursive: true });
    fs.writeFileSync(skillPath, '# User skill\n');

    const result = deliverGlobalProviderAdapters({ llmChoice: 'codex', home, commandsDir });

    expect(fs.readFileSync(skillPath, 'utf8')).toBe('# User skill\n');
    expect(result.skills).not.toContain('snps');
  });

  test('updates an existing managed skill atomically', () => {
    const skillPath = path.join(home, '.agents', 'skills', 'snps', 'SKILL.md');
    fs.mkdirSync(path.dirname(skillPath), { recursive: true });
    fs.writeFileSync(skillPath, '<!-- SINAPSE-MANAGED:global-skill -->\nold\n');

    const result = deliverGlobalProviderAdapters({ llmChoice: 'codex', home, commandsDir });

    expect(result.skills).toContain('snps');
    expect(fs.readFileSync(skillPath, 'utf8')).toContain('# SINAPSE Global Orchestrator');
    expect(fs.readdirSync(path.dirname(skillPath)).filter((name) => name.endsWith('.tmp'))).toEqual([]);
  });

  test('does not follow a user-owned skill symlink', () => {
    if (process.platform === 'win32') return;
    const targetPath = path.join(root, 'user-skill.md');
    const skillPath = path.join(home, '.agents', 'skills', 'snps', 'SKILL.md');
    fs.mkdirSync(path.dirname(skillPath), { recursive: true });
    fs.writeFileSync(targetPath, '<!-- SINAPSE-MANAGED:global-skill -->\nuser target\n');
    fs.symlinkSync(targetPath, skillPath);

    const result = deliverGlobalProviderAdapters({ llmChoice: 'codex', home, commandsDir });

    expect(result.skills).not.toContain('snps');
    expect(fs.readFileSync(targetPath, 'utf8')).toContain('user target');
  });

  test('global command generation includes mirrored core agents', () => {
    const coreDir = path.join(root, 'core');
    const agentDir = path.join(coreDir, 'agents');
    fs.mkdirSync(agentDir, { recursive: true });
    fs.writeFileSync(path.join(agentDir, 'architect.md'), 'name: Stratum\nicon: layers\n');

    const result = regenerateAgentCommands({
      sinapseHome: path.join(root, 'sinapse-home'),
      commandsDir,
      squads: [],
      sinapseMasterDest: path.join(root, 'missing-master'),
      coreDevelopmentDest: coreDir,
    });

    expect(result.writtenAgents.has('architect.md')).toBe(true);
    const command = fs.readFileSync(path.join(commandsDir, 'architect.md'), 'utf8');
    expect(command).toContain(`${coreDir.replace(/\\/g, '/')}/agents/architect.md`);
    expect(command).not.toContain(`${coreDir.replace(/\\/g, '/')}/squad.yaml`);
  });
});
