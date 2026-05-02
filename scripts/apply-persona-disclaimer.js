#!/usr/bin/env node
/**
 * apply-persona-disclaimer.js — inject simulation notice into agent files
 *
 * @story Block 3b (pre-GA hardening), decision 1c from clinical audit dim-7
 *
 * For each persona simulating a real public figure, ensure the agent file
 * carries an in-file disclaimer block surrounded by machine-readable
 * markers (BEGIN/END PERSONA NOTICE). The mind-clone-governance hook
 * keys on the marker to enforce its presence on commits.
 *
 * Idempotent: running twice is a no-op when markers already exist.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const BEGIN_MARKER = '<!-- BEGIN PERSONA NOTICE (LICENSE §VII) -->';
const END_MARKER = '<!-- END PERSONA NOTICE -->';

// Map of agent file path → real person reference. The reference is the
// human-readable name SINAPSE uses to disambiguate. Adding a persona =
// add an entry here, ship a stub or full agent in the same commit.
const PERSONAS = [
  { file: 'squads/squad-council/agents/brene-brown.md', real: 'Brene Brown' },
  { file: 'squads/squad-council/agents/charlie-munger.md', real: 'Charlie Munger' },
  { file: 'squads/squad-council/agents/derek-sivers.md', real: 'Derek Sivers' },
  { file: 'squads/squad-council/agents/naval-ravikant.md', real: 'Naval Ravikant' },
  { file: 'squads/squad-council/agents/patrick-lencioni.md', real: 'Patrick Lencioni' },
  { file: 'squads/squad-council/agents/peter-thiel.md', real: 'Peter Thiel' },
  { file: 'squads/squad-council/agents/ray-dalio.md', real: 'Ray Dalio' },
  { file: 'squads/squad-council/agents/reid-hoffman.md', real: 'Reid Hoffman' },
  { file: 'squads/squad-council/agents/simon-sinek.md', real: 'Simon Sinek' },
  { file: 'squads/squad-council/agents/yvon-chouinard.md', real: 'Yvon Chouinard' },

  { file: 'squads/squad-storytelling/agents/blake-snyder.md', real: 'Blake Snyder' },
  { file: 'squads/squad-storytelling/agents/dan-harmon.md', real: 'Dan Harmon' },
  { file: 'squads/squad-storytelling/agents/joseph-campbell.md', real: 'Joseph Campbell' },
  { file: 'squads/squad-storytelling/agents/keith-johnstone.md', real: 'Keith Johnstone' },
  { file: 'squads/squad-storytelling/agents/kindra-hall.md', real: 'Kindra Hall' },
  { file: 'squads/squad-storytelling/agents/marshall-ganz.md', real: 'Marshall Ganz' },
  { file: 'squads/squad-storytelling/agents/nancy-duarte.md', real: 'Nancy Duarte' },
  { file: 'squads/squad-storytelling/agents/oren-klaff.md', real: 'Oren Klaff' },
  { file: 'squads/squad-storytelling/agents/park-howell.md', real: 'Park Howell' },

  { file: 'squads/squad-design/agents/brad-frost.md', real: 'Brad Frost' },
  { file: 'squads/squad-design/agents/dan-mall.md', real: 'Dan Mall' },
  { file: 'squads/squad-design/agents/dave-malouf.md', real: 'Dave Malouf' },
];

function buildNotice(realName) {
  return `${BEGIN_MARKER}
> **Persona Simulation Notice.** This agent is a simulation inspired by **${realName}**'s
> publicly available work, frameworks, and ideas. SINAPSE is **not affiliated with,
> endorsed by, sponsored by, or representing the views of ${realName}**. The simulated
> persona is provided for educational and research purposes under fair use. Output is
> language-model inference over public material — not the real person's words. See
> [\`LICENSE\`](../../../LICENSE) "Persona Simulation Notice" for the full policy and
> takedown request procedure.
${END_MARKER}`;
}

function ensureNotice(filePath, realName) {
  if (!fs.existsSync(filePath)) {
    return { status: 'missing', filePath };
  }
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(BEGIN_MARKER)) {
    return { status: 'already', filePath };
  }
  const notice = buildNotice(realName);

  let next;
  // Detect YAML frontmatter (--- ... ---) and insert AFTER the closing ---.
  const fmMatch = content.match(/^---\n[\s\S]*?\n---\n/);
  if (fmMatch) {
    const front = fmMatch[0];
    const rest = content.slice(front.length);
    next = front + '\n' + notice + '\n' + rest;
  } else {
    next = notice + '\n\n' + content;
  }

  fs.writeFileSync(filePath, next);
  return { status: 'inserted', filePath };
}

function main() {
  let inserted = 0;
  let already = 0;
  let missing = 0;

  for (const { file, real } of PERSONAS) {
    const result = ensureNotice(path.join(ROOT, file), real);
    if (result.status === 'inserted') {
      inserted += 1;
      console.log(`✏️  ${file}`);
    } else if (result.status === 'already') {
      already += 1;
    } else if (result.status === 'missing') {
      missing += 1;
      console.warn(`⚠️  ${file} (file not found)`);
    }
  }

  console.log(`\n${inserted} inserted, ${already} already had notice, ${missing} missing.`);
}

if (require.main === module) {
  main();
}

module.exports = {
  PERSONAS,
  BEGIN_MARKER,
  END_MARKER,
  buildNotice,
  ensureNotice,
};
