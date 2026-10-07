'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const m=require('../../scripts/expert-evolution/model-policy.cjs');
const root=path.resolve(__dirname,'../..');
test('independent RT06 repro rejects same document for artifact/review and normalized author identities',()=>{
  const relative='docs/framework/expert-evolution-2026-10/AUDITED-SPEC.md';
  const ref={path:relative,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,relative))).digest('hex')};
  for(const reviewer of ['Author ','ＡＵＴＨＯＲ',' author']){
    const receipt={schemaVersion:1,receiptType:'artifact-model-evaluation',passed:true,heldOut:true,independent:true,executor:'author',reviewer,modelId:'gpt-6.1-sol',taskFamily:'ui',corpusSha256:'a'.repeat(64),cases:['positive','negative','conflict'].map(kind=>({kind,artifact:ref,review:ref,locator:'not an observed review'}))};
    const checked=m.validateArtifactEvaluation(receipt,{root,modelId:receipt.modelId,taskFamily:receipt.taskFamily,corpusSha256:receipt.corpusSha256});
    expect(checked.valid).toBe(false);expect(checked.errors).toContain('Missing independent held-out artifact evaluation');expect(checked.errors.join(' ')).toContain('Distinct observed artifact/review');
  }
});
