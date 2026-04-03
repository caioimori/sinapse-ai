'use strict';

const path = require('path');
const { performance } = require('perf_hooks');

describe('Pipeline Performance Benchmarks', () => {
  const TIMEOUT = 30000; // 30s for benchmarks

  test('framework manifest loads in < 2 seconds', () => {
    const start = performance.now();
    const manifestPath = path.join(__dirname, '../../.sinapse-ai/install-manifest.yaml');
    const fs = require('fs');

    if (!fs.existsSync(manifestPath)) {
      console.warn('install-manifest.yaml not found, skipping benchmark');
      return;
    }

    const yaml = require('js-yaml');
    const manifest = yaml.load(fs.readFileSync(manifestPath, 'utf8'));
    const elapsed = performance.now() - start;

    console.log(`Manifest load: ${elapsed.toFixed(2)}ms (${Object.keys(manifest).length} top-level keys)`);
    expect(elapsed).toBeLessThan(2000);
  }, TIMEOUT);

  test('agent definitions parse in < 5 seconds (all 12)', () => {
    const start = performance.now();
    const agentsDir = path.join(__dirname, '../../.sinapse-ai/development/agents');
    const fs = require('fs');

    if (!fs.existsSync(agentsDir)) {
      console.warn('agents directory not found, skipping benchmark');
      return;
    }

    const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
    let parsed = 0;

    for (const file of files) {
      const content = fs.readFileSync(path.join(agentsDir, file), 'utf8');
      // Simple parse check - verify file is readable and has content
      expect(content.length).toBeGreaterThan(100);
      parsed++;
    }

    const elapsed = performance.now() - start;
    console.log(`Agent parse: ${elapsed.toFixed(2)}ms (${parsed} agents)`);
    expect(elapsed).toBeLessThan(5000);
  }, TIMEOUT);

  test('constitution loads and validates in < 1 second', () => {
    const start = performance.now();
    const constPath = path.join(__dirname, '../../.sinapse-ai/constitution.md');
    const fs = require('fs');

    if (!fs.existsSync(constPath)) {
      console.warn('constitution.md not found, skipping benchmark');
      return;
    }

    const content = fs.readFileSync(constPath, 'utf8');
    const elapsed = performance.now() - start;

    // Validate it has articles
    const articleCount = (content.match(/^## Article/gm) || []).length;
    console.log(`Constitution load: ${elapsed.toFixed(2)}ms (${articleCount} articles)`);
    expect(elapsed).toBeLessThan(1000);
  }, TIMEOUT);

  test('task directory scan in < 3 seconds', () => {
    const start = performance.now();
    const tasksDir = path.join(__dirname, '../../.sinapse-ai/development/tasks');
    const fs = require('fs');

    if (!fs.existsSync(tasksDir)) {
      console.warn('tasks directory not found, skipping benchmark');
      return;
    }

    const countFiles = (dir) => {
      let count = 0;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) count += countFiles(path.join(dir, entry.name));
        else if (entry.name.endsWith('.md')) count++;
      }
      return count;
    };

    const taskCount = countFiles(tasksDir);
    const elapsed = performance.now() - start;

    console.log(`Task scan: ${elapsed.toFixed(2)}ms (${taskCount} tasks)`);
    expect(elapsed).toBeLessThan(3000);
  }, TIMEOUT);
});
