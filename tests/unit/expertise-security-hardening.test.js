'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const extraction=require('../../scripts/expert-evolution/extraction.cjs');
const jev=require('../../scripts/framework-evolution/jev.cjs');
const qa=require('../../examples/framework-quality/verify.cjs');
const payload={model:jev.MODEL,state:'synthetic owned verification',questions:{q:{type:'choice',instructions:'verify only synthetic data',criteria:{yes:'yes',no:'no'}}}};
const responseValue=()=>({model:jev.MODEL,answers:{q:{type:'choice',choice:'yes',confidence:1,probabilities:{yes:1,no:0},stats:{provider_metadata:true}}},usage:{input_tokens:1,output_tokens:0},request_id:'synthetic',evaluation_time_ms:1});
const invoke=(handler,url)=>{let status,body;handler({url},{writeHead(code){status=code;return this;},end(value){body=value?.toString();return this;}});return {status,body};};
describe('Windows evidence identity and local QA snapshot containment',()=>{
  let base,root,outside;
  const write=(directory,file,value)=>{const target=path.join(directory,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,value);};
  beforeEach(()=>{base=fs.mkdtempSync(path.join(os.tmpdir(),'sinapse-security-hardening-'));root=path.join(base,'root');outside=path.join(base,'outside');fs.mkdirSync(root);fs.mkdirSync(outside);});
  afterEach(()=>{jest.restoreAllMocks();if(path.dirname(path.resolve(base))!==path.resolve(os.tmpdir())||!/^sinapse-security-hardening-/.test(path.basename(base)))throw new Error('Unsafe owned fixture cleanup');fs.rmSync(base,{recursive:true,force:true});});
  test('reads exact admitted bytes, rejects oversized evidence, and closes the stable handle',()=>{
    write(root,'inner/evidence.json','{"owned":true}');
    const open=jest.spyOn(fs,'openSync'),close=jest.spyOn(fs,'closeSync');
    expect(extraction.bytes(root,'inner/evidence.json').toString()).toBe('{"owned":true}');
    expect(open).toHaveBeenCalledTimes(1);expect(close).toHaveBeenCalledTimes(1);
    expect(()=>extraction.bytes(root,'inner/evidence.json',4)).toThrow('bound');
  });
  test('reference hashes and parses one snapshot without filename reread',()=>{
    const value=Buffer.from('{"owned":"snapshot"}');write(root,'evidence.json',value);
    const open=jest.spyOn(fs,'openSync');jest.spyOn(fs,'readFileSync').mockImplementation(()=>{throw new Error('Filename reopen forbidden');});
    expect(extraction.reference(root,{path:'evidence.json',sha256:extraction.sha(value)})).toEqual({owned:'snapshot'});
    expect(open).toHaveBeenCalledTimes(1);
    expect(()=>extraction.reference(root,{path:'evidence.json',sha256:'0'.repeat(64)})).toThrow('tampered');
  });
  test('static Windows junction cannot expose an external marker',()=>{
    write(outside,'marker.txt','EXTERNAL-SYNTHETIC-MARKER');fs.symlinkSync(outside,path.join(root,'linked'),'junction');
    expect(()=>extraction.bytes(root,'linked/marker.txt')).toThrow(/symlink/);
  });
  test('deterministic parent replacement between stat and open rejects before reading external bytes',()=>{
    write(root,'inner/marker.txt','OWNED-INSIDE-MARKER');write(outside,'marker.txt','EXTERNAL-SYNTHETIC-MARKER');
    const originalStat=fs.statSync,inner=path.join(root,'inner');let swapped=false;
    jest.spyOn(fs,'statSync').mockImplementation((file,...args)=>{const stat=originalStat.call(fs,file,...args);if(!swapped&&file===path.join(inner,'marker.txt')){swapped=true;fs.renameSync(inner,path.join(root,'preserved-inner'));fs.symlinkSync(outside,inner,'junction');}return stat;});
    const read=jest.spyOn(fs,'readSync');
    expect(()=>extraction.bytes(root,'inner/marker.txt')).toThrow(/identity|symlink/);
    expect(swapped).toBe(true);expect(read).not.toHaveBeenCalled();
  });
  test('same-size contents changed while reading invalidate the snapshot',()=>{
    write(root,'evidence.txt','AAAA');const original=fs.readSync;
    jest.spyOn(fs,'readSync').mockImplementation((...args)=>{const count=original.apply(fs,args);fs.writeFileSync(path.join(root,'evidence.txt'),'BBBB');const stamp=new Date(Date.now()+2000);fs.utimesSync(path.join(root,'evidence.txt'),stamp,stamp);return count;});
    expect(()=>extraction.bytes(root,'evidence.txt')).toThrow('changed during read');
  });
  test.each(['evidence.json:stream','evidence.json.','inner/../evidence.json'])('rejects unsafe Windows alias %s',relative=>{expect(()=>extraction.bytes(root,relative)).toThrow('Unsafe');});
  const populate=()=>{for(const asset of qa.ASSETS)write(root,asset,'OWNED-'+asset);};
  test('QA allowlist serves five assets and rejects the previous junction disclosure route',()=>{
    populate();write(outside,'marker.txt','EXTERNAL-SYNTHETIC-MARKER');fs.symlinkSync(outside,path.join(root,'linked'),'junction');
    const snapshot=qa.captureAssets(root),handler=qa.createAssetHandler(snapshot);
    for(const asset of qa.ASSETS)expect(invoke(handler,'/'+asset)).toEqual({status:200,body:'OWNED-'+asset});
    expect(invoke(handler,'/ui/')).toEqual({status:200,body:'OWNED-ui/index.html'});
    expect(invoke(handler,'/linked/marker.txt')).toEqual({status:403,body:undefined});
    expect(invoke(handler,'/verify.cjs').status).toBe(403);expect(invoke(handler,'/%invalid').status).toBe(400);
  });
  test('QA refuses a junction in an allowed asset directory during capture',()=>{
    populate();fs.renameSync(path.join(root,'ui'),path.join(root,'original-ui'));write(outside,'index.html','EXTERNAL-SYNTHETIC-MARKER');fs.symlinkSync(outside,path.join(root,'ui'),'junction');
    expect(()=>qa.captureAssets(root)).toThrow('symlink');
  });
  test('QA allowed-asset parent replacement during capture is rejected',()=>{
    populate();write(outside,'index.html','EXTERNAL-SYNTHETIC-MARKER');const inner=path.join(root,'ui'),original=fs.statSync;let swapped=false;
    jest.spyOn(fs,'statSync').mockImplementation((file,...args)=>{const stat=original.call(fs,file,...args);if(!swapped&&file===path.join(inner,'index.html')){swapped=true;fs.renameSync(inner,path.join(root,'preserved-ui'));fs.symlinkSync(outside,inner,'junction');}return stat;});
    expect(()=>qa.captureAssets(root)).toThrow(/identity|symlink/);expect(swapped).toBe(true);
  });
  test('post-capture replacement and caller buffer mutation cannot change served bytes or their hash',()=>{
    populate();const snapshot=qa.captureAssets(root),hash=extraction.sha(snapshot.get('/ui/index.html')),handler=qa.createAssetHandler(snapshot);
    fs.renameSync(path.join(root,'ui'),path.join(root,'original-ui'));write(outside,'index.html','EXTERNAL-SYNTHETIC-MARKER');fs.symlinkSync(outside,path.join(root,'ui'),'junction');snapshot.get('/ui/index.html').fill(0);
    jest.spyOn(fs,'readFileSync').mockImplementation(()=>{throw new Error('Request must not open a file');});
    const served=invoke(handler,'/ui/');expect(served.body).toBe('OWNED-ui/index.html');expect(extraction.sha(served.body)).toBe(hash);
  });
});
describe('bounded MockResponse transport and TypeSafe-compatible projection',()=>{
  test('native Response body is bounded before parsing and provider metadata is projected away',async()=>{
    const raw=await jev.readResponseJson(new Response(JSON.stringify(responseValue()))),value=jev.validateResponse(raw,payload);
    expect(Object.keys(value)).toEqual(['model','answers','usage']);expect(Object.keys(value.answers.q)).toEqual(['type','choice','confidence','probabilities']);
    expect(raw.request_id).toBe('synthetic');expect(value.request_id).toBeUndefined();expect(value.answers.q.stats).toBeUndefined();
  });
  test('known model, probability and usage schema remains enforced',()=>{
    const invalid=responseValue();invalid.answers.q.probabilities.yes=0.5;expect(()=>jev.validateResponse(invalid,payload)).toThrow('distribution');
    const extra=responseValue();extra.unboundedExtra='x'.repeat(65536);expect(()=>jev.validateResponse(extra,payload)).toThrow('byte bound');
  });
  test('an oversized stream without Content-Length is cancelled before JSON parse',async()=>{
    let cancelled=false;const response=new Response(new ReadableStream({start(controller){controller.enqueue(new Uint8Array(jev.MAX_RESPONSE_BYTES));controller.enqueue(new Uint8Array(1));},cancel(){cancelled=true;}}));
    await expect(jev.readResponseJson(response)).rejects.toThrow('byte bound');expect(cancelled).toBe(true);
  });
  test('oversized declared length is rejected without consuming chunks',async()=>{
    const response=new Response('small',{headers:{'Content-Length':String(jev.MAX_RESPONSE_BYTES+1)}}),read=jest.spyOn(response.body,'getReader');
    await expect(jev.readResponseJson(response)).rejects.toThrow('byte bound');expect(read).toHaveBeenCalledTimes(1);
  });
  test('UTF-8 byte limit and chunk boundaries preserve the exact JSON bytes',async()=>{
    const value=responseValue();value.request_id='é'.repeat(100);const bytes=Buffer.from(JSON.stringify(value));let index=0;
    const response=new Response(new ReadableStream({pull(controller){if(index>=bytes.length){controller.close();return;}controller.enqueue(bytes.subarray(index,index+7));index+=7;}}));
    expect(await jev.readResponseJson(response)).toEqual(value);
  });
  test('json-only transport is rejected because it cannot prove a pre-parse byte limit',async()=>{await expect(jev.readResponseJson({json:async()=>responseValue()})).rejects.toThrow('bounded response stream');});
  test('completed cache receipts also expose projected response bytes',()=>{
    const prepared=jev.plan(payload),receipt={schemaVersion:1,status:'completed',cacheKey:prepared.cacheKey,model:jev.MODEL,reservedUsd:prepared.reservedUsdPerAttempt,actualUsd:jev.PRICING.inputUsdPerMillion/1000000,response:responseValue()};
    expect(jev.validateExtractionReceipt(receipt,payload).response.request_id).toBeUndefined();expect(receipt.response.request_id).toBe('synthetic');
  });
  test('injected MockResponse execution persists only projection and never stores an oversized response',async()=>{
    const makeLedger=()=>{let current;return {durable:true,directory:'synthetic-fixture',authorizationId:'mock-owned',reservedUsd:0,reserve(){},begin(_key,usd){this.reservedUsd+=usd;current={status:'pending'};},finish(_key,status){current={status};},getReceipt(){return current;}};};
    const makeCache=()=>({durable:true,get:()=>undefined,set:jest.fn()});
    const cache=makeCache(),result=await jev.execute(payload,{offline:false,authorized:true,apiKey:'synthetic-fixture-only',ledger:makeLedger(),cache,transport:async()=>new Response(JSON.stringify(responseValue()))});
    expect(result.response.request_id).toBeUndefined();expect(cache.set.mock.calls[0][1].response.answers.q.stats).toBeUndefined();
    const oversized=responseValue();oversized.extra='x'.repeat(65536);const denied=makeCache();
    await expect(jev.execute(payload,{offline:false,authorized:true,apiKey:'synthetic-fixture-only',ledger:makeLedger(),cache:denied,transport:async()=>new Response(JSON.stringify(oversized))})).rejects.toThrow('byte bound');expect(denied.set).not.toHaveBeenCalled();
  });
});
