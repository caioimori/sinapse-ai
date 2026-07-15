'use strict';

const fs = require('fs');
const path = require('path');

const [provider, projectRoot, packageRoot] = process.argv.slice(2);
if (!['claude-code', 'codex', 'both'].includes(provider) || !projectRoot || !packageRoot) {
  throw new Error('Usage: run-provider-mode.js <claude-code|codex|both> <project-root> <package-root>');
}

const installerPath = path.resolve(packageRoot, 'packages', 'installer', 'src', 'installer', 'sinapse-ai-installer.js');
const { installSinapseCore } = require(installerPath);

function count(dir, matcher) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => matcher(entry)).length;
}

(async () => {
  const includeClaude = provider !== 'codex';
  const includeCodex = provider !== 'claude-code';
  const result = await installSinapseCore({ targetDir: projectRoot, includeClaude, includeCodex });
  const metrics = {
    provider,
    success: result.success,
    version: JSON.parse(fs.readFileSync(path.join(projectRoot, '.sinapse-ai', 'version.json'), 'utf8')).version,
    providers: JSON.parse(fs.readFileSync(path.join(projectRoot, '.sinapse-ai', 'version.json'), 'utf8')).providers || [],
    claudeAgents: count(path.join(projectRoot, '.claude', 'agents'), (entry) => entry.isFile() && /^sinapse-.+\.md$/.test(entry.name)),
    claudeSkills: count(path.join(projectRoot, '.claude', 'skills'), (entry) => entry.isDirectory()),
    codexAgents: count(path.join(projectRoot, '.codex', 'agents'), (entry) => entry.isFile() && entry.name.endsWith('.toml')),
    codexSkills: count(path.join(projectRoot, '.agents', 'skills'), (entry) => entry.isDirectory()),
  };
  console.log(JSON.stringify(metrics));

  const expectedClaude = includeClaude ? 172 : 0;
  const expectedClaudeSkills = includeClaude ? 36 : 0;
  const expectedCodex = includeCodex ? 172 : 0;
  const expectedCodexSkills = includeCodex ? 36 : 0;
  const expectedProviders = [includeClaude && 'claude-code', includeCodex && 'codex'].filter(Boolean).sort();
  if (!result.success || metrics.claudeAgents !== expectedClaude || metrics.claudeSkills !== expectedClaudeSkills
    || metrics.codexAgents !== expectedCodex || metrics.codexSkills !== expectedCodexSkills
    || JSON.stringify(metrics.providers) !== JSON.stringify(expectedProviders)) {
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
