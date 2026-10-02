'use strict';
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const runtime=require('../../scripts/framework-evolution/runtime.cjs');
const {PAYLOAD,EXPERT_PAYLOAD,deliverFrameworkEvolution}=require('../../bin/lib/framework-evolution-delivery');
const root=path.resolve(__dirname,'../..');
describe('task relevance and bounded profiles reach the existing runtime',()=>{
  test('resolved task criteria accompany evidence without promotion claims or enlarged budgets',()=>{
    const result=runtime.buildRuntimeContext({root,agentId:'dx-frontend-engineer',task:'implement-component-library'});
    expect(result.profile).toMatchObject({agentId:'dx-frontend-engineer',status:'planned',validatedExpertise:false});
    expect(result.profile.deliverables[0].criteria.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(result.profile).length).toBeLessThanOrEqual(3000);
    expect(JSON.stringify(result.knowledge).length).toBeLessThanOrEqual(6000);
    expect(JSON.stringify(result).length).toBe(result.charsUsed);
    expect(result.charsUsed).toBeLessThanOrEqual(12000);
    expect(result.gaps.join(' ')).toContain('planned');
    expect(()=>runtime.buildRuntimeContext({root,agentId:'developer',task:'dev-develop-story',maxChars:12001})).toThrow('budget');
    expect(()=>runtime.buildRuntimeContext({root,agentId:'developer',task:'dev-develop-story',knowledgeMaxChars:6001})).toThrow('budget');
    expect(()=>runtime.buildRuntimeContext({root,agentId:'developer',task:'dev-develop-story',model:'claude-opus-5-5'})).toThrow('blocked');
  });
  test('partial expertise never silently falls back to legacy retrieval',()=>{
    const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'expert partial '));
    try {
      fs.mkdirSync(path.join(temporary,'research/expert-evolution'),{recursive:true});
      fs.writeFileSync(path.join(temporary,'research/expert-evolution/model-policy.json'),'{}');
      expect(()=>runtime.buildRuntimeContext({root:temporary,agentId:'developer',task:'dev-develop-story'})).toThrow('Partial expert');
      expect(()=>deliverFrameworkEvolution({packageRoot:temporary,targetRoot:path.join(temporary,'target')})).toThrow('Partial expert');
      expect(fs.existsSync(path.join(temporary,'target'))).toBe(false);
    } finally { fs.rmSync(temporary,{recursive:true,force:true}); }
  });
  test('isolated project installation carries schema gates and executes a selected profile',()=>{
    const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'expert delivered '));
    try {
      for(const relative of ['.codex/scripts/resolve-codex-agent.js','.codex/scripts/resolve-codex-command.js','.codex/command-registry.json','.codex/agents/developer.md','.sinapse-ai/development/agents/developer.md','.sinapse-ai/development/tasks/dev-develop-story.md']) {
        const destination=path.join(temporary,relative);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(path.join(root,relative),destination);
      }
      const receipt=deliverFrameworkEvolution({packageRoot:root,targetRoot:temporary});
      expect(receipt.files.map(file=>file.path)).toEqual([...PAYLOAD,...EXPERT_PAYLOAD]);
      const result=runtime.buildRuntimeContext({root:temporary,agentId:'developer',task:'dev-develop-story'});
      expect(result.profile.agentId).toBe('developer');
      expect(result.profile.canonical.path).toBe(result.capsule.sourceOfTruth);
      expect(result.profile.canonical.sha256).toBe(result.capsule.canonicalSha256);
    } finally { fs.rmSync(temporary,{recursive:true,force:true}); }
  });
});
