#!/usr/bin/env node
/* global document, innerWidth, getComputedStyle, navigator, window */
'use strict';
// Existing Playwright only. Headless QA of this authored demo, no shared browser.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const cycle = Number(process.argv.find(arg => arg.startsWith('--cycle='))?.split('=')[1] || 1);
assert(Number.isInteger(cycle) && cycle >= 1 && cycle <= 3, 'Cycles are bounded to 1–3');
const confirmation = process.argv.includes('--aria-confirmation');
assert(!confirmation || cycle === 3, 'One authorized final confirmation follows aria-label repair');
const output = path.resolve(__dirname, '../output/expertise-20261007/contract-builder', confirmation ? 'aria-confirmation' : `cycle-${cycle}`);
assert(!fs.existsSync(output), 'Preserve previous QA evidence'); fs.mkdirSync(output, { recursive: true });
const baseUrl = 'http://127.0.0.1:4187/contract-builder/';
const checks = []; const failures = []; const started = Date.now(); let browser; let currentPage;
const captureRetries = [];
const pass = (name, detail) => checks.push({ name, status: 'observed-pass', detail });
const schema = async page => JSON.parse(await page.locator('#json').textContent());
async function noOverflow(page, name) {
  const observed = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  assert(observed.document <= observed.viewport && observed.body <= observed.viewport, `${name}: horizontal overflow`); pass(name, observed);
}
async function focused(locator) { assert(await locator.evaluate(node => node === document.activeElement), 'Expected logical focus'); }
async function screenshot(page, name, fullPage = true) {
  const options = { path: path.join(output, `${name}.png`), fullPage };
  try { await page.screenshot(options); }
  catch (error) { captureRetries.push({ name, reason: error.message }); await page.screenshot(options); }
}
async function widthFlow(width) {
  const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 1000 : 844 } });
  const page = await context.newPage(); currentPage = page; page.setDefaultTimeout(10000); page.on('pageerror', error => failures.push({ name: `pageerror-${width}`, reason: error.message }));
  await page.goto(baseUrl); await page.locator('[data-field]').first().waitFor();
  await noOverflow(page, `initial-${width}`); await screenshot(page, `contract-${width}`); await screenshot(page, `contract-${width}-fold`, false);
  const original = await schema(page);
  assert.equal(await page.getByRole('combobox', { name: 'Itens', exact: true }).count(), 1);
  assert.deepEqual(original.required, ['titulo', 'participantes']);
  assert.deepEqual(original.properties.participantes.items.required, ['nome']); assert.equal(original.properties.nome, undefined);
  const rootFields = page.locator('[data-scope="root"] > .field-card');
  const titleId = await rootFields.nth(0).getAttribute('data-field'); const peopleId = await rootFields.nth(1).getAttribute('data-field');
  const sendId = await rootFields.nth(2).getAttribute('data-field');
  const description = page.locator(`#description-${titleId}`); await description.fill('title');
  await focused(description); assert.equal((await schema(page)).properties.titulo.description, 'title'); assert.equal((await schema(page)).properties.title, undefined);
  const beforeError = await schema(page); const sendKey = page.locator(`#key-${sendId}`); await sendKey.fill('titulo');
  assert.equal(await sendKey.inputValue(), 'titulo'); assert.equal(await sendKey.getAttribute('aria-invalid'), 'true');
  assert(await page.locator('#preview-warning').isVisible()); assert(await page.locator('#copy').isDisabled()); assert.deepEqual(await schema(page), beforeError);
  await noOverflow(page, `duplicate-${width}`); await screenshot(page, `contract-${width}-duplicate`);
  await page.locator('#error-links a').first().click(); await focused(sendKey);
  await sendKey.fill('nome'); assert(!(await page.locator('#preview-warning').isVisible())); assert.equal((await schema(page)).properties.nome.type, 'boolean');
  await sendKey.fill('__proto__'); const safe = await schema(page); assert(Object.hasOwn(safe.properties, '__proto__')); assert.equal(safe.properties.__proto__.type, 'boolean');
  assert.equal(await page.evaluate(() => ({}).polluted), undefined);
  await sendKey.fill('<img src=x onerror=alert(1)>'); assert.equal(await page.locator('img').count(), 0); assert((await schema(page)).properties['<img src=x onerror=alert(1)>']);
  await sendKey.fill('identificador_com_extensao_'.repeat(4)); await noOverflow(page, `long-key-${width}`);
  await sendKey.fill('enviar_convite');
  const required = page.locator(`#required-${sendId}`); await required.check(); assert((await schema(page)).required.includes('enviar_convite'));
  await required.uncheck();
  const nestedKey = page.locator(`[data-field="${peopleId}"]`).getByLabel('Chave', { exact: true }).nth(1);
  await nestedKey.fill('nome_completo'); assert.deepEqual((await schema(page)).properties.participantes.items.required, ['nome_completo']);
  const beforeRemove = await schema(page);
  await page.getByRole('button', { name: 'Remover campo participantes em raiz', exact: true }).click(); await focused(page.locator(`#key-${sendId}`));
  assert.equal((await schema(page)).properties.participantes, undefined); await page.getByRole('button', { name: 'Desfazer', exact: true }).click();
  assert.deepEqual(await schema(page), beforeRemove); await focused(page.locator(`#key-${peopleId}`)); await screenshot(page, `contract-${width}-undo`);
  await page.getByRole('button', { name: 'Limpar', exact: true }).click(); await focused(page.locator('#add-root'));
  assert.deepEqual((await schema(page)).properties, {}); await page.getByRole('button', { name: 'Desfazer', exact: true }).click(); assert.deepEqual(await schema(page), beforeRemove);
  await page.locator(`#type-${peopleId}`).selectOption('number'); assert.equal((await schema(page)).properties.participantes.type, 'number');
  await page.getByRole('button', { name: 'Desfazer', exact: true }).click(); assert.deepEqual(await schema(page), beforeRemove);
  // Keyboard actions through actual form controls. No mutation through a debug API.
  const add = page.getByRole('button', { name: 'Adicionar campo em raiz', exact: true }); await add.focus(); await page.keyboard.press('Enter');
  const newCard = page.locator('[data-scope="root"] > .field-card').last(); const newKey = newCard.getByLabel('Chave', { exact: true }); await focused(newKey);
  assert.equal(await newCard.getByRole('combobox', { name: 'Tipo', exact: true }).count(), 1);
  await page.keyboard.press('Control+A'); await page.keyboard.type('confirmacao'); assert.equal((await schema(page)).properties.confirmacao.type, 'string');
  await page.keyboard.press('Tab'); await focused(newCard.getByLabel('Tipo', { exact: true }));
  await page.keyboard.press('ArrowDown');
  await focused(newCard.getByLabel('Tipo', { exact: true })); assert.equal((await schema(page)).properties.confirmacao.type, 'number');
  await page.keyboard.press('Tab'); await focused(newCard.getByLabel('Descrição', { exact: true })); await page.keyboard.type('Confirmacao numerica');
  await page.keyboard.press('Tab'); await focused(newCard.getByLabel('Obrigatório neste objeto', { exact: true })); await page.keyboard.press('Space');
  assert((await schema(page)).required.includes('confirmacao'));
  await page.getByRole('link', { name: 'JSON', exact: true }).click(); await focused(page.locator('#preview')); await noOverflow(page, `mobile-navigation-${width}`);
  await context.close(); pass(`real-controls-${width}`, { description: true, scope: true, required: true, duplicateRecovery: true, prototypeKey: true, textSafety: true, undoRemoveClearType: true, focus: true, keyboard: true, navigation: true });
}
async function depthFlow() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }); const page = await context.newPage();
  await page.goto(baseUrl); await page.getByRole('button', { name: 'Limpar', exact: true }).click();
  let add = page.getByRole('button', { name: 'Adicionar campo em raiz', exact: true }); let last;
  for (let depth = 1; depth <= 4; depth++) {
    await add.click(); last = page.locator('[data-field]').last(); await last.getByLabel('Tipo', { exact: true }).selectOption('object');
    const id = await last.getAttribute('data-field'); add = page.locator(`#add-${id}`);
  }
  assert(await add.isDisabled()); assert.equal(await last.getByLabel('Tipo', { exact: true }).locator('option[value="array"]').getAttribute('disabled'), '');
  assert((await add.getAttribute('aria-describedby')).startsWith('limit-')); await noOverflow(page, 'depth-4-390'); await screenshot(page, 'contract-390-depth-limit');
  assert.equal(await page.getByRole('button', { name: 'Copiar JSON', exact: true }).evaluate(node => getComputedStyle(node).transitionDuration), '0s');
  pass('depth-controls-and-reduced-motion', { maxDepth: 4, addDisabled: true, arrayDisabledAt4: true, explanation: true, reducedMotion: true }); await context.close();
}
async function clipboardFlow() {
  const context = await browser.newContext(); const page = await context.newPage();
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied'); } } }));
  await page.goto(baseUrl); await page.getByRole('button', { name: 'Copiar JSON', exact: true }).click();
  assert((await page.locator('#announcement').textContent()).includes('Não foi possível copiar')); await focused(page.locator('#json'));
  assert((await page.evaluate(() => window.getSelection().toString())).includes('"$schema"'));
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.observedCopy = text; } } }));
  await page.getByRole('button', { name: 'Copiar JSON', exact: true }).click(); assert.equal(await page.locator('#announcement').textContent(), 'JSON copiado.');
  assert.deepEqual(JSON.parse(await page.evaluate(() => window.observedCopy)), await schema(page));
  pass('clipboard-api-response', { rejection: true, manualSelection: true, successResponseStub: true, realSystemClipboard: 'not-tested' }); await context.close();
}
(async () => {
  const timeout = setTimeout(() => { failures.push({ name: 'timeout', reason: 'Bounded 120-second QA exceeded' }); process.exitCode = 1; browser?.close(); }, 120000);
  try { browser = await chromium.launch({ headless: true }); await widthFlow(1440); await widthFlow(390); await depthFlow(); await clipboardFlow(); }
  catch (error) {
    const state = currentPage && !currentPage.isClosed() ? await currentPage.evaluate(() => ({ active: document.activeElement?.id, controls: [...document.querySelectorAll('select')].map(node => ({ id: node.id, value: node.value, label: node.parentElement.textContent })), draftKeys: [...document.querySelectorAll('[data-control="key"]')].map(node => node.value) })) : null;
    if (currentPage && !currentPage.isClosed()) await screenshot(currentPage, 'failure-state');
    failures.push({ name: 'verification', reason: error.message, state }); process.exitCode = 1;
  }
  finally {
    clearTimeout(timeout); await browser?.close();
    const inputs = Object.fromEntries(['index.html', 'styles.css', 'model.js', 'app.js', 'model.test.cjs', 'UI-CONTRACT.md'].map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, file))).digest('hex')]));
    const screenshots = fs.readdirSync(output).filter(file => file.endsWith('.png')).map(file => ({ file, sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(output, file))).digest('hex') }));
    const receipt = { createdAt: new Date().toISOString(), cycle, confirmation, extensionReason: confirmation ? 'Exactly one coordinator-authorized execution after real aria-labelledby repair; cycles1/3 label defect and cycle2 transient screenshot failure preserved' : null, result: failures.length ? 'fail' : 'pass', command: `node verify.cjs --cycle=${cycle}${confirmation ? ' --aria-confirmation' : ''}`, url: baseUrl, engine: 'Chromium headless; authored SINAPSE UI', elapsedMs: Date.now() - started, inputs, screenshots, captureRetries, checks, failures, limits: ['Local synthetic demo only', 'No original-reference behavior test', 'Clipboard response stub, not OS clipboard', 'No backend, mobile device or formal WCAG certification'] };
    fs.writeFileSync(path.join(output, 'evidenceQA.json'), JSON.stringify(receipt, null, 2) + '\n');
    console.log(JSON.stringify({ result: receipt.result, checks: checks.length, failures, receipt: path.join(output, 'evidenceQA.json') }));
  }
})();
