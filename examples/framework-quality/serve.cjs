'use strict';
// Read-only, loopback-only local preview. No installs, writes or environment paths.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = fs.realpathSync(__dirname);
const args = process.argv.slice(2);
if (args.length > 1 || (args.length && !/^--port=\d+$/.test(args[0]))) {
  process.stderr.write('Usage: node serve.cjs [--port=4179]\n'); process.exit(1);
}
const port = args.length ? Number(args[0].slice(7)) : 4179;
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  process.stderr.write('Port must be an integer from 1024 to 65535.\n'); process.exit(1);
}
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.md': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webm': 'video/webm', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.vtt': 'text/vtt; charset=utf-8' };
const publicMediaExports = new Set([
  'output/media/attempt-002/lume-reel.mp4',
  'output/media/attempt-002/lume-sound.wav',
  'output/media/attempt-002/reel-frame-00.png',
  ...Array.from({ length: 5 }, (_, index) => `output/media/attempt-002/carousel-0${index + 1}.png`),
]);
function publicFile(file) {
  const relative = path.relative(root, file);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) return false;
  const segments = relative.split(path.sep).map(segment => segment.toLowerCase());
  if (publicMediaExports.has(segments.join('/'))) return true;
  return segments.every(segment => !segment.startsWith('.') && !['output', 'library', 'captures'].includes(segment)) && Object.hasOwn(types, path.extname(file).toLowerCase());
}
const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname); } catch { response.writeHead(400).end(); return; }
  const candidate = path.resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
  if (!candidate.startsWith(`${root}${path.sep}`) || !publicFile(candidate)) { response.writeHead(404).end(); return; }
  let file; let stat;
  try { file = fs.realpathSync(candidate); stat = fs.statSync(file); } catch { response.writeHead(404).end(); return; }
  if (!file.startsWith(`${root}${path.sep}`) || !stat.isFile() || !publicFile(file)) { response.writeHead(404).end(); return; }
  const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range || '');
  if (request.headers.range && !range) { response.writeHead(416).end(); return; }
  const start = range ? Number(range[1]) : 0;
  const end = range && range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) {
    response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end(); return;
  }
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': end - start + 1, 'Accept-Ranges': 'bytes', 'X-Content-Type-Options': 'nosniff' };
  if (range) headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
  response.writeHead(range ? 206 : 200, headers);
  if (request.method === 'HEAD') { response.end(); return; }
  const stream = fs.createReadStream(file, { start, end });
  stream.on('error', () => response.destroy());
  response.on('close', () => stream.destroy());
  stream.pipe(response);
});
server.on('error', () => { process.stderr.write('Local preview could not bind the requested port.\n'); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => process.stdout.write(`http://127.0.0.1:${port}/\n`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
