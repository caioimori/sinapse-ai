'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const j = require('../../scripts/framework-evolution/jev.cjs');
const {streamResponse} = require('../helpers/stream-response');
const delivery = require('../../bin/lib/framework-evolution-delivery');
const policy = require('../../scripts/expert-evolution/model-policy.cjs');
const root = path.resolve(__dirname, '../..');
const payload = {model:j.MODEL,state:'captured evidence',questions:{q:{type:'noul',instructions:'Is the claim grounded?'}}};
const response = {model:j.MODEL,answers:{q:{type:'noul',noul:0.5}},usage:{input_tokens:30,output_tokens:0}};
describe('audited reliability regressions', () => {
  let temp;
  beforeEach(() => {temp=fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(),'reliability spaces ')));});
  afterEach(() => {fs.rmSync(temp,{recursive:true,force:true});});
  test('same payload single flight makes one call and one reservation', async () => {
    const ledger=j.createDurableLedger({directory:temp,authorizedUsd:0.05,authorizationId:'mock-only'}),cache=j.createFileCache(temp);
    const transport=jest.fn(async()=>{await new Promise(resolve=>setTimeout(resolve,5));return streamResponse(response);});
    await Promise.all([j.execute(payload,{offline:false,authorized:true,apiKey:'fixture',ledger,cache,transport}),j.execute(payload,{offline:false,authorized:true,apiKey:'fixture',ledger,cache,transport})]);
    expect(transport).toHaveBeenCalledTimes(1);
    expect(ledger.reservedUsd).toBe(j.plan(payload).reservedUsdPerAttempt);
  });
  test('shared durable authorization survives restart and pending charge blocks retry', async () => {
    const options={directory:temp,authorizedUsd:j.plan(payload).reservedUsdPerAttempt,authorizationId:'same-authorization'};
    const first=j.createDurableLedger(options),second=j.createDurableLedger(options);
    first.reserve(j.plan(payload).reservedUsdPerAttempt);
    expect(()=>second.reserve(j.plan(payload).reservedUsdPerAttempt)).toThrow('budget exhausted');
    expect(j.createDurableLedger(options).reservedUsd).toBe(first.reservedUsd);
  });
  test('durable same payload replay survives new ledger/cache instances without another charge', async () => {
    const options={directory:temp,authorizedUsd:0.05,authorizationId:'campaign-fixture'};
    const transport=jest.fn(async()=>streamResponse(response));
    const run=()=>j.execute(payload,{offline:false,authorized:true,apiKey:'fixture',ledger:j.createDurableLedger(options),cache:j.createFileCache(temp),transport});
    await Promise.all([run(),run()]);
    expect((await run()).mode).toBe('cache');
    expect(transport).toHaveBeenCalledTimes(1);
    expect(j.createDurableLedger(options).reservedUsd).toBe(j.plan(payload).reservedUsdPerAttempt);
  });
  test('restart after an interrupted send preserves uncertain charge and blocks automatic retry', async () => {
    const options={directory:temp,authorizedUsd:0.05,authorizationId:'crashed-send'};
    const key=j.plan(payload).cacheKey,ledger=j.createDurableLedger(options);
    ledger.begin(key,j.plan(payload).reservedUsdPerAttempt);
    const restarted=j.createDurableLedger(options),transport=jest.fn();
    await expect(j.execute(payload,{offline:false,authorized:true,apiKey:'fixture',ledger:restarted,cache:j.createFileCache(temp),transport})).rejects.toThrow('charge-uncertain');
    expect(restarted.getReceipt(key).status).toBe('charge-uncertain');
    expect(transport).not.toHaveBeenCalled();
    expect(restarted.reservedUsd).toBe(j.plan(payload).reservedUsdPerAttempt);
  });
  test('timeout and invalid response never publish cache or retry a durable paid attempt', async () => {
    for(const kind of ['timeout','invalid']){
      const dir=path.join(temp,kind);fs.mkdirSync(dir);
      const options={directory:dir,authorizedUsd:0.05,authorizationId:kind};
      const ledger=j.createDurableLedger(options),cache=j.createFileCache(dir);
      const transport=kind==='timeout'?()=>new Promise(()=>{}):async()=>streamResponse({...response,answers:{}});
      await expect(j.execute(payload,{offline:false,authorized:true,apiKey:'fixture',ledger,cache,transport,timeoutMs:20})).rejects.toThrow(kind==='timeout'?'timeout':'answer keys mismatch');
      expect(ledger.getReceipt(j.plan(payload).cacheKey).status).toBe('charge-uncertain');
      expect(cache.get(j.plan(payload).cacheKey)).toBeUndefined();
      const retry=jest.fn();
      await expect(j.execute(payload,{offline:false,authorized:true,apiKey:'fixture',ledger:j.createDurableLedger(options),cache,transport:retry})).rejects.toThrow('charge-uncertain');
      expect(retry).not.toHaveBeenCalled();
    }
  });
  test('real fetch requires durable persistence and missing service key makes zero calls', async () => {
    const old=globalThis.fetch,transport=jest.fn();globalThis.fetch=transport;
    try{
      await expect(j.execute(payload,{offline:false,authorized:true,apiKey:'fixture',ledger:j.createLedger({authorizedUsd:0.05,authorizationId:'memory-only'})})).rejects.toThrow('durable ledger and cache');
      await expect(j.execute(payload,{offline:false,authorized:true,ledger:j.createDurableLedger({directory:temp,authorizedUsd:0.05,authorizationId:'no-key'}),cache:j.createFileCache(temp)})).rejects.toThrow('key');
      expect(transport).not.toHaveBeenCalled();
    }finally{globalThis.fetch=old;}
  });
  test('separate processes share a single authorization ceiling', async () => {
    const {execFile}=require('node:child_process'),amount=j.plan(payload).reservedUsdPerAttempt;
    const modulePath=path.join(root,'scripts/framework-evolution/jev.cjs');
    const script=`const j=require(process.argv[1]);try{j.createDurableLedger({directory:process.argv[2],authorizationId:'process-shared',authorizedUsd:${amount}}).reserve(${amount});process.stdout.write('reserved');}catch(error){process.stdout.write('blocked');}`;
    const call=()=>new Promise((resolve,reject)=>execFile(process.execPath,['-e',script,modulePath,temp],(error,stdout)=>error?reject(error):resolve(stdout)));
    const results=await Promise.all([call(),call()]);
    expect(results.filter(value=>value==='reserved')).toHaveLength(1);
    expect(j.createDurableLedger({directory:temp,authorizationId:'process-shared',authorizedUsd:amount}).reservedUsd).toBe(amount);
  });
  test('write two failure restores fresh destination and retains typed recovery journal', () => {
    const packageFixture=path.join(temp,'package'),target=path.join(temp,'target');
    for(const relative of delivery.PAYLOAD){fs.mkdirSync(path.dirname(path.join(packageFixture,relative)),{recursive:true});fs.copyFileSync(path.join(root,relative),path.join(packageFixture,relative));}
    const provider=require('../../bin/lib/global-provider-adapters'),original=provider.writeFileAtomically;
    let writes=0;
    const spy=jest.spyOn(provider,'writeFileAtomically').mockImplementation((...args)=>{if(++writes===2)throw new Error('injected write two');return original(...args);});
    try{expect(()=>delivery.deliverFrameworkEvolution({packageRoot:packageFixture,targetRoot:target})).toThrow('injected write two');}finally{spy.mockRestore();}
    expect(fs.existsSync(path.join(target,delivery.PAYLOAD[0]))).toBe(false);
    const journals=fs.readdirSync(path.join(target,'.framework-evolution-transactions'));
    expect(JSON.parse(fs.readFileSync(path.join(target,'.framework-evolution-transactions',journals[0],'journal.json'))).status).toBe('rolled-back');
  });
  test('future date, absent expiry and placeholder evidence fail policy validation', () => {
    const value=policy.loadPolicy(root);delete value.reviewExpiresAt;
    value.models[0].availability.checkedAt='2099-01-01';value.models[0].availability.evidence=['unresolvable-placeholder'];
    expect(policy.validatePolicy(value,{now:'2040-01-01'}).valid).toBe(false);
  });
  test('recovery after a real child process crash restores the write-ahead transaction',()=>{
    const packageFixture=path.join(temp,'crash package'),target=path.join(temp,'crash target');
    for(const relative of delivery.PAYLOAD){fs.mkdirSync(path.dirname(path.join(packageFixture,relative)),{recursive:true});fs.copyFileSync(path.join(root,relative),path.join(packageFixture,relative));}
    const prepared=delivery.prepareDelivery({packageRoot:packageFixture,targetRoot:target});
    const child='const d=require(process.argv[1]),p=require(process.argv[2]),original=p.writeFileAtomically;p.writeFileAtomically=(...args)=>{original(...args);process.exit(9);};d.commitDelivery(JSON.parse(process.argv[3]));';
    const result=require('node:child_process').spawnSync(process.execPath,['-e',child,path.join(root,'bin/lib/framework-evolution-delivery.js'),path.join(root,'bin/lib/global-provider-adapters.js'),JSON.stringify(prepared)]);
    expect(result.status).toBe(9);
    expect(fs.existsSync(path.join(target,delivery.PAYLOAD[0]))).toBe(true);
    const recovered=delivery.recoverDelivery(prepared);
    expect(recovered.status).toBe('rolled-back');
    expect(fs.existsSync(path.join(target,delivery.PAYLOAD[0]))).toBe(false);
    expect(fs.existsSync(path.join(target,'.framework-evolution-commit.lock'))).toBe(false);
  });
  test('upgrade receipt failure restores every prior byte; concurrent edits remain blocked for recovery',()=>{
    const packageFixture=path.join(temp,'package'),target=path.join(temp,'target');
    for(const relative of delivery.PAYLOAD){fs.mkdirSync(path.dirname(path.join(packageFixture,relative)),{recursive:true});fs.copyFileSync(path.join(root,relative),path.join(packageFixture,relative));}
    delivery.deliverFrameworkEvolution({packageRoot:packageFixture,targetRoot:target});
    const originals=new Map([...delivery.PAYLOAD,'.framework-evolution-delivery.json'].map(relative=>[relative,fs.readFileSync(path.join(target,relative))]));
    for(const relative of delivery.PAYLOAD.filter(value=>value.endsWith('.cjs')))fs.appendFileSync(path.join(packageFixture,relative),'\n// upgrade\n');
    const provider=require('../../bin/lib/global-provider-adapters'),original=provider.writeFileAtomically;
    let spy=jest.spyOn(provider,'writeFileAtomically').mockImplementation((file,...args)=>{if(path.basename(file)==='.framework-evolution-delivery.json')throw new Error('receipt failure');return original(file,...args);});
    try{expect(()=>delivery.deliverFrameworkEvolution({packageRoot:packageFixture,targetRoot:target})).toThrow('receipt failure');}finally{spy.mockRestore();}
    for(const [relative,bytes] of originals)expect(fs.readFileSync(path.join(target,relative))).toEqual(bytes);
    let writes=0;
    spy=jest.spyOn(provider,'writeFileAtomically').mockImplementation((file,...args)=>{
      if(++writes===2){fs.writeFileSync(path.join(target,delivery.PAYLOAD[0]),'concurrent user edit');throw new Error('interrupted upgrade');}
      return original(file,...args);
    });
    let recovery;
    try{delivery.deliverFrameworkEvolution({packageRoot:packageFixture,targetRoot:target});}catch(error){recovery=error.recovery;}finally{spy.mockRestore();}
    expect(recovery.status).toBe('recovery-blocked');expect(recovery.blockedFiles).toContain(delivery.PAYLOAD[0]);
    expect(fs.readFileSync(path.join(target,delivery.PAYLOAD[0]),'utf8')).toBe('concurrent user edit');
    expect(delivery.recoverDelivery({targetRoot:target,transactionId:recovery.transactionId}).status).toBe('recovery-blocked');
    expect(fs.readFileSync(path.join(target,delivery.PAYLOAD[0]),'utf8')).toBe('concurrent user edit');
  });
});
