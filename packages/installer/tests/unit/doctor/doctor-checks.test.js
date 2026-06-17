/**
 * Unit Tests: Doctor Check Modules
 * Story INS-4.1: sinapse doctor rewrite
 * Story INS-4.8: 3 new checks (skills-count, commands-count, hooks-claude-count)
 *
 * Tests all 15 check modules individually with mocked filesystem.
 */

const path = require('path');
const fs = require('fs');

// Mock fs for controlled test scenarios
jest.mock('fs');

// Mock child_process — the git-hooks check reads core.hooksPath via execFileSync('git', ...)
jest.mock('child_process');
const { execFileSync } = require('child_process');

const nodeVersionCheck = require('../../../../../.sinapse-ai/core/doctor/checks/node-version');
const npmPackagesCheck = require('../../../../../.sinapse-ai/core/doctor/checks/npm-packages');
const settingsJsonCheck = require('../../../../../.sinapse-ai/core/doctor/checks/settings-json');
const rulesFilesCheck = require('../../../../../.sinapse-ai/core/doctor/checks/rules-files');
const agentMemoryCheck = require('../../../../../.sinapse-ai/core/doctor/checks/agent-memory');
const entityRegistryCheck = require('../../../../../.sinapse-ai/core/doctor/checks/entity-registry');
const gitHooksCheck = require('../../../../../.sinapse-ai/core/doctor/checks/git-hooks');
const coreConfigCheck = require('../../../../../.sinapse-ai/core/doctor/checks/core-config');
const claudeMdCheck = require('../../../../../.sinapse-ai/core/doctor/checks/claude-md');
const graphDashboardCheck = require('../../../../../.sinapse-ai/core/doctor/checks/graph-dashboard');
const codeIntelCheck = require('../../../../../.sinapse-ai/core/doctor/checks/code-intel');
const ideSyncCheck = require('../../../../../.sinapse-ai/core/doctor/checks/ide-sync');
const skillsCountCheck = require('../../../../../.sinapse-ai/core/doctor/checks/skills-count');
const commandsCountCheck = require('../../../../../.sinapse-ai/core/doctor/checks/commands-count');
const hooksClaudeCountCheck = require('../../../../../.sinapse-ai/core/doctor/checks/hooks-claude-count');
const { loadChecks } = require('../../../../../.sinapse-ai/core/doctor/checks');

const mockContext = {
  projectRoot: '/mock/project',
  frameworkRoot: '/mock/framework',
  options: { fix: false, json: false, dryRun: false, quiet: false },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('node-version check', () => {
  it('should PASS for current Node.js version (>=18)', async () => {
    const result = await nodeVersionCheck.run(mockContext);
    expect(result.check).toBe('node-version');
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('Node.js');
  });
});

describe('npm-packages check', () => {
  // Story 10.48 + v1.4.2: this check no longer treats a missing project-level
  // node_modules/ as a blocker. It validates that the deps DECLARED in
  // .sinapse-ai/package.json are *resolvable* via Node's resolver (which walks
  // parent + global node_modules). PASS unless a declared dep is unresolvable.

  it('should PASS when .sinapse-ai package has zero declared deps', async () => {
    // existsSync true everywhere → .sinapse-ai/package.json + node_modules present.
    // readFileSync auto-mock returns undefined → JSON.parse throws → caught →
    // falls through to PASS with totalDeps=0 and node_modules present.
    fs.existsSync.mockReturnValue(true);
    const result = await npmPackagesCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('.sinapse-ai deps complete');
  });

  it('should PASS (not FAIL) when there is no .sinapse-ai/package.json', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await npmPackagesCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('no .sinapse-ai/package.json');
    expect(result.fixCommand).toBeNull();
  });

  it('should FAIL when a declared .sinapse-ai dep is unresolvable', async () => {
    // .sinapse-ai/package.json present, declaring a dep that cannot resolve.
    fs.existsSync.mockImplementation((p) =>
      String(p).includes('package.json'),
    );
    fs.readFileSync.mockReturnValue(
      JSON.stringify({ dependencies: { '@sinapse/definitely-not-installed-xyz': '^1.0.0' } }),
    );
    const result = await npmPackagesCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
    expect(result.message).toContain('unresolvable');
    expect(result.fixCommand).toBe('cd .sinapse-ai && npm install --production');
  });
});

