'use strict';

const fs = require('fs');
const path = require('path');

const CLAUDE_MD_PATH = path.join(__dirname, '..', '..', '.claude', 'CLAUDE.md');

describe('CLAUDE.md Structure Validation', () => {
  let content;

  beforeAll(() => {
    content = fs.readFileSync(CLAUDE_MD_PATH, 'utf8');
  });

  test('CLAUDE.md exists and is not empty', () => {
    expect(content.length).toBeGreaterThan(100);
  });

  test('CLAUDE.md is within 4K char limit per file', () => {
    // Claude Code truncates after 4,000 chars per file
    expect(content.length).toBeLessThanOrEqual(4000);
  });

  test('CLAUDE.md contains essential sections', () => {
    // Constitution reference
    expect(content).toMatch(/Constitution/i);
    // CLI First principle
    expect(content).toMatch(/CLI First/i);
    // Agent system
    expect(content).toMatch(/@developer|@devops|@architect/);
    // Documentation-First
    expect(content).toMatch(/Documentation-First/i);
  });

  test('CLAUDE.md does not contain verbose code examples', () => {
    // Compact CLAUDE.md should not have full code blocks (token waste)
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    // Allow up to 2 small code blocks (e.g., test commands)
    expect(codeBlocks.length).toBeLessThanOrEqual(3);
  });

  test('CLAUDE.md references framework paths', () => {
    // Should reference key framework paths
    expect(content).toMatch(/\.sinapse-ai/);
  });
});
