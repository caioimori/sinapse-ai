'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const routing = require('../../scripts/expert-evolution/routing.cjs');
const operational = require('../../scripts/expert-evolution/operational.cjs');
const {buildRuntimeContext} = require('../../scripts/framework-evolution/runtime.cjs');
const root = path.resolve(__dirname, '../..');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const request = {root, agentId:'animations-orqx', command:'orchestrate-animation-project', target:'squads/squad-animations/tasks/orchestrate-animation-project.md', resolvedBy:'activator'};

describe('task-first specialist routing with exact ownership', () => {
  test('real routing resolves every animation specialist to a cited owned task without authorizing the orchestrator', () => {
    const map = routing.getRoutingMap(request);
    expect(map.routes).toHaveLength(8);
    expect(map.executionAuthorized).toBe(false);
    for (const route of map.routes) {
      expect(route.executionAuthorized).toBe(false);
      expect(route.mode).toBe('delegate');
      expect(route.ownershipBasis).toBe('exact-owner');
      expect(route.taskSha256).toBe(sha(fs.readFileSync(path.join(root, route.target))));
      expect(route.canonical.sha256).toBe(sha(fs.readFileSync(path.join(root, route.canonical.path))));
    }
    expect(map).toEqual(routing.getRoutingMap(request));
  });
  test('another exact specialist task can be resolved instead of the bounded representative', () => {
    const route = routing.resolveExecutorTask({root, orchestratorId:'animations-orqx', ownerId:'css-motion-artist', command:'create-css-animation'});
    expect(route).toMatchObject({ownerId:'css-motion-artist', command:'create-css-animation', executionAuthorized:false});
  });
  test('compact metadata preserves every route path and hash using explicit columns and base', () => {
    const full = routing.getRoutingMap(request), compact = routing.getRoutingMap({...request, compact:true});
    expect(compact.routes).toHaveLength(full.routes.length);
    compact.routes.forEach((row, index) => {
      const entry = Object.fromEntries(compact.columns.map((column, i) => [column, row[i]]));
      expect(compact.basePath+entry.target).toBe(full.routes[index].target);
      expect(compact.basePath+entry.canonicalPath).toBe(full.routes[index].canonical.path);
      expect(entry.canonicalSha256).toBe(full.routes[index].canonical.sha256);
      expect(entry.taskSha256).toBe(full.routes[index].taskSha256);
    });
  });
  test.each([
    {orchestratorId:'css-motion-artist', ownerId:'shader-artist', command:'create-custom-shader'},
    {orchestratorId:'animations-orqx', ownerId:'ad-copywriter', command:'write-ad-copy-variations'},
    {orchestratorId:'animations-orqx', ownerId:'css-motion-artist', command:'create-custom-shader'},
    {orchestratorId:'animations-orqx', ownerId:'../shader-artist', command:'create-custom-shader'},
    {orchestratorId:'animations-orqx', ownerId:'invented-owner', command:'create-custom-shader'},
    {orchestratorId:'animations-orqx', ownerId:'shader-artist', command:'../create-custom-shader'},
  ])('foreign/discovery/unknown/path-traversal route is rejected: %j', options => {
    expect(() => routing.resolveExecutorTask({root, ...options})).toThrow();
  });
  test('task-first maps reject an unresolved current command and insufficient budget', () => {
    expect(() => routing.getRoutingMap({...request, command:'invented'})).toThrow();
    expect(() => routing.getRoutingMap({...request, maxChars:256})).toThrow('budget');
    expect(routing.getRoutingMap({...request, agentId:'css-motion-artist'})).toBeNull();
  });
  test('stale operational candidate cannot silently borrow current authority', () => {
    const program = JSON.parse(JSON.stringify(operational.loadContracts(root)));
    const owner = program.contracts.find(contract => contract.agentId === 'css-motion-artist');
    for (const task of owner.tasks) task.sha256 = '0'.repeat(64);
    const spy = jest.spyOn(operational, 'loadContracts').mockReturnValue(program);
    try { expect(() => routing.getRoutingMap(request)).toThrow('Stale routing operational'); }
    finally { spy.mockRestore(); }
  });
  test.each([
    ['animations-orqx', 'animations-orqx', request.command, request.target, 'activator'],
    ['sinapse-animations', 'animations-orqx', request.command, request.target, 'activator'],
    ['sinapse-orqx', 'snps-orqx', 'route', '.codex/tasks/route-sinapse-request.md', 'registry'],
    ['css-motion-artist', 'css-motion-artist', 'create-css-animation', 'squads/squad-animations/tasks/create-css-animation.md', 'activator'],
  ])('zero/duplicate canonical contracts fail before task authorization, including aliases: %s', (agentId, canonicalId, command, target, resolvedBy) => {
    const realRead = fs.readFileSync, file = path.join(root, operational.FILE);
    const original = JSON.parse(realRead(file, 'utf8'));
    for (const duplicate of [false, true]) {
      const program = JSON.parse(JSON.stringify(original));
      const selected = program.contracts.find(contract => contract.agentId === canonicalId);
      if (duplicate) program.contracts.push({...selected});
      else program.contracts = program.contracts.filter(contract => contract.agentId !== canonicalId);
      const spy = jest.spyOn(fs, 'readFileSync').mockImplementation((readPath, ...args) => path.resolve(String(readPath)) === file ? JSON.stringify(program) : realRead(readPath, ...args));
      try {
        expect(() => operational.getOperationalContract({root, agentId, command, target, resolvedBy, requireExecution:true})).toThrow('Missing/ambiguous operational canonical contract '+canonicalId);
        if (canonicalId === 'animations-orqx') expect(() => routing.getRoutingMap({...request, agentId})).toThrow('Missing/ambiguous operational canonical contract '+canonicalId);
      } finally { spy.mockRestore(); }
    }
  });
  test('stale and ambiguous bindings are rejected independently of discovery', () => {
    const realRead = fs.readFileSync;
    const file = path.join(root, 'research/expert-evolution/task-bindings.json');
    for (const ambiguous of [false, true]) {
      const bindings = JSON.parse(realRead(file, 'utf8'));
      const binding = bindings.bindings.find(entry => entry.agentId === 'css-motion-artist' && entry.command === 'create-css-animation');
      if (ambiguous) bindings.bindings.push({...binding}); else binding.taskSha256 = '0'.repeat(64);
      const spy = jest.spyOn(fs, 'readFileSync').mockImplementation((target, ...args) => path.resolve(String(target)) === file ? JSON.stringify(bindings) : realRead(target, ...args));
      try { expect(() => routing.resolveExecutorTask({root, orchestratorId:'animations-orqx', ownerId:'css-motion-artist', command:'create-css-animation'})).toThrow(ambiguous ? 'Ambiguous' : 'Stale'); }
      finally { spy.mockRestore(); }
    }
  });
  test('runtime reserves complete routes while preserving existing shared caps', () => {
    const context = buildRuntimeContext({root, agentId:'animations-orqx', task:request.command, contextOnly:true});
    expect(context.capsule.routing.routes).toHaveLength(8);
    expect(context.charsUsed).toBe(JSON.stringify(context).length);
    expect(context.charsUsed).toBeLessThanOrEqual(12000);
    expect(JSON.stringify(context.knowledge).length).toBeLessThanOrEqual(context.knowledge.maxChars);
    expect(context.knowledge.maxChars).toBeLessThanOrEqual(6000);
    expect(JSON.stringify(context.profile).length).toBeLessThanOrEqual(3000);
    expect(() => buildRuntimeContext({root, agentId:'animations-orqx', task:request.command, contextOnly:true, maxChars:8000})).toThrow(/budget/);
    const specialist = buildRuntimeContext({root, agentId:'css-motion-artist', task:'create-css-animation', contextOnly:true});
    expect(specialist.capsule.routing).toBeUndefined();
  });
  test('partial routing installation fails closed only for squad orchestrators', () => {
    const realExists = fs.existsSync;
    const missingPath = path.join(root, 'scripts/expert-evolution/routing.cjs');
    const spy = jest.spyOn(fs, 'existsSync').mockImplementation(target => path.resolve(String(target)) === missingPath ? false : realExists(target));
    try {
      expect(() => buildRuntimeContext({root, agentId:'animations-orqx', task:request.command, contextOnly:true})).toThrow('Partial squad routing installation');
      expect(buildRuntimeContext({root, agentId:'snps-orqx', task:'route', contextOnly:true}).capsule.routing).toBeUndefined();
      expect(buildRuntimeContext({root, agentId:'css-motion-artist', task:'create-css-animation', contextOnly:true}).capsule.routing).toBeUndefined();
    } finally { spy.mockRestore(); }
  });
});
