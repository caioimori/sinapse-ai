'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  loadCatalog, validateCatalog, getWorkflow, readWorkflow, searchWorkflows,
} = require('../../packages/engineering-workflows/catalog');
const {
  parseSections, buildCatalog, WAVE_PATHS, sha256,
} = require('../../scripts/import-engineering-workflows');

describe('pinned engineering workflow catalog', () => {
  const catalog = loadCatalog();

  test('covers all canonical/applied workflows and domains with unique identifiers', () => {
    expect(catalog.stats).toEqual({ canonical: 275, applied: 10, domains: 60 });
    expect(new Set(catalog.workflows.map((item) => item.id)).size).toBe(285);
    expect(new Set(catalog.workflows.flatMap((item) => item.domains)).size).toBe(60);
    expect(catalog.source.revision).toMatch(/^[a-f0-9]{40}$/);
    expect(catalog.source.license).toBe('CC-BY-SA-4.0');
    expect(catalog.source.publiclyVerified).toBe(true);
  });

  test('retrieves only one full contract and preserves the final workflow of the AI wave', () => {
    const result = readWorkflow('wave-08-w27');
    expect(result.workflow.title).toContain('Routing e Parallelization');
    expect(result.markdown).toContain('```mermaid');
    expect(result.markdown).not.toContain('## W26');
    expect(result.markdown).not.toContain('## Índice');
    for (const workflow of catalog.workflows) {
      expect(readWorkflow(workflow.id).markdown).toContain('```mermaid');
    }
  });

  test('parses real master loops regardless of heading depth without counting index sections', () => {
    const markdown = '# Title\n## Índice\n- W1\n## A1 — Primeiro\n> Prosa\n```mermaid\nA-->B\n```\n# Loop mestre\n```mermaid\nC-->D\n```\n## Notas\nNo workflow';
    const result = parseSections(markdown);
    expect(result.map((item) => item.title)).toEqual(['A1 — Primeiro', 'Loop mestre']);
    expect(result[0].summary).toBe('Prosa');
    expect(markdown.slice(result[1].start, result[1].end)).not.toContain('No workflow');
    expect(() => parseSections('## W1 — Missing contract\nText')).toThrow('Mermaid');
  });

  test('rebuilds byte-identical metadata from the pinned documents offline', () => {
    const root = path.resolve(__dirname, '../../packages/engineering-workflows');
    const prefix = path.join(root, 'sources', catalog.source.revision);
    const index = JSON.parse(fs.readFileSync(path.join(prefix, 'index.json'), 'utf8'));
    const documents = WAVE_PATHS.map((relativePath) => {
      const markdown = fs.readFileSync(path.join(prefix, relativePath), 'utf8');
      return { relativePath, markdown, sha256: sha256(markdown) };
    });
    expect(buildCatalog(index, documents, catalog.source.revision)).toEqual(catalog);
    expect(catalog.sourceMetadataMismatches).toContainEqual(expect.objectContaining({ declared: 18, observed: 27 }));
    const incomplete = documents.slice();
    incomplete[7] = { ...incomplete[7], markdown: incomplete[7].markdown.replace('## W27', '## Removed27') };
    expect(() => buildCatalog(index, incomplete, catalog.source.revision)).toThrow('Count mismatch');
  });

  test('fails closed for schema, duplicate IDs, source traversal and coverage drift', () => {
    const changed = () => structuredClone(catalog);
    const schema = changed(); schema.schemaVersion = '2.0.0';
    expect(() => validateCatalog(schema)).toThrow('schema');
    const duplicate = changed(); duplicate.workflows[1].id = duplicate.workflows[0].id;
    expect(() => validateCatalog(duplicate)).toThrow('ID');
    const escaped = changed(); escaped.workflows[0].source.path = `sources/${catalog.source.revision}/../../secret`;
    expect(() => validateCatalog(escaped)).toThrow('source');
    const wrongCount = changed(); wrongCount.stats.canonical = 274;
    expect(() => validateCatalog(wrongCount)).toThrow('statistics');
    expect(() => getWorkflow('unknown')).toThrow('Unknown');
  });

  test('does not cache source integrity results across reads', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'engineering-catalog-'));
    try {
      const selected = catalog.workflows[0];
      const source = path.join(root, selected.source.path);
      fs.mkdirSync(path.dirname(source), { recursive: true });
      const original = fs.readFileSync(path.resolve(__dirname, '../../packages/engineering-workflows', selected.source.path), 'utf8');
      fs.writeFileSync(source, original);
      expect(readWorkflow(selected.id, { root, catalog }).workflow.id).toBe(selected.id);
      fs.appendFileSync(source, '\nsource drift\n');
      expect(() => readWorkflow(selected.id, { root, catalog })).toThrow('integrity mismatch');
    } finally {
      // Only this test's newly created temporary directory is removed.
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  test('routes PT-BR queries deterministically with explicit filters and no default full-corpus stuffing', () => {
    expect(searchWorkflows('acessibilidade')).toEqual(searchWorkflows('acessibilidade'));
    expect(searchWorkflows('segurança')).toEqual(searchWorkflows('seguranca'));
    expect(searchWorkflows('acessibilidade', { domain: '41' }).every((item) => item.domains.includes('41'))).toBe(true);
    expect(searchWorkflows('', { kind: 'applied', limit: 10 })).toHaveLength(10);
    expect(searchWorkflows('')).toEqual([]);
    expect(searchWorkflows('wave-08-w27')[0].id).toBe('wave-08-w27');
    expect(() => searchWorkflows('test', { limit: 0 })).toThrow('limit');
    expect(() => searchWorkflows('test', { kind: 'executable' })).toThrow('kind');
    expect(() => searchWorkflows('test', { domain: '99' })).toThrow('domain');
    expect(() => searchWorkflows(null)).toThrow('query');
  });
});
