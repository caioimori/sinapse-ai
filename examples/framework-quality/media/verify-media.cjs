/* global document:readonly, innerWidth:readonly */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const attempt = Number(process.argv.find((arg) => arg.startsWith('--attempt='))?.split('=')[1] || 1);
assert(Number.isInteger(attempt) && attempt >= 1 && attempt <= 3);
const output = path.join(root, 'output', 'media', `attempt-${String(attempt).padStart(3, '0')}`);
const qaCycle = Number(process.argv.find((arg) => arg.startsWith('--qa-cycle='))?.split('=')[1] || 1);
assert(Number.isInteger(qaCycle) && qaCycle >= 1 && qaCycle <= 3);
const evidence = path.join(output, `browser-${qaCycle}`);
assert(fs.existsSync(output), 'Render first');
assert(!fs.existsSync(evidence), 'Preserve previous browser evidence');
fs.mkdirSync(evidence);
const checks = [];
const errors = [];
const mimes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mp4': 'video/mp4', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.png': 'image/png', '.vtt': 'text/vtt; charset=utf-8' };
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { response.writeHead(400).end(); return; }
  const file = path.resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
  if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404).end(); return; }
  const bytes = fs.statSync(file).size;
  const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range || '');
  const start = range ? Number(range[1]) : 0;
  const end = range && range[2] ? Math.min(Number(range[2]), bytes - 1) : bytes - 1;
  if (start > end || start >= bytes) { response.writeHead(416, { 'Content-Range': `bytes */${bytes}` }).end(); return; }
  const headers = { 'Content-Type': mimes[path.extname(file)] || 'application/octet-stream', 'Content-Length': end - start + 1, 'Accept-Ranges': 'bytes' };
  if (range) headers['Content-Range'] = `bytes ${start}-${end}/${bytes}`;
  response.writeHead(range ? 206 : 200, headers);
  fs.createReadStream(file, { start, end }).pipe(response);
});
let browser;
const guard = setTimeout(() => { process.stderr.write('Media browser verification exceeded 150 seconds\n'); process.exitCode = 1; browser?.close(); server.close(); }, 150000);
(async () => {
  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true });
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 844 } });
      page.setDefaultTimeout(10000);
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.project').count(), 4);
      assert.equal(await page.getByRole('link', { name: 'Abrir Reel', exact: true }).getAttribute('href'), 'media/index.html#reel-title');
      assert.equal(await page.getByRole('link', { name: 'Abrir carrossel', exact: true }).getAttribute('href'), 'media/index.html#carousel-title');
      const hubOverflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
      assert(hubOverflow.document <= width && hubOverflow.body <= width);
      await page.screenshot({ path: path.join(evidence, `hub-${width}.png`), fullPage: true });
      checks.push({ name: `hub-${width}`, status: 'observed-pass', projects: 4, overflow: hubOverflow });
      await page.goto(`${base}/media/index.html`, { waitUntil: 'networkidle' });
      await page.locator('.pages img').evaluateAll((images) => images.forEach((image) => { image.loading = 'eager'; }));
      await page.waitForFunction(() => [...document.querySelectorAll('.pages img')].every((image) => image.complete && image.naturalWidth === 1080));
      assert.equal(await page.locator('.pages img').count(), 5);
      const overflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
      assert(overflow.document <= width && overflow.body <= width, `Overflow at ${width}`);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 1);
      const video = await page.locator('video').evaluate(async (element) => {
        element.muted = true;
        const track = element.textTracks[0]; track.mode = 'hidden';
        await element.play();
        return { duration: element.duration, width: element.videoWidth, height: element.videoHeight, controls: element.controls, trackCount: element.textTracks.length };
      });
      assert.equal(video.duration, 18); assert.equal(video.width, 1080); assert.equal(video.height, 1920); assert(video.controls); assert.equal(video.trackCount, 1);
      await page.waitForFunction(() => document.querySelector('video').currentTime > .3);
      await page.locator('video').evaluate((element) => { element.pause(); element.currentTime = 0; });
      await page.waitForFunction(() => document.querySelector('video').textTracks[0].cues?.length === 5);
      await page.screenshot({ path: path.join(evidence, `media-${width}.png`), fullPage: true });
      await page.locator('video').screenshot({ path: path.join(evidence, `player-${width}.png`) });
      checks.push({ name: `media-${width}`, status: 'observed-pass', overflow, images: 5, video, playback: 'currentTime advanced; paused', captions: 5 });
      await page.close();
    }
    assert.equal(errors.length, 0, errors.join('\n'));
  } catch (error) {
    errors.push(error.message); process.exitCode = 1;
  } finally {
    clearTimeout(guard); await browser?.close(); await new Promise((resolve) => server.close(resolve));
    const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    const receipt = { status: errors.length ? 'failed' : 'technical-pass', checks, errors, sources: ['index.html', '../index.html', 'verify-media.cjs'].map((file) => ({ file, sha256: hash(path.join(__dirname, file)) })), screenshots: fs.readdirSync(evidence).filter((file) => file.endsWith('.png')).map((file) => ({ file, sha256: hash(path.join(evidence, file)) })), limits: 'Headless local browser; no subjective audio listening or aesthetic approval.' };
    fs.writeFileSync(path.join(evidence, 'receipt.json'), JSON.stringify(receipt, null, 2));
    console.log(JSON.stringify({ status: receipt.status, checks: checks.length, errors, evidence }));
  }
})();