describe('settings-json check', () => {
  it('should PASS with valid settings and sufficient deny rules', async () => {
    fs.existsSync.mockReturnValue(true);
    const mockSettings = {
      permissions: {
        deny: new Array(50).fill('Edit(.sinapse-ai/core/)'),
        allow: ['Edit(docs/)'],
      },
    };
    const coreConfig = 'boundary:\n  protected:\n    - .sinapse-ai/core/**\n  exceptions:\n    - agents/MEMORY.md';
    fs.readFileSync.mockImplementation((p) => {
      if (p.includes('settings.json')) return JSON.stringify(mockSettings);
      if (p.includes('core-config')) return coreConfig;
      return '';
    });

    const result = await settingsJsonCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('50 rules');
  });

  it('should FAIL when settings.json not found', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await settingsJsonCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });

  it('should WARN when deny rules below threshold', async () => {
    fs.existsSync.mockReturnValue(true);
    const mockSettings = { permissions: { deny: ['one'], allow: [] } };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));

    const result = await settingsJsonCheck.run(mockContext);
    expect(result.status).toBe('WARN');
  });

  it('should WARN when boundary paths not covered by deny rules', async () => {
    fs.existsSync.mockReturnValue(true);
    const mockSettings = {
      permissions: {
        deny: new Array(50).fill('Edit(docs/)'),
        allow: [],
      },
    };
    const coreConfig = 'boundary:\n  protected:\n    - .sinapse-ai/core/**\n    - bin/sinapse.js\n  exceptions:\n    - test';
    fs.readFileSync.mockImplementation((p) => {
      if (p.includes('settings.json')) return JSON.stringify(mockSettings);
      if (p.includes('core-config')) return coreConfig;
      return '';
    });

    const result = await settingsJsonCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('boundary coverage');
  });
});

describe('rules-files check', () => {
  it('should PASS when all 7 rules files exist', async () => {
    fs.existsSync.mockReturnValue(true);
    const result = await rulesFilesCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('7');
  });

  it('should FAIL when rules directory missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await rulesFilesCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });

  it('should WARN when some rules missing', async () => {
    fs.existsSync.mockImplementation((p) => {
      // Directory exists
      if (p.endsWith('rules')) return true;
      // Most files exist except 2
      if (p.includes('agent-authority') || p.includes('workflow-execution')) return false;
      return true;
    });

    const result = await rulesFilesCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('Missing 2');
  });
});

describe('agent-memory check', () => {
  it('should PASS when all 10 MEMORY.md files exist', async () => {
    fs.existsSync.mockReturnValue(true);
    const result = await agentMemoryCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('10/10');
  });

  it('should WARN when some MEMORY.md files missing', async () => {
    fs.existsSync.mockImplementation((p) => {
      if (p.endsWith('agents')) return true;
      if (p.includes('analyst') || p.includes('ux')) return false;
      return true;
    });

    const result = await agentMemoryCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('8/10');
  });
});

describe('entity-registry check', () => {
  it('should PASS when registry exists and is fresh', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({ mtimeMs: Date.now() - 1000 });
    fs.readFileSync.mockReturnValue('line1\nline2\nline3');

    const result = await entityRegistryCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should FAIL when registry not found', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await entityRegistryCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });

  it('should WARN when registry is stale (>48h)', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({ mtimeMs: Date.now() - 72 * 60 * 60 * 1000 });
    fs.readFileSync.mockReturnValue('line1\nline2');

    const result = await entityRegistryCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('72h');
  });
});

describe('git-hooks check', () => {
  // E8-SECURITY: the check now reads core.hooksPath via git and validates the
  // managed `.sinapse-ai/git-hooks/` dir is populated (catches the inert-trap).
  it('should PASS when managed hooksPath is populated (pre-commit + pre-push)', async () => {
    execFileSync.mockReturnValue('.sinapse-ai/git-hooks\n');
    fs.existsSync.mockReturnValue(true); // dir + pre-commit + pre-push all present
    const result = await gitHooksCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('managed git guards active');
  });

  it('should FAIL when core.hooksPath is set but the dir is MISSING (inert trap)', async () => {
    execFileSync.mockReturnValue('.sinapse-ai/git-hooks\n');
    fs.existsSync.mockReturnValue(false); // dir missing -> guards inert
    const result = await gitHooksCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
    expect(result.message).toContain('MISSING');
  });

  it('should FAIL when hooksPath dir exists but has no pre-commit guard', async () => {
    execFileSync.mockReturnValue('.sinapse-ai/git-hooks\n');
    fs.existsSync.mockImplementation((p) => !String(p).endsWith('pre-commit')); // dir yes, pre-commit no
    const result = await gitHooksCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
    expect(result.message).toContain('NO pre-commit');
  });

  it('should WARN when pre-commit present but pre-push missing', async () => {
    execFileSync.mockReturnValue('.sinapse-ai/git-hooks\n');
    fs.existsSync.mockImplementation((p) => !String(p).endsWith('pre-push')); // dir + pre-commit yes
    const result = await gitHooksCheck.run(mockContext);
    expect(result.status).toBe('WARN');
  });

  it('should FAIL when no core.hooksPath and no .husky fallback', async () => {
    execFileSync.mockImplementation(() => { throw new Error('not a git repo'); });
    fs.existsSync.mockReturnValue(false);
    const result = await gitHooksCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });

  it('should WARN when husky present but core.hooksPath not consolidated', async () => {
    execFileSync.mockImplementation(() => { throw new Error('hooksPath unset'); });
    fs.existsSync.mockReturnValue(true); // .husky + expected hooks present
    const result = await gitHooksCheck.run(mockContext);
    expect(result.status).toBe('WARN');
  });
});

describe('core-config check', () => {
  it('should PASS when config has all required sections', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('boundary:\n  test: true\nproject:\n  name: test\nide:\n  sync: true');

    const result = await coreConfigCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should FAIL when config missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await coreConfigCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });

  it('should FAIL when missing required sections', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('project:\n  name: test');

    const result = await coreConfigCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
    expect(result.message).toContain('boundary');
  });
});

