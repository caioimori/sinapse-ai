// bin/lib/command-generator.js — shared agent-command generation.
//
// Single source of truth for the Phase 2 "generate agent commands" logic used by
// BOTH `install` and `update`. Previously update.js only regenerated `-orqx`
// commands, silently dropping every specialist command + the rich master stubs a
// fresh install creates. Extracting the install behavior here makes `update`
// produce byte-identical command files to `install`.

const fs = require('fs');
const path = require('path');

const { SINAPSE_HOME, CLAUDE_COMMANDS_DIR, ROOT } = require('./constants');
const { extractAgentMeta } = require('./squads');
const { toForwardSlash, atomicWriteFileSync } = require('./fs-utils');

// Framework "core" agents (developer, architect, quality-gate, devops, …) live
// OUTSIDE the squads/ tree, under .sinapse-ai/development/agents/*.md. `scripts/
// sync-counts.js` calls these `frameworkAgents`; the canonical ecosystem total is
// `squad agents + core agents` (160 + 12 = 172). We count them from the SAME source
// sync-counts uses so the master-stub headline can never drift from README/persona
// (Constitution Article VII). Fails open to 0 if the dir is unavailable.
const CORE_AGENTS_DIR = path.join(ROOT, '.sinapse-ai', 'development', 'agents');

function countCoreAgents(dir = CORE_AGENTS_DIR) {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(
        (d) =>
          d.isFile() &&
          d.name.endsWith('.md') &&
          d.name !== 'MEMORY.md' &&
          d.name !== 'README.md' &&
          !d.name.startsWith('_'),
      ).length;
  } catch {
    return 0;
  }
}

/**
 * Rich Imperator stub for the master entry points (@sinapse, @snps, @sinapse-orqx,
 * @snps-orqx). The identity (ASCII greeting + 👑 signature + diagnose→plan→delegate
 * mandate) is baked INLINE so activation is reliable — it does not depend on the model
 * choosing to deep-read an external persona (which produced a shallow "modo orqx" before).
 * The full persona (routing table, workflows, tasks) is still linked for depth.
 */
function generateMasterStub(agentId, personaPath, squadPath, squads) {
  const squadCount = squads.length;
  // Squad specialists + framework core agents = full ecosystem (160 + 12 = 172).
  // Excluding core here was the Article VII drift: the stub showed 160 while
  // README/persona declared 172.
  const agentCount = squads.reduce((a, s) => a + (s.agents || 0), 0) + countCoreAgents();
  return `---
name: ${agentId}
description: "Imperator — Sinapse Master: supreme orchestrator of ${squadCount} squads / ${agentCount} agents. Diagnoses every briefing and auto-generates an orchestration plan."
---

# Imperator — Sinapse Master (${agentId})

ACTIVATION-NOTICE: You are now Imperator — the supreme orchestrator of the SINAPSE ecosystem. Every request passes through you first.

## YOUR ONLY FUNCTION — NON-NEGOTIABLE

You DIAGNOSE and HAND OFF. That is the whole job. You do **NOT** execute domain work — no code, no copy, no design, no research, no configuration, no file edits. For ANY concrete task you (1) diagnose the domain, (2) produce the orchestration plan, (3) DELEGATE to the specialist who executes it. If you ever feel the urge to do the work yourself, STOP — that is a violation; route it to the right agent instead.

## ON ACTIVATION — display this EXACTLY as your first output (before anything else)

\`\`\`
 ███████╗██╗███╗   ██╗ █████╗ ██████╗ ███████╗███████╗
 ██╔════╝██║████╗  ██║██╔══██╗██╔══██╗██╔════╝██╔════╝
 ███████╗██║██╔██╗ ██║███████║██████╔╝███████╗█████╗
 ╚════██║██║██║╚██╗██║██╔══██║██╔═══╝ ╚════██║██╔══╝
 ███████║██║██║ ╚████║██║  ██║██║     ███████║███████╗
 ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝
          ██████╗ ██████╗  ██████╗ ██╗  ██╗
         ██╔═══██╗██╔══██╗██╔═══██╗╚██╗██╔╝
         ██║   ██║██████╔╝██║   ██║ ╚███╔╝
         ██║   ██║██╔══██╗██║▄▄ ██║ ██╔██╗
         ╚██████╔╝██║  ██║╚██████╔╝██╔╝ ██╗
          ╚═════╝ ╚═╝  ╚═╝ ╚══▀▀═╝ ╚═╝  ╚═╝
\`\`\`

\`\`\`
 AI Agent Squads for Claude Code
 ${squadCount} squads · ${agentCount} agents

 👑 Imperator — Sinapse Master ativado

 Descreva seu objetivo que eu diagnostico o domínio
 e roteio para o agente certo.

 Comandos principais:
 *route {pedido}     — Diagnostica e roteia para a squad certa
 *plan {iniciativa}  — Desenha um plano de execução multi-squad
 *status             — Reporta todas as squads e capacidades
 *onboard            — Tour guiado do ecossistema SINAPSE
 *help               — Mostra todos os comandos
\`\`\`

## AFTER THE GREETING — NON-NEGOTIABLE (Imperator's core function)

Check if the user provided a briefing with the activation:
- **Briefing provided** → proceed IMMEDIATELY: run the Initial State Audit → classify the request → produce an ORCHESTRATION PLAN (phases + squads + specific agents assigned + handoffs) → delegate to the specialists. NEVER ask "do you want me to plan?" — for Imperator the answer is always YES.
- **Bare activation** → await the briefing, then apply the same flow automatically on receipt.

You diagnose and DELEGATE — never execute domain work yourself. Route simple, well-defined requests directly to @specialist; complex ones to @{domain}-orqx; cross-domain ones by coordinating multiple orchestrators.

## FULL OPERATING PARAMETERS

For your complete persona — the routing table of all squads, the Initial State Audit, the Documentation-First gate, NSN enforcement, and every workflow and task — read and ADOPT:
\`${personaPath}\`
Tasks: \`${squadPath}/tasks/\` · Workflows: \`${squadPath}/workflows/\` · Manifest: \`${squadPath}/squad.yaml\`

— Imperator, orchestrating SINAPSE
`;
}

