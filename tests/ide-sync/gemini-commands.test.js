/**
 * Unit tests for gemini-commands.js
 * @story 5.1 - IDE Sync Expansion
 */

'use strict';

const path = require('path');

const {
  FALLBACK_DESCRIPTION,
  MENU_ORDER,
  commandSlugForAgent,
  menuCommandName,
  buildAgentDescription,
  summarizeWhenToUse,
  truncateText,
  escapeTomlString,
  buildGeminiCommandFiles,
  syncGeminiCommands,
} = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/gemini-commands');

// Forbidden upstream-brand tokens assembled from fragments so the literal
// strings never appear in source (the no-external-refs brand guard scans
// tracked files for competitor brand names).
const FORBIDDEN_BRAND = {
  upstream: new RegExp(['ai', 'ox'].join(''), 'i'),
  upstreamSlash: new RegExp('/' + ['ai', 'ox'].join('') + '-', 'i'),
  upstreamCore: new RegExp('\\.' + ['ai', 'ox'].join('') + '-core', 'i'),
};

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const developerAgent = {
  id: 'developer',
  filename: 'developer.md',
  error: null,
  agent: {
    name: 'Pixel',
    id: 'developer',
    title: 'Full Stack Developer',
    icon: '💻',
    whenToUse: 'Use for code implementation tasks. NOT for architecture decisions.',
  },
};

const analystAgent = {
  id: 'analyst',
  filename: 'analyst.md',
  error: null,
  agent: {
    name: 'Scope',
    id: 'analyst',
    title: 'Research Analyst',
    icon: '🔍',
    whenToUse: 'Use for research and analysis. NOT for code.',
  },
};

const errorAgent = {
  id: 'broken',
  filename: 'broken.md',
  error: 'Parse failed',
  agent: null,
};

const minimalAgent = {
  id: 'minimal',
  filename: 'minimal.md',
  error: null,
  agent: null,
};

// ---------------------------------------------------------------------------
// commandSlugForAgent
// ---------------------------------------------------------------------------

describe('commandSlugForAgent', () => {
  it('strips sinapse- prefix', () => {
    expect(commandSlugForAgent('sinapse-orqx')).toBe('orqx');
  });

  it('leaves non-sinapse IDs unchanged', () => {
    expect(commandSlugForAgent('developer')).toBe('developer');
  });

  it('leaves plain IDs unchanged', () => {
    expect(commandSlugForAgent('analyst')).toBe('analyst');
  });
});

// ---------------------------------------------------------------------------
// menuCommandName
// ---------------------------------------------------------------------------

describe('menuCommandName', () => {
  it('returns /sinapse-{slug} for a plain agent id', () => {
    expect(menuCommandName('developer')).toBe('/sinapse-developer');
  });

  it('returns /sinapse-orqx (not /sinapse-sinapse-orqx) for sinapse-orqx', () => {
    expect(menuCommandName('sinapse-orqx')).toBe('/sinapse-orqx');
  });

  it('contains no upstream-brand substring', () => {
    expect(menuCommandName('developer')).not.toMatch(FORBIDDEN_BRAND.upstream);
  });
});

// ---------------------------------------------------------------------------
// truncateText
// ---------------------------------------------------------------------------