describe('claude-md check', () => {
  it('should PASS when all sections present', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(
      '## Constitution\n## Framework vs Project Boundary\n## Sistema de Agentes',
    );

    const result = await claudeMdCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should WARN when sections missing', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('## Constitution\nSome content');

    const result = await claudeMdCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('Missing sections');
  });
});

describe('graph-dashboard check', () => {
  it('should PASS when directory has .js files', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(['index.js', 'cli.js']);

    const result = await graphDashboardCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should WARN when directory missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await graphDashboardCheck.run(mockContext);
    expect(result.status).toBe('WARN');
  });
});

describe('code-intel check', () => {
  // The code-intel check does a real require() of index.js and triggers
  // provider auto-detection. Tests that need provider detection must use
  // the real projectRoot and real fs (jest.requireActual).
  const realFs = jest.requireActual('fs');
  const realProjectRoot = path.join(__dirname, '..', '..', '..', '..', '..');

  it('should return INFO when code-intel dir does not exist', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await codeIntelCheck.run(mockContext);
    expect(result.status).toBe('INFO');
  });

  it('should WARN when index.js missing but dir exists', async () => {
    fs.existsSync.mockImplementation((p) => {
      // Dir exists, but index.js does not
      if (p.includes('index.js')) return false;
      return true;
    });
    const result = await codeIntelCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('index.js not found');
  });

  it('should PASS with RegistryProvider when entity-registry exists', async () => {
    // Use real fs + real project root so require() resolves the actual module
    // and RegistryProvider can load the real entity-registry.yaml
    const realContext = {
      ...mockContext,
      projectRoot: realProjectRoot,
    };

    // Temporarily restore real fs for this test
    fs.existsSync.mockImplementation(realFs.existsSync);
    fs.readFileSync.mockImplementation(realFs.readFileSync);
    fs.statSync.mockImplementation(realFs.statSync);

    // Only run if entity-registry actually exists (skip in CI without registry)
    const registryPath = path.join(realProjectRoot, '.sinapse-ai', 'data', 'entity-registry.yaml');
    if (!realFs.existsSync(registryPath)) {
      return; // skip — no registry available
    }

    const result = await codeIntelCheck.run(realContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('RegistryProvider');
  });

  it('should WARN when provider detection fails (no valid registry)', async () => {
    // Use real project root so require() works, but mock registry as empty
    const realContext = {
      ...mockContext,
      projectRoot: realProjectRoot,
    };

    // Real existsSync for module resolution, mocked readFileSync for empty registry
    fs.existsSync.mockImplementation((p) => {
      if (p.includes('entity-registry.yaml')) return true;
      return realFs.existsSync(p);
    });
    fs.statSync.mockImplementation((p) => {
      if (p.includes('entity-registry.yaml')) return { mtimeMs: Date.now(), size: 10 };
      return realFs.statSync(p);
    });
    fs.readFileSync.mockImplementation((p, enc) => {
      if (typeof p === 'string' && p.includes('entity-registry.yaml')) {
        return 'metadata:\n  entityCount: 0';
      }
      return realFs.readFileSync(p, enc);
    });

    const result = await codeIntelCheck.run(realContext);
    // Without valid entities, provider won't be available → WARN or INFO
    expect(['WARN', 'INFO']).toContain(result.status);
  });
});