function generateCommandMd(agentId, agentName, agentIcon, squadName, squadPath, agentFile) {
  // Detecta se é orquestrador: id termina em -orqx OU é Imperator (snps-orqx/sinapse-orqx)
  // ou um dos apelidos curtos do master (sinapse/snps).
  const isOrchestrator = /-orqx$/.test(agentId) || agentId === 'snps-orqx' || agentId === 'sinapse-orqx' || agentId === 'sinapse' || agentId === 'snps';

  const step4 = isOrchestrator
    ? `4. Briefing-on-activation check (this agent is an ORCHESTRATOR):
   - If user provided briefing/context with the activation → proceed IMMEDIATELY: absorb → diagnose → plan with phases + agents + handoffs → execute (YOLO). NEVER ask "do you want me to plan?".
   - If bare activation only → await briefing. On receipt, apply same flow automatically.`
    : '4. HALT and await user input';

  const step6 = isOrchestrator
    ? `6. Briefing-on-activation check (ORCHESTRATOR):
   - If user provided briefing → proceed IMMEDIATELY: absorb → diagnose → plan → execute
   - If bare activation → await briefing, then plan automatically. NEVER ask "do you want me to plan?".`
    : '6. HALT and await user input';

  // Frontmatter (name + description) is REQUIRED so the file resolves as a Claude Code
  // subagent (@id) — without it, @id matches nothing. The same file doubles as a slash
  // command (/SINAPSE:agents:id); extra frontmatter is harmless there.
  const fmDesc = (isOrchestrator
    ? `${agentName || agentId} — orchestrator for ${squadName}; diagnoses, routes to specialists and auto-generates an orchestration plan`
    : `${agentName || agentId} — ${squadName} specialist`).replace(/["\n\r]/g, ' ').trim();

  return `---
name: ${agentId}
description: "${fmDesc}"
---

# ${agentId}

ACTIVATION-NOTICE: This command activates an agent from ${squadName}.

CRITICAL: Read the agent definition file at \`${squadPath}/agents/${agentFile}\` to understand your full operating parameters. Then:
1. Adopt the persona defined in that file (name: ${agentName}, icon: ${agentIcon})
2. Load the squad manifest at \`${squadPath}/squad.yaml\` for context
3. Display a greeting showing your agent name, role, and available commands
${step4}

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
${step6}

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

/**
 * Regenerate ALL agent command files into `commandsDir`. This is the exact Phase 2
 * behavior of a fresh install, shared so `update` produces an identical set:
 *   1. Clear commandsDir.
 *   2. Write a command for EVERY agent of every squad (not only -orqx).
 *   3. Write commands for the sinapse master squad agents.
 *   4. Overwrite the four master entry points (sinapse-orqx, snps-orqx, sinapse,
 *      snps) with the rich Imperator stub.
 *
 * @param {Object} [deps] - Injectable dependencies (defaults bind to real fs/paths).
 * @param {string} [deps.sinapseHome] - Root of installed squads (~/.sinapse).
 * @param {string} [deps.commandsDir] - Target commands dir.
 * @param {Array}  deps.squads - Squad descriptors ({ name, agents, ... }).
 * @param {string} [deps.sinapseMasterDest] - Path to the installed sinapse/ master squad.
 * @returns {{ writtenAgents: Set<string>, totalAgents: number }}
 */
function regenerateAgentCommands(deps = {}) {
  const {
    sinapseHome = SINAPSE_HOME,
    commandsDir = CLAUDE_COMMANDS_DIR,
    squads,
    sinapseMasterDest = path.join(sinapseHome, 'sinapse'),
  } = deps;

  if (!Array.isArray(squads)) {
    throw new Error('regenerateAgentCommands: `squads` array is required');
  }

  fs.mkdirSync(commandsDir, { recursive: true });

  // Clear old commands (dir may not exist on a fresh install — guarded).
  try {
    for (const f of fs.readdirSync(commandsDir)) {
      fs.unlinkSync(path.join(commandsDir, f));
    }
  } catch { /* dir may not exist yet */ }

  const sinapseBase = toForwardSlash(sinapseHome);
  const writtenAgents = new Set();

  // 1. A command/subagent for EVERY agent (not only -orqx), so every specialist
  //    is invokable via @agent and /SINAPSE:agents:agent.
  for (const squad of squads) {
    const squadPath = `${sinapseBase}/${squad.name}`;
    const agentsDir = path.join(sinapseHome, squad.name, 'agents');
    if (!fs.existsSync(agentsDir)) continue;

    const squadAgents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
    for (const file of squadAgents) {
      const agentId = file.replace('.md', '');
      const meta = extractAgentMeta(path.join(agentsDir, file));
      const cmdContent = generateCommandMd(agentId, meta.name, meta.icon, squad.name, squadPath, file);
      atomicWriteFileSync(path.join(commandsDir, `${agentId}.md`), cmdContent);
      writtenAgents.add(file);
    }
  }

  // 2. Commands for sinapse/ master squad agents.
  if (fs.existsSync(sinapseMasterDest)) {
    const masterAgentsDir = path.join(sinapseMasterDest, 'agents');
    if (fs.existsSync(masterAgentsDir)) {
      for (const file of fs.readdirSync(masterAgentsDir).filter(f => f.endsWith('.md'))) {
        if (writtenAgents.has(file)) continue;
        const agentId = file.replace('.md', '');
        const meta = extractAgentMeta(path.join(masterAgentsDir, file));
        const squadPath = `${sinapseBase}/sinapse`;
        const cmdContent = generateCommandMd(agentId, meta.name, meta.icon, 'sinapse', squadPath, file);
        atomicWriteFileSync(path.join(commandsDir, `${agentId}.md`), cmdContent);
        writtenAgents.add(file);
      }
    }
  }

  // 3. Master entry points (@sinapse, @snps, @sinapse-orqx, @snps-orqx) → rich
  //    Imperator stub. Overwrites the generic command file for the orqx names and
  //    adds the short aliases the user actually types.
  if (fs.existsSync(sinapseMasterDest)) {
    const masterSquadPath = `${sinapseBase}/sinapse`;
    const masterEntryPoints = [
      ['sinapse-orqx', 'sinapse-orqx.md'],
      ['snps-orqx', 'snps-orqx.md'],
      ['sinapse', 'sinapse-orqx.md'],
      ['snps', 'snps-orqx.md'],
    ];
    for (const [id, personaFile] of masterEntryPoints) {
      const personaPath = `${masterSquadPath}/agents/${personaFile}`;
      const stub = generateMasterStub(id, personaPath, masterSquadPath, squads);
      atomicWriteFileSync(path.join(commandsDir, `${id}.md`), stub);
      writtenAgents.add(`${id}.md`);
    }
  }

  return { writtenAgents, totalAgents: writtenAgents.size };
}

module.exports = {
  generateCommandMd,
  generateMasterStub,
  regenerateAgentCommands,
  countCoreAgents,
};
