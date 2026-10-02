#!/usr/bin/env node
/* global document:readonly, innerWidth:readonly, fixtureMotion:readonly */
'use strict';
// Local-only recipe. Needs an already available Playwright + Chromium; installs nothing.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const root = __dirname;
const cycle = Number(process.argv.find((arg) => arg.startsWith('--cycle='))?.split('=')[1] || 1);
assert(Number.isInteger(cycle) && cycle >= 1 && cycle <= 3, 'Generation/check/correction limit: cycles 1–3 only');
const output = path.join(root, 'output', `cycle-${cycle}`);
assert(!fs.existsSync(output), 'Preserve previous evidence; choose the next cycle number');
fs.mkdirSync(output, { recursive: true });
const checks = []; const failures = []; const start = Date.now();
const receipt = JSON.parse(fs.readFileSync(path.join(root, 'receipt-template.json'), 'utf8'));
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = (file) => path.relative(root, file).split(path.sep).join('/');
const sources = ['shared.css', 'ui/index.html', 'ui/app.js', 'motion/index.html', 'motion/motion.js', 'verify.cjs'];
receipt.sourceHashes = Object.fromEntries(sources.map((file) => [file, hash(fs.readFileSync(path.join(root, file)))]));
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  let requested;
  try { requested = decodeURIComponent(url.pathname); } catch { response.writeHead(400).end(); return; }
  const file = path.resolve(root, `.${requested.endsWith('/') ? `${requested}index.html` : requested}`);
  if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404).end(); return; }
  const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' }[path.extname(file)] || 'application/octet-stream';
  response.writeHead(200, { 'Content-Type': mime }); response.end(fs.readFileSync(file));
});
let browser; let timeout;
function check(name, detail) { checks.push({ name, status: 'observed-pass', detail }); }
async function noOverflow(page, name) {
  const result = await page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  assert(result.scroll <= result.viewport && result.body <= result.viewport, `${name}: horizontal page overflow`); check(name, result);
}
async function startCpuTrace(page) {
  const session = await page.context().newCDPSession(page);
  await session.send('Tracing.start', { categories: 'toplevel,devtools.timeline,disabled-by-default-devtools.timeline,blink.user_timing', transferMode: 'ReturnAsStream' });
  return async (file) => {
    const completed = new Promise((resolve) => session.once('Tracing.tracingComplete', resolve));
    await session.send('Tracing.end'); const { stream } = await completed; let data = '';
    for (;;) { const chunk = await session.send('IO.read', { handle: stream }); data += chunk.data; if (chunk.eof) break; }
    await session.send('IO.close', { handle: stream }); fs.writeFileSync(file, data);
    const events = JSON.parse(data).traceEvents;
    const renderer = events.find((event) => event.name === 'thread_name' && event.args?.name === 'CrRendererMain');
    assert(renderer, 'Trace must expose renderer main thread; absent measurement is not zero cost');
    const tasks = events.filter((event) => /RunTask$/.test(event.name) && typeof event.dur === 'number' && event.pid === renderer.pid && event.tid === renderer.tid);
    assert(tasks.length > 0, 'No renderer task events observed; performance remains unverified');
    const longestTaskMs = tasks.reduce((max, event) => Math.max(max, event.dur / 1000), 0);
    const longTasks = tasks.filter((event) => event.dur > 50000).length;
    check(path.basename(file), { taskEvents: tasks.length, longestTaskMs, longTasks, limitation: 'Headless local sequence; not field CWV or physical mobile GPU' });
    if (longTasks) failures.push({ name: path.basename(file), reason: `${longTasks} traced tasks above 50ms; inspect trace` });
    await session.detach();
  };
}
async function verifyUi(width) {
  const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 1000 : 844 }, reducedMotion: 'no-preference' });
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  page.on('pageerror', (error) => failures.push({ name: `ui-${width}-pageerror`, reason: error.message }));
  await page.goto(`${receipt.baseUrl}/ui/`); await page.screenshot({ path: path.join(output, `ui-${width}.png`), fullPage: true });
  await noOverflow(page, `ui-${width}-initial-reflow`);
  assert.equal(await page.locator('.project').count(), 3);
  await page.getByLabel('Buscar projeto').fill('janela'); assert.equal(await page.locator('.project').count(), 1);
  await page.getByLabel('Buscar projeto').fill('inexistente'); assert(await page.locator('#empty').isVisible());
  await page.screenshot({ path: path.join(output, `ui-${width}-empty.png`), fullPage: true });
  await page.getByRole('button', { name: 'Limpar busca' }).click(); assert.equal(await page.locator('.project').count(), 3);
  const details = page.getByRole('button', { name: 'Ver detalhes de Caderno de ideias', exact: true });
  await details.focus(); await page.keyboard.press('Enter'); assert(await page.locator('dialog').isVisible());
  await page.keyboard.press('Escape'); assert(!(await page.locator('dialog').isVisible())); assert(await details.evaluate((element) => element === document.activeElement));
  await details.click();
  await page.screenshot({ path: path.join(output, `ui-${width}-dialog.png`), fullPage: true });
  await noOverflow(page, `ui-${width}-dialog-reflow`);
  for (let index = 0; index < 5; index += 1) { await page.keyboard.press('Tab'); assert(await page.evaluate(() => document.getElementById('details').contains(document.activeElement))); }
  await page.getByLabel('Etapa do projeto').selectOption('Produzir'); await page.getByRole('button', { name: 'Salvar etapa', exact: true }).click();
  assert.equal(await page.locator('.project').first().locator('.status').textContent(), 'Produzir');
  assert((await page.locator('#announcement').textContent()).includes('Você pode desfazer'));
  await page.getByRole('button', { name: 'Desfazer', exact: true }).click(); assert.equal(await page.locator('.project').first().locator('.status').textContent(), 'Planejar');
  assert(await details.evaluate((element) => element === document.activeElement));
  await page.goto(`${receipt.baseUrl}/ui/?scenario=error`); assert(await page.locator('#error').isVisible());
  await page.screenshot({ path: path.join(output, `ui-${width}-error.png`), fullPage: true });
  await page.getByRole('button', { name: 'Tentar novamente' }).click(); assert.equal(await page.locator('.project').count(), 3);
  check(`ui-${width}-behavior`, { projects: 3, search: true, empty: true, errorRetry: true, dialogEscapeFocusReturn: true, boundedModalFocus: true, stateUndoAnnouncement: true });
  await context.close();
}
async function verifyMotion(reduced) {
  const label = reduced ? 'reduced' : 'normal';
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: reduced ? 'reduce' : 'no-preference', recordVideo: { dir: output, size: { width: 390, height: 844 } } });
  await context.tracing.start({ screenshots: true, snapshots: true });
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  page.on('pageerror', (error) => failures.push({ name: `motion-${label}-pageerror`, reason: error.message }));
  await page.goto(`${receipt.baseUrl}/motion/`); const endTrace = await startCpuTrace(page);
  await page.screenshot({ path: path.join(output, `motion-${label}-start.png`), fullPage: true });
  await noOverflow(page, `motion-${label}-390-reflow`);
  await page.locator('#storyboard').scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: 'Próxima etapa' }).click();
  if (!reduced) {
    await page.getByRole('button', { name: 'Pausar', exact: true }).click();
    assert((await page.evaluate(() => fixtureMotion.inspect())).paused); await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  }
  await page.waitForFunction(() => fixtureMotion.inspect().current === 1 && fixtureMotion.inspect().activeAnimations === 0);
  await page.waitForTimeout(700); await page.getByRole('button', { name: 'Próxima etapa' }).click();
  await page.waitForFunction(() => fixtureMotion.inspect().current === 2 && fixtureMotion.inspect().activeAnimations === 0);
  assert(await page.getByRole('button', { name: 'Próxima etapa' }).isDisabled()); await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(output, `motion-${label}-end.png`), fullPage: true });
  check(`motion-${label}-three-steps`, { final: await page.evaluate(() => fixtureMotion.inspect()), pauseResume: !reduced });
  await page.getByRole('button', { name: 'Reiniciar' }).click();
  await page.getByRole('button', { name: 'Próxima etapa' }).click(); await page.getByRole('button', { name: 'Próxima etapa' }).click();
  await page.waitForFunction(() => fixtureMotion.inspect().current === 2 && fixtureMotion.inspect().activeAnimations === 0);
  await page.getByRole('button', { name: 'Reiniciar' }).click(); await page.getByRole('button', { name: 'Próxima etapa' }).click(); await page.getByRole('button', { name: 'Reiniciar' }).click();
  assert.equal((await page.evaluate(() => fixtureMotion.inspect())).current, 0); assert.equal((await page.evaluate(() => fixtureMotion.inspect())).activeAnimations, 0);
  check(`motion-${label}-next-reset-interruption`, { rapidNextFinal: 2, interruptedResetFinal: 0, activeAnimations: 0 });
  await page.getByRole('button', { name: 'Reiniciar' }).click(); await page.getByRole('button', { name: 'Próxima etapa' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => fixtureMotion.inspect().reduced && fixtureMotion.inspect().activeAnimations === 0);
  assert.equal((await page.evaluate(() => fixtureMotion.inspect())).current, 1);
  check(`motion-${label}-runtime-reduced`, await page.evaluate(() => fixtureMotion.inspect()));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForFunction(() => !fixtureMotion.inspect().reduced);
  const cycles = [];
  for (let index = 0; index < 10; index += 1) {
    await page.evaluate(() => { fixtureMotion.mount(); document.getElementById('reset').click(); document.getElementById('next').click(); fixtureMotion.unmount(); });
    await page.waitForTimeout(60);
    const state = await page.evaluate(() => fixtureMotion.inspect()); assert.equal(state.listenerCount, 0); assert.equal(state.activeAnimations, 0); assert.equal(state.willChange, ''); assert.equal(state.mounted, false); cycles.push(state);
    await page.evaluate(() => fixtureMotion.mount()); assert.equal((await page.evaluate(() => fixtureMotion.inspect())).listenerCount, 4);
  }
  check(`motion-${label}-ten-lifecycle-cycles`, { cycles: cycles.length, states: cycles });
  await endTrace(path.join(output, `motion-${label}-cpu-trace.json`));
  await context.tracing.stop({ path: path.join(output, `motion-${label}-browser-trace.zip`) });
  const video = page.video(); await context.close(); const oldVideo = await video.path(); fs.renameSync(oldVideo, path.join(output, `motion-${label}.webm`));
}
(async () => {
  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    receipt.baseUrl = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true }); timeout = setTimeout(() => browser.close(), 150000);
    receipt.environment = { node: process.version, browser: await browser.version(), platform: process.platform, headless: true, scope: 'Local synthetic fixture. Viewports emulate CSS sizes; physical mobile GPU and field metrics unverified.' };
    for (const width of [1440, 390, 320]) await verifyUi(width);
    await verifyMotion(false); await verifyMotion(true);
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); await page.goto(`${receipt.baseUrl}/motion/`); await noOverflow(page, 'motion-1440-reflow'); await page.screenshot({ path: path.join(output, 'motion-1440.png'), fullPage: true }); await page.setViewportSize({ width: 320, height: 844 }); await noOverflow(page, 'motion-320-reflow'); await page.screenshot({ path: path.join(output, 'motion-320.png'), fullPage: true }); await page.close();
  } catch (error) { failures.push({ name: 'recipe', reason: error.message }); }
  finally {
    clearTimeout(timeout); if (browser) await browser.close(); await new Promise((resolve) => server.close(resolve));
    delete receipt.baseUrl;
    receipt.cycle = cycle; receipt.timestamp = new Date().toISOString(); receipt.elapsedMs = Date.now() - start; receipt.checks = checks; receipt.failures = failures;
    receipt.technicalStatus = failures.length ? 'CONCERNS' : 'observed-pass'; receipt.visualStatus = 'pending-independent-review';
    receipt.outputHashes = Object.fromEntries(fs.readdirSync(output).map((name) => { const file = path.join(output, name); return [relative(file), hash(fs.readFileSync(file))]; }));
    fs.writeFileSync(path.join(output, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
    console.log(JSON.stringify({ technicalStatus: receipt.technicalStatus, checks: checks.length, failures, receipt: `${relative(output)}/receipt.json` }));
    if (failures.length) process.exitCode = 1;
  }
})();