describe('ide-sync check', () => {
  it('should PASS when counts match', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockImplementation((p) => {
      if (p.includes('commands')) return ['dev.md', 'qa.md'];
      return ['dev.md', 'qa.md'];
    });

    const result = await ideSyncCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should WARN when IDE has fewer agents than expected (Audit 1 P1 DOC-1)', async () => {
    // Post-DOC-1 fix: WARN fires when IDE count < (framework + squad orqx).
    // Source dir has 5 framework agents; IDE has only 2 (missing 3 expected).
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockImplementation((p) => {
      if (p.includes('commands')) return ['dev.md', 'qa.md']; // 2 in IDE
      // Source agents dir — 5 framework agents (>= IDE count → expected gap)
      return ['dev.md', 'qa.md', 'pm.md', 'po.md', 'sm.md'];
    });

    const result = await ideSyncCheck.run(mockContext);
    expect(result.status).toBe('WARN');
  });
});

// === INS-4.8: New checks ===

describe('skills-count check', () => {
  // v1.4.2: .claude/skills/ is an OPTIONAL user-installed area, not shipped by
  // `npx sinapse-ai install`. The check never FAILs: it PASSes proportional to
  // however many skills the user installed (>=1), and reports INFO when the
  // directory is absent or empty.

  it('should PASS when skill directories with SKILL.md exist', async () => {
    fs.existsSync.mockReturnValue(true);
    const dirs = Array.from({ length: 8 }, (_, i) => ({
      name: `skill-${i}`,
      isDirectory: () => true,
      isFile: () => false,
    }));
    fs.readdirSync.mockReturnValue(dirs);

    const result = await skillsCountCheck.run(mockContext);
    expect(result.check).toBe('skills-count');
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('8');
  });

  it('should PASS even with a small number of installed skills', async () => {
    fs.existsSync.mockReturnValue(true);
    const dirs = Array.from({ length: 3 }, (_, i) => ({
      name: `skill-${i}`,
      isDirectory: () => true,
      isFile: () => false,
    }));
    fs.readdirSync.mockReturnValue(dirs);

    const result = await skillsCountCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('3');
  });

  it('should report INFO (not FAIL) when 0 skills found', async () => {
    // skills dir exists, but no subdir has a SKILL.md → count 0.
    fs.existsSync.mockImplementation((p) => !String(p).includes('SKILL.md'));
    const dirs = [{ name: 'empty', isDirectory: () => true, isFile: () => false }];
    fs.readdirSync.mockReturnValue(dirs);

    const result = await skillsCountCheck.run(mockContext);
    expect(result.status).toBe('INFO');
    expect(result.fixCommand).toBeNull();
  });

  it('should report INFO (not FAIL) when skills directory missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await skillsCountCheck.run(mockContext);
    expect(result.status).toBe('INFO');
  });
});

