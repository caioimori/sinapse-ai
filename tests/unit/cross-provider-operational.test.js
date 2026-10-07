'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const operational=require('../../scripts/expert-evolution/operational.cjs');
const runtime=require('../../scripts/framework-evolution/runtime.cjs');
const commands=require('../../.codex/scripts/resolve-codex-command.js');
const resolver=require('../../.codex/scripts/resolve-codex-agent.js');
const root=path.resolve(__dirname,'../..');
describe('cross-provider operational authority',()=>{
  test('all 172 canonical contracts preserve research gaps and exact ownership without promotion',()=>{
    const program=operational.loadContracts(root),checked=operational.validateContracts(program,{root});
    expect(checked).toEqual({valid:true,errors:[]});expect(program.contracts).toHaveLength(172);
    expect(program.contracts.every(c=>c.validatedExpertise===false&&c.gaps.length>0)).toBe(true);
  },60000);
  test.each([['cost-optimizer','audit-saas-stack'],['forecast-strategist','run-scenario-analysis'],['fiscal-compliance-br','review-service-invoice'],['roadmap-sentinel','check-updates'],['sop-extractor','extract-grounded-sop'],['copy-editor','conduct-copy-audit']])('%s/%s has its own exact authority and deterministic context',(agentId,task)=>{
    const ctx=runtime.buildRuntimeContext({root,agentId,task,contextOnly:true});
    expect(ctx.operational.task.authority).toMatchObject({ownerId:agentId,executionAuthorized:true});
    expect(ctx.capsule.model).toBeNull();expect(ctx.contextOnly).toBe(true);expect(ctx.executionObserved).toBe(false);
    expect(ctx.charsUsed).toBeLessThanOrEqual(12000);expect(ctx.profile.validatedExpertise).toBe(false);
  },20000);
  test.each([['copy-strategist','conduct-copy-audit','copy-editor'],['direct-response-writer','write-sales-letter','long-form-writer']])('%s cannot execute %s belonging to %s',(agentId,task,owner)=>{
    const target=commands.resolveCodexCommand(agentId,task,root);
    const authority=operational.authorityForTask({root,agentId,command:target.commandId,target:target.target,resolvedBy:target.resolvedBy});
    expect(authority).toMatchObject({mode:'delegate',delegateTo:owner,executionAuthorized:false});
    expect(()=>runtime.buildRuntimeContext({root,agentId,task,contextOnly:true})).toThrow(/requires delegation/);
    const owned=runtime.buildRuntimeContext({root,agentId:owner,task,contextOnly:true});
    expect(owned.operational.task.authority.executionAuthorized).toBe(true);
  },20000);
  test('orchestrator keeps squad discovery as explicit delegation and does not execute a colleague task',()=>{
    const ctx=runtime.buildRuntimeContext({root,agentId:'finance-orqx',task:'audit-saas-stack',contextOnly:true});
    expect(ctx.operational.task.authority).toMatchObject({mode:'delegate',delegateTo:'cost-optimizer',executionAuthorized:false});
  },20000);
  test.each([['snps-orqx','sinapse-orqx','route'],['snps','imperator','route'],['pm','project-lead','create-prd'],['dev','developer','develop'],['qa','quality-gate','gate']])('alias %s retains explicit registry contract for %s/%s',(alias,canonical,task)=>{
    const a=commands.resolveCodexCommand(alias,task,root),b=commands.resolveCodexCommand(canonical,task,root);
    expect(a.target).toBe(b.target);expect(a.commandId).toBe(b.commandId);
    const ctx=runtime.buildRuntimeContext({root,agentId:alias,task,contextOnly:true});
    expect(ctx.operational.task.authority.basis).toBe('explicit-registry');
    expect(ctx.operational.agentId).toBe(resolver.resolveCodexAgent(canonical,root).agentId);
  },20000);
  test('context-only assembly cannot disguise an execution model or invalidate normal model policy',()=>{
    expect(()=>runtime.buildRuntimeContext({root,agentId:'dx-frontend-engineer',task:'implement-component-library',contextOnly:true,model:'opus-4.6'})).toThrow(/cannot select/);
    expect(()=>runtime.buildRuntimeContext({root,agentId:'dx-frontend-engineer',task:'implement-component-library',model:'unverified-model'})).toThrow(/Unknown model|Model policy blocked/);
    expect(()=>runtime.buildRuntimeContext({root,agentId:'dx-frontend-engineer',task:'implement-component-library',contextOnly:'true'})).toThrow(/context-only/);
  });
  test.each(['research/expert-evolution/operational-contracts.json','scripts/expert-evolution/operational.cjs'])('partial authority deployment with %s missing cannot bypass a foreign task',(missing)=>{
    const original=fs.existsSync.bind(fs),spy=jest.spyOn(fs,'existsSync').mockImplementation(file=>path.resolve(file)===path.resolve(root,missing)?false:original(file));
    try{expect(()=>runtime.buildRuntimeContext({root,agentId:'copy-strategist',task:'conduct-copy-audit',contextOnly:true})).toThrow(/Partial operational/);}finally{spy.mockRestore();}
  });
  test('forged operational owner/canonical evidence is rejected without changing live sources',()=>{
    const program=operational.loadContracts(root);program.contracts.find(c=>c.agentId==='cost-optimizer').tasks[0].authority.ownerId='copy-editor';
    expect(operational.validateContracts(program,{root}).valid).toBe(false);
    const other=operational.loadContracts(root);other.contracts.find(c=>c.agentId==='cost-optimizer').canonical.sha256='0'.repeat(64);
    expect(operational.validateContracts(other,{root}).valid).toBe(false);
  },60000);
  test('operational source rejects traversal and symlink redirection',()=>{
    expect(()=>operational.safeFile(root,'../private.json')).toThrow(/escapes/);
    const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'sinapse-op-'));const dir=path.join(temporary,'target');fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir,'data.json'),'{}');fs.symlinkSync(dir,path.join(temporary,'link'),'junction');
    const checked=path.resolve(temporary);if(path.dirname(checked)!==path.resolve(os.tmpdir())||!path.basename(checked).startsWith('sinapse-op-'))throw new Error('Temporary cleanup target is not owned');
    try{expect(()=>operational.safeFile(temporary,'link/data.json')).toThrow(/symlink/);}finally{fs.rmSync(checked,{recursive:true,force:true});}
  });
});
