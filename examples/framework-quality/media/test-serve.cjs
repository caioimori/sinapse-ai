'use strict';
const { spawn } = require('node:child_process');
const path = require('node:path');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const root = path.resolve(__dirname, '..');
const child = spawn(process.execPath, [path.join(root, 'serve.cjs'), '--port=4197'], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
const guard = setTimeout(() => { child.kill(); process.exitCode = 1; }, 15000);
(async () => {
  const checks = [];
  try {
    const address = await new Promise((resolve, reject) => {
      child.stdout.once('data', (bytes) => resolve(bytes.toString().trim()));
      child.once('error', reject);
      child.once('exit', (code) => reject(new Error(`Preview exited early: ${code}`)));
    });
    assert.equal(address, 'http://127.0.0.1:4197/');
    const index = await fetch(address); assert.equal(index.status, 200);
    assert((await index.text()).includes('Abrir carrossel')); checks.push('GET streams complete HTML');
    const head = await fetch(address, { method: 'HEAD' }); assert.equal(head.status, 200);
    assert.equal((await head.text()).length, 0); checks.push('HEAD has no body');
    const video = await fetch(`${address}output/media/attempt-002/lume-reel.mp4`, { headers: { Range: 'bytes=0-15' } });
    assert.equal(video.status, 206); assert.equal(video.headers.get('content-type'), 'video/mp4');
    assert.equal((await video.arrayBuffer()).byteLength, 16); checks.push('MP4 byte range');
    assert.equal((await fetch(address, { method: 'POST' })).status, 405); checks.push('writes rejected');
    assert.equal((await fetch(`${address}%2e%2e%5c%2e%2e%5cAGENTS.md`)).status, 404); checks.push('encoded Windows traversal rejected');
    assert.equal((await fetch(`${address}index.html`, { headers: { Range: 'bytes=999999999999-' } })).status, 416); checks.push('out-of-bounds range rejected');
    assert.equal((await fetch(`${address}media/captions.vtt`)).headers.get('content-type'), 'text/vtt; charset=utf-8'); checks.push('VTT mime');
    const file = path.join(root, 'output', 'media', 'attempt-002', 'server-check.json');
    fs.writeFileSync(file, JSON.stringify({ status: 'technical-pass', checks, port: 4197, host: '127.0.0.1', limits: 'Local static read-only helper; no remote publishing.' }, null, 2));
    console.log(JSON.stringify({ status: 'technical-pass', checks: checks.length }));
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1;
  } finally { clearTimeout(guard); child.kill(); }
})();
