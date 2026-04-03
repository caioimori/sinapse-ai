#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const SHARED_GREETING_SCRIPT = path.join(
  PROJECT_ROOT,
  '.sinapse-ai',
  'development',
  'scripts',
  'generate-greeting.js',
);

function generateFallbackGreeting(agentId) {
  return '## Activation\n\n' +
    `\`${agentId}\` ready\n\n` +
    'Type `*help` to see available commands.';
}

function isGenericSharedFallback(output, agentId) {
  const normalized = String(output || '').trim();
  if (!normalized) return true;

  const genericPatterns = [
    `\u2705 ${agentId} Agent ready\n\nType \`*help\` to see available commands.`,
    `\u2705 Agent ${agentId} loaded`,
    `\ud83d\udc51 ${agentId} Agent ready`,
  ];
  const looksLikeGenericActivation = genericPatterns.some((pattern) => normalized.includes(pattern));
  const hasHelpPrompt = normalized.includes('Type `*help` to see available commands.');
  const hasRichCodexGreeting = normalized.includes('AI Agent Squads for Claude Code');

  return (looksLikeGenericActivation && hasHelpPrompt && !hasRichCodexGreeting);
}

function trySharedGreeting(agentId) {
  if (!fs.existsSync(SHARED_GREETING_SCRIPT)) return '';

  const result = spawnSync(process.execPath, [SHARED_GREETING_SCRIPT, agentId], {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
  });

  const output = String(result.stdout || '').trim();
  if (!output || isGenericSharedFallback(output, agentId)) {
    return '';
  }

  return output;
}

function extractStaticGreeting(agentId) {
  const agentPath = path.join(PROJECT_ROOT, '.codex', 'agents', `${agentId}.md`);
  if (!fs.existsSync(agentPath)) return '';

  const content = fs.readFileSync(agentPath, 'utf8');
  const firstBlock = content.match(
    /When this agent is activated, you MUST display this greeting EXACTLY as your first output[\s\S]*?```([\s\S]*?)```/i,
  );
  const secondBlock = content.match(/Then display:\s*```([\s\S]*?)```/i);

  const parts = [];
  if (firstBlock && firstBlock[1]) {
    parts.push(firstBlock[1].trim());
  }
  if (secondBlock && secondBlock[1]) {
    parts.push(secondBlock[1].trim());
  }

  return parts.join('\n\n').trim();
}

function generateCodexGreeting(agentId) {
  return trySharedGreeting(agentId) ||
    extractStaticGreeting(agentId) ||
    generateFallbackGreeting(agentId);
}

function main() {
  const agentId = process.argv[2];
  if (!agentId) {
    console.error('Usage: node .codex/scripts/generate-codex-greeting.js <agent-id>');
    process.exit(1);
  }

  console.log(generateCodexGreeting(agentId));
}

if (require.main === module) {
  main();
}

module.exports = {
  generateCodexGreeting,
  extractStaticGreeting,
  trySharedGreeting,
  isGenericSharedFallback,
};
