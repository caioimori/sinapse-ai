#!/usr/bin/env node
'use strict';

// Manual, pinned import. Downloaded Markdown is data and is never executed.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { promisify } = require('util');
const runFile = promisify(execFile);
const ROOT = path.resolve(__dirname, '..', 'packages', 'engineering-workflows');
const SITE = 'https://mapa-engenharia-software.vercel.app/';
const REPOSITORY = 'https://github.com/caioimori/engenharia-de-software';
const LIMIT_BYTES = 2 * 1024 * 1024;
const WAVE_PATHS = [
  'fase-2-extracao/onda-1-craftsmanship/LOOPS-craftsmanship-diagramas.md',
  'fase-2-extracao/onda-2-arquitetura-dominio/LOOPS-design-arquitetura-diagramas.md',
  'fase-2-extracao/onda-3-sistemas-maquina/LOOPS-onda-3-sistemas-maquina-diagramas.md',
  'fase-2-extracao/onda-4-dados-comunicacao/LOOPS-onda-4-dados-comunicacao-diagramas.md',
  'fase-2-extracao/onda-5-operacao-confiabilidade/LOOPS-onda-5-operacao-confiabilidade-diagramas.md',
  'fase-2-extracao/onda-6-fundamentos-linguagens/LOOPS-onda-6-fundamentos-linguagens-diagramas.md',
  'fase-2-extracao/onda-7-processo-pessoas/LOOPS-onda-7-processo-pessoas-diagramas.md',
  'fase-2-extracao/onda-8-engenharia-aumentada-ia/LOOPS-onda-8-engenharia-aumentada-ia-diagramas.md',
  'fase-2-extracao/onda-9-seguranca-ciberseguranca/LOOPS-onda-9-seguranca-ciberseguranca-diagramas.md',
  'fase-2-extracao/onda-10-frontend-web-platform/LOOPS-onda-10-frontend-web-platform-diagramas.md',
  'fase-2-extracao/onda-11-design-systems-product-craft/LOOPS-onda-11-design-systems-product-craft-diagramas.md',
  'fase-2-extracao/onda-12-data-analytics-ml/LOOPS-onda-12-data-analytics-ml-diagramas.md',
  'fase-2-extracao/onda-13-operability-performance-economics/LOOPS-onda-13-operability-performance-economics-diagramas.md',
  'fase-2-extracao/onda-14-delivery-surfaces-practice/LOOPS-onda-14-delivery-surfaces-practice-diagramas.md',
  'pratica-curso-agents-skills/LOOPS-curso-agents-skills-diagramas.md',
];

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizeText(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// The first seven waves include a real master loop, sometimes an H1 rather than
// an H2. Count it once; do not invent a workflow from an index/table entry.
function parseSections(markdown) {
  const headings = [...markdown.matchAll(/^(#{1,2})\s+([^\r\n]+)\r?$/gm)];
  const sections = headings.map((match, index) => ({
    heading: match[0].trimEnd(),
    title: match[2].trim(),
    start: match.index,
    end: headings[index + 1]?.index ?? markdown.length,
  }));
  const isNumbered = (item) => /^[A-Z]\d+\s*[—–-]/.test(item.title);
  const isMaster = (item) => /^loop mestre\b/.test(normalizeText(item.title));
  return [
    ...sections.filter(isNumbered),
    ...sections.filter(isMaster),
  ].map((section) => {
    const content = markdown.slice(section.start, section.end);
    if (!/```mermaid\s/.test(content)) {
      throw new Error(`Workflow has no Mermaid contract: ${section.heading}`);
    }
    const prose = content.slice(section.heading.length).split(/```/)[0]
      .replace(/^\s*>\s?/gm, '').replace(/\*\*|`/g, '').trim();
    return {
      ...section,
      summary: prose.replace(/\s+/g, ' ').slice(0, 600) || section.title,
    };
  });
}

async function downloadPublic(relativePath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(new URL(relativePath, SITE), {
      signal: controller.signal,
      redirect: 'error',
    });
    if (!response.ok) throw new Error(`Public source unavailable (${response.status}): ${relativePath}`);
    if (Number(response.headers.get('content-length')) > LIMIT_BYTES) throw new Error('Source exceeds byte limit');
    const chunks = [];
    let bytes = 0;
    for await (const chunk of response.body) {
      bytes += chunk.length;
      if (bytes > LIMIT_BYTES) {
        controller.abort();
        throw new Error('Source exceeds byte limit');
      }
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf8');
  } finally {
    clearTimeout(timer);
  }
}

async function downloadPinned(relativePath, revision) {
  // gh uses the existing authenticated session. Never inspect credentials or
  // persist access-bearing download_url fields returned by the Contents API.
  const { stdout } = await runFile('gh', [
    'api', `repos/caioimori/engenharia-de-software/contents/${relativePath}?ref=${revision}`,
  ], { timeout: 20000, maxBuffer: LIMIT_BYTES * 2, windowsHide: true });
  const result = JSON.parse(stdout);
  if (result.encoding !== 'base64' || typeof result.content !== 'string') {
    throw new Error(`Pinned source has no inline content: ${relativePath}`);
  }
  const buffer = Buffer.from(result.content, 'base64');
  if (buffer.length > LIMIT_BYTES) throw new Error('Pinned source exceeds byte limit');
  return buffer.toString('utf8');
}

async function retrieve(relativePath, revision) {
  const pinned = await downloadPinned(relativePath, revision);
  const published = await downloadPublic(relativePath);
  const publicSha256 = sha256(published);
  if (pinned.replace(/\r\n/g, '\n') !== published.replace(/\r\n/g, '\n')) {
    throw new Error(`Public source differs from pinned revision: ${relativePath}`);
  }
  return { relativePath, markdown: pinned, sha256: sha256(pinned), publicSha256 };
}

async function mapBounded(items, operation) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await operation(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(3, items.length) }, worker));
  return results;
}

function buildCatalog(index, documents, revision) {
  if (index.site?.license !== 'CC-BY-SA-4.0' || index.domains?.length !== 60) {
    throw new Error('Unexpected source license or domain count');
  }
  const domains = index.domains.map((domain) => ({
    id: String(domain.id).padStart(2, '0'),
    title: domain.titulo,
    sourceUrl: domain.md,
    wave: domain.onda,
  }));
  const workflows = [];
  const mismatches = [];
  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const kind = i === 14 ? 'applied' : 'canonical';
    const wave = i === 14 ? 0 : i + 1;
    const sections = parseSections(document.markdown);
    const expected = kind === 'applied' ? 10 : index.ondas.find((item) => item.n === wave)?.count;
    if (sections.length !== expected) {
      throw new Error(`Count mismatch in wave ${wave}: expected ${expected}, observed ${sections.length}`);
    }
    const declared = /total_workflows:\s*(\d+)/.exec(document.markdown)?.[1];
    if (declared && Number(declared) !== sections.length) {
      mismatches.push({ path: document.relativePath, declared: Number(declared), observed: sections.length });
    }
    sections.forEach((section, position) => {
      const number = position + 1;
      const title = section.title.replace(/^[A-Z]\d+\s*[—–-]\s*/, '');
      workflows.push({
        id: kind === 'applied' ? `applied-w${String(number).padStart(2, '0')}` : `wave-${String(wave).padStart(2, '0')}-w${String(number).padStart(2, '0')}`,
        kind,
        wave,
        number,
        title,
        summary: section.summary,
        domains: kind === 'applied' ? ['23', '25', '26', '28'] : domains.filter((domain) => domain.wave === wave).map((domain) => domain.id),
        tags: [...new Set(normalizeText(title).split(/[^a-z0-9]+/).filter((token) => token.length > 2))].sort(),
        source: {
          path: `sources/${revision}/${document.relativePath}`,
          originalPath: document.relativePath,
          sha256: document.sha256,
          url: new URL(document.relativePath, SITE).href,
          heading: section.heading,
        },
        executionMode: 'guided',
      });
    });
  }
  const stats = {
    canonical: workflows.filter((workflow) => workflow.kind === 'canonical').length,
    applied: workflows.filter((workflow) => workflow.kind === 'applied').length,
    domains: domains.length,
  };
  if (stats.canonical !== 275 || stats.applied !== 10) throw new Error('Canonical/applied coverage mismatch');
  return {
    schemaVersion: '1.0.0',
    source: { repository: REPOSITORY, revision, license: 'CC-BY-SA-4.0', publicSite: SITE, publiclyVerified: true },
    stats,
    sourceMetadataMismatches: mismatches,
    domains,
    workflows,
  };
}

async function importCatalog(revision, outputRoot = ROOT) {
  if (!/^[a-f0-9]{40}$/.test(revision || '')) throw new Error('Provide --revision with a full 40-character commit SHA');
  const indexDocument = await retrieve('index.json', revision);
  const documents = await mapBounded(WAVE_PATHS, (relativePath) => retrieve(relativePath, revision));
  const catalog = buildCatalog(JSON.parse(indexDocument.markdown), documents, revision);
  // All downloads, publication checks and counts pass before a filesystem write.
  // Revision directories are immutable; only the final catalog pointer changes.
  const allDocuments = [indexDocument, ...documents];
  for (const document of allDocuments) {
    const target = path.join(outputRoot, 'sources', revision, document.relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (fs.existsSync(target)) {
      if (sha256(fs.readFileSync(target)) !== document.sha256) throw new Error('Existing revision content drift');
    } else {
      fs.writeFileSync(target, document.markdown, { encoding: 'utf8', flag: 'wx' });
    }
  }
  const manifest = {
    schemaVersion: '1.0.0',
    repository: REPOSITORY,
    revision,
    publicSite: SITE,
    license: 'CC-BY-SA-4.0',
    attribution: 'Caio Imori — Engenharia de Software — Base de Conhecimento',
    publicComparison: 'Equal content after CRLF-to-LF normalization; original pinned bytes preserved',
    files: allDocuments.map((document) => ({ path: document.relativePath, sha256: document.sha256, publicSha256: document.publicSha256, bytes: Buffer.byteLength(document.markdown), publiclyVerified: true })),
  };
  fs.writeFileSync(path.join(outputRoot, 'sources', revision, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  const target = path.join(outputRoot, 'catalog.json');
  const temporary = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(catalog, null, 2)}\n`, { flag: 'wx' });
  fs.renameSync(temporary, target);
  return catalog.stats;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--revision') {
    console.error('Usage: node scripts/import-engineering-workflows.js --revision <full-commit-sha>');
    process.exitCode = 1;
  } else {
    importCatalog(args[1]).then((stats) => console.log(JSON.stringify(stats))).catch((error) => {
      // Transport errors may include authenticated URL details. Emit a bounded,
      // non-secret diagnostic rather than a raw API response or subprocess dump.
      console.error(error.code ? `Import failed (${error.code})` : error.message);
      process.exitCode = 1;
    });
  }
}

module.exports = { WAVE_PATHS, parseSections, buildCatalog, importCatalog, sha256, normalizeText };
