'use strict';
// Reviewed authoring supplements. Diagnostic answers are never knowledge inputs.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '../..');
const FILE = 'research/expert-evolution/competence-runtime.json';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const slug = value => typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const safeFile = (root, relative) => require('../framework-evolution/project-expert.cjs').safeFile(root, relative);
function loadCompetence(root = ROOT) { return JSON.parse(fs.readFileSync(safeFile(root, FILE), 'utf8')); }
function validateCompetence(program, {root = ROOT, agentId} = {}) {
  const errors = [];
  try {
    if (program?.schemaVersion !== 1 || program.kind !== 'sinapse-competence-runtime' || !Array.isArray(program.profiles) || !Array.isArray(program.sources)) throw new Error('Invalid competence schema');
    const index = require('../../.codex/scripts/resolve-codex-agent.js').loadCodexAgentIndex(root);
    if (JSON.stringify(program.profiles.map(p => p.agentId).sort()) !== JSON.stringify(Object.keys(index).sort())) throw new Error('Competence canonical 172 coverage mismatch');
    const forbidden = /^(heldOutCase|brief|output|expectedCriteria|artifact|execution|diagnosticAnswers)$/;
    const walk = value => { if (!value || typeof value !== 'object') return; for (const [key, item] of Object.entries(value)) { if (forbidden.test(key)) throw new Error('Diagnostic output leak into competence runtime'); if (typeof item === 'string' && (/^[A-Za-z]:[\\/]/.test(item) || /^\\\\/.test(item))) throw new Error('Sensitive absolute path in competence runtime'); walk(item); } };
    walk(program);
    const sources = new Map();
    const selected = program.profiles.find(p=>p.agentId===agentId);
    const selectedSourceIds = new Set([...(selected?.mechanisms||[]),...(selected?.mentalModels||[]),...(selected?.tools||[])].flatMap(item=>item.sourceIds||[]));
    for (const source of program.sources) {
      if(source.status==='CANDIDATE'){
        if(!slug(source.id)||sources.has(source.id)||source.sourceScope!=='external-candidate'||!/^https:\/\//.test(source.url)||!text(source.rights)||!text(source.scope)||source.readAt!==null||source.excerpt!==null||source.contentSha256!==null)throw new Error('Candidate misrepresented as observed evidence');
        sources.set(source.id,source);continue;
      }
      if (!slug(source.id) || sources.has(source.id) || source.status !== 'READ' || source.originalStatus !== 'SECTION_READ' || !text(source.rights) || !text(source.locator) || !text(source.scope) || !text(source.excerpt) || !text(source.readAt) || Number.isNaN(Date.parse(source.readAt)) || source.excerptKind !== 'authored-paraphrase' || sha(source.excerpt) !== source.contentSha256) throw new Error('Invalid grounded competence source ' + source.id);
      if (source.sourceScope === 'local-contract') { if (!source.sourceRef || ((agentId===undefined||selectedSourceIds.has(source.id)) && sha(fs.readFileSync(safeFile(root, source.sourceRef.path))) !== source.sourceRef.sha256)) throw new Error('Stale local competence source ' + source.id); }
      else if (source.sourceScope !== 'external-section' || !/^https:\/\//.test(source.url)) throw new Error('Invalid competence source scope ' + source.id);
      sources.set(source.id, source);
    }
    const bindSource = ids => { if (!Array.isArray(ids) || !ids.length || ids.some(id => !sources.has(id))) throw new Error('Dead/absent competence source ID'); };
    for (const p of program.profiles) {
      if (!slug(p.agentId) || p.status !== 'planned' || p.validatedExpertise !== false || !['pending-independent-review', 'reviewed-with-gaps'].includes(p.reviewStatus) || p.canonical?.path !== index[p.agentId]?.sourcePath || !Array.isArray(p.competencies) || !p.competencies.length || p.competencies.some(c => !slug(c)) || !Array.isArray(p.qualityCriteria) || !p.qualityCriteria.some(c => c.critical) || !Array.isArray(p.vetoes) || !p.vetoes.length) throw new Error('Invalid competence profile ' + p.agentId);
      if (!Array.isArray(p.mechanisms) || p.mechanisms.length < 2 || !Array.isArray(p.mentalModels) || !p.mentalModels.length || !Array.isArray(p.tools)) throw new Error('Missing specific competence mechanisms/models/tools');
      if(p.selectedTask.parameters!==undefined && (!p.selectedTask.parameters||typeof p.selectedTask.parameters!=='object'||Array.isArray(p.selectedTask.parameters)||Object.entries(p.selectedTask.parameters).some(([key,value])=>!slug(key)||typeof value!=='string'||value.length>100)))throw new Error('Unbounded competence task parameters');
      const ids = new Set();
      for (const c of p.qualityCriteria) { if (!slug(c.id) || ids.has(c.id) || typeof c.critical !== 'boolean' || !text(c.check) || !text(c.method)) throw new Error('Invalid competence quality criterion'); ids.add(c.id); }
      for (const m of p.mechanisms) { if (!slug(m.id) || !['condition','action','rationale','exception','counterexample'].every(k => text(m[k])) || !['DIRECT','INFERRED'].includes(m.evidenceKind)) throw new Error('Invalid conditional competence mechanism'); bindSource(m.sourceIds); }
      for (const m of p.mentalModels) { if (!['name','useWhen','avoidWhen'].every(k => text(m[k]))) throw new Error('Invalid competence mental model'); bindSource(m.sourceIds); }
      for (const t of p.tools) { if (!text(t.name) || !text(t.purpose)) throw new Error('Invalid competence tool'); bindSource(t.sourceIds); }
      if (agentId === undefined || agentId === p.agentId) {
        if (sha(fs.readFileSync(safeFile(root, p.canonical.path))) !== p.canonical.sha256) throw new Error('Stale competence canonical ' + p.agentId);
        const command = require('../../.codex/scripts/resolve-codex-command.js').resolveCodexCommand(p.agentId, p.selectedTask.command, root);
        if (command.target !== p.selectedTask.path || sha(fs.readFileSync(safeFile(root, command.target))) !== p.selectedTask.sha256) throw new Error('Competence task mismatch ' + p.agentId);
        const current = require('./operational.cjs').authorityForTask({root, agentId:p.agentId, command:command.commandId, target:command.target, resolvedBy:command.resolvedBy});
        if (JSON.stringify(current) !== JSON.stringify(p.selectedTask.authority)) throw new Error('Competence task authority mismatch ' + p.agentId);
      }
    }
  } catch (error) { errors.push(error.message); }
  return {valid:errors.length === 0, errors};
}
function selectCompetenceKnowledge({root = ROOT, agentId, command, brief = '', maxChars = 6000} = {}) {
  if (!Number.isSafeInteger(maxChars) || maxChars < 256 || maxChars > 6000 || typeof brief !== 'string' || brief.length > 4000) throw new Error('Invalid competence knowledge budget/brief');
  const program = loadCompetence(root), checked = validateCompetence(program, {root, agentId});
  if (!checked.valid) throw new Error('Invalid competence runtime: ' + checked.errors.join('; '));
  const profile = program.profiles.find(p => p.agentId === agentId);
  if (!profile) throw new Error('Unknown competence agent');
  const result = {schemaVersion:1,agentId,status:'planned',validatedExpertise:false,reviewStatus:profile.reviewStatus,taskMatched:command === profile.selectedTask.command,mechanisms:[],mentalModels:[],tools:[],vetoes:[],sources:[],gaps:[]};
  if (!result.taskMatched) { result.gaps.push('No competence supplement for this exact task; preserve canonical and existing contract.'); return result; }
  result.vetoes = profile.vetoes;
  result.qualityCriteria = profile.qualityCriteria;
  if(profile.selectedTask.parameters)result.taskParameters=profile.selectedTask.parameters;
  const tokens = new Set(brief.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\W+/).filter(t => t.length > 3));
  const score = m => [...tokens].filter(t => JSON.stringify(m).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(t)).length;
  const observed = item => item.sourceIds.every(id=>program.sources.find(s=>s.id===id)?.status==='READ');
  const ordered = profile.mechanisms.filter(observed).sort((a,b) => score(b)-score(a));
  result.sourcePointer = FILE;
  result.gaps.push('Cohort diagnostics are not isolated agent executions or blind/causal expertise proof.');
  if(profile.mechanisms.some(item=>!observed(item))||profile.tools.some(item=>!observed(item)))result.gaps.push('Candidate-dependent mechanisms/tools omitted: primary section not observed.');
  const fit = () => JSON.stringify(result).length <= maxChars;
  if (!fit()) throw new Error('Critical competence criteria/vetoes exceed knowledge budget');
  for (const mechanism of ordered) { result.mechanisms.push(mechanism); if (!fit()) result.mechanisms.pop(); }
  for (const field of ['mentalModels','tools']) for (const item of profile[field].filter(observed)) { result[field].push(item); if (!fit()) result[field].pop(); }
  const ids = new Set([...result.mechanisms,...result.mentalModels,...result.tools].flatMap(m => m.sourceIds));
  for (const id of ids) {
    const s = program.sources.find(s => s.id === id);
    const pointer = {id:s.id,url:s.url,locator:s.locator,scope:s.scope,rights:s.rights,sourceScope:s.sourceScope,contentSha256:s.contentSha256,excerptKind:s.excerptKind};
    result.sources.push(pointer); if (!fit()) result.sources.pop();
  }
  // The reserved source pointer grounds every selected mechanism even when
  // a verbose source pointer does not fit alongside its protected criteria.
  if (!fit()) { result.sources = []; if (!fit()) throw new Error('Complete competence knowledge exceeds budget'); }
  return result;
}
module.exports = {FILE, loadCompetence, validateCompetence, selectCompetenceKnowledge};
