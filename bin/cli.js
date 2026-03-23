#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ══════════════════════════════════════════════════════════════════════════════
// Sinapse CLI — Global + Local installer for Claude Code agent squads
// ══════════════════════════════════════════════════════════════════════════════

const ROOT = path.resolve(__dirname, '..');
const SQUADS_DIR = path.join(ROOT, 'squads');
const VERSION = '1.0.0';
const HOME = os.homedir();
const SINAPSE_HOME = path.join(HOME, '.sinapse');
const CLAUDE_COMMANDS_DIR = path.join(HOME, '.claude', 'commands', 'SINAPSE', 'agents');
const BIN_DIR = path.join(HOME, 'bin');
const IS_WIN = process.platform === 'win32';

const WHITE = '\x1b[38;2;255;255;255m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const NC = '\x1b[0m';

// ── Helpers ──────────────────────────────────────────────────────────────────

function header() {
  const W = `${WHITE}${BOLD}`;
  console.log('');
  console.log(`${W} ███████╗██╗███╗   ██╗ █████╗ ██████╗ ███████╗███████╗${NC}`);
  console.log(`${W} ██╔════╝██║████╗  ██║██╔══██╗██╔══██╗██╔════╝██╔════╝${NC}`);
  console.log(`${W} ███████╗██║██╔██╗ ██║███████║██████╔╝███████╗█████╗  ${NC}`);
  console.log(`${W} ╚════██║██║██║╚██╗██║██╔══██║██╔═══╝ ╚════██║██╔══╝  ${NC}`);
  console.log(`${W} ███████║██║██║ ╚████║██║  ██║██║     ███████║███████╗${NC}`);
  console.log(`${W} ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝${NC}`);
  console.log('');
  console.log(`${DIM} AI Agent Squads for Claude Code${NC}`);
  console.log(`${DIM} v${VERSION}${NC}`);
  console.log('');
}

function getSquads(baseDir) {
  baseDir = baseDir || SQUADS_DIR;
  const squads = [];
  let entries;
  try {
    entries = fs.readdirSync(baseDir).filter(d =>
      d.startsWith('squad-') && !d.includes('.deprecated') &&
      fs.statSync(path.join(baseDir, d)).isDirectory()
    );
  } catch { return squads; }

  for (const dir of entries) {
    const manifest = path.join(baseDir, dir, 'squad.yaml');
    if (!fs.existsSync(manifest)) continue;

    const content = fs.readFileSync(manifest, 'utf8');
    const descMatch = content.match(/^description:\s*["']?(.+)/m);

    const agentsDir = path.join(baseDir, dir, 'agents');
    const tasksDir = path.join(baseDir, dir, 'tasks');
    const kbDir = path.join(baseDir, dir, 'knowledge-base');
    const wfDir = path.join(baseDir, dir, 'workflows');

    const count = (d, ext) => {
      try { return fs.readdirSync(d).filter(f => f.endsWith(ext)).length; }
      catch { return 0; }
    };

    squads.push({
      name: dir,
      desc: descMatch ? descMatch[1].replace(/["']/g, '').slice(0, 65) : '',
      agents: count(agentsDir, '.md'),
      tasks: count(tasksDir, '.md'),
      kbs: count(kbDir, '.md'),
      workflows: count(wfDir, '.yaml'),
    });
  }
  return squads;
}

function getAgentFiles(squadDir) {
  const agentsDir = path.join(squadDir, 'agents');
  if (!fs.existsSync(agentsDir)) return [];
  return fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
}

function extractAgentMeta(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const nameMatch = content.match(/^(?:Nome|name):\s*["']?(.+?)["']?\s*$/m);
    const iconMatch = content.match(/^(?:Icon|icon):\s*["']?(.+?)["']?\s*$/m);
    return {
      name: nameMatch ? nameMatch[1].replace(/\*/g, '').trim() : '',
      icon: iconMatch ? iconMatch[1].replace(/\*/g, '').trim() : '',
    };
  } catch { return { name: '', icon: '' }; }
}

function copyDirSync(src, dest) {
  if (typeof fs.cpSync === 'function') {
    fs.cpSync(src, dest, { recursive: true, force: true });
  } else {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const s = path.join(src, entry.name);
      const d = path.join(dest, entry.name);
      entry.isDirectory() ? copyDirSync(s, d) : fs.copyFileSync(s, d);
    }
  }
}

function rmDirSync(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function toForwardSlash(p) {
  return p.replace(/\\/g, '/');
}

// ── Global Install ───────────────────────────────────────────────────────────

function cmdInstallGlobal() {
  header();
  console.log(`${BOLD}Installing Sinapse globally...${NC}\n`);

  // Validate package
  const squads = getSquads(SQUADS_DIR);
  if (squads.length === 0) {
    console.error(`${RED}ERROR: No squad directories found in package.${NC}`);
    process.exit(1);
  }

  // Phase 1: Copy squads to ~/.sinapse/
  console.log(`${CYAN}Phase 1:${NC} Copying squads to ~/.sinapse/`);
  fs.mkdirSync(SINAPSE_HOME, { recursive: true });

  let totalAgents = 0;
  for (const squad of squads) {
    const src = path.join(SQUADS_DIR, squad.name);
    const dest = path.join(SINAPSE_HOME, squad.name);
    rmDirSync(dest);
    copyDirSync(src, dest);
    totalAgents += squad.agents;
    console.log(`  ${GREEN}OK${NC} ${squad.name} (${squad.agents} agents)`);
  }

  // Copy sinapse/ master squad
  const sinapseMasterSrc = path.join(ROOT, 'sinapse');
  const sinapseMasterDest = path.join(SINAPSE_HOME, 'sinapse');
  if (fs.existsSync(sinapseMasterSrc)) {
    rmDirSync(sinapseMasterDest);
    copyDirSync(sinapseMasterSrc, sinapseMasterDest);
    const masterAgents = getAgentFiles(sinapseMasterDest).length;
    totalAgents += masterAgents;
    console.log(`  ${GREEN}OK${NC} sinapse (master, ${masterAgents} agents)`);
  }

  // Phase 2: Generate global commands
  console.log(`\n${CYAN}Phase 2:${NC} Generating agent commands`);
  fs.mkdirSync(CLAUDE_COMMANDS_DIR, { recursive: true });

  // Clear old commands
  try {
    for (const f of fs.readdirSync(CLAUDE_COMMANDS_DIR)) {
      fs.unlinkSync(path.join(CLAUDE_COMMANDS_DIR, f));
    }
  } catch {}

  let cmdCount = 0;
  const sinapseBase = toForwardSlash(SINAPSE_HOME);

  // Also copy framework agent commands (sinapse-master, dev, qa, etc.) if they exist in package
  const frameworkCmdsDir = path.join(ROOT, '.claude', 'commands', 'SINAPSE', 'agents');
  if (fs.existsSync(frameworkCmdsDir)) {
    for (const f of fs.readdirSync(frameworkCmdsDir).filter(f => f.endsWith('.md'))) {
      let content = fs.readFileSync(path.join(frameworkCmdsDir, f), 'utf8');
      // Update paths to point to ~/.sinapse/
      content = content.replace(/\.sinapse-ai\//g, `${sinapseBase}/.sinapse-ai/`);
      fs.writeFileSync(path.join(CLAUDE_COMMANDS_DIR, f), content);
      cmdCount++;
    }
    console.log(`  ${GREEN}OK${NC} Framework agents — ${cmdCount} agents`);
  }

  // Generate commands for each squad
  for (const squad of squads) {
    const squadPath = `${sinapseBase}/${squad.name}`;
    const agentsDir = path.join(SINAPSE_HOME, squad.name, 'agents');
    if (!fs.existsSync(agentsDir)) continue;

    for (const file of fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))) {
      const agentId = file.replace('.md', '');
      const meta = extractAgentMeta(path.join(agentsDir, file));
      const cmdContent = generateCommandMd(agentId, meta.name, meta.icon, squad.name, squadPath, file);
      fs.writeFileSync(path.join(CLAUDE_COMMANDS_DIR, `${agentId}.md`), cmdContent);
      cmdCount++;
    }
  }

  // Generate commands for sinapse/ master squad agents
  if (fs.existsSync(sinapseMasterDest)) {
    const masterAgentsDir = path.join(sinapseMasterDest, 'agents');
    if (fs.existsSync(masterAgentsDir)) {
      for (const file of fs.readdirSync(masterAgentsDir).filter(f => f.endsWith('.md'))) {
        const agentId = file.replace('.md', '');
        if (fs.existsSync(path.join(CLAUDE_COMMANDS_DIR, `${agentId}.md`))) continue; // skip if framework version exists
        const meta = extractAgentMeta(path.join(masterAgentsDir, file));
        const squadPath = `${sinapseBase}/sinapse`;
        const cmdContent = generateCommandMd(agentId, meta.name, meta.icon, 'sinapse', squadPath, file);
        fs.writeFileSync(path.join(CLAUDE_COMMANDS_DIR, `${agentId}.md`), cmdContent);
        cmdCount++;
      }
    }
  }
  console.log(`  ${GREEN}OK${NC} ${cmdCount} total command files`);

  // Phase 3: Generate squad-awareness.md
  console.log(`\n${CYAN}Phase 3:${NC} Generating squad-awareness rules`);
  generateSquadAwareness(SINAPSE_HOME, squads);
  console.log(`  ${GREEN}OK${NC} squad-awareness.md`);

  // Phase 4: Create launcher
  console.log(`\n${CYAN}Phase 4:${NC} Creating launcher`);
  createLauncher();

  // Phase 5: PATH management
  console.log(`\n${CYAN}Phase 5:${NC} Configuring PATH`);
  ensurePath();

  // Phase 6: Write metadata
  const meta = {
    version: VERSION,
    installedAt: new Date().toISOString(),
    squads: squads.length,
    agents: totalAgents,
    commands: cmdCount,
    platform: process.platform,
  };
  fs.writeFileSync(path.join(SINAPSE_HOME, 'metadata.json'), JSON.stringify(meta, null, 2));

  // Verify
  console.log(`\n${CYAN}Verification:${NC}`);
  verifyInstall();

  // Success
  console.log('');
  console.log(`${GREEN}══════════════════════════════════════════════════════════════${NC}`);
  console.log(`${GREEN}  Sinapse installed successfully!${NC}`);
  console.log(`${GREEN}══════════════════════════════════════════════════════════════${NC}`);
  console.log('');
  console.log(`  ${BOLD}${squads.length} squads${NC} | ${BOLD}${cmdCount} agents${NC} | All under ${CYAN}/SINAPSE:agents:*${NC}`);
  console.log('');
  console.log(`  ${BOLD}Next steps:${NC}`);
  console.log(`    1. Restart your terminal (for PATH changes)`);
  console.log(`    2. Run ${CYAN}sinapse${NC} to start Claude Code with all agents`);
  console.log(`    3. Or: ${CYAN}claude --add-dir ~/.sinapse${NC}`);
  console.log('');
  console.log(`  ${BOLD}Try an agent:${NC}`);
  console.log(`    ${CYAN}/SINAPSE:agents:sinapse-master${NC}`);
  console.log(`    ${CYAN}/SINAPSE:agents:brand-orchestrator${NC}`);
  console.log(`    ${CYAN}/SINAPSE:agents:dev${NC}`);
  console.log('');
}

function generateCommandMd(agentId, agentName, agentIcon, squadName, squadPath, agentFile) {
  return `# ${agentId}

ACTIVATION-NOTICE: This command activates an agent from ${squadName}.

CRITICAL: Read the agent definition file at \`${squadPath}/agents/${agentFile}\` to understand your full operating parameters. Then:
1. Adopt the persona defined in that file (name: ${agentName}, icon: ${agentIcon})
2. Load the squad manifest at \`${squadPath}/squad.yaml\` for context
3. Display a greeting showing your agent name, role, and available commands
4. HALT and await user input

## Agent Reference
- **Agent ID:** ${agentId}
- **Squad:** ${squadName}
- **Definition:** \`${squadPath}/agents/${agentFile}\`
- **Squad Manifest:** \`${squadPath}/squad.yaml\`
- **Tasks:** \`${squadPath}/tasks/\`
- **Knowledge Bases:** \`${squadPath}/knowledge-base/\`
- **Workflows:** \`${squadPath}/workflows/\`

## Activation Instructions
1. Read the full agent definition: \`${squadPath}/agents/${agentFile}\`
2. Adopt the persona (name, icon, communication style, principles)
3. Show greeting: "{icon} {name} — {role} ativado"
4. Show: "Squad: ${squadName} | Invoke: /SINAPSE:agents:${agentId}"
5. List your key tasks from the agent definition
6. HALT and await user input

## How to Execute Tasks
When the user requests a task:
1. Find the matching task in \`${squadPath}/tasks/\`
2. Read the task file completely
3. Execute following the task checklist step by step
4. Consult knowledge bases in \`${squadPath}/knowledge-base/\` as needed

## Cross-Squad Handoff
If the task requires expertise outside this squad:
1. Identify which squad covers the needed domain
2. Recommend: /SINAPSE:agents:{appropriate-agent}
3. Provide handoff context
`;
}

function generateSquadAwareness(sinapseDir, squads) {
  const rulesDir = path.join(sinapseDir, '.claude', 'rules');
  fs.mkdirSync(rulesDir, { recursive: true });

  let table = '';
  for (const s of squads) {
    table += `| \`${s.name}\` | ${s.agents} agents, ${s.tasks} tasks, ${s.kbs} KBs, ${s.workflows} workflows |\n`;
  }

  const content = `---
paths: **/*
---

# Sinapse — Orchestration Rules

> **CRITICAL:** This project has specialized AI agent squads installed. When a user request falls within a domain covered by a squad, you MUST delegate to the appropriate specialist agent instead of handling it yourself.

## Delegation Rule

When a user request matches a squad domain:
1. **Acknowledge** the domain is covered by a specialized squad
2. **Recommend** activating the appropriate agent: \`/SINAPSE:agents:{agent-id}\`
3. **Do NOT** handle the request yourself if a dedicated agent exists

## Squads Installed

| Squad | Capacity |
|-------|----------|
${table}
## How to Invoke Any Agent

All agents use a single prefix: \`/SINAPSE:agents:{agent-id}\`

Examples:
- \`/SINAPSE:agents:sinapse-master\` — Master orchestrator
- \`/SINAPSE:agents:brand-orchestrator\` — Brand strategy
- \`/SINAPSE:agents:dev\` — Development
- \`/SINAPSE:agents:research-orchestrator\` — Research & analysis

## Handoff Protocol

1. **Identify** the domain of the request
2. **Inform** which squad covers it and how to invoke: \`/SINAPSE:agents:{agent-id}\`
3. **Provide context** for the handoff if necessary
4. Squads are **autonomous** — the orchestrator coordinates internally
`;

  fs.writeFileSync(path.join(rulesDir, 'squad-awareness.md'), content);

  // Also create a minimal CLAUDE.md for --add-dir discovery
  const claudeDir = path.join(sinapseDir, '.claude');
  fs.mkdirSync(claudeDir, { recursive: true });
  fs.writeFileSync(path.join(claudeDir, 'CLAUDE.md'), `# Sinapse — AI Agent Squads

This directory contains Sinapse agent squads for Claude Code.
When a request matches a squad domain, delegate using \`/SINAPSE:agents:{agent-id}\`.
See \`.claude/rules/squad-awareness.md\` for the full delegation map.
`);
}

function createLauncher() {
  fs.mkdirSync(BIN_DIR, { recursive: true });
  const sinapsePathForBash = IS_WIN
    ? toForwardSlash(SINAPSE_HOME).replace(/^([A-Za-z]):/, (_, l) => '/' + l.toLowerCase())
    : SINAPSE_HOME;

  // Bash launcher (macOS/Linux/Git Bash)
  const bashLauncher = `#!/bin/bash
# Sinapse — Claude Code launcher (auto-generated)
exec claude --add-dir "${sinapsePathForBash}" "$@"
`;
  const bashPath = path.join(BIN_DIR, 'sinapse');
  fs.writeFileSync(bashPath, bashLauncher);
  try { fs.chmodSync(bashPath, 0o755); } catch {}
  console.log(`  ${GREEN}OK${NC} ~/bin/sinapse`);

  // Windows CMD launcher
  if (IS_WIN) {
    const cmdLauncher = `@echo off\r\nclaude --add-dir "%USERPROFILE%\\.sinapse" %*\r\n`;
    fs.writeFileSync(path.join(BIN_DIR, 'sinapse.cmd'), cmdLauncher);
    console.log(`  ${GREEN}OK${NC} ~/bin/sinapse.cmd`);
  }
}

function ensurePath() {
  const pathDirs = process.env.PATH ? process.env.PATH.split(path.delimiter) : [];
  const binNorm = path.normalize(BIN_DIR);
  const alreadyInPath = pathDirs.some(p => path.normalize(p) === binNorm);

  if (alreadyInPath) {
    console.log(`  ${YELLOW}SKIP${NC} ~/bin already in PATH`);
    return;
  }

  if (IS_WIN) {
    ensurePathWindows();
  } else {
    ensurePathUnix();
  }

  console.log(`  ${YELLOW}NOTE${NC} Restart your terminal for PATH changes`);
}

function ensurePathUnix() {
  const marker = '# Added by Sinapse';
  const exportLine = 'export PATH="$HOME/bin:$PATH"';
  const rcFiles = ['.zshrc', '.bashrc', '.profile'];

  for (const rc of rcFiles) {
    const rcPath = path.join(HOME, rc);
    if (!fs.existsSync(rcPath)) continue;
    const content = fs.readFileSync(rcPath, 'utf8');
    if (content.includes(marker) || content.includes(exportLine)) continue;
    fs.appendFileSync(rcPath, `\n${marker}\n${exportLine}\n`);
    console.log(`  ${GREEN}OK${NC} Updated ~/${rc}`);
    return;
  }

  // If no RC file found, create .profile
  fs.writeFileSync(path.join(HOME, '.profile'), `${marker}\n${exportLine}\n`, { flag: 'a' });
  console.log(`  ${GREEN}OK${NC} Created ~/.profile`);
}

function ensurePathWindows() {
  try {
    const result = execSync('reg query "HKCU\\Environment" /v Path', { encoding: 'utf8' });
    const match = result.match(/Path\s+REG_(?:EXPAND_)?SZ\s+(.+)/);
    const currentPath = match ? match[1].trim() : '';

    if (currentPath.includes('%USERPROFILE%\\bin') || currentPath.includes(BIN_DIR.replace(/\//g, '\\'))) {
      console.log(`  ${YELLOW}SKIP${NC} ~/bin already in Windows PATH`);
      return;
    }

    const newPath = currentPath ? `${currentPath};%USERPROFILE%\\bin` : '%USERPROFILE%\\bin';
    if (newPath.length > 900) {
      console.log(`  ${YELLOW}WARN${NC} PATH too long for setx. Add manually: ${BIN_DIR}`);
      return;
    }

    execSync(`setx PATH "${newPath}"`, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`  ${GREEN}OK${NC} Added ~/bin to Windows User PATH`);
  } catch {
    try {
      execSync(`setx PATH "%USERPROFILE%\\bin"`, { encoding: 'utf8', stdio: 'pipe' });
      console.log(`  ${GREEN}OK${NC} Created Windows User PATH with ~/bin`);
    } catch {
      console.log(`  ${YELLOW}WARN${NC} Could not modify PATH. Add manually: ${BIN_DIR}`);
    }
  }
}

function verifyInstall() {
  const checks = [
    [fs.existsSync(SINAPSE_HOME), `${getSquads(SINAPSE_HOME).length} squads in ~/.sinapse/`],
    [fs.existsSync(CLAUDE_COMMANDS_DIR), `Commands in ~/.claude/commands/SINAPSE/agents/`],
    [fs.existsSync(path.join(BIN_DIR, 'sinapse')), `Launcher at ~/bin/sinapse`],
    [fs.existsSync(path.join(SINAPSE_HOME, '.claude', 'rules', 'squad-awareness.md')), `squad-awareness.md`],
  ];

  for (const [ok, msg] of checks) {
    console.log(`  ${ok ? GREEN + '✓' : RED + '✗'}${NC} ${msg}`);
  }
}

// ── Global Update ────────────────────────────────────────────────────────────

function cmdUpdateGlobal() {
  header();

  if (!fs.existsSync(path.join(SINAPSE_HOME, 'metadata.json'))) {
    console.log(`${YELLOW}Sinapse not installed globally. Run: npx sinapse install${NC}\n`);
    process.exit(1);
  }

  console.log(`${BOLD}Updating Sinapse...${NC}\n`);

  const squads = getSquads(SQUADS_DIR);

  // Phase 1: Re-copy squads
  console.log(`${CYAN}Phase 1:${NC} Updating squads`);
  for (const squad of squads) {
    const src = path.join(SQUADS_DIR, squad.name);
    const dest = path.join(SINAPSE_HOME, squad.name);
    rmDirSync(dest);
    copyDirSync(src, dest);
    console.log(`  ${GREEN}OK${NC} ${squad.name}`);
  }

  const sinapseMasterSrc = path.join(ROOT, 'sinapse');
  if (fs.existsSync(sinapseMasterSrc)) {
    rmDirSync(path.join(SINAPSE_HOME, 'sinapse'));
    copyDirSync(sinapseMasterSrc, path.join(SINAPSE_HOME, 'sinapse'));
    console.log(`  ${GREEN}OK${NC} sinapse (master)`);
  }

  // Phase 2: Regenerate commands (reuse install logic)
  console.log(`\n${CYAN}Phase 2:${NC} Regenerating commands`);
  // Clear and regenerate
  rmDirSync(CLAUDE_COMMANDS_DIR);
  fs.mkdirSync(CLAUDE_COMMANDS_DIR, { recursive: true });

  const sinapseBase = toForwardSlash(SINAPSE_HOME);
  let cmdCount = 0;

  const frameworkCmdsDir = path.join(ROOT, '.claude', 'commands', 'SINAPSE', 'agents');
  if (fs.existsSync(frameworkCmdsDir)) {
    for (const f of fs.readdirSync(frameworkCmdsDir).filter(f => f.endsWith('.md'))) {
      let content = fs.readFileSync(path.join(frameworkCmdsDir, f), 'utf8');
      content = content.replace(/\.sinapse-ai\//g, `${sinapseBase}/.sinapse-ai/`);
      fs.writeFileSync(path.join(CLAUDE_COMMANDS_DIR, f), content);
      cmdCount++;
    }
  }

  for (const squad of squads) {
    const agentsDir = path.join(SINAPSE_HOME, squad.name, 'agents');
    if (!fs.existsSync(agentsDir)) continue;
    for (const file of fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))) {
      const agentId = file.replace('.md', '');
      const meta = extractAgentMeta(path.join(agentsDir, file));
      const squadPath = `${sinapseBase}/${squad.name}`;
      fs.writeFileSync(
        path.join(CLAUDE_COMMANDS_DIR, `${agentId}.md`),
        generateCommandMd(agentId, meta.name, meta.icon, squad.name, squadPath, file)
      );
      cmdCount++;
    }
  }
  console.log(`  ${GREEN}OK${NC} ${cmdCount} command files`);

  // Phase 3: Regenerate awareness
  console.log(`\n${CYAN}Phase 3:${NC} Updating squad-awareness`);
  generateSquadAwareness(SINAPSE_HOME, squads);
  console.log(`  ${GREEN}OK${NC} squad-awareness.md`);

  // Update metadata
  const metaPath = path.join(SINAPSE_HOME, 'metadata.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  meta.updatedAt = new Date().toISOString();
  meta.squads = squads.length;
  meta.commands = cmdCount;
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  console.log(`\n${GREEN}Update complete!${NC} ${squads.length} squads | ${cmdCount} agents\n`);
}

// ── Uninstall ────────────────────────────────────────────────────────────────

function cmdUninstall() {
  header();
  console.log(`${BOLD}Uninstalling Sinapse...${NC}\n`);

  const items = [
    [SINAPSE_HOME, '~/.sinapse/'],
    [path.join(HOME, '.claude', 'commands', 'SINAPSE'), '~/.claude/commands/SINAPSE/'],
    [path.join(BIN_DIR, 'sinapse'), '~/bin/sinapse'],
    [path.join(BIN_DIR, 'sinapse.cmd'), '~/bin/sinapse.cmd'],
  ];

  for (const [p, label] of items) {
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        rmDirSync(p);
      } else {
        fs.unlinkSync(p);
      }
      console.log(`  ${GREEN}✓${NC} Removed ${label}`);
    } else {
      console.log(`  ${YELLOW}-${NC} ${label} (not found)`);
    }
  }

  console.log(`\n${GREEN}Sinapse uninstalled.${NC}`);
  console.log(`${YELLOW}Note:${NC} PATH entry in shell RC files was not removed. Clean up manually if desired.\n`);
}

// ── Local Install (existing behavior) ────────────────────────────────────────

function toPosixPath(p) {
  if (IS_WIN) {
    return p.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, l) => '/' + l.toLowerCase());
  }
  return p;
}

function runBash(script) {
  const scriptPath = path.join(ROOT, script);
  if (!fs.existsSync(scriptPath)) {
    console.error(`${RED}Script not found: ${script}${NC}`);
    process.exit(1);
  }

  let scriptContent = fs.readFileSync(scriptPath, 'utf8').replace(/\r\n/g, '\n');
  let rootForBash = ROOT.replace(/\\/g, '/');

  try {
    const bashCheck = execSync('bash -c "echo $OSTYPE"', { encoding: 'utf8' }).trim();
    if (!bashCheck.includes('msys')) {
      rootForBash = rootForBash.replace(/^([A-Za-z]):/, (_, l) => '/mnt/' + l.toLowerCase());
    }
  } catch {
    rootForBash = rootForBash.replace(/^([A-Za-z]):/, (_, l) => '/mnt/' + l.toLowerCase());
  }

  const injection = `export SCRIPT_DIR="${rootForBash}"\n`;
  if (scriptContent.startsWith('#!/')) {
    const nl = scriptContent.indexOf('\n');
    scriptContent = scriptContent.slice(0, nl + 1) + injection + scriptContent.slice(nl + 1);
  } else {
    scriptContent = injection + scriptContent;
  }

  const child = spawn('bash', ['-s'], { cwd: process.cwd(), stdio: ['pipe', 'inherit', 'inherit'] });
  child.stdin.write(scriptContent);
  child.stdin.end();
  child.on('close', (code) => process.exit(code || 0));
}

function cmdInstallLocal() {
  header();
  console.log(`${CYAN}▸ Installing squads in current project...${NC}\n`);
  runBash('install-squads.sh');
}

function cmdUpdateLocal() {
  header();
  console.log(`${CYAN}▸ Updating squads in current project...${NC}\n`);
  runBash('update-squads.sh');
}

// ── List / Status / Help ─────────────────────────────────────────────────────

function cmdList() {
  header();
  const baseDir = fs.existsSync(SINAPSE_HOME) ? SINAPSE_HOME : SQUADS_DIR;
  const squads = getSquads(baseDir);
  let totalAgents = 0, totalTasks = 0;

  console.log(`${BOLD}Squads available:${NC}\n`);

  for (const s of squads) {
    totalAgents += s.agents;
    totalTasks += s.tasks;
    const agents = `${s.agents} agents`.padStart(10);
    const tasks = `${s.tasks} tasks`.padStart(10);
    console.log(`  ${CYAN}${s.name.padEnd(25)}${NC} ${GREEN}${agents}${NC} ${YELLOW}${tasks}${NC}  ${s.desc}`);
  }

  console.log('');
  console.log(`  ${BOLD}Total: ${GREEN}${totalAgents} agents${NC} | ${YELLOW}${totalTasks} tasks${NC}`);
  console.log(`  ${BOLD}Invoke: ${CYAN}/SINAPSE:agents:{agent-id}${NC}`);
  console.log('');
}

function cmdStatus() {
  header();

  // Check global install
  console.log(`${BOLD}Global Install:${NC}\n`);

  if (fs.existsSync(path.join(SINAPSE_HOME, 'metadata.json'))) {
    const meta = JSON.parse(fs.readFileSync(path.join(SINAPSE_HOME, 'metadata.json'), 'utf8'));
    console.log(`  ${GREEN}✓${NC} Installed (v${meta.version})`);
    console.log(`  ${GREEN}✓${NC} ${meta.squads} squads, ${meta.commands || '?'} agents`);
    console.log(`  ${GREEN}✓${NC} Installed: ${meta.installedAt}`);
    if (meta.updatedAt) console.log(`  ${GREEN}✓${NC} Updated: ${meta.updatedAt}`);
  } else {
    console.log(`  ${RED}✗${NC} Not installed globally`);
    console.log(`  ${YELLOW}Run:${NC} npx sinapse install`);
  }

  verifyInstall();
  console.log('');
}

function cmdHelp() {
  header();
  console.log(`${BOLD}Commands:${NC}\n`);
  console.log(`  ${CYAN}npx sinapse install${NC}          Global setup (recommended)`);
  console.log(`  ${CYAN}npx sinapse install --local${NC}  Install in current project`);
  console.log(`  ${CYAN}npx sinapse update${NC}           Update global squads`);
  console.log(`  ${CYAN}npx sinapse uninstall${NC}        Remove global install`);
  console.log(`  ${CYAN}npx sinapse list${NC}             List all squads and agents`);
  console.log(`  ${CYAN}npx sinapse status${NC}           Check installation status`);
  console.log(`  ${CYAN}npx sinapse help${NC}             Show this help`);
  console.log('');
  console.log(`${BOLD}After install:${NC}\n`);
  console.log(`  ${CYAN}sinapse${NC}                      Start Claude Code with all agents`);
  console.log(`  ${CYAN}sinapse --continue${NC}           Continue last session`);
  console.log('');
  console.log(`${BOLD}Agents:${NC}\n`);
  console.log(`  All agents use: ${CYAN}/SINAPSE:agents:{agent-id}${NC}`);
  console.log(`  Example: ${CYAN}/SINAPSE:agents:brand-orchestrator${NC}`);
  console.log('');
}

// ── Router ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0] || 'help';
const isLocal = args.includes('--local');

switch (command) {
  case 'install':  isLocal ? cmdInstallLocal() : cmdInstallGlobal(); break;
  case 'update':   isLocal ? cmdUpdateLocal()  : cmdUpdateGlobal();  break;
  case 'uninstall': cmdUninstall(); break;
  case 'list':     cmdList(); break;
  case 'status':   cmdStatus(); break;
  case 'help':
  case '--help':
  case '-h':       cmdHelp(); break;
  default:
    console.error(`${RED}Unknown command:${NC} ${command}`);
    console.error(`Run ${CYAN}npx sinapse help${NC}`);
    process.exit(1);
}
