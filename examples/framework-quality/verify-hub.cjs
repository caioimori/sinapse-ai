#!/usr/bin/env node
/* global document:readonly, innerWidth:readonly, getComputedStyle:readonly */
'use strict';
// Development QA of authored local pages only. No install, external browsing, or user session.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = __dirname;
const cycle = Number(process.argv.find((arg) => arg.startsWith('--cycle='))?.split('=')[1] || 1);
assert(Number.isInteger(cycle) && cycle >= 1 && cycle <= 3, 'Bounded QA: cycles 1–3');
const output = path.join(root, 'output', `hub-cycle-${cycle}`);
assert(!fs.existsSync(output), 'Preserve previous evidence; choose the next cycle');
fs.mkdirSync(output, { recursive: true });
const checks = []; const failures = [];
const started = Date.now();
const server = http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname); } catch { response.writeHead(400).end(); return; }
  const candidate = path.resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
  let file;
  try { file = fs.realpathSync(candidate); } catch { response.writeHead(404).end(); return; }
  if (!file.startsWith(`${root}${path.sep}`) || !fs.statSync(file).isFile()) { response.writeHead(404).end(); return; }
  const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json' }[path.extname(file)] || 'application/octet-stream';
  response.writeHead(200, { 'Content-Type': mime }); response.end(fs.readFileSync(file));
});
let browser;
let baseUrl;
let timeout;
const pass = (name, detail) => checks.push({ name, status: 'observed-pass', detail });
async function noOverflow(page, name) {
  const state = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  assert(state.document <= state.viewport && state.body <= state.viewport, `${name}: overflow`);
  pass(name, state);
}
async function verifyWidth(width) {
  const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 1000 : 844 } });
  const page = await context.newPage();
  page.on('pageerror', (error) => failures.push({ name: `pageerror-${width}`, reason: error.message }));
  await page.goto(baseUrl);
  await page.waitForFunction(() => document.querySelectorAll('.squad').length === 17);
  await page.screenshot({ path: path.join(output, `hub-${width}.png`), fullPage: true });
  await page.screenshot({ path: path.join(output, `hub-${width}-fold.png`) });
  await noOverflow(page, `initial-${width}`);
  assert.equal(await page.locator('.pending-row').count(), 8);
  assert.equal(await page.locator('#deliverable-buttons button').count(), 5);
  const current = JSON.parse(fs.readFileSync(path.join(root, 'hub-data.json'), 'utf8'));
  assert.equal(await page.locator('#reviewed-functions').textContent(), String(current.metrics.reviewedFunctions));
  for (const item of current.deliverables) {
    await page.locator(`[data-deliverable="${item.id}"]`).click();
    assert.equal(await page.locator(`[data-deliverable="${item.id}"]`).getAttribute('aria-pressed'), 'true');
    assert((await page.locator('#deliverable-detail').textContent()).includes(item.gap));
    await noOverflow(page, `deliverable-${item.id}-${width}`);
  }
  const search = page.getByLabel('Buscar squad ou agente');
  await search.fill('dx-frontend-engineer'); assert.equal(await page.locator('.squad').count(), 1);
  await search.fill('animacoes'); assert.equal(await page.locator('.squad').count(), 1);
  await search.fill('consulta-inexistente'); assert(await page.locator('#squad-empty').isVisible());
  await page.getByRole('button', { name: 'Mostrar todas as squads' }).click(); assert.equal(await page.locator('.squad').count(), 17);
  assert(await search.evaluate((node) => node === document.activeElement));
  await search.fill('design'); await page.getByRole('button', { name: 'Limpar busca', exact: true }).click(); assert.equal(await page.locator('.squad').count(), 17);
  const squad = page.locator('.squad').first();
  await squad.locator('summary').focus(); await page.keyboard.press('Enter'); assert.equal(await squad.getAttribute('open'), '');
  assert(await squad.locator('.squad-agent-list').isVisible());
  const evidence = page.locator('.evidence-item').first();
  await evidence.locator('summary').focus(); await page.keyboard.press('Enter'); assert.equal(await evidence.getAttribute('open'), '');
  assert(await evidence.locator('.evidence-copy').isVisible());
  await noOverflow(page, `expanded-${width}`);
  await page.screenshot({ path: path.join(output, `hub-${width}-evidence.png`), fullPage: true });
  pass(`behavior-${width}`, { deliverables: 5, pending: 8, squads: 17, agentSearch: true, accentSearch: true, emptyClear: true, focusReturn: true, keyboardDetails: true });
  await context.close();
}
async function verifyLinks() {
  const context = await browser.newContext(); const page = await context.newPage();
  await page.goto(baseUrl); await page.waitForFunction(() => document.querySelectorAll('.squad').length === 17);
  const links = await page.locator('a').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  for (const href of new Set(links)) {
    const url = new URL(href, baseUrl); assert.equal(url.origin, new URL(baseUrl).origin, 'All navigation remains local');
    const response = await context.request.get(url.href); assert.equal(response.status(), 200, `Link ${href}`);
    if (url.hash) {
      await page.goto(url.href);
      assert.equal(await page.locator(`[id="${url.hash.slice(1)}"]`).count(), 1, `Fragment ${href}`);
    }
  }
  pass('links', { checked: new Set(links).size, external: 0, missing: 0 }); await context.close();
}
async function verifyRecovery() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }); const page = await context.newPage();
  await page.route('**/hub-data.json', (route) => route.fulfill({ status: 503, body: 'unavailable' }));
  await page.goto(baseUrl); await page.locator('#load-error').waitFor({ state: 'visible' });
  assert(await page.getByRole('heading', { name: 'Mais clareza. Mais qualidade.' }).isVisible());
  assert.equal(await page.locator('#exemplos a').count(), 4);
  await noOverflow(page, 'load-error-390');
  await page.screenshot({ path: path.join(output, 'hub-390-error.png'), fullPage: true });
  await page.unroute('**/hub-data.json'); await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await page.waitForFunction(() => document.querySelectorAll('.squad').length === 17);
  assert(!(await page.locator('#load-error').isVisible()));
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  pass('recovery-reduced', { errorPreservesOverview: true, examplesPreserved: 4, retryLoads: true, reducedMotion: 'auto scroll' }); await context.close();
}
(async () => {
  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}/`;
    timeout = setTimeout(() => { throw new Error('Bounded QA timeout: 150 seconds'); }, 150000);
    browser = await chromium.launch({ headless: true });
    for (const width of [1440, 390, 320]) await verifyWidth(width);
    await verifyLinks(); await verifyRecovery();
    assert.equal(failures.length, 0, 'No unhandled page errors');
  } catch (error) { failures.push({ name: 'verification', reason: error.message }); process.exitCode = 1; }
  finally {
    clearTimeout(timeout); if (browser) await browser.close(); await new Promise((resolve) => server.close(resolve));
    const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
    fs.writeFileSync(path.join(output, 'receipt.json'), JSON.stringify({ schemaVersion: 1, scope: 'Local authored hub only; not field accessibility or deployment', checks, failures, durationMs: Date.now() - started, sourceHashes: Object.fromEntries(['index.html', 'hub.css', 'hub.js', 'hub-data.json', 'verify-hub.cjs'].map((file) => [file, hash(file)])) }, null, 2));
    process.stdout.write(JSON.stringify({ checks: checks.length, failures, output, elapsedMs: Date.now() - started }) + '\n');
  }
})();
