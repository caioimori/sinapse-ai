'use strict';

const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const {
  commandSlugForAgent,
  menuCommandName,
  buildAgentDescription,
  summarizeWhenToUse,
  truncateText,
  buildGeminiCommandFiles,
  syncGeminiCommands,
} = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/gemini-commands');

describe('gemini command sync', () => {
  let tmpRoot;

  beforeEach(async () => {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'gemini-commands-'));
  });

  afterEach(async () => {
    await fs.remove(tmpRoot);
  });

  it('normalizes command slugs and menu names', () => {
    expect(commandSlugForAgent('sinapse-master')).toBe('master');
    expect(commandSlugForAgent('dev')).toBe('dev');
    expect(menuCommandName('sinapse-master')).toBe('/sinapse-master');
    expect(menuCommandName('dev')).toBe('/sinapse-dev');
  });

  it('builds menu + one command per agent', () => {
    const agents = [
      { id: 'dev', error: null, agent: { title: 'Developer', whenToUse: 'Implementar features' } },
      { id: 'architect', error: null, agent: { title: 'Architect', whenToUse: 'Definir arquitetura' } },
      { id: 'qa', error: null, agent: { title: 'QA', whenToUse: 'Validar qualidade' } },
    ];
    const files = buildGeminiCommandFiles(agents);

    expect(files.find((f) => f.filename === 'sinapse-menu.toml')).toBeDefined();
    expect(files.find((f) => f.filename === 'sinapse-dev.toml')).toBeDefined();
    expect(files.find((f) => f.filename === 'sinapse-architect.toml')).toBeDefined();
    expect(files.find((f) => f.filename === 'sinapse-qa.toml')).toBeDefined();
    expect(files).toHaveLength(4);
  });

  it('derives command description from agent title and whenToUse', () => {
    const files = buildGeminiCommandFiles([
      {
        id: 'dev',
        error: null,
        agent: {
          title: 'Full Stack Developer',
          whenToUse: 'Use para implementação e debugging. NOT for planejamento de produto',
        },
      },
    ]);

    const dev = files.find((f) => f.filename === 'sinapse-dev.toml');
    expect(dev.content).toContain('description = "Full Stack Developer (Use para implementação e debugging)"');
  });

  it('falls back to generic description when metadata is missing', () => {
    const files = buildGeminiCommandFiles([{ id: 'dev', error: null, agent: null }]);
    const dev = files.find((f) => f.filename === 'sinapse-dev.toml');
    expect(dev.content).toContain('description = "Ativar agente SINAPSE dev"');
  });

  it('buildAgentDescription handles multiline text', () => {
    const description = buildAgentDescription({
      id: 'architect',
      agent: {
        title: 'Architect',
        whenToUse: 'Use para arquitetura\ncomplexa em sistemas distribuídos. NOT for gestão de sprint',
      },
    });
    expect(description).toBe('Architect (Use para arquitetura complexa em sistemas distribuídos)');
  });

  it('summarizeWhenToUse truncates very long text', () => {
    const longText = 'Use para arquitetura '.concat('muito '.repeat(80)).concat('complexa.');
    const summary = summarizeWhenToUse(longText);
    expect(summary.length).toBeLessThanOrEqual(120);
    expect(summary.endsWith('…')).toBe(true);
  });

  it('truncateText returns original when short', () => {
    expect(truncateText('texto curto', 20)).toBe('texto curto');
  });

  it('writes command files to .gemini/commands', () => {
    const agents = [
      { id: 'dev', error: null, agent: { title: 'Developer', whenToUse: 'Implementar features' } },
      { id: 'qa', error: null, agent: { title: 'QA', whenToUse: 'Validar qualidade' } },
    ];
    const result = syncGeminiCommands(agents, tmpRoot, { dryRun: false });

    expect(result.files.length).toBe(3);
    expect(fs.existsSync(path.join(tmpRoot, '.gemini', 'commands', 'sinapse-menu.toml'))).toBe(true);
    expect(fs.existsSync(path.join(tmpRoot, '.gemini', 'commands', 'sinapse-dev.toml'))).toBe(true);
    expect(fs.existsSync(path.join(tmpRoot, '.gemini', 'commands', 'sinapse-qa.toml'))).toBe(true);
  });
});
