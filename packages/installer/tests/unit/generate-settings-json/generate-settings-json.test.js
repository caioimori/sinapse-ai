'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  generate,
  validateBoundaryPath,
  readBoundaryConfig,
  expandProtectedPaths,
  expandExceptionPaths,
  generatePermissions,
  writeSettingsJson,
} = require('../../../../../.sinapse-ai/infrastructure/scripts/generate-settings-json');

function createTempProject(boundary, existingSettings) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-settings-'));

  // Create core-config.yaml with boundary section
  const sinapseCoreDir = path.join(tmpDir, '.sinapse-ai');
  fs.mkdirSync(sinapseCoreDir, { recursive: true });

  const yamlContent = [
    'boundary:',
    `  frameworkProtection: ${boundary.frameworkProtection}`,
    '  protected:',
    ...boundary.protected.map(p => `    - ${p}`),
    '  exceptions:',
    ...boundary.exceptions.map(p => `    - ${p}`),
  ].join('\n') + '\n';

  fs.writeFileSync(path.join(tmpDir, '.sinapse-ai', 'core-config.yaml'), yamlContent, 'utf8');

  // Create directory structure for expansion tests
  if (boundary.protected.includes('.sinapse-ai/core/**')) {
    const coreDir = path.join(tmpDir, '.sinapse-ai', 'core');
    fs.mkdirSync(coreDir, { recursive: true });
    fs.mkdirSync(path.join(coreDir, 'utils'), { recursive: true });
    fs.mkdirSync(path.join(coreDir, 'events'), { recursive: true });
    fs.writeFileSync(path.join(coreDir, 'index.js'), '', 'utf8');
  }

  // Create .claude directory and optionally existing settings
  const claudeDir = path.join(tmpDir, '.claude');
  fs.mkdirSync(claudeDir, { recursive: true });

  if (existingSettings) {
    fs.writeFileSync(
      path.join(claudeDir, 'settings.json'),
      JSON.stringify(existingSettings, null, 2) + '\n',
      'utf8',
    );
  }

  return tmpDir;
}

