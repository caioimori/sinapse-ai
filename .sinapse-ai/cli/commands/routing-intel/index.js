#!/usr/bin/env node
'use strict';

/**
 * sinapse routing-intel — Routing Intelligence Analyzer
 *
 * Analyzes the routing configuration across all orchestrators:
 * - Delegation matrix completeness
 * - Cross-squad handoff coverage
 * - Routing pattern conflicts
 * - Agent reachability (can every agent be reached via routing?)
 *
 * Usage:
 *   sinapse routing-intel                 # Full routing analysis
 *   sinapse routing-intel analyze         # Deep analysis with recommendations
 *   sinapse routing-intel --json          # JSON output
 */

const fs = require('fs');
const path = require('path');

function findProjectRoot() {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.sinapse-ai'))) return dir;
    dir = path.dirname(dir);
  }
  return process.cwd();
}

function extractDelegation(content) {
  const delegations = [];
  // Match delegation tables: | pattern | agent |
  const tableRows = content.match(/\|[^|]+\|[^|]+\|/g) || [];
  for (const row of tableRows) {
    const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 2 && cells[1].startsWith('@')) {
      delegations.push({ pattern: cells[0], target: cells[1] });
    }
  }

  // Match inline delegations: → @agent, delegate to @agent
  const inlineMatches = content.match(/(?:→|delegate to|route to)\s+@([\w-]+)/gi) || [];
  for (const match of inlineMatches) {
    const agentMatch = match.match(/@([\w-]+)/);
    if (agentMatch) delegations.push({ pattern: 'inline', target: `@${agentMatch[1]}` });
  }

  return delegations;
}

function extractHandoffs(content) {
  const handoffs = { inbound: [], outbound: [] };

  // Look for inbound/outbound sections
  const inboundMatch = content.match(/###?\s*Inbound[\s\S]*?(?=###?\s*Outbound|###?\s*[A-Z]|$)/i);
  if (inboundMatch) {
    const squads = inboundMatch[0].match(/@[\w-]+|squad-[\w-]+/g) || [];
    handoffs.inbound = [...new Set(squads)];
  }

  const outboundMatch = content.match(/###?\s*Outbound[\s\S]*?(?=###?\s*[A-Z]|##\s|$)/i);
  if (outboundMatch) {
    const squads = outboundMatch[0].match(/@[\w-]+|squad-[\w-]+/g) || [];
    handoffs.outbound = [...new Set(squads)];
  }

  return handoffs;
}

async function runRoutingIntel(options = {}) {
  const root = findProjectRoot();
  const squadsDir = path.join(root, 'squads');

  if (!fs.existsSync(squadsDir)) {
    console.error('No squads/ directory found.');
    process.exit(1);
  }

  const squadDirs = fs.readdirSync(squadsDir)
    .filter((d) => d.startsWith('squad-') && fs.statSync(path.join(squadsDir, d)).isDirectory());

  const routingMap = [];
  const allAgents = new Set();
  const reachableAgents = new Set();

  for (const squad of squadDirs) {
    const agentsDir = path.join(squadsDir, squad, 'agents');
    if (!fs.existsSync(agentsDir)) continue;

    const agentFiles = fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md'));
    for (const file of agentFiles) {
      const agentId = file.replace('.md', '');
      allAgents.add(agentId);
    }

    // Find orchestrator
    const orqxFile = agentFiles.find((f) => f.includes('-orqx'));
    if (!orqxFile) continue;

    const content = fs.readFileSync(path.join(agentsDir, orqxFile), 'utf8');
    const delegations = extractDelegation(content);
    const handoffs = extractHandoffs(content);

    // Mark delegated agents as reachable
    for (const d of delegations) {
      const target = d.target.replace('@', '');
      reachableAgents.add(target);
    }

    routingMap.push({
      squad,
      orchestrator: orqxFile.replace('.md', ''),
      delegations: delegations.length,
      handoffs,
      hasRoutingIntel: /routing intelligence|routing table/i.test(content),
      hasDelegationMatrix: /delegation matrix|delegation|delegacao/i.test(content),
    });
  }

  // Find unreachable agents (not in any delegation)
  const unreachable = [...allAgents].filter((a) => !reachableAgents.has(a) && !a.includes('-orqx'));

  if (options.json) {
    console.log(JSON.stringify({
      squads: routingMap,
      totalAgents: allAgents.size,
      reachableAgents: reachableAgents.size,
      unreachableAgents: unreachable,
      coverage: Math.round((reachableAgents.size / allAgents.size) * 100),
    }, null, 2));
    return;
  }

  // Pretty output
  console.log(`\n  SINAPSE Routing Intelligence Report`);
  console.log(`  ${'═'.repeat(55)}\n`);

  console.log(`  Agents: ${allAgents.size} total | ${reachableAgents.size} reachable | ${unreachable.length} unreachable`);
  console.log(`  Coverage: ${Math.round((reachableAgents.size / allAgents.size) * 100)}%\n`);

  console.log(`  Squad Routing Matrix:`);
  console.log(`  ${'─'.repeat(55)}`);

  for (const entry of routingMap) {
    const routing = entry.hasRoutingIntel ? '✓' : '✗';
    const deleg = entry.hasDelegationMatrix ? '✓' : '✗';
    const inCount = entry.handoffs.inbound.length;
    const outCount = entry.handoffs.outbound.length;

    console.log(`  ${entry.squad.padEnd(25)} ${entry.delegations}d | in:${inCount} out:${outCount} | routing:${routing} deleg:${deleg}`);
  }

  if (options.analyze && unreachable.length > 0) {
    console.log(`\n  Unreachable Agents (${unreachable.length}):`);
    for (const agent of unreachable.slice(0, 15)) {
      console.log(`    ⚠ ${agent}`);
    }
    if (unreachable.length > 15) console.log(`    ... and ${unreachable.length - 15} more`);
  }

  console.log('');
}

module.exports = { runRoutingIntel };

if (require.main === module) {
  const args = process.argv.slice(2);
  runRoutingIntel({
    json: args.includes('--json'),
    analyze: args.includes('analyze'),
  }).catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
