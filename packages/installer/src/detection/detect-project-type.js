const fs = require('fs');
const path = require('path');

/**
 * Detects the type of project in the current directory
 *
 * @param {string} targetDir - Directory to analyze (defaults to process.cwd())
 * @returns {string} 'GREENFIELD' | 'BROWNFIELD' | 'EXISTING_SINAPSE' | 'UNKNOWN'
 */
function detectProjectType(targetDir = process.cwd()) {
  return detectProjectTypeExtended(targetDir).type;
}

/**
 * Enhanced project detection with tech stack, maturity score, and recommendations.
 *
 * @param {string} targetDir - Directory to analyze (defaults to process.cwd())
 * @returns {{ type: string, techStack: object, maturityScore: number, recommendations: string[] }}
 */
function detectProjectTypeExtended(targetDir = process.cwd()) {
  if (!targetDir || typeof targetDir !== 'string') {
    throw new Error('Failed to detect project type: Invalid targetDir parameter: must be a non-empty string');
  }

  const normalizedDir = path.resolve(targetDir);

  if (!fs.existsSync(normalizedDir)) {
    throw new Error(`Failed to detect project type: Directory does not exist: ${normalizedDir}`);
  }

  try {
    const type = _detectType(normalizedDir);
    const techStack = type === 'GREENFIELD' ? _emptyStack() : _detectTechStack(normalizedDir);
    const maturityScore = type === 'GREENFIELD' ? 0 : _calcMaturity(normalizedDir);
    const recommendations = _buildRecommendations(type, techStack, maturityScore, normalizedDir);

    return { type, techStack, maturityScore, recommendations };
  } catch (error) {
    if (error.message.startsWith('Failed to detect project type')) throw error;
    console.error(`[detect-project-type] Error detecting project type in '${targetDir}': ${error.message}`);
    throw new Error(`Failed to detect project type: ${error.message}`);
  }
}

/** Core type classification (original logic). */
function _detectType(dir) {
  if (fs.existsSync(path.join(dir, '.sinapse-ai'))) return 'EXISTING_SINAPSE';

  const dirContents = fs.readdirSync(dir);
  if (dirContents.length === 0) return 'GREENFIELD';

  const hasPackageJson = fs.existsSync(path.join(dir, 'package.json'));
  const hasGit = fs.existsSync(path.join(dir, '.git'));
  if (hasPackageJson || hasGit) return 'BROWNFIELD';

  return 'UNKNOWN';
}

function _emptyStack() {
  return { framework: null, language: null, database: null, testing: null, ci: null, containerized: false };
}

/** Detect tech stack from project files and package.json deps. */
function _detectTechStack(dir) {
  const stack = _emptyStack();
  const deps = _readDeps(dir);

  // Framework detection (priority order)
  const frameworkMap = [
    ['next', 'next'], ['nuxt', 'nuxt'], ['@angular/core', 'angular'],
    ['svelte', 'svelte'], ['vue', 'vue'], ['react', 'react'],
    ['@nestjs/core', 'nest'], ['fastify', 'fastify'], ['express', 'express'],
  ];
  for (const [pkg, name] of frameworkMap) {
    if (deps.has(pkg)) { stack.framework = name; break; }
  }

  // Language
  stack.language = fs.existsSync(path.join(dir, 'tsconfig.json')) ? 'typescript' : 'javascript';

  // Database
  const dbMap = [['supabase', 'supabase'], ['prisma', 'prisma'], ['drizzle-orm', 'drizzle']];
  for (const [pkg, name] of dbMap) {
    if (deps.has(pkg) || deps.has(`@${pkg}/client`)) { stack.database = name; break; }
  }
  if (!stack.database && fs.existsSync(path.join(dir, 'supabase'))) stack.database = 'supabase';
  if (!stack.database && fs.existsSync(path.join(dir, 'prisma'))) stack.database = 'prisma';
  if (!stack.database && _existsGlob(dir, 'drizzle.config')) stack.database = 'drizzle';

  // Testing
  const testMap = [['vitest', 'vitest'], ['jest', 'jest'], ['mocha', 'mocha'], ['ava', 'ava']];
  for (const [pkg, name] of testMap) {
    if (deps.has(pkg)) { stack.testing = name; break; }
  }
  if (!stack.testing) {
    if (_existsGlob(dir, 'vitest.config')) stack.testing = 'vitest';
    else if (_existsGlob(dir, 'jest.config')) stack.testing = 'jest';
  }

  // CI
  if (fs.existsSync(path.join(dir, '.github', 'workflows'))) stack.ci = 'github-actions';
  else if (fs.existsSync(path.join(dir, '.gitlab-ci.yml'))) stack.ci = 'gitlab-ci';
  else if (fs.existsSync(path.join(dir, '.circleci'))) stack.ci = 'circleci';

  // Containers
  stack.containerized = fs.existsSync(path.join(dir, 'Dockerfile'))
    || fs.existsSync(path.join(dir, 'docker-compose.yml'))
    || fs.existsSync(path.join(dir, 'docker-compose.yaml'));

  return stack;
}