function cleanupTempProject(tmpDir) {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

describe('generate-settings-json', () => {
  describe('readBoundaryConfig', () => {
    test('reads boundary config from core-config.yaml', () => {
      const tmpDir = createTempProject({
        frameworkProtection: true,
        protected: ['.sinapse-ai/core/**', 'bin/sinapse.js'],
        exceptions: ['.sinapse-ai/data/**'],
      });

      try {
        const config = readBoundaryConfig(tmpDir);

        expect(config.frameworkProtection).toBe(true);
        expect(config.protected).toContain('.sinapse-ai/core/**');
        expect(config.protected).toContain('bin/sinapse.js');
        expect(config.exceptions).toContain('.sinapse-ai/data/**');
      } finally {
        cleanupTempProject(tmpDir);
      }
    });

    test('throws when core-config.yaml not found', () => {
      expect(() => readBoundaryConfig('/nonexistent/path')).toThrow('core-config.yaml not found');
    });

    test('rejects path traversal in protected paths', () => {
      const tmpDir = createTempProject({
        frameworkProtection: true,
        protected: ['../../etc/passwd'],
        exceptions: [],
      });

      try {
        expect(() => readBoundaryConfig(tmpDir)).toThrow('Path traversal detected');
      } finally {
        cleanupTempProject(tmpDir);
      }
    });

    test('rejects absolute paths in boundary config', () => {
      const tmpDir = createTempProject({
        frameworkProtection: true,
        protected: ['/etc/passwd'],
        exceptions: [],
      });

      try {
        expect(() => readBoundaryConfig(tmpDir)).toThrow('Absolute path not allowed');
      } finally {
        cleanupTempProject(tmpDir);
      }
    });
  });

  describe('generatePermissions — frameworkProtection: true', () => {
    test('generates deny rules covering all protected paths', () => {
      const tmpDir = createTempProject({
        frameworkProtection: true,
        protected: ['.sinapse-ai/core/**', '.sinapse-ai/infrastructure/**', 'bin/sinapse.js'],
        exceptions: ['.sinapse-ai/data/**'],
      });

      // Create infrastructure dir (no expansion for non-core paths)
      fs.mkdirSync(path.join(tmpDir, '.sinapse-ai', 'infrastructure'), { recursive: true });

      try {
        const boundary = readBoundaryConfig(tmpDir);
        const permissions = generatePermissions(boundary, tmpDir);

        // Should have deny rules for core subdirs (events/**, utils/**, index.js) + infrastructure/** + bin/sinapse.js
        expect(permissions.deny.length).toBeGreaterThan(0);

        // Core expansion: events/**, utils/**, index.js → 6 deny rules (3 paths x 2 tools)
        expect(permissions.deny).toContain('Edit(.sinapse-ai/core/events/**)');
        expect(permissions.deny).toContain('Write(.sinapse-ai/core/events/**)');
        expect(permissions.deny).toContain('Edit(.sinapse-ai/core/utils/**)');
        expect(permissions.deny).toContain('Write(.sinapse-ai/core/utils/**)');
        expect(permissions.deny).toContain('Edit(.sinapse-ai/core/index.js)');
        expect(permissions.deny).toContain('Write(.sinapse-ai/core/index.js)');

        // Non-core paths stay as globs
        expect(permissions.deny).toContain('Edit(.sinapse-ai/infrastructure/**)');
        expect(permissions.deny).toContain('Write(.sinapse-ai/infrastructure/**)');
        expect(permissions.deny).toContain('Edit(bin/sinapse.js)');
        expect(permissions.deny).toContain('Write(bin/sinapse.js)');

        // Allow rules from exceptions
        expect(permissions.allow).toContain('Edit(.sinapse-ai/data/**)');
        expect(permissions.allow).toContain('Write(.sinapse-ai/data/**)');
        expect(permissions.allow).toContain('Read(.sinapse-ai/**)');
      } finally {
        cleanupTempProject(tmpDir);
      }
    });

    test('all 9 protected paths from core-config produce deny rules', () => {
      const projectRoot = path.resolve(__dirname, '../../../../..');
      const boundary = readBoundaryConfig(projectRoot);
      // Force frameworkProtection: true for this test (core-config may have it disabled for contributor mode)
      boundary.frameworkProtection = true;
      const permissions = generatePermissions(boundary, projectRoot);

      // Verify all 9 config paths are covered
      const protectedRoots = [
        '.sinapse-ai/core/',
        '.sinapse-ai/development/tasks/',
        '.sinapse-ai/development/templates/',
        '.sinapse-ai/development/checklists/',
        '.sinapse-ai/development/workflows/',
        '.sinapse-ai/infrastructure/',
        '.sinapse-ai/constitution.md',
        'bin/sinapse.js',
        'bin/sinapse-init.js',
      ];

      for (const root of protectedRoots) {
        const hasDenyRule = permissions.deny.some(r => r.includes(root));
        expect(hasDenyRule).toBe(true);
      }

      // Verify deny rules use only Edit and Write (no MultiEdit)
      for (const rule of permissions.deny) {
        expect(rule).toMatch(/^(Edit|Write)\(/);
      }
    });
  });

  describe('generatePermissions — frameworkProtection: false', () => {
    test('produces no boundary deny rules', () => {
      const boundary = {
        frameworkProtection: false,
        protected: ['.sinapse-ai/core/**', '.sinapse-ai/infrastructure/**'],
        exceptions: ['.sinapse-ai/data/**'],
      };

      const permissions = generatePermissions(boundary, '/tmp');

      expect(permissions.deny).toEqual([]);
      expect(permissions.allow).toEqual([]);
    });
  });

  describe('idempotency', () => {
    test('running generator twice produces identical output', () => {
      const tmpDir = createTempProject({
        frameworkProtection: true,
        protected: ['.sinapse-ai/core/**', 'bin/sinapse.js'],
        exceptions: ['.sinapse-ai/data/**'],
      });

      try {
        // First run
        generate(tmpDir);
        const firstRun = fs.readFileSync(path.join(tmpDir, '.claude', 'settings.json'), 'utf8');

        // Second run
        generate(tmpDir);
        const secondRun = fs.readFileSync(path.join(tmpDir, '.claude', 'settings.json'), 'utf8');

        expect(firstRun).toBe(secondRun);
      } finally {
        cleanupTempProject(tmpDir);
      }
    });

    test('JSON output is valid and parseable', () => {
      const tmpDir = createTempProject({
        frameworkProtection: true,
        protected: ['.sinapse-ai/core/**'],
        exceptions: ['.sinapse-ai/data/**'],
      });

      try {
        generate(tmpDir);
        const content = fs.readFileSync(path.join(tmpDir, '.claude', 'settings.json'), 'utf8');
        const parsed = JSON.parse(content);

        expect(parsed).toHaveProperty('permissions');
        expect(parsed.permissions).toHaveProperty('deny');
        expect(parsed.permissions).toHaveProperty('allow');
        expect(Array.isArray(parsed.permissions.deny)).toBe(true);
        expect(Array.isArray(parsed.permissions.allow)).toBe(true);
      } finally {
        cleanupTempProject(tmpDir);
      }
    });
  });

  describe('section preservation', () => {
    test('preserves user-set language key after generator run', () => {
      const tmpDir = createTempProject(
        {
          frameworkProtection: true,
          protected: ['bin/sinapse.js'],
          exceptions: [],
        },
        { language: 'pt', customSetting: true },
      );

      try {
        generate(tmpDir);
        const content = fs.readFileSync(path.join(tmpDir, '.claude', 'settings.json'), 'utf8');
        const parsed = JSON.parse(content);

        expect(parsed.language).toBe('pt');
        expect(parsed.customSetting).toBe(true);
        expect(parsed.permissions).toBeDefined();
        expect(parsed.permissions.deny.length).toBeGreaterThan(0);
      } finally {
        cleanupTempProject(tmpDir);
      }
    });

    test('frameworkProtection false preserves user settings and removes permissions', () => {
      const tmpDir = createTempProject(
        {
          frameworkProtection: false,
          protected: ['bin/sinapse.js'],
          exceptions: [],
        },
        { language: 'pt', permissions: { deny: ['old-rule'], allow: [] } },
      );

      try {
        generate(tmpDir);
        const content = fs.readFileSync(path.join(tmpDir, '.claude', 'settings.json'), 'utf8');
        const parsed = JSON.parse(content);

        expect(parsed.language).toBe('pt');
        expect(parsed.permissions).toBeUndefined();
      } finally {
        cleanupTempProject(tmpDir);
      }
    });
  });

  describe('CLI entry point', () => {
    test('module exports required functions', () => {
      expect(typeof generate).toBe('function');
      expect(typeof readBoundaryConfig).toBe('function');
      expect(typeof expandProtectedPaths).toBe('function');
      expect(typeof expandExceptionPaths).toBe('function');
      expect(typeof generatePermissions).toBe('function');
      expect(typeof writeSettingsJson).toBe('function');
    });
  });
});

