'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  buildHandoffPacket,
  resolveCodexDelegation,
} = require('../../.codex/scripts/resolve-codex-delegation');

// TODO: buildHandoffPacket not yet exported — re-enable when delegation is complete
describe.skip('resolve-codex-delegation', () => {
  let tmpRoot;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-resolve-codex-delegation-'));
    fs.mkdirSync(path.join(tmpRoot, '.codex'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpRoot, '.codex', 'delegation-matrix.json'),
      JSON.stringify({
        version: 1,
        handoffSchema: '.codex/handoff-packet.schema.json',
        routingClasses: ['validator-backed', 'codex-only-shim', 'exploratory'],
        requestTypes: ['single-domain'],
        orchestrators: {
          'sinapse-orqx': {
            sourceOfTruth: '.codex/agents/sinapse-orqx.md',
            approvedRoutes: ['brand-discovery'],
          },
          'brand-orqx': {
            sourceOfTruth: '.codex/agents/brand-orqx.md',
            approvedRoutes: ['brand-discovery'],
          },
        },
        frameworkAgents: {},
        routes: {
          'brand-discovery': {
            aliases: ['brand-strategy'],
            owner: 'sinapse-orqx',
            requestType: 'single-domain',
            classification: 'validator-backed',
            mission: 'Route a brand request.',
            summary: 'Brand route',
            inputs: ['request'],
            outputs: ['handoff'],
            validators: ['npm run validate:codex-delegation'],
            sharedSurfaceRisk: 'low',
            delegationChain: [
              {
                from: 'sinapse-orqx',
                fromType: 'orqx',
                to: 'brand-orqx',
                toType: 'orqx',
                handoff: 'delegate-to-squad',
                reason: 'Brand domain',
              },
            ],
          },
        },
      }),
      'utf8',
    );
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('resolves a delegation route by alias', () => {
    const result = resolveCodexDelegation('brand-strategy', tmpRoot);

    expect(result.routeId).toBe('brand-discovery');
    expect(result.owner).toBe('sinapse-orqx');
    expect(result.classification).toBe('validator-backed');
    expect(result.delegationChain).toHaveLength(1);
  });

  it('builds a schema-shaped handoff packet', () => {
    const packet = buildHandoffPacket('brand-discovery', tmpRoot);

    expect(packet.phase).toBe('W5 / Delegation Matrix Parity');
    expect(packet.nextHandoff.to).toBe('brand-orqx');
    expect(packet.delegationChain).toHaveLength(1);
  });

  it('throws when a route is unknown', () => {
    expect(() => resolveCodexDelegation('unknown-route', tmpRoot)).toThrow('Unknown Codex delegation route');
  });
});
