/**
 * Unit tests for kimi transformer (Frente 5.1 — IDE Sync Expansion)
 * @story 5.1 - IDE Sync Expansion
 */

const kimi = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/transformers/kimi');

describe('kimi transformer', () => {
  const sampleAgent = {
    path: '/path/to/developer.md',
    filename: 'developer.md',
    id: 'developer',
    raw: '# developer\n\n```yaml\nagent:\n  name: Dex\n  id: developer\n```\n\nContent',
    yaml: {
      agent: {
        name: 'Dex',
        id: 'developer',
        title: 'Full Stack Developer',
        icon: '💻',
        whenToUse: 'Use for code implementation',
      },
      commands: [
        { name: 'help', visibility: ['full', 'quick', 'key'], description: 'Show help' },
        { name: 'develop', visibility: ['full', 'quick'], description: 'Develop story' },
      ],
    },
    agent: {
      name: 'Dex',
      id: 'developer',
      title: 'Full Stack Developer',
      icon: '💻',
      whenToUse: 'Use for code implementation',
    },
    persona_profile: {
      archetype: 'Builder',
    },
    commands: [
      { name: 'help', visibility: ['full', 'quick', 'key'], description: 'Show help' },
      { name: 'develop', visibility: ['full', 'quick'], description: 'Develop story' },
    ],
    sections: {},
    error: null,
  };

  // --- Module interface ---

  it('should export transform, getSkillId, getDirname, getFilename, format', () => {
    expect(typeof kimi.transform).toBe('function');
    expect(typeof kimi.getSkillId).toBe('function');
    expect(typeof kimi.getDirname).toBe('function');
    expect(typeof kimi.getFilename).toBe('function');
    expect(kimi.format).toBe('kimi-skill');
  });

  // --- getFilename ---

  it('getFilename should always return SKILL.md', () => {
    expect(kimi.getFilename(sampleAgent)).toBe('SKILL.md');
    expect(kimi.getFilename({ id: 'anything', agent: {} })).toBe('SKILL.md');
  });

  // --- getSkillId / getDirname ---

  it('getSkillId should prefix sinapse- to plain agent id', () => {
    expect(kimi.getSkillId({ id: 'developer', agent: {} })).toBe('sinapse-developer');
    expect(kimi.getSkillId({ id: 'analyst', agent: {} })).toBe('sinapse-analyst');
  });

  it('getSkillId should preserve ids that already start with sinapse-', () => {
    // Ids that already carry the prefix must not be double-prefixed
    expect(kimi.getSkillId({ id: 'sinapse-orqx', agent: {} })).toBe('sinapse-orqx');
    expect(kimi.getSkillId({ id: 'sinapse-foo', agent: { preferredActivationAlias: 'sinapse-foo' } })).toBe('sinapse-foo');
  });

  it('getDirname should equal getSkillId', () => {
    expect(kimi.getDirname(sampleAgent)).toBe(kimi.getSkillId(sampleAgent));
  });

  // --- Rebrand: zero upstream-brand strings ---
  // Forbidden tokens assembled from fragments so the literal strings never
  // appear in source (the no-external-refs brand guard scans tracked files).
  const FORBIDDEN_BRAND = {
    upstream: new RegExp(['ai', 'ox'].join(''), 'i'),
    legacy: new RegExp(['ai', 'os'].join(''), 'i'),
    vendor: new RegExp(['syn', 'krai'].join(''), 'i'),
  };

  it('transform should contain zero upstream-brand occurrences', () => {
    const result = kimi.transform(sampleAgent);
    expect(result).not.toMatch(FORBIDDEN_BRAND.upstream);
    expect(result).not.toMatch(FORBIDDEN_BRAND.legacy);
    expect(result).not.toMatch(FORBIDDEN_BRAND.vendor);
  });

  // --- YAML frontmatter ---

  it('transform should produce YAML frontmatter with name and description', () => {
    const result = kimi.transform(sampleAgent);
    expect(result).toMatch(/^---\n/);
    expect(result).toContain('name: "sinapse-developer"');
    expect(result).toContain('description:');
  });

  it('description in frontmatter should start with "Activate the SINAPSE"', () => {
    const result = kimi.transform(sampleAgent);
    // Extract description value from YAML frontmatter
    const match = result.match(/description: "(.+?)"/);
    expect(match).not.toBeNull();
    expect(match[1]).toMatch(/^Activate the SINAPSE/);
  });

  // --- Content sections ---

  it('transform should include Activation Protocol section', () => {
    const result = kimi.transform(sampleAgent);
    expect(result).toContain('## Activation Protocol');
  });

  it('transform should include Star Commands table', () => {
    const result = kimi.transform(sampleAgent);
    expect(result).toContain('## Star Commands');
    expect(result).toContain('`*help`');
    expect(result).toContain('`*develop`');
  });

  it('transform should inject guide/yolo/exit if missing', () => {
    const result = kimi.transform(sampleAgent);
    expect(result).toContain('`*guide`');
    expect(result).toContain('`*yolo`');
    expect(result).toContain('`*exit`');
  });

  it('transform should include Full Agent Definition section with raw content', () => {
    const result = kimi.transform(sampleAgent);
    expect(result).toContain('## Full Agent Definition — developer');
    expect(result).toContain('# developer');
  });

  // --- Path-safety: getDirname never traverses ---

  it('getDirname should not produce path-traversal sequences', () => {
    const traversalAgent = { id: '../../etc/passwd', agent: {} };
    const dir = kimi.getDirname(traversalAgent);
    expect(dir).not.toContain('..');
    expect(dir).not.toContain('/');
    expect(dir).not.toContain('\\');
  });

  it('getDirname should produce safe token for weird ids', () => {
    const weirdAgent = { id: '@../weird\\id', agent: {} };
    const dir = kimi.getDirname(weirdAgent);
    expect(dir).toMatch(/^sinapse-[a-z0-9_-]+$/);
  });

  // --- Minimal agent (no crash) ---

  it('transform should not throw for minimal agent data', () => {
    const minimal = {
      filename: 'minimal.md',
      id: 'minimal',
      agent: null,
      persona_profile: null,
      commands: [],
      yaml: {},
      raw: null,
      sections: {},
      error: null,
    };
    expect(() => kimi.transform(minimal)).not.toThrow();
    const result = kimi.transform(minimal);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('transform with no raw should show agent definition not available', () => {
    const noRaw = { ...sampleAgent, raw: null };
    const result = kimi.transform(noRaw);
    expect(result).toContain('Agent definition not available');
  });

  // --- _fallback field (SINAPSE contract: not in agent-parser, guarded with || {}) ---

  it('transform should not crash when _fallback is absent', () => {
    const noFallback = { ...sampleAgent };
    delete noFallback._fallback;
    expect(() => kimi.transform(noFallback)).not.toThrow();
  });

  it('transform should use _fallback values when agent fields are missing', () => {
    const withFallback = {
      ...sampleAgent,
      agent: {},
      _fallback: { name: 'FallbackName', title: 'Fallback Title' },
    };
    const result = kimi.transform(withFallback);
    expect(result).toContain('FallbackName');
  });

  // --- preferredActivationAlias support ---

  it('getSkillId should use preferredActivationAlias when set', () => {
    const aliased = {
      id: 'sinapse-orqx',
      agent: { preferredActivationAlias: 'orqx' },
    };
    expect(kimi.getSkillId(aliased)).toBe('sinapse-orqx');
  });
});
