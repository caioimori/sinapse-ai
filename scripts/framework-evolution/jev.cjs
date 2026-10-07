'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const {stableRead} = require('../expert-evolution/file-io.cjs');
const MODEL = 'jev-1.13.0';
const MAX_RESPONSE_BYTES = 65536;
const PRICING = Object.freeze({model: MODEL, inputUsdPerMillion: 0.042, outputUsdPerMillion: 0, readAt: '2026-10-02', source: 'https://docs.typesafe.ai/models'});
const object = v => v && typeof v === 'object' && !Array.isArray(v);
const prob = v => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1;
const validText = v => typeof v === 'string' && v.trim().length > 0;
function assertJsonSafe(value, ancestors = new Set()) {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return;
  if (typeof value === 'number' && Number.isFinite(value)) return;
  if (typeof value !== 'object' || ancestors.has(value)) throw new Error('Payload must contain finite JSON-safe data');
  const prototype = Object.getPrototypeOf(value);
  const plainObject = prototype === null || (Object.getPrototypeOf(prototype) === null && Object.getOwnPropertyDescriptor(prototype, 'constructor')?.value?.name === 'Object');
  if (!Array.isArray(value) && !plainObject) throw new Error('Payload must contain plain JSON-safe objects');
  ancestors.add(value);
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (Array.isArray(value) && key === 'length') continue;
    if (['__proto__', 'prototype', 'constructor'].includes(key) || descriptor.get || descriptor.set) throw new Error('Reserved/accessor payload key');
    assertJsonSafe(descriptor.value, ancestors);
  }
  if (Object.getOwnPropertySymbols(value).length || (Array.isArray(value) && Object.keys(value).length !== value.length)) throw new Error('Non-JSON array/symbol payload');
  ancestors.delete(value);
}
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (object(value)) return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
function validatePayload(payload) {
  assertJsonSafe(payload);
  if (!object(payload) || Object.keys(payload).some(key => !['model', 'state', 'questions'].includes(key))) throw new Error('Unsupported Jev payload field');
  if (!object(payload) || payload.model !== MODEL || !(['string', 'object'].includes(typeof payload.state)) || payload.state === null || !object(payload.questions) || !Object.keys(payload.questions).length) throw new Error('Invalid Jev payload');
  // Conservative admission bound in UTF-8 bytes; this is not a tokenizer estimate.
  const stateBytes = Buffer.byteLength(JSON.stringify(payload.state), 'utf8');
  let questionsBytes = 0, longest = 0;
  for (const [qid, q] of Object.entries(payload.questions)) {
    if (!object(q) || Object.keys(q).some(key => !['type', 'instructions', 'criteria'].includes(key))) throw new Error('Unsupported Jev question field');
    if (!/^[a-z0-9_-]+$/i.test(qid) || !object(q) || !['noul', 'choice', 'score'].includes(q.type) || !validText(q.instructions)) throw new Error('Invalid Jev question');
    if (q.type === 'choice' && (!object(q.criteria) || Object.keys(q.criteria).length < 2 || Object.keys(q.criteria).length > 255 || !Object.values(q.criteria).every(v => v === null || validText(v)))) throw new Error('Invalid Choice criteria');
    if (q.type === 'score' && (!Array.isArray(q.criteria) || q.criteria.length < 2 || q.criteria.length > 10 || !q.criteria.every(validText))) throw new Error('Invalid Score criteria');
    if (q.type === 'noul' && q.criteria !== undefined && (!object(q.criteria) || Object.keys(q.criteria).some(k => !['true', 'false'].includes(k)) || !Object.values(q.criteria).every(validText))) throw new Error('Invalid Noul criteria');
    const size = Buffer.byteLength(JSON.stringify(q), 'utf8');
    questionsBytes += size; longest = Math.max(longest, size);
  }
  if (stateBytes + longest + 4096 > 32000 || stateBytes + questionsBytes + 4096 > 64000) throw new Error('Conservative Jev context bound exceeded');
  return {stateBytes, questionsBytes, longestQuestionBytes: longest, tokenEstimate: null, reservationTokensPerAttempt: 64000};
}
function validateResponse(response, payload) {
  validatePayload(payload);
  assertJsonSafe(response);
  if (Buffer.byteLength(JSON.stringify(response),'utf8') > MAX_RESPONSE_BYTES) throw new Error('Jev response exceeds byte bound');
  if (!object(response) || response.model !== payload.model || !object(response.answers) || !object(response.usage) || !Number.isSafeInteger(response.usage.input_tokens) || response.usage.input_tokens < 0 || response.usage.input_tokens > 64000 || !Number.isSafeInteger(response.usage.output_tokens) || response.usage.output_tokens < 0) throw new Error('Malformed Jev response/usage');
  const keys = Object.keys(payload.questions);
  if (Object.keys(response.answers).length !== keys.length || keys.some(k => !Object.hasOwn(response.answers, k))) throw new Error('Jev answer keys mismatch');
  for (const key of keys) {
    const q = payload.questions[key], a = response.answers[key];
    if (!object(a) || a.type !== q.type) throw new Error('Jev answer type mismatch');
    if (q.type === 'noul') { if (!prob(a.noul)) throw new Error('Invalid Noul probability'); continue; }
    const expected = q.type === 'choice' ? Object.keys(q.criteria) : q.criteria.map((_, i) => String(i));
    if (!prob(a.confidence) || !object(a.probabilities) || Object.keys(a.probabilities).length !== expected.length || expected.some(k => !prob(a.probabilities[k])) || Math.abs(Object.values(a.probabilities).reduce((sum, p) => sum + p, 0) - 1) > 0.00001) throw new Error('Invalid Jev probability distribution');
    if (q.type === 'choice') {
      if (!expected.includes(a.choice) || a.probabilities[a.choice] !== Math.max(...Object.values(a.probabilities))) throw new Error('Invalid Choice result');
    } else {
      const weighted = expected.reduce((sum, k) => sum + Number(k) * a.probabilities[k], 0);
      if (typeof a.score !== 'number' || !Number.isFinite(a.score) || Math.abs(a.score - weighted) > 0.00001 || !object(a.legend) || Object.keys(a.legend).length !== expected.length || expected.some(k => a.legend[k] !== q.criteria[Number(k)])) throw new Error('Invalid Score result');
    }
  }
  const answers = Object.fromEntries(keys.map(key => {
    const q = payload.questions[key], a = response.answers[key];
    if (q.type === 'noul') return [key,{type:a.type,noul:a.noul}];
    const expected = q.type === 'choice' ? Object.keys(q.criteria) : q.criteria.map((_,i)=>String(i));
    const probabilities = Object.fromEntries(expected.map(k=>[k,a.probabilities[k]]));
    return [key,q.type === 'choice' ? {type:a.type,choice:a.choice,confidence:a.confidence,probabilities} : {type:a.type,score:a.score,confidence:a.confidence,probabilities,legend:Object.fromEntries(expected.map(k=>[k,a.legend[k]]))}];
  }));
  return {model:response.model,answers,usage:{input_tokens:response.usage.input_tokens,output_tokens:response.usage.output_tokens}};
}
async function readResponseJson(response) {
  if (!response?.body || typeof response.body.getReader !== 'function') throw new Error('Jev requires a bounded response stream');
  const reader = response.body.getReader(), chunks = [];
  let total = 0, complete = false;
  try {
    const declared = response.headers?.get('content-length');
    if (declared !== null && declared !== undefined && /^\d+$/.test(declared) && Number(declared) > MAX_RESPONSE_BYTES) throw new Error('Jev response exceeds byte bound');
    for (;;) {
      const {done,value} = await reader.read();
      if (done) { complete = true; break; }
      if (!ArrayBuffer.isView(value)) throw new Error('Invalid Jev response byte chunk');
      total += value.byteLength;
      if (total > MAX_RESPONSE_BYTES) throw new Error('Jev response exceeds byte bound');
      chunks.push(Buffer.from(new Uint8Array(value.buffer,value.byteOffset,value.byteLength)));
    }
    return JSON.parse(Buffer.concat(chunks,total).toString('utf8'));
  } finally {
    if (!complete) { try { await reader.cancel(); } catch { /* Preserve the original bounded-read error. */ } }
    reader.releaseLock();
  }
}
function plan(payload, {maxAttempts = 1} = {}) {
  if (!Number.isSafeInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 3) throw new Error('Invalid retry bound');
  const admission = validatePayload(payload);
  const cacheKey = crypto.createHash('sha256').update(canonical({payload, pricing: PRICING})).digest('hex');
  return {schemaVersion: 1, mode: 'offline', called: false, payload, admission, pricing: PRICING, maxAttempts, reservedUsdPerAttempt: 64000 * PRICING.inputUsdPerMillion / 1000000, maximumUsd: maxAttempts * 64000 * PRICING.inputUsdPerMillion / 1000000, cacheKey};
}
function planBatch(corpus) {
  const {validateCorpus} = require('./knowledge.cjs');
  const validation = validateCorpus(corpus);
  if (!validation.valid) throw new Error('Invalid corpus for Jev batch');
  const squads = [...new Set(corpus.heuristics.heuristics.map(h => h.squad))].sort();
  const plans = squads.map(squad => {
    const heuristics = corpus.heuristics.heuristics.filter(h => h.squad === squad);
    const ids = [...new Set(heuristics.flatMap(h => h.evidence.map(e => e.sourceId)))];
    const sources = corpus.sources.sources.filter(s => ids.includes(s.id));
    const stringMatch = heuristics.every(h => h.evidence.every(e => {
      const source = sources.find(s => s.id === e.sourceId);
      const quote = e.referenceOnly ? source?.excerpt : e.excerpt;
      return typeof quote === 'string' && quote.length > 0 && source?.excerpt.includes(quote);
    }));
    if (!stringMatch) throw new Error('Citation string-match failed before semantic judgment');
    const questions = {};
    const questionMap = heuristics.map(h => {
      const referenceIds = [...new Set(h.evidence.map(e => e.sourceId))].sort();
      const supportId = 'support_' + h.id, relevanceId = 'relevance_' + h.id;
      questions[supportId] = {type: 'choice', instructions: 'Julgue apenas a regra ' + h.id + ' e suas condições/exceções no estado, usando somente fontes ' + referenceIds.join(', ') + '. Paráfrase não é evidência independente; não completar de memória.', criteria: {supported: 'A ação e seu escopo têm apoio no material fornecido', partial: 'Há apoio parcial ou extrapolação não validada', not_found: 'Material insuficiente ou incompatível'}};
      questions[relevanceId] = {type: 'noul', instructions: 'A regra ' + h.id + ' é relevante para suas competências na squad ' + squad + ', considerando exatamente condição, ação, exceções e contraexemplos no estado? Use somente fontes ' + referenceIds.join(', ') + '.'};
      return {heuristicId: h.id, supportId, relevanceId, referenceIds};
    });
    const payload = {model: MODEL, state: {squad, sources: sources.map(s => ({id: s.id, locator: s.locator, excerpt: s.excerpt, originalParaphrase: s.claims})), heuristics: heuristics.map(h => ({id: h.id, condition: h.condition, action: h.action, competencies: h.competencies, status: h.status, exceptions: h.exceptions, counterexamples: h.counterexamples, referenceIds: [...new Set(h.evidence.map(e => e.sourceId))].sort()}))}, questions};
    return {squad, citationStringMatch: true, questionMap, ...plan(payload)};
  });
  return {schemaVersion: 1, mode: 'offline', called: false, model: MODEL, squads: plans.filter(p => p.squad !== 'core').length, groups: plans.length, includesCore: plans.some(p => p.squad === 'core'), heuristicCount: plans.reduce((sum, p) => sum + p.questionMap.length, 0), questionCount: plans.reduce((sum, p) => sum + Object.keys(p.payload.questions).length, 0), maximumUsd: plans.reduce((sum, p) => sum + p.maximumUsd, 0), plans};
}
// Public documents name this deterministic identity as a SHA-256 digest,
// avoiding the credential-shaped name used by the internal cache API.
function cacheIdentityHex(identity) {
  const hex = typeof identity === 'string' ? identity : identity?.algorithm === 'sha256' ? identity.digestHex : null;
  if (!/^[a-f0-9]{64}$/.test(hex || '')) throw new Error('Invalid SHA-256 cache identity');
  return hex;
}
function publicArtifact(value) {
  if (!object(value)) throw new Error('Public artifact requires a Jev plan');
  if (Array.isArray(value.plans)) return {...value, plans:value.plans.map(publicArtifact)};
  if (value.cacheKey !== plan(value.payload,{maxAttempts:value.maxAttempts}).cacheKey) throw new Error('Public cache identity must match the derived plan digest');
  const {cacheKey, ...result} = value;
  return {...result, cacheIdentity:{algorithm:'sha256',digestHex:cacheIdentityHex(cacheKey)}};
}
function createLedger({authorizedUsd, authorizationId} = {}) {
  if (!validText(authorizationId) || typeof authorizedUsd !== 'number' || !Number.isFinite(authorizedUsd) || authorizedUsd <= 0) throw new Error('Explicit budget authorization required');
  let reservedUsd = 0;
  return {authorizationId, authorizedUsd, reserve(usd) {
    if (!Number.isFinite(usd) || usd <= 0 || reservedUsd + usd > authorizedUsd + Number.EPSILON) throw new Error('Jev budget exhausted before attempt');
    reservedUsd += usd; return reservedUsd;
  }, get reservedUsd() { return reservedUsd; }};
}
const flights = new Map();
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
function regularRead(file) {
  return stableRead(file,{optional:true});
}
function storageRoot(directory) {
  const requested = path.resolve(directory);
  for (let cursor = requested; cursor !== path.dirname(cursor); cursor = path.dirname(cursor)) if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error('Unsafe Jev storage ancestor');
  return fs.realpathSync(requested);
}
function persist(file, value) {
  const temp = `${file}.${crypto.randomUUID()}.tmp`;
  const fd = fs.openSync(temp, 'wx', 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(value)); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  try { if (fs.existsSync(file)) regularRead(file); fs.renameSync(temp, file); } finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
}
function takeLock(file) {
  const token = JSON.stringify({pid:process.pid,nonce:crypto.randomUUID()});
  try { fs.writeFileSync(file, token, {flag:'wx',mode:0o600}); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    const old = regularRead(file), owner = JSON.parse(old);
    let alive = true;
    try { process.kill(owner.pid, 0); } catch (probe) { if (probe.code === 'ESRCH') alive = false; }
    if (!alive && regularRead(file)?.equals(old)) { fs.unlinkSync(file); return takeLock(file); }
    return null;
  }
  return () => { if (regularRead(file)?.toString() === token) fs.unlinkSync(file); };
}
function createDurableLedger({directory, authorizedUsd, authorizationId} = {}) {
  createLedger({authorizedUsd,authorizationId});
  const base = storageRoot(directory), file = path.join(base, `authorization-${digest(authorizationId)}.json`);
  function read() {
    const bytes = regularRead(file);
    const state = bytes ? JSON.parse(bytes) : {schemaVersion:1,authorizationId,authorizedUsd,reservedUsd:0,entries:{}};
    if (state.schemaVersion !== 1 || state.authorizationId !== authorizationId || state.authorizedUsd !== authorizedUsd || !Number.isFinite(state.reservedUsd) || state.reservedUsd < 0 || state.reservedUsd > authorizedUsd + Number.EPSILON || !object(state.entries)) throw new Error('Invalid/conflicting durable Jev authorization');
    return state;
  }
  function update(fn) {
    const release = takeLock(`${file}.lock`);
    if (!release) throw new Error('Durable Jev authorization busy; no attempt admitted');
    try { const state = read(); const result = fn(state); persist(file,state); return result; } finally { release(); }
  }
  function reserveInto(state, usd) {
    if (!Number.isFinite(usd) || usd <= 0 || state.reservedUsd + usd > authorizedUsd + Number.EPSILON) throw new Error('Jev budget exhausted before attempt');
    state.reservedUsd += usd;
    return state.reservedUsd;
  }
  function assertKey(key){if(!/^[a-f0-9]{64}$/.test(key))throw new Error('Invalid extraction receipt key');}
  read();
  return {durable:true, directory:base, authorizationId, authorizedUsd,
    reserve(usd) { return update(state => reserveInto(state,usd)); },
    begin(key, usd) {
      assertKey(key);
      let blocked;
      const result = update(state => {
        const prior = state.entries[key];
        if (prior && ['pending','charge-uncertain','failed','completed'].includes(prior.status)) {
          if (prior.status === 'pending') prior.status = 'charge-uncertain';
          blocked = `Jev ${prior.status} receipt blocks automatic retry`;
          return null;
        }
        reserveInto(state,usd);
        state.entries[key] = {schemaVersion:1,cacheKey:key,model:MODEL,status:'pending',reservedUsd:usd,startedAt:new Date().toISOString()};
        return state.entries[key];
      });
      if (blocked) throw new Error(blocked);
      return result;
    },
    finish(key, status, extra = {}) { return update(state => {
      assertKey(key);
      if(!['completed','failed','charge-uncertain','retry-admitted'].includes(status))throw new Error('Invalid extraction receipt status');
      if (!state.entries[key]) throw new Error('Missing Jev write-ahead receipt');
      Object.assign(state.entries[key],extra,{status,finishedAt:new Date().toISOString()});
      return state.entries[key];
    }); },
    getReceipt(key) { assertKey(key);return read().entries[key]; },
    get reservedUsd() { return read().reservedUsd; }};
}
async function runSingleFlight(key, operation) {
  if (flights.has(key)) return flights.get(key);
  const promise = Promise.resolve().then(operation);
  flights.set(key,promise);
  try { return await promise; } finally { if (flights.get(key) === promise) flights.delete(key); }
}
function validateExtractionReceipt(receipt, payload, cacheKey = plan(payload).cacheKey) {
  if (!object(receipt) || receipt.schemaVersion !== 1 || receipt.cacheKey !== cacheKey || receipt.model !== payload.model || !['pending','completed','failed','charge-uncertain'].includes(receipt.status) || !Number.isFinite(receipt.reservedUsd) || receipt.reservedUsd < 0) throw new Error('Invalid extraction receipt');
  if (receipt.status === 'completed') {
    const response = validateResponse(receipt.response,payload);
    const actual = response.usage.input_tokens * PRICING.inputUsdPerMillion / 1000000;
    if (receipt.actualUsd !== actual || actual > receipt.reservedUsd) throw new Error('Invalid extraction billing receipt');
    return {...receipt,response};
  }
  return receipt;
}
// Caller owns persistence/retention. Keys never contain request text or secrets.
function createFileCache(directory) {
  const base = storageRoot(directory);
  const file = key => { if (!/^[a-f0-9]{64}$/.test(key)) throw new Error('Invalid cache key'); return path.join(base, `${key}.json`); };
  return {durable:true,directory:base,
    get(key) { const bytes = regularRead(file(key)); return bytes ? JSON.parse(bytes) : undefined; },
    set(key,value) { const target=file(key),prior=regularRead(target); if(prior){if(canonical(JSON.parse(prior))!==canonical(value))throw new Error('Conflicting Jev cache receipt');return;} persist(target,value); },
    async lock(key, timeoutMs) { const started=Date.now(); let release; while(!(release=takeLock(`${file(key)}.lock`))){if(Date.now()-started>=timeoutMs)throw new Error('Jev cache single-flight timeout');await new Promise(resolve=>setTimeout(resolve,10));}return release; }};
}
async function execute(payload, {offline = true, authorized = false, apiKey, ledger, cache, maxAttempts = 1, timeoutMs = 10000, transport = globalThis.fetch} = {}) {
  validatePayload(payload);
  payload = JSON.parse(JSON.stringify(payload));
  const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
  freeze(payload); // One immutable admission/key/body snapshot, shared by every attempt.
  const prepared = plan(payload, {maxAttempts});
  if (offline) return prepared;
  if (authorized !== true || !validText(apiKey) || !ledger || typeof ledger.reserve !== 'function') throw new Error('Paid Jev execution requires explicit authorization, key and budget ledger');
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000 || typeof transport !== 'function') throw new Error('Invalid Jev timeout/transport');
  if (!cache && ledger.durable) cache = createFileCache(ledger.directory);
  if (!ledger.durable || !cache?.durable) throw new Error('Paid live Jev requires durable ledger and cache');
  const namespace = ledger.durable ? `${ledger.directory}:${ledger.authorizationId}` : ledger;
  if (!ledger.durable && !ledger.flightId) Object.defineProperty(ledger,'flightId',{value:crypto.randomUUID()});
  return runSingleFlight(`${typeof namespace === 'string' ? namespace : ledger.flightId}:${prepared.cacheKey}`, async () => {
    const release = cache.lock ? await cache.lock(prepared.cacheKey,timeoutMs) : () => {};
    try {
      const cached = cache.get(prepared.cacheKey);
      if (cached) {
        const value = cached.schemaVersion === 1 ? validateExtractionReceipt(cached,payload).response : validateResponse(cached,payload);
        if (cached.schemaVersion === 1 && cached.status !== 'completed') throw new Error('Incomplete Jev cache receipt');
        return {mode:'cache',called:false,response:value,cacheKey:prepared.cacheKey};
      }
      const started = Date.now();
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const remaining = timeoutMs - (Date.now() - started);
        if (remaining <= 0) throw new Error('Jev total timeout');
        if (ledger.durable) ledger.begin(prepared.cacheKey,prepared.reservedUsdPerAttempt);
        else ledger.reserve(prepared.reservedUsdPerAttempt); // Never refund a possibly charged attempt.
        const controller = new AbortController();
        let timer;
        const timedOut = new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('Jev total timeout')); }, remaining); });
        try {
          const response = await Promise.race([transport('https://api.typesafe.ai/v1/systemone', {method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`}, body: JSON.stringify(payload), signal: controller.signal}), timedOut]);
          if (!response.ok) {
            if (ledger.durable) ledger.finish(prepared.cacheKey,'failed',{httpStatus:response.status});
            if (![429, 529].includes(response.status) || attempt === maxAttempts) throw new Error(`Jev HTTP ${response.status}`);
            // No hidden retry; bounded delay consumes the same total deadline.
            const retryHeader = response.headers?.get('retry-after');
            const seconds = retryHeader === null || retryHeader === undefined ? 2 ** (attempt - 1) : Number(retryHeader);
            if (!Number.isFinite(seconds) || seconds < 0 || Date.now() - started + seconds * 1000 >= timeoutMs) throw new Error('Jev retry exceeds total timeout');
            await Promise.race([new Promise(resolve => setTimeout(resolve, seconds * 1000)), timedOut]);
            if (ledger.durable) ledger.finish(prepared.cacheKey,'retry-admitted');
            continue;
          }
          const raw = await Promise.race([readResponseJson(response), timedOut]);
          const validated = validateResponse(raw, payload);
          const actualUsd = validated.usage.input_tokens * PRICING.inputUsdPerMillion / 1000000;
          if (actualUsd > prepared.reservedUsdPerAttempt) throw new Error('Jev usage exceeds reservation');
          const receipt = {schemaVersion:1,status:'completed',cacheKey:prepared.cacheKey,model:MODEL,reservedUsd:prepared.reservedUsdPerAttempt,actualUsd,response:validated};
          cache.set(prepared.cacheKey, cache.durable ? validateExtractionReceipt(receipt,payload) : validated);
          if (ledger.durable) ledger.finish(prepared.cacheKey,'completed',{actualUsd});
          return {mode: 'live', called: true, attempts: attempt, actualUsd, reservedUsd: ledger.reservedUsd, response: validated, cacheKey: prepared.cacheKey};
        } catch (error) {
          if (ledger.durable && ledger.getReceipt(prepared.cacheKey)?.status === 'pending') ledger.finish(prepared.cacheKey,'charge-uncertain');
          throw error;
        } finally { clearTimeout(timer); }
      }
      throw new Error('Jev attempts exhausted');
    } finally { release(); }
  });
}
if (require.main === module) {
  try {
    const [command, filename] = process.argv.slice(2);
    let result;
    if (command === 'plan-batch') result = planBatch(require('./knowledge.cjs').loadCorpus());
    else if (command === 'plan' && filename) result = plan(JSON.parse(stableRead(filename).toString('utf8').replace(/^\uFEFF/, '')));
    else throw new Error('Usage: jev.cjs plan <payload.json>|plan-batch; CLI is offline only');
    process.stdout.write(`${JSON.stringify(publicArtifact(result), null, 2)}\n`);
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
module.exports = {MODEL, PRICING, MAX_RESPONSE_BYTES, readResponseJson, validatePayload, validateResponse, plan, planBatch, cacheIdentityHex, publicArtifact, createLedger, createDurableLedger, createFileCache, runSingleFlight, validateExtractionReceipt, execute};