/** Calculate maturity score (0-10). */
function _calcMaturity(dir) {
  let score = 0;
  const has = (p) => fs.existsSync(path.join(dir, p));

  // Tests (+2)
  if (has('tests') || has('test') || has('__tests__') || has('src/__tests__')) score += 2;
  // CI/CD (+2)
  if (has('.github/workflows') || has('.gitlab-ci.yml') || has('.circleci')) score += 2;
  // Env example (+1)
  if (has('.env.example') || has('.env.local.example')) score += 1;
  // README (+1)
  if (has('README.md') || has('readme.md')) score += 1;
  // Docs (+1)
  if (has('docs')) score += 1;

  // >50 files (+1)
  try {
    const count = _countFiles(dir, 0, 60);
    if (count > 50) score += 1;
  } catch { /* ignore */ }

  // >10 commits (+1)
  if (has('.git')) {
    try {
      const { execSync } = require('child_process');
      const out = execSync('git rev-list --count HEAD', { cwd: dir, timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'] });
      if (parseInt(out.toString().trim(), 10) > 10) score += 1;
    } catch { /* ignore — no git or shallow clone */ }
  }

  // Branch protection (+1) — check via GitHub API marker or CODEOWNERS
  if (has('CODEOWNERS') || has('.github/CODEOWNERS')) score += 1;

  return Math.min(score, 10);
}

/** Build actionable recommendations based on gaps. */
function _buildRecommendations(type, stack, maturity, dir) {
  if (type === 'GREENFIELD') return ['Initialize project with SINAPSE scaffolding'];
  const recs = [];
  const has = (p) => fs.existsSync(path.join(dir, p));

  if (stack.database === 'supabase') recs.push('Add RLS policies to Supabase tables');
  if (!stack.testing) recs.push('Add a testing framework (Jest or Vitest recommended)');
  if (!stack.ci) recs.push('Set up CI/CD with GitHub Actions');
  if (!has('.env.example') && !has('.env.local.example')) recs.push('Create .env.example with placeholder values');
  if (!has('README.md') && !has('readme.md')) recs.push('Add a README.md');
  if (!has('docs')) recs.push('Create a docs/ directory for project documentation');
  if (!has('CODEOWNERS') && !has('.github/CODEOWNERS')) recs.push('Set up CODEOWNERS for branch protection');
  if (stack.language === 'javascript' && !has('tsconfig.json')) recs.push('Consider migrating to TypeScript');

  return recs;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Read combined deps + devDeps from package.json as a Set. */
function _readDeps(dir) {
  const pkgPath = path.join(dir, 'package.json');
  if (!fs.existsSync(pkgPath)) return new Set();
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return new Set([...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]);
  } catch { return new Set(); }
}

/** Check if a config file exists with common extensions. */
function _existsGlob(dir, baseName) {
  return ['.js', '.ts', '.mjs', '.cjs', '.json', '.yaml', '.yml', ''].some(
    (ext) => fs.existsSync(path.join(dir, `${baseName}${ext}`)),
  );
}

/** Recursively count files up to a limit (early exit). */
function _countFiles(dir, current, limit) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    current += 1;
    if (current > limit) return current;
    if (entry.isDirectory()) current = _countFiles(path.join(dir, entry.name), current, limit);
    if (current > limit) return current;
  }
  return current;
}

module.exports = { detectProjectType, detectProjectTypeExtended };