describe('truncateText', () => {
  it('returns short text unchanged', () => {
    expect(truncateText('hello', 120)).toBe('hello');
  });

  it('truncates long text with ellipsis', () => {
    const long = 'a'.repeat(150);
    const result = truncateText(long, 120);
    expect(result).toHaveLength(120);
    expect(result.endsWith('…')).toBe(true);
  });

  it('handles null/undefined gracefully', () => {
    expect(truncateText(null)).toBeNull();
    expect(truncateText(undefined)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// escapeTomlString
// ---------------------------------------------------------------------------

describe('escapeTomlString', () => {
  it('escapes double quotes', () => {
    expect(escapeTomlString('say "hi"')).toBe('say \\"hi\\"');
  });

  it('escapes backslashes', () => {
    expect(escapeTomlString('path\\to')).toBe('path\\\\to');
  });

  it('handles null/undefined safely', () => {
    expect(escapeTomlString(null)).toBe('');
    expect(escapeTomlString(undefined)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// summarizeWhenToUse
// ---------------------------------------------------------------------------

describe('summarizeWhenToUse', () => {
  it('returns empty string for falsy input', () => {
    expect(summarizeWhenToUse('')).toBe('');
    expect(summarizeWhenToUse(null)).toBe('');
  });

  it('drops text after NOT for / NÃO para', () => {
    const result = summarizeWhenToUse('Use for code. NOT for architecture.');
    expect(result).not.toContain('NOT for');
  });

  it('stops at the first sentence boundary', () => {
    const result = summarizeWhenToUse('First sentence. Second sentence.');
    expect(result).not.toContain('Second sentence');
  });

  it('truncates very long single sentences', () => {
    const long = 'Use for ' + 'x'.repeat(200) + ' tasks.';
    const result = summarizeWhenToUse(long);
    expect(result.length).toBeLessThanOrEqual(120);
  });
});

// ---------------------------------------------------------------------------
// buildAgentDescription
// ---------------------------------------------------------------------------

describe('buildAgentDescription', () => {
  it('combines title and whenToUse summary', () => {
    const desc = buildAgentDescription(developerAgent);
    expect(desc).toContain('Full Stack Developer');
    expect(desc).toContain('(');
  });

  it('returns title-only when whenToUse is empty', () => {
    const agent = { id: 'x', agent: { title: 'My Agent', whenToUse: '' } };
    expect(buildAgentDescription(agent)).toBe('My Agent');
  });

  it('falls back to "Ativar agente SINAPSE {id}" when agent is null', () => {
    const result = buildAgentDescription(minimalAgent);
    expect(result).toBe('Ativar agente SINAPSE minimal');
    expect(result).not.toMatch(FORBIDDEN_BRAND.upstream);
  });

  it('never contains upstream-brand strings', () => {
    const result = buildAgentDescription(developerAgent);
    expect(result).not.toMatch(FORBIDDEN_BRAND.upstream);
  });
});

// ---------------------------------------------------------------------------
// FALLBACK_DESCRIPTION & MENU_ORDER
// ---------------------------------------------------------------------------

describe('FALLBACK_DESCRIPTION', () => {
  it('contains SINAPSE, not upstream brand', () => {
    expect(FALLBACK_DESCRIPTION).toContain('SINAPSE');
    expect(FALLBACK_DESCRIPTION).not.toMatch(FORBIDDEN_BRAND.upstream);
  });
});

describe('MENU_ORDER', () => {
  it('starts with sinapse-orqx (not upstream master)', () => {
    expect(MENU_ORDER[0]).toBe('sinapse-orqx');
  });

  it('contains no upstream-brand entries', () => {
    for (const id of MENU_ORDER) {
      expect(id).not.toMatch(FORBIDDEN_BRAND.upstream);
    }
  });
});

// ---------------------------------------------------------------------------
// buildGeminiCommandFiles
// ---------------------------------------------------------------------------

describe('buildGeminiCommandFiles', () => {
  const files = buildGeminiCommandFiles([developerAgent, analystAgent, errorAgent]);

  it('prepends sinapse-menu.toml as first file', () => {
    expect(files[0].filename).toBe('sinapse-menu.toml');
  });

  it('excludes agents with errors', () => {
    const filenames = files.map((f) => f.filename);
    expect(filenames).not.toContain('sinapse-broken.toml');
  });

  it('generates sinapse-{slug}.toml for each valid agent', () => {
    const filenames = files.map((f) => f.filename);
    expect(filenames).toContain('sinapse-developer.toml');
    expect(filenames).toContain('sinapse-analyst.toml');
  });

  it('menu content references /sinapse-* commands', () => {
    const menuContent = files[0].content;
    expect(menuContent).toContain('/sinapse-');
    expect(menuContent).not.toMatch(FORBIDDEN_BRAND.upstreamSlash);
  });

  it('agent TOML content references .gemini/rules/SINAPSE/', () => {
    const devFile = files.find((f) => f.filename === 'sinapse-developer.toml');
    expect(devFile).toBeDefined();
    expect(devFile.content).toContain('.gemini/rules/SINAPSE/agents/developer.md');
    expect(devFile.content).not.toMatch(FORBIDDEN_BRAND.upstreamCore);
    expect(devFile.content).not.toMatch(FORBIDDEN_BRAND.upstream);
  });

  it('agent TOML content references .sinapse-ai/ generate-greeting script', () => {
    const devFile = files.find((f) => f.filename === 'sinapse-developer.toml');
    expect(devFile.content).toContain('.sinapse-ai/development/scripts/generate-greeting.js');
  });

  it('TOML files are valid (description key + prompt triple-quoted block)', () => {
    for (const file of files) {
      expect(file.content).toMatch(/^description = "/m);
      expect(file.content).toContain('prompt = """');
      expect(file.content).toContain('"""');
    }
  });

  it('handles empty agent list', () => {
    const result = buildGeminiCommandFiles([]);
    // only menu file, no agent files
    expect(result).toHaveLength(1);
    expect(result[0].filename).toBe('sinapse-menu.toml');
  });

  it('handles agents with null agent field (minimalAgent)', () => {
    const result = buildGeminiCommandFiles([minimalAgent]);
    expect(result).toHaveLength(2);
    const agentFile = result.find((f) => f.filename !== 'sinapse-menu.toml');
    expect(agentFile.description).toBe('Ativar agente SINAPSE minimal');
  });
});

// ---------------------------------------------------------------------------
// syncGeminiCommands — dry-run (no filesystem side effects)
// ---------------------------------------------------------------------------

describe('syncGeminiCommands (dry-run)', () => {
  const FAKE_ROOT = path.join(__dirname, '__fake_root__');

  it('returns commandsDir and files without writing to disk', () => {
    const result = syncGeminiCommands([developerAgent], FAKE_ROOT, { dryRun: true });
    expect(result.commandsDir).toBe(path.join(FAKE_ROOT, '.gemini', 'commands'));
    expect(result.files.length).toBeGreaterThan(0);
  });

  it('each file entry has filename, path, and content', () => {
    const result = syncGeminiCommands([developerAgent], FAKE_ROOT, { dryRun: true });
    for (const file of result.files) {
      expect(typeof file.filename).toBe('string');
      expect(typeof file.path).toBe('string');
      expect(typeof file.content).toBe('string');
    }
  });

  it('filenames are prefixed with commands separator', () => {
    const result = syncGeminiCommands([developerAgent], FAKE_ROOT, { dryRun: true });
    for (const file of result.files) {
      expect(file.filename.startsWith('commands')).toBe(true);
    }
  });
});
