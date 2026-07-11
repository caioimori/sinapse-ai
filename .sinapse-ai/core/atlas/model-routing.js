/**
 * Model + Effort Routing — loader and renderers for the single source of truth.
 *
 * Loads `.sinapse-ai/data/model-routing.yaml` (task tiers → {model, effort},
 * default effort, subagent threshold) and renders it for the three atlas
 * surfaces: the markdown table (render-markdown.js) and the EN/PT mermaid
 * flows (flows.js / flows-pt.js). Executes the deferred recommendation of
 * audit AF-20260702 item 2.10 — one executable source instead of three
 * hand-kept copies. The law in prose remains `.claude/rules/token-economy.md`
 * §2; tests/core/atlas-model-routing.test.js compares this source against the
 * rule so drift fails CI instead of passing unnoticed.
 *
 * Throws loudly if the YAML is missing or malformed: the file ships inside
 * the package, so a broken source means a broken package. (This differs
 * deliberately from atlas-data's defensive scanning of USER repos — silence
 * here would hide real breakage.)
 *
 * @module core/atlas/model-routing
 */

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const SOURCE = path.join(__dirname, '..', '..', 'data', 'model-routing.yaml');

const REQUIRED_TIER_FIELDS = [
  'flow_id',
  'model',
  'effort',
  'table_en',
  'table_pt',
  'flow_branch_en',
  'flow_branch_pt',
  'flow_node_en',
  'flow_node_pt',
];

let cached = null;

/**
 * Load and validate the routing source (cached after first read).
 * @returns {{default_effort:string, subagent_threshold:{min_tool_calls:number, rule:string}, tiers:Array<object>}}
 */
function getModelRouting() {
  if (cached) return cached;
  const raw = fs.readFileSync(SOURCE, 'utf8');
  const data = yaml.load(raw);
  if (!data || !Array.isArray(data.tiers) || data.tiers.length === 0) {
    throw new Error(`model-routing.yaml malformed: expected a non-empty "tiers" array (${SOURCE})`);
  }
  for (const tier of data.tiers) {
    for (const field of REQUIRED_TIER_FIELDS) {
      if (!tier[field]) {
        throw new Error(`model-routing.yaml tier missing field "${field}": ${JSON.stringify(tier)}`);
      }
    }
  }
  if (!data.default_effort) {
    throw new Error('model-routing.yaml missing "default_effort"');
  }
  if (!data.subagent_threshold || typeof data.subagent_threshold.min_tool_calls !== 'number') {
    throw new Error('model-routing.yaml missing "subagent_threshold.min_tool_calls" (number)');
  }
  cached = data;
  return cached;
}

/**
 * Render the routing tiers as the markdown table used by the atlas (§4).
 * @returns {string}
 */
function routingTableMarkdown() {
  const d = getModelRouting();
  const rows = d.tiers.map((t) => `| ${t.table_en} | **${t.model}** | ${t.effort} |`).join('\n');
  return `| Task | Model | Effort |\n|---|---|---|\n${rows}`;
}

/**
 * Render the routing decision flow as mermaid, in English or Portuguese.
 * @param {'en'|'pt'} lang
 * @returns {string}
 */
function routingFlowMermaid(lang) {
  const d = getModelRouting();
  const pt = lang === 'pt';
  const n = d.subagent_threshold.min_tool_calls;
  const lines = ['flowchart TD', pt ? '    T[Tarefa] --> K{Tipo?}' : '    T[Task] --> K{Kind?}'];
  for (const t of d.tiers) {
    const branch = pt ? t.flow_branch_pt : t.flow_branch_en;
    const node = pt ? t.flow_node_pt : t.flow_node_en;
    lines.push(`    K -->|${branch}| ${t.flow_id}[${node}]`);
  }
  d.tiers.forEach((t, i) => {
    const sp =
      i === 0
        ? pt
          ? `SP{>= ${n} tool calls ou fan-out real?}`
          : `SP{>= ${n} tool calls or real fan-out?}`
        : 'SP';
    lines.push(`    ${t.flow_id} --> ${sp}`);
  });
  lines.push(pt ? '    SP -->|sim| SUB[Spawna sub-agente]' : '    SP -->|yes| SUB[Spawn sub-agent]');
  lines.push(pt ? '    SP -->|não| INLINE[Roda inline]' : '    SP -->|no| INLINE[Run inline]');
  return lines.join('\n');
}

module.exports = { getModelRouting, routingTableMarkdown, routingFlowMermaid };
