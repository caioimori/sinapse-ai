'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('sinapse-orqx delegation authority', () => {
  const publishedSurfaces = [
    '.sinapse-ai/development/agents/snps-orqx.md',
    '.claude/rules/agent-authority.md',
  ];

  const forbiddenAuthorityPhrases = [
    'Execute ANY task directly without delegation',
    'No restrictions on execution',
    'Universal executor of all SINAPSE capabilities without routing',
    'Execute any resource directly without persona transformation',
    'Can execute any task from any agent directly',
    'All capabilities without switching agents',
    'CAN do any task without routing to specialists',
  ];

  test.each(publishedSurfaces)(
    '%s does not grant unrestricted universal execution bypassing all specialists',
    relativePath => {
      const content = read(relativePath);

      for (const phrase of forbiddenAuthorityPhrases) {
        expect(content).not.toContain(phrase);
      }
    }
  );

  test('canonical snps-orqx agent defines routing and orchestration as its primary function', () => {
    const content = read('.sinapse-ai/development/agents/snps-orqx.md');

    // Imperator is an orchestrator, not a direct executor of domain work
    expect(content).toContain('orchestrator');
    // Must route to squads — intelligent routing is documented
    expect(content).toContain('intelligent_routing');
    // Must route to specialists
    expect(content).toContain('routing_table');
    // Delegation to squads is the primary mode
    expect(content).toContain('delegate');
  });

  test('canonical snps-orqx does not execute domain work directly', () => {
    const content = read('.sinapse-ai/development/agents/snps-orqx.md');

    // Imperator does not execute domain work — it diagnoses, routes, coordinates, synthesizes
    expect(content).toContain('You do not execute domain work yourself');
    // @devops has exclusive push authority
    expect(content).toContain('@sprint-lead');
  });

  test('agent authority rules establish exclusive domain ownership for specialist agents', () => {
    const content = read('.claude/rules/agent-authority.md');

    // @devops has exclusive git push authority
    expect(content).toContain('@devops');
    expect(content).toContain('git push');
    // @sprint-lead has exclusive story creation authority
    expect(content).toContain('@sprint-lead');
    // Escalation path exists
    expect(content).toContain('@sinapse-orqx');
  });

  test('governance evolution-pipeline.md exists and defines the framework change process', () => {
    const content = read('governance/evolution-pipeline.md');

    // Pipeline is defined
    expect(content).toContain('AuditFinding');
    expect(content).toContain('FrameworkProposal');
    // Caio Imori is sole approver
    expect(content).toContain('Caio Imori');
    expect(content).toContain('sole orchestrator approver');
    // @sinapse-orqx is the proposer
    expect(content).toContain('@sinapse-orqx');
  });

  test('audit-finding template exists and references the evolution pipeline', () => {
    const content = read('governance/templates/audit-finding-tmpl.yaml');

    expect(content).toContain('audit_finding');
    expect(content).toContain('framework_candidate');
    expect(content).toContain('governance/evolution-pipeline.md');
    // Must NOT reference external org identifiers
    expect(content).not.toContain('eliel');
    expect(content).not.toContain('Eliel');
    expect(content).not.toContain('aiox');
    expect(content).not.toContain('AIOX');
    expect(content).not.toContain('SynkraAI');
  });

  test('framework-proposal template exists with SINAPSE-branded approval fields', () => {
    const content = read('governance/templates/framework-proposal-tmpl.yaml');

    expect(content).toContain('framework_proposal');
    // Must use SINAPSE-branded field names (not eliel_decision)
    expect(content).toContain('orchestrator_decision');
    expect(content).toContain('approved_at');
    expect(content).toContain('decision_rationale');
    // Must NOT reference external org identifiers
    expect(content).not.toContain('eliel_decision');
    expect(content).not.toContain('eliel');
    expect(content).not.toContain('Eliel');
    expect(content).not.toContain('aiox');
    expect(content).not.toContain('AIOX');
    expect(content).not.toContain('SynkraAI');
  });

  test('audits/ directory structure exists with promoted/ and archived/ subdirs', () => {
    const promoted = path.join(root, 'audits', 'promoted');
    const archived = path.join(root, 'audits', 'archived');

    expect(fs.existsSync(promoted)).toBe(true);
    expect(fs.existsSync(archived)).toBe(true);
  });

  test('no sinapse-branded governance files contain AIOX/aiox/SynkraAI leak', () => {
    const governanceFiles = [
      'governance/README.md',
      'governance/evolution-pipeline.md',
      'governance/proposals/README.md',
      'governance/patterns/README.md',
      'governance/templates/audit-finding-tmpl.yaml',
      'governance/templates/framework-proposal-tmpl.yaml',
      'audits/README.md',
    ];

    const forbiddenTerms = ['AIOX', 'aiox', 'SynkraAI', 'synkraai', 'Eliel', 'eliel'];

    for (const filePath of governanceFiles) {
      const content = read(filePath);
      for (const term of forbiddenTerms) {
        expect(content).not.toContain(term);
      }
    }
  });
});
