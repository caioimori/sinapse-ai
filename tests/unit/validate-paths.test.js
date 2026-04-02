'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const { validatePaths } = require('../../.sinapse-ai/infrastructure/scripts/validate-paths');

describe('Path Validator', () => {
  let tmpRoot;
  let skillsDir;

  function write(file, content) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content, 'utf8');
  }

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-path-validate-'));
    skillsDir = path.join(tmpRoot, '.codex', 'skills');
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('passes with relative canonical paths', () => {
    write(path.join(tmpRoot, 'AGENTS.md'), '# Agents\n');
    write(path.join(tmpRoot, '.sinapse-ai', 'product', 'templates', 'ide-rules', 'codex-rules.md'), '# codex\n');
    write(
      path.join(skillsDir, 'sinapse-dev', 'SKILL.md'),
      [
        '# Skill',
        'Load .sinapse-ai/development/agents/developer.md',
        'Run node .sinapse-ai/development/scripts/generate-greeting.js dev',
      ].join('\n'),
    );

    const result = validatePaths({
      projectRoot: tmpRoot,
      skillsDir,
      requiredFiles: [
        path.join(tmpRoot, 'AGENTS.md'),
        path.join(tmpRoot, '.sinapse-ai', 'product', 'templates', 'ide-rules', 'codex-rules.md'),
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('fails when absolute user path is found', () => {
    write(path.join(tmpRoot, 'AGENTS.md'), 'Path /Users/alan/Code/sinapse-ai');
    write(path.join(tmpRoot, '.sinapse-ai', 'product', 'templates', 'ide-rules', 'codex-rules.md'), '# codex\n');
    write(
      path.join(skillsDir, 'sinapse-dev', 'SKILL.md'),
      [
        '# Skill',
        'Load .sinapse-ai/development/agents/developer.md',
        'Run node .sinapse-ai/development/scripts/generate-greeting.js dev',
      ].join('\n'),
    );

    const result = validatePaths({
      projectRoot: tmpRoot,
      skillsDir,
      requiredFiles: [
        path.join(tmpRoot, 'AGENTS.md'),
        path.join(tmpRoot, '.sinapse-ai', 'product', 'templates', 'ide-rules', 'codex-rules.md'),
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.some(error => error.includes('forbidden absolute path'))).toBe(true);
  });

  it('fails when skill lacks canonical activation paths', () => {
    write(path.join(tmpRoot, 'AGENTS.md'), '# Agents\n');
    write(path.join(tmpRoot, '.sinapse-ai', 'product', 'templates', 'ide-rules', 'codex-rules.md'), '# codex\n');
    write(path.join(skillsDir, 'sinapse-dev', 'SKILL.md'), '# Skill\nUse dev\n');

    const result = validatePaths({
      projectRoot: tmpRoot,
      skillsDir,
      requiredFiles: [
        path.join(tmpRoot, 'AGENTS.md'),
        path.join(tmpRoot, '.sinapse-ai', 'product', 'templates', 'ide-rules', 'codex-rules.md'),
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.errors.some(error => error.includes('missing approved source path'))).toBe(true);
  });

  it('passes for squad-based skills when catalog config allows Codex expanded paths', () => {
    write(path.join(tmpRoot, 'AGENTS.md'), '# Agents\n');
    write(path.join(tmpRoot, '.sinapse-ai', 'product', 'templates', 'ide-rules', 'codex-rules.md'), '# codex\n');
    write(
      path.join(tmpRoot, '.codex', 'catalog.json'),
      JSON.stringify({
        version: 1,
        catalogMode: 'expanded',
        pathConventions: {
          allowedSourcePrefixes: ['squads/', '.codex/agents/'],
          allowedGreetingScriptPrefixes: ['.codex/scripts/generate-codex-greeting.js'],
          greetingOptionalSourcePrefixes: ['squads/'],
          requiredFallbackBySourcePrefix: {
            'squads/': '.codex/agents/',
          },
        },
      }),
      'utf8',
    );
    write(
      path.join(skillsDir, 'sinapse-brand', 'SKILL.md'),
      [
        '# Skill',
        'Load squads/squad-brand/agents/brand-orqx.md',
        'fallback: .codex/agents/brand-orqx.md',
      ].join('\n'),
    );

    const result = validatePaths({
      projectRoot: tmpRoot,
      skillsDir,
      requiredFiles: [
        path.join(tmpRoot, 'AGENTS.md'),
        path.join(tmpRoot, '.sinapse-ai', 'product', 'templates', 'ide-rules', 'codex-rules.md'),
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
