'use strict';
const fs = require('node:fs');
const path = require('node:path');
const curation = require('./extraction.cjs');
const ROOT = path.resolve(__dirname,'../..');
const LIBRARY = 'research/expert-evolution/library';
const text = value => typeof value === 'string' && value.trim().length > 0;
function validateFeedback(root, feedback) {
  if (feedback?.schemaVersion !== 1 || !/^[a-z0-9][a-z0-9-]*$/.test(feedback.id || '') || feedback.status !== 'proposed' || !['failure','cause','correction','exception','author','competencyId','deliverable'].every(k=>text(feedback[k])) || !['personal','client','general'].includes(feedback.scope) || (feedback.scope === 'client' && !text(feedback.clientId)) || !feedback.transferCase || feedback.transferCase.status !== 'reserved' || !text(feedback.transferCase.id) || !text(feedback.transferCase.check) || !text(feedback.transferCase.distinctContext)) throw new Error('Incomplete proposed feedback; scope and reserved transfer case required');
  if (!/^[a-f0-9]{64}$/.test(feedback.observedArtifact?.sha256 || '') || curation.sha(curation.bytes(root,feedback.observedArtifact.path)) !== feedback.observedArtifact.sha256) throw new Error('Observed artifact SHA mismatch');
  const navigation = require('./catalog.cjs').queryDeliverable(feedback.deliverable,{root});
  if (!navigation.canonical.competencyIds.includes(feedback.competencyId)) throw new Error('Feedback competency must match exact deliverable task');
  return {...feedback,family:navigation.family,agentId:navigation.agentId,command:navigation.command,ruleStatus:'proposed',expertisePromotion:false};
}
function captureFeedback({root=ROOT,feedback,persist=false,authorizedRoot,expectedManifestSha256=null}={}) {
  const proposed = validateFeedback(root,feedback);
  const operation = () => {
    const relative = `${LIBRARY}/feedback/manifest.json`, target = curation.file(root,relative);
    const manifest = fs.existsSync(target) ? curation.read(root,relative) : {schemaVersion:1,records:[]};
    if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.records)) throw new Error('Invalid feedback manifest');
    const records = manifest.records.map(ref=>curation.reference(root,ref));
    for (const record of records) validateFeedback(root,record);
    const prior = records.find(record=>record.id===proposed.id);
    if (prior) { if(curation.canonical(prior)!==curation.canonical(proposed)) throw new Error('Feedback ID conflict'); return {mode:persist?'persisted':'dry-run',status:'proposed',duplicate:true,called:false}; }
    const active = new Set([...records.filter(r=>r.status==='proposed').map(r=>r.family),proposed.family]);
    if (active.size>3) throw new Error('Acquisition WIP limit: maximum three active families');
    if (!persist) return {mode:'dry-run',status:'proposed',activeFamilies:[...active],called:false,expertisePromotion:false};
    // Append-only record, then CAS manifest. Orphans remain reviewable after a conflict.
    const ref = curation.immutable(root,`${LIBRARY}/feedback/${proposed.id}.json`,proposed);
    const manifestRef = curation.atomic(root,relative,{schemaVersion:1,records:[...manifest.records,ref]},expectedManifestSha256);
    return {mode:'persisted',status:'proposed',activeFamilies:[...active],ref,manifestRef,called:false,expertisePromotion:false};
  };
  return curation.admitWrite(root,{persist,authorizedRoot}) ? curation.locked(root,operation) : operation();
}
module.exports={validateFeedback,captureFeedback};
