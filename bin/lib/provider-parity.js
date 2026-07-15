'use strict';

function assertProviderAdapterParity(llmChoice, adapters, canonicalCount) {
  if (!['claude-code', 'codex', 'both'].includes(llmChoice)) {
    throw new Error(`Invalid LLM choice for provider parity: ${llmChoice}`);
  }
  const providerCounts = [];
  if (llmChoice === 'claude-code' || llmChoice === 'both') {
    providerCounts.push(['Claude Code', adapters.claude.length]);
  }
  if (llmChoice === 'codex' || llmChoice === 'both') {
    providerCounts.push(['Codex', adapters.codex.length]);
  }
  const divergent = providerCounts.filter(([, count]) => count !== canonicalCount);
  if (divergent.length) {
    const details = divergent.map(([provider, count]) => `${provider}: ${count}/${canonicalCount}`).join(', ');
    throw new Error(`Provider adapter parity failed (${details})`);
  }
  return canonicalCount;
}

module.exports = { assertProviderAdapterParity };
