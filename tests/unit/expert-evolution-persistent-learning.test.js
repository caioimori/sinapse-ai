'use strict';
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const c=require('../../scripts/expert-evolution/extraction.cjs');
const e=require('../../scripts/expert-evolution/expertise.cjs');
const k=require('../../scripts/framework-evolution/knowledge.cjs');
const catalog=require('../../scripts/expert-evolution/catalog.cjs');
const feedback=require('../../scripts/expert-evolution/feedback.cjs');
const jev=require('../../scripts/framework-evolution/jev.cjs');
const {streamResponse}=require('../helpers/stream-response');
const repository=path.resolve(__dirname,'../..');
let root,candidate,candidateRef,reviewRef;
const put=(relative,value)=>{const target=path.join(root,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');return {path:relative,sha256:c.sha(fs.readFileSync(target))};};
const copy=relative=>{const target=path.join(root,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(repository,relative),target);};
const persist=()=>({root,persist:true,authorizedRoot:root});
function receipt(mutate=()=>{}) {
  const candidateSha256=c.sha(c.canonical(candidate));
  const observations=['positive','negative','conflict'].map((caseKind,i)=>({kind:caseKind,evidence:put(`review/${candidate.id}/${caseKind}.json`,{schemaVersion:1,kind:'mechanism-observation',caseKind,candidateSha256,observer:'fixture-reviewer',assertion:['Return focus to opener after Escape','Skip automatic focus when opener was removed','Two openers require explicit retained origin'][i],expected:['opener-a','document-body','opener-b'][i],actual:['opener-a','document-body','opener-b'][i],interpretation:'Observed fixture behavior; not a universal world-expertise claim',outcome:['supported','outside-condition','resolved-exception'][i],...(i===2?{exception:candidate.exceptions[0]}:{})})}));
  const review={schemaVersion:1,kind:'independent-mechanism-review',candidateSha256,reviewer:'fixture-reviewer',decision:'approved',rationale:'Three typed controlled observations bound to the captured segment',evidenceScope:'technical-fixture',observedAt:new Date().toISOString(),observations};mutate(review);
  return put(`review/${candidate.id}/receipt.json`,review);
}
beforeEach(()=>{
  root=fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(),'sinapse-curation-fixture-')));execFileSync('git',['init',root],{stdio:'ignore'});put('.gitignore','research/expert-evolution/library/\n');
  for(const name of ['expert-profiles','source-program','jev-use-cases','task-bindings','deliverable-index']) copy(`research/expert-evolution/${name}.json`);
  for(const name of ['sources','heuristics','competencies']) copy(`research/framework-evolution/${name}.json`);
  copy('.codex/command-registry.json');
  const program=e.loadProgram();
  for(const b of program.bindings.bindings){copy(b.taskPath);const p=program.profiles.profiles.find(p=>p.agentId===b.agentId);copy(p.canonical.path);copy(`.codex/agents/${b.agentId}.md`);}
  const source={id:'owned-focus-transcript',title:'Original controlled dialog fixture',kind:'transcript',provenance:{uri:'urn:sinapse:owned-focus-transcript',capturedAt:'2026-10-02',capturedBy:'fixture-author',locator:'00:00-00:12'},rights:{authorized:true,basis:'owned',evidence:'Transcript and examples authored inside this disposable test'},units:[{locator:'00:00-00:12',startSeconds:0,endSeconds:12,text:'When an Escape action closes a dialog, return focus to the retained opener. If the opener was removed, retain document focus. Multiple openers require keeping the explicit originating opener.'}]};
  e.ingest({root,source,persist:true});
  const manifest=c.read(root,'research/expert-evolution/library/manifest.json'), segment=manifest.segments[0], origin=segment.origins[0], captured=manifest.sources[0];
  candidate={schemaVersion:1,id:'retained-opener',status:'candidate',author:'fixture-author',scope:'complete-original-segment',condition:'fixturetoken Escape closes a dialog with a retained opener',action:'Return focus to the retained originating opener',rationale:'The owned transcript describes dialog dismissal and exceptions',exceptions:['Multiple openers require explicit retained origin'],counterexamples:['Removed opener: retain document focus'],consumers:['dx-frontend-engineer'],competencyIds:['flow-focus-contract'],bindings:[{agentId:'dx-frontend-engineer',command:'implement-responsive-layouts',competencyIds:['flow-focus-contract']}],provenance:{sourceId:captured.id,sourceVersion:captured.inputHash,captureEntrySha256:c.sha(c.canonical(captured)),segmentId:segment.id,locator:origin.locator,charStart:origin.charStart,charEnd:origin.charEnd,quote:'return focus to the retained opener'},extraction:{mode:'manual-native-curation',resultStatus:'complete-candidate',sourceVersion:captured.inputHash,questionVersion:'focus-v1',modelKey:'native-curation-v1'}};
  candidateRef=c.propose({...persist(),candidate}).ref;reviewRef=receipt();
});
afterEach(()=>fs.rmSync(root,{recursive:true,force:true}));
test('owned transcript→typed independent fixture review→CAS overlay→bound offline knowledge; corpus stays intact',async()=>{
  const before=['sources','heuristics','competencies'].map(name=>c.sha(fs.readFileSync(path.join(root,`research/framework-evolution/${name}.json`))));
  expect(k.retrieveKnowledge({root,agentId:'dx-frontend-engineer',task:{command:'implement-responsive-layouts'},brief:'fixturetoken'}).items.some(i=>i.id==='curated-retained-opener')).toBe(false);
  expect(c.reviewCandidate({root,candidateRef,reviewRef}).status).toBe('reviewed');
  const delta=c.consolidate({...persist(),candidateRef,reviewRef});expect(delta).toMatchObject({added:1,status:'VALIDATED',called:false,expertisePromotion:false});
  const result=k.retrieveKnowledge({root,agentId:'dx-frontend-engineer',task:{command:'implement-responsive-layouts'},brief:'fixturetoken'});
  expect(result.items[0]).toMatchObject({id:'curated-retained-opener',review:{evidenceScope:'technical-fixture'}});
  expect(JSON.stringify(result)).not.toContain('Multiple openers require keeping the explicit');
  expect(k.retrieveKnowledge({root,agentId:'dx-frontend-engineer',task:{command:'implement-component-library'},brief:'fixturetoken'}).items.some(i=>i.id==='curated-retained-opener')).toBe(false);
  const network=jest.fn(()=>{throw new Error('Unexpected network');});
  expect(await c.extract({...persist(),candidate,transport:network})).toMatchObject({called:false,status:'manual-native-curation',sourceVersion:candidate.provenance.sourceVersion,questionVersion:'focus-v1',modelKey:'native-curation-v1'});expect(network).not.toHaveBeenCalled();
  expect(c.propose({...persist(),candidate}).ref.duplicate).toBe(true);
  expect(c.consolidate({...persist(),candidateRef,reviewRef})).toMatchObject({duplicate:true,added:0});
  expect(['sources','heuristics','competencies'].map(name=>c.sha(fs.readFileSync(path.join(root,`research/framework-evolution/${name}.json`))))).toEqual(before);
});
test('default dry-run and explicit ignored exact persist roots',()=>{
  const dry={...candidate,id:'new-dry'};expect(c.propose({root,candidate:dry}).mode).toBe('dry-run');expect(fs.existsSync(path.join(root,'research/expert-evolution/library/candidates/new-dry.json'))).toBe(false);
  expect(()=>c.propose({root,candidate:dry,persist:true})).toThrow('authorized');
  put('.gitignore','');expect(()=>c.propose({...persist(),candidate:dry})).toThrow('ignored');
});
test.each([
  ['truncated',x=>x.scope='truncated-segment'],['incomplete',x=>delete x.counterexamples],['unknown command',x=>x.bindings[0].command='invented-task'],['unknown competence',x=>x.bindings[0].competencyIds=['banana']],['unmapped consumer',x=>x.consumers.push('css-motion-artist')],['locator',x=>x.provenance.locator='00:99'],['source hash',x=>x.provenance.sourceVersion='f'.repeat(64)],
])('candidate rejects %s before promotion',(_name,mutate)=>{const bad=JSON.parse(JSON.stringify(candidate));mutate(bad);expect(()=>c.propose({root,candidate:bad})).toThrow();});
test('segment tamper and rights tamper fail at consolidation/runtime',()=>{
  const segment=`research/expert-evolution/library/${candidate.provenance.segmentId}.json`;put(segment,{schemaVersion:1,text:'tamper',contentSha256:candidate.provenance.segmentId});expect(()=>c.consolidate({...persist(),candidateRef,reviewRef})).toThrow('hash');
});
test('rights revocation and changed provenance cannot be silently accepted',()=>{
  const manifest=c.read(root,'research/expert-evolution/library/manifest.json');manifest.sources[0].rights.authorized=false;put('research/expert-evolution/library/manifest.json',manifest);expect(()=>c.reviewCandidate({root,candidateRef,reviewRef})).toThrow('rights');
});
test.each([
  ['same author',r=>r.reviewer=' FIXTURE-AUTHOR '],['incomplete',r=>r.observations.pop()],['unresolved',r=>r.observations[0].evidence.path='missing.json'],['forged boolean',r=>r.observations[0].evidence={path:'boolean.json',sha256:put('boolean.json',{passed:true}).sha256}],['future',r=>r.observedAt='2099-01-01'],
])('independent review rejects %s',(_name,mutate)=>{reviewRef=receipt(mutate);expect(()=>c.reviewCandidate({root,candidateRef,reviewRef})).toThrow();});
test.each(['negative','conflict'])('observed adverse %s blocks approval',kind=>{
  const evidence=c.read(root,`review/${candidate.id}/${kind}.json`);evidence.outcome=kind==='negative'?'contradiction':'unresolved';const ref=put(`review/${candidate.id}/${kind}.json`,evidence);const review=c.read(root,reviewRef.path);review.observations.find(o=>o.kind===kind).evidence=ref;reviewRef=put(reviewRef.path,review);expect(()=>c.consolidate({...persist(),candidateRef,reviewRef})).toThrow('blocks');
});
test('stale CAS and locking preserve old corpus/overlay; altered pinned review fails closed',()=>{
  const first=c.consolidate({...persist(),candidateRef,reviewRef}), old=fs.readFileSync(path.join(root,first.ref.path));
  candidate={...candidate,id:'second-rule'};candidateRef=c.propose({...persist(),candidate}).ref;reviewRef=receipt();
  expect(()=>c.consolidate({...persist(),candidateRef,reviewRef,expectedOverlaySha256:null})).toThrow('CAS');expect(fs.readFileSync(path.join(root,first.ref.path))).toEqual(old);
  put('research/expert-evolution/library/curation.lock','other-writer');expect(()=>c.consolidate({...persist(),candidateRef,reviewRef,expectedOverlaySha256:first.ref.sha256})).toThrow();expect(fs.readFileSync(path.join(root,first.ref.path))).toEqual(old);
  put('review/retained-opener/receipt.json',{approved:true});expect(()=>k.retrieveKnowledge({root,agentId:'dx-frontend-engineer',task:{command:'implement-responsive-layouts'}})).toThrow('tampered');
});
test('all five deliverables resolve aliases without agent IDs and unknown navigation fails',()=>{
  for(const term of ['interface','motion','Reel','carrossel','anúncio']) expect(catalog.queryDeliverable(term,{root})).toMatchObject({status:'resolved-navigation',expertisePromotion:false,canonical:{taskPath:expect.any(String),taskSha256:expect.stringMatching(/^[a-f0-9]{64}$/)}});
  expect(()=>catalog.queryDeliverable('unknown',{root})).toThrow('Unknown');
});
test('feedback stays proposed, separates preferences, binds observed SHA and limits three families',()=>{
  const artifact=put('artifacts/rejected.txt','Own observed rejected fixture');
  const make=(id,deliverable)=>({schemaVersion:1,id,status:'proposed',deliverable,competencyId:catalog.queryDeliverable(deliverable,{root}).canonical.competencyIds[0],scope:'personal',author:'fixture-observer',observedArtifact:artifact,failure:'Text failed readability observation',cause:'Low contrast in this artifact',correction:'Increase contrast for this preference',exception:'Brand-specific requirements may differ',transferCase:{id:'reserved-context',status:'reserved',check:'Independent readability observation',distinctContext:'A different fictional brand'}});
  let expected=null;for(const [i,d] of ['frontend','motion','reel'].entries()){const out=feedback.captureFeedback({...persist(),feedback:make(`feedback-${i}`,d),expectedManifestSha256:expected});expect(out.status).toBe('proposed');expected=out.manifestRef.sha256;}
  expect(()=>feedback.captureFeedback({...persist(),feedback:make('fourth','carrossel'),expectedManifestSha256:expected})).toThrow('three');
  const bad=make('bad','frontend');bad.observedArtifact={...artifact,sha256:'f'.repeat(64)};expect(()=>feedback.captureFeedback({root,feedback:bad})).toThrow('SHA');
  const unknown=make('unknown','frontend');unknown.competencyId='banana';expect(()=>feedback.captureFeedback({root,feedback:unknown})).toThrow('competency');
  expect(fs.existsSync(path.join(root,'research/expert-evolution/library/overlay.json'))).toBe(false);
});
test('package allowlist excludes private captures/overlays even after approved curation',()=>{
  c.consolidate({...persist(),candidateRef,reviewRef});
  const packaged=JSON.parse(fs.readFileSync(path.join(repository,'package.json'),'utf8')).files;
  expect(packaged).not.toContain('research/');expect(packaged).not.toContain('research/expert-evolution/');expect(packaged.some(p=>p.startsWith('research/expert-evolution/library'))).toBe(false);
  expect(execFileSync('git',['-C',root,'check-ignore','research/expert-evolution/library/overlay.json'],{encoding:'utf8'}).trim()).toBe('research/expert-evolution/library/overlay.json');
});
test('promotion eligibility requires resolvable observed artifacts, sources and critical gates; never mutates expertise',()=>{
  const profile=e.getProfile({agentId:'dx-frontend-engineer'}),binding=e.resolveTaskBinding({agentId:profile.agentId,command:'implement-responsive-layouts'});
  const evidence=['one','two'].map(id=>{const excerpt=`Original owned transfer evidence ${id}`;return {id,status:'READ',locator:'whole fixture',excerpt,contentSha256:c.sha(excerpt),sourceRef:put(`promotion/source-${id}.txt`,excerpt)};});
  const evaluation={agentId:profile.agentId,independent:true,heldOut:true,passed:true,receiptId:'fixture-promotion-review',reviewer:'separate-fixture-reviewer',executor:'fixture-implementer',model:'gpt-6.1-sol',taskFamily:'frontend',taskCommand:binding.command,corpusSha256:'a'.repeat(64),caseIds:['positive','negative','conflict'],competencyResults:profile.competencies.map(competency=>({competency,passed:true,evidenceIds:['one','two'],caseIds:['positive','negative','conflict'],negativeCaseId:'negative'}))};
  const corpusRef=put('promotion/corpus.json',{schemaVersion:1,kind:'knowledge-corpus-snapshot',files:['sources','heuristics','competencies'].map(name=>{const relative=`research/framework-evolution/${name}.json`;return {path:relative,sha256:c.sha(c.bytes(root,relative))};})});evaluation.corpusSha256=corpusRef.sha256;
  const critical=profile.deliverables.flatMap(d=>d.criteria.filter(c=>c.critical).map(c=>c.id));
  const cases=['positive','negative','conflict'].map((kind,i)=>{
    const artifact=put(`promotion/${kind}.txt`,`Locally executed controlled fixture ${kind}`),outcome=['supported','controlled-failure','resolved-exception'][i];
    const review=put(`promotion/${kind}-review.json`,{schemaVersion:1,kind:'competency-artifact-observation',caseId:kind,caseKind:kind,observer:evaluation.reviewer,author:evaluation.executor,artifactSha256:artifact.sha256,agentId:profile.agentId,modelId:evaluation.model,taskFamily:evaluation.taskFamily,corpusSha256:evaluation.corpusSha256,sourceSha256s:evidence.map(s=>s.contentSha256),competencyIds:profile.competencies,assertion:'Controlled fixture observation',expected:'Recorded controlled behavior',actual:'Recorded controlled behavior',interpretation:'Technical fixture eligibility only; no real-client expertise',conflictResolution:'Controlled exception remains restricted to the fixture',outcome,criticalGates:critical.map(criterionId=>({criterionId,observed:'Controlled case observed',method:'Fixture readback',outcome}))});
    return {id:kind,kind,artifact,review,locator:'whole artifact'};
  });
  const receipt={schemaVersion:1,receiptType:'artifact-model-evaluation',passed:true,heldOut:true,independent:true,executor:evaluation.executor,reviewer:evaluation.reviewer,agentId:profile.agentId,modelId:evaluation.model,taskFamily:evaluation.taskFamily,taskCommand:binding.command,sourceCanonicalSha256:binding.sourceSha256,taskSha256:binding.taskSha256,corpusSha256:evaluation.corpusSha256,corpusRef,evidenceScope:'technical-fixture',competencyIds:profile.competencies,requiredCriterionIds:binding.requiredCriterionIds,sources:evidence,cases};
  evaluation.artifactReceipt=put('promotion/receipt.json',receipt);
  expect(e.assessPromotion({root,profile,evidence,evaluation})).toMatchObject({eligibleForReview:true,promoted:false});expect(profile.status).toBe('planned');
  const review=c.read(root,cases[2].review.path);review.outcome='unresolved';cases[2].review=put(cases[2].review.path,review);evaluation.artifactReceipt=put('promotion/receipt.json',receipt);
  expect(()=>e.assessPromotion({root,profile,evidence,evaluation})).toThrow('negative/conflict');
  review.outcome='resolved-exception';review.criticalGates.pop();cases[2].review=put(cases[2].review.path,review);evaluation.artifactReceipt=put('promotion/receipt.json',receipt);
  expect(()=>e.assessPromotion({root,profile,evidence,evaluation})).toThrow('critical gates');
});
function paidFixture() {
  const mechanism=JSON.parse(JSON.stringify(candidate));mechanism.extraction.mode='jev-extraction';mechanism.extraction.modelKey=jev.MODEL;
  const ledgerOptions={directory:path.join(root,'research/expert-evolution/library/mock-jev-ledger'),authorizationId:'mock-semantic-only',authorizedUsd:0.05};
  fs.mkdirSync(ledgerOptions.directory,{recursive:true});
  const options={...persist(),candidate:mechanism,authorized:true,apiKey:'fixture-not-real',ledger:jev.createDurableLedger(ledgerOptions),cache:jev.createFileCache(ledgerOptions.directory)};
  const response={model:jev.MODEL,answers:{support:{type:'choice',choice:'supported',confidence:1,probabilities:{supported:1,partial:0,conflict:0}}},usage:{input_tokens:30,output_tokens:0}};
  return {mechanism,ledgerOptions,options,response,prepared:c.planExtraction({root,candidate:mechanism})};
}
test('paid semantic admission rejects different concurrent payloads before a second mock transport/reservation',async()=>{
  const {mechanism,options,response,prepared,ledgerOptions}=paidFixture(),variant={...mechanism,id:'different-payload',action:'A distinct candidate action for the same source/version/questions/model'};
  const transport=jest.fn(async()=>{await new Promise(resolve=>setTimeout(resolve,10));return streamResponse(response);});
  const results=await Promise.allSettled([c.extract({...options,transport}),c.extract({...options,candidate:variant,transport})]);
  expect(results.map(result=>result.status)).toEqual(['fulfilled','rejected']);expect(results[1].reason.message).toContain('blocks automatic retry');
  expect(transport).toHaveBeenCalledTimes(1);expect(options.ledger.reservedUsd).toBe(prepared.plan.reservedUsdPerAttempt);
  const restarted={...options,ledger:jev.createDurableLedger(ledgerOptions),cache:jev.createFileCache(ledgerOptions.directory),transport};
  expect(await c.extract(restarted)).toMatchObject({mode:'persisted-cache',called:false,status:'candidate-only'});
  await expect(c.extract({...restarted,candidate:variant})).rejects.toThrow('conflicts');expect(transport).toHaveBeenCalledTimes(1);
  expect(restarted.ledger.reservedUsd).toBe(prepared.plan.reservedUsdPerAttempt);expect(fs.existsSync(path.join(root,'research/expert-evolution/library/overlay.json'))).toBe(false);
});
test('failed mock transport preserves semantic pending admission across restart with zero retry calls',async()=>{
  const {options,prepared,ledgerOptions}=paidFixture();
  const transport=jest.fn(async()=>{throw new Error('mock transport interruption');});
  await expect(c.extract({...options,transport})).rejects.toThrow('mock transport interruption');
  const relative=`research/expert-evolution/library/extractions/${prepared.extractionKey}.json`,before=c.bytes(root,relative);
  expect(c.read(root,relative)).toMatchObject({status:'transport-admitted',automaticRetry:'blocked',sourceVersion:prepared.sourceVersion,questionVersion:prepared.questionVersion,modelKey:prepared.modelKey});
  expect(options.ledger.getReceipt(prepared.plan.cacheKey).status).toBe('charge-uncertain');
  const retry=jest.fn();await expect(c.extract({...options,ledger:jev.createDurableLedger(ledgerOptions),cache:jev.createFileCache(ledgerOptions.directory),transport:retry})).rejects.toThrow('blocks automatic retry');
  expect(retry).not.toHaveBeenCalled();expect(c.bytes(root,relative)).toEqual(before);expect(options.ledger.reservedUsd).toBe(prepared.plan.reservedUsdPerAttempt);
});
test('actual child-process crash leaves write-ahead semantic receipt and blocks restart before transport',async()=>{
  const {mechanism,options,prepared,ledgerOptions}=paidFixture();const candidateFile=put('crash-candidate.json',mechanism);
  const script="const fs=require('fs'),j=require(process.argv[1]),c=require(process.argv[2]),root=process.argv[3],candidate=JSON.parse(fs.readFileSync(process.argv[4]));const ledgerOptions=JSON.parse(process.argv[5]);c.extract({root,candidate,persist:true,authorizedRoot:root,authorized:true,apiKey:'fixture-not-real',ledger:j.createDurableLedger(ledgerOptions),cache:j.createFileCache(ledgerOptions.directory),transport:async()=>process.exit(9)}).catch(error=>{process.stderr.write(error.message);process.exit(8);});";
  const child=require('node:child_process').spawnSync(process.execPath,['-e',script,path.join(repository,'scripts/framework-evolution/jev.cjs'),path.join(repository,'scripts/expert-evolution/extraction.cjs'),root,path.join(root,candidateFile.path),JSON.stringify(ledgerOptions)],{encoding:'utf8',timeout:15000});
  expect(child.status).toBe(9);
  const relative=`research/expert-evolution/library/extractions/${prepared.extractionKey}.json`,before=c.bytes(root,relative),retry=jest.fn();expect(c.read(root,relative).status).toBe('transport-admitted');
  await expect(c.extract({...options,ledger:jev.createDurableLedger(ledgerOptions),cache:jev.createFileCache(ledgerOptions.directory),transport:retry})).rejects.toThrow('blocks automatic retry');
  expect(retry).not.toHaveBeenCalled();expect(c.bytes(root,relative)).toEqual(before);expect(options.ledger.reservedUsd).toBe(prepared.plan.reservedUsdPerAttempt);
});
test('success CAS refuses concurrent semantic receipt edits and preserves the other writer bytes',async()=>{
  const {options,response,prepared}=paidFixture(),relative=`research/expert-evolution/library/extractions/${prepared.extractionKey}.json`;let otherBytes;
  const transport=jest.fn(async()=>{put(relative,{schemaVersion:1,status:'transport-admitted',extractionKey:prepared.extractionKey,owner:'concurrent-fixture-writer'});otherBytes=c.bytes(root,relative);return streamResponse(response);});
  await expect(c.extract({...options,transport})).rejects.toThrow('CAS');expect(c.bytes(root,relative)).toEqual(otherBytes);expect(transport).toHaveBeenCalledTimes(1);expect(options.ledger.getReceipt(prepared.plan.cacheKey).status).toBe('completed');
  const retry=jest.fn();await expect(c.extract({...options,transport:retry})).rejects.toThrow('blocks automatic retry');expect(retry).not.toHaveBeenCalled();
});
