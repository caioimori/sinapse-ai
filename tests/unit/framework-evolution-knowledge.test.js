'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const k = require('../../scripts/framework-evolution/knowledge.cjs');
const j = require('../../scripts/framework-evolution/jev.cjs');
const payload = {model: j.MODEL, state: 'An evidence-backed claim.', questions: {support: {type: 'noul', instructions: 'Is the claim supported?'}}};
const response = {model: j.MODEL, answers: {support: {type: 'noul', noul: 0.7}}, usage: {input_tokens: 20, output_tokens: 1}};
const http = () => ({ok: true, status: 200, json: async () => structuredClone(response)});
describe('grounded knowledge corpus', () => {
  test('172 agents, 17 squads plus core and explicit specialist gaps', () => {
    const corpus = k.loadCorpus();
    expect(k.validateCorpus(corpus)).toEqual({valid: true, errors: []});
    expect(corpus.competencies.agents).toHaveLength(172);
    expect(new Set(corpus.competencies.agents.map(a => a.squad)).size).toBe(18);
    expect(corpus.competencies.agents.every(a => a.coverage === 'gap')).toBe(true);
    for (const a of corpus.competencies.agents) {
      const result = k.retrieveKnowledge({agentId: a.agentId});
      expect(result.items.length).toBeGreaterThan(0);
      expect(JSON.stringify(result).length).toBe(result.charsUsed);
      expect(result.charsUsed).toBeLessThanOrEqual(6000);
    }
  });
  test('missing source and incompatible evidence fail closed', () => {
    const missing = k.loadCorpus(); missing.sources.sources = [];
    expect(k.validateCorpus(missing).valid).toBe(false);
    const wrong = k.loadCorpus(); wrong.heuristics.heuristics[0].evidence[0].excerpt = 'not in captured excerpt';
    expect(k.validateCorpus(wrong).valid).toBe(false);
    const hash = k.loadCorpus(); hash.sources.sources[0].excerpt += 'changed';
    expect(k.validateCorpus(hash).valid).toBe(false);
  });
  test('malformed record types return invalid rather than crashing', () => {
    for (const section of ['sources', 'heuristics', 'competencies']) {
      const corpus = k.loadCorpus();
      corpus[section][section === 'competencies' ? 'agents' : section][0] = null;
      expect(k.validateCorpus(corpus).valid).toBe(false);
    }
    const corpus = k.loadCorpus(); corpus.sources.sources[0].claims = 2; corpus.sources.sources[0].excerpt = 2;
    expect(k.validateCorpus(corpus).valid).toBe(false);
  });
  test('unknown IDs/traversal and mismatched squad rejected', () => {
    for (const agentId of ['../kb-architect', 'not-an-agent', 'C:\\secret']) expect(() => k.retrieveKnowledge({agentId})).toThrow();
    expect(() => k.retrieveKnowledge({agentId: 'kb-architect', squad: 'core'})).toThrow();
  });
  test('budgets never truncate citations or emit over budget', () => {
    expect(() => k.retrieveKnowledge({agentId: 'kb-architect', maxChars: 1})).toThrow();
    const result = k.retrieveKnowledge({agentId: 'kb-architect', maxChars: 600});
    expect(result.items).toEqual([]);
    expect(result.charsUsed).toBeLessThanOrEqual(600);
    expect(() => k.retrieveKnowledge({agentId: 'kb-architect', maxChars: NaN})).toThrow();
  });
  test('same agent retrieves distinct knowledge for rendering stalls and VRAM tasks', () => {
    const common={agentId:'threejs-architect',maxItems:1};
    const stalls=k.retrieveKnowledge({...common,task:{command:'fix-main-thread-stalls',title:'WebGL consultas síncronas readPixels bloqueando thread'}});
    const memory=k.retrieveKnowledge({...common,task:{command:'optimize-vram-budget',title:'VRAM por pixel, DPR e buffer para partículas'}});
    expect(stalls.items[0].id).toBe('h-webgl-main-thread');
    expect(memory.items[0].id).toBe('h-webgl-resource-budget');
    const absent=k.retrieveKnowledge({...common,task:{title:'xylophone zebras'}});
    expect(absent.items).toEqual([]); expect(absent.gaps.join(' ')).toMatch('task-relevant');
    expect(()=>k.retrieveKnowledge({...common,task:{text:'x'.repeat(4001)}})).toThrow();
  });
  test('reference-only citations require opt-in, inferred status and known locator', () => {
    const corpus=k.loadCorpus(); corpus.heuristics.heuristics[0].evidence[0].referenceOnly=false;
    expect(k.validateCorpus(corpus).valid).toBe(false);
    const direct=k.loadCorpus(); direct.heuristics.heuristics[0].status='direct';
    expect(k.validateCorpus(direct).valid).toBe(false);
    const wrong=k.loadCorpus(); wrong.heuristics.heuristics[0].evidence[0].locator='other section';
    expect(k.validateCorpus(wrong).valid).toBe(false);
  });
});
describe('Jev offline and paid guardrails', () => {
  test('offline prepares contextual batch without a transport call', async () => {
    const transport = jest.fn();
    expect((await j.execute(payload, {transport})).called).toBe(false);
    expect(transport).not.toHaveBeenCalled();
    const batch = j.planBatch(k.loadCorpus());
    expect(batch.squads).toBe(17);
    expect(batch.groups).toBe(18);
    expect(batch.includesCore).toBe(true);
    expect(new Set(batch.plans.map(p => p.squad)).size).toBe(18);
    expect(batch.plans.filter(p => p.squad === 'core')).toHaveLength(1);
    expect(batch.plans.filter(p => p.squad !== 'core')).toHaveLength(17);
    expect(batch.called).toBe(false);
    expect(batch.plans.every(p => p.citationStringMatch && !p.called)).toBe(true);
    const corpusIds = k.loadCorpus().heuristics.heuristics.map(h => h.id).sort();
    const mappedIds = batch.plans.flatMap(p => p.questionMap.map(m => m.heuristicId)).sort();
    expect(mappedIds).toEqual(corpusIds);
    expect(new Set(mappedIds).size).toBe(67);
    const saved = JSON.parse(fs.readFileSync(path.join(__dirname, '../../research/framework-evolution/plan-batch.json'), 'utf8'));
    expect(saved.plans).toEqual(batch.plans);
    expect(saved.receipt.actualCalls).toBe(0);
    expect(saved.receipt.actualSpendUsd).toBe(0);
    expect(batch.heuristicCount).toBe(67);
    expect(batch.questionCount).toBe(134);
    expect(batch.maximumUsd).toBeCloseTo(0.048384, 8);
    for (const prepared of batch.plans) {
      expect(prepared.admission.stateBytes + prepared.admission.longestQuestionBytes + 4096).toBeLessThanOrEqual(32000);
      expect(prepared.admission.stateBytes + prepared.admission.questionsBytes + 4096).toBeLessThanOrEqual(64000);
      const answers = {};
      for (const mapping of prepared.questionMap) {
        const rule = prepared.payload.state.heuristics.find(h => h.id === mapping.heuristicId);
        expect(mapping.referenceIds).toEqual(rule.referenceIds);
        expect(mapping.referenceIds.every(id => prepared.payload.state.sources.some(s => s.id === id))).toBe(true);
        expect(prepared.payload.questions[mapping.supportId].type).toBe('choice');
        expect(prepared.payload.questions[mapping.relevanceId].type).toBe('noul');
        answers[mapping.supportId] = {type: 'choice', choice: 'partial', confidence: 0.8, probabilities: {supported: 0.1, partial: 0.8, not_found: 0.1}};
        answers[mapping.relevanceId] = {type: 'noul', noul: 0.7};
      }
      const result = {model: j.MODEL, answers, usage: {input_tokens: 100, output_tokens: 0}};
      expect(j.validateResponse(result, prepared.payload)).toBe(result);
      delete answers[prepared.questionMap[0].supportId];
      expect(() => j.validateResponse(result, prepared.payload)).toThrow('answer keys mismatch');
    }
  });
  test('authorization absent rejects before network', async () => {
    const transport = jest.fn();
    await expect(j.execute(payload, {offline: false, transport})).rejects.toThrow('authorization');
    expect(transport).not.toHaveBeenCalled();
  });
  test('malformed response and overspend usage rejected', () => {
    expect(() => j.validateResponse({...response, answers: {}}, payload)).toThrow();
    expect(() => j.validateResponse({...response, usage: {input_tokens: 64001, output_tokens: 1}}, payload)).toThrow();
    expect(() => j.validateResponse({...response, answers: {support: {type: 'noul', noul: 1.1}}}, payload)).toThrow();
    expect(() => j.plan({...payload, state: 'x'.repeat(32000)})).toThrow();
  });
  test('budget reserves before every attempt and prevents the next retry', async () => {
    const perAttempt = j.plan(payload).reservedUsdPerAttempt;
    const ledger = j.createLedger({authorizedUsd: perAttempt, authorizationId: 'test-fixture-only'});
    const transport = jest.fn(async () => {
      expect(ledger.reservedUsd).toBe(perAttempt);
      return {ok: false, status: 429, headers: {get: () => '0'}};
    });
    await expect(j.execute(payload, {offline: false, authorized: true, apiKey: 'fixture', ledger, transport, maxAttempts: 2})).rejects.toThrow('budget exhausted');
    expect(transport).toHaveBeenCalledTimes(1);
  });
  test('valid response caches by payload/model/pricing and malformed cache rejects', async () => {
    const ledger = j.createLedger({authorizedUsd: 1, authorizationId: 'test-fixture-only'}), cache = new Map(), transport = jest.fn(http);
    const opts = {offline: false, authorized: true, apiKey: 'fixture', ledger, cache, transport};
    expect((await j.execute(payload, opts)).mode).toBe('live');
    expect((await j.execute(payload, opts)).mode).toBe('cache');
    expect(transport).toHaveBeenCalledTimes(1);
    expect(j.plan({...payload, state: 'changed'}).cacheKey).not.toBe(j.plan(payload).cacheKey);
    cache.set(j.plan(payload).cacheKey, {});
    await expect(j.execute(payload, opts)).rejects.toThrow();
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-cache-test-'));
    try { const fileCache = j.createFileCache(directory); fileCache.set(j.plan(payload).cacheKey, response); expect(fileCache.get(j.plan(payload).cacheKey)).toEqual(response); expect(() => fileCache.get('../unsafe')).toThrow(); }
    finally { fs.rmSync(directory, {recursive: true, force: true}); }
  });
  test('total timeout bounds a hanging transport, retries are zero by default', async () => {
    const ledger = j.createLedger({authorizedUsd: 1, authorizationId: 'test-fixture-only'});
    await expect(j.execute(payload, {offline: false, authorized: true, apiKey: 'fixture', ledger, timeoutMs: 20, transport: () => new Promise(() => {})})).rejects.toThrow('timeout');
    const transport = jest.fn(async () => ({ok: false, status: 529}));
    await expect(j.execute(payload, {offline: false, authorized: true, apiKey: 'fixture', ledger, transport})).rejects.toThrow('529');
    expect(transport).toHaveBeenCalledTimes(1);
  });
  test('unsupported questions/models reject before budget, cache or transport', async () => {
    const transport = jest.fn(), reserve = jest.fn(), cache = {get: jest.fn(), set: jest.fn()};
    for (const invalid of [{...payload,model:'jev-latest'}, {...payload,questions:{x:{type:'text',instructions:'generate'}}}, {...payload,questions:{x:{type:'choice',instructions:'choose',criteria:{one:'only'}}}}, {...payload,questions:{x:{type:'score',instructions:'rate',criteria:['only']}}}]) {
      await expect(j.execute(invalid,{offline:false,authorized:true,apiKey:'fixture',ledger:{reserve},transport,cache})).rejects.toThrow();
    }
    expect(transport).not.toHaveBeenCalled(); expect(reserve).not.toHaveBeenCalled(); expect(cache.get).not.toHaveBeenCalled();
  });
  test('oversized unknown top-level field rejects before budget, cache and fetch', async () => {
    const invalid={...payload,extra:'x'.repeat(1000000)};
    const transport=jest.fn(),cache={get:jest.fn(),set:jest.fn()},ledger=j.createLedger({authorizedUsd:1,authorizationId:'test-only'});
    await expect(j.execute(invalid,{offline:false,authorized:true,apiKey:'fixture',ledger,cache,transport})).rejects.toThrow('Unsupported Jev payload field');
    expect(ledger.reservedUsd).toBe(0); expect(cache.get).not.toHaveBeenCalled(); expect(transport).not.toHaveBeenCalled();
    expect(()=>j.plan(invalid)).toThrow('Unsupported Jev payload field');
  });
  test('unsupported vendor question options reject before any effect', async () => {
    const invalid={...payload,questions:{support:{...payload.questions.support,debug:true}}};
    const transport=jest.fn(),ledger=j.createLedger({authorizedUsd:1,authorizationId:'test-only'});
    await expect(j.execute(invalid,{offline:false,authorized:true,apiKey:'fixture',ledger,transport})).rejects.toThrow('Unsupported Jev question field');
    expect(ledger.reservedUsd).toBe(0); expect(transport).not.toHaveBeenCalled();
  });
  test('nonfinite score and confidence, mismatched model and extra answers rejected', () => {
    const scorePayload={model:j.MODEL,state:'text',questions:{s:{type:'score',instructions:'rate',criteria:['low','high']}}};
    const scoreResponse={model:j.MODEL,answers:{s:{type:'score',score:0.5,legend:{0:'low',1:'high'},probabilities:{0:0.5,1:0.5},confidence:0}},usage:{input_tokens:10,output_tokens:1}};
    expect(j.validateResponse(scoreResponse,scorePayload)).toEqual(scoreResponse);
    for(const score of [NaN,Infinity,-Infinity,undefined]) expect(()=>j.validateResponse({...scoreResponse,answers:{s:{...scoreResponse.answers.s,score}}},scorePayload)).toThrow();
    for(const confidence of [NaN,Infinity,-0.1,1.1]) expect(()=>j.validateResponse({...scoreResponse,answers:{s:{...scoreResponse.answers.s,confidence}}},scorePayload)).toThrow();
    expect(()=>j.validateResponse({...response,model:'jev-other'},payload)).toThrow();
    expect(()=>j.validateResponse({...response,answers:{...response.answers,extra:{type:'noul',noul:0.2}}},payload)).toThrow();
  });
  test('JSON-unsafe state rejected before any reservation or paid effect', async () => {
    const cyclic={}; cyclic.self=cyclic;
    const accessor={}; Object.defineProperty(accessor,'value',{enumerable:true,get(){throw new Error('Accessor must never run');}});
    const reserved=JSON.parse('{"__proto__":{"polluted":true}}');
    const transport=jest.fn(),reserve=jest.fn();
    for(const state of [{n:NaN},{n:Infinity},{n:undefined},{n:1n},{n:()=>1},{n:Symbol('unsafe')},cyclic,accessor,reserved,new Date(),Array(2)]) {
      await expect(j.execute({...payload,state},{offline:false,authorized:true,apiKey:'fixture',ledger:{reserve},transport})).rejects.toThrow();
    }
    expect(reserve).not.toHaveBeenCalled(); expect(transport).not.toHaveBeenCalled();
  });
  test('caller mutation between retries cannot change admitted body or key', async () => {
    const mutable=structuredClone(payload), originalBody=JSON.stringify(mutable), originalKey=j.plan(mutable).cacheKey, bodies=[];
    const ledger=j.createLedger({authorizedUsd:1,authorizationId:'test-only'});
    const transport=jest.fn(async (_,options)=>{
      bodies.push(options.body);
      if(bodies.length===1){mutable.state='x'.repeat(1000000);mutable.questions.support.instructions='changed';return{ok:false,status:429,headers:{get:()=> '0'}};}
      return http();
    });
    const result=await j.execute(mutable,{offline:false,authorized:true,apiKey:'fixture',ledger,transport,maxAttempts:2});
    expect(bodies).toEqual([originalBody,originalBody]); expect(result.cacheKey).toBe(originalKey);
    expect(ledger.reservedUsd).toBeCloseTo(j.plan(payload).reservedUsdPerAttempt*2);
  });
  test('concurrent attempts share an atomic ceiling before awaiting transport', async () => {
    const ledger=j.createLedger({authorizedUsd:j.plan(payload).reservedUsdPerAttempt,authorizationId:'test-only'});
    const transport=jest.fn(async()=>{await new Promise(resolve=>setTimeout(resolve,5));return http();});
    const options={offline:false,authorized:true,apiKey:'fixture',ledger,transport};
    const results=await Promise.allSettled([j.execute(payload,options),j.execute({...payload,state:'second request'},options)]);
    expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);
    expect(results.filter(r=>r.status==='rejected')).toHaveLength(1);
    expect(transport).toHaveBeenCalledTimes(1); expect(ledger.reservedUsd).toBe(ledger.authorizedUsd);
  });
  test('contextual cached answers with wrong rubric fail closed without fetch', async () => {
    const p={model:j.MODEL,state:'state',questions:{c:{type:'choice',instructions:'pick',criteria:{yes:'supported',no:'unsupported'}}}};
    const tampered={model:j.MODEL,answers:{c:{type:'choice',choice:'yes',confidence:0.5,probabilities:{yes:0.25,no:0.75}}},usage:{input_tokens:10,output_tokens:1}};
    const transport=jest.fn(),cache=new Map([[j.plan(p).cacheKey,tampered]]),ledger=j.createLedger({authorizedUsd:1,authorizationId:'test-only'});
    await expect(j.execute(p,{offline:false,authorized:true,apiKey:'fixture',ledger,cache,transport})).rejects.toThrow();
    expect(transport).not.toHaveBeenCalled(); expect(ledger.reservedUsd).toBe(0);
  });
  test('timeout applies to response body as well as initial fetch', async () => {
    const ledger=j.createLedger({authorizedUsd:1,authorizationId:'test-only'});
    await expect(j.execute(payload,{offline:false,authorized:true,apiKey:'fixture',ledger,timeoutMs:20,transport:async()=>({ok:true,status:200,json:()=>new Promise(()=>{})})})).rejects.toThrow('timeout');
  });
});
