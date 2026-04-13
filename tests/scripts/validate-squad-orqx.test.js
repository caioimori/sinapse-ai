'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  parseArgs,
  parseOrqxFormat,
  validateOrqxFile,
  summarize,
  formatReport,
} = require('../../scripts/validate-squad-orqx');

function makeTempFile(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-orqx-'));
  const filePath = path.join(dir, 'test-orqx.md');
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

describe('Story 10.28 — validate-squad-orqx', () => {
  describe('parseArgs', () => {
    it('parses --quiet and --json flags', () => {
      expect(parseArgs(['--quiet']).quiet).toBe(true);
      expect(parseArgs(['--json']).json).toBe(true);
      expect(parseArgs([]).quiet).toBe(false);
    });
  });

  describe('parseOrqxFormat — YAML block', () => {
    it('extracts agent name/id/title and persona.role from a yaml block', () => {
      const content = `# brand-orqx — Meridian

\`\`\`yaml
agent:
  name: "Meridian"
  id: "squad-brand/brand-orqx"
  title: "Brand Squad Orchestrator"
  icon: "🎯"

persona:
  role: "Brand Squad Orchestrator"
\`\`\`
`;
      const data = parseOrqxFormat(content);
      expect(data.format).toBe('yaml');
      expect(data.agent.name).toBe('Meridian');
      expect(data.agent.id).toBe('squad-brand/brand-orqx');
      expect(data.agent.title).toBe('Brand Squad Orchestrator');
      expect(data.persona.role).toBe('Brand Squad Orchestrator');
    });
  });

  describe('parseOrqxFormat — Markdown headings', () => {
    it('extracts agent identity from # Agent: heading + **ID:** marker', () => {
      const content = `# Agent: Nexus — Digital Experience Orchestrator

## Identidade
- **ID:** design-orqx
- **Nome:** Nexus
- **Squad:** squad-design

## Role
Digital Experience Orchestrator — coordinates the squad.
`;
      const data = parseOrqxFormat(content);
      expect(data.format).toBe('markdown');
      expect(data.agent.id).toBe('design-orqx');
      expect(data.agent.name).toBe('Nexus');
      expect(data.agent.title).toContain('Nexus');
      expect(data.persona.role).toContain('Digital Experience Orchestrator');
    });
  });

  describe('parseOrqxFormat — Markdown table', () => {
    it('extracts agent identity from a Markdown table', () => {
      const content = `# CM Orchestrator Agent

## Identity

| Field | Value |
|-------|-------|
| **Name** | Orion |
| **Icon** | 🧠 |
| **Agent ID** | \`@claude-orqx\` |
| **Squad** | squad-claude |

## Role

Claude Code Mastery Orchestrator routing requests.
`;
      const data = parseOrqxFormat(content);
      expect(data.format).toBe('markdown-table');
      expect(data.agent.name).toBe('Orion');
      expect(data.agent.id).toBe('claude-orqx');
      expect(data.persona.role).toContain('Claude Code Mastery');
    });
  });

  describe('parseOrqxFormat — frontmatter', () => {
    it('extracts agent identity from YAML frontmatter', () => {
      const content = `---
name: tools-orqx
description: Tools Orchestrator autonomous agent
model: opus
---

# Tools Orchestrator
`;
      const data = parseOrqxFormat(content);
      expect(data.format).toBe('frontmatter');
      expect(data.agent.id).toBe('tools-orqx');
      expect(data.agent.name).toBe('tools-orqx');
      expect(data.agent.title).toContain('Tools Orchestrator');
    });
  });

  describe('parseOrqxFormat — unrecognized', () => {
    it('returns null for plain markdown without identity markers', () => {
      const content = '# Just a heading\n\nSome random content.\n';
      expect(parseOrqxFormat(content)).toBeNull();
    });
  });

  describe('validateOrqxFile', () => {
    it('returns zero findings for a valid yaml-format file', () => {
      const filePath = makeTempFile(`# test-orqx
\`\`\`yaml
agent:
  name: "Tester"
  id: "test/test-orqx"
  title: "Test Orchestrator"

persona:
  role: "Test role"
\`\`\`
`);
      const findings = validateOrqxFile(filePath);
      // The id will mismatch the expected because the temp file is not under squads/
      // but the validation is lenient — only warns on mismatch.
      const errors = findings.filter((f) => f.level === 'error');
      expect(errors).toEqual([]);
    });

    it('returns ERROR for a file with no identity marker', () => {
      const filePath = makeTempFile('# Just a title\n\nNo identity.\n');
      const findings = validateOrqxFile(filePath);
      expect(findings.some((f) => f.level === 'error')).toBe(true);
    });

    it('returns WARN for a valid file missing persona.role', () => {
      const filePath = makeTempFile(`# Agent: Test
- **ID:** test-orqx
`);
      const findings = validateOrqxFile(filePath);
      expect(findings.some((f) => f.rule === 'persona-role' && f.level === 'warn')).toBe(true);
    });
  });

  describe('summarize', () => {
    it('counts pass/warn/error rows', () => {
      const results = [
        { findings: [] },
        { findings: [{ level: 'warn' }] },
        { findings: [{ level: 'error' }] },
      ];
      expect(summarize(results)).toEqual({ total: 3, pass: 1, warn: 1, error: 1 });
    });
  });

  describe('formatReport', () => {
    it('produces a multi-line report with PASS/WARN/ERROR tags', () => {
      const results = [
        { orqxFile: '/tmp/clean.md', findings: [] },
        { orqxFile: '/tmp/dirty.md', findings: [{ level: 'error', rule: 'x', message: 'y' }] },
      ];
      const summary = summarize(results);
      const report = formatReport(results, summary);
      expect(report).toContain('PASS');
      expect(report).toContain('ERROR');
      expect(report).toContain('Summary:');
    });
  });
});
