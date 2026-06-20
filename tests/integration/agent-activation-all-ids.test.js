/**
 * Regression: every id in ALL_AGENT_IDS must resolve to a real agent definition
 * file, so the activation pipeline renders the RICH greeting (Role + Project Status
 * + Commands) instead of the degraded "<id> Agent ready" fallback.
 *
 * Guards the bug fixed in fix-agent-activation-alias-resolution: short-form ids
 * (dev/qa/pm/po/sm) and 'sinapse-orqx' previously resolved to '<id>.md' (missing),
 * because AgentConfigLoader built the path from the raw id without consulting the
 * canonical ALIASES map (files are developer.md / quality-gate.md / snps-orqx.md / ...).
 */

'use strict';

const { AgentConfigLoader } = require('../../.sinapse-ai/development/scripts/agent-config-loader');
const { ALL_AGENT_IDS } = require('../../.sinapse-ai/development/scripts/unified-activation-pipeline');

describe('agent activation — every ALL_AGENT_IDS id resolves to a real definition', () => {
  it('exposes a non-empty id list', () => {
    expect(Array.isArray(ALL_AGENT_IDS)).toBe(true);
    expect(ALL_AGENT_IDS.length).toBeGreaterThan(0);
  });

  it.each(ALL_AGENT_IDS)('loads a valid agent definition for "%s" (no fallback)', async (agentId) => {
    const loader = new AgentConfigLoader(agentId);
    let def;
    await expect(
      (async () => {
        def = await loader.loadAgentDefinition();
        return def;
      })(),
    ).resolves.toBeTruthy();

    // A real definition has an agent block with an id — the degraded fallback path
    // throws "Agent file not found" before reaching here.
    expect(def).toBeTruthy();
    expect(def.agent).toBeTruthy();
    expect(typeof def.agent.id).toBe('string');
    expect(def.agent.id.length).toBeGreaterThan(0);
  });
});
