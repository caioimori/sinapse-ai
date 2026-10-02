'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const DEFAULT_PACKAGE_ROOT = path.resolve(__dirname, '../..');
const PAYLOAD = ['scripts/framework-evolution/runtime.cjs', 'scripts/framework-evolution/knowledge.cjs', ...['sources', 'heuristics', 'competencies'].map((name) => `research/framework-evolution/${name}.json`)];
const EXPERT_PAYLOAD = ['scripts/expert-evolution/expertise.cjs', 'scripts/expert-evolution/model-policy.cjs', 'scripts/framework-evolution/jev.cjs', ...['expert-profiles', 'source-program', 'jev-use-cases', 'model-policy'].map(name => `research/expert-evolution/${name}.json`)];
const RECEIPT = '.framework-evolution-delivery.json';
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const inside = (base, target) => { const relative = path.relative(base, target); return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative)); };

function safeDirectory(root, directory) {
  fs.mkdirSync(root, { recursive: true });
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error('Unsafe evolution target root');
  const realRoot = fs.realpathSync(root);
  if (!inside(root, directory)) throw new Error('Evolution destination escapes root');
  let current = root;
  for (const segment of path.relative(root, directory).split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    if (!fs.existsSync(current)) fs.mkdirSync(current);
    const stat = fs.lstatSync(current);
    if (!stat.isDirectory() || stat.isSymbolicLink() || !inside(realRoot, fs.realpathSync(current))) throw new Error('Unsafe evolution destination directory');
  }
}

