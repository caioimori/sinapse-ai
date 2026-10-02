/* global document, innerWidth, innerHeight, getComputedStyle */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../../..');
const baseline = process.argv.includes('--baseline');
const cycle = Number(process.argv.find((argument) => argument.startsWith('--cycle='))?.split('=')[1] || 1);
assert(Number.isInteger(cycle) && cycle >= 1 && cycle <= 3, 'Maximum three verification cycles');
const output = path.join(root, 'examples/framework-quality/output/closeout-20261002/frontend', `${baseline ? 'before' : 'after'}-cycle-${cycle}`);
assert(!fs.existsSync(output), 'Preserve previous receipts');
fs.mkdirSync(output, { recursive: true });
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sources = ['shared.css', 'ui/app.js', 'ui/index.html', 'ui/verify-toast.cjs'];
const report = {
  schemaVersion: 1,
  kind: 'lume-toast-functional-reflow-review',
  observer: '/root/closeout_frontend',
  observedAt: new Date().toISOString(),
  baseline,
  cycle,
  sourceHashes: Object.fromEntries(sources.map((file) => [file, hash(path.join(root, 'examples/framework-quality', file))])),
  checks: [],
  screenshots: [],
  errors: [],
  states: [],
  limits: ['Headless Chromium with viewport emulation; no screen-reader, physical-device or cross-browser certification', 'Fictional in-memory fixture; no persistence or backend proof'],
};
function check(width, state, criterion, passed, observed) {
  report.checks.push({ width, state, criterion, passed, observed });
}
async function geometry(page) {
  return page.evaluate(() => {
    const focus = document.activeElement;
    const toast = document.getElementById('toast');
    const bounds = focus.getBoundingClientRect();
    const toastBounds = toast.getBoundingClientRect();
    const intersectionWidth = Math.max(0, Math.min(bounds.right, toastBounds.right) - Math.max(bounds.left, toastBounds.left));
    const intersectionHeight = Math.max(0, Math.min(bounds.bottom, toastBounds.bottom) - Math.max(bounds.top, toastBounds.top));
    const centerHit = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    return {
      viewport: { width: innerWidth, height: innerHeight },
      focus: { text: focus.textContent, project: focus.dataset.project || null, id: focus.id, rect: bounds.toJSON() },
      toast: { hidden: toast.hidden, text: toast.textContent.trim(), rect: toastBounds.toJSON(), undoHeight: document.getElementById('undo').getBoundingClientRect().height },
      intersectionArea: intersectionWidth * intersectionHeight,
      intersectionRatio: intersectionWidth * intersectionHeight / (bounds.width * bounds.height),
      focusedCenterHittable: centerHit === focus || focus.contains(centerHit),
      focusOutlineVisible: bounds.top >= 8 && bounds.bottom <= innerHeight - 8,
      overflow: document.documentElement.scrollWidth > innerWidth,
      clearance: getComputedStyle(document.documentElement).getPropertyValue('--toast-clearance').trim(),
      announcement: document.getElementById('announcement').textContent,
    };
  });
}
async function capture(page, width, state) {
  const file = path.join(output, `${width}-${state}.png`);
  await page.screenshot({ path: file, fullPage: false });
  report.screenshots.push({ width, state, path: path.relative(root, file).replaceAll('\\', '/'), sha256: hash(file) });
}
async function verifyExposed(page, width, state) {
  const observed = await geometry(page);
  report.states.push({ width, state, observed });
  check(width, state, 'focused control has no toast intersection', observed.intersectionArea === 0, observed.intersectionRatio);
  check(width, state, 'focused control accepts pointer at its center', observed.focusedCenterHittable, observed.focus.id || observed.focus.project);
  check(width, state, 'focused control and outline remain inside viewport', observed.focusOutlineVisible, observed.focus.rect);
  check(width, state, 'no horizontal page overflow', !observed.overflow, observed.viewport.width);
  await capture(page, width, state);
  return observed;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1440, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 1000 : 844 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', (error) => report.errors.push({ width, message: error.message }));
      await page.goto('http://127.0.0.1:4179/ui/');
      for (const id of baseline ? ['01'] : ['01', '02', '03']) {
        const open = page.locator(`button[data-project="${id}"]`);
        await open.press('Enter');
        check(width, `dialog-${id}`, 'dialog receives expected focus', await page.locator('#detail-status').evaluate((element) => document.activeElement === element), id);
        const previous = await page.locator('#detail-status').inputValue();
        const next = previous === 'Produzir' ? 'Revisar' : 'Produzir';
        await page.locator('#detail-status').selectOption(next);
        await page.getByRole('button', { name: 'Salvar etapa', exact: true }).press('Enter');
        await page.locator('#toast').waitFor({ state: 'visible' });
        await page.waitForFunction((project) => document.activeElement.matches(`button[data-project="${project}"]`), id);
        const saved = await verifyExposed(page, width, `saved-${id}`);
        check(width, `saved-${id}`, 'status announces changed stage and undo', saved.announcement.includes(next) && saved.announcement.includes('desfazer'), saved.announcement);
        if (baseline) continue;
        check(width, `saved-${id}`, 'undo touch target is at least 44px', saved.toast.undoHeight >= 44, saved.toast.undoHeight);
        check(width, `saved-${id}`, 'positive clearance reserves feedback space', Number.parseFloat(saved.clearance) > saved.toast.rect.height, saved.clearance);
        let traversed = 0;
        do {
          await page.keyboard.press('Tab');
          traversed += 1;
          const current = await geometry(page);
          if (current.focus.id !== 'undo') {
            check(width, `tab-${id}-${traversed}`, 'keyboard traversal avoids toast occlusion', current.intersectionArea === 0 && current.focusedCenterHittable, current.focus.project || current.focus.id);
          }
        } while (await page.locator('#undo').evaluate((element) => document.activeElement !== element) && traversed < 8);
        check(width, `undo-${id}`, 'undo reachable by keyboard', await page.locator('#undo').evaluate((element) => document.activeElement === element), traversed);
        await capture(page, width, `undo-focus-${id}`);
        await page.keyboard.press('Enter');
        await page.locator('#toast').waitFor({ state: 'hidden' });
        await page.waitForFunction((project) => document.activeElement.matches(`button[data-project="${project}"]`), id);
        const undone = await verifyExposed(page, width, `undone-${id}`);
        check(width, `undone-${id}`, 'undo restores previous status', await page.locator(`article.project:has(button[data-project="${id}"]) .status`).innerText() === previous, previous);
        check(width, `undone-${id}`, 'undo releases reserved feedback space', Number.parseFloat(undone.clearance) === 0, undone.clearance);
        check(width, `undone-${id}`, 'undo announces restored status', undone.announcement.includes('desfeita') && undone.announcement.includes(previous), undone.announcement);
        await open.press('Enter');
        await page.keyboard.press('Escape');
        await page.waitForFunction((project) => document.activeElement.matches(`button[data-project="${project}"]`), id);
        check(width, `cancel-${id}`, 'escape closes dialog and restores the same project focus', !(await page.locator('#details').evaluate((element) => element.open)), id);
      }
      if (!baseline) {
        await page.locator('button[data-project="01"]').press('Enter');
        await page.locator('#detail-status').selectOption('Produzir');
        await page.getByRole('button', { name: 'Salvar etapa', exact: true }).press('Enter');
        await page.waitForFunction(() => document.activeElement.matches('button[data-project="01"]'));
        await page.setViewportSize({ width: width === 1440 ? 390 : 1440, height: 844 });
        await page.waitForFunction(() => {
          const focus = document.activeElement.getBoundingClientRect();
          const toast = document.getElementById('toast').getBoundingClientRect();
          return focus.right <= toast.left || focus.left >= toast.right || focus.bottom <= toast.top - 8 || focus.top >= toast.bottom + 8;
        });
        await verifyExposed(page, width, 'responsive-with-active-toast');
      }
      await context.close();
    }
  } catch (error) {
    report.errors.push({ message: error.stack });
  } finally {
    await browser.close();
    report.passed = report.checks.filter((entry) => entry.passed).length;
    report.failed = report.checks.filter((entry) => !entry.passed).length;
    report.status = baseline ? 'baseline-observed' : report.failed === 0 && report.errors.length === 0 ? 'PASS' : 'FAIL';
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ status: report.status, passed: report.passed, failed: report.failed, errors: report.errors, screenshots: report.screenshots.length, receipt: path.relative(root, path.join(output, 'report.json')).replaceAll('\\', '/') }));
    if (!baseline && (report.failed || report.errors.length)) process.exitCode = 1;
  }
})();
