#!/usr/bin/env node
/* global document:readonly, innerWidth:readonly, getComputedStyle:readonly */
'use strict';
// Development QA of authored local pages only. No install, external browsing, or user session.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = __dirname;
const cycle = Number(process.argv.find((arg) => arg.startsWith('--cycle='))?.split('=')[1] || 1);
const finalStatus = process.argv.includes('--final-status');
assert(Number.isInteger(cycle) && cycle >= 1 && cycle <= (finalStatus ? 2 : 3), 'Bounded QA: final-status 1–2; earlier fixture 1–3');
const output = path.join(root, 'output', 'expertise-20261007', `${finalStatus ? 'hub-final-status' : process.argv.includes('--metrics-only') ? 'hub-metrics' : 'hub'}-cycle-${cycle}`);
assert(!fs.existsSync(output), 'Preserve previous evidence; choose the next cycle');
fs.mkdirSync(output, { recursive: true });
const checks = []; const failures = [];
const started = Date.now();
let browser;
const baseUrl = 'http://127.0.0.1:4187/';
let timeout;
const pass = (name, detail) => checks.push({ name, status: 'observed-pass', detail });
const metricsOnly = process.argv.includes('--metrics-only');
function verifyMetricDerivation() {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'hub-data.json'), 'utf8'));
  const repository = path.resolve(root, '../..');
  const packs = data.metricProvenance.inputs.map(input => {
    const raw = fs.readFileSync(path.join(repository, input.path));
    assert.equal(crypto.createHash('sha256').update(raw).digest('hex'), input.sha256, `Public pack ${input.cohort} hash`);
    return JSON.parse(raw);
  });
  const profiles = packs.flatMap(pack => pack.profiles);
  assert.equal(new Set(profiles.map(profile => profile.agentId)).size, 172);
  const derived = {
    individualProfiles: profiles.length,
    specificMechanisms: profiles.reduce((sum, profile) => sum + profile.mechanisms.length, 0),
    mentalModels: profiles.reduce((sum, profile) => sum + profile.mentalModels.length, 0),
    qualityCriteria: profiles.reduce((sum, profile) => sum + profile.qualityCriteria.length, 0),
    diagnosticCases: profiles.filter(profile => profile.diagnosticCase || profile.heldOutCase).length,
    externalSectionReads: packs.reduce((sum, pack) => sum + pack.sources.filter(source => (source.status === 'SECTION_READ' || (source.status === 'READ' && source.sourceScope === 'external-section')) && /^https:\/\//.test(source.url)).length, 0)
  };
  for (const [metric, value] of Object.entries(derived)) assert.equal(data.metrics[metric], value, `Derived metric ${metric}`);
  assert.equal(data.metrics.validatedExperts, 0);
  pass('public-metric-derivation', { derived, publicPackHashes: true, uniqueProfiles: true });
  if (finalStatus) {
    const sources = packs.flatMap(pack => pack.sources);
    assert.equal(sources.filter(source => source.status === 'READ' && source.sourceScope !== 'external-section').length, data.metrics.localReadContracts);
    assert.equal(sources.filter(source => source.status === 'CANDIDATE').length, data.metrics.newCandidateReferences);
    const review = JSON.parse(fs.readFileSync(path.join(repository, data.metricProvenance.review.path), 'utf8'));
    assert.deepEqual(data.metricProvenance.review.counts, review.counts);
    assert.equal(review.counts.PASS, 172); assert.equal(review.cycle, 3);
    assert.equal(data.installation.executionObserved, false);
    assert.equal(data.installation.selectedContextChecks, 42);
    assert.equal(data.installation.providerEntrypointsEqual, true);
    assert.equal(data.installation.preservation.personalMismatches, 0);
    assert.equal(data.installation.rawMatrix.criticalCriteria, 582);
    pass('final-status-evidence', { review: review.counts, localReadContracts: data.metrics.localReadContracts, newCandidates: data.metrics.newCandidateReferences, offlineOnly: true, actualContextChecks: 42, globalExperts: 0 });
  }
}
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
  assert.equal(await page.locator('#reviewed-commands').textContent(), String(current.metrics.specificMechanisms));
  assert.equal(current.metrics.individualProfiles, 172);
  assert.equal(current.metrics.specificMechanisms, 409);
  assert.equal(current.metrics.mentalModels, 344);
  assert.equal(current.metrics.qualityCriteria, 635);
  assert.equal(current.metrics.externalSectionReads, 75);
  assert.equal(current.metrics.diagnosticCases, 172);
  assert.equal(await page.locator('#exemplos a').count(), 5);
  assert.equal(await page.getByRole('link', { name: 'Abrir editor de contratos' }).getAttribute('href'), 'contract-builder/');
  if (finalStatus) {
    assert((await page.locator('#install-status').textContent()).includes('Instalação pessoal conferida'));
    assert((await page.locator('#install-status').textContent()).includes('sem inferência nativa'));
    assert((await page.locator('#publish-status').textContent()).includes('PR #416 aberta'));
    assert.equal(await page.locator('#pull-request-link').getAttribute('href'), 'https://github.com/caioimori/sinapse-ai/pull/416');
    assert((await page.locator('.hero-state').textContent()).includes('recuperação offline'));
    assert(!(await page.locator('.hero-state').textContent()).includes('Revisão em andamento'));
  }
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
  let external = 0;
  for (const href of new Set(links)) {
    const url = new URL(href, baseUrl);
    if (url.origin !== new URL(baseUrl).origin) {
      assert.equal(url.href, 'https://github.com/caioimori/sinapse-ai/pull/416', 'Only the confirmed delivery PR may be external');
      const link = page.locator('#pull-request-link');
      assert.equal(await link.getAttribute('target'), '_blank');
      assert.equal(await link.getAttribute('rel'), 'noopener noreferrer');
      external += 1;
      continue; // PR state is read back separately through the authenticated GitHub CLI.
    }
    const response = await context.request.get(url.href); assert.equal(response.status(), 200, `Link ${href}`);
    if (url.hash) {
      await page.goto(url.href);
      assert.equal(await page.locator(`[id="${url.hash.slice(1)}"]`).count(), 1, `Fragment ${href}`);
    }
  }
  assert.equal(external, 1);
  pass('links', { checked: new Set(links).size, external, missing: 0, externalProbe: 'Separate authenticated GitHub readback' }); await context.close();
}
async function verifyRecovery() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }); const page = await context.newPage();
  await page.route('**/hub-data.json', (route) => route.fulfill({ status: 503, body: 'unavailable' }));
  await page.goto(baseUrl); await page.locator('#load-error').waitFor({ state: 'visible' });
  assert(await page.getByRole('heading', { name: 'Mais clareza. Mais qualidade.' }).isVisible());
  assert.equal(await page.locator('#exemplos a').count(), 5);
  await noOverflow(page, 'load-error-390');
  await page.screenshot({ path: path.join(output, 'hub-390-error.png'), fullPage: true });
  await page.unroute('**/hub-data.json'); await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await page.waitForFunction(() => document.querySelectorAll('.squad').length === 17);
  assert(!(await page.locator('#load-error').isVisible()));
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  pass('recovery-reduced', { errorPreservesOverview: true, examplesPreserved: 5, retryLoads: true, reducedMotion: 'auto scroll' }); await context.close();
}
(async () => {
  try {
    verifyMetricDerivation();
    timeout = setTimeout(() => { throw new Error('Bounded QA timeout: 150 seconds'); }, 150000);
    if (!metricsOnly) {
      browser = await chromium.launch({ headless: true });
      for (const width of [1440, 390, 320]) await verifyWidth(width);
      await verifyLinks(); await verifyRecovery();
    }
    assert.equal(failures.length, 0, 'No unhandled page errors');
  } catch (error) { failures.push({ name: 'verification', reason: error.message }); process.exitCode = 1; }
  finally {
    clearTimeout(timeout); if (browser) await browser.close();
    const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
    fs.writeFileSync(path.join(output, 'receipt.json'), JSON.stringify({ schemaVersion: 1, scope: metricsOnly ? 'Public metrics derivation only; no browser or visual QA' : 'Local authored hub only; not field accessibility or deployment', checks, failures, durationMs: Date.now() - started, sourceHashes: Object.fromEntries(['index.html', 'hub.css', 'hub.js', 'hub-data.json', 'verify-hub.cjs'].map((file) => [file, hash(file)])) }, null, 2));
    process.stdout.write(JSON.stringify({ checks: checks.length, failures, output, elapsedMs: Date.now() - started }) + '\n');
  }
})();
