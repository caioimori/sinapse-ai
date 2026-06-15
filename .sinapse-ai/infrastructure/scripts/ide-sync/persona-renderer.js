/**
 * Persona Renderer — shared across IDE transformers (cursor, antigravity,
 * github-copilot).
 *
 * PARIDADE-IDE-002 (audit 2026-06-11): the transformers used to emit only
 * name/title/whenToUse + a few commands — ~8% of the agent. The agent's actual
 * operating contract (role, identity, style, focus, core principles) was
 * dropped, so the IDE stub couldn't reason like the agent. This renderer pulls
 * that content from the parsed YAML and emits it as portable Markdown so every
 * IDE keeps the persona that matters. Pure data → markdown; no side effects.
 *
 * @module ide-sync/persona-renderer
 */

'use strict';

/**
 * Render the core_principles array. Each item is either a string or a
 * single-key object like { CRITICAL: '…' } (the agent YAML convention).
 * @param {Array} principles
 * @param {number} [limit=12] - Cap to keep IDE rules lean.
 * @returns {string} Markdown bullet list (empty string when none).
 */
function renderCorePrinciples(principles, limit = 12) {
  if (!Array.isArray(principles) || principles.length === 0) return '';
  const lines = [];
  for (const p of principles) {
    if (lines.length >= limit) break;
    if (typeof p === 'string') {
      if (p.trim()) lines.push(`- ${p.trim()}`);
    } else if (p && typeof p === 'object') {
      for (const [k, v] of Object.entries(p)) {
        lines.push(`- **${k}:** ${String(v).trim()}`);
      }
    }
  }
  return lines.join('\n');
}

/**
 * Render the persona block (role/identity/style/focus) + core principles for an
 * agent. Returns portable Markdown sections, or '' when the agent has no rich
 * YAML (e.g. plain-header agents) — callers keep their existing minimal output.
 *
 * @param {object} agentData - Parsed agent data (from agent-parser).
 * @param {object} [opts]
 * @param {boolean} [opts.includeCommunication=false] - Also emit tone/vocabulary.
 * @returns {string} Markdown (possibly empty).
 */
function renderPersona(agentData, opts = {}) {
  const yaml = (agentData && agentData.yaml) || {};
  const persona = yaml.persona || {};
  const profile = (agentData && agentData.persona_profile) || yaml.persona_profile || {};

  let md = '';

  const hasPersona = persona.role || persona.identity || persona.style || persona.focus;
  if (hasPersona) {
    md += '## Persona\n\n';
    if (persona.role) md += `**Role:** ${persona.role}\n\n`;
    if (persona.identity) md += `**Identity:** ${persona.identity}\n\n`;
    if (persona.style) md += `**Style:** ${persona.style}\n\n`;
    if (persona.focus) md += `**Focus:** ${persona.focus}\n\n`;
  }

  const principles = renderCorePrinciples(yaml.core_principles);
  if (principles) {
    md += `## Core Principles\n\n${principles}\n\n`;
  }

  if (opts.includeCommunication && profile.communication) {
    const c = profile.communication;
    const bits = [];
    if (c.tone) bits.push(`tone ${c.tone}`);
    if (Array.isArray(c.vocabulary) && c.vocabulary.length) {
      bits.push(`vocabulary: ${c.vocabulary.slice(0, 8).join(', ')}`);
    }
    if (bits.length) md += `## Voice\n\n${bits.join(' · ')}\n\n`;
  }

  return md;
}

/**
 * Rough persona-retention estimate (chars of rendered persona vs raw file).
 * Used by tests to assert the IDE stub keeps materially more than the old ~8%.
 * @param {object} agentData
 * @returns {number} ratio 0..1
 */
function estimateRetention(agentData) {
  const raw = (agentData && agentData.raw) || '';
  if (!raw) return 0;
  const rendered = renderPersona(agentData, { includeCommunication: true });
  return rendered.length / raw.length;
}

module.exports = { renderPersona, renderCorePrinciples, estimateRetention };
