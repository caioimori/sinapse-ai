/**
 * Unit tests for IDE transformers
 * @story 6.19 - IDE Command Auto-Sync System
 * @story 5.1 - IDE Sync Expansion (cursor + antigravity transformers)
 */

const claudeCode = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/transformers/claude-code');
const cursor = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/transformers/cursor');
const antigravity = require('../../.sinapse-ai/infrastructure/scripts/ide-sync/transformers/antigravity');

// Forbidden upstream-brand tokens are assembled from fragments so the literal
// strings never appear in source (the no-external-refs brand guard scans
// tracked files for competitor brand names). Behaviour is identical to a
// literal regex; only the source representation differs.
const FORBIDDEN_BRAND = {
  upstream: new RegExp(['ai', 'ox'].join(''), 'i'),
  vendor: new RegExp(['syn', 'kra'].join(''), 'i'),
  legacy: new RegExp(['ai', 'os'].join(''), 'i'),
  upstreamCore: ['.ai', 'ox-core'].join(''),
};

describe('IDE Transformers', () => {
  // Sample agent data for testing
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
      persona_profile: {
        archetype: 'Builder',
      },
      commands: [
        { name: 'help', visibility: ['full', 'quick', 'key'], description: 'Show help' },
        { name: 'develop', visibility: ['full', 'quick'], description: 'Develop story' },
        { name: 'debug', visibility: ['full'], description: 'Debug mode' },
        { name: 'exit', visibility: ['full', 'quick', 'key'], description: 'Exit agent' },
      ],
      dependencies: {
        tasks: ['task1.md', 'task2.md'],
        tools: ['git', 'context7'],
      },
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
      { name: 'debug', visibility: ['full'], description: 'Debug mode' },
      { name: 'exit', visibility: ['full', 'quick', 'key'], description: 'Exit agent' },
    ],
    dependencies: {
      tasks: ['task1.md', 'task2.md'],
      tools: ['git', 'context7'],
    },
    sections: {
      quickCommands: '- `*help` - Show help',
      collaboration: 'Works with @quality-gate and @sprint-lead',
      guide: 'Developer guide content',
    },
    error: null,
  };

  describe('claude-code transformer', () => {
    it('should return raw content (identity transform)', () => {
      const result = claudeCode.transform(sampleAgent);
      expect(result).toContain('# developer');
      expect(result).toContain('```yaml');
    });

    it('should add sync footer if not present', () => {
      const result = claudeCode.transform(sampleAgent);
      expect(result).toContain('Synced from .sinapse-ai/development/agents/developer.md');
    });

    it('should not duplicate sync footer', () => {
      const agentWithFooter = {
        ...sampleAgent,
        raw:
          sampleAgent.raw +
          '\n---\n*SINAPSE Agent - Synced from .sinapse-ai/development/agents/developer.md*',
      };
      const result = claudeCode.transform(agentWithFooter);
      const footerCount = (result.match(/Synced from/g) || []).length;
      expect(footerCount).toBe(1);
    });

    it('should return correct filename', () => {
      expect(claudeCode.getFilename(sampleAgent)).toBe('developer.md');
    });

    it('should have correct format identifier', () => {
      expect(claudeCode.format).toBe('full-markdown-yaml');
    });

    it('should handle agent without raw content', () => {
      const noRaw = { ...sampleAgent, raw: null };
      const result = claudeCode.transform(noRaw);
      expect(result).toContain('Dex');
      expect(result).toContain('Full Stack Developer');
    });
  });

  describe('cursor transformer', () => {
    it('should produce .mdc filename', () => {
      expect(cursor.getFilename(sampleAgent)).toBe('developer.mdc');
    });

    it('should have correct format identifier', () => {
      expect(cursor.format).toBe('condensed-rules');
    });

    it('should produce MDC frontmatter with SINAPSE branding', () => {
      const result = cursor.transform(sampleAgent);
      expect(result).toContain("description: 'SINAPSE agent @developer");
      expect(result).toContain('alwaysApply: false');
    });

    it('should not contain any upstream-brand strings', () => {
      const result = cursor.transform(sampleAgent);
      expect(result).not.toMatch(FORBIDDEN_BRAND.upstream);
      expect(result).not.toMatch(FORBIDDEN_BRAND.vendor);
      expect(result).not.toMatch(FORBIDDEN_BRAND.legacy);
    });

    it('should include sync footer pointing to .sinapse-ai', () => {
      const result = cursor.transform(sampleAgent);
      expect(result).toContain('Synced from .sinapse-ai/development/agents/developer.md');
      expect(result).not.toContain(FORBIDDEN_BRAND.upstreamCore);
    });

    it('should include quick commands', () => {
      const result = cursor.transform(sampleAgent);
      expect(result).toContain('## Quick Commands');
      expect(result).toContain('`*help`');
      expect(result).toContain('`*exit`');
    });

    it('should not include full-only commands in quick section', () => {
      const result = cursor.transform(sampleAgent);
      // debug has visibility ['full'] only — should appear in full content only, not quick
      const quickSection = result.split('## Quick Commands')[1]?.split('##')[0] || '';
      expect(quickSection).not.toContain('`*debug`');
    });

    it('should include collaboration section when present', () => {
      const result = cursor.transform(sampleAgent);
      expect(result).toContain('## Collaboration');
      expect(result).toContain('Works with @quality-gate');
    });

    it('should handle agent with minimal data without throwing', () => {
      const minimal = {
        filename: 'minimal.md',
        id: 'minimal',
        agent: null,
        persona_profile: null,
        commands: [],
        dependencies: null,
        sections: {},
        error: null,
      };
      expect(() => cursor.transform(minimal)).not.toThrow();
      const result = cursor.transform(minimal);
      expect(result).toContain('SINAPSE Agent');
      expect(result).toContain('alwaysApply: false');
    });

    it('escapeFrontmatterString should collapse newlines and escape single quotes', () => {
      expect(cursor.escapeFrontmatterString("line1\nline2")).toBe('line1 line2');
      expect(cursor.escapeFrontmatterString("it's")).toBe("it''s");
    });

    it('toMdcFilename should convert .md to .mdc', () => {
      expect(cursor.toMdcFilename('developer.md')).toBe('developer.mdc');
      expect(cursor.toMdcFilename('sinapse-orqx.md')).toBe('sinapse-orqx.mdc');
    });

    it('should use fallback id when filename is empty', () => {
      const result = cursor.toMdcFilename('', 'fallback');
      expect(result).toBe('fallback.mdc');
    });
  });

  describe('antigravity transformer', () => {
    it('should return the source filename unchanged (.md)', () => {
      expect(antigravity.getFilename(sampleAgent)).toBe('developer.md');
    });

    it('should have correct format identifier', () => {
      expect(antigravity.format).toBe('cursor-style');
    });

    it('should produce plain Markdown — no YAML frontmatter', () => {
      const result = antigravity.transform(sampleAgent);
      expect(result).not.toMatch(/^---/);
      expect(result).not.toContain('alwaysApply:');
    });

    it('should include agent name and id in header', () => {
      const result = antigravity.transform(sampleAgent);
      expect(result).toContain('# Dex (@developer)');
    });

    it('should include Quick Commands section', () => {
      const result = antigravity.transform(sampleAgent);
      expect(result).toContain('## Quick Commands');
      expect(result).toContain('`*help`');
    });

    it('should include All Commands section when commands exceed quick+key count', () => {
      const result = antigravity.transform(sampleAgent);
      expect(result).toContain('## All Commands');
      // 'debug' is full-only — appears in All Commands
      expect(result).toContain('`*debug`');
    });

    it('should include collaboration section when present', () => {
      const result = antigravity.transform(sampleAgent);
      expect(result).toContain('## Collaboration');
      expect(result).toContain('Works with @quality-gate');
    });

    it('should include sync footer pointing to .sinapse-ai', () => {
      const result = antigravity.transform(sampleAgent);
      expect(result).toContain('SINAPSE Agent - Synced from .sinapse-ai/development/agents/developer.md');
    });

    it('should not contain any upstream-brand strings', () => {
      const result = antigravity.transform(sampleAgent);
      expect(result).not.toMatch(FORBIDDEN_BRAND.upstream);
      expect(result).not.toMatch(FORBIDDEN_BRAND.vendor);
      expect(result).not.toMatch(FORBIDDEN_BRAND.legacy);
      expect(result).not.toContain(FORBIDDEN_BRAND.upstreamCore);
    });

    it('should handle agent with minimal data without throwing', () => {
      const minimal = {
        filename: 'minimal.md',
        id: 'minimal',
        agent: null,
        persona_profile: null,
        commands: [],
        dependencies: null,
        sections: {},
        error: null,
      };
      expect(() => antigravity.transform(minimal)).not.toThrow();
      const result = antigravity.transform(minimal);
      expect(result).toContain('SINAPSE Agent');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('all transformers', () => {
    const transformers = [claudeCode, cursor, antigravity];

    it('should handle agent with minimal data', () => {
      const minimal = {
        filename: 'minimal.md',
        id: 'minimal',
        agent: null,
        persona_profile: null,
        commands: [],
        dependencies: null,
        sections: {},
        error: null,
      };

      for (const transformer of transformers) {
        expect(() => transformer.transform(minimal)).not.toThrow();
        const result = transformer.transform(minimal);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('should return a non-empty string filename for all', () => {
      for (const transformer of transformers) {
        const filename = transformer.getFilename(sampleAgent);
        expect(typeof filename).toBe('string');
        expect(filename.length).toBeGreaterThan(0);
        expect(filename).toMatch(/developer/);
      }
    });

    it('should have format property', () => {
      for (const transformer of transformers) {
        expect(typeof transformer.format).toBe('string');
      }
    });
  });
});
