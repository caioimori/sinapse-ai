'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  collectNativeAgentDefinitions,
  extractSourceDescription,
  NATIVE_WORKFLOW_SKILLS,
  readCodexCatalog,
  syncCodexNativeAgents,
} = require('../../.codex/scripts/sync-codex-native');
const {
  resolveCodexCommand,
} = require('../../.codex/scripts/resolve-codex-command');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

function createFixtureProject() {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-codex-native-'));
  const agentsDir = path.join(projectRoot, '.codex', 'agents');
  const sourcesDir = path.join(projectRoot, 'sources');
  fs.mkdirSync(agentsDir, { recursive: true });
  fs.mkdirSync(sourcesDir, { recursive: true });

  const expectedSkillIds = [...NATIVE_WORKFLOW_SKILLS, 'sinapse-dev', 'sinapse-agent'];
  fs.mkdirSync(path.join(projectRoot, '.codex'), { recursive: true });
  fs.writeFileSync(
    path.join(projectRoot, '.codex', 'catalog.json'),
    `${JSON.stringify({
      expectedSkillIds,
      publicAliasSkillIds: ['snps', 'sinapse', 'snps-orqx'],
      genericAgentSkillId: 'sinapse-agent',
    }, null, 2)}\n`,
  );

  const pointers = {
    developer: [
      'Activate agent: developer',
      'Squad: core',
      'Read the agent definition at: sources/developer.md',
      'Follow ALL instructions in the agent file.',
      '',
    ].join('\n'),
    'snps-orqx': [
      'Activate agent: snps-orqx',
      'Squad: core',
      'Read the agent definition at: sources/snps-orqx.md',
      'Follow ALL instructions in the agent file.',
      '',
    ].join('\n'),
  };

  fs.writeFileSync(path.join(agentsDir, 'developer.md'), pointers.developer);
  fs.writeFileSync(path.join(agentsDir, 'snps-orqx.md'), pointers['snps-orqx']);
  fs.writeFileSync(
    path.join(sourcesDir, 'developer.md'),
    "agent:\n  whenToUse: 'Use for deterministic native Codex implementation tasks'\n",
  );
  fs.writeFileSync(
    path.join(sourcesDir, 'snps-orqx.md'),
    'agent:\n  description: Coordinate the complete SINAPSE agent ecosystem\n',
  );

  const workflowSkills = Object.fromEntries(
    NATIVE_WORKFLOW_SKILLS.map((skillId) => [
      skillId,
      [
        '---',
        `name: ${skillId}`,
        `description: Native ${skillId} workflow skill.`,
        '---',
        '',
        `# ${skillId}`,
        '',
      ].join('\n'),
    ]),
  );
  for (const [skillId, content] of Object.entries(workflowSkills)) {
    const skillDir = path.join(projectRoot, '.agents', 'skills', skillId);
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content);
  }
  const developerSkillDir = path.join(projectRoot, '.agents', 'skills', 'sinapse-dev');
  fs.mkdirSync(developerSkillDir, { recursive: true });
  fs.writeFileSync(
    path.join(developerSkillDir, 'SKILL.md'),
    ['---', 'name: sinapse-dev', 'description: Native developer activator.', '---', ''].join('\n'),
  );

  return { projectRoot, agentsDir, pointers, workflowSkills };
}

function parseRequiredTomlFields(content) {
  const fields = {};
  for (const key of ['name', 'description', 'developer_instructions']) {
    const match = content.match(new RegExp(`^${key} = (.+)$`, 'm'));
    if (!match) throw new Error(`Missing TOML field: ${key}`);
    fields[key] = JSON.parse(match[1]);
  }
  return fields;
}

