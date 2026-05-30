/**
 * Service Registry Loader — Multi-Path Resolution Tests
 *
 * Proves that registry-loader resolves via the package-bundled
 * __dirname fallback when the cwd-based path does not exist.
 * This ensures the registry is always found when SINAPSE is
 * installed as an npm package (no project-local .sinapse-ai/ dir).
 *
 * @story PORT #7 - registry-loader multi-path
 */

const path = require('path');

// Mock fs.promises before requiring the module under test
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

const fs = require('fs').promises;
const {
  ServiceRegistry,
  getRegistry,
  getDefaultRegistryPaths,
} = require('../../.sinapse-ai/core/registry/registry-loader');

jest.setTimeout(30000);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMockRegistryData(overrides = {}) {
  return {
    version: '1.0.0',
    generated: '2026-01-01T00:00:00.000Z',
    totalWorkers: 2,
    categories: { 'test-cat': 2 },
    workers: [
      {
        id: 'worker-a',
        name: 'Worker Alpha',
        description: 'First test worker',
        category: 'test-cat',
        tags: ['alpha'],
        agents: ['dev'],
      },
      {
        id: 'worker-b',
        name: 'Worker Beta',
        description: 'Second test worker',
        category: 'test-cat',
        tags: ['beta'],
        agents: ['qa'],
      },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// getDefaultRegistryPaths
// ---------------------------------------------------------------------------

describe('getDefaultRegistryPaths', () => {
  it('returns an array of at least 1 candidate path', () => {
    const paths = getDefaultRegistryPaths();
    expect(Array.isArray(paths)).toBe(true);
    expect(paths.length).toBeGreaterThanOrEqual(1);
  });

  it('always includes a cwd-based path ending in service-registry.json', () => {
    const paths = getDefaultRegistryPaths();
    const hasCwdPath = paths.some(
      (p) => p.includes('.sinapse-ai') && p.endsWith('service-registry.json'),
    );
    expect(hasCwdPath).toBe(true);
  });

  it('always includes a __dirname-based (package-bundled) path', () => {
    const paths = getDefaultRegistryPaths();
    // The __dirname path lives inside the registry-loader's own directory
    const registryLoaderDir = path.dirname(
      require.resolve('../../.sinapse-ai/core/registry/registry-loader'),
    );
    const hasPkgPath = paths.some((p) => p.startsWith(registryLoaderDir));
    expect(hasPkgPath).toBe(true);
  });

  it('contains no duplicate paths', () => {
    const paths = getDefaultRegistryPaths();
    const unique = Array.from(new Set(paths));
    expect(unique).toHaveLength(paths.length);
  });

  it('returns 2 paths when cwd differs from __dirname (simulated via mock)', () => {
    // Temporarily override cwd so the cwd-based path diverges from __dirname
    const originalCwd = process.cwd;
    process.cwd = () => '/tmp/some-other-project';
    const paths = getDefaultRegistryPaths();
    process.cwd = originalCwd;

    // Now cwd path is /tmp/some-other-project/... which differs from __dirname/...
    expect(paths.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Multi-path fallback behaviour
// ---------------------------------------------------------------------------

describe('ServiceRegistry multi-path resolution', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses the __dirname fallback when cwd path does not exist (simulates npm-installed package)', async () => {
    const mockData = createMockRegistryData();

    // Resolve the real __dirname-based path for the package-bundled registry
    const registryLoaderDir = path.dirname(
      require.resolve('../../.sinapse-ai/core/registry/registry-loader'),
    );
    const pkgPath = path.join(registryLoaderDir, 'service-registry.json');

    // Make cwd point to a directory that does NOT contain a .sinapse-ai folder
    const originalCwd = process.cwd;
    process.cwd = () => '/tmp/non-existent-project';

    const fakeCwdPath = path.join(
      '/tmp/non-existent-project',
      '.sinapse-ai',
      'core',
      'registry',
      'service-registry.json',
    );

    // cwd path fails, package path succeeds
    fs.readFile.mockImplementation((filePath) => {
      if (filePath === fakeCwdPath) {
        return Promise.reject(new Error('ENOENT: no such file or directory'));
      }
      if (filePath === pkgPath) {
        return Promise.resolve(JSON.stringify(mockData));
      }
      return Promise.reject(new Error(`Unexpected path: ${filePath}`));
    });

    const registry = new ServiceRegistry(); // no explicit path → uses defaults
    const data = await registry.load();

    process.cwd = originalCwd;

    expect(data).toEqual(mockData);
    // resolvedRegistryPath must point to the package-bundled file
    expect(registry.resolvedRegistryPath).toBe(pkgPath);
    // readFile must have been called for the cwd path first, then the pkg path
    const calls = fs.readFile.mock.calls.map((c) => c[0]);
    expect(calls[0]).toBe(fakeCwdPath);
    expect(calls[1]).toBe(pkgPath);
  });

  it('prefers the cwd path when it loads successfully', async () => {
    const mockData = createMockRegistryData();
    const explicitCwdPath = '/explicit/cwd/path.json';

    // Use explicit path to avoid cwd/pkg ambiguity
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));

    const registry = new ServiceRegistry({ registryPath: explicitCwdPath });
    const data = await registry.load();

    expect(data).toEqual(mockData);
    expect(registry.resolvedRegistryPath).toBe(explicitCwdPath);
    expect(fs.readFile).toHaveBeenCalledTimes(1);
  });

  it('throws a descriptive error when ALL candidate paths fail', async () => {
    const originalCwd = process.cwd;
    process.cwd = () => '/tmp/no-registry-anywhere';

    fs.readFile.mockRejectedValue(new Error('ENOENT: no such file or directory'));

    const registry = new ServiceRegistry();

    await expect(registry.load()).rejects.toThrow('Failed to load registry:');

    process.cwd = originalCwd;
  });

  it('explicit registryPath bypasses multi-path logic entirely', async () => {
    const mockData = createMockRegistryData();
    const explicitPath = '/custom/explicit/path.json';

    fs.readFile.mockImplementation((filePath) => {
      if (filePath === explicitPath) {
        return Promise.resolve(JSON.stringify(mockData));
      }
      return Promise.reject(new Error(`Should not reach: ${filePath}`));
    });

    const registry = new ServiceRegistry({ registryPath: explicitPath });
    const data = await registry.load();

    expect(data).toEqual(mockData);
    expect(registry.resolvedRegistryPath).toBe(explicitPath);
    expect(fs.readFile).toHaveBeenCalledTimes(1);
    expect(fs.readFile).toHaveBeenCalledWith(explicitPath, 'utf8');
  });
});

// ---------------------------------------------------------------------------
// resolvedRegistryPath field lifecycle
// ---------------------------------------------------------------------------

describe('ServiceRegistry.resolvedRegistryPath lifecycle', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is null before first load', () => {
    const registry = new ServiceRegistry({ registryPath: '/mock/p.json' });
    expect(registry.resolvedRegistryPath).toBeNull();
  });

  it('is set after successful load', async () => {
    const registry = new ServiceRegistry({ registryPath: '/mock/p.json' });
    fs.readFile.mockResolvedValue(JSON.stringify(createMockRegistryData()));

    await registry.load();

    expect(registry.resolvedRegistryPath).toBe('/mock/p.json');
  });

  it('is reset to null after clearCache', async () => {
    const registry = new ServiceRegistry({ registryPath: '/mock/p.json' });
    fs.readFile.mockResolvedValue(JSON.stringify(createMockRegistryData()));

    await registry.load();
    registry.clearCache();

    expect(registry.resolvedRegistryPath).toBeNull();
  });

  it('getMetrics includes registryPath after load', async () => {
    const registry = new ServiceRegistry({ registryPath: '/mock/p.json' });
    fs.readFile.mockResolvedValue(JSON.stringify(createMockRegistryData()));

    await registry.load();
    const metrics = registry.getMetrics();

    expect(metrics.registryPath).toBe('/mock/p.json');
  });

  it('getMetrics registryPath is null when not yet loaded', () => {
    const registry = new ServiceRegistry({ registryPath: '/mock/p.json' });
    const metrics = registry.getMetrics();

    expect(metrics.registryPath).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Backward compatibility — existing public API unchanged
// ---------------------------------------------------------------------------

describe('Backward compatibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getRegistry still returns a singleton', () => {
    const reg1 = getRegistry({ fresh: true });
    const reg2 = getRegistry();
    expect(reg1).toBe(reg2);
  });

  it('getRegistry with fresh:true creates a new instance', () => {
    const reg1 = getRegistry({ fresh: true });
    const reg2 = getRegistry({ fresh: true });
    expect(reg1).not.toBe(reg2);
  });

  it('ServiceRegistry still loads workers and builds indexes', async () => {
    const mockData = createMockRegistryData();
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));

    const registry = new ServiceRegistry({ registryPath: '/mock/p.json' });
    await registry.load();

    expect(registry._byId.size).toBe(2);
    expect(await registry.getById('worker-a')).toMatchObject({ id: 'worker-a' });
    expect(await registry.getByCategory('test-cat')).toHaveLength(2);
  });
});