describe('commands-count check', () => {
  it('should PASS when >=20 command files', async () => {
    fs.existsSync.mockReturnValue(true);
    const files = Array.from({ length: 22 }, (_, i) => ({
      name: `cmd-${i}.md`,
      isDirectory: () => false,
      isFile: () => true,
    }));
    fs.readdirSync.mockReturnValue(files);

    const result = await commandsCountCheck.run(mockContext);
    expect(result.check).toBe('commands-count');
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('22');
  });

  it('should WARN when 12-19 command files', async () => {
    fs.existsSync.mockReturnValue(true);
    const files = Array.from({ length: 15 }, (_, i) => ({
      name: `cmd-${i}.md`,
      isDirectory: () => false,
      isFile: () => true,
    }));
    fs.readdirSync.mockReturnValue(files);

    const result = await commandsCountCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('15/20');
  });

  it('should FAIL when <12 command files', async () => {
    fs.existsSync.mockReturnValue(true);
    const files = Array.from({ length: 5 }, (_, i) => ({
      name: `cmd-${i}.md`,
      isDirectory: () => false,
      isFile: () => true,
    }));
    fs.readdirSync.mockReturnValue(files);

    const result = await commandsCountCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
    expect(result.message).toContain('5');
  });

  it('should FAIL when commands directory missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await commandsCountCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });
});

describe('hooks-claude-count check', () => {
  it('should PASS when >=2 hook files and registered', async () => {
    fs.existsSync.mockReturnValue(true);
    const hookFiles = [
      { name: 'enforce-git-push.cjs', isFile: () => true, isDirectory: () => false },
      { name: 'pre-commit-check.cjs', isFile: () => true, isDirectory: () => false },
    ];
    fs.readdirSync.mockReturnValue(hookFiles);
    const settingsLocal = {
      hooks: {
        PreToolUse: [{ command: 'node .claude/hooks/enforce-git-push.cjs' }],
        PostToolUse: [{ command: 'node .claude/hooks/pre-commit-check.cjs' }],
      },
    };
    fs.readFileSync.mockReturnValue(JSON.stringify(settingsLocal));

    const result = await hooksClaudeCountCheck.run(mockContext);
    expect(result.check).toBe('hooks-claude-count');
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('2');
  });

  it('should WARN when hooks present but not registered', async () => {
    fs.existsSync.mockImplementation((p) => {
      if (p.includes('settings.local.json')) return true;
      return true;
    });
    const hookFiles = [
      { name: 'hook-a.cjs', isFile: () => true, isDirectory: () => false },
      { name: 'hook-b.cjs', isFile: () => true, isDirectory: () => false },
    ];
    fs.readdirSync.mockReturnValue(hookFiles);
    fs.readFileSync.mockReturnValue(JSON.stringify({ hooks: {} }));

    const result = await hooksClaudeCountCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('not registered');
  });

  it('should WARN when <2 hook files', async () => {
    fs.existsSync.mockReturnValue(true);
    const hookFiles = [
      { name: 'single-hook.cjs', isFile: () => true, isDirectory: () => false },
    ];
    fs.readdirSync.mockReturnValue(hookFiles);
    fs.readFileSync.mockReturnValue(JSON.stringify({ hooks: {} }));

    const result = await hooksClaudeCountCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('1/2');
  });

  it('should FAIL when no hook files found', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([]);

    const result = await hooksClaudeCountCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });

  it('should FAIL when hooks directory missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await hooksClaudeCountCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });
});

// === INS-4.8: Registry and task validation ===

describe('check registry (INS-4.8)', () => {
  it('should load 15 checks total', () => {
    // loadChecks is the real function (not mocked) — verifies registration
    const checks = loadChecks();
    expect(checks).toHaveLength(16);
  });

  it('should include all 3 new checks', () => {
    const checks = loadChecks();
    const names = checks.map((c) => c.name);
    expect(names).toContain('skills-count');
    expect(names).toContain('commands-count');
    expect(names).toContain('hooks-claude-count');
  });
});

describe('health-check.yaml task (INS-4.8)', () => {
  it('should NOT have *doctor alias', () => {
    const realFs = jest.requireActual('fs');
    const yaml = realFs.readFileSync(
      path.join(__dirname, '..', '..', '..', '..', '..', '.sinapse-ai', 'development', 'tasks', 'health-check.yaml'),
      'utf8',
    );
    // Verify *doctor is not in the aliases list (only *hc should be)
    const aliasMatch = yaml.match(/aliases:\s*\n((?:\s+-\s+.*\n)*)/);
    expect(aliasMatch).toBeTruthy();
    expect(aliasMatch[1]).not.toContain('*doctor');
    expect(aliasMatch[1]).toContain('*hc');
  });

  it('should reference sinapse doctor --json in instructions', () => {
    const realFs = jest.requireActual('fs');
    const yaml = realFs.readFileSync(
      path.join(__dirname, '..', '..', '..', '..', '..', '.sinapse-ai', 'development', 'tasks', 'health-check.yaml'),
      'utf8',
    );
    expect(yaml).toContain('sinapse doctor --json');
    expect(yaml).toContain('npx sinapse-ai doctor --json');
  });

  it('should have governance_map with all 15 checks', () => {
    const realFs = jest.requireActual('fs');
    const yaml = realFs.readFileSync(
      path.join(__dirname, '..', '..', '..', '..', '..', '.sinapse-ai', 'development', 'tasks', 'health-check.yaml'),
      'utf8',
    );
    const expectedChecks = [
      'settings-json', 'rules-files', 'agent-memory', 'entity-registry',
      'git-hooks', 'core-config', 'claude-md', 'ide-sync', 'graph-dashboard',
      'code-intel', 'node-version', 'npm-packages', 'skills-count',
      'commands-count', 'hooks-claude-count',
    ];
    for (const check of expectedChecks) {
      expect(yaml).toContain(`${check}:`);
    }
  });
});