describe('sync-codex-native', () => {
  const tempProjects = [];

  afterEach(() => {
    for (const projectRoot of tempProjects.splice(0)) {
      fs.rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it('generates deterministic adapters without changing Markdown pointers', () => {
    const fixture = createFixtureProject();
    tempProjects.push(fixture.projectRoot);
    const markdownBefore = Object.fromEntries(
      Object.keys(fixture.pointers).map((id) => [
        id,
        fs.readFileSync(path.join(fixture.agentsDir, `${id}.md`), 'utf8'),
      ]),
    );

    const first = syncCodexNativeAgents(fixture.projectRoot);
    const generatedBefore = Object.fromEntries(
      Object.keys(fixture.pointers).map((id) => [
        id,
        fs.readFileSync(path.join(fixture.agentsDir, `${id}.toml`), 'utf8'),
      ]),
    );
    const second = syncCodexNativeAgents(fixture.projectRoot);

    expect(first).toMatchObject({ total: 2, created: 2, updated: 0, unchanged: 0 });
    expect(second).toMatchObject({ total: 2, created: 0, updated: 0, unchanged: 2 });
    expect(first.nativeSkills).toMatchObject({ total: 8, created: 4, updated: 0, unchanged: 4 });
    expect(second.nativeSkills).toMatchObject({ total: 8, created: 0, updated: 0, unchanged: 8 });
    for (const id of Object.keys(fixture.pointers)) {
      expect(fs.readFileSync(path.join(fixture.agentsDir, `${id}.md`), 'utf8')).toBe(
        markdownBefore[id],
      );
      expect(fs.readFileSync(path.join(fixture.agentsDir, `${id}.toml`), 'utf8')).toBe(
        generatedBefore[id],
      );
    }
    for (const [skillId, content] of Object.entries(fixture.workflowSkills)) {
      expect(
        fs.readFileSync(
          path.join(fixture.projectRoot, '.agents', 'skills', skillId, 'SKILL.md'),
          'utf8',
        ),
      ).toBe(content);
      expect(fs.existsSync(path.join(fixture.projectRoot, '.codex', 'skills', skillId, 'SKILL.md')))
        .toBe(false);
    }
    for (const skillId of ['snps', 'sinapse', 'snps-orqx', 'sinapse-agent', 'sinapse-dev']) {
      expect(
        fs.existsSync(path.join(fixture.projectRoot, '.agents', 'skills', skillId, 'SKILL.md')),
      ).toBe(true);
    }
  });

  it('derives descriptions only from scoped agent metadata', () => {
    expect(extractSourceDescription("agent:\n  whenToUse: 'Use for native Codex delivery'\n")).toBe(
      'Use for native Codex delivery',
    );
    const blockDescription = extractSourceDescription(
      [
        'agent:',
        '  title: Architect',
        '  whenToUse: |',
        '    Use for system architecture, technology selection, API design, security architecture,',
        '    performance optimization, deployment strategy, and cross-cutting system concerns.',
        'commands:',
        '  - name: help',
        '    description: Show all available commands with descriptions',
      ].join('\n'),
    );

    expect(blockDescription).toMatch(/^Use for system architecture/);
    expect(blockDescription).not.toContain('Show all available commands');
    expect(blockDescription.length).toBeLessThanOrEqual(240);
    expect(
      extractSourceDescription(
        ['---', 'description: |', '  Native frontmatter agent description.', '---'].join('\n'),
      ),
    ).toBe('Native frontmatter agent description.');
  });

  it('rejects catalog skill IDs that could escape the native skills root', () => {
    const fixture = createFixtureProject();
    tempProjects.push(fixture.projectRoot);
    const catalogPath = path.join(fixture.projectRoot, '.codex', 'catalog.json');
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    catalog.expectedSkillIds = ['../../outside'];
    fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

    expect(() => readCodexCatalog(fixture.projectRoot)).toThrow('unsafe skill ID');
  });

  it('exposes the supreme orchestrator alias without changing its filename', () => {
    const fixture = createFixtureProject();
    tempProjects.push(fixture.projectRoot);
    syncCodexNativeAgents(fixture.projectRoot);

    const filePath = path.join(fixture.agentsDir, 'snps-orqx.toml');
    const fields = parseRequiredTomlFields(fs.readFileSync(filePath, 'utf8'));

    expect(fields.name).toBe('sinapse-orqx');
    expect(fields.developer_instructions).toContain('@snps-orqx');
    expect(fields.developer_instructions).toContain('@sinapse-orqx');
    expect(fields.developer_instructions).toContain(
      'node .codex/scripts/resolve-codex-command.js sinapse-orqx <command> --json',
    );
  });

  it('generates only required portable fields and inherits host model settings', () => {
    const fixture = createFixtureProject();
    tempProjects.push(fixture.projectRoot);
    syncCodexNativeAgents(fixture.projectRoot);

    for (const id of Object.keys(fixture.pointers)) {
      const content = fs.readFileSync(path.join(fixture.agentsDir, `${id}.toml`), 'utf8');
      const fields = parseRequiredTomlFields(content);
      expect(fields.name).toBeTruthy();
      expect(fields.description).toBeTruthy();
      expect(fields.developer_instructions).toContain('AGENTS.md');
      expect(content).not.toMatch(/^model\s*=/m);
      expect(content).not.toMatch(/reasoning/i);
    }
  });

  it('covers every repository Markdown adapter with one aligned TOML adapter', () => {
    const definitions = collectNativeAgentDefinitions(PROJECT_ROOT);
    const repositoryAgentFiles = fs.readdirSync(path.join(PROJECT_ROOT, '.codex', 'agents'));
    const markdownNames = repositoryAgentFiles
      .filter((file) => file.endsWith('.md'))
      .map((file) => file.replace(/\.md$/, ''))
      .sort();
    const tomlNames = repositoryAgentFiles
      .filter((file) => file.endsWith('.toml'))
      .map((file) => file.replace(/\.toml$/, ''))
      .sort();

    expect(definitions).toHaveLength(172);
    expect(definitions.map((definition) => definition.id)).toEqual(markdownNames);
    expect(new Set(definitions.map((definition) => definition.fileName)).size).toBe(172);
    expect(tomlNames).toEqual(markdownNames);
    expect(definitions.find((definition) => definition.id === 'architect').description).toMatch(
      /^Use for system architecture/,
    );
    for (const agentId of tomlNames) {
      const content = fs.readFileSync(
        path.join(PROJECT_ROOT, '.codex', 'agents', `${agentId}.toml`),
        'utf8',
      );
      expect(parseRequiredTomlFields(content).developer_instructions).toBeTruthy();
    }
  });

  it('keeps project configuration portable and bounded', () => {
    const config = fs.readFileSync(path.join(PROJECT_ROOT, '.codex', 'config.toml'), 'utf8');

    expect(config).toMatch(/^\[features\]$/m);
    expect(config).toMatch(/^hooks = true$/m);
    expect(config).toMatch(/^multi_agent = true$/m);
    expect(config).toMatch(/^goals = true$/m);
    expect(config).toMatch(/^max_threads = 6$/m);
    expect(config).toMatch(/^max_depth = 1$/m);
    expect(config).not.toMatch(/^model\s*=/m);
    expect(config).not.toMatch(/reasoning_effort/);
  });

  it('keeps workflow skills only in the native discovery root', () => {
    for (const skillId of NATIVE_WORKFLOW_SKILLS) {
      const nativeSkill = fs.readFileSync(
        path.join(PROJECT_ROOT, '.agents', 'skills', skillId, 'SKILL.md'),
        'utf8',
      );
      expect(nativeSkill).toContain(`name: ${skillId}`);
      expect(fs.existsSync(path.join(PROJECT_ROOT, '.codex', 'skills', skillId, 'SKILL.md')))
        .toBe(false);
    }
  });

  it('routes critical project and architecture commands through the public resolver', () => {
    const cases = [
      ['project-lead', 'create-prd'],
      ['architect', 'assess-complexity'],
      ['architect', 'create-plan'],
    ];

    for (const [agentId, commandId] of cases) {
      const content = fs.readFileSync(
        path.join(PROJECT_ROOT, '.codex', 'agents', `${agentId}.toml`),
        'utf8',
      );
      const instructions = parseRequiredTomlFields(content).developer_instructions;
      const resolved = resolveCodexCommand(agentId, commandId, PROJECT_ROOT);

      expect(instructions).toContain(
        `node .codex/scripts/resolve-codex-command.js ${agentId} <command> --json`,
      );
      expect(instructions).not.toContain('resolve-codex-agent.js');
      expect(fs.statSync(path.join(PROJECT_ROOT, resolved.target)).isFile()).toBe(true);
    }
  });

  it('materializes individual agent skills only in explicit expanded mode', () => {
    const fixture = createFixtureProject();
    tempProjects.push(fixture.projectRoot);

    const summary = syncCodexNativeAgents(fixture.projectRoot, { expandedSkills: true });

    expect(summary.activationMode).toBe('expanded');
    expect(summary.nativeSkills.total).toBe(10);
    expect(
      fs.existsSync(path.join(
        fixture.projectRoot,
        '.agents',
        'skills',
        'sinapse-agent-developer',
        'SKILL.md',
      )),
    ).toBe(true);
    expect(
      fs.existsSync(path.join(
        fixture.projectRoot,
        '.codex',
        'skills',
        'sinapse-agent-developer',
        'SKILL.md',
      )),
    ).toBe(false);
  });
});
