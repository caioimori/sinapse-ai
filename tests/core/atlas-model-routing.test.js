/**
 * Model + Effort Routing — single-source consistency (AF-20260702 item 2.10).
 *
 * Guards the contract that killed the hand-kept drift: the executable source
 * (.sinapse-ai/data/model-routing.yaml) must (1) be valid and complete, (2) be
 * what the three atlas renderers actually render, and (3) stay consistent with
 * the law in prose (.claude/rules/token-economy.md §2/§3). If the rule and the
 * source diverge, this suite fails naming the divergent field.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const {
  getModelRouting,
  routingTableMarkdown,
  routingFlowMermaid,
} = require('../../.sinapse-ai/core/atlas/model-routing');
const { FRAMEWORK_FLOWS } = require('../../.sinapse-ai/core/atlas/flows');
const { FRAMEWORK_FLOWS_PT } = require('../../.sinapse-ai/core/atlas/flows-pt');

const RULE_PATH = path.join(__dirname, '..', '..', '.claude', 'rules', 'token-economy.md');

describe('model-routing single source (AF-20260702 item 2.10)', () => {
  const routing = getModelRouting();
  const rule = fs.readFileSync(RULE_PATH, 'utf8');

  test('source loads with valid tiers, default effort and subagent threshold', () => {
    expect(routing.tiers.length).toBeGreaterThanOrEqual(5);
    expect(routing.default_effort).toBe('xhigh');
    expect(routing.subagent_threshold.min_tool_calls).toBe(8);
    const ids = routing.tiers.map((t) => t.flow_id);
    expect(new Set(ids).size).toBe(ids.length); // mermaid node ids must be unique
  });

  test('markdown table renders every tier from the source', () => {
    const table = routingTableMarkdown();
    for (const t of routing.tiers) {
      expect(table).toContain(`| ${t.table_en} | **${t.model}** | ${t.effort} |`);
    }
  });

  test('EN model-routing flow is rendered from the source', () => {
    const flow = FRAMEWORK_FLOWS.find((f) => f.id === 'model-routing');
    expect(flow).toBeDefined();
    expect(flow.mermaid).toBe(routingFlowMermaid('en'));
    for (const t of routing.tiers) {
      expect(flow.mermaid).toContain(`${t.flow_id}[${t.flow_node_en}]`);
    }
  });

  test('PT model-routing flow is rendered from the source', () => {
    const flow = FRAMEWORK_FLOWS_PT['model-routing'];
    expect(flow).toBeDefined();
    expect(flow.mermaid).toBe(routingFlowMermaid('pt'));
    for (const t of routing.tiers) {
      expect(flow.mermaid).toContain(`${t.flow_id}[${t.flow_node_pt}]`);
    }
  });

  test('rule §2 table matches the source: same (model, effort) pairs in the same order', () => {
    // Rule rows look like: | Task label | **opus** | `xhigh` |
    const ruleRows = [...rule.matchAll(/^\|[^|]+\|\s*\*\*(opus|sonnet|haiku)\*\*\s*\|\s*`?(xhigh|max|high|medium|low)`?\s*\|/gm)].map(
      (m) => ({ model: m[1], effort: m[2] }),
    );
    const sourceRows = routing.tiers.map((t) => ({ model: t.model, effort: t.effort }));
    expect(ruleRows).toEqual(sourceRows);
  });

  test('rule §3 subagent threshold matches the source', () => {
    const n = routing.subagent_threshold.min_tool_calls;
    expect(rule).toMatch(new RegExp(`>=\\s*${n} tool calls`));
  });

  test('rule default effort matches the source', () => {
    expect(rule).toMatch(new RegExp(`Effort default \`?${routing.default_effort}\`?`));
  });
});