function sourceFile(root, relative) {
  let current = root;
  for (const segment of relative.split('/')) {
    current = path.join(current, segment);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Unsafe evolution source symlink: ${relative}`);
  }
  const resolved = fs.realpathSync(current);
  if (!inside(fs.realpathSync(root), resolved) || !fs.statSync(resolved).isFile()) throw new Error(`Unsafe evolution source: ${relative}`);
  return fs.readFileSync(resolved);
}

function installedPath(relative) {
  return relative.replace(/^squads\//, '').replace(/^\.sinapse-ai\/development\//, 'core/');
}

function deliverFrameworkEvolution({ packageRoot = DEFAULT_PACKAGE_ROOT, targetRoot, layout = 'project' } = {}) {
  if (!targetRoot || !['project', 'global'].includes(layout)) throw new Error('Evolution delivery requires target/layout');
  packageRoot = path.resolve(packageRoot);
  targetRoot = path.resolve(targetRoot);
  const availability = PAYLOAD.map((relative) => fs.existsSync(path.join(packageRoot, relative)));
  const expertAvailability = EXPERT_PAYLOAD.map(relative => fs.existsSync(path.join(packageRoot, relative)));
  if (availability.every((present) => !present)) {
    if (expertAvailability.some(Boolean)) throw new Error('Partial expert evolution package');
    return { schemaVersion: 1, status: 'absent', files: [] };
  }
  if (!availability.every(Boolean)) throw new Error('Partial framework evolution package');
  const payload = new Map(PAYLOAD.map((relative) => [relative, sourceFile(packageRoot, relative)]));
  if (expertAvailability.some(Boolean) && !expertAvailability.every(Boolean)) throw new Error('Partial expert evolution package');
  if (expertAvailability.every(Boolean)) {
    const expertise = require(path.join(packageRoot, 'scripts/expert-evolution/expertise.cjs'));
    const program = expertise.loadProgram(packageRoot);
    const checked = expertise.validateProgram(program, {root:packageRoot});
    if (!checked.valid) throw new Error(`Invalid expert program: ${checked.errors.join('; ')}`);
    const policy = require(path.join(packageRoot, 'scripts/expert-evolution/model-policy.cjs'));
    const models = policy.validatePolicy(policy.loadPolicy(packageRoot));
    if (!models.valid) throw new Error(`Invalid model policy: ${models.errors.join('; ')}`);
    for (const relative of EXPERT_PAYLOAD) payload.set(relative, sourceFile(packageRoot, relative));
  }
  const knowledge = require(path.join(packageRoot, 'scripts/framework-evolution/knowledge.cjs'));
  const validation = knowledge.validateCorpus(knowledge.loadCorpus(packageRoot));
  if (!validation.valid) throw new Error(`Invalid evolution corpus: ${validation.errors.join('; ')}`);
  if (layout === 'global') {
    const profilePath = 'research/expert-evolution/expert-profiles.json';
    if (payload.has(profilePath)) {
      const profiles = JSON.parse(payload.get(profilePath));
      for (const profile of profiles.profiles) profile.canonical.path = installedPath(profile.canonical.path);
      payload.set(profilePath, Buffer.from(JSON.stringify(profiles, null, 2) + '\n'));
    }
    for (const name of ['resolve-codex-agent.js', 'resolve-codex-command.js']) payload.set(`.codex/scripts/${name}`, sourceFile(packageRoot, `.codex/scripts/${name}`));
    const registry = JSON.parse(sourceFile(packageRoot, '.codex/command-registry.json'));
    for (const spec of Object.values(registry.agents)) {
      spec.sourceOfTruth = installedPath(spec.sourceOfTruth);
      for (const command of Object.values(spec.commands)) {
        if (command.target.startsWith('.codex/tasks/')) payload.set(command.target, sourceFile(packageRoot, command.target));
        command.target = installedPath(command.target);
        command.resources = (command.resources || []).map(installedPath);
      }
    }
    payload.set('.codex/command-registry.json', Buffer.from(JSON.stringify(registry, null, 2) + '\n'));
    const resolver = require(path.join(packageRoot, '.codex/scripts/resolve-codex-agent.js'));
    for (const entry of Object.values(resolver.loadCodexAgentIndex(packageRoot))) {
      const source = installedPath(entry.sourcePath);
      if (!fs.existsSync(path.join(targetRoot, source))) throw new Error(`Installed canonical agent missing: ${source}`);
      payload.set(entry.pointerPath, Buffer.from(`Activate agent: ${entry.id}\nSquad: ${entry.squad || 'core'}\nRead the agent definition at: ${source}\nFollow the canonical definition; routing metadata never replaces its authority.\n`));
    }
  }
  safeDirectory(targetRoot, targetRoot);
  const receiptPath = path.join(targetRoot, RECEIPT);
  if (fs.existsSync(receiptPath) && (fs.lstatSync(receiptPath).isSymbolicLink() || !fs.statSync(receiptPath).isFile())) throw new Error('Unsafe evolution receipt');
  const previousBytes = fs.existsSync(receiptPath) ? fs.readFileSync(receiptPath) : null;
  const previous = previousBytes ? JSON.parse(previousBytes.toString('utf8')) : null;
  const receiptDigest = previousBytes ? hash(previousBytes) : null;
  if (previous && (previous.schemaVersion !== 1 || !Array.isArray(previous.files))) throw new Error('Invalid evolution receipt');
  const oldHashes = new Map((previous?.files || []).map((entry) => [entry.path, entry.sha256]));
  const plan = [];
  for (const [relative, bytes] of payload) {
    const destination = path.join(targetRoot, relative);
    safeDirectory(targetRoot, path.dirname(destination));
    if (fs.existsSync(destination)) {
      if (fs.lstatSync(destination).isSymbolicLink() || !fs.statSync(destination).isFile()) throw new Error(`Unsafe evolution destination: ${relative}`);
      const existing = fs.readFileSync(destination);
      if (hash(existing) !== hash(bytes) && hash(existing) !== oldHashes.get(relative)) throw new Error(`Preserving modified/unmanaged evolution file: ${relative}`);
      if (hash(existing) !== hash(bytes)) plan.push({ relative, destination, bytes, backup: existing, expectedDigest: hash(existing) });
    } else plan.push({ relative, destination, bytes, expectedDigest: null });
  }
  function write(destination, bytes, expectedDigest = null) {
    require('./global-provider-adapters.js').writeFileAtomically(destination, bytes, targetRoot, { expectedContentSha256: expectedDigest });
  }
  for (const entry of plan) {
    if (entry.backup) {
      const backup = path.join(targetRoot, '.framework-evolution-backups', hash(entry.backup), entry.relative);
      safeDirectory(targetRoot, path.dirname(backup));
      if (!fs.existsSync(backup)) write(backup, entry.backup);
      else if (fs.lstatSync(backup).isSymbolicLink() || !fs.statSync(backup).isFile() || hash(fs.readFileSync(backup)) !== hash(entry.backup)) throw new Error('Unsafe or corrupt evolution backup');
    }
    write(entry.destination, entry.bytes, entry.expectedDigest);
  }
  const receipt = { schemaVersion: 1, status: 'delivered', layout, files: [...payload].map(([relative, bytes]) => ({ path: relative, sha256: hash(bytes) })), changedFiles: plan.length };
  write(receiptPath, Buffer.from(JSON.stringify(receipt, null, 2) + '\n'), receiptDigest);
  return receipt;
}

function globalEvolutionInstruction(home, agentId) {
  const script = path.join(path.resolve(home), '.sinapse/scripts/framework-evolution/runtime.cjs');
  const agent = agentId === 'snps-orqx' ? 'sinapse-orqx' : agentId;
  const quotedScript = `'${script.replace(/'/g, process.platform === 'win32' ? "''" : "'\"'\"'")}'`;
  return `For a resolved task only, run node ${quotedScript} ${agent} --task <command> --json --max-chars 12000 --knowledge-max-chars 6000. Use cited supplemental knowledge and the optional task-relevant expert profile while preserving canonical authority and gates; planned program coverage is not validated expertise. The complete JSON stays within 12000 characters and knowledge within 6000; partial expertise installation or retrieval failure blocks that task. Do not retrieve during greeting or cold activation.`;
}

module.exports = { deliverFrameworkEvolution, globalEvolutionInstruction, PAYLOAD, EXPERT_PAYLOAD, installedPath };
