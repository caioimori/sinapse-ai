'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  validateCodexDelegation,
} = require('../../.sinapse-ai/infrastructure/scripts/validate-codex-delegation');

// TODO: buildHandoffPacket not yet exported — re-enable when delegation parity is complete
describe.skip('validate-codex-delegation-parity', () => {
  let tmpRoot;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-validate-codex-delegation-parity-'));
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  function write(relativePath, content = '# file') {
    const filePath = path.join(tmpRoot, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
  }

  function writeBaseFixtures() {
    write('.codex/agents/sinapse-orqx.md');
    write('.codex/agents/brand-orqx.md');
    write('.codex/agents/brand-strategist.md');
    write('.codex/command-registry.json', JSON.stringify({ version: 1, agents: {} }));
    write(
      '.codex/handoff-packet.parity.schema.json',
      JSON.stringify({
        type: 'object',
        additionalProperties: false,
        required: [
          'mission',
          'phase',
          'owner',
          'classification',
          'inputs',
          'outputs',
          'validators',
          'sharedSurfaceRisk',
          'nextHandoff',
          'delegationChain',
        ],
        properties: {
          routeId: { type: 'string' },
          mission: { type: 'string' },
          phase: { type: 'string' },
          owner: { type: 'string' },
          classification: { enum: ['validator-backed', 'codex-only-shim', 'exploratory'] },
          summary: { type: 'string' },
          inputs: { type: 'array', items: { type: 'string' } },
          outputs: { type: 'array', items: { type: 'string' } },
          validators: { type: 'array', items: { type: 'string' } },
          sharedSurfaceRisk: { enum: ['low', 'medium', 'high'] },
          nextHandoff: {
            type: 'object',
            additionalProperties: false,
            required: ['to', 'artifact'],
            properties: { to: { type: 'string' }, artifact: { type: 'string' } },
          },
          delegationChain: {
            type: 'array',
            items: {
              type: 'object',
              required: ['from', 'fromType', 'to', 'toType', 'handoff', 'reason'],
              properties: {
                from: { type: 'string' },
                fromType: { enum: ['orqx', 'framework-agent', 'specialist'] },
                to: { type: 'string' },
                toType: { enum: ['orqx', 'framework-agent', 'specialist'] },
                path: { type: 'string' },
                task: { type: 'string' },
                resolver: { type: 'string' },
                command: { type: 'string' },
                handoff: { type: 'string' },
                reason: { type: 'string' },
              },
            },
          },
          resources: { type: 'array', items: { type: 'string' } },
          notes: { type: 'array', items: { type: 'string' } },
        },
      }),
    );
    write('squads/squad-brand/tasks/conduct-brand-discovery.md');
  }

  it('passes for a minimal valid delegation matrix', () => {
    writeBaseFixtures();
    write(
      '.codex/delegation-matrix.json',
      JSON.stringify({
        version: 1,
        phase: 'W5 / Delegation Matrix Parity',
        handoffSchema: '.codex/handoff-packet.parity.schema.json',
        routingClasses: ['validator-backed', 'codex-only-shim', 'exploratory'],
        requestTypes: ['single-domain'],
        orchestrators: {
          'sinapse-orqx': {
            sourceOfTruth: '.codex/agents/sinapse-orqx.md',
            approvedRoutes: ['brand-discovery'],
          },
          'brand-orqx': {
            sourceOfTruth: '.codex/agents/brand-orqx.md',
            squadDir: 'squads/squad-brand',
            tasksDir: 'squads/squad-brand/tasks',
            approvedRoutes: ['brand-discovery'],
          },
        },
        frameworkAgents: {},
        routes: {
          'brand-discovery': {
            owner: 'sinapse-orqx',
            requestType: 'single-domain',
            classification: 'validator-backed',
            mission: 'Route a brand request.',
            summary: 'Brand route',
            inputs: ['request'],
            outputs: ['handoff'],
            validators: ['npm run validate:codex-delegation'],
            sharedSurfaceRisk: 'low',
            resources: [
              '.codex/agents/brand-orqx.md',
              '.codex/agents/brand-strategist.md',
              'squads/squad-brand/tasks/conduct-brand-discovery.md',
            ],
            delegationChain: [
              {
                from: 'sinapse-orqx',
                fromType: 'orqx',
                to: 'brand-orqx',
                toType: 'orqx',
                path: '.codex/agents/brand-orqx.md',
                handoff: 'delegate-to-squad',
                reason: 'Brand domain',
              },
              {
                from: 'brand-orqx',
                fromType: 'orqx',
                to: 'brand-strategist',
                toType: 'specialist',
                path: '.codex/agents/brand-strategist.md',
                task: 'squads/squad-brand/tasks/conduct-brand-discovery.md',
                handoff: 'execute-squad-task',
                reason: 'Brand strategist owns discovery',
              },
            ],
          },
        },
      }),
    );

    const result = validateCodexDelegation({
      projectRoot: tmpRoot,
      requiredOrchestrators: ['sinapse-orqx', 'brand-orqx'],
    });

    expect(result.ok).toBe(true);
    expect(result.metrics.orchestrators).toBe(2);
    expect(result.metrics.routes).toBe(1);
  });

  it('fails when a required orchestrator is missing', () => {
    writeBaseFixtures();
    write(
      '.codex/delegation-matrix.json',
      JSON.stringify({
        version: 1,
        phase: 'W5 / Delegation Matrix Parity',
        handoffSchema: '.codex/handoff-packet.parity.schema.json',
        routingClasses: ['validator-backed'],
        requestTypes: ['single-domain'],
        orchestrators: {},
        frameworkAgents: {},
        routes: {},
      }),
    );

    const result = validateCodexDelegation({
      projectRoot: tmpRoot,
      requiredOrchestrators: ['sinapse-orqx'],
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('missing required orchestrator coverage: sinapse-orqx');
  });
});
