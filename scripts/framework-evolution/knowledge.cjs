'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const DEFAULT_ROOT = path.resolve(__dirname, '../..');
const hash = text => crypto.createHash('sha256').update(text, 'utf8').digest('hex');
const text = value => typeof value === 'string' && value.trim().length > 0;
const strings = value => Array.isArray(value) && value.every(text);
const id = value => text(value) && /^[a-z0-9][a-z0-9-]*$/.test(value);
const STOP_WORDS = new Set('para pelo pela pelos pelas quando como mais uma umas uns com sem antes depois sobre esta este isto que the and for from with without into should must will task tarefa action acao regra execute executar generate gerar build criar'.split(' '));
const SYNONYMS = [['budget','orcamento','custo','cost'],['source','sources','fonte','fontes'],['evidence','evidencia','prova'],['memory','memoria'],['taxonomy','taxonomia'],['animation','animacao','motion','movimento'],['cash','caixa'],['feedback','retorno'],['learning','aprendizagem','ensino'],['state','estado','status'],['performance','desempenho'],['research','pesquisa'],['recognition','reconhecimento'],['claim','claims','promessa','promessas'],['error','errors','erro','erros']];
function tokens(value) {
  const words = String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9]+/).filter(word => word.length > 2 && !STOP_WORDS.has(word));
  const result = new Set(words);
  for (const group of SYNONYMS) if (group.some(word => result.has(word))) group.forEach(word => result.add(word));
  return result;
}
function taskScore(task, heuristic) {
  const terms = tokens([heuristic.id, ...heuristic.competencies, ...(heuristic.taskTags || []), ...heuristic.evidence.map(e => e.sourceId), heuristic.condition, heuristic.action, heuristic.rationale].join(' '));
  let score = 0;
  for (const [field, weight] of [['command', 4], ['title', 3], ['text', 1]]) for (const word of tokens(task[field])) if (terms.has(word)) score += weight;
  return score;
}
function loadCorpus(root = DEFAULT_ROOT) {
  const base = fs.realpathSync(path.resolve(root));
  const result = {};
  for (const name of ['sources', 'heuristics', 'competencies']) {
    const file = fs.realpathSync(path.join(base, 'research/framework-evolution', `${name}.json`));
    if (!file.startsWith(base + path.sep)) throw new Error('Corpus path escapes root');
    result[name] = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
  }
  return result;
}
function validateCorpus(corpus) {
  const errors = [];
  const fail = message => errors.push(message);
  for (const [section, list] of [['sources', 'sources'], ['heuristics', 'heuristics'], ['competencies', 'agents']]) {
    if (corpus?.[section]?.schemaVersion !== 1 || !Array.isArray(corpus?.[section]?.[list])) fail(`Invalid ${section} schema`);
  }
  if (errors.length) return {valid: false, errors};
  const sources = new Map();
  for (const source of corpus.sources.sources) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) { fail('Invalid source record'); continue; }
    if (!id(source.id) || sources.has(source.id)) fail(`Invalid/duplicate source ${source.id}`);
    sources.set(source.id, source);
    if (!['url', 'title', 'authority', 'readAt', 'readScope', 'locator', 'excerpt', 'licenseNote'].every(key => text(source[key])) || !strings(source.claims)) fail(`Incomplete source ${source.id}`);
    if (!/^https:\/\//.test(source.url || '') || !Number.isFinite(Date.parse(source.readAt))) fail(`Invalid provenance ${source.id}`);
    if (!text(source.excerpt) || source.contentSha256 !== hash(typeof source.excerpt === 'string' ? source.excerpt : '')) fail(`Source hash mismatch ${source.id}`);
    if (typeof source.excerpt === 'string' && source.excerpt.split(/\s+/).length > 25) fail(`Quote limit ${source.id}`);
    if (Array.isArray(source.claims) && source.claims.join(' ').split(/\s+/).length > 200) fail(`Summary limit ${source.id}`);
  }
  const heuristics = new Map();
  for (const h of corpus.heuristics.heuristics) {
    if (!h || typeof h !== 'object' || Array.isArray(h)) { fail('Invalid heuristic record'); continue; }
    if (!id(h.id) || heuristics.has(h.id)) fail(`Invalid/duplicate heuristic ${h.id}`);
    heuristics.set(h.id, h);
    if (!id(h.squad) || !['condition', 'action', 'rationale'].every(key => text(h[key])) || !['competencies', 'exceptions', 'counterexamples', 'consumers'].every(key => strings(h[key])) || !['direct', 'inferred', 'hypothesis'].includes(h.status)) fail(`Invalid heuristic ${h.id}`);
    if (h.taskTags !== undefined && !strings(h.taskTags)) fail(`Invalid task tags ${h.id}`);
    if (!Array.isArray(h.evidence) || !h.evidence.length) { fail(`Missing evidence ${h.id}`); continue; }
    for (const e of h.evidence) {
      if (!e || typeof e !== 'object') { fail(`Invalid evidence ${h.id}`); continue; }
      const s = sources.get(e.sourceId);
      const referenceOnly = e.referenceOnly === true && e.excerpt === '' && h.status === 'inferred' && text(e.locator) && text(s?.excerpt);
      if (!s || e.locator !== s.locator || !text(s.excerpt) || (!referenceOnly && (!text(e.excerpt) || !s.excerpt.includes(e.excerpt)))) fail(`Incompatible evidence ${h.id}`);
    }
  }
  const agents = new Map();
  for (const a of corpus.competencies.agents) {
    if (!a || typeof a !== 'object' || Array.isArray(a)) { fail('Invalid agent record'); continue; }
    if (!id(a.agentId) || agents.has(a.agentId) || !id(a.squad) || !['competencies', 'sourceIds', 'heuristicIds'].every(key => strings(a[key])) || !['verified', 'gap'].includes(a.coverage)) fail(`Invalid agent ${a.agentId}`);
    agents.set(a.agentId, a);
    for (const sourceId of Array.isArray(a.sourceIds) ? a.sourceIds : []) if (!sources.has(sourceId)) fail(`Missing agent source ${a.agentId}`);
    for (const hid of Array.isArray(a.heuristicIds) ? a.heuristicIds : []) {
      const h = heuristics.get(hid);
      if (!h || h.squad !== a.squad || !Array.isArray(h.competencies) || !Array.isArray(a.competencies) || !h.competencies.some(c => a.competencies.includes(c)) || !Array.isArray(h.consumers) || !h.consumers.includes(a.agentId) || !Array.isArray(h.evidence) || !Array.isArray(a.sourceIds) || h.evidence.some(e => !e || !a.sourceIds.includes(e.sourceId))) fail(`Agent evidence mismatch ${a.agentId}`);
    }
    if (a.coverage === 'verified' && (!Array.isArray(a.heuristicIds) || !a.heuristicIds.length || a.heuristicIds.some(hid => !heuristics.has(hid) || heuristics.get(hid)?.status === 'hypothesis'))) fail(`Unverified coverage ${a.agentId}`);
  }
  for (const h of heuristics.values()) for (const consumer of Array.isArray(h.consumers) ? h.consumers : []) if (!agents.has(consumer) || !Array.isArray(agents.get(consumer).heuristicIds) || !agents.get(consumer).heuristicIds.includes(h.id)) fail(`Unknown/mismatched consumer ${consumer}`);
  for (const source of sources.values()) {
    const quoteWords = typeof source.excerpt === 'string' ? source.excerpt.split(/\s+/).length : 0;
    const evidenceWords = [...heuristics.values()].flatMap(h => Array.isArray(h.evidence) ? h.evidence : []).filter(e => e?.sourceId === source.id && typeof e.excerpt === 'string').reduce((sum, e) => sum + e.excerpt.split(/\s+/).length, 0);
    if (quoteWords + evidenceWords > 25) fail(`Aggregate quote limit ${source.id}`);
  }
  return {valid: errors.length === 0, errors};
}
function retrieveKnowledge({root = DEFAULT_ROOT, agentId, squad, competencies = [], maxItems = 3, maxChars = 6000, task} = {}) {
  if (agentId !== undefined && !id(agentId)) throw new Error('Invalid agent ID');
  if (squad !== undefined && !id(squad)) throw new Error('Invalid squad ID');
  if (!agentId && !squad) throw new Error('Agent or squad required');
  if (!strings(competencies) || !Number.isSafeInteger(maxItems) || maxItems < 1 || maxItems > 100 || !Number.isSafeInteger(maxChars) || maxChars < 128 || maxChars > 100000) throw new Error('Invalid knowledge budget/filter');
  if (task !== undefined && (!task || typeof task !== 'object' || Array.isArray(task) || Object.keys(task).some(key => !['command','title','text'].includes(key)) || Object.entries(task).some(([key,value]) => typeof value !== 'string' || value.length > ({command:128,title:512,text:4000})[key]))) throw new Error('Invalid bounded task metadata');
  const corpus = loadCorpus(root);
  const validation = validateCorpus(corpus);
  if (!validation.valid) throw new Error(`Invalid corpus: ${validation.errors.join('; ')}`);
  const agent = corpus.competencies.agents.find(a => a.agentId === agentId);
  if (agentId && !agent) throw new Error('Unknown agent');
  if (agent && squad && agent.squad !== squad) throw new Error('Agent/squad mismatch');
  const resolvedSquad = agent?.squad || squad;
  if (!corpus.competencies.agents.some(a => a.squad === resolvedSquad)) throw new Error('Unknown squad');
  const result = {schemaVersion: 1, agentId: agentId || null, squad: resolvedSquad, coverage: agent?.coverage || 'gap', items: [], charsUsed: 0, maxChars, gaps: []};
  if (result.coverage === 'gap') result.gaps.push(agent?.gapReason || 'Specialist/domain coverage is incomplete; source coverage does not establish performance.');
  const eligible = corpus.heuristics.heuristics.filter(h => h.squad === resolvedSquad && (!agent || h.consumers.includes(agentId)) && (!competencies.length || h.competencies.some(c => competencies.includes(c))) && (!task || taskScore(task,h) > 0)).sort((a, b) => (task ? taskScore(task,b) - taskScore(task,a) : 0) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  if (task && !eligible.length) result.gaps.push('No task-relevant evidence found; generic squad knowledge was omitted.');
  for (const h of eligible) {
    const item = {...h, sources: h.evidence.map(e => corpus.sources.sources.find(s => s.id === e.sourceId))};
    result.items.push(item);
    if (JSON.stringify(result).length + 12 > maxChars) { result.items.pop(); break; }
    if (result.items.length === maxItems) break;
  }
  if (!result.items.length) result.gaps.push('No complete cited item fits this filter/context budget.');
  for (let i = 0; i < 3; i++) result.charsUsed = JSON.stringify(result).length;
  if (result.charsUsed > maxChars) throw new Error('Budget too small for grounded result');
  return result;
}
if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    const value = name => args[args.indexOf(name) + 1];
    const command = args[0];
    let result;
    if (command === 'validate') result = validateCorpus(loadCorpus());
    else if (command === 'query') result = retrieveKnowledge({agentId: args.includes('--agent') ? value('--agent') : undefined, squad: args.includes('--squad') ? value('--squad') : undefined, maxChars: args.includes('--max-chars') ? Number(value('--max-chars')) : 6000});
    else throw new Error('Usage: knowledge.cjs validate|query --agent <id> --max-chars 6000 --json');
    process.stdout.write(`${args.includes('--json') ? JSON.stringify(result) : JSON.stringify(result, null, 2)}\n`);
    if (result.valid === false) process.exitCode = 1;
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
module.exports = {loadCorpus, validateCorpus, retrieveKnowledge};
