#!/usr/bin/env node
/* global document:readonly, innerWidth:readonly, localStorage:readonly */
'use strict';
// Bounded headless checks of this authored, fictional local fixture only.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const cycle = Number(process.argv.find(arg => arg.startsWith('--cycle='))?.split('=')[1] || 1);
assert(Number.isInteger(cycle) && cycle >= 1 && cycle <= 3, 'QA is limited to three cycles');
const url = process.argv.find(arg => arg.startsWith('--url='))?.slice(6) || 'http://127.0.0.1:4179/transfer-filter/';
const parsed = new URL(url);
assert(['127.0.0.1','localhost'].includes(parsed.hostname) && parsed.protocol === 'http:' && parsed.pathname === '/transfer-filter/', 'Only the authored loopback fixture is allowed');
const output = path.resolve(__dirname,'../output/mobbin-transfer',`cycle-${cycle}`);
assert(!fs.existsSync(output),'Preserve existing receipts; choose the next bounded cycle');
fs.mkdirSync(output,{ recursive:true });
const checks=[]; const failures=[]; const screenshotPaths=[]; const started=Date.now();
let browser; let timeout;
const pass=(name,detail={}) => checks.push({ name, status:'observed-pass', detail });
const sha=file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
async function overflow(page,name) {const dimensions=await page.evaluate(() => ({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth})); assert(dimensions.document <= dimensions.viewport && dimensions.body <= dimensions.viewport,`${name}: horizontal overflow`); pass(name,dimensions);}
async function capture(page,name) {const filename=path.join(output,`${name}.png`); await page.screenshot({path:filename,fullPage:true}); screenshotPaths.push(filename); await overflow(page,`overflow-${name}`);}
async function count(page,value) {assert.equal(await page.locator('#result-count').textContent(),String(value)); assert.equal(await page.locator('#rows tr').count(),value);}
async function open(page) {await page.locator('#filter-trigger').click(); assert.equal(await page.locator('#filter-dialog').evaluate(node => node.open),true);}
async function closeWithEscape(page,trigger) {await page.keyboard.press('Escape'); assert(await page.locator(trigger).evaluate(node => node === document.activeElement));}
async function exercise(width) {
  const context=await browser.newContext({viewport:{width,height:width === 1440 ? 1000 : 844},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',error => failures.push({name:`pageerror-${width}`,reason:error.message}));
  await page.goto(url,{waitUntil:'networkidle'}); await count(page,8); await capture(page,`initial-${width}`);
  await page.getByRole('button',{name:'Ver Norte Entregas',exact:true}).click(); assert.equal(await page.locator('#context h2').textContent(),'Norte Entregas'); pass(`context-selection-${width}`);

  await open(page); await page.locator('#channel-2').check(); await count(page,8);
  assert.equal(await page.locator('#filter-count').isVisible(),false); assert.match(await page.locator('#draft-preview').textContent(),/Canal é: Marketplace/); pass(`draft-does-not-commit-${width}`);
  await page.locator('#filter-cancel').click(); await count(page,8); assert(await page.locator('#filter-trigger').evaluate(node => node === document.activeElement));
  await open(page); assert.equal(await page.locator('#channel-2').isChecked(),false); await page.locator('#channel-2').check(); await page.locator('#apply-filters').click(); await count(page,2);
  const included=await page.locator('#rows tr').evaluateAll(rows => rows.map(row => row.dataset.id)); assert.deepEqual(included,['F-003','F-006']); assert.match(await page.locator('#recap').textContent(),/Canal é: Marketplace/); pass(`positive-channel-predicate-${width}`,{rowIds:included});
  await capture(page,`include-${width}`);

  await open(page); await page.locator('#channel-operator').selectOption('exclude'); await count(page,2); assert.match(await page.locator('#recap').textContent(),/Canal é: Marketplace/);
  await page.locator('#apply-filters').click(); await count(page,6); const excluded=await page.locator('#rows tr').evaluateAll(rows => rows.map(row => row.dataset.id)); assert(!excluded.some(id => included.includes(id))); assert.match(await page.locator('#recap').textContent(),/Canal não é: Marketplace/); pass(`negative-predicate-recap-${width}`,{included,excluded});
  await capture(page,`exclude-${width}`);

  await open(page); await page.locator('#channel-operator').selectOption('include'); await page.locator('#category-all').uncheck(); await page.locator('#category-2').check();
  assert.equal(await page.locator('#category-all').evaluate(node => node.indeterminate),true); assert.equal(await page.locator('#category-all').getAttribute('aria-checked'),'mixed'); assert.equal(await page.locator('#category-selected').textContent(),'1 de 3'); await count(page,6); pass(`tri-state-partial-${width}`);
  await capture(page,`draft-conflict-${width}`);
  await closeWithEscape(page,'#filter-trigger'); await count(page,6); assert.match(await page.locator('#recap').textContent(),/Canal não é: Marketplace/);
  await open(page); assert.equal(await page.locator('#channel-operator').inputValue(),'exclude'); assert.equal(await page.locator('#category-all').isChecked(),true); pass(`escape-cancels-and-focus-returns-${width}`);
  await page.locator('#channel-operator').selectOption('include'); await page.locator('#category-all').uncheck(); await page.locator('#category-2').check(); await page.locator('#apply-filters').click(); await count(page,0);
  assert.equal(await page.locator('#empty-state').isVisible(),true); assert.equal(await page.locator('#error-state').isVisible(),false); assert.match(await page.locator('#recap').textContent(),/Canal é: Marketplace/); assert.match(await page.locator('#recap').textContent(),/Categoria: Logística/); pass(`conflicting-dimensions-show-empty-${width}`);
  await capture(page,`empty-${width}`); await page.locator('#empty-reset').click(); await count(page,8); assert.equal(await page.locator('#filter-count').isVisible(),false); pass(`empty-reset-restores-baseline-${width}`);

  await open(page); await page.locator('#category-1').uncheck(); assert.equal(await page.locator('#category-all').evaluate(node => node.indeterminate),true);
  await page.locator('#category-all').check(); assert.equal(await page.locator('#category-all').evaluate(node => node.indeterminate),false); assert.equal(await page.locator('#category-all').getAttribute('aria-checked'),'true');
  await page.locator('#category-all').uncheck(); assert.equal(await page.locator('#category-all').getAttribute('aria-checked'),'false'); assert.equal(await page.locator('#category-selected').textContent(),'0 de 3'); await page.locator('#apply-filters').click(); await count(page,0); assert.match(await page.locator('#recap').textContent(),/Categoria: nenhuma selecionada/); pass(`tri-state-all-and-none-${width}`); await page.locator('#empty-reset').click();

  await page.locator('#columns-trigger').click(); assert.equal(await page.locator('#column-identity').isChecked(),true); assert.equal(await page.locator('#column-identity').isDisabled(),true);
  await page.locator('#column-channel').uncheck(); assert.equal(await page.locator('#rows [data-column="channel"]').count(),0); await count(page,8); assert.equal(await page.locator('#rows [data-column="identity"]').count(),8); pass(`columns-cheap-immediate-required-identity-${width}`);
  await closeWithEscape(page,'#columns-trigger'); await page.reload({waitUntil:'networkidle'}); assert.equal(await page.locator('#rows [data-column="channel"]').count(),0); assert.equal(await page.locator('#rows [data-column="identity"]').count(),8);
  const saved=await page.evaluate(() => JSON.parse(localStorage.getItem('sinapse-transfer-filter.columns.v1'))); assert(saved.includes('identity') && !saved.includes('channel')); pass(`columns-local-storage-readback-${width}`,{visibleColumns:saved}); await capture(page,`columns-reloaded-${width}`);
  await page.locator('#columns-trigger').click(); await page.locator('#column-channel').check(); await closeWithEscape(page,'#columns-trigger');

  await page.locator('#filter-trigger').focus(); await page.keyboard.press('Enter'); assert(await page.locator('#channel-operator').evaluate(node => node === document.activeElement)); await page.keyboard.press('Tab'); assert(await page.locator('#channel-0').evaluate(node => node === document.activeElement)); await page.keyboard.press('Space'); await page.locator('#apply-filters').click(); await count(page,3); assert.match(await page.locator('#recap').textContent(),/Canal é: Direto/); pass(`keyboard-filter-and-commit-${width}`);
  await page.locator('.footer summary').click(); await page.locator('#simulate-error').click(); assert.equal(await page.locator('#error-state').isVisible(),true); assert.equal(await page.locator('#empty-state').isVisible(),false); assert.match(await page.locator('#recap').textContent(),/Canal é: Direto/);
  await capture(page,`error-${width}`); await page.locator('#retry').click(); await count(page,3); assert.match(await page.locator('#recap').textContent(),/Canal é: Direto/); pass(`error-distinct-and-retry-preserves-filters-${width}`);
  await page.locator('#recap-reset').click(); await page.locator('#search').fill('fornecedor inexistente'); await count(page,0); assert(await page.locator('#empty-state').isVisible()); await page.locator('#empty-reset').click(); await count(page,8); assert.equal(await page.locator('#search').inputValue(),''); pass(`search-empty-and-reset-${width}`);
  await capture(page,`final-${width}`); await context.close();
}
(async () => {
  try {
    timeout=setTimeout(() => {failures.push({name:'timeout',reason:'Bounded QA exceeded 120 seconds'}); browser?.close().catch(() => {});},120000);
    browser=await chromium.launch({headless:true});
    for(const width of [1440,390,320]) {try {await exercise(width);} catch(error) {failures.push({name:`functional-${width}`,reason:error.message}); break;}}
  } catch(error) {failures.push({name:'execution',reason:error.message});}
  finally {
    clearTimeout(timeout); if(browser) await browser.close();
    const receipt={schemaVersion:1,fixture:'transfer-filter',candidateIds:['active-filter-recap','negative-predicate-recap'],cycle,url,createdAt:new Date().toISOString(),durationMs:Date.now()-started,scope:'Authored local fixture with fictional rows; browser-local column persistence only',sourceHashes:{'index.html':sha(path.join(__dirname,'index.html')),'verify.cjs':sha(__filename)},checks,failures,screenshots:screenshotPaths,limitations:['No backend or production validation','No causal claim that observed Mobbin patterns improve all agents','Independent candidate approval is outside this fixture QA','No screenshots or visual assets copied from Mobbin']};
    fs.writeFileSync(path.join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
    process.stdout.write(JSON.stringify({status:failures.length ? 'failed' : 'passed',checks:checks.length,failures,receipt:path.join(output,'receipt.json')})+'\n');
    if(failures.length) process.exitCode=1;
  }
})();
