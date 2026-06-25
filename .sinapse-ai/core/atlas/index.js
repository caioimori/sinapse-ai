/**
 * Atlas — generate the Framework Operating Atlas (data + LLM-readable markdown).
 *
 * One source of truth (atlas-data) → multiple renderings. This module writes:
 *   - docs/framework/atlas/atlas-data.json   (structured data; HTML dashboard + tooling consume it)
 *   - docs/framework/atlas/OPERATING-ATLAS.md (LLM-readable atlas)
 *
 * CLI-first (Article I): exposed as `sinapse atlas`.
 *
 * @module core/atlas
 */

'use strict';

const fs = require('fs');
const path = require('path');

const { buildAtlasData } = require('./atlas-data');
const { renderAtlasMarkdown } = require('./render-markdown');
const { renderAtlasHtml } = require('./render-html');

const OUT_DIR = path.join('docs', 'framework', 'atlas');

/**
 * Generate the atlas artifacts.
 * @param {object} [opts]
 * @param {string} [opts.root=process.cwd()] - Repo root.
 * @param {string} [opts.generatedAt] - ISO timestamp to stamp into outputs.
 * @param {boolean} [opts.write=true] - Write files to disk.
 * @returns {{ data: object, markdown: string, paths: {json:string, md:string} }}
 */
function generateAtlas(opts = {}) {
  const root = opts.root || process.cwd();
  const data = buildAtlasData({ root, generatedAt: opts.generatedAt || null });
  const markdown = renderAtlasMarkdown(data);
  const html = renderAtlasHtml(data);

  const outDir = path.join(root, OUT_DIR);
  const jsonPath = path.join(outDir, 'atlas-data.json');
  const mdPath = path.join(outDir, 'OPERATING-ATLAS.md');
  const htmlPath = path.join(outDir, 'atlas.html');

  if (opts.write !== false) {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
    fs.writeFileSync(mdPath, markdown);
    fs.writeFileSync(htmlPath, html);
  }

  return {
    data,
    markdown,
    html,
    paths: {
      json: path.relative(root, jsonPath),
      md: path.relative(root, mdPath),
      html: path.relative(root, htmlPath),
    },
  };
}

module.exports = { generateAtlas, buildAtlasData, renderAtlasMarkdown };
