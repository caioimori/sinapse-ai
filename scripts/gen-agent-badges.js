#!/usr/bin/env node
'use strict';

/*
 * gen-agent-badges — regenerates the agent badge map (id -> {emoji, area, name}).
 *
 * Output: .sinapse-ai/product/templates/statusline/agent-badges.json
 *   (installed to ~/.claude/agent-badges.json by bin/lib/setup-statusline.js;
 *    read by the track-agent.cjs hook to inject the badge and by the statusline
 *    to render it).
 *
 * Deterministic. No Invention — every field is read from a real definition:
 *   - Framework (núcleo) agents: .sinapse-ai/manifests/agents.csv (id, name, icon).
 *   - Squad agents: squads/<squad>/agents/<id>.md (4 supported formats below).
 * Keys are the bare id for núcleo agents and "<squad>/<id>" for squad agents.
 * The badge name is always the FIRST word of the agent's name.
 *
 * Re-run whenever agents are added / removed / renamed, then commit the JSON +
 * `npm run generate:manifest` (the install manifest hashes the shipped file).
 */

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const SQUADS_DIR = path.join(REPO, 'squads');
const MANIFEST = path.join(REPO, '.sinapse-ai', 'manifests', 'agents.csv');
const OUT = path.join(REPO, '.sinapse-ai', 'product', 'templates', 'statusline', 'agent-badges.json');

const SQUAD_AREA = {
  'squad-brand': 'BRAND', 'squad-copy': 'COPY', 'squad-design': 'DESIGN',
  'squad-content': 'CONTENT', 'squad-growth': 'GROWTH', 'squad-paidmedia': 'ADS',
  'squad-research': 'RESEARCH', 'squad-commercial': 'VENDAS', 'squad-finance': 'FINANCE',
  'squad-cybersecurity': 'CYBER', 'squad-animations': 'MOTION', 'squad-storytelling': 'STORY',
  'squad-cloning': 'CLONE', 'squad-council': 'COUNCIL', 'squad-courses': 'COURSES',
  'squad-product': 'PRODUCT', 'claude-code-mastery': 'CLAUDE',
};
const FW_AREA = {
  'snps-orqx': 'ORQX', 'developer': 'DEV', 'architect': 'ARQ', 'data-engineer': 'DATA',
  'analyst': 'ANALISE', 'quality-gate': 'QA', 'devops': 'OPS', 'product-lead': 'PO',
  'project-lead': 'PM', 'sprint-lead': 'SM', 'ux-design-expert': 'UX', 'squad-creator': 'CREATOR',
};

const clean = (s) => s.replace(/^['"`|]+|['"`|]+$/g, '').trim();
const titleCase = (slug) => slug.split('-').filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const firstEmoji = (line) => { const m = (line || '').match(/\p{Extended_Pictographic}️?/u); return m ? m[0] : null; };

// Tries 3 formats per label: YAML (key: v), MD-list (**Label:** v), MD-table (| **Label** | v |).
function extract(text, labels) {
  for (const lbl of labels) {
    let m = text.match(new RegExp('^\\s*' + lbl + ':\\s*(.+)$', 'im'));
    if (m && clean(m[1])) return clean(m[1]);
    m = text.match(new RegExp('\\*\\*' + lbl + ':\\*\\*\\s*(.+)$', 'im'));
    if (m && clean(m[1])) return clean(m[1]);
    m = text.match(new RegExp('\\|\\s*\\*\\*' + lbl + '\\*\\*\\s*\\|\\s*([^|]+?)\\s*\\|', 'i'));
    if (m && clean(m[1])) return clean(m[1]);
  }
  return null;
}

const badges = [];

for (const line of fs.readFileSync(MANIFEST, 'utf8').split('\n')) {
  const cols = line.split(',');
  const id = (cols[0] || '').trim();
  if (!/^[a-z][a-z0-9-]*$/.test(id) || id === 'id') continue;
  const name = (cols[1] || '').trim();
  const icon = (cols[3] || '').trim();
  if (!name || !icon) continue;
  badges.push({ id, name, icon, area: FW_AREA[id] || id.toUpperCase(), squad: 'núcleo' });
}

let squadDirs = [];
try { squadDirs = fs.readdirSync(SQUADS_DIR).filter((d) => fs.statSync(path.join(SQUADS_DIR, d)).isDirectory()); } catch { /* SQUADS_DIR absent — no squads to badge */ }
for (const squad of squadDirs) {
  const dir = path.join(SQUADS_DIR, squad, 'agents');
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')); } catch { continue; }
  const area = SQUAD_AREA[squad] || squad.replace(/^squad-/, '').toUpperCase();
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    let name = extract(content, ['name', 'nome']);
    if (!name || name === slug) name = titleCase(slug); // no codename -> presentable id
    const icon = extract(content, ['icon', 'ícone', 'icone']) || firstEmoji(content.split('\n')[0]);
    badges.push({ id: `${squad}/${slug}`, name, icon, area, squad });
  }
}

// Emoji fallback: an agent with no icon inherits its squad orqx's emoji.
const squadIcon = {};
for (const b of badges) if (/-orqx$/.test(b.id) && b.icon) squadIcon[b.squad] = b.icon;
let herdados = 0;
for (const b of badges) if (!b.icon) { b.icon = squadIcon[b.squad] || '◆'; b.herdado = true; herdados++; }

// The badge uses only the FIRST name (never the full name).
for (const b of badges) b.name = b.name.split(/\s+/)[0];

const out = {};
for (const b of badges) out[b.id] = { emoji: b.icon, area: b.area, name: b.name };
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));

const generic = badges.filter((b) => b.icon === '◆').length;
console.log(`agent-badges.json written: ${badges.length} agents · emoji inherited: ${herdados} · generic ◆: ${generic}`);
console.log(`-> ${path.relative(REPO, OUT)}`);
